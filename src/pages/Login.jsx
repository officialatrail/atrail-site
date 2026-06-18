import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate(from, { replace: true });
    } else {
      setError('Incorrect username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="pt-32 pb-24 flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-6">
            <img src={`${import.meta.env.BASE_URL}images/logo-green.png`} alt="Atrail" className="w-8 h-8 object-contain dark:hidden" />
            <img src={`${import.meta.env.BASE_URL}images/logo-white.png`} alt="Atrail" className="w-8 h-8 object-contain hidden dark:block" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Sign in to Atrail</h1>
          <p className="font-rubik text-zinc-600 dark:text-zinc-400 mb-8">
            Tools and prompts are members-only for now. Sign in to get access.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <motion.button
              type="submit"
              className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-semibold hover:bg-brand-700 transition-all duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In <ArrowRight size={16} />
            </motion.button>
          </form>

          <p className="font-rubik text-xs text-zinc-400 dark:text-zinc-500 mt-6 text-center">
            Use <span className="font-mono">admin</span> / <span className="font-mono">admin</span> for now.
          </p>
          <Link to="/" className="block text-center text-sm text-brand-600 hover:text-brand-700 mt-4">
            Back to home
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
