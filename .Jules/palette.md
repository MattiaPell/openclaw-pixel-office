## 2025-05-14 - [Accessibility: Interactive List Items]
**Learning:** In pixel art or retro-styled dashboards, list items are often just containers for text. Converting them to accessible `<button>` elements provides immediate keyboard navigation benefits and clear focus indicators without breaking the aesthetic, provided CSS is used to reset default button styles.
**Action:** Always wrap interactive list items in `<button>` or `<a>` tags and ensure they have descriptive `aria-label`s and visible focus states.
