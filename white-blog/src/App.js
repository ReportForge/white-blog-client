import React, { useEffect, useState } from 'react';
import './App.css';
import AppRouter from './AppRouter';
import { createTheme, ThemeProvider, CssBaseline, Switch } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { IconButton, useTheme, styled } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon

const ModeToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  left: theme.spacing(2),
  bottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
}));


function App() {

  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode setting from localStorage or default to false
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' ? true : false;
  });

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
        typography: {
          fontFamily: "'Lato', sans-serif",
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                fontFamily: "'Lato', sans-serif",
              },
            },
          },
        },
      }),
    [darkMode],
  );


  useEffect(() => {
    let inactivityTimer;
    let expirationTimer;
    localStorage.setItem('darkMode', darkMode.toString());

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        alert('You have been logged out due to inactivity.');
        localStorage.clear();
        window.location.href = '/';
      }, 1000 * 60 * 120); // 2 hours
    };

    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const { exp } = jwtDecode(token);
        const now = new Date().getTime() / 1000; // Current time in seconds

        // Set a timer to log out when the token expires
        const delay = (exp - now) * 1000; // Time until token expiration in milliseconds
        if (delay > 0) {
          clearTimeout(expirationTimer);
          expirationTimer = setTimeout(() => {
            alert('Your session has expired. Please log in again.');
            localStorage.clear();
            window.location.href = '/';
          }, delay);
        }
      }
    };

    // // Events that should reset the inactivity timer
    // window.addEventListener('mousemove', resetInactivityTimer);
    // window.addEventListener('keydown', resetInactivityTimer);

    // Start the timers
    resetInactivityTimer();
    checkTokenExpiration();

    // Cleanup on component unmount
    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(expirationTimer);
      // window.removeEventListener('mousemove', resetInactivityTimer);
      // window.removeEventListener('keydown', resetInactivityTimer);
    };
  }, [darkMode]);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This helps with consistent background and text colors */}
      <div className="App">
        <ModeToggleButton onClick={handleToggleDarkMode} aria-label="toggle dark mode">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </ModeToggleButton>
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
