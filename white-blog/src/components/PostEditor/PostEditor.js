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
  Avatar
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

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
    if (subField) {
      newBlogPost[field][index][subField] = e.target.value;
    } else {
      newBlogPost[field] = e.target.value;
    }
    setBlogPost(newBlogPost);
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedAuthors = blogPost.authors.map((author, idx) => {
          if (idx === index) {
            return { ...author, image: e.target.result };
          }
          return author;
        });
        setBlogPost({ ...blogPost, authors: updatedAuthors });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addAuthor = () => {
    const newBlogPost = { ...blogPost, authors: [...blogPost.authors, { name: '', image: '' }] };
    setBlogPost(newBlogPost);
  };

  const removeAuthor = (index) => {
    const newBlogPost = { ...blogPost };
    newBlogPost.authors.splice(index, 1);
    setBlogPost(newBlogPost);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit the blog post data to your backend
    console.log(blogPost);
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
          onChange={(e) => handleInputChange(e, null, 'title')}
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
          onChange={(e) => handleInputChange(e, null, 'subTitle')}
        />
      </Box>
        {/* Authors */}
        {blogPost.authors.map((author, index) => (
          <Box key={index} style={{ display: 'flex'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar src={author.image} alt="Author" style={{ width: 60, height: 60 }} key={author.image} />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id={`icon-button-file-${index}`}
                type="file"
                onChange={(e) => handleImageChange(index, e)}
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
              onChange={(e) => handleInputChange(e, index, 'authors', 'name')}
              style={{ marginRight: 8 }}
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

        {/* Tags */}
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          Tags
        </Typography>
        {blogPost.tags.map((tag, index) => (
          <Box key={index}>
            <TextField
              label="Tag"
              value={tag}
              onChange={(e) => handleInputChange(e, index, 'tags')}
              style={{ marginRight: 8 }}
            />
            <IconButton onClick={() => removeTag(index)}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            {index === blogPost.tags.length - 1 && (
              <IconButton onClick={addTag}>
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}

        {/* Main Image */}
        <TextField
          label="Main Image URL"
          fullWidth
          margin="normal"
          value={blogPost.mainImage}
          onChange={(e) => handleInputChange(e, null, 'mainImage')}
        />

        {/* Content Blocks */}
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          Content Blocks
        </Typography>
        {blogPost.contentBlocks.map((block, index) => (
          <Box key={index}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={block.type}
                label="Type"
                onChange={(e) => handleInputChange(e, index, 'contentBlocks', 'type')}
                style={{ marginRight: 8, marginBottom: 8 }}
              >
                <MenuItem value="bigTitle">Big Title</MenuItem>
                <MenuItem value="smallTitle">Small Title</MenuItem>
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="text">Text Paragraph</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={block.type === 'image' ? "Image URL" : "Content"}
              fullWidth
              multiline={block.type === 'text'}
              rows={block.type === 'text' ? 4 : 1}
              value={block.content}
              onChange={(e) => handleInputChange(e, index, 'contentBlocks', 'content')}
            />
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
