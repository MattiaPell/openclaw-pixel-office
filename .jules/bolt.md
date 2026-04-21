## 2025-05-15 - [O(N^2) State Processing & Memory Leaks]
**Learning:** Found an $O(N^2)$ pattern in agent state processing during polling. Using a Map for lookups reduces this to $O(N)$. Also identified a critical memory leak in `TaskQueue.jsx` where DOM event listeners were not being cleaned up, leading to exponential listener growth over time as polling updates triggered the effect.
**Action:** Always return cleanup functions from `useEffect` when manually managing DOM listeners. Use Maps for entity lookups when processing large arrays in state hooks.

## 2025-05-16 - [Cascading Re-renders in Global Layout Components]
**Learning:** Global layout components like `Sidebar` that receive props from a high-level state provider (e.g., `App.jsx`) can trigger unnecessary re-renders across the entire app lifecycle if not memoized. Even if props are stable, any state change in the parent (like polling or theme toggling) forces a re-render of all unmemoized children.
**Action:** Always wrap top-level layout components in `React.memo` and ensure that passed-down props are either stable (primitives, or stabilized via `useCallback`/`useMemo`) or moved outside the component if they are constants.
