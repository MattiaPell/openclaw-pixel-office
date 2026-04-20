import { useState } from 'react'
import OfficeScene from './components/OfficeScene'
import AgentList from './components/AgentList'
import TaskQueue from './components/TaskQueue'

function App() {
  const [agents, setAgents] = useState([
    { id: 1, name: 'Claw-1', status: 'idle', task: null, sprite: 'claw-idle' },
    { id: 2, name: 'Claw-2', status: 'working', task: 'Analisi codice', sprite: 'claw-working' }
  ])

  return (
    <div className="app">
      <h1>OpenClaw Pixel Office</h1>
      <div className="dashboard">
        <OfficeScene agents={agents} />
        <div className="sidebar">
          <AgentList agents={agents} />
          <TaskQueue />
        </div>
      </div>
    </div>
  )
}

export default App