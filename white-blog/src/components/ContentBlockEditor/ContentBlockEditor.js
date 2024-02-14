import React from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const ContentBlockEditor = ({ block, onUpdate, onDelete }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ ...block, [name]: value });
  };

  const handleFileChange = (e) => {
    // Assuming you want to handle the file directly here. You might need to upload it to a server or convert it to a base64 string depending on your requirements.
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...block, content: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContentInput = () => {
    switch (block.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label="Content"
            name="content"
            variant="outlined"
            value={block.content}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />
        );
      case 'image':
        return (
          <Button
            variant="contained"
            component="label"
            fullWidth
            margin="normal"
          >
            Upload Image
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/*"
            />
          </Button>
        );
      case 'video':
        return (
          <TextField
            fullWidth
            label="Video URL"
            name="content"
            variant="outlined"
            value={block.content}
            onChange={handleChange}
            margin="normal"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select name="type" value={block.type} onChange={handleChange} fullWidth>
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </Select>
      </FormControl>
      {renderContentInput()}
      <Button variant="outlined" color="secondary" onClick={onDelete} style={{ marginTop: '10px' }}>
        Remove Block
      </Button>
    </div>
  );
};

export default ContentBlockEditor;
