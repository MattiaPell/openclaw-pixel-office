## 2025-05-22 - [Discovery] Missing OpenAI HTTP API Fallback and Incorrect Timeout
**Spec ref:** https://docs.openclaw.ai/gateway/openai-http-api#model-list-and-agent-routing, https://docs.openclaw.ai/gateway/protocol#client-constants
**Discovery:** The `useOpenClawAPI` hook fails to implement the `/v1/models` discovery fallback when the internal API server is unreachable, even though `VITE_OPENCLAW_GATEWAY_URL` is configured. Additionally, the request timeout is hardcoded to 5s, violating the 30s spec requirement for Gateway RPC-equivalent operations.
**Decision:** Implement the `/v1/models` fetch with support for OpenAI response framing and update the global request timeout to 30,000ms to ensure protocol compliance.
