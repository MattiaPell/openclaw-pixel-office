import React, { useState, memo } from 'react'
import AgentAvatar from './AgentAvatar'
import '../styles/AgentsPage.css'

const AgentsPage = memo(({ agents, onAddAgent, onUpdateAgent, onDeleteAgent }) => {
  const [showModal, setShowModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [formData, setFormData] = useState({ name: '', identity: '', model: '' })

  const handleOpenAdd = () => {
    setEditingAgent(null)
    setFormData({ name: '', identity: '', model: '' })
    setShowModal(true)
  }

  const handleOpenEdit = (agent) => {
    setEditingAgent(agent)
    setFormData({ name: agent.name, identity: agent.identity || '', model: agent.model || '' })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingAgent) {
      onUpdateAgent(editingAgent.id, formData)
    } else {
      onAddAgent(formData)
    }
    setShowModal(false)
  }

  return (
    <div className="agents-page">
      <div className="page-header">
        <h2 className="pixel-font">AGENTS</h2>
        <button className="btn-primary" onClick={handleOpenAdd}>+ ADD AGENT</button>
      </div>

      <div className="agents-grid">
        {agents.map(agent => (
          <div key={agent.id} className="agent-card glass-panel">
            <div className="agent-card-header">
              <div className="agent-avatar-large">
                <AgentAvatar status={agent.status} size="large" id={agent.id} />
              </div>
              <div className="agent-status-pill" data-status={agent.status}>
                {agent.status}
              </div>
            </div>
            <div className="agent-card-body">
              <h3>{agent.name}</h3>
              <p className="agent-identity">{agent.identity || 'No identity'}</p>
              <div className="agent-info-row">
                <span className="label">Model:</span>
                <span className="value">{agent.model || 'N/A'}</span>
              </div>
              <div className="agent-info-row">
                <span className="label">Completed Tasks:</span>
                <span className="value">{agent.completedTasks || 0}</span>
              </div>
            </div>
            <div className="agent-card-footer">
              <button
                className="btn-icon"
                onClick={() => handleOpenEdit(agent)}
                title="Edit"
                aria-label="Edit agent"
              >
                ✏️
              </button>
              <button
                className="btn-icon delete"
                onClick={() => onDeleteAgent(agent.id)}
                title="Delete"
                aria-label="Delete agent"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content glass-panel"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="agent-modal-title"
          >
            <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">✕</button>
            <h2 className="pixel-font" id="agent-modal-title">{editingAgent ? 'EDIT AGENT' : 'ADD AGENT'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="agent-name">Name</label>
                <input
                  id="agent-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={50}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="agent-identity">Identity</label>
                <input
                  id="agent-identity"
                  type="text"
                  value={formData.identity}
                  onChange={(e) => setFormData({ ...formData, identity: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label htmlFor="agent-model">Model</label>
                <input
                  id="agent-model"
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  maxLength={50}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">{editingAgent ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
})

export default AgentsPage
