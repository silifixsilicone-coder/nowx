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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Left columns (Stories + Posts list) */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Story Tray (Horizontal Scroll Card List) */}
                    <div className="glass-effect rounded-2xl p-4 flex gap-4 overflow-x-auto no-scrollbar items-center border border-white/5 bg-white/[0.01]">
                      
                      {/* Self post quick composer shortcut */}
                      <div
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex flex-col items-center gap-1.5 cursor-pointer select-none flex-shrink-0"
                      >
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-purple/40 bg-purple/5 hover:bg-purple/10 hover:border-purple transition-all">
                          <Plus className="h-6 w-6 text-purple" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-text">Add Story</span>
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

                    {/* Main Feed Tab Filters (Reddit style feed choices - Scrollable on mobile!) */}
                    <div className="flex gap-4 border-b border-white/5 pb-2 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
                      {[
                        { id: 'forYou', label: 'For You', icon: '⚡' },
                        { id: 'trending', label: 'Trending', icon: '📈' },
                        { id: 'roast', label: 'Roast 🔥', icon: '' },
                        { id: 'hype', label: 'Hype ❤️', icon: '' },
                        { id: 'cricket', label: 'Cricket 🏏', icon: '' },
                        { id: 'movies', label: 'Movies 🎬', icon: '' },
                        { id: 'battles_tab', label: 'Battles ⚔️', icon: '' },
                      ].map((tab) => {
                        const isActive = activeHomeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveHomeTab(tab.id);
                              // Auto redirect to Battles view if Battles tab selected!
                              if (tab.id === 'battles_tab') {
                                setCurrentView('battles');
                              }
                            }}
                            className={`text-xs sm:text-sm font-extrabold tracking-wide relative pb-2 flex-shrink-0 cursor-pointer focus:outline-none transition-colors ${
                              isActive ? 'text-white' : 'text-gray-text hover:text-white'
                            }`}
                          >
                            <span>{tab.icon} {tab.label}</span>
                            {isActive && (
                              <motion.div
                                layoutId="activeFeedTabLine"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple to-pink"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Breaking Spotlight Banner (Team India wins the World Cup!) */}
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative rounded-2xl overflow-hidden p-4 bg-gradient-to-r from-[#FF9933]/15 via-white/5 to-[#138808]/15 border border-white/10 shadow-[0_0_20px_rgba(255,138,0,0.12)] flex items-center justify-between group cursor-pointer"
                    >
                      {/* Interactive backglow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                      
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl animate-bounce">🏆</span>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-black uppercase text-[#FF9933] tracking-widest">BREAKING SPOTLIGHT</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                          </div>
                          <span className="text-xs sm:text-sm font-black text-white block">
                            Team India Wins The World Cup 🏆
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveHomeTab('hype')}
                        className="text-[9px] font-black uppercase text-pink border border-pink/35 px-2.5 sm:px-3 py-1.5 rounded-xl bg-pink/5 hover:bg-pink transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer active:scale-95"
                      >
                        <span>HYPE ❤️</span>
                        <span className="text-white">8.4k</span>
                      </button>
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

                  {/* Right Column Widget section (Desktop only) */}
                  <div className="hidden lg:block space-y-6">
                    
                    {/* User Mini card points widget */}
                    <div className="glass-effect-card rounded-2xl p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentUser.avatar}
                          alt="Alex"
                          className="h-10 w-10 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-black text-white">{currentUser.displayName}</span>
                            <span className="text-[10px] text-purple">⚡</span>
                          </div>
                          <span className="text-[10px] text-gray-text">@{currentUser.username}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-3">
                        <div className="bg-white/5 rounded-xl p-2.5 text-center">
                          <span className="text-[9px] font-bold text-gray-text uppercase block">React-Points</span>
                          <span className="text-sm font-black text-gradient">15.4k</span>
                        </div>
                        <div className="bg-white/5 rounded-xl p-2.5 text-center">
                          <span className="text-[9px] font-bold text-gray-text uppercase block">Contributors</span>
                          <span className="text-sm font-black text-orange">Top 2%</span>
                        </div>
                      </div>
                    </div>

                    {/* Suggested communities list */}
                    <div className="glass-effect rounded-2xl p-4 space-y-3 border border-white/5 bg-white/[0.01]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-text/75">
                        Trending Spaces
                      </p>
                      
                      <div className="space-y-3">
                        {[
                          { name: 'r/nextjs', count: '14.2k active', icon: '⚛️' },
                          { name: 'r/tailwind', count: '8.4k active', icon: '🎨' },
                          { name: 'r/digitalart', count: '11.5k active', icon: '🌌' },
                        ].map((item) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.icon}</span>
                              <div>
                                <span className="text-xs font-extrabold text-white block hover:underline cursor-pointer">
                                  {item.name}
                                </span>
                                <span className="text-[9px] text-gray-text block">{item.count}</span>
                              </div>
                            </div>
                            <button className="text-[9px] font-bold text-purple bg-purple/10 px-2.5 py-1 rounded-lg border border-purple/20 hover:bg-purple/20 transition-all cursor-pointer">
                              Join
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Suggested friends list to follow */}
                    <div className="glass-effect rounded-2xl p-4 space-y-3 border border-white/5 bg-white/[0.01]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-text/75">
                        Spaces Innovators
                      </p>

                      <div className="space-y-3">
                        {mockUsers.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.avatar}
                                alt={item.displayName}
                                className="h-7 w-7 rounded-lg object-cover"
                              />
                              <div>
                                <span className="text-xs font-bold text-white block truncate max-w-[100px]">
                                  {item.displayName}
                                </span>
                                <span className="text-[9px] text-gray-text block">@{item.username}</span>
                              </div>
                            </div>
                            <button className="text-[9px] font-bold text-pink bg-pink/10 px-2.5 py-1 rounded-lg border border-pink/20 hover:bg-pink/20 transition-all cursor-pointer">
                              Follow
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* --- VIEW: EXPLORE (Visual Search Collage Grid) --- */}
              {currentView === 'explore' && (
                <div className="space-y-6">
                  {/* Category tabs */}
                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1.5 border-b border-white/5">
                    {['all', 'cyberpunk', 'dev', 'creative'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setExploreCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          exploreCategory === cat
                            ? 'bg-purple text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-purple'
                            : 'bg-white/5 border border-white/5 text-gray-text hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Collage grid visual posts */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-[160px] sm:auto-rows-[200px]">
                    {[
                      { id: 1, title: 'Digital Utopia', likes: '1.4k', comments: 84, creator: 'neon_rider', category: 'cyberpunk', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop' },
                      { id: 2, title: 'Framer Neo Interface', likes: '980', comments: 42, creator: 'framer_wizard', category: 'dev', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=500&fit=crop' },
                      { id: 3, title: 'Abstract Dreams', likes: '2.1k', comments: 120, creator: 'tailwind_queen', category: 'creative', url: 'https://images.unsplash.com/photo-1547891654-e66ed7edd96c?w=500&h=500&fit=crop' },
                      { id: 4, title: 'Matrix Rain Streams', likes: '3.2k', comments: 245, creator: 'rust_ace', category: 'dev', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=500&fit=crop' },
                      { id: 5, title: 'Neon Core Shader v4', likes: '1.1k', comments: 56, creator: 'neon_rider', category: 'cyberpunk', url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=500&h=500&fit=crop' },
                      { id: 6, title: 'Geometrical Synth', likes: '850', comments: 31, creator: 'tailwind_queen', category: 'creative', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&h=500&fit=crop' },
                      { id: 7, title: 'Retro Coding Board', likes: '1.5k', comments: 92, creator: 'rust_ace', category: 'dev', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=500&fit=crop' },
                      { id: 8, title: 'Cybernetic Portraiture', likes: '2.7k', comments: 182, creator: 'neon_rider', category: 'cyberpunk', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&h=500&fit=crop' },
                      { id: 9, title: 'Volumetric Lights Engine', likes: '1.8k', comments: 74, creator: 'framer_wizard', category: 'creative', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&h=500&fit=crop' },
                    ]
                      .filter(item => exploreCategory === 'all' || item.category === exploreCategory)
                      .map((item, idx) => {
                        // Alternate large columns for Instagram explore style collage
                        const isLarge = idx % 5 === 0;
                        return (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            className={`relative rounded-2xl overflow-hidden group cursor-pointer border border-white/5 shadow-md bg-white/5 ${
                              isLarge ? 'col-span-2 row-span-2' : ''
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                            {/* Overlay details */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-end">
                              <span className="text-[10px] font-black uppercase text-pink tracking-widest block mb-0.5">@{item.creator}</span>
                              <span className="text-xs font-black text-white block mb-2">{item.title}</span>
                              <div className="flex gap-3 text-[10px] font-bold text-gray-text">
                                <span>❤️ {item.likes}</span>
                                <span>💬 {item.comments}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
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

              {/* --- VIEW: COMMENTS (Reddit-Inspired Comments Page) --- */}
              {currentView === 'comments' && (() => {
                const activePost = posts.find((p) => p.id === selectedPostId) || posts[0];
                
                // Sort comments in memory based on sort tab state
                const sortedComments = [...(activePost?.comments || [])].sort((a, b) => {
                  if (commentsSort === 'new') return 1; // Simulated ordering
                  if (commentsSort === 'controversial') return Math.random() - 0.5;
                  return b.likes - a.likes; // Default: Top Sort
                });

                // Deep update helper to append newComment recursively under parentId
                const handleAddNestedComment = (parentId: string) => {
                  if (!replyText.trim()) return;

                  const newComment = {
                    id: `rc_${Date.now()}`,
                    user: {
                      id: currentUser.id,
                      username: currentUser.username,
                      displayName: currentUser.displayName,
                      avatar: currentUser.avatar,
                      isVerified: currentUser.isVerified,
                    },
                    content: replyText,
                    timestamp: 'Just now',
                    likes: 1,
                  };

                  const addCommentRecursively = (commentsList: any[]): any[] => {
                    return commentsList.map((comm) => {
                      if (comm.id === parentId) {
                        return {
                          ...comm,
                          replies: [newComment, ...(comm.replies || [])],
                        };
                      }
                      if (comm.replies && comm.replies.length > 0) {
                        return {
                          ...comm,
                          replies: addCommentRecursively(comm.replies),
                        };
                      }
                      return comm;
                    });
                  };

                  setPosts((prevPosts) =>
                    prevPosts.map((post) => {
                      if (post.id === selectedPostId) {
                        return {
                          ...post,
                          comments: addCommentRecursively(post.comments),
                        };
                      }
                      return post;
                    })
                  );

                  setReplyText('');
                  setActiveReplyId(null);
                };

                // Root comment publisher from bottom bar
                const handleAddRootCommentSubmit = (e: React.FormEvent) => {
                  e.preventDefault();
                  if (!replyText.trim()) return;

                  const newComment = {
                    id: `rc_root_${Date.now()}`,
                    user: {
                      id: currentUser.id,
                      username: currentUser.username,
                      displayName: currentUser.displayName,
                      avatar: currentUser.avatar,
                      isVerified: currentUser.isVerified,
                    },
                    content: replyText,
                    timestamp: 'Just now',
                    likes: 1,
                  };

                  setPosts((prevPosts) =>
                    prevPosts.map((post) => {
                      if (post.id === selectedPostId) {
                        return {
                          ...post,
                          comments: [newComment, ...post.comments],
                        };
                      }
                      return post;
                    })
                  );

                  setReplyText('');
                };

                // Inline comment reaction counts updater
                const handleCommentReaction = (commentId: string, emojiType: string) => {
                  const updateReactionsRecursively = (commentsList: any[]): any[] => {
                    return commentsList.map((comm) => {
                      if (comm.id === commentId) {
                        return {
                          ...comm,
                          likes: comm.likes + 1, // Simulates active like increase
                        };
                      }
                      if (comm.replies && comm.replies.length > 0) {
                        return {
                          ...comm,
                          replies: updateReactionsRecursively(comm.replies),
                        };
                      }
                      return comm;
                    });
                  };

                  setPosts((prevPosts) =>
                    prevPosts.map((post) => {
                      if (post.id === selectedPostId) {
                        return {
                          ...post,
                          comments: updateReactionsRecursively(post.comments),
                        };
                      }
                      return post;
                    })
                  );
                };

                // Recursive render comments list
                const renderCommentsList = (commentsList: any[], depth = 0): React.ReactNode => {
                  return commentsList.map((comm, idx) => {
                    const isTopHighlighted = depth === 0 && idx === 0 && commentsSort === 'top';
                    const hasReplies = comm.replies && comm.replies.length > 0;
                    
                    return (
                      <div key={comm.id} className="flex flex-col space-y-2 mt-3 select-none">
                        
                        {/* Highlights top comments inside glowing gradients */}
                        {isTopHighlighted ? (
                          <div
                            className="relative p-[1.5px] rounded-2xl bg-gradient-to-r from-purple/40 to-pink/40 shadow-[0_0_15px_rgba(124,58,237,0.15)] mb-3"
                            style={{ boxShadow: "0 0 15px rgba(124, 58, 237, 0.08)" }}
                          >
                            <div className="bg-[#12131C] p-4 rounded-[15px] relative overflow-hidden">
                              <div className="absolute top-0 right-0 h-12 w-12 bg-purple/10 rounded-full blur-md" />
                              
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-pink flex items-center gap-1">
                                  <span>🔥 Top Highlighted Roast</span>
                                </span>
                                <span className="text-[8px] text-gray-text font-bold">💬 {comm.timestamp}</span>
                              </div>

                              <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={comm.user.avatar} alt="avatar" className="h-full w-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="text-xs font-black text-white">@{comm.user.username}</span>
                                    {comm.user.isVerified && <span className="text-[8px] text-purple">⚡</span>}
                                  </div>
                                  {/* Visually outstanding bold text size */}
                                  <p className="text-sm sm:text-base font-extrabold text-white leading-relaxed tracking-wide italic">
                                    "{comm.content}"
                                  </p>

                                  {/* Highlighted comment actions */}
                                  <div className="flex items-center gap-4 mt-3 border-t border-white/5 pt-2 flex-wrap">
                                    {/* Reactions */}
                                    <div className="flex items-center gap-1">
                                      {['🔥', '😂', '❤️', '💀'].map((emoji) => (
                                        <motion.button
                                          key={emoji}
                                          whileTap={{ scale: 0.8 }}
                                          onClick={() => handleCommentReaction(comm.id, emoji)}
                                          className="text-xs px-2 py-0.8 rounded-lg bg-white/5 border border-white/5 text-gray-text hover:text-white transition-colors cursor-pointer"
                                        >
                                          {emoji}
                                        </motion.button>
                                      ))}
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-text">❤️ {comm.likes} likes</span>
                                    <button
                                      onClick={() => setActiveReplyId(comm.id)}
                                      className="text-[9px] font-black uppercase text-purple hover:underline cursor-pointer flex items-center gap-1"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Standard Comment Visual Layout */
                          <div className="flex gap-3">
                            <div className="h-7 w-7 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={comm.user.avatar} alt="avatar" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl px-3.5 py-2.5 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span className="text-xs font-bold text-white hover:underline cursor-pointer">
                                  {comm.user.displayName}
                                </span>
                                {comm.user.isVerified && <span className="text-[9px] text-purple">⚡</span>}
                                <span className="text-[9px] text-gray-text">@{comm.user.username} • {comm.timestamp}</span>
                              </div>
                              <p className="text-xs text-white/95 leading-normal break-words font-medium">
                                {comm.content}
                              </p>
                              
                              {/* Standard Comment Actions */}
                              <div className="flex items-center gap-4 mt-2.5 border-t border-white/5 pt-2 flex-wrap">
                                <div className="flex items-center gap-1">
                                  {['🔥', '😂', '💀'].map((emoji) => (
                                    <motion.button
                                      key={emoji}
                                      whileTap={{ scale: 0.8 }}
                                      onClick={() => handleCommentReaction(comm.id, emoji)}
                                      className="text-[10px] p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                      {emoji}
                                    </motion.button>
                                  ))}
                                </div>
                                <span className="text-[9px] text-gray-text font-bold">❤️ {comm.likes}</span>
                                <button
                                  onClick={() => setActiveReplyId(comm.id)}
                                  className="text-[9px] font-black uppercase text-purple hover:underline cursor-pointer"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Inline Nested Reply Composer Form */}
                        {activeReplyId === comm.id && (
                          <div className="pl-6 ml-3.5 mt-2 flex gap-3">
                            <input
                              type="text"
                              placeholder="Write a nested reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1 bg-white/5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50"
                            />
                            <button
                              onClick={() => handleAddNestedComment(comm.id)}
                              className="px-3 py-1.5 rounded-xl bg-purple hover:bg-opacity-95 text-white text-[10px] font-extrabold cursor-pointer"
                            >
                              Send
                            </button>
                            <button
                              onClick={() => {
                                setActiveReplyId(null);
                                setReplyText('');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-text text-[10px] font-extrabold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {/* Recursively displays nested sub-replies with vertical thread connector lines */}
                        {hasReplies && (
                          <div className="pl-4 border-l border-white/10 space-y-4 mt-2 ml-3.5">
                            {renderCommentsList(comm.replies, depth + 1)}
                          </div>
                        )}

                      </div>
                    );
                  });
                };

                return (
                  <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-6 relative select-none">
                    
                    {/* Top back navigation header bar */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <button
                        onClick={() => setCurrentView('home')}
                        className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple hover:text-white border border-purple/35 hover:bg-purple/10 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md bg-purple/5"
                      >
                        ← Back to Space Feed
                      </button>
                      <span className="text-[10px] font-black uppercase text-gray-text tracking-widest">
                        Reddit Comment Space
                      </span>
                    </div>

                    {/* Minimized display of the Active Post */}
                    <div className="opacity-80 scale-98 pointer-events-none origin-top">
                      <FeedCard post={activePost} />
                    </div>

                    {/* Sort tabs selections (Top, New, Controversial) */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <span className="text-xs font-black text-white">Sort Roast Thread:</span>
                      <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/5 flex-shrink-0">
                        {[
                          { id: 'top', label: 'Top' },
                          { id: 'new', label: 'New' },
                          { id: 'controversial', label: 'Controversial' },
                        ].map((tab) => {
                          const isActive = commentsSort === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setCommentsSort(tab.id as any)}
                              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all focus:outline-none cursor-pointer ${
                                isActive ? 'bg-purple text-white shadow-md' : 'text-gray-text hover:text-white'
                              }`}
                            >
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* List of comments rendering */}
                    <div className="space-y-4">
                      {sortedComments.length > 0 ? (
                        renderCommentsList(sortedComments)
                      ) : (
                        <p className="text-center text-xs text-gray-text py-10">No comments yet on this space post.</p>
                      )}
                    </div>

                    {/* Fixed Bottom Input Composer (Mobile: fixed bottom / Desktop: relative static) */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#0B0B12]/95 backdrop-blur-xl z-40 md:relative md:bg-transparent md:border-0 md:p-0 md:mt-8">
                      <form onSubmit={handleAddRootCommentSubmit} className="max-w-2xl mx-auto flex gap-3">
                        <input
                          type="text"
                          placeholder="Publish a root space roast..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20 transition-all shadow-inner"
                        />
                        <button
                          type="submit"
                          className="px-6 py-3 rounded-2xl bg-purple hover:bg-opacity-95 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center flex-shrink-0 cursor-pointer shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                        >
                          Roast
                        </button>
                      </form>
                    </div>

                  </div>
                );
              })()}

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
