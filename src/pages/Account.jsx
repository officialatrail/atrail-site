import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import useDocumentHead from '../lib/useDocumentHead';
import { getMyProfile, setMyAlias, setMySubscribed } from '../lib/contentStore';

export default function Account() {
  useDocumentHead('Your Account | Atrail', 'Manage your Atrail comment alias and email preferences.');
  const [alias, setAliasInput] = useState('');
  const [subscribed, setSubscribedState] = useState(true);
  const [loading, setLoading] = useState(true);
  const [savingAlias, setSavingAlias] = useState(false);
  const [aliasError, setAliasError] = useState('');

  useEffect(() => {
    getMyProfile().then((p) => {
      setAliasInput(p?.alias || '');
      setSubscribedState(p?.subscribed !== false);
      setLoading(false);
    });
  }, []);

  const saveAlias = async (e) => {
    e.preventDefault();
    const clean = alias.trim().replace(/^@/, '');
    if (!clean) return;
    setSavingAlias(true);
    setAliasError('');
    try {
      await setMyAlias(clean);
      setAliasInput(clean);
      toast.success('Alias updated');
    } catch (err) {
      setAliasError(err.message || 'Could not save alias.');
    } finally {
      setSavingAlias(false);
    }
  };

  const toggleSubscribed = async () => {
    const next = !subscribed;
    setSubscribedState(next);
    try {
      await setMySubscribed(next);
      toast.success(next ? 'Subscribed to updates' : 'Unsubscribed from updates');
    } catch {
      setSubscribedState(!next);
      toast.error('Could not update - try again.');
    }
  };

  if (loading) {
    return (
      <main className="pt-32 pb-24 px-4 min-h-screen flex items-center justify-center">
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">Loading...</p>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-4">
      <motion.div
        className="max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-zinc-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Account</h1>

        <form onSubmit={saveAlias} className="mb-8">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Comment alias</label>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-bold">@</span>
            <input
              value={alias}
              onChange={(e) => setAliasInput(e.target.value)}
              maxLength={24}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="yourname"
            />
          </div>
          {aliasError && <p className="text-xs text-red-500 mt-2">{aliasError}</p>}
          <button
            type="submit"
            disabled={savingAlias}
            className="mt-3 bg-brand-600 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-brand-700 disabled:opacity-50"
          >
            {savingAlias ? 'Saving...' : 'Save alias'}
          </button>
        </form>

        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800">
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email me about new tools, articles, and prompts
            </span>
            <input
              type="checkbox"
              checked={subscribed}
              onChange={toggleSubscribed}
              className="w-5 h-5 accent-brand-600 shrink-0"
            />
          </label>
        </div>
      </motion.div>
    </main>
  );
}
