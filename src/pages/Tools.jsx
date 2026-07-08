import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import SearchSortBar from '../components/SearchSortBar';
import { getTools, getLikeCount } from '../lib/contentStore';
import AddInSection from '../components/AddInSection';
import { platforms } from '../lib/platformIcons';
import useDocumentHead from '../lib/useDocumentHead';
import Highlight from '../components/Highlight';
import { useAuth } from '../context/AuthContext';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'liked', label: 'Most Liked' },
  { value: 'az', label: 'A - Z' },
];

export default function Tools() {
  useDocumentHead(
    'Automation Tools That Actually Work | Atrail',
    'Free automation tools built on familiar tools like Excel and Google Sheets, for bank reconciliation, financial modelling, and bookkeeping.'
  );
  const { isAuthenticated } = useAuth();
  const [activePlatform, setActivePlatform] = useState('All');
  const [search, setSearch] = useState('');
  const tools = getTools();
  const toolPlatforms = ['All', ...new Set(tools.map((t) => t.platform).filter(Boolean))];
  const [sortBy, setSortBy] = useState('recent');
  const filtered = tools
    .filter((t) => activePlatform === 'All' || t.platform === activePlatform)
    .filter((t) => {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    })
    .map((t, idx) => ({ t, idx }))
    .sort((a, b) => {
      if (sortBy === 'recent') return a.idx - b.idx;
      if (sortBy === 'az') return a.t.name.localeCompare(b.t.name);
      const diff = getLikeCount(`tool-${b.t.name}`) - getLikeCount(`tool-${a.t.name}`);
      return diff !== 0 ? diff : a.idx - b.idx;
    })
    .map(({ t }) => t);
  const [activeVideo, setActiveVideo] = useState(null);


  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
              Automation Tools <Highlight>That Actually Work</Highlight>
            </h1>
            <p className="font-rubik text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
              Automation tools built on familiar tools like Excel, Google Sheets, and more.
            </p>
            <p className="font-rubik text-xs text-zinc-400 dark:text-zinc-500 mt-4">
              Test in a copy of your file before using these on production data.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {toolPlatforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activePlatform === platform
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700'
                }`}
              >
                {platform !== 'All' && platforms[platform] && (
                  <span className="w-4 h-4 inline-flex items-center justify-center">
                    <img src={platforms[platform].logo} alt={platform} className="w-full h-full object-contain" />
                  </span>
                )}
                {platform}
              </button>
            ))}
          </motion.div>

          <SearchSortBar
            search={search}
            onSearchChange={setSearch}
            placeholder="Search tools..."
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={SORT_OPTIONS}
          />

          {filtered.length === 0 && search && (
            <p className="text-center text-zinc-400 dark:text-zinc-500 mb-12">No tools match "{search}".</p>
          )}

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" layout>
            <AnimatePresence>
              {filtered.map((tool) => (
                <motion.div
                  key={tool.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6 }}
                >
                  <ToolCard tool={tool} onPlayVideo={setActiveVideo} requiresSignIn={!tool.openToPublic && !isAuthenticated} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>

      <AddInSection />

      {activeVideo && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            className="relative w-full max-w-3xl aspect-video"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 text-white hover:text-brand-400"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <iframe
              className="w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              title="Atrail video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}

    </div>
  );
}
