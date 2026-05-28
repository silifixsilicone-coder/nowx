'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Flame,
  Award,
  BookMarked,
  LayoutGrid,
  ListFilter,
  LogOut,
  Settings,
  Plus
} from 'lucide-react';

// Reusable Components
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';
import BottomNavigation from '@/components/ui/BottomNavigation';
import StoryCircle from '@/components/StoryCircle';
import StoryViewer from '@/components/StoryViewer';
import FeedCard from '@/components/FeedCard';
import TikTokFeed from '@/components/TikTokFeed';
import DiscordChat from '@/components/DiscordChat';
import CreatePostModal from '@/components/CreatePostModal';
import CreatePostPage from '@/components/CreatePostPage';
import BattleArenaPage from '@/components/BattleArenaPage';
import BattleFeedPage from '@/components/BattleFeedPage';
import ProfilePage from '@/components/ProfilePage';
import LoginPage from '@/components/LoginPage';
import NotificationsPage from '@/components/NotificationsPage';
import PostDetailPage from '@/components/PostDetailPage';

// Mock Data
import {
  mockStories,
  mockPosts,
  currentUser,
  mockUsers,
  Post
} from '@/data/mockData';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Load and apply theme on first boot mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('reactverse-theme') as 'dark' | 'light' | 'system' | null;
    if (savedTheme) {
      applyGlobalTheme(savedTheme);
    }
  }, []);

  const applyGlobalTheme = (targetTheme: 'dark' | 'light' | 'system') => {
    if (targetTheme === 'light') {
      document.documentElement.classList.add('light');
    } else if (targetTheme === 'dark') {
      document.documentElement.classList.remove('light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
      }
    }
  };

  const [currentView, setCurrentView] = useState<string>('home');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(4);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeServerId, setActiveServerId] = useState('server_react');
  const [activeHomeTab, setActiveHomeTab] = useState<string>('forYou');
  const [profileTab, setProfileTab] = useState<'posts' | 'saved' | 'badges'>('posts');
  const [exploreCategory, setExploreCategory] = useState<string>('all');
  const [battleVoted, setBattleVoted] = useState<'A' | 'B' | null>(null);
  const [battleVotesA, setBattleVotesA] = useState<number>(475);
  const [battleVotesB, setBattleVotesB] = useState<number>(512);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentsSort, setCommentsSort] = useState<'top' | 'new' | 'controversial'>('top');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Story Tray trigger click
  const handleStoryClick = (idx: number) => {
    setActiveStoryIndex(idx);
  };

  // Add post creator modal submission
  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  // Filter posts based on Home tab
  const filteredPosts = posts.filter((post) => {
    if (activeHomeTab === 'following') {
      return post.user.id !== 'user_2'; // Simulate minor filter
    }
    return true;
  });

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setCurrentView('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col custom-scrollbar">
      
      {/* 1. Global sticky header Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onCreatePostClick={() => setCurrentView('create_post')}
      />

      {/* Main content grid split */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative items-stretch">
        
        {/* 2. Left side Desktop persistent navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          activeServerId={activeServerId}
          onServerChange={setActiveServerId}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* 3. Central dynamic viewport panel container */}
        <main className="flex-1 min-w-0 md:p-6 pb-24 md:pb-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="h-full w-full"
            >
              
              {/* --- VIEW: HOME FEED (Instagram/Reddit layout) --- */}
              {currentView === 'home' && (
                <div className="max-w-2xl mx-auto w-full space-y-6">
                  
                  {/* Category tabs exactly styled like the attached screenshot */}
                  <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
                    {[
                      { id: 'forYou', label: 'For You', icon: '' },
                      { id: 'trending', label: 'Trending', icon: '' },
                      { id: 'roast', label: 'Roast 🔥', icon: '' },
                      { id: 'hype', label: 'Hype ❤️', icon: '' },
                      { id: 'memes', label: 'Memes 😂', icon: '' },
                    ].map((tab) => {
                      const isActive = activeHomeTab === tab.id;
                      return (
                        <motion.button
                          key={tab.id}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            setActiveHomeTab(tab.id);
                            if (tab.id === 'battles_tab') {
                              setCurrentView('battles');
                            }
                          }}
                          className={`flex items-center gap-1 px-4.5 py-1.8 rounded-full text-xs font-black transition-all cursor-pointer border ${
                            isActive 
                              ? 'bg-[#FF6A00] border-transparent text-white shadow-[0_4px_12px_rgba(255,106,0,0.2)]' 
                              : 'bg-[#12131C] border-white/5 text-gray-text hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span>{tab.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Story Tray (Horizontal Scroll Card List) */}
                  <div className="glass-effect rounded-[28px] p-4 flex gap-4 overflow-x-auto no-scrollbar items-center border border-white/5 bg-white/[0.01]">
                    
                    {/* Self post quick composer shortcut */}
                    <div
                      onClick={() => setIsCreateModalOpen(true)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer select-none flex-shrink-0"
                    >
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[#FF6A00]/40 bg-[#FF6A00]/5 hover:bg-[#FF6A00]/10 hover:border-[#FF6A00] transition-all">
                        <Plus className="h-6 w-6 text-[#FF6A00]" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-text">Create</span>
                    </div>

                    {/* Other stories list */}
                    {mockStories.map((story, index) => (
                      <StoryCircle
                        key={story.id}
                        story={story}
                        onClick={() => handleStoryClick(index)}
                      />
                    ))}
                  </div>

                  {/* Today's Spotlight card exactly like in the attached screenshot */}
                  <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-[28px] overflow-hidden p-5 border border-white/5 bg-[#12131C] shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex justify-between items-center group cursor-pointer"
                  >
                    {/* Decorative backglow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    
                    {/* Left contents */}
                    <div className="space-y-4 max-w-[58%] relative z-10 flex flex-col justify-between h-full">
                      <div className="space-y-2">
                        {/* Capsule badge */}
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-white tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
                          <span>Spotlight</span>
                          <span className="text-orange animate-pulse">🔥</span>
                        </span>

                        <h3 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-md">
                          Team India Wins <br />The World Cup 🏆🇮🇳
                        </h3>
                      </div>

                      <div className="space-y-3 pt-1">
                        <span className="text-[9.5px] text-gray-text font-bold block uppercase tracking-wider">
                          24.8K people reacted  •  8.7K comments
                        </span>

                        {/* Gradient action button */}
                        <button
                          onClick={() => alert("Welcome to the World Cup Celebration Stadium! 🏏🏆")}
                          className="text-[10px] font-black uppercase tracking-wider text-white px-4.5 py-2.2 rounded-xl bg-[#FF6A00] hover:bg-[#FF8024] hover:shadow-[0_4px_15px_rgba(255,106,0,0.25)] transition-all cursor-pointer shadow-md select-none active:scale-95 flex items-center justify-center w-fit border border-white/10"
                        >
                          Join the Celebration
                        </button>
                      </div>
                    </div>

                    {/* Right side image exactly matching the cricket team celebration backdrop */}
                    <div className="w-[38%] aspect-square rounded-2xl overflow-hidden border border-white/10 relative z-10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1540747737956-37872404f8c1?w=400&h=400&fit=crop"
                        alt="World Cup Celebration"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </motion.div>

                  {/* Posts Cards list loop */}
                  <div className="space-y-6">
                    {filteredPosts.map((post) => (
                      <FeedCard
                        key={post.id}
                        post={post}
                        onLike={(id) => console.log('Liked post:', id)}
                        onCommentClick={(id) => {
                          setSelectedPostId(id);
                          setCurrentView('comments');
                        }}
                      />
                    ))}
                  </div>

                </div>
              )}

              {/* --- VIEW: NOTIFICATIONS (Instagram/Threads/X Style Alerts) --- */}
              {currentView === 'notifications' && (
                <NotificationsPage
                  onBack={() => setCurrentView('home')}
                  onViewChange={setCurrentView}
                  unreadCount={unreadNotificationsCount}
                  setUnreadCount={setUnreadNotificationsCount}
                />
              )}

              {/* --- VIEW: WATCH (TikTok Vertical video swipe) --- */}
              {currentView === 'watch' && (
                <div className="flex items-center justify-center h-full">
                  <TikTokFeed />
                </div>
              )}

              {/* --- VIEW: BATTLES (List of Creator Duels Feed) --- */}
              {currentView === 'battles' && (
                <BattleFeedPage
                  onJoinBattle={(battleId) => {
                    // Redirect to specific battle arena view
                    if (battleId === 'virat_rohit') {
                      setCurrentView('battle_arena');
                    } else {
                      alert(`Entering ${battleId} arena... (Arena is currently being populated by AI active streams!)`);
                    }
                  }}
                  onViewChange={setCurrentView}
                />
              )}

              {/* --- VIEW: BATTLE ARENA (Individual Creator Duel Deck) --- */}
              {currentView === 'battle_arena' && (
                <BattleArenaPage onBack={() => setCurrentView('battles')} />
              )}

              {/* --- VIEW: CHAT (Discord channel system) --- */}
              {currentView === 'chat' && (
                <div className="h-full">
                  <DiscordChat serverId={activeServerId} />
                </div>
              )}

              {/* --- VIEW: PROFILE (Sleek User Dashboard Hub) --- */}
              {currentView === 'profile' && (
                <ProfilePage
                  onBack={() => setCurrentView('home')}
                  onPostClick={(postId) => {
                    setSelectedPostId(postId);
                    setCurrentView('comments');
                  }}
                  onLogout={() => setIsLoggedIn(false)}
                />
              )}

              {/* --- VIEW: COMMENTS (Dedicated Post Detail & Premium Comments Page) --- */}
              {currentView === 'comments' && (
                <PostDetailPage
                  post={posts.find((p) => p.id === selectedPostId) || posts[0]}
                  onBack={() => setCurrentView('home')}
                  currentUser={currentUser}
                  onLikePost={(postId) => {
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.id === postId
                          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
                          : p
                      )
                    );
                  }}
                  onUpdateComments={(postId, updatedComments) => {
                    setPosts((prev) =>
                      prev.map((p) => (p.id === postId ? { ...p, comments: updatedComments } : p))
                    );
                  }}
                />
              )}

              {/* --- VIEW: CREATE_POST (Dedicated Create Post Page) --- */}
              {currentView === 'create_post' && (
                <CreatePostPage
                  onBack={() => setCurrentView('home')}
                  onSubmit={handleCreatePost}
                />
              )}

            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* 4. Global persistent mobile Bottom Navigation menu */}
      <BottomNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onCreatePostClick={() => setCurrentView('create_post')}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* 5. Modals & Overlays */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreatePostModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreatePost}
          />
        )}
      </AnimatePresence>

      {/* Immersive story viewers modal popup overlay */}
      <AnimatePresence>
        {activeStoryIndex !== null && (
          <StoryViewer
            stories={mockStories}
            initialIndex={activeStoryIndex}
            onClose={() => setActiveStoryIndex(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
