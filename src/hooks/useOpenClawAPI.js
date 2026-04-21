import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'openclaw-office-last-agents'
const TASKS_KEY = 'openclaw-office-tasks'
const LOG_KEY = 'openclaw-office-log'
const ACHIEVEMENTS_KEY = 'openclaw-office-achievements'

// Use API server if available, fallback to direct gateway or env
const API_URL = import.meta.env.VITE_OPENCLAW_API_URL
const GATEWAY_URL = import.meta.env.VITE_OPENCLAW_GATEWAY_URL
const GATEWAY_TOKEN = import.meta.env.VITE_OPENCLAW_GATEWAY_TOKEN

// Achievement definitions moved outside hook to avoid re-allocation
const ACHIEVEMENT_DEFS = [
  { id: 'first_task', name: 'Primo Passo', desc: 'Completa il primo task', icon: '🎯', check: (a) => a.completedTasks >= 1 },
  { id: 'speedster', name: 'Speedster', desc: 'Completa 3 task in meno di 1 ora', icon: '⚡', check: (a) => a.completedTasks >= 3 },
  { id: 'marathon', name: 'Maratoneta', desc: 'Completa 10 task', icon: '🏃', check: (a) => a.completedTasks >= 10 },
  { id: 'centurion', name: 'Centurione', desc: 'Completa 100 task', icon: '💯', check: (a) => a.completedTasks >= 100 },
  { id: 'always_online', name: 'Sempre Online', desc: 'Usa la dashboard per 1 ora', icon: '🌐', check: (startTime) => Date.now() - startTime > 3600000 },
  { id: 'task_master', name: 'Task Master', desc: 'Crea 20 task', icon: '📋', check: (_, totalTasks) => totalTasks >= 20 },
  { id: 'early_bird', name: 'Mattutino', desc: 'Usa la dashboard alle 6 del mattino', icon: '🌅', check: () => new Date().getHours() === 6 },
  { id: 'night_owl', name: 'Notturno', desc: 'Usa la dashboard dopo mezzanotte', icon: '🦉', check: () => new Date().getHours() === 0 || new Date().getHours() === 1 },
]

/**
 * Hook for managing OpenClaw agents, tasks, and activity logs.
 * Handles synchronization between local storage, internal API server, and OpenClaw Gateway.
 *
 * @returns {Object} An object containing state and methods for OpenClaw dashboard.
 * @property {Array} agents - List of active agents.
 * @property {Array} tasks - List of tasks in the Kanban board.
 * @property {Array} activityLog - Recent system activities.
 * @property {Array} achievements - Earned achievements.
 * @property {boolean} loading - Loading state for initial data fetch.
 * @property {string|null} error - Error message if any.
 * @property {boolean} isOnline - Connection status to external services.
 * @property {string} connectionMode - Current mode ('local' or 'cloud').
 * @property {Function} assignTask - Assigns a task to an agent.
 * @property {Function} createTask - Creates a new task.
 * @property {Function} updateTask - Updates task details.
 * @property {Function} deleteTask - Deletes a task.
 * @property {Function} getAgentDetails - Retrieves extended info for an agent.
 * @property {Function} retry - Retries connection to external services.
 * @property {Function} addAgent - Manually adds a local agent.
 * @property {Function} updateAgent - Updates agent details.
 * @property {Function} deleteAgent - Removes an agent.
 */
export function useOpenClawAPI() {
  const [agents, setAgents] = useState([])
  const [tasks, setTasks] = useState([])
  const [activityLog, setActivityLog] = useState([])
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(true)
  const [connectionMode, setConnectionMode] = useState('local')
  const logIdRef = useRef(0)
  const startTime = useRef(Date.now())

  const fetchFromApi = useCallback(async () => {
    if (!API_URL) return []
    const RPC_TIMEOUT_MS = 30000
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS)
      const headers = { 'Accept': 'application/json' }
      if (GATEWAY_TOKEN) headers['Authorization'] = `Bearer ${GATEWAY_TOKEN}`

      const response = await fetch(`${API_URL}/api/agents`, { headers, signal: controller.signal })
      clearTimeout(timeoutId)
      if (response.ok) {
        const data = await response.json()
        return (data || []).map(a => ({
          id: a.id || a.sessionId || Math.random().toString(36).substr(2, 9),
          name: a.name || a.sessionKey?.split(':').pop() || 'Agent',
          status: a.status || 'idle',
          task: a.task || a.currentTask || null,
          completedTasks: a.completedTasks || 0,
          type: a.type || 'local',
          channel: a.channel || 'local',
          model: a.model || null,
          sessionKey: a.sessionKey || null
        }))
      }
    } catch (e) { console.warn('API server fetch failed:', e) }
    return []
  }, [API_URL, GATEWAY_TOKEN])

  const fetchFromGateway = useCallback(async () => {
    if (!GATEWAY_URL) return []
    const RPC_TIMEOUT_MS = 30000
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS)
      const headers = { 'Accept': 'application/json' }
      if (GATEWAY_TOKEN) headers['Authorization'] = `Bearer ${GATEWAY_TOKEN}`

      const response = await fetch(`${GATEWAY_URL}/v1/models`, { headers, signal: controller.signal })
      clearTimeout(timeoutId)
      if (response.ok) {
        const body = await response.json()
        const models = body.data || []
        return models
          .filter(m => {
            const isSubAgent = m.id.includes('dreaming') || m.id.includes('sub-')
            return m.id.startsWith('openclaw') && !isSubAgent
          })
          .map(m => {
            const agentId = m.id.startsWith('openclaw/') ? m.id.split('/')[1] : m.id
            return {
              id: m.id,
              name: agentId.charAt(0).toUpperCase() + agentId.slice(1),
              status: 'idle',
              task: null,
              completedTasks: 0,
              type: 'cloud',
              channel: 'gateway',
              model: m.id
            }
          })
      }
    } catch (e) { console.warn('Gateway fetch failed:', e) }
    return []
  }, [GATEWAY_URL, GATEWAY_TOKEN])

  const fetchExternalAgents = useCallback(async () => {
    const [apiResults, gatewayResults] = await Promise.all([
      fetchFromApi(),
      fetchFromGateway()
    ])

    // Merge results, prioritizing API results for the same model ID (richer metadata)
    const merged = new Map()
    gatewayResults.forEach(a => merged.set(a.model || a.id, a))
    apiResults.forEach(a => merged.set(a.model || a.id, a))

    return Array.from(merged.values())
  }, [fetchFromApi, fetchFromGateway])


  // Load saved state from localStorage on init
  useEffect(() => {
    const savedTasks = localStorage.getItem(TASKS_KEY)
    const savedLog = localStorage.getItem(LOG_KEY)
    const savedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY)

    const initAgents = async () => {
      setLoading(true)
      try {
        const externalAgents = await fetchExternalAgents()

        if (externalAgents.length > 0) {
          setAgents(externalAgents)
          setConnectionMode('cloud')
          setIsOnline(true)
        } else {
          // Fallback to local
          const savedAgents = localStorage.getItem(STORAGE_KEY)
          const configAgents = import.meta.env.VITE_AGENTS
          let initialAgents = []
          if (savedAgents) {
            try {
              initialAgents = JSON.parse(savedAgents)
            } catch (e) {
              initialAgents = configAgents ? JSON.parse(configAgents) : []
            }
          } else {
            initialAgents = configAgents ? JSON.parse(configAgents) : []
          }

          // spec: gateway/openai-http-api#agent-first-model-contract (normalize models)
          setAgents(initialAgents.map(a => ({
            ...a,
            model: a.model ? (a.model.startsWith('openclaw/') ? a.model : `openclaw/${a.model}`) : 'openclaw/default'
          })))
          setConnectionMode('local')
          setIsOnline(false)
        }
      } finally {
        setLoading(false)
      }
    }

    initAgents()

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (e) {
        console.warn('Failed to parse saved tasks:', e)
      }
    }

    if (savedLog) {
      try {
        const parsed = JSON.parse(savedLog)
        setActivityLog(parsed)
        logIdRef.current = parsed.length > 0 ? Math.max(...parsed.map(l => l.id)) + 1 : 0
      } catch (e) {
        console.warn('Failed to parse saved log:', e)
      }
    }

    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements))
      } catch (e) {
        console.warn('Failed to parse saved achievements:', e)
      }
    }
  }, [])

  // Check for new achievements
  // Optimization: Moved from direct calls in state updaters to a centralized check
  const checkAchievements = useCallback(() => {
    const earned = []
    const totalTasksCreated = tasks.length

    ACHIEVEMENT_DEFS.forEach(def => {
      const alreadyEarned = achievements.find(a => a.id === def.id)
      if (!alreadyEarned) {
        let check = false;
        if (def.id === 'always_online') {
          check = def.check(startTime.current)
        } else if (def.id === 'task_master') {
          check = def.check(null, totalTasksCreated)
        } else {
          // Check if ANY agent meets the criteria
          check = agents.some(agent => def.check({ completedTasks: agent.completedTasks || 0 }, totalTasksCreated))
        }

        if (check) {
          earned.push({
            ...def,
            earnedAt: new Date().toISOString()
          })
        }
      }
    })

    if (earned.length > 0) {
      setAchievements(prev => {
        const updated = [...prev, ...earned]
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated))
        return updated
      })
      earned.forEach(a => addLogEntry('System', 'achievement', `🏆 Earned: ${a.name}`))
    }
  }, [agents, achievements, tasks])

  // Centralized achievement tracking
  useEffect(() => {
    checkAchievements()
  }, [agents, tasks, checkAchievements]) // Re-run whenever agents (completedTasks) or tasks (task_master) change

  // Add activity log entry
  const addLogEntry = useCallback((agentName, action, details) => {
    const entry = {
      id: logIdRef.current++,
      timestamp: new Date().toISOString(),
      agentName,
      action,
      details
    }
    setActivityLog(prev => {
      const updated = [entry, ...prev].slice(0, 50)
      localStorage.setItem(LOG_KEY, JSON.stringify(updated))
      return updated
    })
    return entry
  }, [])

  const addAgent = useCallback((agentData) => {
    // spec: gateway/openai-http-api#agent-first-model-contract (normalize models)
    const modelId = agentData.model || 'default'
    const normalizedModel = modelId.startsWith('openclaw/') ? modelId : `openclaw/${modelId}`

    const newAgent = {
      id: `agent-${Date.now()}`,
      status: 'idle',
      completedTasks: 0,
      sprite: 'claw-idle',
      ...agentData,
      model: normalizedModel
    }
    setAgents(prev => {
      const updated = [...prev, newAgent]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    addLogEntry('System', 'created_agent', newAgent.name)
    return newAgent
  }, [addLogEntry])

  const updateAgent = useCallback((agentId, updates) => {
    setAgents(prev => {
      const updated = prev.map(a => a.id === agentId ? { ...a, ...updates } : a)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const deleteAgent = useCallback((agentId) => {
    const agent = agents.find(a => a.id === agentId)
    setAgents(prev => {
      const updated = prev.filter(a => a.id !== agentId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    if (agent) addLogEntry('System', 'deleted_agent', agent.name)
  }, [agents, addLogEntry])

  const assignTask = useCallback((agentId, taskId) => {
    const agent = agents.find(a => a.id === agentId)
    const task = tasks.find(t => t.id === taskId)
    if (!agent || !task) return

    setAgents(prev => {
      const updated = prev.map(a => {
        if (a.id === agentId) {
          return { ...a, status: 'working', task: task.name, currentTaskId: taskId }
        }
        return a
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    setTasks(prev => {
      const updated = prev.map(t => t.id === taskId ? { ...t, status: 'in_progress' } : t)
      localStorage.setItem(TASKS_KEY, JSON.stringify(updated))
      return updated
    })

    addLogEntry(agent.name, 'assigned', task.name)
    
    // Simulate task completion
    setTimeout(() => {
      setAgents(prev => {
        const updated = prev.map(a => {
          if (a.id === agentId && a.currentTaskId === taskId) {
            const newCompleted = (a.completedTasks || 0) + 1
            addLogEntry(a.name, 'completed', a.task || 'Task')
            return { ...a, status: 'idle', task: null, currentTaskId: null, completedTasks: newCompleted }
          }
          return a
        })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })

      setTasks(prev => {
        const updated = prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t)
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated))
        return updated
      })
    }, Math.random() * 20000 + 5000)
  }, [agents, tasks, addLogEntry, checkAchievements])

  // Create new task
  const createTask = useCallback((name) => {
    const newTask = {
      id: Date.now(),
      name,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
    setTasks(prev => {
      const updated = [...prev, newTask]
      localStorage.setItem(TASKS_KEY, JSON.stringify(updated))
      return updated
    })
    addLogEntry('User', 'created_task', name)
    return newTask
  }, [addLogEntry, checkAchievements])

  // Update task
  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === taskId ? { ...t, ...updates } : t)
      localStorage.setItem(TASKS_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Delete task
  const deleteTask = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId)
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== taskId)
      localStorage.setItem(TASKS_KEY, JSON.stringify(updated))
      return updated
    })
    if (task) {
      addLogEntry('User', 'deleted_task', task.name)
    }
  }, [tasks, addLogEntry])

  // Get agent details
  const getAgentDetails = useCallback((agentId) => {
    const agent = agents.find(a => a.id === agentId)
    if (!agent) return null
    
    const agentLogs = activityLog.filter(l => l.agentName === agent.name)
    
    return {
      ...agent,
      history: agentLogs.slice(0, 10),
      completedTasks: agent.completedTasks || 0,
      totalTime: 'N/A'
    }
  }, [agents, activityLog])

  // Retry connection
  const retry = useCallback(async () => {
    setLoading(true)
    const externalAgents = await fetchExternalAgents()
    if (externalAgents) {
      setAgents(prev => JSON.stringify(prev) === JSON.stringify(externalAgents) ? prev : externalAgents)
      setConnectionMode('cloud')
      setIsOnline(true)
      setError(null)
    } else {
      setIsOnline(false)
      setError('Unable to connect to OpenClaw Gateway')
    }
    setLoading(false)
  }, [fetchExternalAgents])

  // Periodic polling for cloud mode
  // Optimization: Only update state if data has changed to prevent unnecessary re-renders
  useEffect(() => {
    if (connectionMode !== 'cloud') return

    const interval = setInterval(async () => {
      const externalAgents = await fetchExternalAgents()
      if (externalAgents) {
        setAgents(prev => {
          // Optimization: Referential stability for agents array
          // Only trigger re-render if the content actually changed
          if (JSON.stringify(prev) === JSON.stringify(externalAgents)) {
            return prev
          }
          return externalAgents
        })
        setIsOnline(true)
      } else {
        setIsOnline(false)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [connectionMode, fetchExternalAgents])

  return {
    agents,
    tasks,
    activityLog,
    achievements,
    loading,
    error,
    isOnline,
    connectionMode,
    assignTask,
    createTask,
    updateTask,
    deleteTask,
    getAgentDetails,
    retry,
    addLogEntry,
    checkAchievements,
    addAgent,
    updateAgent,
    deleteAgent
  }
}
