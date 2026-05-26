'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Video,
  Smile,
  BarChart3,
  Globe,
  Plus,
  Compass,
  Zap,
  Flame,
  BrainCircuit,
  Lock,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import { Post, currentUser } from '@/data/mockData';

interface CreatePostPageProps {
  onBack: () => void;
  onSubmit: (post: Post) => void;
}

export const CreatePostPage: React.FC<CreatePostPageProps> = ({ onBack, onSubmit }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Roast');
  const [mediaType, setMediaType] = useState<'text' | 'image' | 'poll' | 'gif'>('text');
  const [imageUrl, setImageUrl] = useState('');
  
  // Poll Options
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  
  // Toggles
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAiSuggest, setIsAiSuggest] = useState(false);
  const [isSafeMode, setIsSafeMode] = useState(true);
  
  // AI Mock suggestions
  const [aiDraftPrompt, setAiDraftPrompt] = useState('');

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    setPollOptions((prev) => prev.map((opt, i) => (i === idx ? val : opt)));
  };

  const handleGenerateAiPrompt = () => {
    if (selectedCategory === 'Roast') {
      setAiDraftPrompt("Australia airplane mode me hai 😂 #CricketRoast");
    } else if (selectedCategory === 'Hype') {
      setAiDraftPrompt("Team India wins the World Cup! Unbelievable scenes tonight 🇮🇳🏆");
    } else if (selectedCategory === 'Meme') {
      setAiDraftPrompt("When Next.js Turbopack compiles in 0.1s but npm install took 5 minutes 💀");
    } else {
      setAiDraftPrompt("React 19 Server Actions are absolutely massive. The clean code is satisfying! 🔥");
    }
    setContent(aiDraftPrompt || "ReactVerse the next-generation hybrid platform!");
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Compile custom mock tags
    const mockTags = [selectedCategory.toLowerCase()];
    if (isAnonymous) mockTags.push('anon');
    if (mediaType === 'poll') mockTags.push('poll');

    const newPost: Post = {
      id: `post_page_${Date.now()}`,
      user: isAnonymous
        ? {
            id: 'anon_user',
            username: 'anonymous',
            displayName: 'Anonymous Agent',
            avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
            followers: 0,
            following: 0,
            reactPoints: 0,
          }
        : currentUser,
      type: mediaType === 'image' ? 'image' : 'text',
      title: title ? title : `${selectedCategory} Space Post`,
      content: content,
      mediaUrl: mediaType === 'image' && imageUrl ? imageUrl : undefined,
      likes: 1,
      upvotes: 1,
      downvotes: 0,
      commentsCount: 0,
      comments: [],
      community: `r/${selectedCategory.toLowerCase()}`,
      tags: mockTags,
      isLiked: true,
      voteStatus: 'upvoted',
    };

    onSubmit(newPost);
    onBack(); // Direct navigate back to feed
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 select-none pb-24 md:pb-6">
      
      {/* Header Back navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple hover:text-white border border-purple/35 hover:bg-purple/10 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md bg-purple/5"
        >
          ← Back to Feed
        </button>
        <span className="text-[10px] font-black uppercase text-gray-text tracking-widest">
          Publish Deck
        </span>
      </div>

      <div className="glass-effect-card rounded-[24px] p-6 relative overflow-hidden border border-white/8 shadow-2xl">
        {/* Glow lamps */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-pink/15 blur-3xl" />

        <form onSubmit={handleSubmitPost} className="space-y-6 relative z-10">
          
          {/* A. Text Area Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-gray-text uppercase tracking-widest">
                Write Space Draft
              </label>
              <span className="text-[9px] font-bold text-gray-text">
                {content.length}/280 chars
              </span>
            </div>
            <textarea
              placeholder={
                selectedCategory === 'Roast'
                  ? 'Drop a spicy roast about tech or cricket today...'
                  : 'Share your trending hype, web designs, or coding benchmarks...'
              }
              value={content}
              rows={4}
              maxLength={280}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-gray-text focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20 transition-all font-sans leading-relaxed resize-none custom-scrollbar"
            />
          </div>

          {/* B. Media formats row */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-text uppercase tracking-widest block">
              Attach Visuals & Polls
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMediaType(mediaType === 'image' ? 'text' : 'image')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                  mediaType === 'image'
                    ? 'bg-purple/20 border-purple/35 text-purple shadow-md'
                    : 'bg-white/5 border-transparent text-gray-text hover:text-white'
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                <span>Media Link</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType(mediaType === 'gif' ? 'text' : 'gif')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                  mediaType === 'gif'
                    ? 'bg-purple/20 border-purple/35 text-purple shadow-md'
                    : 'bg-white/5 border-transparent text-gray-text hover:text-white'
                }`}
              >
                <Smile className="h-4 w-4" />
                <span>Add GIF</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType(mediaType === 'poll' ? 'text' : 'poll')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                  mediaType === 'poll'
                    ? 'bg-purple/20 border-purple/35 text-purple shadow-md'
                    : 'bg-white/5 border-transparent text-gray-text hover:text-white'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Poll Box</span>
              </button>
            </div>

            {/* Content for Image Link Attachment */}
            {mediaType === 'image' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 p-3 bg-white/5 rounded-2xl border border-white/5"
              >
                <span className="text-[9px] font-black text-pink uppercase block">Image/Video Link</span>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50"
                />
              </motion.div>
            )}

            {/* Content for GIFs Selection Grid */}
            {mediaType === 'gif' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2"
              >
                <span className="text-[9px] font-black text-pink uppercase block">Select Trending GIF</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'https://media.giphy.com/media/l3q2zVR6cu95nF6O4/giphy.gif',
                    'https://media.giphy.com/media/26n61r3hyE6JyTxyE/giphy.gif',
                    'https://media.giphy.com/media/89asT84PzD5c3zczWy/giphy.gif',
                  ].map((gifSrc, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setMediaType('image');
                        setImageUrl(gifSrc);
                      }}
                      className="aspect-video rounded-lg overflow-hidden border border-white/5 hover:border-purple cursor-pointer bg-black/30"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={gifSrc} alt="gif option" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Content for Poll Creators */}
            {mediaType === 'poll' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-pink uppercase block">Configure Poll Options</span>
                  {pollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddPollOption}
                      className="text-[8px] font-black text-purple uppercase flex items-center gap-0.5 hover:underline"
                    >
                      <Plus className="h-2.5 w-2.5" /> Option
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {pollOptions.map((option, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Poll Option ${idx + 1}`}
                      value={option}
                      onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* C. Category Buttons */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-text uppercase tracking-widest block">
              Choose Space Category
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Roast', emoji: '🔥', glow: 'hover:border-purple hover:bg-purple/10 active:bg-purple/20' },
                { label: 'Hype', emoji: '❤️', glow: 'hover:border-pink hover:bg-pink/10 active:bg-pink/20' },
                { label: 'Meme', emoji: '😂', glow: 'hover:border-yellow-500 hover:bg-yellow-500/10 active:bg-yellow-500/20' },
                { label: 'Cricket', emoji: '🏏', glow: 'hover:border-orange hover:bg-orange/10 active:bg-orange/20' },
                { label: 'Battle', emoji: '⚔️', glow: 'hover:border-cyan-500 hover:bg-cyan-500/10 active:bg-cyan-500/20' },
              ].map((cat) => {
                const isActive = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none border ${
                      isActive
                        ? 'bg-purple border-purple text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]'
                        : `bg-white/5 border-white/5 text-gray-text hover:text-white ${cat.glow}`
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* D. Options Toggles (IOS Slider UI) */}
          <div className="space-y-3 border-t border-white/5 pt-4">
            <label className="text-[10px] font-black text-gray-text uppercase tracking-widest block">
              Space Configurations
            </label>
            <div className="space-y-3">
              
              {/* Anonymous Mode */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-purple" />
                  <div>
                    <span className="text-xs font-bold text-white block">Anonymous Mode</span>
                    <span className="text-[9px] text-gray-text block">Mask your identity and avatar on feed.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 cursor-pointer ${
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

              {/* AI Suggestions Mode */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-pink" />
                  <div>
                    <span className="text-xs font-bold text-white block">AI Roaster Suggestions</span>
                    <span className="text-[9px] text-gray-text block">Auto-generate creative drafts from category.</span>
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
                  className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 cursor-pointer ${
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

              {/* Safe Mode */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange" />
                  <div>
                    <span className="text-xs font-bold text-white block">Safe Filter Mode</span>
                    <span className="text-[9px] text-gray-text block">Applies profanity filters automatically.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSafeMode(!isSafeMode)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-all duration-300 cursor-pointer ${
                    isSafeMode ? 'bg-orange' : 'bg-white/10'
                  }`}
                >
                  <motion.div
                    layout
                    className="h-4 w-4 bg-white rounded-full shadow-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{ float: isSafeMode ? 'right' : 'left' }}
                  />
                </button>
              </div>

            </div>
          </div>

          {/* Submit Button (Purple -> Pink -> Orange Gradient Glow) */}
          <div className="pt-2">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple via-pink to-orange text-white text-xs font-black uppercase tracking-widest border border-white/10 shadow-[0_0_20px_rgba(255,46,147,0.5)] cursor-pointer hover:shadow-[0_0_30px_rgba(255,138,0,0.6)] focus:outline-none flex items-center justify-center gap-1.5 transition-all"
              style={{
                boxShadow: "0 0 20px rgba(255, 46, 147, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2)"
              }}
            >
              <Globe className="h-4 w-4" />
              <span>Publish to Space</span>
            </motion.button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default CreatePostPage;
