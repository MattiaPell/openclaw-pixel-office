# OpenClaw Pixel Office Dashboard

> A modern and engaging Glassmorphism-style dashboard to monitor and manage OpenClaw agents, featuring a virtual office in pixel art.

![OpenClaw Pixel Office](https://via.placeholder.com/800x400?text=OpenClaw+Pixel+Office+Modern)

## ✨ Features

### Core & UI
- 🎨 **Modern Design**: Glassmorphism aesthetic with transparencies, blurs, and dynamic gradients.
- 📂 **Multi-page Structure**: Fluid sidebar navigation between Office, Agents, Tasks, and Activity.
- 🖼️ **Virtual Pixel Art Office**: Animated scenes with agents walking, working, or resting.
- 📋 **Kanban Board**: Task management via a three-column board (To Do, In Progress, Completed).
- 👤 **Agent Management**: Full CRUD (Create, Read, Update, Delete) for agents with detailed profiles.
- 🔄 **Real-time & Local**: Support for WebSocket/Polling and offline mode with local persistence.

### Data & Feedback
- 📊 **Advanced Analytics**: Dashboard with charts for agent performance, completion rates, and model distribution.
- 📥 **Data Export**: Export activity logs and task reports in CSV or JSON format.
- 🏆 **Achievements**: Unlockable badge system based on performance.
- 🔊 **Sound Feedback**: 8-bit sound effects for an immersive experience.
- 🌗 **Dynamic Themes**: Support for Dark, Light, and Retro modes.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/MattiaPell/openclaw-pixel-office.git
cd openclaw-pixel-office

# Install dependencies
npm install

# Start development server
npm run dev
```

### Docker

Before running with Docker Compose, you must create the external network:

```bash
docker network create openclaw-net
```

Then you can start the services:

```bash
# Using Docker Compose (Recommended - includes API Server)
docker-compose up -d

# The dashboard will be available at http://localhost:3003
```

Alternatively, using npm scripts (Dashboard only):

```bash
# Build and run
npm run docker:build
npm run docker:run

# The dashboard will be available at http://localhost:3000
```

## ⚙️ Configuration

The application can be configured using environment variables. Create a `.env` file in the root directory based on `.env.example`.

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_OPENCLAW_API_URL` | No | `http://localhost:3004` | URL of the internal API server. |
| `VITE_OPENCLAW_GATEWAY_URL` | No | `http://localhost:18789` | URL of the OpenClaw Gateway. |
| `VITE_OPENCLAW_GATEWAY_TOKEN` | No | — | Bearer token for Gateway authentication. |
| `VITE_AGENTS` | No | — | Optional JSON string for default agents fallback. |

## 🛠️ Internal API Server

The project includes an `api-server.js` that acts as a bridge between the OpenClaw filesystem and the dashboard. It:
- Reads session data from `~/.openclaw/agents/main/sessions/sessions.json`.
- Exposes REST endpoints for agents and sessions.
- Handles CORS and security headers for the dashboard.

To run it locally:
```bash
node api-server.js
```

## 📁 Project Structure

```
openclaw-pixel-office/
├── src/
│   ├── components/       # React Components
│   │   ├── Sidebar.jsx          # Main navigation
│   │   ├── OfficePage.jsx       # Office view
│   │   ├── AgentsPage.jsx       # Agent management
│   │   ├── TasksPage.jsx        # Kanban board
│   │   ├── ActivityPage.jsx     # Activity logs
│   │   ├── OfficeScene.jsx      # Pixel art scene
│   │   └── ...
│   ├── hooks/
│   │   └── useOpenClawAPI.js    # API logic and state management
│   ├── utils/
│   │   ├── dragDrop.js          # Kanban drag & drop utility
│   │   └── exportUtils.ts       # CSV/JSON export utilities
│   ├── styles/
│   │   └── *.css                # Modular styles
│   ├── App.jsx
│   └── main.jsx
├── api-server.js         # Backend bridge for OpenClaw data
└── ...
```

## 🚀 Roadmap

### ✅ Implemented
- [x] **Original Dashboard Data Visualization**
- [x] **Humanoid Agent Design**: Updated pixel art style with full body.
- [x] 📊 **Advanced Analytics**: Charts for performance and model distribution.
- [x] 📥 **Data Export**: Support for CSV and JSON formats.
- [x] 🌗 **Core Themes**: Dark, Light, and Retro modes.

### 🚧 Planned
- [ ] 🌿 **New Environments**: Alternative office settings (e.g., Cyberpunk City, Enchanted Forest).
- [ ] 📱 **Mobile Optimization (PWA)**: Improved mobile interface and PWA support.
- [ ] 🔔 **Push Notifications**: Browser alerts for task completion.
- [ ] 🔑 **Multi-user & Auth**: Login system for separate offices.
- [ ] 🤖 **Multi-Provider Integration**: Support for multiple OpenClaw gateways simultaneously.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)

---

_Developed with ❤️, pixel art, and a touch of modernity_
