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
    if (onAssignTask) {
      // Filtra i ref validi (escludendo eventuali buchi nell'array o null)
      const taskElements = taskRefs.current.filter(el => el !== null)
      const agentElements = document.querySelectorAll('.agent-item')

      const cleanup = setupDragDrop(taskElements, agentElements, onAssignTask)

      return () => {
        if (cleanup) cleanup()
      }
    }
  }, [onAssignTask, tasks]) // Aggiunto tasks come dipendenza per sicurezza se dovesse cambiare

  return (
    <div className="task-queue">
      <h2>TASK</h2>
      <ul>
        {tasks.map((task, index) => (
          <li
            key={task.id}
            ref={el => taskRefs.current[index] = el}
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
