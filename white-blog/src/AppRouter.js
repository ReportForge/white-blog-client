import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import UserManagement from './components/UserManagement/UserManagement';
import PostEditor from './components/PostEditor/PostEditor';
import FullBlogPost from './components/FullBlogPost/FullBlogPost';


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/user-management' element={<UserManagement />} />
        <Route path='/post-editor' element={<PostEditor />} />
        <Route path="/full-blog-post/:id" element={<FullBlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
