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
              
              {/* --- VIEW: HOME FEED (Instagram/Reels layout) --- */}
              {currentView === 'home' && (
                <div className="w-full max-w-[420px] mx-auto h-[calc(100vh-6.5rem)] border border-white/10 rounded-[36px] overflow-hidden bg-[#0A0A0A] relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(255,106,0,0.05)] flex flex-col justify-between group">
                  
                  {/* Cinematic Top Header Overlay */}
                  <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none select-none">
                    <span className="text-sm font-black text-[#FF6A00] tracking-wider pointer-events-auto">
                      ReactVerse
                    </span>
                    <div className="flex items-center gap-4 pointer-events-auto text-xs font-black">
                      <button className="text-gray-text hover:text-white transition-colors cursor-pointer">Following</button>
                      <button className="text-white relative pb-1 cursor-pointer">
                        For You
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FF6A00] rounded-full" />
                      </button>
                    </div>
                    <button className="text-white hover:text-[#FF6A00] transition-colors pointer-events-auto cursor-pointer">
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Scrollable Snap reels list */}
                  <div className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth">
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
