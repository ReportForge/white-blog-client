import axios from 'axios';

// Set up the base URL for all API calls
const API_BASE_URL = 'http://localhost:3000'; // Adjust this to your server's address and port

// Axios instance to set common configurations
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle user registration
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to handle user login
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to fetch all blog posts
export const fetchAllBlogPosts = async () => {
  try {
    const response = await axiosInstance.get('/api/posts');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to fetch a single blog post by ID
export const fetchBlogPostById = async (postId) => {
  try {
    const response = await axiosInstance.get(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to create a new blog post
export const createBlogPost = async (postData, token) => {
  try {
    const response = await axiosInstance.post('/api/posts', postData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const getAllUsers = async (token) => {
  try{
    const response = await axiosInstance.get('/api/users',{
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to set a user as an editor
export const setUserAsEditor = async (userId, token) => {
  try {
    const response = await axiosInstance.put(`/api/users/${userId}/set-editor`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`, // Assuming you use Bearer token for authentication
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to remove editor status from a user
export const removeEditorStatus = async (userId, token) => {
  try {
    const response = await axiosInstance.put(`/api/users/${userId}/remove-editor`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`, // Assuming you use Bearer token for authentication
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};