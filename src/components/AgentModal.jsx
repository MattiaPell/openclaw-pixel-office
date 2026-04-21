import AgentAvatar from './AgentAvatar'
import '../styles/AgentModal.css'

export default function AgentModal({ agent, onClose }) {
  if (!agent) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'idle': return '#FFAA00'
      case 'working': return '#00FF00'
      case 'walking': return '#5555FF'
      default: return '#FFFFFF'
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Chiudi">✕</button>
        
        <div className="agent-header">
          <AgentAvatar status={agent.status} size="large" id={agent.id} />
          <div className="agent-info">
            <h2>{agent.name}</h2>
            <span 
              className="agent-status-badge"
              style={{ backgroundColor: getStatusColor(agent.status) }}
            >
              {agent.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="agent-stats">
          <div className="stat">
            <span className="stat-label">TASK COMPLETATI</span>
            <span className="stat-value">{agent.completedTasks}</span>
          </div>
          <div className="stat">
            <span className="stat-label">TASK ATTUALE</span>
            <span className="stat-value">{agent.task || 'Nessuno'}</span>
          </div>
        </div>

        <div className="agent-history">
          <h3>CRONOLOGIA</h3>
          <div className="history-list">
            {agent.history && agent.history.length > 0 ? (
              agent.history.map(entry => (
                <div key={entry.id} className={`history-entry ${entry.action}`}>
                  <span className="history-icon">
                    {entry.action === 'completed' ? '✅' : 
                     entry.action === 'started' ? '▶️' : 
                     entry.action === 'assigned' ? '📋' : '💬'}
                  </span>
                  <span className="history-action">{entry.details}</span>
                  <span className="history-time">
                    {new Date(entry.timestamp).toLocaleTimeString('it-IT', { 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                  </span>
                </div>
              ))
            ) : (
              <div className="history-empty">Nessuna cronologia disponibile</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
