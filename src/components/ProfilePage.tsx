'use client';

import React, { useState } from 'react';
import {
  Zap,
  Flame,
  Award,
  Users,
  Grid,
  MessageSquare,
  Heart,
  Share2,
  TrendingUp,
  Trophy,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Target,
  Gamepad2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { currentUser, mockPosts, mockUsers, Post, Comment } from '@/data/mockData';

interface ProfilePageProps {
  onBack?: () => void;
  onPostClick?: (postId: string) => void;
  onLogout?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onPostClick, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'likes'>('posts');
  const [witScore, setWitScore] = useState(940);
  const [xp, setXp] = useState(2400);
  const xpMax = 3000;
  const level = 24;

  // Curated list of gaming/community achievements for the user
  const badges = [
    { id: 'roast_master', name: 'Roast Master', icon: '🔥', desc: 'Accrued 10k+ roast reaction points', color: 'from-orange/20 to-orange/5 border-orange/45 text-orange' },
    { id: 'hype_leader', name: 'Hype Leader', icon: '❤️', desc: 'Set up 5 successful platform hype chains', color: 'from-pink/20 to-pink/5 border-pink/45 text-pink' },
    { id: 'react_pioneer', name: 'React 19 Pioneer', icon: '⚛️', desc: 'Initial deployer of React 19 server blocks', color: 'from-purple/20 to-purple/5 border-purple/45 text-purple' },
    { id: 'battle_tactician', name: 'Arena Tactician', icon: '🎯', desc: 'Voted on 10 active creator fan battles', color: 'from-cyan/20 to-cyan/5 border-cyan/45 text-cyan-400' },
  ];

  // User details
  const user = currentUser;

  // Filter posts that belong to the user
  const userPosts = mockPosts.filter((p) => p.user.id === 'me');

  // Generate some realistic mock replies (comments) created by this user
  const userReplies = [
    {
      id: 'rep_1',
      postTitle: 'Team India Wins The World Cup! 🏆🇮🇳',
      postCommunity: 'r/cricket',
      content: 'Absolutely unmatched timing! Hitman pulling it off and Virat anchoring the chase, best day in years! 🇮🇳💙',
      timestamp: '2h ago',
      likes: 42,
    },
    {
      id: 'rep_2',
      postTitle: 'Tailwind CSS v4.0 is a complete game-changer!',
      postCommunity: 'r/tailwind',
      content: 'The custom `@theme` directive in CSS is absolute bliss, my build scripts just shrunk by 80 lines! 🎨',
      timestamp: '5h ago',
      likes: 18,
    },
    {
      id: 'rep_3',
      postTitle: 'Smooth Staggered Menu in Framer Motion',
      postCommunity: 'r/nextjs',
      content: 'Using layoutId for cross-frame tab glows has never been this smooth. Thanks for sharing the code block!',
      timestamp: '1d ago',
      likes: 56,
    }
  ];

  // Liked posts mock list
  const likedPosts = mockPosts.filter(p => p.id === 'post_cricket_1' || p.id === 'post_4');

  const handleShareProfile = () => {
    alert(`Copied profile link for @${user.username} to clipboard!`);
  };

  const handleBoostWit = () => {
    // Mini gamification interactivity
    setWitScore(prev => prev + 15);
    setXp(prev => {
      const nextXp = prev + 350;
      if (nextXp >= xpMax) {
        return nextXp - xpMax;
      }
      return nextXp;
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-6 select-none">
      
      {/* 1. Header Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center p-2 rounded-xl border border-white/10 bg-white/5 text-gray-text hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              ←
            </button>
          )}
          <div>
            <span className="text-[10px] font-black uppercase text-pink tracking-widest block">PLAYER PROFILE</span>
            <h2 className="text-base font-black text-white tracking-wide">
              @{user.username}
            </h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareProfile}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple hover:text-white border border-purple/35 hover:bg-purple/10 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md bg-purple/5"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share Space</span>
          </button>
          
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-pink hover:text-white border border-pink/35 hover:bg-pink/10 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md bg-pink/5"
            >
              <span>Sign Out 🚪</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Hero Panel (Instagram layout + Gaming visual features) */}
      <div className="glass-effect rounded-[28px] p-6 border border-white/8 relative overflow-hidden bg-gradient-to-tr from-purple/10 via-background to-pink/5">
        
        {/* Colorful neon background glowing blur blocks */}
        <div className="absolute top-0 right-0 h-28 w-28 bg-pink/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 h-24 w-24 bg-purple/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6">
          
          {/* Gaming avatar with complex neon state-ring glow */}
          <div className="relative flex-shrink-0">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 p-1.5 rounded-[36px] bg-gradient-to-tr from-purple via-pink to-orange animate-pulse shadow-[0_0_20px_rgba(255,46,147,0.3)]">
              <div className="h-full w-full rounded-[30px] overflow-hidden bg-[#0B0B12] border-2 border-[#0B0B12] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            {/* Gamified level status label tag pinned below avatar */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple to-pink border border-white/20 text-[9px] font-black uppercase text-white px-3 py-1 rounded-full shadow-lg tracking-wider whitespace-nowrap">
              LVL {level}
            </div>
            {/* Active connection glowing dot */}
            <span className="absolute top-1 right-1 h-5 w-5 rounded-full border-3 border-[#0B0B12] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          </div>

          {/* Player details info */}
          <div className="flex-1 text-center md:text-left space-y-2 min-w-0">
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {user.displayName}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-purple/20 border border-purple/35 text-[9px] font-black uppercase text-purple tracking-widest">
                  PRO WRITER <ShieldCheck className="h-2.5 w-2.5" />
                </span>
                {user.isVerified && (
                  <span className="h-5 w-5 rounded-full bg-gradient-to-tr from-pink to-orange text-white flex items-center justify-center text-xs font-black shadow-md">
                    ⚡
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-text max-w-lg leading-relaxed font-medium italic">
              "{user.bio}"
            </p>

            {/* Custom gaming tag specs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
              <span className="bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-[9px] font-extrabold text-white/80 uppercase">
                ⚔️ Class: Frontend Warlock
              </span>
              <span className="bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-[9px] font-extrabold text-white/80 uppercase">
                🔥 Main: Framer Motion
              </span>
              <span className="bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-[9px] font-extrabold text-white/80 uppercase">
                👾 Server: Asia-West
              </span>
            </div>
          </div>

        </div>

        {/* 3. Gaming Level Progress Bar */}
        <div className="mt-8 pt-5 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-black text-white/95 uppercase tracking-wide">
            <span className="flex items-center gap-1">
              <Gamepad2 className="h-3.5 w-3.5 text-purple" />
              <span>Rank Experience</span>
            </span>
            <span className="text-pink">
              {xp.toLocaleString()} / {xpMax.toLocaleString()} XP ({Math.round((xp / xpMax) * 100)}%)
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden flex relative p-[1px] border border-white/5 shadow-inner">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(xp / xpMax) * 100}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 15 }}
              className="h-full bg-gradient-to-r from-purple via-pink to-orange rounded-full shadow-[0_0_12px_rgba(255,46,147,0.5)]"
            />
          </div>
          <span className="text-[9px] text-gray-text block text-center uppercase tracking-widest">
            🏆 Earn XP by posting, voting, and accumulating reactions on your roasts
          </span>
        </div>

      </div>

      {/* 4. Gamified Analytics Cards Deck (Followers, Following, Wit Score) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        
        {/* A. Followers widget */}
        <div className="glass-effect rounded-2xl p-4 border border-white/5 bg-white/[0.01] flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-gray-text uppercase tracking-widest block">Followers</span>
            <span className="text-xl font-black text-white tracking-wide">{(user.followers).toLocaleString()}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* B. Following widget */}
        <div className="glass-effect rounded-2xl p-4 border border-white/5 bg-white/[0.01] flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-gray-text uppercase tracking-widest block">Following</span>
            <span className="text-xl font-black text-white tracking-wide">{(user.following).toLocaleString()}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-pink/10 border border-pink/20 flex items-center justify-center text-pink">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* C. Wit Score rating scale */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={handleBoostWit}
          className="glass-effect rounded-2xl p-4 border border-orange/25 bg-orange/[0.02] flex items-center justify-between relative overflow-hidden group cursor-pointer col-span-2 sm:col-span-1 shadow-[0_0_15px_rgba(255,138,0,0.06)]"
        >
          {/* Pulsing light */}
          <div className="absolute top-0 right-0 h-8 w-8 bg-orange/10 rounded-full blur-md" />
          
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-orange uppercase tracking-widest block">WIT SCORE LP</span>
              <span className="animate-bounce text-xs">🔥</span>
            </div>
            <span className="text-xl font-black text-gradient tracking-wide">{witScore} LP</span>
            <span className="text-[8px] text-gray-text block uppercase">Top 1.5% Dev Roaster</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-orange/10 border border-orange/30 flex items-center justify-center text-orange group-hover:scale-110 transition-transform">
            <Zap className="h-5 w-5 fill-orange" />
          </div>
        </motion.div>

      </div>

      {/* 5. Unlocked Gamer Achievements (Badges Section) */}
      <div className="glass-effect rounded-2xl p-5 border border-white/5 bg-white/[0.01] space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4.5 w-4.5 text-orange" />
          <span className="text-xs font-black text-white uppercase tracking-wider">Unlocked Hall of Badges</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`bg-gradient-to-br border rounded-xl p-3 flex items-start gap-3 transition-all hover:scale-[1.02] ${badge.color}`}
            >
              <div className="text-2xl mt-0.5">{badge.icon}</div>
              <div className="min-w-0">
                <span className="text-xs font-black text-white block tracking-wide truncate">{badge.name}</span>
                <span className="text-[9px] text-gray-text block mt-0.5 leading-normal">{badge.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Instagram-Gaming Interactive Tabs (Posts Grid, Replies Tab, Likes Tab) */}
      <div className="space-y-4">
        
        {/* Navigation Selector Tabs */}
        <div className="flex border-b border-white/5 pb-2 justify-around">
          {[
            { id: 'posts', label: 'Posts Deck', icon: Grid },
            { id: 'replies', label: 'Replies', icon: MessageSquare },
            { id: 'likes', label: 'Liked Pins', icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider relative pb-2 px-4 cursor-pointer focus:outline-none transition-colors ${
                  isActive ? 'text-white' : 'text-gray-text hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-purple' : 'text-gray-text'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="profileViewTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple to-pink"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Render Deck */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pt-2"
          >
            
            {/* TABS A: Posts Grid (Instagram style grid layout with hover stats overlays) */}
            {activeTab === 'posts' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onPostClick && onPostClick(post.id)}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5 cursor-pointer group shadow-md"
                  >
                    {post.type === 'image' && post.mediaUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : post.type === 'video' && post.mediaUrl ? (
                      <div className="relative w-full h-full">
                        <video src={post.mediaUrl} className="w-full h-full object-cover" muted loop playsInline />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg text-[9px] font-black text-white">
                          VIDEO 🎥
                        </div>
                      </div>
                    ) : post.type === 'discord-code' ? (
                      <div className="w-full h-full bg-[#12131C] p-3 font-mono text-[8px] text-purple/80 overflow-hidden leading-tight flex flex-col justify-between">
                        <span className="text-gray-text font-black block text-[9px] border-b border-white/5 pb-1">⚛️ CODE BLOCK</span>
                        <code className="block flex-1 mt-1 truncate whitespace-pre">{post.mediaUrl}</code>
                        <span className="text-[7px] text-pink tracking-widest text-right block pt-1 font-bold">Framer Motion</span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-[#12131C] p-4 flex flex-col justify-between">
                        <span className="text-gray-text font-black block text-[8px] uppercase tracking-widest">Text Roast</span>
                        <p className="text-xs text-white/95 font-bold italic truncate max-w-full">"{post.content}"</p>
                        <span className="text-[7px] text-purple uppercase tracking-wider block">ReactVerse</span>
                      </div>
                    )}

                    {/* Instagram-style details hover overlay banner */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-4">
                      {post.title && (
                        <span className="text-[10px] font-black text-white block truncate mb-1">{post.title}</span>
                      )}
                      <div className="flex gap-4 items-center">
                        <span className="text-[10px] font-black text-purple flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 fill-purple" />
                          <span>{post.likes}</span>
                        </span>
                        <span className="text-[10px] font-black text-pink flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 fill-pink" />
                          <span>{post.commentsCount}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {userPosts.length === 0 && (
                  <div className="col-span-3 text-center py-10 glass-effect rounded-2xl border border-white/5">
                    <span className="text-xs text-gray-text font-bold uppercase tracking-wider">No active post contributions found.</span>
                  </div>
                )}
              </div>
            )}

            {/* TABS B: Replies (Reddit style list layout of comments) */}
            {activeTab === 'replies' && (
              <div className="space-y-4">
                {userReplies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2 hover:bg-white/[0.04] transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[9px] font-black text-purple uppercase tracking-widest">
                        Replied in {reply.postCommunity}
                      </span>
                      <span className="text-[9px] text-gray-text font-bold">{reply.timestamp}</span>
                    </div>

                    <div className="bg-black/30 border border-white/5 px-3 py-2 rounded-xl text-[10px] italic text-gray-text/90 font-medium">
                      Original Post: "{reply.postTitle}"
                    </div>

                    <p className="text-xs sm:text-sm text-white/95 font-bold italic tracking-wide leading-relaxed pl-1 pt-1">
                      "{reply.content}"
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[9px] font-black text-pink flex items-center gap-1 bg-pink/5 border border-pink/30 px-2 py-0.5 rounded-lg">
                        <span>❤️ {reply.likes}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TABS C: Likes Tab (Sleek post grid of liked assets) */}
            {activeTab === 'likes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {likedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onPostClick && onPostClick(post.id)}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3 hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.user.avatar}
                          alt="avatar"
                          className="h-6 w-6 rounded-lg object-cover border border-white/10"
                        />
                        <span className="text-[10px] font-black text-white">@{post.user.username}</span>
                      </div>
                      <span className="text-[9px] font-black text-pink bg-pink/10 border border-pink/30 px-2.5 py-0.5 rounded-xl uppercase">
                        {post.community || 'ReactVerse'}
                      </span>
                    </div>

                    {post.mediaUrl && post.type === 'image' && (
                      <div className="aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="space-y-1">
                      {post.title && (
                        <h4 className="text-xs font-black text-white truncate">{post.title}</h4>
                      )}
                      <p className="text-[10px] text-gray-text line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    <div className="flex gap-4 pt-1 items-center border-t border-white/5 pt-2 mt-1">
                      <span className="text-[9px] font-black text-purple flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 fill-purple" />
                        <span>{post.likes}</span>
                      </span>
                      <span className="text-[9px] font-black text-pink flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 fill-pink" />
                        <span>{post.commentsCount}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default ProfilePage;
