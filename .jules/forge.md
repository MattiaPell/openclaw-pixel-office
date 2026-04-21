## 2025-05-15 - [Dashboard Language and Charting]
**Discovery:** The codebase uses a mix of English and Italian for UI labels (e.g., 'Office' vs 'Agenti'). Also, it avoids external charting libraries, favoring pure CSS and SVG for data visualization.
**Impact:** Future features should maintain this bilingual pattern and use lightweight SVG implementations for any new data visualizations to remain consistent with the 'Glassmorphism' aesthetic without adding bloat.

## 2025-05-15 - [JSX vs TypeScript]
**Discovery:** Although Forge instructions mention writing TypeScript, the existing codebase is entirely in JavaScript/JSX.
**Impact:** To ensure build stability and follow existing conventions, I implemented the new feature in JSX. Future contributors should check the file extensions of the core components before deciding on the language.
