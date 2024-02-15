import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button'; // For rendering tags as buttons
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box'; // Import Box component
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  bar: {
    flexDirection: 'column', // Stack items vertically on small screens
    alignItems: 'center', // Center items on small screens
    [theme.breakpoints.up('sm')]: { // Apply styles for screens larger than 'sm'
      flexDirection: 'row', // Revert to horizontal layout for larger screens
      justifyContent: 'space-between', // Spreads out toolbar content
    },
  },
  searchField: {
    backgroundColor: '#ffffff', // White background for the search field
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: 0, // Remove the top margin for larger screens
      width: 'auto', // Adjust based on your preference for larger screens
    },
    width: '100%', // Make the search field take the full width on mobile
  },
  tagsContainer: {
    display: 'flex',
    flexDirection: 'row', // Ensure "Tags" text and buttons are in the same row
    alignItems: 'baseline', // Align items along their baseline
    flexWrap: 'wrap', // Allow items to wrap onto the next line if needed
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1) // Add some space below the tags container on mobile
    },
  },
  tagButtons: {
    display: 'flex',
    flexDirection: 'row', // Display buttons in a row
    flexWrap: 'wrap', // Allow buttons to wrap onto the next line
    marginLeft: theme.spacing(1), // Add some space to the left of the buttons
  },
  tagButton: {
    margin: theme.spacing(0.5), // Add some space around each tag button
  },
  placeholder: {
    '& .MuiInputBase-input::placeholder': {
      color: '#64748B', // Change the color and opacity as needed
      fontWeight: 'bold',
      fontFamily: "'Lato', sans-serif",
      opacity: 1
    },
  },
}));

const SearchBar = ({ setSelectedTag, setSearchTerm }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTag, setActiveTag] = useState('All');
  const [searchParams] = useSearchParams();
  const initialTag = searchParams.get('tag');

  useEffect(() => {
    if (initialTag) {
      setActiveTag(initialTag);
    }
  }, [initialTag]);

  // Array of tag strings
  const tags = ['All','News', 'Product', 'Research', 'Security','Public Sector'];

  const handleButtonClick = (tag) => {
    setSelectedTag(tag === 'All' ? null : tag);
    setActiveTag(tag);
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar className={classes.bar}>
          <Box className={classes.tagsContainer}>
            <Box className={classes.tagButtons} sx={{ marginBottom: theme.spacing(1) }}>
              <Typography variant={isMobile ? 'body' : 'h6'} style={{ fontFamily: "'Lato', sans-serif", color: '#64748B' }} sx={{ marginTop: theme.spacing(0.7), marginRight: theme.spacing(0.8) }}>
                Tags
              </Typography>
              {tags.map((tag) => (
                <Button key={tag} className={classes.tagButton} sx={{
                  borderRadius: '20px',
                  fontSize: '11px',
                  marginLeft: '10px',
                  marginTop: isMobile ? theme.spacing(1) : theme.spacing(0.5),
                  backgroundColor: activeTag === tag ? '#204EB7' : '#f0f3f7',
                  color: activeTag === tag ? '#ffffff' : '#85909D',
                  '&:hover': {
                    backgroundColor: activeTag === tag ?  '#204EB7' : '#f0f3f7',
                  },
                }}
                  variant="contained"
                  onClick={() => handleButtonClick(tag)}>
                  {tag}
                </Button>
              ))}
            </Box>
          </Box>
          <TextField
            className={`${classes.searchField} ${classes.placeholder}`}
            variant="outlined"
            placeholder="Search..."
            onChange={handleSearchChange}
            InputProps={{
              style: {
                backgroundColor: '#f0f3f7',
                paddingLeft: '15px',
                borderRadius: '20px',
                fontSize: '14px',
                height: '40px',
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" size="medium" sx={{ backgroundColor: '#FFFFFF' }}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default SearchBar;
