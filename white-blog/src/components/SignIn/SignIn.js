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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from '../../assets/images/logo.png';
import { makeStyles } from '@mui/styles';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

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

const defaultTheme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const classes = useStyles();
  const navigate = useNavigate();

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
            sx={{ mt: 3, mb: 2 }}
            style={{ fontFamily: "'Lato', sans-serif", backgroundColor: '#0254EC' }}
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
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>

  );
}