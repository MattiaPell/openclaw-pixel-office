import { useState, useEffect, useCallback } from 'react'
import { useOpenClawAPI } from './hooks/useOpenClawAPI'
import OfficeScene from './components/OfficeScene'
import AgentList from './components/AgentList'
import TaskQueue from './components/TaskQueue'
import ActivityLog from './components/ActivityLog'
import AgentModal from './components/AgentModal'
import CreateTaskModal from './components/CreateTaskModal'
import AchievementsPanel from './components/AchievementsPanel'
import SettingsModal from './components/SettingsModal'

function App() {
  const {
    agents,
    tasks,
    activityLog,
    achievements,
    loading,
    error,
    isOnline,
    connectionMode,
    assignTask,
    createTask,
    deleteTask,
    getAgentDetails,
    retry
  } = useOpenClawAPI()

  const [selectedAgent, setSelectedAgent] = useState(null)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Load preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('openclaw-theme')
    const savedSound = localStorage.getItem('openclaw-sound')
    if (savedTheme) setTheme(savedTheme)
    if (savedSound !== null) setSoundEnabled(savedSound === 'true')
  }, [])

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('openclaw-theme', theme)
  }, [theme])

  // Sound effects
  const playSound = useCallback((soundType) => {
    if (!soundEnabled) return
    
    // Create audio context for 8-bit sounds
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      switch (soundType) {
        case 'complete':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime) // C5
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1) // E5
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2) // G5
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
          break
        case 'assign':
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
          oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.05) // C#5
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.15)
          break
        case 'achievement':
          oscillator.type = 'square'
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime) // C5
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2)
          oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.3) // C6
          gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.5)
          break
      }
    } catch (e) {
      console.warn('Audio not supported:', e)
    }
  }, [soundEnabled])

  // Play sound on activity log changes
  useEffect(() => {
    if (activityLog.length > 0) {
      const lastAction = activityLog[0].action
      if (lastAction === 'completed') playSound('complete')
      else if (lastAction === 'assigned') playSound('assign')
      else if (lastAction === 'achievement') playSound('achievement')
    }
  }, [activityLog, playSound])

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-text">CARICAMENTO...</div>
        <div className="loading-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`app theme-${theme}`}>
      <header className="header">
        <h1>🦾 OPENCLAW PIXEL OFFICE</h1>
        <div className="status-bar">
          <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
          </span>
          <span className="mode-badge">📁 LOCALE</span>
          {!isOnline && (
            <button className="retry-btn" onClick={retry}>
              RIPROVA
            </button>
          )}
          <button 
            className="icon-btn" 
            onClick={() => setShowAchievements(true)}
            title="Achievements"
          >
            🏆
            {achievements.length > 0 && (
              <span className="badge">{achievements.length}</span>
            )}
          </button>
          <button 
            className="icon-btn" 
            onClick={() => setShowSettings(true)}
            title="Impostazioni"
          >
            ⚙️
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          ⚠️ Errore: {error}
        </div>
      )}

      <div className="dashboard">
        <OfficeScene 
          agents={agents} 
          onAgentClick={(agent) => setSelectedAgent(getAgentDetails(agent.id))}
        />
        <div className="sidebar">
          <div className="sidebar-top">
            <AgentList 
              agents={agents} 
              onAgentClick={(agent) => setSelectedAgent(getAgentDetails(agent.id))}
            />
            <button className="create-task-btn" onClick={() => setShowCreateTask(true)}>
              + NUOVO TASK
            </button>
            <TaskQueue 
              tasks={tasks}
              agents={agents}
              onAssignTask={assignTask}
              onDeleteTask={deleteTask}
            />
          </div>
          <ActivityLog log={activityLog} />
        </div>
      </div>

      {selectedAgent && (
        <AgentModal 
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {showCreateTask && (
        <CreateTaskModal
          onSubmit={(name) => {
            createTask(name)
            setShowCreateTask(false)
          }}
          onClose={() => setShowCreateTask(false)}
        />
      )}

      {showAchievements && (
        <AchievementsPanel 
          achievements={achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          theme={theme}
          onThemeChange={setTheme}
          soundEnabled={soundEnabled}
          onSoundChange={setSoundEnabled}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
