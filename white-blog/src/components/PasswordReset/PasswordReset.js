// PasswordReset.js

import React, { useState } from 'react';
import { requestPasswordReset } from '../../api/api'; // You need to implement this API call
import { Button, TextField, Box, Typography, Container } from '@mui/material';

export default function PasswordReset() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await requestPasswordReset(email);
            setMessage('If an account exists for this email, a password reset link has been sent.');
        } catch (error) {
            console.error('Error requesting password reset:', error);
            setMessage('There was an error processing your request.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Password Reset
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Send Reset Link
                    </Button>
                    {message && <Typography color="textSecondary">{message}</Typography>}
                </Box>
            </Box>
        </Container>
    );
}
