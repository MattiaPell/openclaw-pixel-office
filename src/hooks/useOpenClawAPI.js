import { useState, useEffect } from 'react'

export function useOpenClawAPI() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAgents = async () => {
    try {
      // TODO: Sostituire con l'URL reale del Gateway OpenClaw
      const response = await fetch('http://gateway.openclaw:8080/api/agents')
      if (!response.ok) throw new Error('Failed to fetch agents')
      const data = await response.json()
      setAgents(data.agents || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching agents:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
    const interval = setInterval(fetchAgents, 5000) // Polling ogni 5 secondi
    return () => clearInterval(interval)
  }, [])

  const assignTask = async (agentId, taskName) => {
    try {
      const response = await fetch(`http://gateway.openclaw:8080/api/agents/${agentId}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskName })
      })
      if (!response.ok) throw new Error('Failed to assign task')
      await fetchAgents() // Refresh dopo assegnazione
    } catch (err) {
      console.error('Error assigning task:', err)
    }
  }

  return { agents, loading, error, assignTask }
}