import React from 'react'
import '../styles/AgentAvatar.css'

const AgentAvatar = ({ status, size = 'medium' }) => {
  return (
    <div className={`agent-avatar agent-humanoid ${status} size-${size}`}>
      <div className="agent-body-container">
        <div className="agent-head">
          <div className="eyes"></div>
        </div>
        <div className="agent-torso">
          <div className="arm arm-l"></div>
          <div className="arm arm-r"></div>
        </div>
        <div className="legs">
          <div className="leg leg-l"></div>
          <div className="leg leg-r"></div>
        </div>
      </div>
    </div>
  )
}

export default AgentAvatar
