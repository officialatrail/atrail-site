import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StarField from './StarField';
import MouseGlow from './MouseGlow';

const stack = [
  { name: 'n8n', slug: 'n8n' },
  { name: 'Zapier', slug: 'zapier' },
  { name: 'Claude', slug: 'anthropic' },
  { name: 'Excel', icon: FileSpreadsheet },
  { name: 'Google Sheets', slug: 'googlesheets' },
  { name: 'Airtable', slug: 'airtable' },
];

const Hero = () => {
  const { isAuthenticated } = useAuth();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 80, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handle = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [mx, my]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-[#04060a] transition-colors duration-300">
      <StarField />
      <MouseGlow color="rgba(10,150,80,0.12)" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 20%, rgba(10,150,80,0.1), transparent 55%), radial-gradient(circle at 80% 70%, rgba(10,150,80,0.08), transparent 50%), radial-gradient(circle at 15% 75%, rgba(91,208,147,0.06), transparent 45%)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white dark:from-[#04060a] via-transparent to-white/40 dark:to-[#04060a]/40" />

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <div className="text-center">
          <motion.h1
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Automate Your
            <br />
            <span className="text-brand-600 dark:text-brand-400">
              Finance Workflow
            </span>
          </motion.h1>

          <motion.p
            className="font-rubik text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join a community of finance professionals automating bank reconciliation, financial
            modelling, and bookkeeping with real articles, free tools, and AI prompts. Built for
            finance professionals, not hype.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={isAuthenticated ? '/tools' : '/login'}
                className="btn-shine bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all duration-200 shadow-xl shadow-brand-500/20 hover:shadow-2xl flex items-center group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/articles"
                className="flex items-center px-8 py-4 text-zinc-700 dark:text-zinc-300 hover:text-brand-600 dark:hover:text-brand-400 font-semibold text-lg transition-all duration-200 group"
              >
                Read the Articles
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="border-t border-zinc-200 dark:border-white/10 pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="font-rubik text-sm text-zinc-500 mb-10">Some of the tools we automate with</p>
            <div className="flex flex-wrap items-center justify-center gap-10">
              {stack.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -4 }}
                >
                  <div className="card-rich w-24 h-24 rounded-3xl bg-white flex items-center justify-center p-5 shadow-lg border border-zinc-100 dark:border-transparent">
                    {item.icon ? (
                      <item.icon className="w-full h-full text-brand-600" />
                    ) : (
                      <img src={`https://cdn.simpleicons.org/${item.slug}`} alt={item.name} className="w-full h-full object-contain" />
                    )}
                  </div>
                  <span className="font-rubik text-sm font-medium text-zinc-500 dark:text-zinc-400">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
