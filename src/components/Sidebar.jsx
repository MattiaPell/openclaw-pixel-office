import React from 'react'
import '../styles/Sidebar.css'

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'office', label: 'Office', icon: '🏢' },
    { id: 'agents', label: 'Agenti', icon: '👤' },
    { id: 'tasks', label: 'Task', icon: '📋' },
    { id: 'activity', label: 'Attività', icon: '📜' },
  ]

  return (
    <div className="sidebar-nav glass-panel">
      <div className="sidebar-logo pixel-font">
        🦾 OC
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
