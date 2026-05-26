'use client';

import React from 'react';
import { Home, Compass, Plus, Swords, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onCreatePostClick: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  onViewChange,
  onCreatePostClick,
}) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'add', icon: Plus, label: 'Create', special: true },
    { id: 'battles', icon: Swords, label: 'Battles' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0B0B12]/85 backdrop-blur-xl border-t border-white/10 rounded-t-[28px] py-2 px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-end justify-between max-w-md mx-auto relative h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          if (tab.special) {
            return (
              <div key={tab.id} className="relative flex justify-center w-16 h-full items-center">
                <motion.button
                  onClick={onCreatePostClick}
                  // Floating vertical animation
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }}
                  // Click bounce animation
                  whileTap={{ scale: 0.9 }}
                  className="absolute -top-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple to-pink text-white shadow-[0_0_20px_rgba(124,58,237,0.6)] hover:shadow-[0_0_30px_rgba(255,46,147,0.8)] border-2 border-[#0B0B12] cursor-pointer focus:outline-none z-50"
                  style={{
                    boxShadow: "0 0 20px rgba(124, 58, 237, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.3)"
                  }}
                >
                  <Plus className="h-7 w-7 stroke-[3px]" />
                </motion.button>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 focus:outline-none cursor-pointer select-none"
            >
              {/* Active Tab Glow background effect */}
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="absolute -top-2 w-10 h-10 bg-purple/15 blur-md rounded-full -z-10"
                />
              )}

              <Icon
                className={`h-5.5 w-5.5 mb-1 transition-all duration-250 ${
                  isActive 
                    ? 'text-purple stroke-[2.5px] drop-shadow-[0_0_5px_rgba(124,58,237,0.6)]' 
                    : 'text-gray-text hover:text-white'
                }`}
              />
              
              <span
                className={`text-[9px] font-black tracking-wider transition-colors ${
                  isActive ? 'text-purple' : 'text-gray-text'
                }`}
              >
                {tab.label}
              </span>

              {/* Sleek Active indicator dot below text */}
              {isActive && (
                <motion.div
                  layoutId="activeTabDot"
                  className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple to-pink shadow-[0_0_8px_rgba(255,46,147,0.8)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
