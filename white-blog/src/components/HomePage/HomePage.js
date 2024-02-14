import { React, useState } from 'react';
import Container from '@mui/material/Container';
import NavigationBar from './NavigationBar/NavigationBar';
import SearchBar from './SearchBar/SearchBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Fab from '@mui/material/Fab';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isAppBarHovered, setIsAppBarHovered] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleCreatePost = () => {
    navigate("/post-editor");
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        style={{ backgroundColor: '#0F172A' }}
        onMouseOver={() => setIsAppBarHovered(true)}
        onMouseOut={() => setIsAppBarHovered(false)}
      >
        <Toolbar style={{ justifyContent: 'center', minHeight: '40px', padding: '0px' }}>
          <Typography
            style={{
              lineHeight: '40px',
              fontFamily: "'Lato', sans-serif",
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            color="inherit"
          >
            Sign in to get newspaper
            <ArrowForwardIosIcon style={{
              fontSize: '1rem',
              marginLeft: '5px',
              transition: 'transform 0.3s ease',
              transform: isAppBarHovered ? 'translateX(5px)' : 'translateX(0px)',
            }} />
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ backgroundColor: '#E5E7EB', width: '100%' }} />
      <Box >
        <Container maxWidth={isMobile ? 'xs' : 'lg'}>
          <NavigationBar />
        </Container>
      </Box>
      <Box sx={{ height: '1px', backgroundColor: '#E5E7EB', width: '100%', marginY: theme.spacing(0.5) }} />
      <Box >
        <Container maxWidth={isMobile ? 'xs' : 'lg'}>
          <SearchBar />
        </Container>
      </Box>
      <Box sx={{ height: '1px', backgroundColor: '#E5E7EB', width: '100%', marginY: theme.spacing(0.5), marginTop: isMobile ? '15px' : null }} />
      {user.isEditor && (
        <Fab
          color="primary"
          aria-label="add"
          style={{
            position: 'fixed',
            bottom: theme.spacing(6),
            right: theme.spacing(4),
            backgroundColor: '#2C5EE8'
          }}
          onClick={handleCreatePost}
        >
          <PostAddIcon />
        </Fab>
      )}
    </>
  );
};

export default HomePage;


