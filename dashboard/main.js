// Mock data for agents and tasks
const agents = [
    { id: 1, name: "Agent 1", status: "active", task: "Processing data" },
    { id: 2, name: "Agent 2", status: "idle", task: "None" },
    { id: 3, name: "Agent 3", status: "busy", task: "Running analysis" }
];

// Function to render the agent list
function renderAgents() {
    const agentList = document.getElementById('agent-list');
    agentList.innerHTML = '';
    agents.forEach(agent => {
        const agentDiv = document.createElement('div');
        agentDiv.className = 'agent-card';
        agentDiv.innerHTML = `
            <h3>${agent.name}</h3>
            <p>Status: <span class="${agent.status}">${agent.status}</span></p>
            <p>Current Task: ${agent.task}</p>
        `;
        agentList.appendChild(agentDiv);
    });
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    renderAgents();
});