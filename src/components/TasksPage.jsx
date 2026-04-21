import React, { useState, memo, useMemo } from 'react'
import CreateTaskModal from './CreateTaskModal'
import { downloadJSON, downloadCSV } from '../utils/exportUtils.ts'
import '../styles/TasksPage.css'

const TasksPage = memo(({ tasks, agents, onAssignTask, onDeleteTask, onCreateTask }) => {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const columns = [
    { id: 'pending', label: 'To Do', icon: '📝' },
    { id: 'in_progress', label: 'In Progress', icon: '⚡' },
    { id: 'completed', label: 'Completed', icon: '✅' },
  ]

  // Optimize task grouping: Single pass O(N) instead of multiple filters
  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {});
  }, [tasks]);

  const getTasksByStatus = (status) => groupedTasks[status] || [];

  const handleCreateTask = (name) => {
    onCreateTask(name)
    setShowCreateModal(false)
  }

  const handleExportJSON = () => {
    downloadJSON(tasks, 'tasks')
  }

  const handleExportCSV = () => {
    downloadCSV(tasks, 'tasks')
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h2 className="pixel-font">TASKS</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleExportJSON}>JSON</button>
          <button className="btn-secondary" onClick={handleExportCSV}>CSV</button>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>+ NEW TASK</button>
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onSubmit={handleCreateTask}
          onClose={() => setShowCreateModal(false)}
        />
      )}

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
                          <option value="" disabled>Assign to...</option>
                          {agents.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <button
                      className="btn-icon delete"
                      onClick={() => onDeleteTask(task.id)}
                      aria-label="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default TasksPage
