import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'openclaw-office-last-agents'
const TASKS_KEY = 'openclaw-office-tasks'
const LOG_KEY = 'openclaw-office-log'
const ACHIEVEMENTS_KEY = 'openclaw-office-achievements'

// WebSocket configuration
const WS_RECONNECT_INTERVAL = 5000
const WS_PING_INTERVAL = 30000

export function useOpenClawAPI() {
  const [agents, setAgents] = useState([])
  const [lastAgents, setLastAgents] = useState([])
  const [tasks, setTasks] = useState([])
  const [activityLog, setActivityLog] = useState([])
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(true)
  const [connectionMode, setConnectionMode] = useState('polling') // 'websocket' | 'polling'
  const logIdRef = useRef(0)
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const pingIntervalRef = useRef(null)

  // Achievement definitions
  const ACHIEVEMENT_DEFS = [
    { id: 'first_task', name: 'Primo Passo', desc: 'Completa il primo task', icon: '🎯', check: (a) => a.completedTasks >= 1 },
    { id: 'speedster', name: 'Speedster', desc: 'Completa 3 task in meno di 1 ora', icon: '⚡', check: (a) => a.completedTasks >= 3 },
    { id: 'marathon', name: 'Maratoneta', desc: 'Completa 10 task', icon: '🏃', check: (a) => a.completedTasks >= 10 },
    { id: 'centurion', name: 'Centurione', desc: 'Completa 100 task', icon: '💯', check: (a) => a.completedTasks >= 100 },
    { id: 'always_online', name: 'Sempre Online', desc: 'Usa la dashboard per 1 ora', icon: '🌐', check: () => Date.now() - startTime > 3600000 },
  ]
  const startTime = Date.now()

  // Load saved state from localStorage on init
  useEffect(() => {
    const savedAgents = localStorage.getItem(STORAGE_KEY)
    const savedTasks = localStorage.getItem(TASKS_KEY)
    const savedLog = localStorage.getItem(LOG_KEY)
    const savedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY)

    if (savedAgents) {
      try {
        const parsed = JSON.parse(savedAgents)
        setLastAgents(parsed)
        setAgents(parsed)
      } catch (e) {
        console.warn('Failed to parse saved agents:', e)
      }
    }

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
  const checkAchievements = useCallback((agentStats) => {
    const earned = []
    ACHIEVEMENT_DEFS.forEach(def => {
      const alreadyEarned = achievements.find(a => a.id === def.id)
      if (!alreadyEarned && def.check(agentStats)) {
        earned.push({
          ...def,
          earnedAt: new Date().toISOString()
        })
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
  }, [achievements])

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
  }, [])

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    try {
      const gatewayUrl = import.meta.env.VITE_OPENCLAW_GATEWAY_URL || 'http://localhost:18789'
      const wsUrl = gatewayUrl.replace('http', 'ws') + '/ws'
      
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log('WebSocket connected')
        setConnectionMode('websocket')
        setIsOnline(true)
        clearTimeout(reconnectTimeoutRef.current)
        
        // Start ping interval
        pingIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }))
          }
        }, WS_PING_INTERVAL)
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'agents_update' && data.agents) {
            setAgents(data.agents)
            setLastAgents(data.agents)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.agents))
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e)
        }
      }

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected')
        setConnectionMode('polling')
        clearInterval(pingIntervalRef.current)
        // Attempt reconnect
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, WS_RECONNECT_INTERVAL)
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (err) {
      console.error('Failed to connect WebSocket:', err)
      setConnectionMode('polling')
    }
  }, [])

  // Fallback polling
  const fetchAgents = useCallback(async () => {
    try {
      const gatewayUrl = import.meta.env.VITE_OPENCLAW_GATEWAY_URL || 'http://localhost:18789'
      const response = await fetch(`${gatewayUrl}/api/agents`)
      if (!response.ok) throw new Error('Failed to fetch agents')
      const data = await response.json()
      const newAgents = data.agents || []
      
      // Detect changes for activity log
      newAgents.forEach(newAgent => {
        const oldAgent = agents.find(a => a.id === newAgent.id)
        if (oldAgent) {
          if (oldAgent.status !== newAgent.status && newAgent.status === 'working') {
            addLogEntry(newAgent.name, 'started', newAgent.task || 'Nuovo task')
          } else if (oldAgent.status !== newAgent.status && newAgent.status === 'idle' && oldAgent.status === 'working') {
            addLogEntry(newAgent.name, 'completed', oldAgent.task || 'Task completato')
            // Check achievements after completion
            checkAchievements({ completedTasks: 1 }) // Simplified check
          }
        }
      })

      setAgents(newAgents)
      setLastAgents(newAgents)
      setIsOnline(true)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgents))
      setError(null)
    } catch (err) {
      console.error('Error fetching agents:', err)
      setError(err.message)
      setIsOnline(false)
      if (lastAgents.length > 0 && agents.length === 0) {
        setAgents(lastAgents)
      }
    } finally {
      setLoading(false)
    }
  }, [agents, lastAgents, addLogEntry, checkAchievements])

  useEffect(() => {
    // Try WebSocket first, fallback to polling
    connectWebSocket()
    
    const pollingInterval = setInterval(() => {
      if (connectionMode === 'polling') {
        fetchAgents()
      }
    }, 5000)

    return () => {
      clearInterval(pollingInterval)
      clearTimeout(reconnectTimeoutRef.current)
      clearInterval(pingIntervalRef.current)
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connectWebSocket, fetchAgents, connectionMode])

  const assignTask = useCallback(async (agentId, taskName) => {
    try {
      const gatewayUrl = import.meta.env.VITE_OPENCLAW_GATEWAY_URL || 'http://localhost:18789'
      const response = await fetch(`${gatewayUrl}/api/agents/${agentId}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskName })
      })
      if (!response.ok) throw new Error('Failed to assign task')
      
      const agent = agents.find(a => a.id === agentId)
      if (agent) {
        addLogEntry(agent.name, 'assigned', taskName)
      }
      
      await fetchAgents()
    } catch (err) {
      console.error('Error assigning task:', err)
      addLogEntry('Sistema', 'error', `Errore assegnazione: ${err.message}`)
      throw err
    }
  }, [agents, fetchAgents, addLogEntry])

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
    addLogEntry('Utente', 'created_task', name)
    return newTask
  }, [addLogEntry])

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
      completedTasks: agentLogs.filter(l => l.action === 'completed').length,
      totalTime: 'N/A'
    }
  }, [agents, activityLog])

  // Retry connection
  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    if (wsRef.current) {
      wsRef.current.close()
    }
    connectWebSocket()
    fetchAgents()
  }, [connectWebSocket, fetchAgents])

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
    checkAchievements
  }
}
