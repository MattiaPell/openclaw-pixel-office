import React, { memo } from 'react'
import '../styles/Sidebar.css'

// Move menuItems outside component to ensure stable reference
const MENU_ITEMS = [
  { id: 'office', label: 'Office', icon: '🏢' },
  { id: 'agents', label: 'Agents', icon: '👤' },
  { id: 'tasks', label: 'Tasks', icon: '📋' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'activity', label: 'Activity', icon: '📜' },
]

/**
 * Sidebar component handles navigation.
 * Optimization: Wrapped in React.memo to prevent unnecessary re-renders when App state updates
 * but Sidebar props (activePage, setActivePage) remain unchanged.
 */
const Sidebar = memo(({ activePage, setActivePage }) => {
  return (
    <div className="sidebar-nav glass-panel">
      <div className="sidebar-logo pixel-font">
        🦾 OC
      </div>
      <nav className="sidebar-menu">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
            aria-label={item.label}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <span className="menu-icon" aria-hidden="true">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
})

export default Sidebar
