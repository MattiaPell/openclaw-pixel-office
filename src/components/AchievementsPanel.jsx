import '../styles/AchievementsPanel.css'

const ALL_ACHIEVEMENTS = [
  { id: 'first_task', name: 'Primo Passo', desc: 'Completa il primo task', icon: '🎯', check: () => false },
  { id: 'speedster', name: 'Speedster', desc: 'Completa 3 task in meno di 1 ora', icon: '⚡', check: () => false },
  { id: 'marathon', name: 'Maratoneta', desc: 'Completa 10 task', icon: '🏃', check: () => false },
  { id: 'centurion', name: 'Centurione', desc: 'Completa 100 task', icon: '💯', check: () => false },
  { id: 'always_online', name: 'Sempre Online', desc: 'Usa la dashboard per 1 ora', icon: '🌐', check: () => false },
  { id: 'early_bird', name: 'Mattutino', desc: 'Usa la dashboard alle 6 del mattino', icon: '🌅', check: () => false },
  { id: 'night_owl', name: 'Notturno', desc: 'Usa la dashboard dopo mezzanotte', icon: '🦉', check: () => false },
  { id: 'task_master', name: 'Task Master', desc: 'Crea 50 task', icon: '📋', check: () => false },
]

export default function AchievementsPanel({ achievements, onClose }) {
  const earnedIds = achievements.map(a => a.id)
  const earnedCount = earnedIds.length
  const totalCount = ALL_ACHIEVEMENTS.length

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content achievements-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="achievements-header">
          <h2>🏆 ACHIEVEMENTS</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">{earnedCount} / {totalCount}</span>
        </div>

        <div className="achievements-grid">
          {ALL_ACHIEVEMENTS.map(achievement => {
            const earned = achievements.find(a => a.id === achievement.id)
            return (
              <div 
                key={achievement.id} 
                className={`achievement-card ${earned ? 'earned' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h3>{achievement.name}</h3>
                  <p>{achievement.desc}</p>
                </div>
                {earned && (
                  <div className="earned-badge">✓</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
