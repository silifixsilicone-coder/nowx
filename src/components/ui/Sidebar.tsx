'use client';

import React from 'react';
import { Home, Tv, MessageSquare, User, Compass, Swords, Flame, Settings, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockDiscordServers, currentUser } from '@/data/mockData';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  activeServerId?: string;
  onServerChange?: (serverId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  activeServerId = 'server_react',
  onServerChange,
}) => {
  const primaryNavs = [
    { id: 'home', icon: Home, label: 'Home Feed' },
    { id: 'explore', icon: Compass, label: 'Explore Space' },
    { id: 'watch', icon: Tv, label: 'ReactTV Shorts' },
    { id: 'battles', icon: Swords, label: 'Creator Battles' },
    { id: 'chat', icon: MessageSquare, label: 'Discord Spaces' },
    { id: 'profile', icon: User, label: 'Profile Hub' },
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
                <Icon className={`h-5 w-5 ${isActive ? 'text-purple' : 'text-gray-text'}`} />
                <span>{nav.label}</span>
              </button>
            );
          })}
        </div>

        {/* Discord / Communities Section */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-text/60 mb-2">
            Popular Servers
          </p>
          <div className="space-y-1">
            {mockDiscordServers.map((server) => {
              const isSelected = activeServerId === server.id && currentView === 'chat';
              
              return (
                <button
                  key={server.id}
                  onClick={() => {
                    if (onServerChange) onServerChange(server.id);
                    onViewChange('chat');
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-purple/10 border-purple/30 text-purple'
                      : 'border-transparent text-gray-text hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-xs text-center">
                    {server.icon}
                  </span>
                  <span className="truncate">{server.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trending Tags (Instagram + Reddit mix) */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-text/60 mb-2">
            Trending Space
          </p>
          <div className="space-y-1">
            {['#react19', '#tailwind_v4', '#framer_motion', '#rust_wasm'].map((tag) => (
              <a
                key={tag}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-text hover:text-pink transition-all font-medium"
              >
                <Flame className="h-3.5 w-3.5 text-orange" />
                <span>{tag}</span>
              </a>
            ))}
          </div>
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
