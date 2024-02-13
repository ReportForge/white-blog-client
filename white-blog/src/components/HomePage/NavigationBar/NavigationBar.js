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
    maxHeight: '45px',
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
}));

const NavigationBar = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  
  // Assuming user info is stored in local storage after login
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log(user.email);

  const isLoggedIn = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleUserManagement = () => {
    // Navigate to user management page
    navigate("/user-management");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" elevation="0">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <img src={Logo} alt="Logo" className={classes.logo} />
          </Typography>
          {!isLoggedIn ? (
            <Button
              variant="contained"
              href="/signin"
              style={{ fontFamily: "'Lato', sans-serif" }}
              sx={{
                height: "30px",
                borderRadius: '20px',
                backgroundColor: '#2C5EE8',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#204eb7',
                },
              }}
            >
              Sign In
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                style={{ fontFamily: "'Lato', sans-serif", marginRight: '10px' }}
                onClick={handleLogout}
                sx={{
                  height: "30px",
                  borderRadius: '20px',
                  backgroundColor: '#2C5EE8',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#204eb7',
                  },
                }}
              >
                Log Out
              </Button>
              {user.email === "danelyehuda@gmail.com" && (
                <Button
                  variant="contained"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                  onClick={handleUserManagement}
                  sx={{
                    height: "30px",
                    borderRadius: '20px',
                    backgroundColor: '#FFA500', // Different color for emphasis
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#cc8400',
                    },
                  }}
                >
                  User Management
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationBar;
