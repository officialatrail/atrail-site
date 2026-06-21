import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, CheckCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import LikeButton from '../components/LikeButton';
import SearchSortBar from '../components/SearchSortBar';
import { getPrompts, requestExclusiveAccess, isMyEmailApproved, getMyEmail, getLikeCount } from '../lib/contentStore';
import useDocumentHead from '../lib/useDocumentHead';
import Highlight from '../components/Highlight';
import { useAuth } from '../context/AuthContext';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'liked', label: 'Most Liked' },
  { value: 'az', label: 'A - Z' },
];

export default function Prompts() {
  useDocumentHead(
    'The Prompt Library | Atrail',
    'AI prompts for workflow automation. Copy, paste, adapt.'
  );
  const { isAuthenticated } = useAuth();
  const [copiedKey, setCopiedKey] = useState(null);
  const prompts = getPrompts();
  const [unlocked, setUnlocked] = useState(false);
  const [requested, setRequested] = useState(() => !!getMyEmail());
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const [sortBy, setSortBy] = useState('recent');
  const [honeypot, setHoneypot] = useState('');

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

  const filteredPrompts = prompts
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    })
    .map((p, idx) => ({ p, idx }))
    .sort((a, b) => {
      if (sortBy === 'recent') return a.idx - b.idx;
      if (sortBy === 'az') return a.p.title.localeCompare(b.p.title);
      const diff = getLikeCount(`prompt-${b.p.title}`) - getLikeCount(`prompt-${a.p.title}`);
      return diff !== 0 ? diff : a.idx - b.idx;
    })
    .map(({ p }) => p);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email || honeypot) return;
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
            <p className="font-rubik text-xs text-zinc-400 dark:text-zinc-500 mt-4">
              Always review outputs before relying on them for real financial decisions.
            </p>
          </motion.div>

          <SearchSortBar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search prompts..."
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={SORT_OPTIONS}
          />

          {filteredPrompts.length === 0 && search && (
            <p className="text-center text-zinc-400 dark:text-zinc-500 mb-12">No prompts match "{search}".</p>
          )}

          {filteredPrompts.length === 0 && !search && (
            <p className="text-center text-zinc-400 dark:text-zinc-500 mb-12">No prompts yet - check back soon.</p>
          )}

          <div className="space-y-6">
            {filteredPrompts.map((p, index) => {
              const isExclusiveLocked = p.locked && !unlocked;
              const isMembersLocked = !p.openToPublic && !isAuthenticated;
              const isLocked = isExclusiveLocked || isMembersLocked;
              const lines = p.prompt.split('\n');
              const isLong = lines.length > 3;
              const isExpanded = !!expanded[p.title];
              const displayPrompt = isLong && !isExpanded ? lines.slice(0, 3).join('\n') + '\n...' : p.prompt;
              const blurredPreview = lines.slice(0, 3).join('\n') + (lines.length > 3 ? '\n...' : '');
              return (
                <motion.div
                  key={p.title}
                  className={`group bg-white dark:bg-zinc-900 rounded-2xl border shadow-lg overflow-hidden transition-colors duration-200 ${
                    isLocked
                      ? 'border-slate-100 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-950/10'
                      : 'border-slate-100 dark:border-zinc-800'
                  }`}
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
                        <div className="bg-zinc-900 dark:bg-white rounded-xl p-5 text-sm font-mono text-zinc-500 dark:text-zinc-400 filter blur-[4px] select-none pointer-events-none whitespace-pre-wrap">
                          {blurredPreview}
                        </div>
                        <div className="mt-4">
                          {isExclusiveLocked ? (
                            requested ? (
                              <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-1.5">
                                <CheckCircle size={14} className="text-brand-600 dark:text-brand-400" />
                                Request sent for {getMyEmail()}. You'll get access once approved.
                              </p>
                            ) : (
                              <form onSubmit={handleRequest} className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  name="company"
                                  value={honeypot}
                                  onChange={(e) => setHoneypot(e.target.value)}
                                  tabIndex={-1}
                                  autoComplete="off"
                                  className="absolute -left-[9999px] w-px h-px opacity-0"
                                  aria-hidden="true"
                                />
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
                            )
                          ) : (
                            <Link
                              to="/login"
                              className="inline-flex items-center justify-center gap-2 bg-zinc-800 dark:bg-zinc-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm group-hover:bg-blue-600 transition-colors duration-200 w-fit"
                            >
                              <Lock size={13} /> Sign in to view this prompt
                            </Link>
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
    </div>
  );
}
