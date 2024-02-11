import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Logo from '../../../assets/images/white_blog_logo.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    maxHeight: '60px', // Increase logo size
    marginRight: theme.spacing(2), // Add some space after the logo
  },
  title: {
    flexGrow: 1,
    display: 'flex', // Ensure the logo aligns to the left
    alignItems: 'center',
  },
}));

const NavigationBar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" elevation="0">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <img src={Logo} alt="Logo" className={classes.logo} />
          </Typography>
          <Button
            variant="contained"
            href="/signin"
            sx={{
              borderRadius: '20px', // Adjust for desired roundness
              backgroundColor: '#2C5EE8', // Button color
              color: 'white', // Text color
              '&:hover': {
                backgroundColor: '#204eb7', // Color on hover
              },
            }}
          >
            Sign In
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationBar;
