import React, { useState } from 'react'
import AgentAvatar from './AgentAvatar'
import '../styles/AgentsPage.css'

const AgentsPage = ({ agents, onAddAgent, onUpdateAgent, onDeleteAgent }) => {
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
        <h2 className="pixel-font">AGENTI</h2>
        <button className="btn-primary" onClick={handleOpenAdd}>+ AGGIUNGI AGENTE</button>
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
              <p className="agent-identity">{agent.identity || 'Nessuna identità'}</p>
              <div className="agent-info-row">
                <span className="label">Modello:</span>
                <span className="value">{agent.model || 'N/A'}</span>
              </div>
              <div className="agent-info-row">
                <span className="label">Task Completati:</span>
                <span className="value">{agent.completedTasks || 0}</span>
              </div>
            </div>
            <div className="agent-card-footer">
              <button
                className="btn-icon"
                onClick={() => handleOpenEdit(agent)}
                title="Modifica"
                aria-label="Modifica agente"
              >
                ✏️
              </button>
              <button
                className="btn-icon delete"
                onClick={() => onDeleteAgent(agent.id)}
                title="Elimina"
                aria-label="Elimina agente"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <h2 className="pixel-font">{editingAgent ? 'MODIFICA AGENTE' : 'AGGIUNGI AGENTE'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={50}
                  required
                />
              </div>
              <div className="form-group">
                <label>Identità</label>
                <input
                  type="text"
                  value={formData.identity}
                  onChange={(e) => setFormData({ ...formData, identity: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label>Modello</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  maxLength={50}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Annulla</button>
                <button type="submit" className="btn-submit">{editingAgent ? 'Salva' : 'Crea'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgentsPage
