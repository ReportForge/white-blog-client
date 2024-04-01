import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TwitterCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { search } = location;
    const queryParams = new URLSearchParams(search);
    const token = queryParams.get('token');
    const user = queryParams.get('user');

    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user); // Assuming you're okay with storing the stringified user object directly
      navigate("/"); // Redirect to the homepage or dashboard
    } else {
      navigate("/login"); // Redirect to the login page if there's an error
    }
  }, [location, navigate]);

  return (
    <div>Loading...</div> // Show a loading message or spinner as needed
  );
};

export default TwitterCallback;
