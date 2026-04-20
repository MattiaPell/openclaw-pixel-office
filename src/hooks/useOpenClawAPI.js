import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'openclaw-office-last-agents'
const TASKS_KEY = 'openclaw-office-tasks'
const LOG_KEY = 'openclaw-office-log'
const ACHIEVEMENTS_KEY = 'openclaw-office-achievements'

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

  const GATEWAY_URL = import.meta.env.VITE_OPENCLAW_GATEWAY_URL

  const fetchExternalAgents = useCallback(async () => {
    if (!GATEWAY_URL) return null
    try {
      const response = await fetch(`${GATEWAY_URL}/agents`, { signal: AbortController.timeout?.(5000) })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      return data.map(a => ({
        id: a.id || a.name,
        name: a.name,
        status: a.status || 'idle',
        task: a.current_task || null,
        completedTasks: a.completed_tasks || 0,
        sprite: a.status === 'working' ? 'claw-working' : 'claw-idle'
      }))
    } catch (e) {
      console.error('Failed to fetch external agents:', e)
      return null
    }
  }, [GATEWAY_URL])

  // Achievement definitions
  const ACHIEVEMENT_DEFS = [
    { id: 'first_task', name: 'Primo Passo', desc: 'Completa il primo task', icon: '🎯', check: (a) => a.completedTasks >= 1 },
    { id: 'speedster', name: 'Speedster', desc: 'Completa 3 task in meno di 1 ora', icon: '⚡', check: (a) => a.completedTasks >= 3 },
    { id: 'marathon', name: 'Maratoneta', desc: 'Completa 10 task', icon: '🏃', check: (a) => a.completedTasks >= 10 },
    { id: 'centurion', name: 'Centurione', desc: 'Completa 100 task', icon: '💯', check: (a) => a.completedTasks >= 100 },
    { id: 'always_online', name: 'Sempre Online', desc: 'Usa la dashboard per 1 ora', icon: '🌐', check: () => Date.now() - startTime.current > 3600000 },
    { id: 'task_master', name: 'Task Master', desc: 'Crea 20 task', icon: '📋', check: (_, totalTasks) => totalTasks >= 20 },
    { id: 'early_bird', name: 'Mattutino', desc: 'Usa la dashboard alle 6 del mattino', icon: '🌅', check: () => new Date().getHours() === 6 },
    { id: 'night_owl', name: 'Notturno', desc: 'Usa la dashboard dopo mezzanotte', icon: '🦉', check: () => new Date().getHours() === 0 || new Date().getHours() === 1 },
  ]

  // Load saved state from localStorage on init
  useEffect(() => {
    const savedTasks = localStorage.getItem(TASKS_KEY)
    const savedLog = localStorage.getItem(LOG_KEY)
    const savedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY)

    const initAgents = async () => {
      setLoading(true)
      const externalAgents = await fetchExternalAgents()

      if (externalAgents) {
        setAgents(externalAgents)
        setConnectionMode('cloud')
        setIsOnline(true)
      } else {
        // Fallback to local
        const savedAgents = localStorage.getItem(STORAGE_KEY)
        const configAgents = import.meta.env.VITE_AGENTS
        if (savedAgents) {
          try {
            setAgents(JSON.parse(savedAgents))
          } catch (e) {
            setAgents(configAgents ? JSON.parse(configAgents) : [])
          }
        } else {
          setAgents(configAgents ? JSON.parse(configAgents) : [])
        }
        setConnectionMode('local')
        setIsOnline(false)
      }
      setLoading(false)
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

    setLoading(false)
    setIsOnline(true)
  }, [])

  // Check for new achievements
  const checkAchievements = useCallback((agentId) => {
    const earned = []
    const agent = agents.find(a => a.id === agentId)
    const completedCount = agent ? (agent.completedTasks || 0) : 0
    const totalTasksCreated = tasks.length

    ACHIEVEMENT_DEFS.forEach(def => {
      const alreadyEarned = achievements.find(a => a.id === def.id)
      if (!alreadyEarned) {
        const check = def.id === 'task_master' 
          ? def.check(null, totalTasksCreated)
          : def.check({ completedTasks: completedCount }, totalTasksCreated)
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
      earned.forEach(a => addLogEntry('Sistema', 'achievement', `🏆 Ottenuto: ${a.name}`))
    }
  }, [agents, achievements, tasks])

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
    const newAgent = {
      id: `agent-${Date.now()}`,
      status: 'idle',
      completedTasks: 0,
      sprite: 'claw-idle',
      ...agentData
    }
    setAgents(prev => {
      const updated = [...prev, newAgent]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
    addLogEntry('Sistema', 'created_agent', newAgent.name)
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
    if (agent) addLogEntry('Sistema', 'deleted_agent', agent.name)
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
            checkAchievements(agentId)
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
      checkAchievements(null)
      return updated
    })
    addLogEntry('Utente', 'created_task', name)
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
      addLogEntry('Utente', 'deleted_task', task.name)
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
      setAgents(externalAgents)
      setConnectionMode('cloud')
      setIsOnline(true)
      setError(null)
    } else {
      setIsOnline(false)
      setError('Impossibile connettersi al Gateway OpenClaw')
    }
    setLoading(false)
  }, [fetchExternalAgents])

  // Periodic polling for cloud mode
  useEffect(() => {
    if (connectionMode !== 'cloud') return

    const interval = setInterval(async () => {
      const externalAgents = await fetchExternalAgents()
      if (externalAgents) {
        setAgents(externalAgents)
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
