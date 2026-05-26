'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Story } from '@/data/mockData';

interface StoryCircleProps {
  story: Story;
  onClick: () => void;
}

export const StoryCircle: React.FC<StoryCircleProps> = ({ story, onClick }) => {
  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer select-none" onClick={onClick}>
      
      {/* Outer border animated gradient wrap */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: [0, 5, -5, 0] }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full p-[2px] shadow-lg shadow-purple/10"
      >
        {/* Colorful gradient outline ring */}
        <div
          className={`absolute inset-0 rounded-full story-border-gradient transition-opacity duration-300 ${
            story.viewed ? 'opacity-40' : 'opacity-100'
          }`}
        />
        
        {/* Dark spacing layer */}
        <div className="absolute inset-[2.5px] rounded-full bg-background" />

        {/* User avatar content */}
        <div className="relative h-full w-full rounded-full overflow-hidden border border-black/40 bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.user.avatar}
            alt={story.user.displayName}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Small live badge if not viewed */}
        {!story.viewed && (
          <span className="absolute -bottom-0.5 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink" />
          </span>
        )}

      </motion.div>

      {/* User Display Name */}
      <span className="text-[10px] font-bold text-gray-text max-w-[64px] truncate text-center">
        {story.user.username}
      </span>

    </div>
  );
};

export default StoryCircle;
