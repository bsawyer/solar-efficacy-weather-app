import React, {createContext, useState, useEffect} from 'react';
import * as styles from './theme.module.scss';

interface Props {
  children: React.children;
}

export const ThemeContext = createContext({
  theme: 'default',
  setTheme: (theme: string) => {}
});

export const ThemeContextProvider = ({children}: Props) => {
  const [state, setState] = useState({
    theme: localStorage.getItem('theme') || 'default',
    setTheme: (theme: string) => {
      localStorage.setItem('theme', theme);
      setState({
        ...state,
        theme
      });
    }
  });
  useEffect(() => {
    document.documentElement.className = styles[`theme-${state.theme}`];
  }, [state]);

  return (
    <ThemeContext.Provider value={state}>
      {children}
    </ThemeContext.Provider>
  )
};
