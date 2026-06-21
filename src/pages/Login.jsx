import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const errorMessage = await login(email, password);
    setSubmitting(false);
    if (!errorMessage) {
      navigate(from, { replace: true });
    } else {
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <main className="pt-32 pb-24 flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 dark:border-zinc-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <img src={`${import.meta.env.BASE_URL}images/logo-green.png`} alt="Atrail" className="w-12 h-12 object-contain dark:hidden" />
            <img src={`${import.meta.env.BASE_URL}images/logo-white.png`} alt="Atrail" className="w-12 h-12 object-contain hidden dark:block" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Sign in to Atrail</h1>
          <p className="font-rubik text-zinc-600 dark:text-zinc-400 mb-8">
            Tools and prompts are members-only. Sign in to get access.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoComplete="username"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <motion.button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-semibold hover:bg-brand-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
            </motion.button>
          </form>

          <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-600 hover:text-brand-700 font-semibold">
              Sign up
            </Link>
          </p>
          <Link to="/" className="block text-center text-sm text-brand-600 hover:text-brand-700 mt-4">
            Back to home
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
