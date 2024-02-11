import React from 'react';
import Container from '@mui/material/Container';
import NavigationBar from './NavigationBar/NavigationBar'; // Assuming this is your custom component
import SearchBar from './SearchBar/SearchBar';

const HomePage = () => {
  return (
    <>
      <Container maxWidth="lg"> {/* Adjust the maxWidth as needed */}
        <NavigationBar />
        {/* Add more components here, they will be centered with space on the sides */}
      </Container>
      <div style={{ height: '1px', backgroundColor: '#E5E7EB', width: '100%' }}></div>
      <Container maxWidth="lg"> {/* Adjust the maxWidth as needed */}
        <SearchBar />
        {/* Add more components here, they will be centered with space on the sides */}
      </Container>
      <div style={{ height: '1px', backgroundColor: '#E5E7EB', width: '100%' }}></div>
    </>
  );
};

export default HomePage;
