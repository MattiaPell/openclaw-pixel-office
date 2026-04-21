import { useState, useEffect, useCallback, useMemo } from 'react'
import { useOpenClawAPI } from './hooks/useOpenClawAPI'
import Sidebar from './components/Sidebar'
import OfficePage from './components/OfficePage'
import AgentsPage from './components/AgentsPage'
import TasksPage from './components/TasksPage'
import AnalyticsPage from './components/AnalyticsPage'
import ActivityPage from './components/ActivityPage'
import AgentModal from './components/AgentModal'
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
    assignTask,
    createTask,
    deleteTask,
    getAgentDetails,
    retry,
    addAgent,
    updateAgent,
    deleteAgent
  } = useOpenClawAPI()

  const [activePage, setActivePage] = useState('office')
  const [selectedAgentId, setSelectedAgentId] = useState(null)
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
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      switch (soundType) {
        case 'complete':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
          break
        case 'assign':
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.05)
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.15)
          break
        case 'achievement':
          oscillator.type = 'square'
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2)
          oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.3)
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

  useEffect(() => {
    if (activityLog.length > 0) {
      const lastAction = activityLog[0].action
      if (lastAction === 'completed') playSound('complete')
      else if (lastAction === 'assigned') playSound('assign')
      else if (lastAction === 'achievement') playSound('achievement')
    }
  }, [activityLog, playSound])

  // Stabilize callbacks to prevent unnecessary re-renders of memoized components
  const handleAgentClick = useCallback((agent) => {
    setSelectedAgentId(agent.id)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedAgentId(null)
  }, [])

  // Memoize selected agent details to avoid redundant calculations
  const selectedAgentDetails = useMemo(() => {
    return selectedAgentId ? getAgentDetails(selectedAgentId) : null
  }, [selectedAgentId, getAgentDetails])

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-text pixel-font">CARICAMENTO...</div>
      </div>
    )
  }

  const renderPage = () => {
    switch (activePage) {
      case 'office':
        return <OfficePage agents={agents} onAgentClick={handleAgentClick} />
      case 'agents':
        return <AgentsPage agents={agents} onAddAgent={addAgent} onUpdateAgent={updateAgent} onDeleteAgent={deleteAgent} />
      case 'tasks':
        return <TasksPage tasks={tasks} agents={agents} onAssignTask={assignTask} onDeleteTask={deleteTask} onCreateTask={createTask} />
      case 'analytics':
        return <AnalyticsPage agents={agents} tasks={tasks} activityLog={activityLog} />
      case 'activity':
        return <ActivityPage activityLog={activityLog} />
      default:
        return <OfficePage agents={agents} />
    }
  }

  return (
    <div className={`app theme-${theme}`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        <header className="header glass-panel">
          <div className="header-left">
            <h1 className="pixel-font">🦾 OPENCLAW DASHBOARD</h1>
            <span className={`status-pill ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <div className="status-bar">
            <span className="mode-badge">MODALITÀ LOCALE</span>
            {!isOnline && (
              <button className="retry-btn" onClick={retry}>
                RIPROVA
              </button>
            )}
            <div className="header-actions">
              <button className="action-pill" onClick={() => setShowAchievements(true)}>
                <span className="icon">🏆</span>
                <span className="label">Achievements</span>
                {achievements.length > 0 && <span className="pill-badge">{achievements.length}</span>}
              </button>
              <button className="action-pill" onClick={() => setShowSettings(true)}>
                <span className="icon">⚙️</span>
                <span className="label">Impostazioni</span>
              </button>
            </div>
          </div>
        </header>

        {error && <div className="error-banner">⚠️ Errore: {error}</div>}

        <div className="page-content">
          {renderPage()}
        </div>
      </main>

      {selectedAgentDetails && <AgentModal agent={selectedAgentDetails} onClose={handleCloseModal} />}
      {showAchievements && <AchievementsPanel achievements={achievements} onClose={() => setShowAchievements(false)} />}
      {showSettings && <SettingsModal theme={theme} onThemeChange={setTheme} soundEnabled={soundEnabled} onSoundChange={setSoundEnabled} onClose={() => setShowSettings(false)} />}
    </div>
  )
}

export default App
