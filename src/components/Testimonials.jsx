import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
import { getArticles, getPrompts, getTools } from '../lib/contentStore';
import { useAuth } from '../context/AuthContext';
import Highlight from './Highlight';
import { linkify } from '../lib/linkify';

const Testimonials = () => {
  const { isAuthenticated } = useAuth();
  const articles = getArticles();
  const prompts = getPrompts();
  const tools = getTools();

  const previews = [
    {
      type: 'Article',
      title: articles[0].title,
      description: articles[0].excerpt,
      href: `/articles/${articles[0].slug}`,
      locked: false,
    },
    {
      type: 'Prompt',
      title: prompts[0].title,
      description: prompts[0].description,
      href: '/prompts',
      locked: true,
    },
    {
      type: 'Tool',
      title: 'Atrail Sheets: Automation Toolkit',
      description: `${tools.length} automation tools including reconciliation, financial modelling, and AI in Sheets. Free to copy and use immediately.`,
      href: '/tools',
      locked: true,
    },
  ];

  return (
    <section id="library" className="py-24 bg-gradient-to-br from-brand-50 via-white to-emerald-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              From the <Highlight>Library</Highlight>
            </h2>
            <p className="font-rubik text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
              View community articles, tools, prompts, and workflows.
            </p>
          </div>
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold shrink-0 hover:text-brand-700"
          >
            See everything <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previews.map((item, index) => {
            const gated = item.locked && !isAuthenticated;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={gated ? '/login' : item.href}
                  className="card-rich group block bg-white dark:bg-zinc-900 rounded-2xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700"
                >
                  <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
                    {item.type}
                  </span>
                  <h3 className="font-rubik text-lg font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className={`font-rubik text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5 ${gated ? 'filter blur-[3px] select-none' : ''}`}>
                    {gated ? item.description : linkify(item.description)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {gated ? <><Lock size={12} /> Sign in to unlock</> : <>Read more <ArrowRight size={14} /></>}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
