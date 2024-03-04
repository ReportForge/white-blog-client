import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Logo from '../../../assets/images/logo.png';
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    maxHeight: theme.spacing(7),
    '&:hover': {
      opacity: 0.7,
      cursor: 'pointer',
    }
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
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = localStorage.getItem('token') !== null;
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleUserManagement = () => {
    navigate("/user-management");
  };

  const goHome = () => {
    navigate("/");
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
          >
            <img src={Logo} alt="Logo" className={classes.logo} onClick={goHome} />
          </Typography>
          {!isLoggedIn ? (
            <Button
              variant="contained"
              href="/signin"
              sx={{
                textTransform: 'none',
                fontSize: '16px',
                height: "30px",
                fontFamily: "'Lato', sans-serif",
                borderRadius: '20px',
                backgroundColor: theme.palette.mode === 'dark' ? '#C38FFF' : '#2C5EE8',
                boxShadow: 'none',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#204eb7',
                  boxShadow: 'none',
                },
              }}
            >
              Sign In
            </Button>
          ) : (
            <>
              <IconButton onClick={() => navigate("/profile")}
                sx={{
                  marginRight: theme.spacing(2),
                }}>
                <Avatar
                  alt="Profile Picture"
                  src={user.profilePicture}
                />
              </IconButton>
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  fontFamily: "'Lato', sans-serif",
                  marginRight: '10px',
                  height: theme.spacing(4),
                  borderRadius: theme.spacing(2),
                  backgroundColor: '#2C5EE8',
                  fontSize: '16px',
                  boxShadow: 'none',
                  textTransform: 'none',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#204eb7',
                    boxShadow: 'none',
                  },
                }}
              >
                Log Out
              </Button>
              {user.email === "danelyehuda1998@gmail.com" && (
                <Button
                  variant="contained"
                  onClick={handleUserManagement}
                  sx={{
                    fontFamily: "'Lato', sans-serif",
                    height: theme.spacing(4),
                    textTransform: 'none',
                    fontSize: '16px',
                    boxShadow: 'none',
                    borderRadius: theme.spacing(2),
                    backgroundColor: '#FFA500', // Different color for emphasis
                    color: 'white',
                    '@media (max-width: 600px)': {
                      fontSize: '0.75rem', // Smaller font size on small screens
                      padding: '4px 8px', // Reduced padding on small screens
                    },
                    '&:hover': {
                      backgroundColor: '#cc8400',
                      boxShadow: 'none',
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
