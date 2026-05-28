'use client';

import React, { useState } from 'react';
import {
  Share2,
  Heart,
  Bookmark,
  MoreHorizontal,
  Plus,
  Send,
  Smile,
  Image as ImageIcon,
  X
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
  const [showHeartPop, setShowHeartPop] = useState(false);

  // Stateful Likes, Saved, and Follows
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleToggleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
      if (onLike) onLike(post.id);
    }
  };

  // Double tap to like
  let lastTap = 0;
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (!isLiked) {
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
        if (onLike) onLike(post.id);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
    lastTap = now;
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `new_${Date.now()}`,
      user: {
        id: 'me',
        username: 'RoastMaster_99',
        displayName: 'Samar Singh',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        isVerified: true,
      },
      content: commentText,
      timestamp: '1m ago',
      likes: 0,
    };

    setPostComments([newComment, ...postComments]);
    setCommentText('');
  };

  // Stateful Edit & Delete inside comments
  const handleEditComment = (commentId: string, newContent: string) => {
    setPostComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, content: newContent } : c))
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setPostComments(prev => prev.filter(c => c.id !== commentId));
  };

  // Redesigned Top Comment style conforming strictly to Orange specifications
  const getTopCommentStyle = (likes: number) => {
    return {
      className: "border border-[#FF6A00] bg-soft-orange shadow-[0_0_15px_rgba(255,106,0,0.15)] p-3 rounded-2xl relative overflow-hidden",
      badge: likes >= 100 ? "Fan Favorite 👑" : null,
      textStyle: "text-[#FF6A00] font-black"
    };
  };

  const topComment = postComments[0];
  const commentLikes = topComment ? (topComment.likes || Math.floor(likesCount * 0.45) + 1) : 0;
  const topCommentStyles = getTopCommentStyle(commentLikes);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-white/5 rounded-3xl w-full max-w-xl mx-auto overflow-hidden shadow-2xl p-4.5 space-y-3.5 relative"
    >
      
      {/* Decorative subtle border outline glow */}
      <div className="absolute inset-0 p-[1px] rounded-[24px] bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none -z-10" />

      {/* 1. TOP ROW: User avatar, username, verified badge, elapsed time, and options menu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 flex-shrink-0 cursor-pointer rounded-full overflow-hidden border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.user.avatar}
              alt={post.user.username}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white hover:underline cursor-pointer block leading-none">
                {post.user.displayName}
              </span>
              <span className="text-[10px] text-[#FF6A00] font-bold">✓</span>
            </div>
            <span className="text-[9.5px] text-gray-text font-bold block mt-0.5 leading-none">
              2h ago
            </span>
          </div>
        </div>
        
        {/* Three dot trigger menu */}
        <button
          onClick={() => alert("Post options...")}
          className="text-gray-text hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer select-none"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* 2. MAIN CONTENT ROW: Caption text (left) & small media visual thumbnail (right) */}
      <div className="grid grid-cols-[1fr_auto] gap-4 items-start pt-0.5">
        <div className="min-w-0 pr-1.5">
          <p className="text-xs text-white/95 leading-relaxed font-semibold break-words">
            {post.content}
          </p>
        </div>
        
        {/* Compact Right-aligned media visual thumbnail */}
        {post.mediaUrl && (
          <div 
            onClick={handleDoubleTap}
            className="w-[110px] aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 cursor-pointer relative shadow-md group"
          >
            {post.type === 'image' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.mediaUrl}
                alt="Post media content"
                className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
              />
            )}
            
            {post.type === 'video' && (
              <video
                src={post.mediaUrl}
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            {post.type === 'discord-code' && (
              <div className="w-full h-full bg-[#1A1A1A] p-1.5 flex items-center justify-center">
                <span className="text-[6.5px] font-mono text-[#FF6A00] tracking-tight truncate w-full">Code</span>
              </div>
            )}

            {/* Double tap Heart pop overlay */}
            <AnimatePresence>
              {showHeartPop && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.2, 0.9, 1], opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 m-auto flex h-7 w-7 items-center justify-center pointer-events-none z-30"
                >
                  <Heart className="h-7 w-7 fill-[#FF6A00] text-[#FF6A00] filter drop-shadow-[0_0_8px_rgba(255,106,0,0.8)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 3. TOP COMMENT SECTION (Comment-First Hero Highlight with orange border and soft orange background) */}
      <div className="space-y-2 pt-0.5">
        <div className="flex items-center">
          <span className="text-[8px] font-black uppercase tracking-wider text-gray-text px-2 py-0.5 bg-white/5 border border-white/10 rounded-md">
            Top Comment
          </span>
        </div>

        {topComment ? (
          <div className={topCommentStyles.className}>
            {/* Commenter Avatar */}
            <div className="h-6.5 w-6.5 rounded-full overflow-hidden flex-shrink-0 border border-white/10 mt-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={topComment.user.avatar} alt="avatar" className="h-full w-full object-cover" />
            </div>

            {/* Comment content column */}
            <div className="flex-1 min-w-0 pr-14">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[10px] font-black text-white hover:underline cursor-pointer block leading-none">
                  {topComment.user.username}
                </span>
                <span className="text-[9px] text-[#FF6A00]">👑</span>
                <span className="text-[8.5px] text-gray-text font-bold block ml-1 leading-none">
                  • 2h
                </span>
                {topCommentStyles.badge && (
                  <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded bg-[#FF6A00]/10 ${topCommentStyles.textStyle}`}>
                    {topCommentStyles.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-white/90 leading-relaxed break-words font-medium pl-0.5">
                {topComment.content}
              </p>
            </div>

            {/* Heart metric aligned to the far right inside comment bubble */}
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-0.8 text-gray-text hover:text-[#FF6A00] transition-colors cursor-pointer select-none">
              <Heart className="h-3 w-3 fill-[#FF6A00] text-[#FF6A00] mr-1" />
              <span className="text-[9.5px] font-black text-[#FF6A00]">12.6K</span>
            </div>
          </div>
        ) : (
          <div className="py-2.5 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <p className="text-[8.5px] text-gray-text font-bold uppercase tracking-wider">Awaiting savage comments...</p>
          </div>
        )}
      </div>

      {/* 4. BOTTOM REACTION ROW */}
      <div className="pt-2.5 border-t border-white/5 flex items-center gap-5">
        
        {/* Fire Reaction (Like count) */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleToggleLike}
          className="flex items-center gap-1 text-[10px] font-black text-gray-text hover:text-[#FF6A00] transition-colors cursor-pointer select-none"
        >
          <span className="text-[12px]">🔥</span>
          <span className={isLiked ? 'text-[#FF6A00] font-black' : ''}>{likesCount.toLocaleString()}</span>
        </motion.button>

        {/* Laugh Reaction */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-1 text-[10px] font-black text-gray-text hover:text-amber-400 transition-colors cursor-pointer select-none"
        >
          <span className="text-[12px]">😂</span>
          <span>3.2K</span>
        </motion.button>

        {/* Comment outlined trigger button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-[10px] font-black text-gray-text hover:text-[#FF6A00] transition-colors cursor-pointer select-none"
        >
          <span className="text-[12px]">💬</span>
          <span>{postComments.length}</span>
        </motion.button>

        {/* Share trigger button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            navigator.clipboard.writeText(`https://reactverse.app/post/${post.id}`);
            alert("Post share link copied to clipboard! 🚀");
          }}
          className="flex items-center gap-1 text-[10px] font-black text-gray-text hover:text-cyan-400 transition-colors cursor-pointer select-none ml-auto"
        >
          <span className="text-[12px]">↗</span>
          <span>1.1K</span>
        </motion.button>

        {/* Save button trigger */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsSaved(!isSaved)}
          className="text-gray-text hover:text-[#FF6A00] cursor-pointer select-none"
        >
          <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#FF6A00] text-[#FF6A00]' : ''}`} />
        </motion.button>

      </div>


      {/* ============================================================== */}
      {/* STATEFUL INSTAGRAM-STYLE COMMENTS DRAWER */}
      {/* ============================================================== */}
      
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComments(false)}
            className="fixed inset-0 z-[140] bg-black/75 backdrop-blur-sm sm:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, y: 15 }}
            animate={{ height: 'auto', y: 0 }}
            exit={{ height: 0, y: 15 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/10 bg-[#0A0A0A] overflow-hidden rounded-t-[28px] max-[640px]:fixed max-[640px]:bottom-0 max-[640px]:inset-x-0 max-[640px]:z-[150] max-[640px]:max-h-[75vh] max-[640px]:flex max-[640px]:flex-col max-[640px]:shadow-[0_-8px_32px_rgba(0,0,0,0.7)]"
          >
            
            <div className="pt-3 pb-2 border-b border-white/5 bg-white/[0.01] flex-shrink-0">
              <div className="w-11 h-1 bg-white/20 rounded-full mx-auto mb-2 sm:hidden" />
              <div className="flex justify-between items-center px-4">
                <span className="text-xs font-black uppercase text-white tracking-widest block">Comments</span>
                
                <button
                  type="button"
                  onClick={() => setShowComments(false)}
                  className="text-gray-text hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer sm:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Comment list */}
            <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 max-h-60 sm:max-h-72">
              {postComments.length > 0 ? (
                postComments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                  />
                ))
              ) : (
                <p className="text-center text-[10px] text-gray-text py-10 font-bold uppercase tracking-wider">Awaiting roasts. Be the first to strike!</p>
              )}
            </div>

            {/* Fixed bottom rounded-pill comment composer form */}
            <form onSubmit={handleAddComment} className="p-3 bg-card-elevated border-t border-white/5 flex gap-2 items-center sticky bottom-0 z-10">
              
              <div className="flex-1 flex gap-1.5 items-center bg-white/5 border border-white/10 rounded-full px-3.5 py-2 focus-within:border-[#FF6A00]/50 focus-within:ring-1 focus-within:ring-[#FF6A00]/20 transition-all">
                
                <button
                  type="button"
                  onClick={() => alert("Emoji selectors activated!")}
                  className="text-gray-text hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none"
                >
                  <Smile className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white placeholder-gray-text focus:outline-none font-medium"
                />

                <button
                  type="button"
                  onClick={() => alert("GIPHY attachments active!")}
                  className="text-gray-text hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>

              </div>

              {/* Glowing pill orange send button */}
              <button
                type="submit"
                className="h-9 w-9 rounded-full bg-[#FF6A00] hover:bg-opacity-90 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-md select-none flex-shrink-0"
              >
                <Send className="h-3.5 w-3.5 text-white" />
              </button>

            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.article>
  );
};

export default FeedCard;
