# Connecting to OpenClaw

OpenClaw Pixel Office supports three primary connection modes to discover and interact with agents. The dashboard automatically attempts to detect the best available connection on startup.

## 🔄 Connection Modes

### 1. Cloud Mode (Gateway)
The dashboard connects directly to an **OpenClaw Gateway** instance using the OpenAI-compatible HTTP API.

- **Primary Endpoint**: `/v1/models` (for agent discovery)
- **Configuration**:
  - `VITE_OPENCLAW_GATEWAY_URL`: The base URL of your gateway (e.g., `http://localhost:18789`).
  - `VITE_OPENCLAW_GATEWAY_TOKEN`: Bearer token for authentication.
- **Behavior**: The dashboard polls the gateway every 10 seconds to update agent status.

### 2. Internal API Mode
Used when the project is running with the included `api-server.js` bridge. This server reads agent session data directly from the OpenClaw filesystem.

- **Primary Endpoint**: `/api/agents`
- **Configuration**:
  - `VITE_OPENCLAW_API_URL`: URL of the internal API server (default: `http://localhost:3004`).
- **Behavior**: Provides richer metadata (session keys, precise activity timestamps) compared to the raw Gateway API.

### 3. Local Mode (Fallback)
If no Gateway or Internal API is reachable, the dashboard falls back to a local-only mode.

- **Configuration**:
  - `VITE_AGENTS`: A JSON string defining default agents.
- **Behavior**: State is persisted entirely in the browser's `localStorage`. No real-time interaction with external OpenClaw instances is possible.

---

## 🤖 Agent Discovery & Normalization

The dashboard follows the **OpenClaw Gateway Specification** for identifying and routing requests to agents.

### Agent Filtering
To maintain a clean interface, the dashboard filters out internal system agents and sub-processes. An agent is ignored if its ID contains:
- `dreaming`
- `sub-`

### Model ID Normalization
The OpenClaw Protocol requires that agent-first models use a specific naming convention.
- **Format**: `openclaw/<agentId>` or `openclaw:<agentId>`
- **Internal Logic**: The dashboard automatically prepends `openclaw/` to local model IDs if missing to ensure compatibility with Gateway routing.

---

## 🛡️ Security & CORS

When connecting to a remote Gateway, ensure the following:

1. **CORS Policy**: The Gateway must allow requests from the dashboard's origin (e.g., `http://localhost:3000`).
2. **Authentication**: If `VITE_OPENCLAW_GATEWAY_TOKEN` is provided, it is sent in the `Authorization: Bearer <token>` header for all requests.
3. **Internal API**: The `api-server.js` includes a strict CORS policy and security headers (`X-Content-Type-Options`, `Content-Security-Policy`) to protect local data.

---

## 🚧 Roadmap: WebSocket Handshake

Currently, the dashboard uses **HTTP Polling** for status updates. Implementation of the full WebSocket protocol (including the `connect.challenge` handshake) is a planned feature.

- **Current Protocol**: HTTP/1.1 REST
- **Target Protocol**: WebSocket V3 (with nonce signing)
