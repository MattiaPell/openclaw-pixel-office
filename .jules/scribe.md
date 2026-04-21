2025-05-14 - Documentation overhaul & UI English normalization
Area: README | .env.example | UI | Sidebar | Inline
Gap found: README was partially in Italian, lacked configuration info, had incorrect Docker ports. Missing .env.example. Sidebar, Modals, and System logs had Italian labels/messages. JSDoc missing for core hook.
Fixed: Translated README, Sidebar, all Modals (Create Task, Agents, Achievements, Settings), and System log messages to English. Added configuration table and .env.example. Corrected Docker instructions. Added JSDoc to useOpenClawAPI and dragDrop.
Coverage score: install: 100%, config: 100%, API: 50%, project structure: 85%, inline: 40%, UI translation: 100%
Next candidate: Detailed API/WebSocket documentation and further inline JSDoc coverage.
