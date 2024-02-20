import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitNewPassword } from '../../api/api';
import { Button, TextField, Box, Typography, Container } from '@mui/material';

const PasswordResetSubmit = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    // Reuse the same password validation function from SignUp component
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // Adjust regex as needed
        return regex.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validatePassword(newPassword)) {
            setError('Password must be at least 8 characters long, include at least one uppercase letter and one number.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        try {
            await submitNewPassword({ token, newPassword });
            navigate('/signin'); // Navigate to sign-in page or show a success message
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Failed to reset password. Please try again.');
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
                    Reset Your Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="newPassword"
                        label="New Password"
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={!!error}
                        helperText={error}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset Password
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default PasswordResetSubmit;
