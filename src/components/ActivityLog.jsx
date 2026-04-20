import { useState, memo } from 'react'
import '../styles/ActivityLog.css'

const ActivityLog = memo(function ActivityLog({ log }) {
  const [expanded, setExpanded] = useState(true)

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'started': return '▶️'
      case 'completed': return '✅'
      case 'assigned': return '📋'
      case 'error': return '❌'
      case 'created_task': return '🆕'
      case 'deleted_task': return '🗑️'
      default: return '💬'
    }
  }

  return (
    <div className={`activity-log ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="log-header" onClick={() => setExpanded(!expanded)}>
        <span>📜 ATTIVITÀ</span>
        <span className="toggle">{expanded ? '▼' : '▶'}</span>
      </div>
      {expanded && (
        <div className="log-entries">
          {log.length === 0 ? (
            <div className="log-empty">Nessuna attività recente</div>
          ) : (
            log.map(entry => (
              <div key={entry.id} className={`log-entry ${entry.action}`}>
                <span className="log-time">{formatTime(entry.timestamp)}</span>
                <span className="log-icon">{getActionIcon(entry.action)}</span>
                <span className="log-agent">{entry.agentName}</span>
                <span className="log-details">{entry.details}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
})

export default ActivityLog
