import React, { useEffect } from 'react';
import './App.css';
import AppRouter from './AppRouter';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { jwtDecode } from 'jwt-decode';

const theme = createTheme({
  // theme customization
});

function App() {

  useEffect(() => {
    let inactivityTimer;
    let expirationTimer;

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
  }, []);


  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <AppRouter />
      </ThemeProvider>
    </div>
  );
}

export default App;
