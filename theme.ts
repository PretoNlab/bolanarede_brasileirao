export type AppTheme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'bnr_theme_preference';

export function getStoredTheme(): AppTheme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {
    console.warn('Erro ao ler preferência de tema:', e);
  }
  return 'dark'; // Padrão é Dark Mode Cinematic
}

export function applyTheme(theme: AppTheme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.warn('Erro ao salvar preferência de tema:', e);
  }

  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('theme-light');
    root.classList.remove('theme-dark');
  } else {
    root.classList.add('theme-dark');
    root.classList.remove('theme-light');
  }
}

export function initTheme(): AppTheme {
  const current = getStoredTheme();
  applyTheme(current);
  return current;
}
