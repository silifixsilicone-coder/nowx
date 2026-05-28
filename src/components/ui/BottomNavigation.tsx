'use client';

import React from 'react';
import { Home, Plus, Swords, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onCreatePostClick: () => void;
  unreadNotificationsCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  onViewChange,
  onCreatePostClick,
  unreadNotificationsCount = 0
}) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'create_post', icon: Plus, label: 'Create', isCreate: true },
    { id: 'battles', icon: Swords, label: 'Battles' },
    { id: 'notifications', icon: Bell, label: 'Alerts', unreadBadge: true },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0B0B12]/80 light:bg-[#FFFFFF]/80 backdrop-blur-xl border-t border-white/10 light:border-[#E5E7EB] rounded-t-[24px] px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
      <div className="flex items-center justify-between max-w-md mx-auto h-12">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          const handleClick = () => {
            if (tab.isCreate) {
              onCreatePostClick();
            } else {
              onViewChange(tab.id);
            }
          };

          return (
            <button
              key={tab.id}
              onClick={handleClick}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 focus:outline-none cursor-pointer select-none"
            >
              <div className="relative flex items-center justify-center">
                {tab.isCreate ? (
                  <div className="bg-gradient-to-tr from-purple via-pink to-orange text-white p-1 rounded-lg flex items-center justify-center shadow-md">
                    <Plus className="h-4.5 w-4.5 stroke-[3px]" />
                  </div>
                ) : (
                  <Icon
                    className={`h-5 w-5 transition-all duration-250 ${
                      isActive 
                        ? 'text-purple stroke-[2.5px] drop-shadow-[0_0_5px_rgba(124,58,237,0.4)]' 
                        : 'text-gray-text hover:text-white light:hover:text-black'
                    }`}
                  />
                )}
                {tab.unreadBadge && unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 bg-red-500 rounded-full text-[7.5px] font-black text-white flex items-center justify-center border border-[#0B0B12] light:border-[#FFFFFF] shadow-md animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </div>
              
              <span
                className={`text-[8.5px] font-black tracking-wider mt-1 transition-colors ${
                  isActive ? 'text-purple' : 'text-gray-text'
                }`}
              >
                {tab.label}
              </span>

              {/* Sleek Active indicator dot below text */}
              {isActive && (
                <motion.div
                  layoutId="activeTabDot"
                  className="absolute bottom-[-2px] w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple to-pink shadow-[0_0_8px_rgba(255,46,147,0.8)]"
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
