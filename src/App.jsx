import { useOpenClawAPI } from './hooks/useOpenClawAPI'
import OfficeScene from './components/OfficeScene'
import AgentList from './components/AgentList'
import TaskQueue from './components/TaskQueue'

function App() {
  const { agents, loading, error, assignTask } = useOpenClawAPI()

  if (loading) return <div className="app">Caricamento...</div>
  if (error) return <div className="app">Errore: {error}</div>

  return (
    <div className="app">
      <h1>OpenClaw Pixel Office</h1>
      <div className="dashboard">
        <OfficeScene agents={agents} />
        <div className="sidebar">
          <AgentList agents={agents} />
          <TaskQueue onAssignTask={assignTask} />
        </div>
      </div>
    </div>
  )
}

export default App