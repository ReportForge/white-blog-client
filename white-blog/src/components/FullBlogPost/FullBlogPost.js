import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogPostById } from '../../api/api'; // Adjust the import path as necessary
import { Container, Typography, Box, Avatar, CardMedia, Chip, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';

function FullBlogPost() {
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    useEffect(() => {
        const getBlogPost = async () => {
            try {
                const post = await fetchBlogPostById(id);
                setBlogPost(post);
            } catch (error) {
                console.error('Failed to fetch blog post:', error);
            }
        };

        getBlogPost();
    }, [id]);

    if (!blogPost) {
        return <div>Loading...</div>; // Or any other loading indicator
    }

    const { title, subTitle, authors, publishDate, mainImage, contentBlocks, readTime, tags } = blogPost;

    const handleOpenModal = (imageSrc) => {
        setSelectedImage(imageSrc);
        setOpenModal(true);
        setIsClosing(false);
    };

    const handleCloseModal = () => {
        setIsClosing(true); // Trigger the closing animation
        setTimeout(() => {
            setOpenModal(false);
            setIsClosing(false); // Reset the closing state after the modal is closed
        }, 300); // Match this duration to your animation duration
    };

    const handleTagClick = (tag) => {
        navigate(`/?tag=${tag}`); // Navigate to the HomePage with the tag as a query parameter
    };

    return (
        <>
            <Container maxWidth="lg"> {/* First part with maxWidth "lg" */}
                <Box sx={{ my: 4 }}>
                    <Typography variant="h3"
                        component="h1"
                        gutterBottom
                        style={{
                            fontSize: !isMobile ? '4rem' : '2.7rem',
                            fontWeight: 700,
                            color: '#1E293B',
                            textAlign: isMobile ? 'left' : null
                        }}>
                        {title}
                    </Typography>
                    <Typography variant="h3"
                        component="h1"
                        gutterBottom
                        style={{
                            fontSize: !isMobile ? '1.5rem' : '1rem',
                            fontWeight: 400,
                            color: '#475569',
                            textAlign: isMobile ? 'left' : null,
                            marginBottom: '2rem'
                        }}>
                        {subTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, ml: '2rem' }}>
                        {authors.map((author, index) => (
                            <Box key={index} sx={{ mr: -1, display: 'inline' }}>
                                <Avatar alt={author.name} src={author.image} sx={{ width: isMobile? 38:48, height: isMobile? 38:48, border: '2px solid white' }} />
                            </Box>
                        ))}
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3, mb: 1 }}>
                            <Typography variant="body2" color="#323949" sx={{ fontWeight: 600, fontSize: '15px', fontFamily: "'Lato', sans-serif", textAlign: isMobile? 'left' : null}} >
                                {authors.map((author, index) => (
                                    <span key={index}>
                                        {author.name}{index < authors.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif",textAlign: isMobile? 'left' : null }}>
                                {new Date(publishDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: !isMobile ? '1rem' : '0.8rem', fontWeight: 510, marginLeft: !isMobile ? '5rem' : '1rem', fontFamily: "'Lato', sans-serif", color: '#6F7683' }}>
                            {readTime} minutes read
                        </Typography>
                    </Box>
                    {mainImage && (
                        <Box component="img" src={mainImage} alt="Main Blog Post Image" sx={{ width: '100%', borderRadius: 2, mb: 2 }} />
                    )}
                </Box>
            </Container>

            <Container maxWidth="md"> {/* Content blocks part with maxWidth "md" */}
                <Typography variant="body1" component="div">
                    {contentBlocks.map((block, index) => {
                        // Check the type of content and render accordingly
                        switch (block.type) {
                            case 'text':
                                return <Typography sx={{
                                    fontSize: !isMobile ? '1.2rem' : '1rem',
                                    fontWeight: 400,
                                    color: '#475569',
                                    textAlign: 'left',
                                    marginBottom: '2rem',
                                    fontFamily: "'Lato', sans-serif"
                                }}
                                    key={block._id || index}>
                                    {block.content}
                                </Typography>;
                            case 'image':
                                return <CardMedia
                                    component="img"
                                    onClick={() => handleOpenModal(block.content)}
                                    src={block.content}
                                    alt={`Content Block ${index}`}
                                    sx={{
                                        width: '100%',
                                        borderRadius: 2,
                                        my: 5,
                                        boxShadow: '6',
                                        cursor: 'zoom-in',
                                        '&:hover': { opacity: 0.8 }
                                    }}
                                    key={block._id || index}
                                />;
                            case 'smallTitle':
                                return <Typography
                                    variant="body1"
                                    component="div"
                                    style={{
                                        fontSize: !isMobile ? '1.3rem' : '1rem',
                                        fontWeight: 700,
                                        marginBottom: '1rem',
                                        textAlign: 'left',
                                        fontFamily: "'Lato', sans-serif",
                                        color: '#374151'
                                    }}
                                    key={block._id || index}
                                    >
                                    {block.content}
                                </Typography>
                            case 'bigTitle':
                                return <Typography
                                    variant="body1"
                                    component="div"
                                    key={block._id || index}
                                    style={{
                                        fontSize: !isMobile ? '2rem' : '1.5rem',
                                        fontWeight: 700,
                                        marginBottom: '1rem',
                                        textAlign: 'left',
                                        fontFamily: "'Lato', sans-serif",
                                        color: '#374151'
                                    }}
                                >{block.content}
                                </Typography>
                            // Add more cases here for different types of content blocks you might have
                            default:
                                return null;
                        }
                    })}
                </Typography>

                {/* Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    <Typography sx={{ color: '#949AA3', textAlign: 'left', fontFamily: "'Lato', sans-serif", mr: '1.1rem', fontWeight: 600 }}>
                        Tags
                    </Typography>
                    {tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={'#' + tag}
                            variant="outlined"
                            onClick={() => handleTagClick(tag)}
                            sx={{
                                mb: '1rem',
                                fontSize: '0.875rem',
                                fontFamily: "'Lato', sans-serif",
                                color: '#7C899E',
                                fontWeight: 505,
                                display: 'flex',
                                alignItems: 'center', // Ensures vertical center alignment
                                justifyContent: 'center', // Ensures horizontal center alignment
                                height: 'auto', // Adjusts height based on content
                                paddingY: '0.25rem',
                                backgroundColor: '#F1F5F9',
                                mr: '0.5rem'
                            }} />
                    ))}
                </Box>
            </Container>

            {/* Modal for enlarged image */}
            <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box
                    onClick={handleCloseModal}
                    sx={{
                        outline: 'none',
                        animation: isClosing ? 'shrink 0.3s ease-in-out forwards' : 'grow 0.3s ease-in-out forwards',
                        '@keyframes grow': {
                            '0%': { transform: 'scale(0)' },
                            '100%': { transform: 'scale(1)' }
                        },
                        '@keyframes shrink': {
                            '0%': { transform: 'scale(1)' },
                            '100%': { transform: 'scale(0)' }
                        }
                    }}>
                    <img src={selectedImage} alt="Enlarged Blog" style={{ maxWidth: '100%', maxHeight: '90vh', cursor: 'zoom-out' }} />
                </Box>
            </Modal>
        </>
    );
}

export default FullBlogPost;
