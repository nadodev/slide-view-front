/**
 * @fileoverview Store para gerenciamento de tema
 * Suporta light, dark e system (auto)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================
// TYPES
// ============================================

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeStoreState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Internal
  _updateResolvedTheme: () => void;
}

// ============================================
// HELPERS
// ============================================

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: ResolvedTheme) => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
  
  // Atualiza meta theme-color para mobile
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }
};

// ============================================
// STORE
// ============================================

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'dark',

      setTheme: (theme) => {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
        applyTheme(resolvedTheme);
        set({ theme, resolvedTheme });
      },

      toggleTheme: () => {
        const { theme } = get();
        const nextTheme: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        get().setTheme(nextTheme);
      },

      _updateResolvedTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          const resolvedTheme = getSystemTheme();
          applyTheme(resolvedTheme);
          set({ resolvedTheme });
        }
      },
    }),
    {
      name: 'slide-theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrate: () => {
        return (state) => {
          if (state) {
            // Aplica tema ao carregar
            const resolvedTheme = state.theme === 'system' ? getSystemTheme() : state.theme;
            applyTheme(resolvedTheme);
            state.resolvedTheme = resolvedTheme;
          }
        };
      },
    }
  )
);

// ============================================
// SYSTEM THEME LISTENER
// ============================================

if (typeof window !== 'undefined') {
  // Escuta mudanças no tema do sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    useThemeStore.getState()._updateResolvedTheme();
  });
  
  // Aplica tema inicial
  const state = useThemeStore.getState();
  const resolvedTheme = state.theme === 'system' ? getSystemTheme() : state.theme;
  applyTheme(resolvedTheme);
}

// ============================================
// HOOK UTILITÁRIO
// ============================================

export const useTheme = () => {
  const theme = useThemeStore((s) => s.theme);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  
  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
  };
};

