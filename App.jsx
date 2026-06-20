import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './src/context/AuthContext.jsx';
import { ThemeProvider } from './src/context/ThemeContext.jsx';
import ProtectedRoute from './src/components/ProtectedRoute.jsx';
import ScrollProgress from './src/components/ScrollProgress.jsx';

import Home from './src/pages/Home.jsx';
import Tools from './src/pages/Tools.jsx';
import Prompts from './src/pages/Prompts.jsx';
import Articles from './src/pages/Articles.jsx';
import ArticleDetail from './src/pages/ArticleDetail.jsx';
import Videos from './src/pages/Videos.jsx';
import About from './src/pages/About.jsx';
import Login from './src/pages/Login.jsx';
import SignUp from './src/pages/SignUp.jsx';
import ForgotPassword from './src/pages/ForgotPassword.jsx';
import ResetPassword from './src/pages/ResetPassword.jsx';
import Admin from './src/pages/Admin.jsx';
import NotFound from './src/pages/NotFound.jsx';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname} className="page-enter">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/prompts" element={<Prompts />} />
          <Route
            path="/admin"
            element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>}
          />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <ScrollProgress />
          <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
            <AnimatedRoutes />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="light"
            />
          </main>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
