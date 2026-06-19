import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, X, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getVideos } from '../lib/contentStore';
import useDocumentHead from '../lib/useDocumentHead';
import Highlight from '../components/Highlight';

function VideoCard({ video, index, onOpen }) {
  const [preview, setPreview] = useState(false);
  const timeoutRef = useRef(null);

  const handleEnter = () => {
    timeoutRef.current = setTimeout(() => setPreview(true), 250);
  };
  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setPreview(false);
  };

  return (
    <motion.button
      onClick={() => onOpen(video.videoId)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="card-rich group text-left bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-zinc-800"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      <div className="relative aspect-video bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        {preview ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.videoId}&modestbranding=1&rel=0`}
            title={video.title}
            allow="autoplay; encrypted-media"
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        ) : (
          <img
            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className={`w-10 h-10 text-white/70 drop-shadow-lg transition-opacity duration-300 ${preview ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} />
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-2">{video.title}</h3>
        <p className="font-rubik text-sm text-zinc-600 dark:text-zinc-400">{video.description}</p>
      </div>
    </motion.button>
  );
}

export default function Videos() {
  useDocumentHead(
    'Videos & Walkthroughs | Atrail',
    'Screen recordings and walkthroughs from the Atrail YouTube channel: bank reconciliation, prepayment schedules, and Excel automation.'
  );
  const [active, setActive] = useState(null);
  const videos = getVideos();
  const [search, setSearch] = useState('');
  const filteredVideos = videos.filter((v) => {
    const q = search.toLowerCase();
    return v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
              Videos <Highlight>& Walkthroughs</Highlight>
            </h1>
            <p className="font-rubik text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Screen recordings and walkthroughs from the Atrail YouTube channel.
            </p>
          </motion.div>

          <div className="relative max-w-xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {filteredVideos.length === 0 && (
            <p className="text-center text-zinc-400 dark:text-zinc-500 mb-12">No videos match "{search}".</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredVideos.map((video, index) => (
              <VideoCard key={video.videoId + index} video={video} index={index} onOpen={setActive} />
            ))}
          </div>
        </div>
      </main>

      {active && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setActive(null)}
        >
          <motion.div
            className="relative w-full max-w-3xl aspect-video"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute -top-10 right-0 text-white hover:text-brand-400"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <iframe
              className="w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${active}?autoplay=1`}
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
