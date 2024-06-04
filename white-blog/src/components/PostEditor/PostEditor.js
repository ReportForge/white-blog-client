import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Grid,
  CircularProgress,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { createBlogPost, saveDraftBlogPost, fetchDraftBlogPost, deleteDraftBlogPost } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const formatName = (firstName, lastName) => {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return `${capitalize(firstName || '')} ${capitalize(lastName || '')}`.trim();
};

function PostEditor() {

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [blogPost, setBlogPost] = useState({
    title: '',
    subTitle: '',
    authors: [{ name: formatName(user.firstName, user.lastName) || '', image: user.profilePicture || '' }],
    publishDate: new Date(),
    readTime: '',
    tags: [''],
    mainImage: '',
    contentBlocks: [{ type: 'text', content: '' }],
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isTitleInvalid, setIsTitleInvalid] = useState(false);
  const [isFirstAuthor, setIsFirstAuthor] = useState(true);

  const titleRef = useRef(null);



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, user not logged in');
      return;
    }

    const loadDraft = async () => {
      setLoading(true);
      try {
        const draft = await fetchDraftBlogPost(token);
        if (draft) {
          setBlogPost({ ...draft, publishDate: new Date(draft.publishDate) });
        }
      } catch (error) {
        console.error('Error fetching draft:', error.message);
      } finally {
        setLoading(false); // Stop loading regardless of the outcome
      }
    };

    loadDraft();

    // After loading the draft, update the first author with the connected user's details
    // updateAuthor(0, 'name', formatName(user.firstName, user.lastName) || '');
    // updateAuthor(0, 'image', user.profilePicture || '');

  }, []); // Depend on 'user' to ensure this effect runs when the user's information changes


  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveDraftWithoutNavigate();
    }, 30000); // 60000 milliseconds = 1 minute

    return () => clearInterval(autoSaveInterval); // Cleanup interval on component unmount
  }); // Dependency array, auto-save will trigger when blogPost changes


  const handleInputChange = (e, index, field, subField = null) => {
    const newBlogPost = { ...blogPost };
    if (field === 'contentBlocks' && subField) {
      // Update only the specified subField ('content') of the content block at the given index
      newBlogPost[field] = blogPost[field].map((block, idx) => {
        if (idx === index) {
          return { ...block, [subField]: e.target.value };
        }
        return block;
      });
    } else if (Array.isArray(blogPost[field])) {
      // Handle array updates for fields like 'tags'
      newBlogPost[field] = blogPost[field].map((item, idx) =>
        idx === index ? e.target.value : item
      );
    } else {
      // Handle updates for simple fields
      newBlogPost[field] = e.target.value;
    }

    setBlogPost(newBlogPost);
  };

  const saveDraft = async () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!blogPost.title.trim()) {
      setIsTitleInvalid(true);
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return; // Prevent the form submission
    }

    if (!user || !token) {
      console.error('User not logged in');
      // Redirect to login or show an error
      return;
    }

    try {
      const draftData = { ...blogPost, userId: JSON.parse(user).id };
      await saveDraftBlogPost(draftData, token);
      navigate('/'); // Redirect to home after saving the draft
    } catch (error) {
      console.error('Error saving draft:', error.message);
      // Handle error, maybe show a message to the user
    }
  };

  const saveDraftWithoutNavigate = async () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!blogPost.title.trim()) {
      setBlogPost({ ...blogPost, title: 'Draft' })
      return; // Prevent the form submission
    }

    if (!user || !token) {
      console.error('User not logged in');
      // Redirect to login or show an error
      return;
    }

    try {
      const draftData = { ...blogPost, userId: JSON.parse(user).id };
      await saveDraftBlogPost(draftData, token);
    } catch (error) {
      console.error('Error saving draft:', error.message);
      // Handle error, maybe show a message to the user
    }
  };


  const addAuthor = () => {
    setBlogPost(prevState => ({
      ...prevState,
      authors: [...prevState.authors, { name: '', image: '' }]
    }));
    setIsFirstAuthor(false);
  };

  const removeAuthor = (index) => {
    setBlogPost(prevState => ({
      ...prevState,
      authors: prevState.authors.filter((author, i) => i !== index)
    }));
  };

  const updateAuthor = (index, field, value) => {
    // Helper function to capitalize the first letter of every word
    const capitalizeWords = (str) => {
      return str.replace(/\b(\w)/g, s => s.toUpperCase()); // Capitalize the first letter of each word
    };

    setBlogPost(prevState => {
      const updatedAuthors = [...prevState.authors];

      // Check if the field being updated is 'name', and if so, apply the capitalizeWords function
      if (field === 'name') {
        updatedAuthors[index][field] = capitalizeWords(value);
      } else {
        updatedAuthors[index][field] = value;
      }

      return { ...prevState, authors: updatedAuthors };
    });
  };


  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBlogPost(prevState => {
        const updatedAuthors = [...prevState.authors];
        updatedAuthors[index].image = reader.result;
        return { ...prevState, authors: updatedAuthors };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBlogPost({ ...blogPost, mainImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    const newBlogPost = { ...blogPost };
    newBlogPost.tags.push('');
    setBlogPost(newBlogPost);
  };

  const removeTag = (index) => {
    const newBlogPost = { ...blogPost };
    newBlogPost.tags.splice(index, 1);
    setBlogPost(newBlogPost);
  };

  const addContentBlock = () => {
    const newBlogPost = { ...blogPost };
    newBlogPost.contentBlocks.push({ type: 'text', content: '' });
    setBlogPost(newBlogPost);
  };

  const removeContentBlock = (index) => {
    const newBlogPost = { ...blogPost };
    newBlogPost.contentBlocks.splice(index, 1);
    setBlogPost(newBlogPost);
  };

  const handleContentBlockTypeChange = (index, newType) => {
    const updatedContentBlocks = blogPost.contentBlocks.map((block, idx) => {
      if (idx === index) {
        return { ...block, type: newType, content: newType === 'image' ? '' : block.content }; // Reset content for image type
      }
      return block;
    });

    setBlogPost({ ...blogPost, contentBlocks: updatedContentBlocks });
  };

  const handleContentChange = (index, value) => {
    setBlogPost(prevState => {
      const updatedBlocks = [...prevState.contentBlocks];
      updatedBlocks[index].content = value;
      return { ...prevState, contentBlocks: updatedBlocks };
    });
  };

  const handleContentBlockImageChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBlogPost(prevState => {
        const updatedBlocks = [...prevState.contentBlocks];
        updatedBlocks[index].content = reader.result;
        return { ...prevState, contentBlocks: updatedBlocks };
      });
    };
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!blogPost.title.trim()) {
      setIsTitleInvalid(true);
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return; // Prevent the form submission
    }

    if (!token) {
      console.error('No token found');
      return;
    }

    // Destructure the userId and _id property out and keep the rest of the properties in a new object
    // Also, explicitly set isDraft to false to indicate this is a final post
    const { userId, _id, ...postData } = blogPost;
    const finalPostData = { ...postData, isDraft: false }; // Add isDraft: false to the postData

    try {
      const response = await createBlogPost(finalPostData, token); // Use finalPostData with isDraft set to false
      console.log('Post created successfully:', response);

      // After successful post creation, delete the draft
      try {
        await deleteDraftBlogPost(token);
        console.log('Draft deleted successfully');
      } catch (deleteError) {
        console.error('Error deleting draft:', deleteError.message);
      }

      navigate('/'); // Redirect to home
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };



  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh" // Adjust the height as needed
      >
        <CircularProgress
          size={60} // Adjust the size as needed
          style={{ color: '#204EB7' }} // Change the color using MUI's color system or custom CSS
        />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h5" gutterBottom>
        Create Blog Post
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {/* Title */}
        <Box sx={{ '& .MuiTextField-root': { marginBottom: '2rem' } }}>
          <TextField
            label="Title"
            fullWidth
            ref={titleRef}
            margin="normal"
            variant="standard"
            value={blogPost.title}
            multiline
            error={isTitleInvalid}
            helperText={isTitleInvalid ? "Title is required" : ""}
            InputProps={{
              style: { fontSize: '3rem', fontWeight: 700 },
            }}
            onChange={(e) => setBlogPost({ ...blogPost, title: e.target.value })}
          />
        </Box>
        {/* subTitle */}
        <Box sx={{ '& .MuiTextField-root': { marginBottom: '2rem' } }}>
          <TextField
            label="Subtitle"
            fullWidth
            margin="normal"
            variant="standard"
            value={blogPost.subTitle}
            multiline
            InputProps={{
              style: { fontSize: '1.125rem', fontWeight: 400, color: '#475569' },
            }}
            onChange={(e) => setBlogPost({ ...blogPost, subTitle: e.target.value })}
          />
        </Box>
        {/* Authors */}
        {blogPost.authors.map((author, index) => (
          <Box key={index} style={{ display: 'flex', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Avatar src={author.image} alt="Author" style={{ width: 60, height: 60 }} key={author.image} />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id={`icon-button-file-${index}`}
                type="file"
                onChange={(event) => handleImageChange(index, event)}
              />
              <label htmlFor={`icon-button-file-${index}`}>
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </div>
            <TextField
              label="Author Name"
              value={author.name}
              variant="standard"
              onChange={(e) => updateAuthor(index, 'name', e.target.value)}
              style={{ marginRight: 8 }}
              InputProps={{
                style: { fontWeight: 'bold', fontSize: '15px' },
              }}
            />
            {!isFirstAuthor ? <IconButton onClick={() => removeAuthor(index)}>
              <RemoveCircleOutlineIcon />
            </IconButton> : null}
            {index === blogPost.authors.length - 1 && (
              <IconButton onClick={addAuthor}>
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}
        {/* Date */}
        <TextField
          label="Publish Date"
          type="date"
          value={blogPost.publishDate.toISOString().split('T')[0]} // Format the date to YYYY-MM-DD
          onChange={(e) => setBlogPost({ ...blogPost, publishDate: new Date(e.target.value) })}
          sx={{ marginTop: '2rem' }}
          InputLabelProps={{
            shrink: true, // This ensures the label doesn't overlap the date value
          }}
          fullWidth
        />
        {/* Read Time */}
        <TextField
          label="Read Time"
          value={blogPost.readTime}
          onChange={(e) => setBlogPost({ ...blogPost, readTime: e.target.value })}
          sx={{ marginTop: '2rem' }}
          helperText="e.g., '5 min'"
          fullWidth
        />
        {/* Tags */}
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          Tags
        </Typography>
        <Grid container spacing={1} alignItems="center">
          {blogPost.tags.map((tag, index) => (
            <Grid item key={index}>
              <TextField
                label="Tag"
                value={tag}
                onChange={(e) => handleInputChange(e, index, 'tags')}
              />
              {blogPost.tags.length > 1 && (
                <IconButton onClick={() => removeTag(index)}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
              <IconButton onClick={addTag}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
          ))}
        </Grid>


        {/* Main Image */}
        <Box sx={{ marginBottom: '2rem' }}>
          <Typography variant="h6">Main Image</Typography>
          <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
            {blogPost.mainImage ? (
              <img src={blogPost.mainImage} alt="Main" style={{ position: 'absolute', top: 0, left: 0, width: '960px', height: '540px', objectFit: 'cover' }} />
            ) : (
              <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Upload an Image</Typography>
            )}
          </Box>
          <input
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span" sx={{ backgroundColor: '#416EEA', '&:hover': { backgroundColor: '#365FBE' }, borderRadius: '20px' }}>
              Upload
            </Button>
          </label>
        </Box>


        {/* Content Blocks */}
        {blogPost.contentBlocks.map((block, index) => (
          <Box key={index}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={block.type}
                label="Type"
                onChange={(e) => handleContentBlockTypeChange(index, e.target.value)}
                style={{ marginBottom: '2rem' }}
              >
                <MenuItem value="bigTitle">Big Title</MenuItem>
                <MenuItem value="smallTitle">Small Title</MenuItem>
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="text">Text Paragraph</MenuItem>
                <MenuItem value="bullet">Bullet Point</MenuItem>
                <MenuItem value="script">Script</MenuItem>
              </Select>
            </FormControl>


            {block.type === 'image' ? (
              <Box>
                {block.content && (
                  <img src={block.content} alt="Content Block" style={{ width: '720px', maxHeight: '350px', objectFit: 'contain' }} />
                )}
                <input
                  accept="image/*"
                  type="file"
                  style={{ display: 'none' }}
                  id={`content-block-image-${index}`}
                  onChange={(event) => handleContentBlockImageChange(index, event)}
                />
                <label htmlFor={`content-block-image-${index}`}>
                  <Button variant="contained" component="span" sx={{ backgroundColor: '#416EEA', '&:hover': { backgroundColor: '#365FBE' }, borderRadius: '20px' }}>
                    Upload Image
                  </Button>
                </label>
              </Box>
            ) : block.type === 'bullet' ? (
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box sx={{
                  '&:before': {
                    content: '"•"', // This is the bullet point character
                    display: 'inline-block',
                    marginRight: '8px', // Adjust spacing between the bullet and the text
                    marginTop: '20px', // Adjust to align with the TextField, might need further adjustment
                    color: '#0043ff', // Example: change bullet point color
                    fontWeight: 'bold', // Example: make bullet point bold
                    fontSize: '1.5rem', //
                  }
                }} />
                <TextField
                  label="Bullet Point"
                  fullWidth
                  multiline
                  variant="standard"
                  value={block.content}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  InputProps={{
                    style: {
                      fontWeight: 400,
                      fontSize: '1rem',
                    },
                  }}
                />
              </Box>
            ) : block.type === 'script' ? (
              <Box
                sx={{
                  backgroundColor: '#F3F5FD',
                  color: '#3C6AEA',
                  padding: '16px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap', // To ensure the script respects newline characters
                  marginBottom: '2rem',
                }}
              >
                <TextField
                  label="Script"
                  fullWidth
                  multiline
                  variant="standard"
                  value={block.content}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  InputProps={{
                    style: {
                      fontWeight: 400,
                      fontSize: '1rem',
                      color: '#0043ff'
                    },
                  }}
                />
              </Box>
            ) : (
              <TextField
                label={block.type === 'bigTitle' || block.type === 'smallTitle' ? "Title" : "Content"}
                fullWidth
                multiline={block.type === 'text'}
                rows={block.type === 'text' ? 4 : 1}
                value={block.content}
                onChange={(e) => handleContentChange(index, e.target.value)}
                InputProps={{
                  style: {
                    fontWeight: block.type === 'bigTitle' ? 800 : block.type === 'smallTitle' ? 700 : 400,
                    fontSize: block.type === 'bigTitle' ? '2.25em' : block.type === 'smallTitle' ? '1.5rem' : '1rem',
                  },
                }}
              />
            )}


            {blogPost.contentBlocks.length > 1 && (
              <IconButton onClick={() => removeContentBlock(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
            {index === blogPost.contentBlocks.length - 1 && (
              <IconButton onClick={addContentBlock}>
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}

        <Button type="button" variant="outlined" sx={{ mt: 3, mb: 2, mr: 2, borderRadius: '20px' }} onClick={saveDraft}>
          Save for Now
        </Button>
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: '#416EEA', '&:hover': { backgroundColor: '#365FBE' }, borderRadius: '20px' }} >
          Create Post
        </Button>
      </Box>
    </Container >
  );
}

export default PostEditor;
