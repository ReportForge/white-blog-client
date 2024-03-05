import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { sendBlogPostRequest } from '../../api/api'; // Adjust the import path as necessary
import Logo from '../../assets/images/logo.png';

function BlogPostRequest() {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [userEmail] = useState(user.email);
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Placeholder for token retrieval. Replace with your actual logic.
        const token = localStorage.getItem('token');

        try {
            await sendBlogPostRequest({ subject, description, userEmail }, token);
            alert('Your request has been sent!');
            setSubject('');
            setDescription('');
        } catch (error) {
            console.error('Failed to send blog post request:', error);
            alert('Failed to send your request. Please try again.');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{
            display: 'flex', // Enables Flexbox
            flexDirection: 'column', // Stack children vertically
            justifyContent: 'center', // Center vertically
            height: '100vh', // Take full viewport height
        }}>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" sx={{
                    flexGrow: 1,
                    display: 'flex', // Ensure the logo aligns to the left
                    alignItems: 'center',
                }}>
                    <img src={Logo} alt="Logo" style={{ height: '100px', }} />
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Write Us About Your Post Idea
                </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Subject"
                    autoFocus
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Short Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Send
                </Button>
            </Box>
        </Container>
    );
}

export default BlogPostRequest;
