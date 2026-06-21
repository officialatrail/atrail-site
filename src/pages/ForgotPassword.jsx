import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { sendPasswordReset } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const errorMessage = await sendPasswordReset(email);
    setSubmitting(false);
    if (!errorMessage) {
      setSent(true);
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
          {sent ? (
            <>
              <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-4">
                <CheckCircle className="text-brand-600 dark:text-brand-400" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Check your email</h1>
              <p className="font-rubik text-zinc-600 dark:text-zinc-400 mb-6">
                If an account exists for <span className="font-semibold">{email}</span>, a reset link is on its way.
              </p>
              <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold text-sm">
                Back to Sign In
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Reset your password</h1>
              <p className="font-rubik text-zinc-600 dark:text-zinc-400 mb-8">
                Enter your email and we'll send you a reset link.
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
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-semibold hover:bg-brand-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? 'Sending...' : 'Send Reset Link'} <ArrowRight size={16} />
                </motion.button>
              </form>

              <Link to="/login" className="block text-center text-sm text-brand-600 hover:text-brand-700 mt-6">
                Back to Sign In
              </Link>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
