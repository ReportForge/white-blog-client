import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
//import BlogPost from './components/BlogPost';
//import About from './components/About';
//import NotFound from './components/NotFound';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/post/:postId" element={<BlogPost />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
