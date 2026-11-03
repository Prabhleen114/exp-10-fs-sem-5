import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'playful-pastel' | 'clean-studio' | 'dark-obsidian';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleNextTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const stored = localStorage.getItem('omnisync_theme') as AppTheme;
      return stored && ['playful-pastel', 'clean-studio', 'dark-obsidian'].includes(stored)
        ? stored
        : 'playful-pastel';
    } catch {
      return 'playful-pastel';
    }
  });

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('omnisync_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const toggleNextTheme = () => {
    const list: AppTheme[] = ['playful-pastel', 'clean-studio', 'dark-obsidian'];
    const nextIdx = (list.indexOf(theme) + 1) % list.length;
    setTheme(list[nextIdx]);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-pastel', 'theme-studio', 'theme-obsidian', 'dark');
    if (theme === 'dark-obsidian') {
      root.classList.add('theme-obsidian', 'dark');
    } else if (theme === 'clean-studio') {
      root.classList.add('theme-studio');
    } else {
      root.classList.add('theme-pastel');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleNextTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
};
