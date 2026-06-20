import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToolCard from '../components/ToolCard';
import { getTools, getComingSoon, joinWaitlist } from '../lib/contentStore';
import { platforms } from '../lib/platformIcons';
import useDocumentHead from '../lib/useDocumentHead';
import Highlight from '../components/Highlight';
import { useAuth } from '../context/AuthContext';

export default function Tools() {
  useDocumentHead(
    'Automation Tools That Actually Work | Atrail',
    'Free automation tools built on familiar tools like Excel and Google Sheets, for bank reconciliation, financial modelling, and bookkeeping.'
  );
  const { isAuthenticated } = useAuth();
  const [activePlatform, setActivePlatform] = useState('All');
  const allTools = getTools();
  const tools = allTools.filter((t) => !t.membersOnly || isAuthenticated);
  const hiddenCount = allTools.length - tools.length;
  const comingSoon = getComingSoon();
  const toolPlatforms = ['All', ...new Set(tools.map((t) => t.platform).filter(Boolean))];
  const filtered = tools.filter((t) => activePlatform === 'All' || t.platform === activePlatform);
  const [activeVideo, setActiveVideo] = useState(null);

  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await joinWaitlist(email);
      setJoined(true);
      setEmail('');
    } catch {
      // keep the form visible so they can retry
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
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

          {!isAuthenticated && hiddenCount > 0 && (
            <p className="text-center font-rubik text-sm text-zinc-500 dark:text-zinc-400 mb-8">
              <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">Sign in</Link> to see {hiddenCount} more tool{hiddenCount === 1 ? '' : 's'}.
            </p>
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
                  <ToolCard tool={tool} onPlayVideo={setActiveVideo} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="mt-20 rounded-3xl p-10 sm:p-14 border border-brand-100 dark:border-zinc-800 bg-gradient-to-br from-[#eafbf1] to-white dark:from-zinc-900 dark:to-zinc-950"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="font-rubik text-xs font-bold text-brand-600 dark:text-brand-400">
                  {comingSoon.badge}
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">{comingSoon.title}</h2>
                <p className="mt-5 text-zinc-600 dark:text-zinc-400 leading-relaxed">{comingSoon.description}</p>
              </div>
              <div className="flex flex-col gap-4">
                {comingSoon.features.map((f) => (
                  <div key={f} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-brand-100 dark:bg-brand-900/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                    </span>
                    {f}
                  </div>
                ))}

                {joined ? (
                  <div className="mt-2 inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-sm">
                    <CheckCircle size={16} /> You're on the waitlist
                  </div>
                ) : (
                  <form onSubmit={handleJoin} className="mt-2 flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="px-4 py-2.5 rounded-full border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 flex-1"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-700 transition-all duration-200 w-fit"
                    >
                      Join the Waitlist <ArrowRight size={14} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

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

      <Footer />
    </div>
  );
}
