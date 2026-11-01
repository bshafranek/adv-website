/**
 * Generic localStorage read/write for any versioned settings-shaped state.
 * `defaults.schemaVersion` guards against stale/incompatible data left over
 * from an earlier shape of T - a mismatch (or any parse failure) just falls
 * back to defaults instead of crashing or returning a half-formed object.
 */
export function loadPersistedState<T extends { schemaVersion: number }>(
  key: string,
  defaults: T,
): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<T> & { schemaVersion?: number };
    if (parsed.schemaVersion !== defaults.schemaVersion) return defaults;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function savePersistedState<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full, blocked, or unavailable (e.g. private browsing) - the
    // in-memory state for this tab still works, it just won't persist.
  }
}
