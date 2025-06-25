
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ThemeSettings } from '../types';
import { DEFAULT_THEME, FONT_FAMILIES } from '../constants';

interface ThemeContextType {
  theme: ThemeSettings;
  fontClass: string;
  setTheme: (theme: ThemeSettings) => void;
  toggleMode: () => void;
  updateThemeSetting: <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  fontClass: FONT_FAMILIES['Sans Serif'],
  setTheme: () => {},
  toggleMode: () => {},
  updateThemeSetting: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeSettings>(() => {
    const storedTheme = localStorage.getItem('appTheme');
    return storedTheme ? JSON.parse(storedTheme) : DEFAULT_THEME;
  });

  const [fontClass, setFontClass] = useState<string>(() => FONT_FAMILIES[theme.fontFamily] || FONT_FAMILIES['Sans Serif']);

  useEffect(() => {
    localStorage.setItem('appTheme', JSON.stringify(theme));
    setFontClass(FONT_FAMILIES[theme.fontFamily] || FONT_FAMILIES['Sans Serif']);
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeSettings) => {
    setThemeState(newTheme);
  };

  const toggleMode = () => {
    setThemeState(prevTheme => ({
      ...prevTheme,
      mode: prevTheme.mode === 'light' ? 'dark' : 'light',
    }));
  };
  
  const updateThemeSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setThemeState(prevTheme => ({
      ...prevTheme,
      [key]: value,
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, fontClass, setTheme, toggleMode, updateThemeSetting }}>
      {children}
    </ThemeContext.Provider>
  );
};
