import { memo, useState, useEffect, useMemo } from 'react'
import AgentAvatar from './AgentAvatar'
import '../styles/OfficeScene.css'

const OfficeScene = memo(function OfficeScene({ agents, onAgentClick }) {
  const [time, setTime] = useState(new Date())
  const [debugMode, setDebugMode] = useState(null) // 'day' | 'night' | null

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const { isNight, hourRotation, minRotation } = useMemo(() => {
    const hours = time.getHours()
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()

    const effectiveIsNight = debugMode
      ? debugMode === 'night'
      : (hours >= 19 || hours < 7)

    return {
      isNight: effectiveIsNight,
      hourRotation: (hours % 12) * 30 + minutes * 0.5,
      minRotation: minutes * 6 + seconds * 0.1
    }
  }, [time, debugMode])

  return (
    <div
      className={`office-scene ${isNight ? 'is-night' : 'is-day'}`}
      style={{
        '--hour-rotation': `${hourRotation}deg`,
        '--min-rotation': `${minRotation}deg`
      }}
    >
      {/* PIXEL: Debug Menu */}
      <div className="office-debug-menu">
        <button
          className={`debug-btn ${debugMode === 'day' ? 'active' : ''}`}
          onClick={() => setDebugMode('day')}
        >☀️</button>
        <button
          className={`debug-btn ${debugMode === 'night' ? 'active' : ''}`}
          onClick={() => setDebugMode('night')}
        >🌙</button>
        <button
          className={`debug-btn ${!debugMode ? 'active' : ''}`}
          onClick={() => setDebugMode(null)}
        >🕒</button>
      </div>

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
            title={`${agent.name} - ${agent.status}`}
          >
            <AgentAvatar status={agent.status} colorSeed={index} id={agent.id} />
            <div className="agent-label">
              <span className="agent-name">{agent.name}</span>
              <span className="agent-task">{agent.task || 'Inattivo'}</span>
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
