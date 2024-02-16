import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Box } from '@mui/material';
import MiniBlogPost from '../MiniBlogPost/MiniBlogPost'; // Ensure this path is correct
import { fetchAllBlogPosts } from '../../api/api'; // Ensure this path is correct

function BlogPostsGrid({ selectedTag, searchTerm }) { // Receive searchTerm as a prop
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        setLoading(true);
        const posts = await fetchAllBlogPosts();
        // Filter out draft posts
        const publishedPosts = posts.filter(post => !post.isDraft);
        setBlogPosts(publishedPosts);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    getBlogPosts();
  }, []);

  // First filter by the selected tag if any
  let filteredPosts = selectedTag
    ? blogPosts.filter(post => post.tags && post.tags.includes(selectedTag))
    : blogPosts;

  // Then filter the result by the search term if any
  filteredPosts = searchTerm
    ? filteredPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.subTitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : filteredPosts;


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
    <Grid container spacing={4}>
      {filteredPosts.map((post, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <MiniBlogPost post={post} />
        </Grid>
      ))}
    </Grid>
  );
}

export default BlogPostsGrid;
