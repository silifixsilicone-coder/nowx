'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  Flame, 
  Award, 
  Swords, 
  Megaphone, 
  CheckCheck, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NotificationItem {
  id: string;
  type: 'like' | 'reply' | 'comment_like' | 'viral' | 'battle' | 'mention';
  user?: {
    username: string;
    displayName: string;
    avatar: string;
    isVerified?: boolean;
  };
  text: string;
  timestamp: string;
  previewUrl?: string; // Optional image preview of post/comment
  isUnread: boolean;
  battleJoined?: 'accepted' | 'declined' | null;
}

interface NotificationsPageProps {
  onBack?: () => void;
  onViewChange?: (view: string) => void;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onBack,
  onViewChange,
  unreadCount,
  setUnreadCount
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'likes' | 'replies' | 'battles' | 'mentions'>('all');

  // MOCK NOTIFICATIONS SEED DATA
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      type: 'like',
      user: {
        username: 'roast_king',
        displayName: 'Roast King',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
        isVerified: true
      },
      text: 'liked your comment: "Australia airplane mode me hai 😂✈️"',
      timestamp: '5m',
      previewUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=100',
      isUnread: true
    },
    {
      id: 'notif_2',
      type: 'reply',
      user: {
        username: 'meme_lord',
        displayName: 'Meme Lord',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
      },
      text: 'replied to your comment: "Next.js dev server starts in 0.1s but npm install takes 5 years 💀"',
      timestamp: '12m',
      previewUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=100',
      isUnread: true
    },
    {
      id: 'notif_3',
      type: 'comment_like',
      text: 'Your savage roast got 100 likes! 🔥 Keep cooking!',
      timestamp: '45m',
      isUnread: true
    },
    {
      id: 'notif_4',
      type: 'battle',
      user: {
        username: 'dev_dynamo',
        displayName: 'Dev Dynamo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        isVerified: true
      },
      text: 'invited you to a live Battle duel: "Tailwind CSS v4 vs Vanilla CSS Speed-Coding"',
      timestamp: '2h',
      isUnread: true,
      battleJoined: null
    },
    {
      id: 'notif_5',
      type: 'viral',
      text: 'Your comment is now a Fan Favorite 👑! Reached 500+ votes in Arena Lobby.',
      timestamp: '4h',
      isUnread: false
    },
    {
      id: 'notif_6',
      type: 'mention',
      user: {
        username: 'sarcastic_boy',
        displayName: 'Sarcastic Boy',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      },
      text: 'mentioned you: "@react_dev_99 write cleaner typescript code mate, Next.js server actions are Satisfying!"',
      timestamp: '1d',
      isUnread: false
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    setUnreadCount(0);
  };

  const handleMarkItemRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === id && n.isUnread) {
          setUnreadCount(count => Math.max(0, count - 1));
          return { ...n, isUnread: false };
        }
        return n;
      })
    );
  };

  const handleBattleAction = (id: string, action: 'accepted' | 'declined') => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === id) {
          return { ...n, battleJoined: action, isUnread: false };
        }
        return n;
      })
    );
    // If accept, take the user directly to the Battles page
    if (action === 'accepted' && onViewChange) {
      alert("Battle Invitation Accepted! Entering Battle Arena lobby... ⚔️");
      onViewChange('battles');
    }
  };

  // Icon Getter
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 fill-pink text-pink" />;
      case 'reply':
        return <MessageSquare className="h-4 w-4 fill-purple/10 text-purple" />;
      case 'comment_like':
        return <Flame className="h-4 w-4 text-orange" />;
      case 'viral':
        return <Award className="h-4 w-4 text-yellow-500" />;
      case 'battle':
        return <Swords className="h-4 w-4 text-cyan-400" />;
      case 'mention':
        return <Megaphone className="h-4 w-4 text-pink" />;
      default:
        return <Bell className="h-4 w-4 text-gray-text" />;
    }
  };

  // Filter Categories Logic
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'likes') return n.type === 'like' || n.type === 'comment_like';
    if (activeTab === 'replies') return n.type === 'reply' || n.type === 'viral';
    if (activeTab === 'battles') return n.type === 'battle';
    if (activeTab === 'mentions') return n.type === 'mention';
    return true;
  });

  return (
    <div className="max-w-xl mx-auto space-y-5 select-none pb-28 md:pb-8 font-sans">
      
      {/* 1. STICKY TOP HEADER */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/5 sticky top-0 bg-background/90 backdrop-blur-md z-30 pt-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple/10 flex items-center justify-center text-purple shadow-inner">
            <Bell className="h-5.5 w-5.5 text-purple" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-wide">
              Activity Alerts
            </h1>
            <span className="text-[9.5px] text-gray-text font-bold block uppercase tracking-wider mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread notification updates` : 'All caught up!'}
            </span>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-[9px] font-black uppercase text-purple hover:text-white border border-purple/35 hover:bg-purple/10 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md bg-purple/5"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* 2. FILTER TABS (Threads clean spacing layout) */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-white/5">
        {[
          { id: 'all', label: 'All' },
          { id: 'likes', label: 'Likes' },
          { id: 'replies', label: 'Replies' },
          { id: 'battles', label: 'Battles ⚔️' },
          { id: 'mentions', label: 'Mentions 📢' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-purple text-white shadow-[0_0_12px_rgba(124,58,237,0.4)] border border-purple'
                  : 'bg-[#12131C] border border-white/5 text-gray-text hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. DYNAMIC NOTIFICATIONS LIST */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleMarkItemRead(notif.id)}
              className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 relative cursor-pointer group ${
                notif.isUnread
                  ? 'bg-purple/[0.02] border-purple/10 hover:border-purple/35 shadow-[0_4px_20px_rgba(124,58,237,0.03)]'
                  : 'bg-[#12131C] border-white/5 hover:border-white/10'
              }`}
            >
              {/* Unread dot indicator indicator */}
              {notif.isUnread && (
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-purple animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
              )}

              {/* Left Column: avatar & type icon overlay */}
              <div className={`flex gap-3 items-center ${notif.isUnread ? 'pl-2.5' : ''}`}>
                <div className="relative flex-shrink-0">
                  {notif.user ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={notif.user.avatar}
                      alt={notif.user.displayName}
                      className="h-9 w-9 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Bell className="h-4.5 w-4.5 text-gray-text" />
                    </div>
                  )}

                  {/* Tiny overlay type icon */}
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#12131C] border border-white/10 flex items-center justify-center shadow-md">
                    {getNotificationIcon(notif.type)}
                  </span>
                </div>

                {/* Notification Text content */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {notif.user && (
                      <span className="text-xs font-black text-white hover:underline cursor-pointer block leading-none">
                        {notif.user.displayName}
                      </span>
                    )}
                    {notif.user?.isVerified && (
                      <span className="text-[10px] text-purple font-black">⚡</span>
                    )}
                    <span className="text-[9px] text-gray-text font-bold uppercase tracking-wider block">
                      {notif.timestamp} ago
                    </span>
                  </div>

                  <p className="text-[11.5px] text-white/90 font-medium leading-relaxed mt-1 pr-4">
                    {notif.user && (
                      <span className="text-gray-text font-extrabold mr-1">@{notif.user.username}</span>
                    )}
                    {notif.text}
                  </p>

                  {/* Battle invitation active response buttons */}
                  {notif.type === 'battle' && (
                    <div className="flex gap-2 mt-3">
                      {notif.battleJoined === null ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBattleAction(notif.id, 'accepted');
                            }}
                            className="px-4 py-1.8 rounded-xl bg-purple text-white text-[10px] font-black uppercase tracking-wider hover:bg-opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
                          >
                            Accept ⚔️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBattleAction(notif.id, 'declined');
                            }}
                            className="px-3.5 py-1.8 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-text hover:text-white transition-all cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="text-[9px] font-black uppercase text-purple flex items-center gap-1 bg-purple/10 border border-purple/35 px-2.5 py-1 rounded-full">
                          <ShieldCheck className="h-3.5 w-3.5 text-purple" />
                          <span>Invitation {notif.battleJoined}</span>
                        </span>
                      )}
                    </div>
                  )}

                </div>
              </div>

              {/* Right Column: Optional Preview image thumbnail */}
              {notif.previewUrl && (
                <div className="h-9 w-9 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 relative group-hover:scale-102 transition-transform shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={notif.previewUrl}
                    alt="post preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              )}

            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16 glass-effect rounded-[28px] border border-white/5 space-y-2">
            <span className="text-3xl block">🔔</span>
            <span className="text-xs text-gray-text font-black uppercase tracking-wider block">Lobby silent. No alerts found.</span>
            <span className="text-[10px] text-gray-text/75 block">Check back later for likes, replies, and battles!</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default NotificationsPage;
