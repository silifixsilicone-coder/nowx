'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Share2,
  Volume2,
  VolumeX,
  Heart,
  Bookmark,
  MoreHorizontal,
  Plus,
  Send,
  Smile,
  Image as ImageIcon,
  Flame,
  Award
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
        username: 'react_dev_99',
        displayName: 'Alex Rivers',
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

  // Dynamic style calculator for Top Comment Preview based on likes count
  const getTopCommentStyle = (likes: number) => {
    if (likes >= 500) {
      return {
        className: "border border-yellow-500/50 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.18)] p-3 rounded-2xl relative overflow-hidden",
        badge: "Fan Favorite 👑",
        textStyle: "text-yellow-400 font-bold"
      };
    } else if (likes >= 100) {
      return {
        className: "border border-orange/45 bg-orange/5 shadow-[0_0_15px_rgba(255,138,0,0.15)] p-3 rounded-2xl relative overflow-hidden",
        badge: "Trending Hot 🔥",
        textStyle: "text-orange font-bold"
      };
    } else if (likes >= 50) {
      return {
        className: "border border-pink/35 bg-pink/5 shadow-[0_0_12px_rgba(255,46,147,0.12)] p-3 rounded-2xl relative overflow-hidden",
        badge: "Elite Roast ✨",
        textStyle: "text-pink font-bold"
      };
    } else if (likes >= 20) {
      return {
        className: "border border-purple/25 bg-purple/5 shadow-[0_0_10px_rgba(124,58,237,0.1)] p-3 rounded-2xl relative overflow-hidden",
        badge: "Hype Pick ⚡",
        textStyle: "text-purple font-bold"
      };
    } else {
      return {
        className: "border border-white/5 bg-white/[0.01] p-3 rounded-2xl relative",
        badge: null,
        textStyle: "text-gray-text font-bold"
      };
    }
  };

  const topComment = postComments[0];
  // Calculate mock comment likes based on post metrics if not explicitly detailed
  const commentLikes = topComment ? (topComment.likes || Math.floor(likesCount * 0.45) + 1) : 0;
  const topCommentStyles = getTopCommentStyle(commentLikes);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#12131C] border border-white/5 rounded-3xl w-full max-w-xl mx-auto overflow-hidden shadow-2xl relative"
    >
      
      {/* Decorative gradient border outline glow */}
      <div className="absolute inset-0 p-[1px] rounded-3xl bg-gradient-to-tr from-purple/5 via-white/5 to-pink/5 pointer-events-none -z-10" />

      {/* 1. HEADER ROW (Instagram & Threads style) */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* Circular avatar */}
          <div className="relative h-9 w-9 flex-shrink-0 cursor-pointer rounded-full overflow-hidden border border-white/10 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.user.avatar}
              alt={post.user.displayName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-white hover:underline cursor-pointer block leading-none">
                {post.user.displayName}
              </span>
              {post.user.isVerified && (
                <span className="text-[10px] text-purple font-black">⚡</span>
              )}
              {post.community && (
                <span className="text-[9.5px] font-extrabold text-pink hover:underline cursor-pointer">
                  {post.community}
                </span>
              )}
            </div>
            <span className="text-[9px] text-gray-text font-bold block mt-0.5 uppercase tracking-wider">
              @{post.user.username} • 2h ago
            </span>
          </div>
        </div>

        {/* Follow & Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`text-[9.5px] font-black uppercase tracking-wider px-3.5 py-1.8 rounded-full border transition-all cursor-pointer select-none focus:outline-none ${
              isFollowing
                ? 'bg-white/5 border-white/5 text-gray-text'
                : 'bg-purple/10 border-purple/35 text-purple hover:bg-purple/20 shadow-[0_0_8px_rgba(124,58,237,0.15)]'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          
          <button className="text-gray-text hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer select-none">
            <MoreHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* 2. POST VISUAL MEDIA */}
      <div className="px-4">
        {post.type === 'image' && post.mediaUrl && (
          <div
            className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/30 border border-white/5 cursor-pointer shadow-inner"
            onClick={handleDoubleTap}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.mediaUrl}
              alt="Visual Post Content"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.003]"
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
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/30 border border-white/5 shadow-inner">
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
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/75">
            <div className="flex items-center justify-between bg-white/5 px-3 py-1.5 border-b border-white/5">
              <span className="text-[8px] font-black uppercase text-gray-text tracking-widest">
                TS / Code snippet
              </span>
            </div>
            <pre className="p-3.5 overflow-x-auto text-[9.5px] font-mono text-pink/90 leading-4 custom-scrollbar max-h-40">
              <code>{post.mediaUrl}</code>
            </pre>
          </div>
        )}
      </div>

      {/* 3. CAPTION AREA */}
      <div className="px-4 pt-3.5 space-y-1">
        {post.title && (
          <h4 className="text-[12px] sm:text-[13px] font-black text-white leading-snug">
            {post.title}
          </h4>
        )}
        <p className="text-[11.5px] sm:text-[12.5px] text-gray-text leading-relaxed font-medium">
          <span className="font-extrabold text-white mr-1.5">@{post.user.username}</span>
          {post.content}
        </p>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 px-4 pt-2">
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

      {/* 4. OUTLINED INTERACTION ACTIONS ROW (Instagram & Threads style) */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-white/5 mt-3.5">
        <div className="flex items-center gap-4">
          
          {/* Like */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleToggleLike}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-pink transition-colors cursor-pointer select-none"
          >
            <Heart className={`h-4.5 w-4.5 transition-all duration-200 ${isLiked ? 'fill-pink text-pink filter drop-shadow-[0_0_6px_rgba(255,46,147,0.3)]' : ''}`} />
            <span className={`text-[10px] ${isLiked ? 'text-pink font-black' : ''}`}>{likesCount}</span>
          </motion.button>

          {/* Comment */}
          <button
            onClick={() => {
              if (onCommentClick) {
                onCommentClick(post.id);
              } else {
                setShowComments(!showComments);
              }
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-purple transition-colors cursor-pointer select-none"
          >
            <MessageSquare className="h-4.5 w-4.5" />
            <span className="text-[10px]">{postComments.length}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://reactverse.app/post/${post.id}`);
              alert("Post link copied to clipboard! 🚀");
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-cyan-400 transition-colors cursor-pointer select-none"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Save */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="text-gray-text hover:text-orange cursor-pointer select-none focus:outline-none"
        >
          <Bookmark className={`h-4.5 w-4.5 transition-all duration-200 ${isSaved ? 'fill-orange text-orange' : ''}`} />
        </button>
      </div>

      {/* 5. TOP COMMENT PREVIEW WIDGET (Dynamic Border Glow Style) */}
      {topComment && (
        <div className="px-4 pb-4">
          <div className={topCommentStyles.className}>
            <div className="space-y-2">
              
              {/* Header Label and comment Badge */}
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1.5">
                <span className="text-[8px] font-black uppercase tracking-widest text-pink flex items-center gap-0.5">
                  <Flame className="h-3 w-3 text-pink animate-pulse" />
                  <span>Top Roast</span>
                </span>
                
                {topCommentStyles.badge && (
                  <span className={`text-[8.5px] font-black uppercase tracking-widest ${topCommentStyles.textStyle} px-2 py-0.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-0.5`}>
                    <Award className="h-3 w-3" />
                    <span>{topCommentStyles.badge}</span>
                  </span>
                )}
              </div>

              {/* Avatar Username */}
              <div className="flex items-center gap-2">
                <div className="h-5.5 w-5.5 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={topComment.user.avatar}
                    alt={topComment.user.displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black text-white block">
                    @{topComment.user.username}
                  </span>
                </div>
              </div>

              {/* Comment preview text */}
              <p className="text-[11px] font-medium text-white/90 italic leading-relaxed pl-1">
                "{topComment.content}"
              </p>

              {/* Small comment metrics */}
              <div className="flex gap-3 text-[8.5px] font-black uppercase text-gray-text pt-0.5">
                <span>❤️ {commentLikes} Reactions</span>
                <span
                  onClick={() => setShowComments(true)}
                  className="hover:underline hover:text-white cursor-pointer select-none"
                >
                  Reply
                </span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. EXPANDABLE COMMENTS THREAD / DRAWER AREA */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/5 bg-black/35 overflow-hidden"
          >
            
            {/* Thread Container */}
            <div className="p-4 space-y-4 max-h-72 overflow-y-auto custom-scrollbar">
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
                <p className="text-center text-[10px] text-gray-text py-4 font-bold uppercase tracking-wider">Awaiting savage comments...</p>
              )}
            </div>

            {/* Redesigned Rounded Pill input box fixed at bottom of drawer */}
            <form onSubmit={handleAddComment} className="p-3 bg-white/[0.02] border-t border-white/5 flex gap-2 items-center">
              
              {/* Pill Container */}
              <div className="flex-1 flex gap-1.5 items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.8 focus-within:border-purple/50 focus-within:ring-1 focus-within:ring-purple/20 transition-all">
                
                {/* Emoji trigger */}
                <button
                  type="button"
                  onClick={() => alert("Emoji selectors activated!")}
                  className="text-gray-text hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none"
                >
                  <Smile className="h-4 w-4" />
                </button>

                {/* Input field */}
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white placeholder-gray-text focus:outline-none font-medium"
                />

                {/* GIF / Image trigger */}
                <button
                  type="button"
                  onClick={() => alert("GIF attachments loaded!")}
                  className="text-gray-text hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Glowing Send action */}
              <button
                type="submit"
                className="h-8.5 w-8.5 rounded-full bg-purple hover:bg-opacity-90 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-md select-none flex-shrink-0"
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
