import '../styles/AgentList.css'

export default function AgentList({ agents, onAgentClick }) {
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
            <button
              className="agent-button"
              onClick={() => onAgentClick && onAgentClick(agent)}
              aria-label={`Visualizza dettagli per ${agent.name}`}
            >
              <span className="agent-name">{agent.name}</span>
              <span className="agent-task">{agent.task || 'Nessun task'}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}