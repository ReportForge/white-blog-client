import React, { useState } from 'react';
import { loginUser, googleLogin } from '../../api/api';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Logo from '../../assets/images/logo.png';
import { makeStyles } from '@mui/styles';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { useTheme } from '@mui/material/styles';
import TwitterIcon from '@mui/icons-material/Twitter';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { FacebookLoginButton } from 'react-social-login-buttons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    maxHeight: '100px', // Increase logo size
  },
  title: {
    flexGrow: 1,
    display: 'flex', // Ensure the logo aligns to the left
    alignItems: 'center',
  },
}));

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} style={{ fontFamily: "'Lato', sans-serif" }}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.white-hat.co.il/" style={{ fontFamily: "'Lato', sans-serif" }}>
        White Hat
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();


  // Function to handle Facebook login response
  // const handleFacebookLogin = async (response) => {
  //   try {
  //     const userData = {
  //       firstName: response.data.first_name,
  //       lastName: response.data.last_name,
  //       email: response.data.email,
  //       password: response.data.password
  //     };
  //     const result = await registerUser(userData);
  //     localStorage.setItem('token', result.token);
  //     localStorage.setItem('user', JSON.stringify(result.user));
  //   } catch (error) {
  //     console.error('Error during Facebook sign-in:', error);
  //     // Handle errors, e.g., display a message to the user
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const credentials = { email, password };
      const result = await loginUser(credentials);
      console.log('Sign in successful:', result);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate("/");
      // Redirect the user or update UI upon successful sign-in
    } catch (error) {
      console.error('Error during sign-in:', error);
      if (error.message === 'User not found!') {
        setEmailError('Email not found');
      }
      if (error.message === 'Invalid credentials!') {
        setPasswordError('Invalid password');
      }
    }
  };


  const handleXLogin = () => {
    window.location.href = `https://whiteblog-ffb7cfa6fd24.herokuapp.com/api/auth/twitter`; // This should be your backend endpoint that initiates the Twitter OAuth flow
  }


  const responseMessage = async (response) => {
    try {
      // Extract the ID token from the Google login response
      const tokenId = response.credential;

      // Use the googleLogin function to send the token to your backend
      const result = await googleLogin(tokenId);

      // If the backend response is successful, store the token and user details
      console.log('Google sign in successful:', result);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/'); // Redirect the user or update UI upon successful sign-in
    } catch (error) {
      // Handle errors, e.g., display a message to the user
      console.error('Error during Google sign-in:', error);
    }
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Typography variant="h6" className={classes.title}>
          <img src={Logo} alt="Logo" className={classes.logo} />
        </Typography>

        <Typography component="h1" variant="h5" style={{ fontFamily: "'Lato', sans-serif" }}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={!!emailError}
            helperText={emailError}
            onChange={(e) => {
              setEmail(e.target.value);
              if (!e.target.value.trim()) setEmailError(''); // Clear email error when the field is empty
            }}
            InputLabelProps={{
              style: { fontFamily: "'Lato', sans-serif" },
            }}
            InputProps={{
              style: { fontFamily: "'Lato', sans-serif" },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            error={!!passwordError}
            helperText={passwordError}
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value)
              if (e.target.value.trim()) setPasswordError('');
            }}
            InputLabelProps={{
              style: { fontFamily: "'Lato', sans-serif" },
            }}
            InputProps={{
              style: { fontFamily: "'Lato', sans-serif" },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              fontFamily: "'Lato', sans-serif",
              backgroundColor: theme.palette.mode === 'dark' ? '#C38FFF' : '#0254EC',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#C37EEE' : '#204eb7',
              },
            }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/password-reset" variant="body2" style={{ fontFamily: "'Lato', sans-serif" }}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2" style={{ fontFamily: "'Lato', sans-serif" }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={2}>
        <GoogleLogin
          onSuccess={responseMessage}
          onError={errorMessage}
        />
      </Box>
      <Box mt={2}>
        <Button
          onClick={handleXLogin} // Adjust the handler function name if needed
          fullWidth
          variant="contained"
          endIcon={<TwitterIcon />} // Adding the X icon to the button
          sx={{
            mt: 3,
            mb: 2,
            fontFamily: "'Lato', sans-serif",
            backgroundColor: theme.palette.mode === 'dark' ? '#1DA1F2' : '#1DA1F2', // Adjust the color to match X's branding
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1991DA' : '#1888D4', // Adjust the hover color to match X's branding
            },
          }}
        >
          Sign in with
        </Button>
      </Box>
      {/* <LoginSocialFacebook
        appId="982174136904133"
        onResolve={(resonse) => {
          handleFacebookLogin(resonse);
        }}
        onReject={(error) => {
          console.log(error);
        }}
      >
        <FacebookLoginButton />
      </LoginSocialFacebook> */}
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>

  );
}