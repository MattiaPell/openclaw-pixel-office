import { useOpenClawAPI } from './hooks/useOpenClawAPI'
import OfficeScene from './components/OfficeScene'
import AgentList from './components/AgentList'
import TaskQueue from './components/TaskQueue'
import ActivityLog from './components/ActivityLog'
import AgentModal from './components/AgentModal'
import CreateTaskModal from './components/CreateTaskModal'
import { useState } from 'react'

function App() {
  const {
    agents,
    tasks,
    activityLog,
    loading,
    error,
    isOnline,
    assignTask,
    createTask,
    deleteTask,
    getAgentDetails,
    retry
  } = useOpenClawAPI()

  const [selectedAgent, setSelectedAgent] = useState(null)
  const [showCreateTask, setShowCreateTask] = useState(false)

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-text">CARICAMENTO...</div>
        <div className="loading-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>OPENCLAW PIXEL OFFICE</h1>
        <div className="status-bar">
          <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
          </span>
          {!isOnline && (
            <button className="retry-btn" onClick={retry}>
              RIPROVA
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="error-banner">
          ⚠️ Error: {error}
        </div>
      )}

      <div className="dashboard">
        <OfficeScene 
          agents={agents} 
          onAgentClick={(agent) => setSelectedAgent(getAgentDetails(agent.id))}
        />
        <div className="sidebar">
          <div className="sidebar-top">
            <AgentList 
              agents={agents} 
              onAgentClick={(agent) => setSelectedAgent(getAgentDetails(agent.id))}
            />
            <button className="create-task-btn" onClick={() => setShowCreateTask(true)}>
              + NUOVO TASK
            </button>
            <TaskQueue 
              tasks={tasks}
              agents={agents}
              onAssignTask={assignTask}
              onDeleteTask={deleteTask}
            />
          </div>
          <ActivityLog log={activityLog} />
        </div>
      </div>

      {selectedAgent && (
        <AgentModal 
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {showCreateTask && (
        <CreateTaskModal
          onSubmit={(name) => {
            createTask(name)
            setShowCreateTask(false)
          }}
          onClose={() => setShowCreateTask(false)}
        />
      )}
    </div>
  )
}

export default App
