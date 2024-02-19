import React from 'react';
import NavigationBar from '../HomePage/NavigationBar/NavigationBar';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const NavigationWarp = ({ children }) => {
  const theme = useTheme();

  return (
    <>
      {/* Full-width Box for the navigation bar background */}
      <Box sx={{
        opacity: 0.9,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: '#fff',
        width: '100%', // Ensures the navigation bar spans the full width
        borderRadius: '20px',
      }}>
        {/* Centered Container for navigation items, constrained to 'lg' size */}
        <Container maxWidth="lg">
          <NavigationBar />
        </Container>
        <Box sx={{ height: '1px', backgroundColor: '#E5E7EB', width: '100%', marginY: theme.spacing(0.5) }} />
      </Box>
      <div>{children}</div>
    </>
  );
};

export default NavigationWarp;
