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
  try {
    const response = await axiosInstance.get('/api/users', {
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

// Function to save or update a draft blog post
export const saveDraftBlogPost = async (draftData, token) => {
  try {
    const response = await axiosInstance.post('/api/posts/draft', draftData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the auth token in the request headers
      },
    });
    return response.data;
  } catch (error) {

    throw error.response.data;
  }
};

// Function to fetch the current user's draft blog post
export const fetchDraftBlogPost = async (token) => {
  try {
    const response = await axiosInstance.get('/api/posts/draft', {
      headers: {
        'Authorization': `Bearer ${token}`, // Authorization header with the user's token
      },
    });
    return response.data; // The draft post data
  } catch (error) {
    throw error.response.data; // Error handling
  }
};

// Function to delete the current user's draft blog post
export const deleteDraftBlogPost = async (token) => {
  try {
    const response = await axiosInstance.delete('/api/posts/draft', {
      headers: {
        'Authorization': `Bearer ${token}`, // Authorization header with the user's token
      },
    });
    return response.data; // Confirmation of the draft post deletion
  } catch (error) {
    throw error.response.data; // Error handling
  }
};

// Function to update a blog post
export const updateBlogPost = async (postId, postData, token) => {
  try {
    const response = await axiosInstance.put(`/api/posts/${postId}`, postData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the auth token in the request headers
      },
    });
    return response.data; // The updated post data
  } catch (error) {
    throw error.response.data; // Error handling
  }
};

// Function to update a user's profile, including the profile picture
export const updateUserProfile = async (userId, profileData, token) => {
  try {
    const response = await axiosInstance.put(`/api/users/${userId}`, profileData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the auth token in the request headers
      },
    });
    return response.data; // The updated user profile data
  } catch (error) {
    throw error.response.data; // Error handling
  }
};

// Function to verify the user's email with a verification code
export const verifyEmailCode = async (verificationData) => {
  try {
    const response = await axiosInstance.post('/api/auth/verify-email', verificationData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to request a password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await axiosInstance.post('/api/users/request-password-reset', { email });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to submit a new password after a reset request
export const submitNewPassword = async ({ token, newPassword }) => {
  try {
    const response = await axiosInstance.post('/api/users/submit-new-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
