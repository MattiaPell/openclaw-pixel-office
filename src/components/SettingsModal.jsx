import '../styles/SettingsModal.css'

export default function SettingsModal({ 
  theme, 
  onThemeChange, 
  soundEnabled, 
  onSoundChange, 
  onClose 
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <h2>⚙️ IMPOSTAZIONI</h2>

        <div className="settings-section">
          <h3>🎨 TEMA</h3>
          <div className="theme-options">
            <button 
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange('dark')}
            >
              🌙 Scuro
            </button>
            <button 
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onThemeChange('light')}
            >
              ☀️ Chiaro
            </button>
            <button 
              className={`theme-btn ${theme === 'retro' ? 'active' : ''}`}
              onClick={() => onThemeChange('retro')}
            >
              🌈 Retro
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>🔊 SUONI</h3>
          <div className="toggle-option">
            <span>Suoni 8-bit</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={soundEnabled}
                onChange={(e) => {
                  onSoundChange(e.target.checked)
                  localStorage.setItem('openclaw-sound', e.target.checked.toString())
                }}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>ℹ️ INFO</h3>
          <div className="info-item">
            <span>Versione</span>
            <span>1.0.0</span>
          </div>
          <div className="info-item">
            <span>Connessione</span>
            <span>WebSocket / Polling</span>
          </div>
        </div>
      </div>
    </div>
  )
}
