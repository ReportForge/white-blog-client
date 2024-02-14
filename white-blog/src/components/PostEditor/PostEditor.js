import React, { useState } from 'react';
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
  Grid
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { createBlogPost } from '../../api/api';


function PostEditor() {
  const [blogPost, setBlogPost] = useState({
    title: '',
    subTitle: '',
    authors: [{ name: '', image: '' }],
    publishDate: new Date(),
    readTime: '',
    tags: [''],
    mainImage: '',
    contentBlocks: [{ type: 'text', content: '' }],
  });

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


  const addAuthor = () => {
    setBlogPost(prevState => ({
      ...prevState,
      authors: [...prevState.authors, { name: '', image: '' }]
    }));
  };

  const removeAuthor = (index) => {
    setBlogPost(prevState => ({
      ...prevState,
      authors: prevState.authors.filter((author, i) => i !== index)
    }));
  };

  const updateAuthor = (index, field, value) => {
    setBlogPost(prevState => {
      const updatedAuthors = [...prevState.authors];
      updatedAuthors[index][field] = value;
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
  
    // Retrieve the authentication token from where you store it, e.g., localStorage
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No token found');
      // Handle the absence of a token, e.g., redirect to login page
      return;
    }
  
    // API call to create a new blog post
    try {
      const response = await createBlogPost(blogPost, token);
   // blogPost is your state variable holding the post data
      console.log('Post created successfully:', response);
  
      // Here you can handle what happens after successful post creation,
      // such as redirecting to the new post or displaying a success message.
  
    } catch (error) {
      console.error('Error creating post:', error.message);
      // Handle API call errors, e.g., display an error message to the user
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h5" gutterBottom>
        Create Blog Post
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ '& .MuiTextField-root': { marginBottom: '2rem' } }}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            variant="standard"
            value={blogPost.title}
            multiline
            InputProps={{
              style: { fontSize: '3rem', fontWeight: 700 },
            }}
            onChange={(e) => setBlogPost({ ...blogPost, title: e.target.value })}
          />
        </Box>
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
            <IconButton onClick={() => removeAuthor(index)}>
              <RemoveCircleOutlineIcon />
            </IconButton>
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
              <IconButton onClick={() => removeTag(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
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
            <Button variant="contained" component="span">
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
            </Select>
          </FormControl>

          {block.type === 'image' ? (
            <Box>
              {block.content && (
                <img src={block.content} alt="Content Block Image" style={{ width: '720px', maxHeight: '350px', objectFit: 'contain' }} />
              )}
              <input
                accept="image/*"
                type="file"
                style={{ display: 'none' }}
                id={`content-block-image-${index}`}
                onChange={(event) => handleContentBlockImageChange(index, event)}
              />
              <label htmlFor={`content-block-image-${index}`}>
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
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

          <IconButton onClick={() => removeContentBlock(index)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          {index === blogPost.contentBlocks.length - 1 && (
            <IconButton onClick={addContentBlock}>
              <AddCircleOutlineIcon />
            </IconButton>
          )}
        </Box>
      ))}


        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Create Post
        </Button>
      </Box>
    </Container>
  );
}

export default PostEditor;