import React, { memo, useMemo } from 'react'
import '../styles/AgentAvatar.css'

// Move constants outside component to avoid redundant hook overhead and share references
const HOODIE_COLORS = ['#334155', '#475569', '#1e293b', '#374151', '#1f2937', '#44337a', '#285e61', '#744210', '#22543d']
const HAIR_COLORS = ['#1a1a1a', '#451a03', '#27272a', '#3f3f46', '#2c1e14', '#4b3621']

const AgentAvatar = memo(({ status, size = 'medium', colorSeed = 0, id = '' }) => {
  // Use id as fallback for colorSeed to ensure visual consistency across different views
  const effectiveSeed = useMemo(() =>
    colorSeed !== 0 ? colorSeed : (id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0)
  , [colorSeed, id]);

  const hoodieColor = HOODIE_COLORS[effectiveSeed % HOODIE_COLORS.length]
  const hairColor = HAIR_COLORS[effectiveSeed % HAIR_COLORS.length]

  return (
    <div
      className={`agent-avatar agent-humanoid ${status} size-${size}`}
      style={{
        '--hoodie-color': hoodieColor,
        '--hair-color': hairColor
      }}
    >
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
})

export default AgentAvatar
