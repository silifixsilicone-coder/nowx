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
    <header className="sticky top-0 z-50 w-full glass-effect transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => onViewChange('home')}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-pink via-purple to-orange shadow-md shadow-purple/30 flex-shrink-0"
          >
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </motion.div>
          <span className="text-base font-black tracking-wider text-gradient hidden sm:block">
            ReactVerse
          </span>
        </div>

        {/* Search Bar - Responsive layout visible everywhere */}
        <div className="flex relative flex-1 max-w-[140px] xs:max-w-[180px] sm:max-w-md mx-2 sm:mx-6">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
              <Search className={`h-3.5 w-3.5 transition-colors ${isSearchFocused ? 'text-purple' : 'text-gray-text'}`} />
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 text-white placeholder-gray-text transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  if (onSearch) onSearch('');
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-text hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Right Side Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          {/* Create Post Action (Lucide Quick add) - Desktop only */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreatePostClick}
            className="hidden md:flex h-8 items-center gap-1.5 px-3.5 text-xs font-bold tracking-wide rounded-xl bg-purple/10 text-purple border border-purple/20 hover:bg-purple/25 cursor-pointer transition-all"
          >
            <span>Post</span>
            <span>+</span>
          </motion.button>

          {/* Discord/DM channel quick toggle - Desktop only */}
          <div className="relative hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange('chat')}
              className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border text-gray-text hover:text-white transition-all cursor-pointer ${
                currentView === 'chat' ? 'border-purple/50 bg-purple/10 text-purple' : 'border-white/5'
              }`}
            >
              <MessageSquareCode className="h-4.5 w-4.5" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink text-[8px] font-bold text-white shadow-md shadow-pink/30">
                1
              </span>
            </motion.button>
          </div>

          {/* Notifications Notification Drawer - Mobile First Bell Icon */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border text-gray-text hover:text-white transition-all cursor-pointer ${
                showNotifications ? 'border-purple/50 bg-purple/10 text-purple' : 'border-white/5'
              }`}
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange text-[8px] font-bold text-white shadow-md shadow-orange/30">
                3
              </span>
            </motion.button>

            {/* Notification Dropdown Panel */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl glass-effect-card p-4 shadow-2xl z-50"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                      <h4 className="text-sm font-bold text-white">Notifications</h4>
                      <button className="text-xs text-purple hover:underline">Mark all read</button>
                    </div>
                    <div className="space-y-3">
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className="flex gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors cursor-pointer">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink to-purple flex items-center justify-center text-xs font-bold">
                            {notif.user[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white">
                              <span className="font-bold">@{notif.user}</span> {notif.text}
                            </p>
                            <span className="text-[10px] text-gray-text">{notif.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar Direct Navigation to Profile - Mobile first Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange('profile')}
            className={`h-8 w-8 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
              currentView === 'profile' ? 'border-purple shadow-md shadow-purple/30' : 'border-transparent'
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
