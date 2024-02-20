import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogPostById, updateBlogPost } from '../../api/api'; // Adjust the import path as necessary
import { Container, Typography, Box, Avatar, CardMedia, Chip, Modal, CircularProgress, Button, TextField, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

function FullBlogPost() {
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedFields, setEditedFields] = useState({});
    const [activeSection, setActiveSection] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMobileOrMedium = useMediaQuery(theme.breakpoints.down('xl'));
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

    useEffect(() => {
        const handleScroll = () => {
            const mainImage = document.getElementById('main-image');
            const tocElement = document.getElementById('toc');

            // Check if both elements exist before accessing their properties
            if (mainImage && tocElement) {
                const mainImageBottom = mainImage.getBoundingClientRect().bottom + window.scrollY;

                if (window.scrollY > mainImageBottom) {
                    tocElement.style.position = 'fixed';
                    tocElement.style.top = '20px'; // Adjust this value as needed
                } else {
                    tocElement.style.position = 'static';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleChange = (field, value) => {
        setEditedFields({ ...editedFields, [field]: value });
    };

    const handleSave = async (field) => {
        const token = localStorage.getItem('token'); // Assuming you're storing the auth token in localStorage
        if (field === 'contentBlocks') {
            // When saving contentBlocks, use the editedFields.contentBlocks array
            if (editedFields.contentBlocks && editedFields.contentBlocks.length > 0) {
                try {
                    await updateBlogPost(id, { contentBlocks: editedFields.contentBlocks }, token); // Update the contentBlocks field in your API
                    setBlogPost({ ...blogPost, contentBlocks: editedFields.contentBlocks }); // Update local state to reflect the saved changes
                    setEditedFields({ ...editedFields, contentBlocks: undefined }); // Clear the edited state for contentBlocks
                    setEditMode(false); // Optionally exit edit mode upon successful save
                } catch (error) {
                    console.error('Failed to update content blocks:', error);
                }
            }
        } else {
            // Handle saving other fields similarly to how you've done before
            const updatedValue = editedFields[field];
            if (updatedValue !== undefined && updatedValue !== blogPost[field]) {
                try {
                    await updateBlogPost(id, { [field]: updatedValue }, token); // Update the specific field in your API
                    setBlogPost({ ...blogPost, [field]: updatedValue }); // Update local state
                    setEditedFields({ ...editedFields, [field]: undefined }); // Clear edited state for the field
                    setEditMode(false); // Optionally exit edit mode
                } catch (error) {
                    console.error(`Failed to update blog post's ${field}:`, error);
                }
            }
        }
    };


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const token = localStorage.getItem('token'); // Assuming you're storing the auth token in localStorage
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                handleChange('mainImage', e.target.result);
                await updateBlogPost(id, { 'mainImage': e.target.result }, token);
                setBlogPost({ ...blogPost, 'mainImage': e.target.result });
                setEditedFields({ ...editedFields, 'mainImage': undefined }); // Clear edited state for the field
                setEditMode(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleContentBlockImageUpload = (e, index) => {
        const file = e.target.files[0];
        const token = localStorage.getItem('token'); // Assuming you're storing the auth token in localStorage
    
        if (file) {
            // Ideally, you should upload the file to your server or a cloud storage service to get a URL.
            // For demonstration, we'll use FileReader to simulate this process.
            const reader = new FileReader();
            reader.onload = async (e) => {
                // Simulated upload: In a real app, replace this with an actual upload function,
                // and use the URL from the server/cloud storage instead of `e.target.result`.
                const imageUrl = e.target.result; // This should be the URL from your upload function
    
                // Update the specific content block with the new image URL
                const updatedBlocks = [...contentBlocks];
                updatedBlocks[index].content = imageUrl;
    
                // Update the edited fields and the local state
                setEditedFields({ ...editedFields, contentBlocks: updatedBlocks });
    
                // Optionally, you can save the blog post immediately after updating the image
                // or you can let the user manually trigger the save for all changes at once
                await updateBlogPost(id, { contentBlocks: updatedBlocks }, token);
                setBlogPost({ ...blogPost, contentBlocks: updatedBlocks });
                setEditedFields({ ...editedFields, contentBlocks: undefined }); // Clear edited state for the field
                setEditMode(false);
            };
    
            reader.readAsDataURL(file); // This is just for simulation; replace with actual upload logic
        }
    };
    

    if (!blogPost) {
        return <Box
            display="flex"
            key={'loading'}
            justifyContent="center"
            alignItems="center"
            minHeight="100vh" // Adjust the height as needed
        >
            <CircularProgress
                size={60} // Adjust the size as needed
                style={{ color: '#204EB7' }} // Change the color using MUI's color system or custom CSS
            />
        </Box>; // Or any other loading indicator
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

    const titlesForToC = contentBlocks.filter(block => block.type === 'bigTitle' || block.type === 'smallTitle').map((block, index) => ({
        id: `title-${block.content}`, // Unique ID for scrolling
        type: block.type,
        content: block.content,
    }));

    const scrollToSection = (id) => {
        setActiveSection(id);
        const section = document.getElementById(id);

        if (section) {
            const sectionTop = section.getBoundingClientRect().top;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const offset = 100; // Adjust the offset as needed

            // Calculate the target position
            const targetPosition = sectionTop + scrollTop - offset;

            // Smoothly scroll to the target position
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };


    return (
        <>

            <Container maxWidth="lg"> {/* First part with maxWidth "lg" */}
                <Box marginTop='2rem'>{user.isEditor && <IconButton sx={{ color: '#2c5ee8' }} onClick={handleEditToggle}><EditIcon /></IconButton>}</Box>
                <Box sx={{ my: 4 }}>
                    {/* Title */}
                    {editMode ? (
                        <>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Title"
                                defaultValue={title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                InputProps={{
                                    style: { fontSize: '3rem', fontWeight: 700, fontFamily: "'Lato', sans-serif" },
                                }}
                            />
                            <IconButton onClick={() => handleSave('title')}>
                                <SaveIcon />
                            </IconButton>
                        </>
                    ) : (
                        <Typography variant="h3"
                            component="h1"
                            gutterBottom
                            style={{
                                fontSize: !isMobile ? '4rem' : '2.7rem',
                                fontWeight: 700,
                                color: '#1E293B',
                                textAlign: isMobile ? 'left' : null,
                                fontFamily: "'Lato', sans-serif"
                            }}>
                            {title}

                        </Typography>
                    )}
                    {/* Subtitle */}
                    {editMode ? (
                        <>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Title"
                                defaultValue={subTitle}
                                onChange={(e) => handleChange('title', e.target.value)}
                                InputProps={{
                                    style: {
                                        fontSize: !isMobile ? '1.5rem' : '1rem',
                                        fontWeight: 400,
                                        color: '#475569',
                                        textAlign: isMobile ? 'left' : null,
                                        marginBottom: '2rem',
                                        fontFamily: "'Lato', sans-serif"
                                    }
                                }}
                            />
                            <IconButton onClick={() => handleSave('title')}>
                                <SaveIcon />
                            </IconButton>
                        </>
                    ) : (
                        <Typography variant="h3"
                            component="h1"
                            gutterBottom
                            style={{
                                fontSize: !isMobile ? '1.5rem' : '1rem',
                                fontWeight: 400,
                                color: '#475569',
                                textAlign: isMobile ? 'left' : null,
                                marginBottom: '2rem',
                                fontFamily: "'Lato', sans-serif"
                            }}>
                            {subTitle}

                        </Typography>
                    )}
                    {/* Authors */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, ml: '2rem' }}>
                        {authors.map((author, index) => (
                            <Box key={index} sx={{ mr: -1, display: 'inline' }}>
                                <Avatar alt={author.name} src={author.image} sx={{ width: isMobile ? 38 : 48, height: isMobile ? 38 : 48, border: '2px solid white' }} />
                            </Box>
                        ))}
                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3, mb: 1 }}>
                            <Typography variant="body2" color="#323949" sx={{ fontWeight: 600, fontSize: '15px', fontFamily: "'Lato', sans-serif", textAlign: isMobile ? 'left' : null }} >
                                {authors.map((author, index) => (
                                    <span key={index}>
                                        {author.name}{index < authors.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "'Lato', sans-serif", textAlign: isMobile ? 'left' : null }}>
                                {new Date(publishDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: !isMobile ? '1rem' : '0.8rem', fontWeight: 510, marginLeft: !isMobile ? '5rem' : '1rem', fontFamily: "'Lato', sans-serif", color: '#6F7683' }}>
                            {readTime} minutes read
                        </Typography>
                    </Box>
                    {/* mainImage */}
                    {editMode ? (
                        <>
                            <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                                {blogPost.mainImage ? (
                                    <img src={blogPost.mainImage} alt="Main" style={{ position: 'absolute', top: 0, left: 0, width: '960px', height: '540px', objectFit: 'cover' }} />
                                ) : (
                                    <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Upload an Image</Typography>
                                )}
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Button component="label">
                                    Upload New Image
                                    <input
                                        accept="image/*"
                                        type="file"
                                        hidden
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                        id="image-upload"
                                    />
                                </Button>
                            </Box>
                        </>
                    ) : (
                        mainImage && (
                            <>
                                <Box component="img" src={mainImage} alt="Main Blog Post Image" id="main-image" sx={{ width: '100%', borderRadius: 2, mb: 2 }} />
                                <Box></Box>
                            </>
                        )
                    )}
                </Box>
            </Container>
            {/* contentBlocks */}
            <Container maxWidth="md"> {/* Content blocks part with maxWidth "md" */}
                <Typography variant="body1" component="div">
                    {contentBlocks.map((block, index) => {
                        // Check the type of content and render accordingly
                        switch (block.type) {
                            case 'text':
                                return editMode ? (
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                        <TextField
                                            fullWidth
                                            key={block._id || index}
                                            variant="outlined"
                                            multiline
                                            minRows={3} // Adjust based on your preference
                                            defaultValue={block.content}
                                            onChange={(e) => {
                                                // Create a deep copy of contentBlocks and update the content of the current block
                                                const updatedBlocks = [...contentBlocks];
                                                updatedBlocks[index].content = e.target.value;
                                                setEditedFields({ ...editedFields, contentBlocks: updatedBlocks });
                                            }}
                                            InputProps={{
                                                sx: {
                                                    fontSize: !isMobile ? '1.2rem' : '1rem',
                                                    fontWeight: 400,
                                                    color: '#475569',
                                                    marginBottom: '2rem',
                                                    fontFamily: "'Lato', sans-serif",
                                                }
                                            }}
                                        />
                                        <IconButton onClick={() => handleSave('contentBlocks')}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Box>
                                ) : <Typography sx={{
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
                                return editMode ? (
                                    <>
                                        <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                                            {block.content ? (
                                                <img src={block.content} alt="Main" style={{ position: 'absolute', top: 0, left: 0, width: '960px', height: '540px', objectFit: 'cover' }} />
                                            ) : (
                                                <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Upload an Image</Typography>
                                            )}
                                        </Box>
                                        <Box sx={{ mt: 2 }}>
                                            <Button component="label">
                                                Upload New Image
                                                <input
                                                    accept="image/*"
                                                    type="file"
                                                    hidden
                                                    onChange={(e) => handleContentBlockImageUpload(e, index)}
                                                    style={{ display: 'none' }}
                                                    id="image-upload"
                                                />
                                            </Button>
                                        </Box>
                                    </>
                                ) : <CardMedia
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
                                return editMode ? (
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                        <TextField
                                            fullWidth
                                            key={block._id || index}
                                            variant="outlined"
                                            multiline
                                            minRows={3} // Adjust based on your preference
                                            defaultValue={block.content}
                                            onChange={(e) => {
                                                // Create a deep copy of contentBlocks and update the content of the current block
                                                const updatedBlocks = [...contentBlocks];
                                                updatedBlocks[index].content = e.target.value;
                                                setEditedFields({ ...editedFields, contentBlocks: updatedBlocks });
                                            }}
                                            InputProps={{
                                                sx: {
                                                    fontSize: !isMobile ? '1.3rem' : '1rem',
                                                    fontWeight: 700,
                                                    marginBottom: '1rem',
                                                    textAlign: 'left',
                                                    fontFamily: "'Lato', sans-serif",
                                                    color: '#374151'
                                                }
                                            }}
                                        />
                                        <IconButton onClick={() => handleSave('contentBlocks')}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Box>
                                ) : <Typography
                                    variant="body1"
                                    component="div"
                                    id={`title-${block.content}`}
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
                                return editMode ? (
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                        <TextField
                                            fullWidth
                                            key={block._id || index}
                                            variant="outlined"
                                            multiline
                                            minRows={3} // Adjust based on your preference
                                            defaultValue={block.content}
                                            onChange={(e) => {
                                                // Create a deep copy of contentBlocks and update the content of the current block
                                                const updatedBlocks = [...contentBlocks];
                                                updatedBlocks[index].content = e.target.value;
                                                setEditedFields({ ...editedFields, contentBlocks: updatedBlocks });
                                            }}
                                            inputProps={{
                                                style: {
                                                    fontSize: !isMobile ? '2rem' : '1.5rem',
                                                    fontWeight: 700,
                                                    marginBottom: '1rem',
                                                    textAlign: 'left',
                                                    fontFamily: "'Lato', sans-serif",
                                                    color: '#374151'
                                                }
                                            }}
                                        />
                                        <IconButton onClick={() => handleSave('contentBlocks')}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Box>
                                ) : <Typography
                                    variant="body1"
                                    component="div"
                                    id={`title-${block.content}`}
                                    key={block._id || index}
                                    style={{
                                        fontSize: !isMobile ? '2rem' : '1.5rem',
                                        fontWeight: 700,
                                        marginBottom: '1rem',
                                        textAlign: 'left',
                                        fontFamily: "'Lato', sans-serif",
                                        color: '#374151'
                                    }}
                                >
                                    {block.content}

                                </Typography>
                            // Inside the switch statement in your contentBlocks.map
                            case 'bullet':
                                return editMode ? (
                                    <Box key={block._id || index} sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        marginBottom: '0.5rem',
                                        '&:before': {
                                            content: '"•"', // Bullet point character
                                            display: 'inline-block',
                                            marginRight: '8px', // Space between bullet and text
                                            color: '#2C5EE8', // Example: change bullet point color
                                            fontWeight: 'bold', // Example: make bullet point bold
                                            fontSize: '1.3rem', // // Bullet size, adjust as needed
                                            lineHeight: 'inherit', // Align bullet with text
                                        }
                                    }}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            key={block._id || index}
                                            minRows={3} // Adjust based on your preference
                                            defaultValue={block.content}
                                            onChange={(e) => {
                                                // Create a deep copy of contentBlocks and update the content of the current block
                                                const updatedBlocks = [...contentBlocks];
                                                updatedBlocks[index].content = e.target.value;
                                                setEditedFields({ ...editedFields, contentBlocks: updatedBlocks });
                                            }}
                                            inputProps={{
                                                sx: {
                                                    fontSize: !isMobile ? '1.2rem' : '1rem',
                                                    fontWeight: 400,
                                                    color: '#475569',
                                                    textAlign: 'left',
                                                    fontFamily: "'Lato', sans-serif"
                                                }
                                            }}
                                        />
                                        <IconButton onClick={() => handleSave('contentBlocks')}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Box key={block._id || index} sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        marginBottom: '0.5rem',
                                        '&:before': {
                                            content: '"•"', // Bullet point character
                                            display: 'inline-block',
                                            marginRight: '8px', // Space between bullet and text
                                            color: '#2C5EE8', // Example: change bullet point color
                                            fontWeight: 'bold', // Example: make bullet point bold
                                            fontSize: '1.3rem', // // Bullet size, adjust as needed
                                            lineHeight: 'inherit', // Align bullet with text
                                        }
                                    }}>
                                        <Typography sx={{
                                            fontSize: !isMobile ? '1.2rem' : '1rem',
                                            fontWeight: 400,
                                            color: '#475569',
                                            textAlign: 'left',
                                            fontFamily: "'Lato', sans-serif"
                                        }}>
                                            {block.content}

                                        </Typography>
                                    </Box>
                                );
                            case 'script':
                                return editMode ? (
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                        <TextField
                                            fullWidth
                                            key={block._id || index}
                                            variant="outlined"
                                            multiline
                                            minRows={3} // Adjust based on your preference
                                            defaultValue={block.content}
                                            onChange={(e) => {
                                                // Create a deep copy of contentBlocks and update the content of the current block
                                                const updatedBlocks = [...contentBlocks];
                                                updatedBlocks[index].content = e.target.value;
                                                setEditedFields({ ...editedFields, contentBlocks: updatedBlocks });
                                            }}
                                            inputProps={{
                                                sx: {
                                                    backgroundColor: '#F3F5FD',
                                                    color: '#3C6AEA',
                                                    padding: '16px',
                                                    borderRadius: '8px',
                                                    fontFamily: 'monospace',
                                                    fontSize: !isMobile ? '1rem' : '0.875rem',
                                                    whiteSpace: 'pre-wrap', // To ensure the script respects newline characters
                                                    marginBottom: '2rem',
                                                    overflowX: 'auto', // In case the script is wider than the container
                                                }
                                            }}
                                        />
                                        <IconButton onClick={() => handleSave('contentBlocks')}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Box
                                        key={block._id || index}
                                        sx={{
                                            backgroundColor: '#F3F5FD',
                                            color: '#3C6AEA',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            fontFamily: 'monospace',
                                            fontSize: !isMobile ? '1rem' : '0.875rem',
                                            whiteSpace: 'pre-wrap', // To ensure the script respects newline characters
                                            marginBottom: '2rem',
                                            overflowX: 'auto', // In case the script is wider than the container
                                        }}
                                    >
                                        {block.content}

                                    </Box>
                                );

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
            {/* Conditionally render ToC */}
            {!isMobileOrMedium && !editMode ? (
                <Box id="toc" sx={{ width: 200, maxHeight: '60vh', overflowY: 'auto', textAlign: 'left', marginLeft: '5rem', marginTop: '6rem', fontFamily: "'Lato', sans-serif" }}>
                    <Typography sx={{ color: '#64748B', textAlign: 'left', mr: '1.1rem', fontWeight: 600, mb: '1rem' }}>Contents</Typography>
                    {titlesForToC.map((title, index) => (
                        <Typography
                            key={index}
                            sx={{
                                '&:hover': { color: '#0f172a' },
                                color: activeSection === title.id ? '#0f172a' : '#8D919A', // Change color if active
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                mb: 2,
                                pl: '5px', // Add space for the blue line
                                borderLeft: activeSection === title.id ? '3px solid blue' : 'none', // Add blue line if active
                                ...(title.type === 'bigTitle' ? { fontWeight: 'bold' } : {})
                            }}
                            onClick={() => scrollToSection(title.id)}
                        >
                            {title.content}
                        </Typography>
                    ))}
                </Box>
            ):(null)}
        </>
    );
}

export default FullBlogPost;
