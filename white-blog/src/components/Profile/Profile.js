import React, { useState, useRef, useEffect } from 'react';
import { Container, Box, Typography, Grid, Avatar, IconButton, Paper, TextField, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateUserProfile, fetchLikedPosts, fetchPostsByAuthorName } from '../../api/api';
import MiniBlogPost from '../MiniBlogPost/MiniBlogPost'

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [profilePicture, setProfilePicture] = useState(user.profilePicture);
    const [likedPosts, setLikedPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const fileInputRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        setProfilePicture(user.profilePicture); // Update state when user's profile picture changes
    }, [user.profilePicture]);

    useEffect(() => {
        const getLikedPosts = async () => {
            try {
                const posts = await fetchLikedPosts(token);
                setLikedPosts(posts);
            } catch (error) {
                console.error('Failed to fetch liked posts:', error);
            }
        };

        if (user._id) {
            getLikedPosts();
        }
    }, [token]);

    // Fetch user's posts
    useEffect(() => {
        const getUserPosts = async () => {
            try {
                const posts = await fetchPostsByAuthorName(user.firstName, user.lastName,token);
                setUserPosts(posts);
            } catch (error) {
                console.error('Failed to fetch user posts:', error);
            }
        };

        if (user._id) {
            getUserPosts();
        }
    }, [token]);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const updatedUser = await updateUserProfile(user._id, { 'profilePicture': e.target.result }, token);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser); // Update user state to trigger re-render
                setProfilePicture(updatedUser.profilePicture); // Update profile picture state
            } catch (error) {
                console.error('Failed to update user profile:', error);
            }
        };
        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    function BlogPostsGrid({ posts }) {
        if (!posts.length) {
            return <CircularProgress
                size={60}
                style={{ color: '#204EB7' }}
            />;
        }

        return (
            <Grid container spacing={4}>
                {posts.map((post, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <MiniBlogPost post={post} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4, color: '#FBFCFE' }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={4} md={3} lg={2}>
                        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <Avatar
                                alt="Profile Picture"
                                src={profilePicture}
                                sx={{ width: 100, height: 100 }}
                            />
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 30,
                                    backgroundColor: 'white',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Example shadow
                                    '&:hover': {
                                        backgroundColor: '#F0F4F8',
                                        boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)' // Slightly larger shadow on hover for a nice effect
                                    }
                                }}
                                onClick={triggerFileInput}
                            >
                                <EditIcon fontSize="small" sx={{ '&:hover': { color: '#32383E' } }} />
                            </IconButton>

                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9} lg={10}>
                        <Typography variant="h6" gutterBottom>
                            Personal Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={user.firstName}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={user.lastName}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Typography variant="h5" mt='2rem' mb='2rem'>Liked Posts</Typography>
            <BlogPostsGrid posts={likedPosts} />
            <Typography variant="h5" mt='2rem' mb='2rem'>Your Posts</Typography>
            {userPosts==[] ? <BlogPostsGrid posts={userPosts} /> : <Typography variant="h7" mt='2rem' mb='2rem'>No Posts Yet</Typography>}
        </Container>
    );
};

export default Profile;
