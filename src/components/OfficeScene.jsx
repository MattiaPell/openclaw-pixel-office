import { memo } from 'react'
import AgentAvatar from './AgentAvatar'
import '../styles/OfficeScene.css'

const OfficeScene = memo(function OfficeScene({ agents, onAgentClick }) {
  return (
    <div className="office-scene">
      {/* Office background elements */}
      <div className="office-bg">
        <div className="wall"></div>
        <div className="floor"></div>
        <div className="window"></div>
        <div className="plant plant-left"></div>
        <div className="plant plant-right"></div>
        <div className="clock"></div>
      </div>

      {/* Desks */}
      <div className="desks">
        {[1, 2, 3].map(i => (
          <div key={i} className="desk">
            <div className="computer">
              <div className="monitor"></div>
              <div className="keyboard"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Agents */}
      <div className="agents-container">
        {agents.map((agent, index) => (
          <div 
            key={agent.id} 
            className={`agent ${agent.status}`}
            style={{ left: `${100 + index * 180}px` }}
            onClick={() => onAgentClick && onAgentClick(agent)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onAgentClick && onAgentClick(agent)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Agent ${agent.name}, status: ${agent.status}${agent.task ? `, task: ${agent.task}` : ''}`}
          >
            <AgentAvatar status={agent.status} colorSeed={index} id={agent.id} />
            <div className="agent-label">
              <span className="agent-name">{agent.name}</span>
              <span className="agent-task">{agent.task || 'Inactive'}</span>
            </div>
            {agent.status === 'working' && (
              <div className="work-indicator">⚡</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})

export default OfficeScene
