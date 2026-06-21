import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Eye } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LikeButton from '../components/LikeButton';
import { getArticles, getReadCount } from '../lib/contentStore';
import useDocumentHead from '../lib/useDocumentHead';
import Highlight from '../components/Highlight';

export default function Articles() {
  useDocumentHead(
    'Articles & Guides | Atrail',
    'Written walkthroughs on finance and accounting automation: bank reconciliation, financial modelling, and bookkeeping with n8n, Claude, and Excel.'
  );
  const articles = getArticles();
  const [search, setSearch] = useState('');
  const filteredArticles = articles.filter((a) => {
    const q = search.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
  });

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
              Articles & <Highlight>Guides</Highlight>
            </h1>
            <p className="font-rubik text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Written walkthroughs on finance and accounting automation.
            </p>
          </motion.div>

          <div className="relative max-w-xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {filteredArticles.length === 0 && (
            <p className="text-center text-zinc-400 dark:text-zinc-500 mb-12">No articles match "{search}".</p>
          )}

          <div className="space-y-6">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  to={`/articles/${article.slug}`}
                  className="card-rich group block bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center gap-3 mb-3 text-sm text-zinc-500 dark:text-zinc-500">
                    <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><Eye size={13} /> {getReadCount(`article-${article.slug}`).toLocaleString()} reads</span>
                  </div>
                  <h2 className="font-rubik text-2xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                    {article.title}
                  </h2>
                  <p className="font-rubik text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
                      Read article <ArrowRight size={14} />
                    </span>
                    <LikeButton itemKey={`article-${article.slug}`} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
