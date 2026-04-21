/**
 * Utility to set up native drag and drop listeners for Kanban board tasks and agents.
 *
 * @param {NodeList|Array} taskElements - DOM elements representing draggable tasks.
 * @param {NodeList|Array} agentElements - DOM elements representing drop targets.
 * @param {Function} onAssignTask - Callback when a task is dropped on an agent (agentId, taskId).
 * @returns {Function} Cleanup function to remove event listeners.
 */
export const setupDragDrop = (taskElements, agentElements, onAssignTask) => {
  let draggedTask = null

  const handleDragStart = (e) => {
    draggedTask = { id: e.target.dataset.id, name: e.target.textContent }
    e.dataTransfer.setData('text/plain', e.target.dataset.id)
    e.dataTransfer.effectAllowed = 'move'
    e.target.classList.add('dragging')
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (draggedTask) {
      const agentId = e.currentTarget.dataset.id
      onAssignTask(agentId, draggedTask.name)
    }
  }

  // Aggiungi listener
  taskElements.forEach(task => {
    if (task) {
      task.addEventListener('dragstart', handleDragStart)
      task.addEventListener('dragend', handleDragEnd)
    }
  })

  agentElements.forEach(agent => {
    if (agent) {
      agent.addEventListener('dragover', handleDragOver)
      agent.addEventListener('drop', handleDrop)
    }
  })

  // Ritorna funzione di cleanup
  return () => {
    taskElements.forEach(task => {
      if (task) {
        task.removeEventListener('dragstart', handleDragStart)
        task.removeEventListener('dragend', handleDragEnd)
      }
    })

    agentElements.forEach(agent => {
      if (agent) {
        agent.removeEventListener('dragover', handleDragOver)
        agent.removeEventListener('drop', handleDrop)
      }
    })
  }
}
