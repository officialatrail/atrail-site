import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) navigate('/', { replace: true });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    setError('');
    const errorMessage = await signUp(email, password, { subscribed: emailUpdates });
    setSubmitting(false);
    if (!errorMessage) {
      setDone(true);
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
          <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-6">
            <img src={`${import.meta.env.BASE_URL}images/logo-green.png`} alt="Atrail" className="w-8 h-8 object-contain dark:hidden" />
            <img src={`${import.meta.env.BASE_URL}images/logo-white.png`} alt="Atrail" className="w-8 h-8 object-contain hidden dark:block" />
          </div>

          {done ? (
            <>
              <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-4">
                <CheckCircle className="text-brand-600 dark:text-brand-400" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Check your email</h1>
              <p className="font-rubik text-zinc-600 dark:text-zinc-400 mb-6">
                We sent a confirmation link to <span className="font-semibold">{email}</span>. Click it, then come back and sign in.
              </p>
              <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold text-sm">
                Go to Sign In
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Create your account</h1>
              <p className="font-rubik text-zinc-600 dark:text-zinc-400 mb-8">
                Sign up to unlock tools and prompts.
              </p>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Password</label>
                  <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                </div>
                <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <input type="checkbox" checked={emailUpdates} onChange={(e) => setEmailUpdates(e.target.checked)} />
                  Email me about new tools, articles, and prompts
                </label>
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-semibold hover:bg-brand-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? 'Creating account...' : 'Sign Up'} <ArrowRight size={16} />
                </motion.button>
              </form>

              <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400 text-center mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
