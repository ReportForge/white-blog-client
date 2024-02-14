import React from 'react';
import { Card, CardContent, CardMedia, Typography, Avatar, Box, Grid } from '@mui/material';

function MiniBlogPost({ post }) {
  const { title, subTitle, authors, publishDate, mainImage } = post;

  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: "none"}} >
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
            },
          }}
      />
      <CardContent sx={{ padding: "16px 0px", "&:last-child": { paddingBottom: "16px" } }}>
        <Typography gutterBottom variant="h6" component="div"  sx={{textAlign: 'left',fontWeight: 600, color:'#1E293B',fontFamily: "'Lato', sans-serif"}}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {authors.map((author, index) => (
            <Box key={index} sx={{ mr: -1, display: 'inline' }}>
              <Avatar alt={author.name} src={author.image} sx={{ width: 35, height: 35 }} />
            </Box>
          ))}
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2, mb: 1 }}>
            <Typography variant="body2" color="text.secondary" >
                {authors.map((author, index) => (
                <span key={index}>
                    {author.name}{index < authors.length - 1 ? ', ' : ''}
                </span>
                ))}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ml: 1}}>
                {new Date(publishDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {subTitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MiniBlogPost;
