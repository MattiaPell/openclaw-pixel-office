import React from 'react'
import OfficeScene from './OfficeScene'
import '../styles/OfficePage.css'

const OfficePage = ({ agents, onAgentClick }) => {
  return (
    <div className="office-page">
      <div className="page-header">
        <h2 className="pixel-font">OFFICE</h2>
      </div>
      <div className="office-container glass-panel">
        <OfficeScene agents={agents} onAgentClick={onAgentClick} />
      </div>
    </div>
  )
}

export default OfficePage
