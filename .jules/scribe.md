2025-05-14 - Documentation overhaul & UI English normalization
Area: README | .env.example | UI | Sidebar | Inline
Gap found: README was partially in Italian, lacked configuration info, had incorrect Docker ports. Missing .env.example. Sidebar, Modals, and System logs had Italian labels/messages. JSDoc missing for core hook.
Fixed: Translated README, Sidebar, all Modals (Create Task, Agents, Achievements, Settings), and System log messages to English. Added configuration table and .env.example. Corrected Docker instructions. Added JSDoc to useOpenClawAPI and dragDrop.
Coverage score: install: 100%, config: 100%, API: 50%, project structure: 85%, inline: 40%, UI translation: 100%
Next candidate: Detailed API/WebSocket documentation and further inline JSDoc coverage.

2025-05-20 - Connection Guide & Agent Normalization Docs
Area: docs/connection.md | README
Gap found: Lack of detailed documentation on connection modes (Local/API/Cloud), agent discovery filtering, and model normalization required by the OpenClaw Gateway spec.
Fixed: Created docs/connection.md with technical details on connection modes, agent filtering logic, and model ID normalization. Linked the guide from README.md.
Coverage score: install: 100%, config: 100%, API: 85%, project structure: 85%, inline: 40%, UI translation: 100%
Next candidate: Detailed API documentation for REST endpoints and further inline JSDoc coverage for components.
