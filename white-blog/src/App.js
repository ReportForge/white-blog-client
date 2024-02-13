import React, { useEffect } from 'react';
import './App.css';
import AppRouter from './AppRouter';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  // theme customization
});

function App() {
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Alert the user about logout due to inactivity
        alert('You have been logged out due to inactivity.');
      
        // Clear user session data
        localStorage.clear();
      
        // Refresh the page to reflect changes (e.g., redirect to login page or update UI)
        window.location.href = '/';
      }, 1000 * 60 * 1); // 1 minute for demonstration, change to 30 minutes or as neede      
    };

    // Events that should reset the timer
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    
    // Start the timer
    resetTimer();

    // Cleanup on component unmount
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
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
