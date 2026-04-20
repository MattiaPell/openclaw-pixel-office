## 2025-05-15 - [O(N^2) State Processing & Memory Leaks]
**Learning:** Found an $O(N^2)$ pattern in agent state processing during polling. Using a Map for lookups reduces this to $O(N)$. Also identified a critical memory leak in `TaskQueue.jsx` where DOM event listeners were not being cleaned up, leading to exponential listener growth over time as polling updates triggered the effect.
**Action:** Always return cleanup functions from `useEffect` when manually managing DOM listeners. Use Maps for entity lookups when processing large arrays in state hooks.
