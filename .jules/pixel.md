## Pixel's Journal

2024-04-21 - Initial Audit
Area: both
Before: Level 2 Environment (basic tiles, flat shapes), Level 5 Characters (humanoid div-based sprites with basic animations).
After: Initial state documented.
Next candidate: Environment Level 4/5 (Furniture shading & room depth).
Known constraints: Uses CSS-only humanoids, not the PNG sprites in public/sprites/.

2024-04-21 - Office Environment Polish
Area: environment
Before: Level 2 Environment - Flat shapes for desks/monitors, basic grid floor, no depth or grounding.
After: Level 5 Environment - Pixel-art shading on desks/monitors, parquet floor pattern with baseboard, grounding drop shadows for agents, and atmospheric light rays from the window. Fixed all raw hexes to variables and removed plant rounded corners in favor of a pixelated clip-path.
Next candidate: Environment Level 7 (Ambient animation: flickering monitors, swaying plants).
Known constraints: Clip-path used for light rays and plants requires modern browser support; grounding shadows use `filter: drop-shadow`.
