import React, { memo } from 'react'
import '../styles/ActivityPage.css'

const ActivityPage = memo(({ activityLog }) => {
  return (
    <div className="activity-page">
      <div className="page-header">
        <h2 className="pixel-font">ATTIVITÀ</h2>
      </div>

      <div className="activity-container glass-panel">
        <div className="activity-list-full">
          {activityLog.length === 0 ? (
            <div className="empty-state">Nessuna attività recente</div>
          ) : (
            activityLog.map((log) => (
              <div key={log.id} className={`activity-item-full ${log.action === 'error' ? 'error' : ''}`}>
                <div className="activity-time">{new Date(log.timestamp).toLocaleTimeString()}</div>
                <div className="activity-agent">{log.agentName}</div>
                <div className="activity-action-label">{log.action}</div>
                <div className="activity-details">{log.details}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
})

export default ActivityPage
