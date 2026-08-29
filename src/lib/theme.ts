export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'qingwei-blog-assistant-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

function systemPrefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

export function getStoredThemeMode(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isThemeMode(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function persistThemeMode(mode: ThemeMode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* localStorage can be unavailable in locked-down webviews */
  }
}

export function resolveThemeMode(mode: ThemeMode): ResolvedTheme {
  if (mode === 'dark') return 'dark';
  if (mode === 'light') return 'light';
  return systemPrefersDark() ? 'dark' : 'light';
}

export function applyThemeMode(mode: ThemeMode): ResolvedTheme {
  const resolved = resolveThemeMode(mode);
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.style.colorScheme = resolved;
  return resolved;
}

export function subscribeToSystemTheme(
  onChange: () => void,
): () => void {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}
