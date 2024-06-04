import React from 'react';
import { Card, CardContent, CardMedia, Typography, Avatar, Box, IconButton, Modal, Button, useTheme } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { likeBlogPost } from '../../api/api';
import Logo from '../../assets/images/logo.png';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    borderRadius: '10px',
    '& img': {  // Targeting img tag inside the Box
        width: '100px', // Adjust width as needed
        height: 'auto', // Keeps the aspect ratio
    },
};

function MiniBlogPost({ post }) {
    const { _id, title, subTitle, authors, publishDate, mainImage, likes } = post;
    const [liked, setLiked] = useState(false);
    const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const theme = useTheme();

    useEffect(() => {
        // Set liked to true if the current user's ID is in the post's likes array
        if (likes && likes.includes(user._id)) {
            setLiked(true);
        }
    }, [likes, user._id]); // Depend on likes and user._id to re-run this effect if they change

    // Function to handle navigation
    const handleNavigate = () => {
        navigate(`/full-blog-post/${post._id}`); // Navigate to the full blog post page
    };

    // Function to handle like button click
    const handleLike = async (e) => {
        e.stopPropagation(); // Prevents the CardMedia onClick from being triggered

        if (!token) {
            // If there's no token, the user is not logged in
            setOpenLoginPrompt(true); // Show the login prompt modal
            return; // Exit the function early
        }

        try {
            await likeBlogPost(_id, token); // Call the API to like the post
            setLiked(!liked); // Toggle the liked state
        } catch (error) {
            console.error('Error liking the post:', error);
            // Handle the error (e.g., show a message to the user)
        }
    };

    const redirectToSignIn = () => {
        navigate('/signin'); // Adjust the path as per your routing setup
    };

    return (
        <>
            {/* Login Prompt Modal */}
            <Modal
                open={openLoginPrompt}
                onClose={() => setOpenLoginPrompt(false)}
                aria-labelledby="login-prompt-title"
                aria-describedby="login-prompt-description"
            >
                <Box sx={modalStyle}>
                    <img src={Logo} alt="Logo" />
                    <Typography id="login-prompt-title" variant="h6" component="h2">
                        Log In Required
                    </Typography>
                    <Typography id="login-prompt-description" sx={{ mt: 2 }}>
                        You need to be logged in to like posts.
                    </Typography>
                    <Button variant="contained"
                        onClick={redirectToSignIn}
                        style={{
                            fontFamily: "'Lato', sans-serif",
                            backgroundColor: theme.palette.mode === 'dark' ? '#C38FFF' : '#0043ff',
                            borderRadius: '20px'
                        }}>
                        Sign In
                    </Button>
                </Box>
            </Modal>

            <Card
                sx={{
                    maxWidth: 345,
                    m: 2,
                    boxShadow: "none",

                }}>
                <Box sx={{ position: 'relative' }}> {/* Container for image and like button */}
                    <CardMedia
                        component="img"
                        height="185"
                        image={mainImage}
                        alt="Blog post cover"
                        sx={{
                            borderRadius: "5px",
                            transition: "transform 0.5s ease",
                            '&:hover': {
                                transform: "scale(1.03)",
                                cursor: 'pointer',
                            },
                        }}
                        onClick={handleNavigate}
                    />
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: liked ? '#ff1744' : 'white',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: '#ff1744',
                            },
                            textShadow: '0 0 8px rgba(0, 0, 0, 0.7)',
                        }}
                        onClick={handleLike}
                    >
                        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                </Box>
                <CardContent sx={{ padding: "16px 0px", "&:last-child": { paddingBottom: "16px" } }}>
                    <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                            textAlign: 'left',
                            fontWeight: 600,
                            color: theme.palette.mode === 'dark' ? '#FAFAFA' : '#1E293B',
                            fontFamily: "'Lato', sans-serif",
                            cursor: 'pointer', // Change cursor to pointer on hover
                        }}
                        onClick={handleNavigate} // Add onClick event to navigate
                    >
                        {title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {authors.map((author, index) => (
                            <Box key={index} sx={{ mr: -1, display: 'inline' }}>
                                <Avatar alt={author.name} src={author.image} sx={{ width: 35, height: 35, border: '2px solid white' }} />
                            </Box>
                        ))}
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3, mb: 1 }}>
                            <Typography variant="body2" color={theme.palette.mode === 'dark' ? '#EFEFEF' : '#323949'} sx={{ fontWeight: 600, fontSize: '15px', fontFamily: "'Lato', sans-serif" }} >
                                {authors.map((author, index) => (
                                    <span key={index}>
                                        {author.name}{index < authors.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif", textAlign: 'left' }}>
                                {new Date(publishDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left', fontSize: '15px', fontWeight: 600, fontFamily: "'Lato', sans-serif" }}>
                        {subTitle}
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
}

export default MiniBlogPost;
