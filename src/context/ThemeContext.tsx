import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface ThemeSettings {
  primary: string;
  secondary: string;
  background: string;
  textHeadings: string;
  textBody: string;
  button: string;
  buttonHover: string;
}

export const DEFAULT_THEME: ThemeSettings = {
  primary: '#8C5B6E',
  secondary: '#F4D9CE',
  background: '#FAF6F0',
  textHeadings: '#3E2A32',
  textBody: '#75626A',
  button: '#8C5B6E',
  buttonHover: '#6F4455',
};

export function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export function applyThemeToDom(theme: ThemeSettings) {
  const root = document.documentElement;
  if (isValidHex(theme.primary)) {
    root.style.setProperty('--color-primary', theme.primary);
  }
  if (isValidHex(theme.secondary)) {
    root.style.setProperty('--color-secondary', theme.secondary);
  }
  if (isValidHex(theme.background)) {
    root.style.setProperty('--color-bg', theme.background);
  }
  if (isValidHex(theme.textHeadings)) {
    root.style.setProperty('--color-text', theme.textHeadings);
  }
  if (isValidHex(theme.textBody)) {
    root.style.setProperty('--color-muted', theme.textBody);
  }
  if (isValidHex(theme.button)) {
    root.style.setProperty('--color-btn', theme.button);
  }
  if (isValidHex(theme.buttonHover)) {
    root.style.setProperty('--color-btn-hover', theme.buttonHover);
    root.style.setProperty('--color-primary-dark', theme.buttonHover);
  }
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (newTheme: ThemeSettings) => Promise<void>;
  resetTheme: () => Promise<void>;
  previewTheme: (draftTheme: ThemeSettings) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch theme settings from API or localStorage
    api.theme.get().then((res) => {
      if (res.status === 'success' && res.data?.theme) {
        const loadedTheme = res.data.theme;
        setTheme(loadedTheme);
        applyThemeToDom(loadedTheme);
      } else {
        applyThemeToDom(DEFAULT_THEME);
      }
      setIsLoading(false);
    }).catch((err) => {
      console.warn("Could not load theme settings, using defaults:", err);
      applyThemeToDom(DEFAULT_THEME);
      setIsLoading(false);
    });
  }, []);

  const updateTheme = async (newTheme: ThemeSettings) => {
    setTheme(newTheme);
    applyThemeToDom(newTheme);
    await api.theme.update(newTheme);
  };

  const resetTheme = async () => {
    setTheme(DEFAULT_THEME);
    applyThemeToDom(DEFAULT_THEME);
    await api.theme.reset();
  };

  const previewTheme = (draftTheme: ThemeSettings) => {
    applyThemeToDom(draftTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, previewTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
