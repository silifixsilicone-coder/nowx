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
  Heart,
  Flame,
  Zap,
  Target
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
      className="glass-effect-card rounded-[28px] w-full max-w-3xl mx-auto overflow-hidden shadow-xl border border-white/8 hover:border-purple/35 transition-all duration-300 relative"
      style={{
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(124, 58, 237, 0.04)"
      }}
    >
      {/* Decorative gradient border outline glow */}
      <div className="absolute inset-0 p-[1.5px] rounded-[28px] bg-gradient-to-tr from-purple/10 via-white/5 to-pink/10 pointer-events-none -z-10" />

      {/* Grid container: Split side-by-side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* ============================================================== */}
        {/* LEFT / POST SECTION: User, Media, Small Caption */}
        {/* ============================================================== */}
        <div className="p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
          
          <div className="space-y-3">
            {/* Header User info */}
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 flex-shrink-0 cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.user.avatar}
                  alt={post.user.displayName}
                  className="h-full w-full rounded-lg object-cover border border-white/10"
                />
                {post.user.status === 'online' && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-card bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-white hover:underline cursor-pointer truncate block max-w-[80px]">
                    {post.user.displayName}
                  </span>
                  {post.user.isVerified && (
                    <span className="text-[9px] text-purple font-black">⚡</span>
                  )}
                  {post.community && (
                    <span className="text-[9px] font-extrabold text-pink truncate block max-w-[60px] hover:underline cursor-pointer">
                      {post.community}
                    </span>
                  )}
                </div>
                <span className="text-[8px] text-gray-text block uppercase font-bold">
                  @{post.user.username}
                </span>
              </div>
            </div>

            {/* Media Content */}
            {post.type === 'image' && post.mediaUrl && (
              <div
                className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/30 cursor-pointer border border-white/5"
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
                      className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center pointer-events-none z-30"
                    >
                      <Heart className="h-14 w-14 fill-pink text-pink filter drop-shadow-[0_0_15px_rgba(255,46,147,0.8)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {post.type === 'video' && post.mediaUrl && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/30 border border-white/5">
                <video
                  src={post.mediaUrl}
                  loop
                  muted={isVideoMuted}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors cursor-pointer select-none"
                >
                  {isVideoMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </button>
              </div>
            )}

            {post.type === 'discord-code' && post.mediaUrl && (
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black/75">
                <div className="flex items-center justify-between bg-white/5 px-3 py-1.5 border-b border-white/5">
                  <span className="text-[8px] font-black uppercase text-gray-text tracking-widest">
                    TS / Code block
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-[10px] text-gray-text hover:text-white transition-colors cursor-pointer select-none font-bold"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 overflow-x-auto text-[9.5px] font-mono text-pink/90 leading-4 custom-scrollbar max-h-40">
                  <code>{post.mediaUrl}</code>
                </pre>
              </div>
            )}

            {/* Post Title & Description Caption (concise) */}
            <div className="space-y-1 pt-1">
              {post.title && (
                <h4 className="text-[12px] sm:text-[13px] font-black text-white leading-snug">
                  {post.title}
                </h4>
              )}
              <p className="text-[11px] sm:text-[12px] text-gray-text leading-relaxed font-medium">
                {post.content}
              </p>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[8.5px] font-extrabold px-2 py-0.5 rounded bg-white/5 text-gray-text border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* ============================================================== */}
        {/* RIGHT / TOP COMMENT SECTION: Hero comment, commenters, likes */}
        {/* ============================================================== */}
        <div className="p-4 flex flex-col justify-between bg-gradient-to-br from-purple/[0.03] to-pink/[0.01]">
          
          <div className="space-y-4">
            
            {/* Header label specifying comment is hero content */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-pink flex items-center gap-1 bg-pink/10 border border-pink/35 px-2.5 py-0.8 rounded-full shadow-[0_0_8px_rgba(255,46,147,0.12)]">
                <Flame className="h-3 w-3 text-pink animate-pulse" />
                <span>Top Comment 🔥</span>
              </span>
              <span className="text-[8px] text-gray-text font-black uppercase tracking-widest">
                Hero Content
              </span>
            </div>

            {postComments && postComments.length > 0 ? (
              // If comments exist, show the big highlighted comment
              <div className="space-y-4 pt-1">
                
                {/* Highlighted Commenter Avatar, Username */}
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={postComments[0].user.avatar}
                      alt={postComments[0].user.displayName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white hover:underline cursor-pointer block leading-none">
                      @{postComments[0].user.username}
                    </span>
                    <span className="text-[8px] text-gray-text font-bold block mt-0.5">
                      Camp Supporter • {postComments[0].timestamp}
                    </span>
                  </div>
                </div>

                {/* Big, heroic, extremely outstanding comment block */}
                <div className="relative p-1 rounded-2xl overflow-hidden bg-gradient-to-tr from-purple/10 via-transparent to-pink/5 border border-white/5">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-purple/10 rounded-full blur-md pointer-events-none" />
                  
                  <p className="text-base sm:text-lg font-black text-white leading-relaxed tracking-wide italic p-3 text-gradient">
                    "{postComments[0].content}"
                  </p>
                </div>

                {/* Comment statistics metric */}
                <div className="flex gap-4 text-[9px] font-black uppercase text-gray-text pt-1">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 fill-pink/25 text-pink" />
                    <span>{postComments[0].likes || reactionCounts.fire} Reactions</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 fill-purple/25 text-purple" />
                    <span>{postComments[0].replies?.length || 14} Replies</span>
                  </span>
                </div>

              </div>
            ) : (
              // Placeholder for when no comments exist yet
              <div className="py-8 text-center space-y-2 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <span className="text-2xl block animate-bounce">⚔️</span>
                <span className="text-[10px] font-black text-orange uppercase tracking-wider block">LOBBY VACANT</span>
                <p className="text-[10px] text-gray-text px-6 leading-relaxed font-medium">
                  Awaiting a savage roast comment. Be the first to strike and capture the hero content spot!
                </p>
              </div>
            )}

          </div>

          {/* Direct quick comment publisher */}
          <form onSubmit={handleAddComment} className="flex gap-2 pt-4 border-t border-white/5 mt-4">
            <input
              type="text"
              placeholder="Strike back with a roast..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-white/5 rounded-xl border border-white/10 px-3.5 py-2 text-[10px] text-white placeholder-gray-text focus:outline-none focus:border-purple/50"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-purple hover:bg-opacity-90 active:scale-95 text-[10px] font-black uppercase tracking-wider text-white transition-all cursor-pointer"
            >
              Roast
            </button>
          </form>

        </div>

      </div>

      {/* ============================================================== */}
      {/* BOTTOM ACTIONS BAR: Emoji pills & Action stats panel */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-3 border-t border-white/5 bg-[#12131C]">
        
        {/* Emoji reaction pills (🔥 😂 ❤️ 💀) */}
        <div className="flex items-center gap-1 flex-wrap">
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
                onClick={() => handleToggleReaction(react.type as any)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer select-none focus:outline-none ${
                  isSelected
                    ? 'bg-purple/15 border-purple/40 text-purple shadow-[0_0_8px_rgba(124,58,237,0.25)]'
                    : 'bg-white/5 border-white/5 text-gray-text hover:text-white'
                }`}
              >
                <span className="text-xs">{react.emoji}</span>
                <span>{count}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Global comment counter & share triggers */}
        <div className="flex items-center justify-end gap-2 flex-shrink-0">
          
          <button
            onClick={() => {
              if (onCommentClick) {
                onCommentClick(post.id);
              } else {
                setShowComments(!showComments);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/5 text-gray-text hover:text-white transition-colors cursor-pointer select-none"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{postComments.length} Comments</span>
          </button>

          <button 
            onClick={() => alert(`Copied post share link for @${post.user.username} to clipboard!`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/5 text-gray-text hover:text-white transition-colors cursor-pointer select-none"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>

        </div>

      </div>

      {/* Dynamic inline comments thread (slide down panel) */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/5 bg-black/25 overflow-hidden"
          >
            <div className="p-4 space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
              {postComments.length > 0 ? (
                postComments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))
              ) : (
                <p className="text-center text-[10px] text-gray-text py-4 font-bold">Lobby vacant. Be the first to launch a roast!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.article>
  );
};

export default FeedCard;
