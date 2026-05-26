'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Video,
  Smile,
  Globe,
  Plus,
  Zap,
  Flame,
  BrainCircuit,
  EyeOff,
  Lock,
  Swords,
  Trash2,
  Upload,
  Clock,
  ScrollText,
  Play,
  VolumeX,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { Post, currentUser } from '@/data/mockData';

interface CreatePostPageProps {
  onBack: () => void;
  onSubmit: (post: Post) => void;
}

export const CreatePostPage: React.FC<CreatePostPageProps> = ({ onBack, onSubmit }) => {
  // Tab control: 'post' | 'battle'
  const [activeTab, setActiveTab] = useState<'post' | 'battle'>('post');

  // ==========================================
  // STATE 1: CREATE POST STATE
  // ==========================================
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedPostCategory, setSelectedPostCategory] = useState<string>('Roast');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAiSuggest, setIsAiSuggest] = useState(false);
  
  // Media uploads inside post
  const [postMediaFile, setPostMediaFile] = useState<File | null>(null);
  const [postMediaUrl, setPostMediaUrl] = useState<string | null>(null);
  const [postMediaType, setPostMediaType] = useState<'image' | 'video' | 'gif' | null>(null);
  const [postDragActive, setPostDragActive] = useState(false);

  // GIF Selection Sub-feature
  const [showGifLibrary, setShowGifLibrary] = useState(false);
  const [selectedGifUrl, setSelectedGifUrl] = useState<string | null>(null);

  const postFileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // STATE 2: CREATE BATTLE STATE
  // ==========================================
  const [battleTitle, setBattleTitle] = useState('');
  const [battleCategory, setBattleCategory] = useState('Cricket');
  const [battleDuration, setBattleDuration] = useState('24 Hours');
  const [battleRules, setBattleRules] = useState('');
  
  // Participant 1
  const [p1Name, setP1Name] = useState('');
  const [p1File, setP1File] = useState<File | null>(null);
  const [p1Url, setP1Url] = useState<string | null>(null);
  const p1InputRef = useRef<HTMLInputElement>(null);

  // Participant 2
  const [p2Name, setP2Name] = useState('');
  const [p2File, setP2File] = useState<File | null>(null);
  const [p2Url, setP2Url] = useState<string | null>(null);
  const p2InputRef = useRef<HTMLInputElement>(null);

  // Optional cover/video
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [introVideoFile, setIntroVideoFile] = useState<File | null>(null);
  const [introVideoUrl, setIntroVideoUrl] = useState<string | null>(null);
  const introVideoInputRef = useRef<HTMLInputElement>(null);

  // Drag states for Battle
  const [battleDragActive, setBattleDragActive] = useState<Record<string, boolean>>({
    p1: false,
    p2: false,
    cover: false,
    intro: false
  });

  // Success Banner
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // ==========================================
  // UTILITIES & AI GENERATOR
  // ==========================================
  const handleGenerateAiPrompt = () => {
    let aiPrompt = '';
    if (selectedPostCategory === 'Roast') {
      aiPrompt = "Australia airplane mode me hai 😂✈️ #CricketRoast";
    } else if (selectedPostCategory === 'Hype') {
      aiPrompt = "Virat Kohli hits 50th century! Absolute king behavior! 👑🔥";
    } else if (selectedPostCategory === 'Meme') {
      aiPrompt = "Next.js dev server hot reload takes 0.1s but npm install takes 5 years 💀";
    } else {
      aiPrompt = "Tailwind CSS v4 is a game-changer! Clean `@theme` directives look satisfactory! 🚀";
    }
    setPostContent(aiPrompt);
  };

  // Drag and drop handler
  const handleDrag = (e: React.DragEvent, section: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      if (section === 'post') setPostDragActive(true);
      else {
        setBattleDragActive(prev => ({ ...prev, [section]: true }));
      }
    } else if (e.type === "dragleave") {
      if (section === 'post') setPostDragActive(false);
      else {
        setBattleDragActive(prev => ({ ...prev, [section]: false }));
      }
    }
  };

  const handleFileDrop = (e: React.DragEvent, section: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (section === 'post') setPostDragActive(false);
    else {
      setBattleDragActive(prev => ({ ...prev, [section]: false }));
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file, section);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, section: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file, section);
    }
  };

  const processFile = (file: File, section: string) => {
    const fileUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov');

    if (section === 'post') {
      setPostMediaFile(file);
      setPostMediaUrl(fileUrl);
      setPostMediaType(isVideo ? 'video' : 'image');
      setSelectedGifUrl(null); // Clear gif if user uploads local file
    } else if (section === 'p1') {
      setP1File(file);
      setP1Url(fileUrl);
    } else if (section === 'p2') {
      setP2File(file);
      setP2Url(fileUrl);
    } else if (section === 'cover') {
      setCoverFile(file);
      setCoverUrl(fileUrl);
    } else if (section === 'intro') {
      setIntroVideoFile(file);
      setIntroVideoUrl(fileUrl);
    }
  };

  const handleRemoveMedia = (section: string) => {
    if (section === 'post') {
      setPostMediaFile(null);
      setPostMediaUrl(null);
      setPostMediaType(null);
      setSelectedGifUrl(null);
    } else if (section === 'p1') {
      setP1File(null);
      setP1Url(null);
    } else if (section === 'p2') {
      setP2File(null);
      setP2Url(null);
    } else if (section === 'cover') {
      setCoverFile(null);
      setCoverUrl(null);
    } else if (section === 'intro') {
      setIntroVideoFile(null);
      setIntroVideoUrl(null);
    }
  };

  const handleSelectGif = (gifUrl: string) => {
    setSelectedGifUrl(gifUrl);
    setPostMediaType('gif');
    setPostMediaFile(null);
    setPostMediaUrl(null);
    setShowGifLibrary(false);
  };

  // Form Submissions
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const mockTags = [selectedPostCategory.toLowerCase()];
    if (isAnonymous) mockTags.push('anon');
    if (postMediaType) mockTags.push(postMediaType);

    const newPost: Post = {
      id: `post_created_${Date.now()}`,
      user: isAnonymous
        ? {
            id: 'anon_user',
            username: 'anonymous',
            displayName: 'Anonymous Agent',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
            followers: 404,
            following: 0,
            reactPoints: 0,
          }
        : currentUser,
      type: postMediaType === 'video' ? 'video' : (postMediaType === 'gif' || selectedGifUrl || postMediaUrl) ? 'image' : 'text',
      title: postTitle ? postTitle : `${selectedPostCategory} Blast`,
      content: postContent,
      mediaUrl: selectedGifUrl || postMediaUrl || undefined,
      likes: 1,
      upvotes: 1,
      downvotes: 0,
      commentsCount: 0,
      comments: [],
      community: `r/${selectedPostCategory.toLowerCase()}`,
      tags: mockTags,
      isLiked: true,
      voteStatus: 'upvoted',
    };

    onSubmit(newPost);
    setSuccessMessage("Your spicy roast has been broadcasted successfully! 🚀");
    setShowSuccessOverlay(true);
    setTimeout(() => {
      setShowSuccessOverlay(false);
      onBack();
    }, 2000);
  };

  const handleSubmitBattle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!battleTitle.trim() || !p1Name.trim() || !p2Name.trim()) {
      alert("Please complete the title, and both participant names!");
      return;
    }

    // Submit custom battle as a visual custom card inside feed
    const battlePost: Post = {
      id: `battle_created_${Date.now()}`,
      user: currentUser,
      type: 'image',
      title: `⚔️ ARENA LIVE: ${battleTitle}`,
      content: `Let the savage voting begin! Rules: ${battleRules || 'No rules. Strike with pure roasts.'} Category: ${battleCategory}. Duel duration: ${battleDuration}.`,
      mediaUrl: coverUrl || p1Url || 'https://images.unsplash.com/photo-1540747737956-37872404457a?w=600',
      likes: 24,
      upvotes: 15,
      downvotes: 0,
      commentsCount: 0,
      comments: [],
      community: `r/arena`,
      tags: ['battle', battleCategory.toLowerCase(), 'live'],
      isLiked: false,
    };

    onSubmit(battlePost);
    setSuccessMessage(`Battle Arena duel launched! ⚔️ ${p1Name} vs ${p2Name} is active now!`);
    setShowSuccessOverlay(true);
    setTimeout(() => {
      setShowSuccessOverlay(false);
      onBack();
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 select-none pb-28 md:pb-8 relative">
      
      {/* SUCCESS OVERLAY NOTIFICATION */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <div className="glass-effect-card p-8 rounded-[32px] text-center max-w-sm space-y-4 border border-purple/35 shadow-[0_0_50px_rgba(124,58,237,0.3)]">
              <div className="h-16 w-16 bg-gradient-to-tr from-purple via-pink to-orange rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,46,147,0.6)]">
                <Sparkles className="h-8 w-8 text-white animate-spin" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">CREATION PUBLISHED</h3>
              <p className="text-xs text-gray-text leading-relaxed font-medium">
                {successMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple hover:text-white border border-purple/35 hover:bg-purple/10 px-3.5 py-1.8 rounded-xl transition-all cursor-pointer shadow-md bg-purple/5"
        >
          ← Back
        </button>
        <span className="text-[9px] font-black uppercase text-gray-text tracking-widest">
          Creator Studio Deck
        </span>
      </div>

      {/* DOUBLE NAVIGATION TABS (CREATE POST / CREATE BATTLE) */}
      <div className="flex p-1.5 rounded-2xl bg-[#12131C] border border-white/5 shadow-inner">
        <button
          onClick={() => setActiveTab('post')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === 'post'
              ? 'bg-gradient-to-r from-purple/20 via-pink/15 to-transparent text-purple border-l-2 border-purple shadow-md'
              : 'text-gray-text hover:text-white'
          }`}
        >
          <Sparkles className={`h-4 w-4 ${activeTab === 'post' ? 'text-purple' : 'text-gray-text'}`} />
          <span>Create Post</span>
        </button>
        
        <button
          onClick={() => setActiveTab('battle')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            activeTab === 'battle'
              ? 'bg-gradient-to-r from-purple/20 via-pink/15 to-transparent text-purple border-l-2 border-purple shadow-md'
              : 'text-gray-text hover:text-white'
          }`}
        >
          <Swords className={`h-4 w-4 ${activeTab === 'battle' ? 'text-purple' : 'text-gray-text'}`} />
          <span>Create Battle</span>
        </button>
      </div>

      {/* DYNAMIC TAB COMPONENT */}
      <div className="glass-effect-card rounded-[28px] p-4 sm:p-6 relative overflow-hidden border border-white/8 shadow-2xl">
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-pink/10 blur-3xl pointer-events-none" />

        {activeTab === 'post' ? (
          // ==============================================================
          // TAB 1: CREATE POST FORM
          // ==============================================================
          <form onSubmit={handleSubmitPost} className="space-y-5 relative z-10">
            
            {/* Optional post title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-text uppercase tracking-widest block">
                Headline Title (Optional)
              </label>
              <input
                type="text"
                placeholder="Give your roast a trending headline..."
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50 transition-colors"
              />
            </div>

            {/* Main Draft Area */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-text uppercase tracking-widest">
                  Caption Content
                </label>
                <span className="text-[9px] font-bold text-gray-text">
                  {postContent.length}/280 chars
                </span>
              </div>
              <textarea
                placeholder={
                  selectedPostCategory === 'Roast'
                    ? 'Drop a spicy roast about tech or cricket today...'
                    : 'Share your trending hype, web designs, or coding benchmarks...'
                }
                value={postContent}
                rows={3}
                maxLength={280}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-gray-text focus:outline-none focus:border-purple/50 transition-all font-sans leading-relaxed resize-none custom-scrollbar"
              />
            </div>

            {/* Dashed Drag and Drop Media upload box */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-text uppercase tracking-widest block">
                Attach Media visual
              </label>
              
              <input
                type="file"
                ref={postFileInputRef}
                onChange={(e) => handleFileChange(e, 'post')}
                accept="image/png, image/jpeg, image/webp, video/mp4, video/quicktime"
                className="hidden"
              />

              {!postMediaUrl && !selectedGifUrl ? (
                <div
                  onDragEnter={(e) => handleDrag(e, 'post')}
                  onDragOver={(e) => handleDrag(e, 'post')}
                  onDragLeave={(e) => handleDrag(e, 'post')}
                  onDrop={(e) => handleFileDrop(e, 'post')}
                  onClick={() => postFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 relative bg-white/[0.01] ${
                    postDragActive
                      ? 'border-purple bg-purple/10 shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                      : 'border-white/10 hover:border-purple/45 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-purple/10 flex items-center justify-center text-purple shadow-inner">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Drag & Drop visual here</p>
                    <p className="text-[9px] text-gray-text mt-0.5 font-bold uppercase tracking-wider">
                      Supports JPG, PNG, WEBP, MP4, MOV (Max 15MB)
                    </p>
                  </div>
                  
                  {/* Floating Add GIF Trigger inside */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGifLibrary(!showGifLibrary);
                    }}
                    className="mt-1 flex items-center gap-1 text-[9px] font-black uppercase text-pink bg-pink/10 border border-pink/35 px-3 py-1 rounded-full hover:bg-pink/25 transition-all select-none"
                  >
                    <Smile className="h-3 w-3" />
                    <span>Select Trending GIF</span>
                  </button>
                </div>
              ) : (
                // Stateful Media Previews
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-1 group">
                  {/* Remove media trigger */}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia('post')}
                    className="absolute top-3 right-3 z-30 p-1.5 rounded-xl bg-red-600 border border-red-500 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md select-none"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {postMediaType === 'video' && postMediaUrl && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                      <video
                        src={postMediaUrl}
                        controls
                        muted
                        autoPlay
                        loop
                        className="max-h-[220px] w-full object-contain"
                      />
                    </div>
                  )}

                  {(postMediaType === 'image' || postMediaType === 'gif') && (postMediaUrl || selectedGifUrl) && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedGifUrl || postMediaUrl || ''}
                        alt="Upload Preview"
                        className="max-h-[220px] w-full object-contain"
                      />
                    </div>
                  )}

                  <div className="px-3 py-2 flex items-center justify-between bg-white/5 border-t border-white/5 mt-1 rounded-lg">
                    <span className="text-[8px] font-black uppercase tracking-wider text-gray-text">
                      Uploaded File Preview
                    </span>
                    <span className="text-[9px] text-pink font-extrabold uppercase">
                      {postMediaType === 'video' ? 'MP4 Video' : postMediaType === 'gif' ? 'GIPHY' : 'Visual Image'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Mock GIFs selection list drawer */}
            <AnimatePresence>
              {showGifLibrary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-3 bg-[#12131C] rounded-2xl border border-white/5 space-y-2.5 overflow-hidden"
                >
                  <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                    <span className="text-[9px] font-black text-pink uppercase flex items-center gap-1">
                      <Smile className="h-3.5 w-3.5 text-pink" />
                      <span>Trending Roast GIFs</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGifLibrary(false)}
                      className="text-gray-text hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'https://media.giphy.com/media/l3q2zVR6cu95nF6O4/giphy.gif',
                      'https://media.giphy.com/media/26n61r3hyE6JyTxyE/giphy.gif',
                      'https://media.giphy.com/media/89asT84PzD5c3zczWy/giphy.gif',
                    ].map((gifSrc, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectGif(gifSrc)}
                        className="aspect-video rounded-lg overflow-hidden border border-white/5 hover:border-purple hover:scale-[1.01] transition-all cursor-pointer bg-black/40"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={gifSrc} alt="roast gif" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Categories tag pills selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-text uppercase tracking-widest block">
                Choose Roast Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Roast', 'Hype', 'Meme', 'Cricket', 'Movies', 'Gaming', 'Other'].map((cat) => {
                  const isActive = selectedPostCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedPostCategory(cat)}
                      className={`px-3 py-1.8 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none border ${
                        isActive
                          ? 'bg-purple border-purple text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                          : 'bg-white/5 border-white/5 text-gray-text hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configuration switches */}
            <div className="space-y-3.5 border-t border-white/5 pt-4">
              
              {/* Toggle 1: Anonymous */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-purple/10 flex items-center justify-center text-purple flex-shrink-0">
                    <EyeOff className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-white block">Anonymous Mode</span>
                    <span className="text-[8.5px] text-gray-text block truncate">Mask your username and avatar on Feed.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 cursor-pointer flex-shrink-0 relative ${
                    isAnonymous ? 'bg-purple' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    layout
                    className="h-4 w-4 bg-white rounded-full shadow-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{ float: isAnonymous ? 'right' : 'left' }}
                  />
                </button>
              </div>

              {/* Toggle 2: AI Suggestions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-pink/10 flex items-center justify-center text-pink flex-shrink-0">
                    <BrainCircuit className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-white block">AI roast Suggestions</span>
                    <span className="text-[8.5px] text-gray-text block truncate">Auto-generate creative drafts from category.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAiSuggest(!isAiSuggest);
                    if (!isAiSuggest) {
                      handleGenerateAiPrompt();
                    }
                  }}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 cursor-pointer flex-shrink-0 relative ${
                    isAiSuggest ? 'bg-pink' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    layout
                    className="h-4 w-4 bg-white rounded-full shadow-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{ float: isAiSuggest ? 'right' : 'left' }}
                  />
                </button>
              </div>

            </div>

            {/* STICKY BOTTOM SUBMIT ACTIONS (Purple-Pink-Orange Gradient) */}
            <div className="fixed bottom-0 inset-x-0 md:relative md:bottom-auto p-4 md:p-0 bg-background/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-white/5 md:border-t-0 z-40">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple via-pink to-orange text-white text-xs font-black uppercase tracking-widest border border-white/10 shadow-[0_0_20px_rgba(255,46,147,0.4)] hover:shadow-[0_0_30px_rgba(255,138,0,0.5)] cursor-pointer transition-all flex items-center justify-center gap-1.5 select-none"
              >
                <Globe className="h-4 w-4" />
                <span>Post Now 🚀</span>
              </motion.button>
            </div>

          </form>
        ) : (
          // ==============================================================
          // TAB 2: CREATE BATTLE FORM
          // ==============================================================
          <form onSubmit={handleSubmitBattle} className="space-y-5 relative z-10">
            
            {/* Title field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-text uppercase tracking-widest block">
                Battle Title
              </label>
              <input
                type="text"
                placeholder="e.g. King Virat Kohli vs Hitman Rohit Sharma"
                value={battleTitle}
                onChange={(e) => setBattleTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50 transition-colors"
                required
              />
            </div>

            {/* Dual columns for Participant 1 and Participant 2 */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Participant 1 Deck */}
              <div className="space-y-2 p-3 rounded-2xl border border-white/5 bg-white/[0.01]">
                <label className="text-[9px] font-black text-purple uppercase tracking-wider block">
                  Participant 1 Setup
                </label>
                <input
                  type="text"
                  placeholder="Player 1 Name"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.8 text-[11px] text-white placeholder-gray-text focus:outline-none focus:border-purple/50"
                  required
                />
                
                <input
                  type="file"
                  ref={p1InputRef}
                  onChange={(e) => handleFileChange(e, 'p1')}
                  accept="image/*"
                  className="hidden"
                />

                {!p1Url ? (
                  <div
                    onDragEnter={(e) => handleDrag(e, 'p1')}
                    onDragOver={(e) => handleDrag(e, 'p1')}
                    onDragLeave={(e) => handleDrag(e, 'p1')}
                    onDrop={(e) => handleFileDrop(e, 'p1')}
                    onClick={() => p1InputRef.current?.click()}
                    className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
                      battleDragActive.p1 ? 'border-purple bg-purple/10' : 'border-white/10 hover:border-purple/35'
                    }`}
                  >
                    <Upload className="h-4.5 w-4.5 text-gray-text mx-auto mb-1" />
                    <span className="text-[8px] font-black uppercase text-gray-text">Add Avatar Image</span>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/10 group">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia('p1')}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600 text-white z-20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p1Url} alt="P1 Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Participant 2 Deck */}
              <div className="space-y-2 p-3 rounded-2xl border border-white/5 bg-white/[0.01]">
                <label className="text-[9px] font-black text-pink uppercase tracking-wider block">
                  Participant 2 Setup
                </label>
                <input
                  type="text"
                  placeholder="Player 2 Name"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.8 text-[11px] text-white placeholder-gray-text focus:outline-none focus:border-purple/50"
                  required
                />

                <input
                  type="file"
                  ref={p2InputRef}
                  onChange={(e) => handleFileChange(e, 'p2')}
                  accept="image/*"
                  className="hidden"
                />

                {!p2Url ? (
                  <div
                    onDragEnter={(e) => handleDrag(e, 'p2')}
                    onDragOver={(e) => handleDrag(e, 'p2')}
                    onDragLeave={(e) => handleDrag(e, 'p2')}
                    onDrop={(e) => handleFileDrop(e, 'p2')}
                    onClick={() => p2InputRef.current?.click()}
                    className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
                      battleDragActive.p2 ? 'border-pink bg-pink/10' : 'border-white/10 hover:border-pink/35'
                    }`}
                  >
                    <Upload className="h-4.5 w-4.5 text-gray-text mx-auto mb-1" />
                    <span className="text-[8px] font-black uppercase text-gray-text">Add Avatar Image</span>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/10 group">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia('p2')}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600 text-white z-20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p2Url} alt="P2 Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

            </div>

            {/* Battle category & duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-text uppercase tracking-widest block">
                  Category
                </label>
                <select
                  value={battleCategory}
                  onChange={(e) => setBattleCategory(e.target.value)}
                  className="w-full bg-[#12131C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple/50"
                >
                  {['Cricket', 'Movies', 'Meme', 'Gaming', 'Fan Wars', 'Roast', 'AI', 'Other'].map((opt) => (
                    <option key={opt} value={opt} className="bg-[#12131C]">{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-text uppercase tracking-widest block">
                  Duration
                </label>
                <select
                  value={battleDuration}
                  onChange={(e) => setBattleDuration(e.target.value)}
                  className="w-full bg-[#12131C] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple/50"
                >
                  {['6 Hours', '12 Hours', '24 Hours', '3 Days', '7 Days'].map((opt) => (
                    <option key={opt} value={opt} className="bg-[#12131C]">{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Cover & Intro video uploads */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Optional Cover image */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-text uppercase tracking-widest block">
                  Battle Cover Image (Optional)
                </label>
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={(e) => handleFileChange(e, 'cover')}
                  accept="image/*"
                  className="hidden"
                />

                {!coverUrl ? (
                  <div
                    onDragEnter={(e) => handleDrag(e, 'cover')}
                    onDragOver={(e) => handleDrag(e, 'cover')}
                    onDragLeave={(e) => handleDrag(e, 'cover')}
                    onDrop={(e) => handleFileDrop(e, 'cover')}
                    onClick={() => coverInputRef.current?.click()}
                    className={`border border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-colors ${
                      battleDragActive.cover ? 'border-purple bg-purple/10' : 'border-white/10 hover:border-purple/35'
                    }`}
                  >
                    <ImageIcon className="h-4.5 w-4.5 text-gray-text mx-auto mb-1" />
                    <span className="text-[8px] font-black uppercase text-gray-text block">Upload Cover image</span>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/10 group">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia('cover')}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600 text-white z-20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Optional Intro Video */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-text uppercase tracking-widest block">
                  Battle Intro Video (Optional)
                </label>
                <input
                  type="file"
                  ref={introVideoInputRef}
                  onChange={(e) => handleFileChange(e, 'intro')}
                  accept="video/*"
                  className="hidden"
                />

                {!introVideoUrl ? (
                  <div
                    onDragEnter={(e) => handleDrag(e, 'intro')}
                    onDragOver={(e) => handleDrag(e, 'intro')}
                    onDragLeave={(e) => handleDrag(e, 'intro')}
                    onDrop={(e) => handleFileDrop(e, 'intro')}
                    onClick={() => introVideoInputRef.current?.click()}
                    className={`border border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-colors ${
                      battleDragActive.intro ? 'border-purple bg-purple/10' : 'border-white/10 hover:border-purple/35'
                    }`}
                  >
                    <Video className="h-4.5 w-4.5 text-gray-text mx-auto mb-1" />
                    <span className="text-[8px] font-black uppercase text-gray-text block">Upload Intro Video</span>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center border border-white/10 group">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia('intro')}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600 text-white z-20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <video src={introVideoUrl} className="h-full w-full object-contain" autoPlay muted loop />
                  </div>
                )}
              </div>

            </div>

            {/* Battle Rules field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-text uppercase tracking-widest block">
                Battle Rules
              </label>
              <textarea
                placeholder="e.g. Post cricket stats only. Standard fan arguments allowed. Winner gets 5,000 points!"
                value={battleRules}
                rows={2}
                onChange={(e) => setBattleRules(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50 font-sans leading-relaxed resize-none custom-scrollbar"
              />
            </div>

            {/* ARENA LIVE PREVIEW BLOCK */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-orange uppercase tracking-widest block flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-orange" />
                <span>Arena Lobby Preview</span>
              </label>
              <div className="p-4 rounded-3xl border border-white/10 bg-white/[0.01] space-y-3.5 relative overflow-hidden">
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <span className="text-[8px] font-black text-white/90 bg-black/60 border border-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {battleCategory} ⚔️
                  </span>
                  <span className="text-[8px] font-black text-white bg-red-600 border border-red-500 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    Live 🔴
                  </span>
                </div>

                {/* Dual Previews */}
                <div className="grid grid-cols-9 items-center gap-1.5 pt-3">
                  <div className="col-span-4 text-center space-y-1.5">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/20 border border-white/5 flex items-center justify-center">
                      {p1Url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p1Url} alt="p1" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-gray-text font-bold">Player A</span>
                      )}
                    </div>
                    <span className="text-[9px] font-black text-white truncate block">
                      {p1Name || 'P1 Army'}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <span className="text-[8px] font-black text-pink">VS</span>
                  </div>

                  <div className="col-span-4 text-center space-y-1.5">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/20 border border-white/5 flex items-center justify-center">
                      {p2Url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p2Url} alt="p2" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-gray-text font-bold">Player B</span>
                      )}
                    </div>
                    <span className="text-[9px] font-black text-white truncate block">
                      {p2Name || 'P2 Clan'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-center border-t border-white/5 pt-2.5">
                  <h4 className="text-xs font-black text-white truncate">
                    {battleTitle || 'Duel Title Preview'}
                  </h4>
                  <div className="flex items-center justify-between text-[8px] text-gray-text font-bold uppercase tracking-wider">
                    <span>⚡ Lobby Voting Active</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      <span>Ends in: {battleDuration}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STICKY BOTTOM SUBMIT ACTIONS (Purple-Pink-Orange Gradient) */}
            <div className="fixed bottom-0 inset-x-0 md:relative md:bottom-auto p-4 md:p-0 bg-background/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-white/5 md:border-t-0 z-40">
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple via-pink to-orange text-white text-xs font-black uppercase tracking-widest border border-white/10 shadow-[0_0_20px_rgba(255,46,147,0.4)] hover:shadow-[0_0_30px_rgba(255,138,0,0.5)] cursor-pointer transition-all flex items-center justify-center gap-1.5 select-none"
              >
                <Swords className="h-4 w-4" />
                <span>Launch Battle ⚔️</span>
              </motion.button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};

export default CreatePostPage;
