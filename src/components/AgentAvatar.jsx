import React from 'react'
import '../styles/AgentAvatar.css'

const AgentAvatar = ({ status, size = 'medium' }) => {
  return (
    <div className={`agent-avatar agent-humanoid ${status} size-${size}`}>
      <div className="agent-body-container">
        <div className="agent-head">
          <div className="agent-hair"></div>
          <div className="eyes"></div>
          <div className="mouth"></div>
        </div>
        <div className="agent-torso">
          <div className="arm arm-l">
            <div className="hand"></div>
          </div>
          <div className="arm arm-r">
            <div className="hand"></div>
          </div>
        </div>
        <div className="legs">
          <div className="leg leg-l">
            <div className="foot"></div>
          </div>
          <div className="leg leg-r">
            <div className="foot"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentAvatar
