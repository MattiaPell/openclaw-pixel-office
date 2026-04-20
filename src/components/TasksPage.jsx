import React from 'react'
import '../styles/TasksPage.css'

const TasksPage = ({ tasks, agents, onAssignTask, onDeleteTask, onCreateTask }) => {
  const columns = [
    { id: 'pending', label: 'To Do', icon: '📝' },
    { id: 'in_progress', label: 'In Corso', icon: '⚡' },
    { id: 'completed', label: 'Completato', icon: '✅' },
  ]

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status)

  const handleCreateTask = () => {
    const name = prompt('Nome del task:')
    if (name) onCreateTask(name)
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h2 className="pixel-font">TASK</h2>
        <button className="btn-primary" onClick={handleCreateTask}>+ NUOVO TASK</button>
      </div>

      <div className="kanban-board">
        {columns.map(column => (
          <div key={column.id} className="kanban-column glass-panel">
            <div className="column-header">
              <span className="column-icon">{column.icon}</span>
              <h3>{column.label}</h3>
              <span className="column-count">{getTasksByStatus(column.id).length}</span>
            </div>
            <div className="column-content">
              {getTasksByStatus(column.id).map(task => (
                <div key={task.id} className="task-card glass-panel">
                  <div className="task-card-body">
                    <h4>{task.name}</h4>
                    <p className="task-date">{new Date(task.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="task-card-footer">
                    {column.id === 'pending' && agents.length > 0 && (
                      <div className="assign-dropdown">
                        <select
                          onChange={(e) => onAssignTask(e.target.value, task.id)}
                          defaultValue=""
                        >
                          <option value="" disabled>Assegna a...</option>
                          {agents.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <button className="btn-icon delete" onClick={() => onDeleteTask(task.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TasksPage
