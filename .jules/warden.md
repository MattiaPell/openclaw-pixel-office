## 2025-05-22 - [Discovery] Missing OpenAI HTTP API Fallback and Incorrect Timeout
**Spec ref:** https://docs.openclaw.ai/gateway/openai-http-api#model-list-and-agent-routing, https://docs.openclaw.ai/gateway/protocol#client-constants
**Discovery:** The `useOpenClawAPI` hook fails to implement the `/v1/models` discovery fallback when the internal API server is unreachable, even though `VITE_OPENCLAW_GATEWAY_URL` is configured. Additionally, the request timeout is hardcoded to 5s, violating the 30s spec requirement for Gateway RPC-equivalent operations.
**Decision:** Implement the `/v1/models` fetch with support for OpenAI response framing and update the global request timeout to 30,000ms to ensure protocol compliance.

## 2026-04-21 - [Compliance] Incorrect Agent-Model Mapping and Missing Auth Headers
**Spec ref:** https://docs.openclaw.ai/gateway/openai-http-api#agent-first-model-contract, https://docs.openclaw.ai/gateway/protocol#auth
**Discovery:** The internal API server was omitting the mandatory `openclaw/` prefix for model IDs and missing `Authorization` CORS headers. The dashboard was also failing to pass bearer tokens to the API server and incorrectly mapping Gateway models in cloud mode.
**Decision:** Updated the API server to correctly prefix models and allow `Authorization` headers. Enhanced `useOpenClawAPI` to inject bearer tokens and strictly follow the Agent-first model contract by using the full `openclaw/<agentId>` model ID.
