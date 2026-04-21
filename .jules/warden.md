## 2025-05-22 - [Discovery] Missing OpenAI HTTP API Fallback and Incorrect Timeout
**Spec ref:** https://docs.openclaw.ai/gateway/openai-http-api#model-list-and-agent-routing, https://docs.openclaw.ai/gateway/protocol#client-constants
**Discovery:** The `useOpenClawAPI` hook fails to implement the `/v1/models` discovery fallback when the internal API server is unreachable, even though `VITE_OPENCLAW_GATEWAY_URL` is configured. Additionally, the request timeout is hardcoded to 5s, violating the 30s spec requirement for Gateway RPC-equivalent operations.
**Decision:** Implement the `/v1/models` fetch with support for OpenAI response framing and update the global request timeout to 30,000ms to ensure protocol compliance.

## 2025-05-22 - [Discovery] Complete Absence of WebSocket Implementation
**Spec ref:** https://docs.openclaw.ai/gateway/protocol#handshake-connect, https://docs.openclaw.ai/gateway/protocol#transport
**Discovery:** The dashboard relies exclusively on HTTP polling and OpenAI-compatible HTTP discovery. It completely lacks a WebSocket implementation, which is the primary control plane for OpenClaw. This prevents real-time event processing (e.g., status updates, log streams) and violates the requirement for an "operator" role client to use the WS Gateway Protocol.
**Decision:** Implement a full WebSocket client within `useOpenClawAPI.js` following the version 3 handshake, framing, and heartbeat specifications.
