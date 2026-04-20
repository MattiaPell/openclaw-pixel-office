import { useState, useEffect, useRef } from 'react'
import { setupDragDrop } from '../utils/dragDrop'
import '../styles/TaskQueue.css'

export default function TaskQueue({ tasks = [], agents = [], onAssignTask, onDeleteTask }) {
  const taskRefs = useRef({})
  const [draggedTask, setDraggedTask] = useState(null)

  useEffect(() => {
    if (taskRefs.current && agents.length > 0) {
      const taskElements = Object.values(taskRefs.current).filter(Boolean)
      const agentElements = document.querySelectorAll('.agent-item')
      setupDragDrop(taskElements, agentElements, onAssignTask)
    }
  }, [tasks, agents, onAssignTask])

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.setData('text/plain', task.id.toString())
    e.dataTransfer.effectAllowed = 'move'
    e.target.classList.add('dragging')
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging')
    setDraggedTask(null)
  }

  return (
    <div className="task-queue">
      <h2>📋 TASK</h2>
      <ul>
        {tasks.length === 0 ? (
          <li className="task-empty">Nessun task - Clicca + per crearne uno</li>
        ) : (
          tasks.map(task => (
            <li
              key={task.id}
              ref={el => taskRefs.current[task.id] = el}
              className="task-item"
              draggable="true"
              data-id={task.id}
              onDragStart={(e) => handleDragStart(e, task)}
              onDragEnd={handleDragEnd}
            >
              <span className="task-name">{task.name}</span>
              <button 
                className="task-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteTask && onDeleteTask(task.id)
                }}
                title="Elimina task"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
      <p className="task-hint">Trascina un task su un agente per assegnarlo</p>
    </div>
  )
}
