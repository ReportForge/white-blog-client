import React, { useState } from 'react';
import { Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Logo from '../../assets/images/logo.png';
import { registerUser, verifyEmailCode } from '../../api/api'; // Make sure to implement verifyEmailCode in your API module
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    logo: {
        maxHeight: '100px',
    },
    title: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
    },
}));


export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationStage, setIsVerificationStage] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const classes = useStyles();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isVerificationStage) {
            const userData = { firstName, lastName, email, password };
            try {
                await registerUser(userData);
                setIsVerificationStage(true); // Move to verification stage after successful registration
            } catch (error) {
                console.error('Error during signup:', error);
            }
        } else {
            try {
                const result = await verifyEmailCode({ email, verificationCode: verificationCode });
                console.log('Email verified successfully');
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                navigate("/"); // Redirect to home or dashboard
            } catch (error) {
                console.error('Error during email verification:', error);
            }
        }
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (!validatePassword(newPassword)) {
            setPasswordError('Password must be at least 8 characters long, include at least one uppercase letter and one number.');
        } else {
            setPasswordError('');
        }
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
                    {isVerificationStage ? 'Verify Email' : 'Sign Up'}
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    {!isVerificationStage ? (
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
                                    onChange={handlePasswordChange}
                                    error={!!passwordError}
                                    helperText={passwordError}
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="verificationCode"
                            label="Verification Code"
                            type="text"
                            id="verificationCode"
                            autoComplete="one-time-code"
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    )}
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
                        {isVerificationStage ? 'Verify' : 'Sign Up'}
                    </Button>
                    {!isVerificationStage && (
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signin" variant="body2" style={{ fontFamily: "'Lato', sans-serif" }}>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Box>
        </Container>
    );
}
