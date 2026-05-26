'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Copy,
  Check,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '@/data/mockData';
import CommentCard from './CommentCard';

interface FeedCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onCommentClick?: (postId: string) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({ post, onLike, onCommentClick }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState(post.comments);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);

  // States for interactive emojis: 🔥 😂 ❤️ 💀
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    fire: Math.floor(post.likes * 0.4) + 12,
    laugh: Math.floor(post.upvotes * 0.3) + 8,
    love: Math.floor(post.likes * 0.5) + 15,
    dead: Math.floor(post.downvotes * 2) + 5,
  });

  const [myReactions, setMyReactions] = useState<Record<string, boolean>>({
    fire: false,
    laugh: false,
    love: true, // Default liked state maps to 'love' reaction!
    dead: false,
  });

  // Handle double-tap to heart
  let lastTap = 0;
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (!myReactions.love) {
        setMyReactions((prev) => ({ ...prev, love: true }));
        setReactionCounts((prev) => ({ ...prev, love: prev.love + 1 }));
        if (onLike) onLike(post.id);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
    lastTap = now;
  };

  const handleToggleReaction = (type: 'fire' | 'laugh' | 'love' | 'dead') => {
    setMyReactions((prev) => {
      const active = prev[type];
      setReactionCounts((counts) => ({
        ...counts,
        [type]: active ? counts[type] - 1 : counts[type] + 1,
      }));
      return {
        ...prev,
        [type]: !active,
      };
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `new_${Date.now()}`,
      user: {
        id: 'me',
        username: 'react_dev_99',
        displayName: 'Alex Rivers',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        isVerified: true,
      },
      content: commentText,
      timestamp: 'Just now',
      likes: 0,
    };

    setPostComments([newComment, ...postComments]);
    setCommentText('');
  };

  const handleCopyCode = () => {
    if (post.type === 'discord-code' && post.mediaUrl) {
      navigator.clipboard.writeText(post.mediaUrl);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="glass-effect-card rounded-[24px] w-full max-w-2xl mx-auto overflow-hidden shadow-xl border border-white/8 hover:border-purple/35 transition-all duration-300"
      style={{
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 15px rgba(124, 58, 237, 0.03)"
      }}
    >
      
      {/* 1. Header (Avatar + User Name) */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.user.avatar}
              alt={post.user.displayName}
              className="h-full w-full rounded-xl object-cover border border-white/10"
            />
            {post.user.status === 'online' && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-card bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-white hover:underline cursor-pointer">
                {post.user.displayName}
              </span>
              {post.user.isVerified && (
                <span className="text-[10px] text-purple font-black">⚡</span>
              )}
              {post.community && (
                <>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-xs font-extrabold text-pink hover:underline cursor-pointer">
                    {post.community}
                  </span>
                </>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] text-gray-text block">
              @{post.user.username} • 4h ago
            </span>
          </div>
        </div>

        <button className="text-gray-text hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer select-none">
          <Sparkles className="h-4.5 w-4.5 text-orange animate-pulse" />
        </button>
      </div>

      {/* Post Title & Description Caption */}
      <div className="px-4 pt-3 pb-2 space-y-1">
        {post.title && (
          <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
            {post.title}
          </h3>
        )}
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal break-words">
          {post.content}
        </p>
      </div>

      {/* 2. Post Media content (Image / Video player) */}
      {post.type === 'image' && post.mediaUrl && (
        <div
          className="relative aspect-video w-full overflow-hidden bg-black/30 cursor-pointer"
          onClick={handleDoubleTap}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.mediaUrl}
            alt="Visual Post Content"
            className="w-full h-full object-cover transition-transform hover:scale-[1.005]"
          />
          
          {/* Double tap Heart pop overlay */}
          <AnimatePresence>
            {showHeartPop && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.25, 0.9, 1], opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center pointer-events-none z-30"
              >
                <Heart className="h-20 w-20 fill-pink text-pink filter drop-shadow-[0_0_20px_rgba(255,46,147,0.8)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Video Content */}
      {post.type === 'video' && post.mediaUrl && (
        <div className="relative aspect-video w-full overflow-hidden bg-black/30">
          <video
            src={post.mediaUrl}
            loop
            muted={isVideoMuted}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Audio toggle overlay controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setIsVideoMuted(!isVideoMuted)}
              className="p-2 rounded-xl bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors cursor-pointer select-none"
            >
              {isVideoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Discord Style Code blocks */}
      {post.type === 'discord-code' && post.mediaUrl && (
        <div className="px-4 py-2">
          <div className="rounded-xl overflow-hidden border border-white/10 bg-black/75">
            <div className="flex items-center justify-between bg-white/5 px-4 py-2 border-b border-white/5">
              <span className="text-[10px] font-black uppercase text-gray-text tracking-widest">
                TypeScript / React
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs text-gray-text hover:text-white transition-colors cursor-pointer select-none"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-green-400 text-[10px] font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] font-mono text-pink/90 leading-5 custom-scrollbar">
              <code>{post.mediaUrl}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Category Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 pt-2 pb-1 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-gray-text border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 3. Highlighted Top Comment (Bigger, visually important, glow borders) */}
      {postComments && postComments.length > 0 && (
        <div className="px-4 pb-1 pt-2">
          <div
            className="relative p-[1.5px] rounded-2xl bg-gradient-to-r from-purple/40 to-pink/40 shadow-[0_0_15px_rgba(124,58,237,0.12)]"
            style={{
              boxShadow: "0 0 15px rgba(124, 58, 237, 0.08)"
            }}
          >
            {/* Dark glass inner content panel */}
            <div className="bg-[#12131C] p-3.5 rounded-[15px] relative overflow-hidden">
              <div className="absolute top-0 right-0 h-10 w-10 bg-purple/10 rounded-full blur-md" />
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-pink flex items-center gap-1">
                  <span>🔥 Top Community Roast</span>
                </span>
                <span className="text-[8px] text-gray-text font-bold">💬 {postComments[0].timestamp}</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={postComments[0].user.avatar}
                    alt={postComments[0].user.displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-black text-white">@{postComments[0].user.username}</span>
                    {postComments[0].user.isVerified && <span className="text-[9px] text-purple">⚡</span>}
                  </div>
                  {/* Bigger & Visually outstanding typography */}
                  <p className="text-sm font-extrabold text-white leading-relaxed tracking-wide italic">
                    "{postComments[0].content}"
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. Actions & Emojis reactions row (🔥 😂 ❤️ 💀) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 border-t border-white/5 bg-white/[0.01]">
        
        {/* Left Column: Emoji Reactions pills (🔥 😂 ❤️ 💀) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { type: 'fire', emoji: '🔥', label: 'Roast' },
            { type: 'laugh', emoji: '😂', label: 'Fun' },
            { type: 'love', emoji: '❤️', label: 'Hype' },
            { type: 'dead', emoji: '💀', label: 'Dead' },
          ].map((react) => {
            const isSelected = myReactions[react.type];
            const count = reactionCounts[react.type];

            return (
              <motion.button
                key={react.type}
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleToggleReaction(react.type as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer select-none focus:outline-none ${
                  isSelected
                    ? 'bg-purple/15 border-purple/40 text-purple shadow-[0_0_10px_rgba(124,58,237,0.3)]'
                    : 'bg-white/5 border-white/5 text-gray-text hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-sm">{react.emoji}</span>
                <span>{count}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Right Column: Comments & Share Actions */}
        <div className="flex items-center justify-end gap-3 flex-shrink-0">
          
          {/* Comments panel toggle */}
          <button
            onClick={() => {
              if (onCommentClick) {
                onCommentClick(post.id);
              } else {
                setShowComments(!showComments);
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-white/5 text-gray-text hover:text-white transition-colors cursor-pointer select-none"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{postComments.length}</span>
          </button>

          {/* Share button */}
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-white/5 text-gray-text hover:text-white transition-colors cursor-pointer select-none">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

        </div>

      </div>

      {/* Slide down detailed comment panels */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/5 bg-black/20 overflow-hidden"
          >
            
            {/* Comment input form */}
            <form onSubmit={handleAddComment} className="p-4 flex gap-3 border-b border-white/5">
              <input
                type="text"
                placeholder="Join the roast thread..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-white/5 rounded-xl border border-white/10 px-4 py-2 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple text-white text-xs font-bold hover:bg-opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Send
              </button>
            </form>

            {/* List of comments */}
            <div className="p-4 space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
              {postComments.length > 0 ? (
                postComments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))
              ) : (
                <p className="text-center text-xs text-gray-text py-4">No responses yet. Be the first!</p>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.article>
  );
};

export default FeedCard;
