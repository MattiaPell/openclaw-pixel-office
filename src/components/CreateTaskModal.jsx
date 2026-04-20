import { useState } from 'react'
import '../styles/AgentModal.css'

export default function CreateTaskModal({ onSubmit, onClose }) {
  const [taskName, setTaskName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskName.trim()) {
      onSubmit(taskName.trim())
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content task-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <h2>CREA NUOVO TASK</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="taskName">Nome del task</label>
            <input
              id="taskName"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Es. Analisi codice Swift"
              autoFocus
              maxLength={100}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              ANNULLA
            </button>
            <button type="submit" className="btn-submit" disabled={!taskName.trim()}>
              CREA
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
