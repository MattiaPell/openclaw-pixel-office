import '../styles/AgentList.css'

export default function AgentList({ agents }) {
  return (
    <div className="agent-list">
      <h2>AGENTI</h2>
      <ul>
        {agents.map(agent => (
          <li
            key={agent.id}
            className={`agent-item ${agent.status}`}
            data-id={agent.id}
          >
            <span className="agent-name">{agent.name}</span>
            <span className="agent-task">{agent.task || 'Nessun task'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}