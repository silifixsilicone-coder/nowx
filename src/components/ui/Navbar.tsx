'use client';

import React, { useState } from 'react';
import { Search, Bell, MessageSquareCode, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onSearch?: (query: string) => void;
  onCreatePostClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onSearch,
  onCreatePostClick,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    { id: 1, user: 'neon_rider', type: 'like', text: 'liked your visual post', time: '5m ago' },
    { id: 2, user: 'framer_wizard', type: 'comment', text: 'replied: "Saving this code immediately..."', time: '1h ago' },
    { id: 3, user: 'rust_ace', type: 'mention', text: 'mentioned you in #general-chat', time: '2h ago' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-effect border-b border-white/5 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => onViewChange('home')}>
          <span className="text-lg font-black tracking-wider bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent hover:brightness-110 transition-all">
            ReactVerse
          </span>
        </div>

        {/* Quick Right Side Actions (Clean & Premium exactly like the attached image) */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          
          {/* Search Trigger Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert("Search activation drawer loaded!")}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-gray-text hover:text-white transition-all cursor-pointer"
          >
            <Search className="h-4.5 w-4.5" />
          </motion.button>

          {/* Notifications Notification drawer trigger */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange('notifications')}
              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border text-gray-text hover:text-white transition-all cursor-pointer ${
                currentView === 'notifications' ? 'border-purple/50 bg-purple/10 text-purple' : 'border-white/5'
              }`}
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8.5px] font-black text-white border border-[#0B0B12] shadow-md">
                3
              </span>
            </motion.button>
          </div>

          {/* Premium React-Points gold coin pill button exactly like in the attached image */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onViewChange('profile')}
            className="flex h-9 items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-orange/10 border border-amber-500/30 rounded-full cursor-pointer shadow-md"
          >
            <span className="text-[12px] animate-pulse">🪙</span>
            <span className="text-[10px] font-black text-amber-400 tracking-wide uppercase leading-none">12.4K</span>
          </motion.div>

          {/* Circular user avatar for connection */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange('profile')}
            className={`h-9 w-9 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
              currentView === 'profile' ? 'border-purple shadow-md shadow-purple/30' : 'border-white/10'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
              alt="Alex Rivers"
              className="h-full w-full object-cover"
            />
          </motion.div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
