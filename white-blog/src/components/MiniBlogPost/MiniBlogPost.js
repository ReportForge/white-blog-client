import React from 'react';
import { Card, CardContent, CardMedia, Typography, Avatar, Box, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { likeBlogPost } from '../../api/api';

function MiniBlogPost({ post }) {
    const { _id, title, subTitle, authors, publishDate, mainImage } = post;
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // Function to handle navigation
    const handleNavigate = () => {
        navigate(`/full-blog-post/${post._id}`); // Navigate to the full blog post page
    };

    // Function to handle like button click
    const handleLike = async (e) => {
        e.stopPropagation(); // Prevents the CardMedia onClick from being triggered
        try {
            await likeBlogPost(_id, token); // Call the API to like the post
            setLiked(!liked); // Toggle the liked state
        } catch (error) {
            console.error('Error liking the post:', error);
            // Handle the error (e.g., show a message to the user)
        }
    };

    return (
        <Card sx={{ maxWidth: 345, m: 2, boxShadow: "none" }} >
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
                {user.emailVerified ? <IconButton
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
                </IconButton> : null}
            </Box>
            <CardContent sx={{ padding: "16px 0px", "&:last-child": { paddingBottom: "16px" } }}>
                <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                        textAlign: 'left',
                        fontWeight: 600,
                        color: '#1E293B',
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
                        <Typography variant="body2" color="#323949" sx={{ fontWeight: 600, fontSize: '15px', fontFamily: "'Lato', sans-serif" }} >
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
    );
}

export default MiniBlogPost;
