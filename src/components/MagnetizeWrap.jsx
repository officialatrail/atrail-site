import React, { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function MagnetizeWrap({ children, particleCount = 10, className = '' }) {
  const [particles, setParticles] = useState([]);
  const [isAttracting, setIsAttracting] = useState(false);
  const particlesControl = useAnimation();

  useEffect(() => {
    setParticles(
      Array.from({ length: particleCount }, () => ({
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      }))
    );
  }, [particleCount]);

  const handleEnter = useCallback(() => {
    setIsAttracting(true);
    particlesControl.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 50, damping: 10 } });
  }, [particlesControl]);

  const handleLeave = useCallback(() => {
    setIsAttracting(false);
    particlesControl.start((i) => ({
      x: particles[i]?.x ?? 0,
      y: particles[i]?.y ?? 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    }));
  }, [particlesControl, particles]);

  return (
    <div
      className={`relative inline-flex touch-none ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {particles.map((p, index) => (
        <motion.span
          key={index}
          custom={index}
          initial={{ x: p.x, y: p.y }}
          animate={particlesControl}
          className={`absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-brand-400 pointer-events-none transition-opacity duration-300 ${isAttracting ? 'opacity-90' : 'opacity-0'}`}
        />
      ))}
      {children}
    </div>
  );
}
