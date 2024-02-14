import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import MiniBlogPost from '../MiniBlogPost/MiniBlogPost'; // Import your MiniBlogPost component
import { fetchAllBlogPosts } from '../../api/api'; // Import the API call function

function BlogPostsGrid() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        const posts = await fetchAllBlogPosts();
        console.log(posts);
        setBlogPosts(posts);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      }
    };

    getBlogPosts();
  }, []);

  return (
    <Grid container spacing={4}>
      {blogPosts.map((post, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <MiniBlogPost post={post} />
        </Grid>
      ))}
    </Grid>
  );
}

export default BlogPostsGrid;
