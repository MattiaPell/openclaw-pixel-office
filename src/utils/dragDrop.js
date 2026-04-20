export const setupDragDrop = (taskElements, agentElements, onAssignTask) => {
  let draggedTask = null

  // Inizia il drag
  taskElements.forEach(task => {
    task.addEventListener('dragstart', (e) => {
      draggedTask = { id: e.target.dataset.id, name: e.target.textContent }
      e.dataTransfer.setData('text/plain', e.target.dataset.id)
      e.dataTransfer.effectAllowed = 'move'
      e.target.classList.add('dragging')
    })

    task.addEventListener('dragend', (e) => {
      e.target.classList.remove('dragging')
    })
  })

  // Gestione drop sugli agenti
  agentElements.forEach(agent => {
    agent.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    })

    agent.addEventListener('drop', (e) => {
      e.preventDefault()
      if (draggedTask) {
        const agentId = e.currentTarget.dataset.id
        onAssignTask(agentId, draggedTask.name)
      }
    })
  })
}