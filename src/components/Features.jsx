import React from 'react';
import { motion } from 'framer-motion';
import { getPillars } from '../lib/contentStore';
import { iconRegistry } from '../lib/iconRegistry';
import RotatingImage from './RotatingImage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Features = () => {
  const pillars = getPillars();

  return (
    <section id="pillars" className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            Real Automations for
            <span className="text-brand-600 dark:text-brand-400"> Real Finance Work</span>
          </h2>
          <p className="font-rubik text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            Not demos, not generic AI hype, just workflows you can implement the same day.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {pillars.map((pillar) => {
            const Icon = iconRegistry[pillar.icon];
            return (
              <motion.div
                key={pillar.title}
                className="card-rich group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 border border-slate-100 dark:border-zinc-800 hover:border-brand-200 dark:hover:border-brand-800"
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {pillar.images ? (
                    <RotatingImage images={pillar.images} alt={pillar.title} className="w-full h-full" />
                  ) : pillar.image ? (
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-600 flex items-center justify-center">
                      {Icon && <Icon className="w-12 h-12 text-white" />}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-7">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {pillar.title}
                  </h3>
                  <p className="font-rubik text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-brand-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: '0%' }}
                  viewport={{ once: true }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
