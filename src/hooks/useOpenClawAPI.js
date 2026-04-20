import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'openclaw-office-last-agents'
const TASKS_KEY = 'openclaw-office-tasks'
const LOG_KEY = 'openclaw-office-log'

export function useOpenClawAPI() {
  const [agents, setAgents] = useState([])
  const [lastAgents, setLastAgents] = useState([])
  const [tasks, setTasks] = useState([])
  const [activityLog, setActivityLog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(true)
  const logIdRef = useRef(0)

  // Load saved state from localStorage on init
  useEffect(() => {
    const savedAgents = localStorage.getItem(STORAGE_KEY)
    const savedTasks = localStorage.getItem(TASKS_KEY)
    const savedLog = localStorage.getItem(LOG_KEY)

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
  }, [])

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
      const updated = [entry, ...prev].slice(0, 50) // Keep last 50 entries
      localStorage.setItem(LOG_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const fetchAgents = useCallback(async () => {
    try {
      const gatewayUrl = import.meta.env.VITE_OPENCLAW_GATEWAY_URL || 'http://localhost:8080'
      const response = await fetch(`${gatewayUrl}/api/agents`)
      if (!response.ok) throw new Error('Failed to fetch agents')
      const data = await response.json()
      const newAgents = data.agents || []
      
      // Create a map for faster lookup (O(N) instead of O(N^2) in the loop)
      const oldAgentsMap = new Map(agents.map(a => [a.id, a]))

      // Detect changes for activity log
      newAgents.forEach(newAgent => {
        const oldAgent = oldAgentsMap.get(newAgent.id)
        if (oldAgent) {
          if (oldAgent.status !== newAgent.status && newAgent.status === 'working') {
            addLogEntry(newAgent.name, 'started', newAgent.task || 'Nuovo task')
          } else if (oldAgent.status !== newAgent.status && newAgent.status === 'idle' && oldAgent.status === 'working') {
            addLogEntry(newAgent.name, 'completed', oldAgent.task || 'Task completato')
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
      setError('Failed to fetch agents data. Please try again later.')
      setIsOnline(false)
      // Fallback to last known agents (don't overwrite)
      if (lastAgents.length > 0 && agents.length === 0) {
        setAgents(lastAgents)
      }
    } finally {
      setLoading(false)
    }
  }, [agents, lastAgents, addLogEntry])

  useEffect(() => {
    fetchAgents()
    const interval = setInterval(fetchAgents, 5000) // Polling every 5 seconds
    return () => clearInterval(interval)
  }, [fetchAgents])

  const assignTask = useCallback(async (agentId, taskName) => {
    try {
      const gatewayUrl = import.meta.env.VITE_OPENCLAW_GATEWAY_URL || 'http://localhost:8080'
      const response = await fetch(`${gatewayUrl}/api/agents/${agentId}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskName })
      })
      if (!response.ok) throw new Error('Failed to assign task')
      
      // Optimistic update for UI
      const agent = agents.find(a => a.id === agentId)
      if (agent) {
        addLogEntry(agent.name, 'assigned', taskName)
      }
      
      await fetchAgents()
    } catch (err) {
      console.error('Error assigning task:', err)
      addLogEntry(`System`, 'error', `Error occurred while assigning the task.`)
      throw new Error('Error occurred while assigning the task.')
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
    
    // Get tasks for this agent from log
    const agentLogs = activityLog.filter(l => l.agentName === agent.name)
    
    return {
      ...agent,
      history: agentLogs.slice(0, 10),
      completedTasks: agentLogs.filter(l => l.action === 'completed').length,
      totalTime: 'N/A' // Would need backend tracking
    }
  }, [agents, activityLog])

  // Retry connection
  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchAgents()
  }, [fetchAgents])

  return {
    agents,
    tasks,
    activityLog,
    loading,
    error,
    isOnline,
    assignTask,
    createTask,
    updateTask,
    deleteTask,
    getAgentDetails,
    retry,
    addLogEntry
  }
}
