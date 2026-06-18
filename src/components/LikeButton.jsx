import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { toggleLike, isLikedByMe, getLikeCount } from '../lib/contentStore';

export default function LikeButton({ itemKey, className = '' }) {
  const [liked, setLiked] = useState(() => isLikedByMe(itemKey));
  const [count, setCount] = useState(() => getLikeCount(itemKey));

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await toggleLike(itemKey);
      setLiked(result.liked);
      setCount(result.count);
    } catch {
      // ignore - counts stay as they were
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
        liked ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400 hover:text-red-500'
      } ${className}`}
    >
      <motion.span whileTap={{ scale: 1.3 }}>
        <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
      </motion.span>
      {count}
    </button>
  );
}
