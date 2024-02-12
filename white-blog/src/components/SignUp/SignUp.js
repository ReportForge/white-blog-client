import React, { useState } from 'react';
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
import { registerUser } from '../../api/api';

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


const defaultTheme = createTheme();

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const classes = useStyles();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userData = { firstName, lastName, email, password };
        try {
            const result = await registerUser(userData);
            console.log('Signup successful:', result);
            // Redirect or update UI upon successful signup
        } catch (error) {
            console.error('Error during signup:', error);
            // Handle errors
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
            <Typography component="h1" variant="h5" style={{ fontFamily: "'Lato', sans-serif" }}>
                Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        onChange={(e) => setFirstName(e.target.value)}
                        InputLabelProps={{
                            style: { fontFamily: "'Lato', sans-serif" },
                        }}
                        InputProps={{
                            style: { fontFamily: "'Lato', sans-serif" },
                        }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        onChange={(e) => setLastName(e.target.value)}
                        InputLabelProps={{
                            style: { fontFamily: "'Lato', sans-serif" },
                        }}
                        InputProps={{
                            style: { fontFamily: "'Lato', sans-serif" },
                        }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        InputLabelProps={{
                            style: { fontFamily: "'Lato', sans-serif" },
                        }}
                        InputProps={{
                            style: { fontFamily: "'Lato', sans-serif" },
                        }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                        InputLabelProps={{
                            style: { fontFamily: "'Lato', sans-serif" },
                        }}
                        InputProps={{
                            style: { fontFamily: "'Lato', sans-serif" },
                        }}
                        />
                    </Grid>
                </Grid>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ fontFamily: "'Lato', sans-serif" , backgroundColor: '#0254EC'}}
                >
                Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link href="/signin" variant="body2" style={{ fontFamily: "'Lato', sans-serif" }}>
                    Already have an account? Sign in
                    </Link>
                </Grid>
                </Grid>
            </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
        </ThemeProvider>
    );
}