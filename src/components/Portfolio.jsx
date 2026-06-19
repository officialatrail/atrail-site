import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, X } from 'lucide-react';
import { getTools } from '../lib/contentStore';
import { useAuth } from '../context/AuthContext';
import ToolCard from './ToolCard';
import Highlight from './Highlight';

const Portfolio = () => {
  const tools = getTools();
  const featured = tools.slice(0, 3);
  const { isAuthenticated } = useAuth();
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section id="portfolio" className="py-24 bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 font-rubik text-xs font-bold text-brand-600 dark:text-brand-400 mb-3">
              <Lock size={11} /> Members Only
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Tools That <Highlight>Actually Work</Highlight>
            </h2>
            <p className="font-rubik text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Automation tools built on familiar tools like Excel, Google Sheets, and more. Sign in to unlock the full library.
            </p>
          </div>
          <Link
            to={isAuthenticated ? '/tools' : '/login'}
            className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold shrink-0 hover:text-brand-700"
          >
            {isAuthenticated ? 'See all tools' : 'Sign in to view all'} <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
        >
          {featured.map((tool) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <ToolCard tool={tool} locked={!isAuthenticated} onPlayVideo={setActiveVideo} />
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700"
                >
                  <Lock size={12} /> Sign in to unlock
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {activeVideo && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setActiveVideo(null)}
        >
          <motion.div className="relative w-full max-w-3xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} className="absolute -top-10 right-0 text-white hover:text-brand-400" aria-label="Close">
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
    </section>
  );
};

export default Portfolio;
