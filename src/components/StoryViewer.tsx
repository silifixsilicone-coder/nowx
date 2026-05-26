'use client';

import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Story } from '@/data/mockData';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentIndex];

  // Auto-progress effect
  useEffect(() => {
    setProgress(0);
    const duration = 5000; // 5 seconds per story
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose(); // Exit overlay if last story is completed
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 select-none md:p-4">
      
      {/* Click zones on left/right to skip stories on mobile */}
      <div className="absolute inset-0 flex">
        <div className="w-[30%] h-full z-10 cursor-west-resize" onClick={handlePrev} />
        <div className="w-[40%] h-full z-0" />
        <div className="w-[30%] h-full z-10 cursor-east-resize" onClick={handleNext} />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col justify-between bg-[#08080C] md:rounded-3xl border border-white/5 overflow-hidden shadow-2xl z-20">
        
        {/* Top Progress bar and Header */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-30">
          
          {/* Progress Indicators */}
          <div className="flex gap-1.5 mb-4">
            {stories.map((s, idx) => {
              let barProgress = 0;
              if (idx < currentIndex) barProgress = 100;
              if (idx === currentIndex) barProgress = progress;

              return (
                <div key={s.id} className="h-[3px] flex-1 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink to-purple transition-all duration-75"
                    style={{ width: `${barProgress}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* User info and Close */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full overflow-hidden border border-purple">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentStory.user.avatar}
                  alt={currentStory.user.displayName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {currentStory.user.displayName}
                </span>
                <span className="text-[10px] text-gray-text block">
                  @{currentStory.user.username} • {currentStory.timestamp}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-text hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors z-40 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

        </div>

        {/* Content Viewer (Image or Video layout) */}
        <div className="flex-1 flex items-center justify-center relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentStory.mediaUrl}
                alt="Story Media"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons for Desktop viewers */}
        <div className="hidden md:block">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors z-40 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {currentIndex < stories.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors z-40 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default StoryViewer;
