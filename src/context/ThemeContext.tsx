import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

type ThemeContextType = 'dark-mode' | 'light-mode';

interface ThemeContextModel {
  currentTheme: ThemeContextType;
  setCurrentTheme: (theme: ThemeContextType) => void;
}

const initialValue: ThemeContextModel = {
  currentTheme: 'dark-mode',
  setCurrentTheme: () => {},
};

const ThemeContext = createContext<ThemeContextModel>(initialValue);

function ThemeProvider({ children }: React.PropsWithChildren) {
  const [theme, setTheme] = useLocalStorageState<ThemeContextType>(
    'light-mode',
    'cabins-theme'
  );

  useEffect(() => {
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => {
      if (current === 'dark-mode') {
        return 'light-mode';
      }
      return 'dark-mode';
    });
  }

  return (
    <ThemeContext.Provider
      value={{ currentTheme: theme, setCurrentTheme: toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('ThemeContext must be used inside ThemeProvider');
  }

  return context;
}

export { useTheme, ThemeProvider };
