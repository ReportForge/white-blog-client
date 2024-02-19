import React from 'react';
import { Card, CardContent, CardMedia, Typography, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MiniBlogPost({ post }) {
    const { title, subTitle, authors, publishDate, mainImage } = post;
    const navigate = useNavigate();

    // Function to handle navigation
    const handleNavigate = () => {
        navigate(`/full-blog-post/${post._id}`); // Navigate to the full blog post page
    };

    return (
        <Card sx={{ maxWidth: 345, m: 2, boxShadow: "none" }} >
            <CardMedia
                component="img"
                height="185"
                image={mainImage}
                alt="Blog post cover"
                sx={{
                    borderRadius: "5px",
                    transition: "transform 0.5s ease", // Add transition for smooth effect
                    '&:hover': {
                        transform: "scale(1.03)", // Zoom in effect on hover
                        cursor: 'pointer',
                    },
                }}
                onClick={handleNavigate} // Add onClick event to navigate
            />
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
                            <Avatar alt={author.name} src={author.image} sx={{ width: 35, height: 35, border: '2px solid white'}} />
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
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif",textAlign: 'left' }}>
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
