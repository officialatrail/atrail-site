import React from 'react';
import { motion } from 'framer-motion';

function Shape({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -120, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2.2, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} to-transparent backdrop-blur-[2px] border-2 border-white/[0.15] dark:border-white/[0.1] shadow-[0_8px_32px_0_rgba(10,150,80,0.08)]`}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ElegantShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Shape delay={0.3} width={460} height={110} rotate={12} gradient="from-brand-400/[0.12]" className="left-[-8%] top-[14%]" />
      <Shape delay={0.5} width={360} height={90} rotate={-15} gradient="from-emerald-400/[0.10]" className="right-[-4%] top-[68%]" />
      <Shape delay={0.4} width={240} height={64} rotate={-8} gradient="from-brand-300/[0.10]" className="left-[6%] bottom-[6%]" />
      <Shape delay={0.6} width={170} height={48} rotate={20} gradient="from-teal-400/[0.10]" className="right-[14%] top-[8%]" />
    </div>
  );
}
