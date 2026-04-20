import '../styles/OfficeScene.css'

export default function OfficeScene({ agents }) {
  return (
    <div className="office-scene">
      <div className="desk"></div>
      <div className="floor"></div>
      {agents.map(agent => (
        <div key={agent.id} className={`agent ${agent.sprite}`} style={{ left: `${agent.id * 100}px` }}>
          <div className="agent-name">{agent.name}</div>
          <div className="agent-status">{agent.status}</div>
        </div>
      ))}
    </div>
  )
}