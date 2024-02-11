import React from 'react';
import './App.css';
import AppRouter from './AppRouter.js'; // Make sure the path is correct
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  // Customize your theme here
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <AppRouter />
      </ThemeProvider>
    </div>
  );
}

export default App;
