import '../styles/AchievementsPanel.css'

const ALL_ACHIEVEMENTS = [
  { id: 'first_task', name: 'First Step', desc: 'Complete the first task', icon: '🎯', check: () => false },
  { id: 'speedster', name: 'Speedster', desc: 'Complete 3 tasks in less than 1 hour', icon: '⚡', check: () => false },
  { id: 'marathon', name: 'Marathoner', desc: 'Complete 10 tasks', icon: '🏃', check: () => false },
  { id: 'centurion', name: 'Centurion', desc: 'Complete 100 tasks', icon: '💯', check: () => false },
  { id: 'always_online', name: 'Always Online', desc: 'Use the dashboard for 1 hour', icon: '🌐', check: () => false },
  { id: 'early_bird', name: 'Early Bird', desc: 'Use the dashboard at 6 AM', icon: '🌅', check: () => false },
  { id: 'night_owl', name: 'Night Owl', desc: 'Use the dashboard after midnight', icon: '🦉', check: () => false },
  { id: 'task_master', name: 'Task Master', desc: 'Create 50 tasks', icon: '📋', check: () => false },
]

export default function AchievementsPanel({ achievements, onClose }) {
  const earnedIds = achievements.map(a => a.id)
  const earnedCount = earnedIds.length
  const totalCount = ALL_ACHIEVEMENTS.length

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content achievements-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        
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
