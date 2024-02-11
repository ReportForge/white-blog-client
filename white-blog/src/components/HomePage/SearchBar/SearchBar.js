import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button'; // For rendering tags as buttons
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  bar: {
    justifyContent: 'space-between', // Spreads out toolbar content
  },
  searchField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 'auto', // Adjust based on your preference
    backgroundColor: '#ffffff', // White background for the search field
  },
  tags: {
    color: '#647ba1',
    display: 'flex',
    alignItems: 'center',
  },
}));

const SearchBar = () => {
  const classes = useStyles();

  const [activeTag, setActiveTag] = useState(null); 

  // Array of tag strings
  const tags = ['News', 'Product', 'Technology', 'Education'];

  const handleButtonClick = (index) => {
    setActiveTag(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar className={classes.bar}>
          <Typography variant="h6" className={classes.tags} style={{ fontFamily: "'Lato', sans-serif" }}>
            Tags:
            {tags.map((tag, index) => (
              <Button key={index} sx={{
                borderRadius: '20px',
                marginLeft: '10px',
                fontSize: '11px',
                backgroundColor: activeTag === index ? '#204EB7' : '#f0f3f7',
                color: activeTag === index ? '#ffffff' : '#85909D',
                '&:hover': {
                  backgroundColor: activeTag === index ? '#204EB7' : '#f0f3f7',
                },
              }}
                variant="contained"
                onClick={() => handleButtonClick(index)}>
                {tag}
              </Button>
            ))}
          </Typography>
          <TextField
            className={classes.searchField}
            variant="outlined"
            placeholder="Search..."
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
                    <IconButton edge="end" size="large">
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
