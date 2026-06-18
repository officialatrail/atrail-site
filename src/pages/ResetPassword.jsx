import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    setError('');
    const errorMessage = await updatePassword(password);
    setSubmitting(false);
    if (!errorMessage) {
      toast.success('Password updated. You can sign in now.');
      navigate('/login', { replace: true });
    } else {
      setError(errorMessage);
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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Set a new password</h1>
          <p className="font-rubik text-zinc-600 dark:text-zinc-400 mb-8">
            Choose a new password for your account.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">New Password</label>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <motion.button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-semibold hover:bg-brand-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? 'Saving...' : 'Save New Password'} <ArrowRight size={16} />
            </motion.button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
