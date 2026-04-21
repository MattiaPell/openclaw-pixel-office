import React, { memo } from 'react'
import { downloadJSON, downloadCSV } from '../utils/exportUtils.ts'
import '../styles/ActivityPage.css'

const ActivityPage = memo(({ activityLog }) => {
  const handleExportJSON = () => {
    downloadJSON(activityLog, 'activity-log')
  }

  const handleExportCSV = () => {
    downloadCSV(activityLog, 'activity-log')
  }

  return (
    <div className="activity-page">
      <div className="page-header">
        <h2 className="pixel-font">ATTIVITÀ</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleExportJSON}>JSON</button>
          <button className="btn-secondary" onClick={handleExportCSV}>CSV</button>
        </div>
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
