import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, CheckCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LikeButton from '../components/LikeButton';
import { getPrompts, requestExclusiveAccess, isMyEmailApproved, getMyEmail } from '../lib/contentStore';
import useDocumentHead from '../lib/useDocumentHead';
import Highlight from '../components/Highlight';
import { useAuth } from '../context/AuthContext';

export default function Prompts() {
  useDocumentHead(
    'The Prompt Library | Atrail',
    'AI prompts for workflow automation. Copy, paste, adapt.'
  );
  const { isAuthenticated } = useAuth();
  const [copiedKey, setCopiedKey] = useState(null);
  const allPrompts = getPrompts();
  const prompts = allPrompts.filter((p) => p.openToPublic || isAuthenticated);
  const hiddenCount = allPrompts.length - prompts.length;
  const [unlocked, setUnlocked] = useState(false);
  const [requested, setRequested] = useState(() => !!getMyEmail());
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    isMyEmailApproved().then(setUnlocked);
  }, []);

  const handleCopy = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Prompt copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleExpanded = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const filteredPrompts = prompts.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await requestExclusiveAccess(email);
      setRequested(true);
      toast.success("Request sent. You'll get access once approved.");
    } catch {
      toast.error('Could not send request - try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
              The Prompt <Highlight>Library</Highlight>
            </h1>
            <p className="font-rubik text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              AI prompts for workflow automation. Copy, paste, adapt.
            </p>
          </motion.div>

          <div className="relative max-w-xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {!isAuthenticated && hiddenCount > 0 && (
            <p className="text-center font-rubik text-sm text-zinc-500 dark:text-zinc-400 mb-12">
              <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">Sign in</Link> to see {hiddenCount} more prompt{hiddenCount === 1 ? '' : 's'}.
            </p>
          )}

          {filteredPrompts.length === 0 && (
            <p className="text-center text-zinc-400 dark:text-zinc-500 mb-12">No prompts match "{search}".</p>
          )}

          <div className="space-y-6">
            {filteredPrompts.map((p, index) => {
              const isLocked = p.locked && !unlocked;
              const lines = p.prompt.split('\n');
              const isLong = lines.length > 8;
              const isExpanded = !!expanded[p.title];
              const displayPrompt = isLong && !isExpanded ? lines.slice(0, 8).join('\n') + '\n...' : p.prompt;
              return (
                <motion.div
                  key={p.title}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="p-7">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-rubik text-xs font-bold px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                            {p.category}
                          </span>
                          {p.locked && (
                            <span className="font-rubik text-xs font-bold px-2.5 py-1 rounded-full bg-[#caa72c] text-white">
                              Exclusive
                            </span>
                          )}
                        </div>
                        <h3 className="font-rubik text-xl font-bold text-zinc-900 dark:text-white mt-3">{p.title}</h3>
                      </div>
                      {!isLocked && (
                        <button
                          onClick={() => handleCopy(p.prompt, p.title)}
                          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-all duration-200"
                        >
                          {copiedKey === p.title ? (
                            <>Copied <Check size={14} /></>
                          ) : (
                            <>Copy <Copy size={14} /></>
                          )}
                        </button>
                      )}
                    </div>
                    <p className="font-rubik text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{p.description}</p>

                    {isLocked ? (
                      <>
                        <div className="bg-zinc-900 dark:bg-white rounded-xl p-5 text-sm font-mono text-zinc-500 dark:text-zinc-400 filter blur-[4px] select-none pointer-events-none">
                          {p.prompt}
                        </div>
                        <div className="mt-4">
                          {requested ? (
                            <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-1.5">
                              <CheckCircle size={14} className="text-brand-600 dark:text-brand-400" />
                              Request sent for {getMyEmail()}. You'll get access once approved.
                            </p>
                          ) : (
                            <form onSubmit={handleRequest} className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email to request access"
                                className="font-rubik px-4 py-2.5 rounded-full border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 flex-1"
                              />
                              <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-700 transition-all duration-200 w-fit"
                              >
                                Request Access
                              </button>
                            </form>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <pre className="bg-zinc-900 dark:bg-white text-zinc-50 dark:text-zinc-900 rounded-xl p-5 text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono border border-zinc-800 dark:border-zinc-200">
                          {displayPrompt}
                        </pre>
                        {isLong && (
                          <button
                            onClick={() => toggleExpanded(p.title)}
                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700"
                          >
                            {isExpanded ? (
                              <>Show less <ChevronUp size={13} /></>
                            ) : (
                              <>Show full prompt <ChevronDown size={13} /></>
                            )}
                          </button>
                        )}
                      </>
                    )}

                    <div className="mt-4">
                      <LikeButton itemKey={`prompt-${p.title}`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
