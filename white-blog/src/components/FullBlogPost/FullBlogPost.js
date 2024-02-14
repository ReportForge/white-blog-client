import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogPostById } from '../../api/api'; // Adjust the import path as necessary
import { Container, Typography, Box, Avatar, CardMedia, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function FullBlogPost() {
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                                <Avatar alt={author.name} src={author.image} sx={{ width: 48, height: 48, border: '2px solid white' }} />
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
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif", }}>
                                {new Date(publishDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', fontWeight: 510, marginLeft: '5rem', fontFamily: "'Lato', sans-serif", color: '#6F7683' }}>
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
                                    fontSize: !isMobile ? '1.2rem' : '0.5rem',
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
                                return <CardMedia component="img" src={block.content} alt={`Content Block ${index}`} sx={{ width: '100%', borderRadius: 2, my: 5, boxShadow: '6' }} key={block._id || index} />;
                            case 'smallTitle':
                                return <Typography
                                    variant="body1"
                                    component="div"
                                    style={{
                                        fontSize: !isMobile ? '1.3rem' : '0.5rem',
                                        fontWeight: 700,
                                        marginBottom: '1rem',
                                        textAlign: 'left',
                                        fontFamily: "'Lato', sans-serif",
                                        color: '#374151'
                                    }}>
                                    {block.content}
                                </Typography>
                            case 'bigTitle':
                                return <Typography
                                    variant="body1"
                                    component="div"
                                    style={{
                                        fontSize: !isMobile ? '2rem' : '1.5rem',
                                        fontWeight: 700,
                                        color: '#1E293B',
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
                        <Chip key={index} label={'#' + tag} variant="outlined" sx={{
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
        </>
    );
}

export default FullBlogPost;
