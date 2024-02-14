import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import MiniBlogPost from '../MiniBlogPost/MiniBlogPost'; // Ensure this path is correct
import { fetchAllBlogPosts } from '../../api/api'; // Ensure this path is correct

function BlogPostsGrid({ selectedTag, searchTerm }) { // Receive searchTerm as a prop
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        const posts = await fetchAllBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
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
