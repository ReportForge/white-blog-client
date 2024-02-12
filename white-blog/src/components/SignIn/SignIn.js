import React, { useState } from 'react';
import { loginUser } from '../../api/api';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from '../../assets/images/white_blog_logo.png';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    logo: {
      maxHeight: '70px', // Increase logo size
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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const classes = useStyles();
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
          const credentials = {email, password};
          const result = await loginUser(credentials);
          console.log('Sign in successful:', result);
          // Redirect the user or update UI upon successful sign-in
      } catch (error) {
          console.error('Error during sign-in:', error);
          // Handle errors, e.g., show an error message to the user
      }
    };
  

  return (
    <ThemeProvider theme={defaultTheme}>
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
          
        <Typography component="h1" variant="h5"  style={{ fontFamily: "'Lato', sans-serif" }}>
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
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
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
            style={{ fontFamily: "'Lato', sans-serif" , backgroundColor: '#0254EC'}}
        >
            Sign In
        </Button>
        <Grid container>
            <Grid item xs>
            <Link href="#" variant="body2"  style={{ fontFamily: "'Lato', sans-serif" }}>
                Forgot password?
            </Link>
            </Grid>
            <Grid item>
            <Link href="/signup" variant="body2"  style={{ fontFamily: "'Lato', sans-serif" }}>
                {"Don't have an account? Sign Up"}
            </Link>
            </Grid>
        </Grid>
        </Box>
    </Box>
    <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
</ThemeProvider>
  );
}