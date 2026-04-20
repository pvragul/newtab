import React, { createContext, useContext, useState } from 'react';
import { Appearance, StatusBar } from 'react-native';
import { LightTheme, DarkTheme } from './colors';

type Theme = typeof LightTheme;

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: LightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = Appearance.getColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  Appearance.addChangeListener(({ colorScheme }) => {
    setIsDark(colorScheme === 'dark');
  });
  const toggleTheme = () => {
    Appearance.setColorScheme(isDark ? 'light' : 'dark');
    setIsDark(prev => !prev);
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
