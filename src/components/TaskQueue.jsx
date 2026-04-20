import { useState, useEffect, useRef } from 'react'
import { setupDragDrop } from '../utils/dragDrop'
import '../styles/TaskQueue.css'

export default function TaskQueue({ onAssignTask }) {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Analisi codice Swift' },
    { id: 2, name: 'Deploy Docker' },
    { id: 3, name: 'Backup NAS' }
  ])
  const taskRefs = useRef([])

  useEffect(() => {
    if (taskRefs.current.length > 0 && onAssignTask) {
      const taskElements = taskRefs.current
      const agentElements = document.querySelectorAll('.agent-item')
      setupDragDrop(taskElements, agentElements, onAssignTask)
    }
  }, [onAssignTask])

  return (
    <div className="task-queue">
      <h2>TASK</h2>
      <ul>
        {tasks.map(task => (
          <li
            key={task.id}
            ref={el => taskRefs.current[task.id] = el}
            className="task-item"
            draggable="true"
            data-id={task.id}
          >
            {task.name}
          </li>
        ))}
      </ul>
    </div>
  )
}