import React from 'react';
import { motion } from 'framer-motion';
import { getStats } from '../lib/contentStore';
import CountUp from './CountUp';

const Stats = () => {
  const stats = getStats();

  return (
    <section className="py-20 bg-gradient-to-br from-brand-700 to-brand-500 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-16 top-0 w-[55%] h-full bg-black/10 -skew-x-12 origin-top-left" />
        <div className="absolute right-0 top-0 w-[30%] h-full bg-black/10 skew-x-12" />
        <div className="absolute left-[20%] top-0 w-[15%] h-full bg-white/5 -skew-x-12" />
      </div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-3">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-rubik text-base sm:text-lg text-brand-50">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
