'use client';

import React from 'react';
import { Home, User, Bell, Swords, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { currentUser } from '@/data/mockData';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  activeServerId?: string;
  onServerChange?: (serverId: string) => void;
  unreadNotificationsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  unreadNotificationsCount = 0
}) => {
  const primaryNavs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'battles', icon: Swords, label: 'Battles' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-white/5 bg-background sticky top-16 select-none">
      
      {/* Scrollable primary navigation column */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 custom-scrollbar">
        
        {/* Main Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-text/60 mb-2">
            Navigation
          </p>
          {primaryNavs.map((nav) => {
            const Icon = nav.icon;
            const isActive = currentView === nav.id;

            return (
              <button
                key={nav.id}
                onClick={() => onViewChange(nav.id)}
                className={`relative flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-text hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarNav"
                    className="absolute inset-0 bg-gradient-to-r from-purple/20 to-pink/5 border-l-2 border-purple rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-purple' : 'text-gray-text'}`} />
                  {nav.id === 'notifications' && unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 bg-red-500 rounded-full text-[7.5px] font-black text-white flex items-center justify-center border border-[#0B0B12] shadow-md animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </div>
                <span>{nav.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* User profile details at the bottom of the sidebar */}
      <div className="border-t border-white/5 p-4 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="h-full w-full rounded-xl object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white truncate max-w-[100px]">
                {currentUser.displayName}
              </span>
              <span className="text-[10px] text-purple">⚡</span>
            </div>
            <span className="text-[10px] text-gray-text block truncate">
              @{currentUser.username}
            </span>
          </div>
        </div>
        <button
          onClick={() => onViewChange('profile')}
          className="text-gray-text hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Settings className="h-4.5 w-4.5" />
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
