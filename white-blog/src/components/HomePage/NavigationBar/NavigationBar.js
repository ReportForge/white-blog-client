import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Logo from '../../../assets/images/white_blog_logo.png';
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    maxHeight: '45px', // Increase logo size
  },
  title: {
    flexGrow: 1,
    display: 'flex', // Ensure the logo aligns to the left
    alignItems: 'center',
  },
}));

const NavigationBar = () => {
  const classes = useStyles();
  const isLoggedIn = localStorage.getItem('token') !== null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };


  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" elevation="0">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <img src={Logo} alt="Logo" className={classes.logo} />
          </Typography>
          {!isLoggedIn ?
            <Button
              variant="contained"
              href="/signin"
              style={{ fontFamily: "'Lato', sans-serif" }}
              sx={{

                height: "30px",
                borderRadius: '20px', // Adjust for desired roundness
                backgroundColor: '#2C5EE8', // Button color
                color: 'white', // Text color
                '&:hover': {
                  backgroundColor: '#204eb7', // Color on hover
                },
              }}
            >
              Sign In
            </Button> : <Button
              variant="contained"
              style={{ fontFamily: "'Lato', sans-serif" }}
              onClick={handleLogout}
              sx={{

                height: "30px",
                borderRadius: '20px', // Adjust for desired roundness
                backgroundColor: '#2C5EE8', // Button color
                color: 'white', // Text color
                '&:hover': {
                  backgroundColor: '#204eb7', // Color on hover
                },
              }}
            >
              Log Out
            </Button>}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationBar;
