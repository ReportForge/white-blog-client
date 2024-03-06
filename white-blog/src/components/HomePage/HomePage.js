import { React, useState, useEffect } from 'react';
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
import BlogPostsGrid from '../BlogPostsGrid/BlogPostsGrid'
import { useSearchParams } from 'react-router-dom';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isAppBarHovered, setIsAppBarHovered] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const initialTag = searchParams.get('tag');
  console.log(user);

  const handleCreatePost = () => {
    navigate("/post-editor");
  };

  useEffect(() => {
    if (initialTag) {
      setSelectedTag(initialTag);
    }
  }, [initialTag]);

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        style={{ backgroundColor: theme.palette.mode === 'dark' ? '#C38FFF' : '#2C5EE8', }}
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
            onClick={() => {
              if (Object.keys(user).length !== 0) {
                // Navigate to BlogPostRequest if the user is logged in
                navigate('/blog-post-request'); // Update the path as needed based on your routing setup
              } else {
                navigate('/signin');
              }
            }}
          >
            {Object.keys(user).length !== 0 ? 'Come be part of our community!' : 'Sign in to get newspaper'}
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
      <Box>
        <Container maxWidth={isMobile ? 'xs' : 'lg'}>
          <SearchBar setSelectedTag={setSelectedTag} setSearchTerm={setSearchTerm} />
        </Container>
      </Box>
      <Box sx={{ height: '1px', backgroundColor: '#E5E7EB', width: '100%', marginY: theme.spacing(0.5), marginTop: isMobile ? '15px' : null }} />
      <Box >
        <Container maxWidth={isMobile ? 'xs' : 'lg'}>
          <BlogPostsGrid selectedTag={selectedTag} searchTerm={searchTerm} />
        </Container>
      </Box>
      {user.isEditor && (
        <Fab
          color="primary"
          aria-label="add"
          style={{
            position: 'fixed',
            bottom: theme.spacing(6),
            right: theme.spacing(4),
            backgroundColor: theme.palette.mode === 'dark' ? '#C38FFF' : '#2C5EE8',
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


