# Sentinel Journal 🛡️

This journal tracks critical security learnings discovered during the protection of the OpenClaw Pixel Office codebase.

## 2025-05-15 - Content Security Policy (CSP) Flexibility
**Vulnerability:** Initial implementation of CSP hardcoded specific localhost ports in `connect-src`.
**Learning:** Hardcoding environment-specific details (like local development ports) in a CSP meta tag breaks the application in production or alternative environments.
**Prevention:** Use more flexible directives like `connect-src *` or `'self'` when the exact API gateway URL is configurable via environment variables and not known at build time for the HTML template.

## 2025-05-15 - Information Disclosure in Error Messages
**Vulnerability:** Raw exception messages from `fetch` were being passed directly to the UI.
**Learning:** Exposing internal error details can leak information about the backend architecture or network topology.
**Prevention:** Always catch errors and replace them with generic, user-friendly messages before displaying them in the frontend.

## 2026-04-21 - API Server Hardening
**Vulnerability:** The local API server lacked standard security headers and accepted all HTTP methods.
**Learning:** Even internal or local-only API servers should implement defense-in-depth measures like CSP, X-Frame-Options, and strict method validation to prevent cross-site leaks or unexpected state modifications if the server is exposed or targeted via CSRF/XSS.
**Prevention:** Implement a standard set of security headers for all responses and strictly validate allowed HTTP methods.
