import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationWarp from './components/NavigationWarp/NavigationWarp'; // Import the MainLayout component
import HomePage from './components/HomePage/HomePage';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import UserManagement from './components/UserManagement/UserManagement';
import PostEditor from './components/PostEditor/PostEditor';
import FullBlogPost from './components/FullBlogPost/FullBlogPost';
import Profile from './components/Profile/Profile';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user-management" element={<NavigationWarp><UserManagement /></NavigationWarp>} />
        <Route path="/post-editor" element={<NavigationWarp><PostEditor /></NavigationWarp>} />
        <Route path="/full-blog-post/:id" element={<NavigationWarp><FullBlogPost /></NavigationWarp>} />
        <Route path="/profile" element={<NavigationWarp><Profile /></NavigationWarp>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
