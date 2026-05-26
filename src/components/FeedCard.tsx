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
  Award,
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
        className: "border border-yellow-500/50 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.18)] p-2.5 rounded-2xl relative overflow-hidden",
        badge: "Fan Favorite 👑",
        textStyle: "text-yellow-400 font-bold"
      };
    } else if (likes >= 100) {
      return {
        className: "border border-orange/45 bg-orange/5 shadow-[0_0_15px_rgba(255,138,0,0.15)] p-2.5 rounded-2xl relative overflow-hidden",
        badge: "Orange Fire 🔥",
        textStyle: "text-orange font-bold"
      };
    } else if (likes >= 50) {
      return {
        className: "border border-pink/35 bg-pink/5 shadow-[0_0_12px_rgba(255,46,147,0.12)] p-2.5 rounded-2xl relative overflow-hidden",
        badge: "Pink Border ✨",
        textStyle: "text-pink font-bold"
      };
    } else if (likes >= 20) {
      return {
        className: "border border-purple/25 bg-purple/5 shadow-[0_0_10px_rgba(124,58,237,0.1)] p-2.5 rounded-2xl relative overflow-hidden",
        badge: "Purple Glow ⚡",
        textStyle: "text-purple font-bold"
      };
    } else {
      return {
        className: "border border-white/5 bg-white/[0.01] p-2.5 rounded-2xl relative",
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
      className="bg-[#12131C] border border-white/5 rounded-[28px] w-full max-w-xl mx-auto overflow-hidden shadow-2xl relative"
    >
      
      {/* Decorative gradient border outline glow */}
      <div className="absolute inset-0 p-[1px] rounded-[28px] bg-gradient-to-tr from-purple/5 via-white/5 to-pink/5 pointer-events-none -z-10" />

      {/* Grid container: Split side-by-side on both mobile & desktop, single-column below 360px only */}
      <div className="grid grid-cols-[0.96fr_1.04fr] max-[360px]:grid-cols-1 gap-2 sm:gap-4">
        
        {/* ============================================================== */}
        {/* LEFT / POST SECTION: User, Media, Small Caption */}
        {/* ============================================================== */}
        <div className="p-3.5 flex flex-col justify-between border-r max-[360px]:border-r-0 max-[360px]:border-b border-white/5 min-w-0">
          
          <div className="space-y-2">
            {/* Header User info */}
            <div className="flex items-center justify-between gap-1.5 pb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="relative h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 cursor-pointer rounded-full overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.user.avatar}
                    alt={post.user.displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-black text-white hover:underline cursor-pointer truncate block max-w-[65px] sm:max-w-[85px]">
                  @{post.user.username}
                </span>
                {post.user.isVerified && (
                  <span className="text-[8px] sm:text-[9px] text-purple font-black">⚡</span>
                )}
              </div>
            </div>

            {/* Media Content */}
            {post.type === 'image' && post.mediaUrl && (
              <div
                className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/30 border border-white/5 cursor-pointer max-h-[85px] sm:max-h-[160px]"
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
                      className="absolute inset-0 m-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center pointer-events-none z-30"
                    >
                      <Heart className="h-10 w-10 sm:h-12 sm:w-12 fill-pink text-pink filter drop-shadow-[0_0_15px_rgba(255,46,147,0.8)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {post.type === 'video' && post.mediaUrl && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/30 border border-white/5 max-h-[85px] sm:max-h-[160px]">
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
                  className="absolute bottom-1 right-1 p-1 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors cursor-pointer select-none"
                >
                  {isVideoMuted ? <VolumeX className="h-2.5 w-2.5" /> : <Volume2 className="h-2.5 w-2.5" />}
                </button>
              </div>
            )}

            {post.type === 'discord-code' && post.mediaUrl && (
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black/75">
                <pre className="p-2 overflow-x-auto text-[8px] sm:text-[9px] font-mono text-pink/90 leading-3 sm:leading-4 custom-scrollbar max-h-16 sm:max-h-36">
                  <code>{post.mediaUrl}</code>
                </pre>
              </div>
            )}

            {/* Post Caption (compact) */}
            <div className="space-y-0.5 pt-0.5 min-w-0">
              {post.title && (
                <h4 className="text-[10px] sm:text-[11.5px] font-black text-white leading-snug truncate">
                  {post.title}
                </h4>
              )}
              <p className="text-[9.5px] sm:text-[11px] text-gray-text leading-relaxed font-medium line-clamp-2 sm:line-clamp-none">
                {post.content}
              </p>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* RIGHT / TOP COMMENT SECTION: Highlighted hero comment card */}
        {/* ============================================================== */}
        <div className="p-3.5 flex flex-col justify-between bg-gradient-to-br from-purple/[0.03] to-pink/[0.01] min-w-0">
          
          <div className="space-y-2.5">
            
            {/* Header label specifying comment is hero content */}
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-pink flex items-center gap-0.5 bg-pink/10 border border-pink/35 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(255,46,147,0.12)]">
                <Flame className="h-2.5 w-2.5 text-pink animate-pulse" />
                <span>Top Comment 🔥</span>
              </span>
            </div>

            {topComment ? (
              // Show the dynamic style comment card based on likes
              <div className={topCommentStyles.className}>
                <div className="space-y-1.5 pt-0.5">
                  
                  {/* Top row with commenter info & optional badge */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="h-5 w-5 rounded-full overflow-hidden flex-shrink-0 border border-white/10 shadow-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={topComment.user.avatar}
                          alt={topComment.user.displayName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-[9.5px] sm:text-[10px] font-black text-white hover:underline cursor-pointer truncate">
                        @{topComment.user.username}
                      </span>
                    </div>

                    {topCommentStyles.badge && (
                      <span className={`text-[7.5px] font-black uppercase tracking-widest ${topCommentStyles.textStyle} px-1.5 py-0.2 bg-white/5 border border-white/10 rounded-full flex items-center gap-0.5`}>
                        <span>👑</span>
                        <span>{topCommentStyles.badge}</span>
                      </span>
                    )}
                  </div>

                  {/* Comment text clamped */}
                  <p className="text-[10px] sm:text-[11px] font-medium text-white/95 leading-normal italic line-clamp-3 pl-0.5">
                    "{topComment.content}"
                  </p>

                  {/* Comment Statistics & Reply */}
                  <div className="flex gap-2.5 text-[8.5px] font-black uppercase text-gray-text pt-0.5">
                    <span>❤️ {commentLikes} Likes</span>
                    <span>💬 {topComment.replies?.length || 14} Replies</span>
                  </div>

                </div>
              </div>
            ) : (
              // Placeholder for when no comments exist yet
              <div className="py-4 text-center space-y-1 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <span className="text-lg block animate-bounce">⚔️</span>
                <span className="text-[8px] font-black text-orange uppercase tracking-wider block">LOBBY VACANT</span>
                <p className="text-[8px] text-gray-text px-2 leading-normal font-medium">
                  Awaiting a savage roast comment. Be the first to capture the hero spot!
                </p>
              </div>
            )}

          </div>

          {/* Follow toggle inside Top Comment Card bottom */}
          <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
            <span className="text-[8.5px] text-gray-text font-bold uppercase tracking-wider">
              Engagement Desk
            </span>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className="text-[9px] font-black uppercase text-purple hover:underline"
            >
              {isFollowing ? 'Following' : 'Follow Post'}
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* OUTLINED INTERACTION ACTIONS ROW (Instagram, X & Threads Style) */}
      {/* ============================================================== */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-4">
          
          {/* Like outlined button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleToggleLike}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-pink transition-colors cursor-pointer select-none"
          >
            <Heart className={`h-4.5 w-4.5 transition-all duration-200 ${isLiked ? 'fill-pink text-pink filter drop-shadow-[0_0_6px_rgba(255,46,147,0.3)]' : ''}`} />
            <span className={`text-[10px] ${isLiked ? 'text-pink font-black' : ''}`}>{likesCount}</span>
          </motion.button>

          {/* Comment outlined button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-purple transition-colors cursor-pointer select-none"
          >
            <MessageSquare className="h-4.5 w-4.5" />
            <span className="text-[10px]">{postComments.length}</span>
          </button>

          {/* Share outlined button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://reactverse.app/post/${post.id}`);
              alert("Post share link copied to clipboard! 🚀");
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-text hover:text-cyan-400 transition-colors cursor-pointer select-none"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Save outlined button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="text-gray-text hover:text-orange cursor-pointer select-none focus:outline-none"
        >
          <Bookmark className={`h-4.5 w-4.5 transition-all duration-200 ${isSaved ? 'fill-orange text-orange' : ''}`} />
        </button>
      </div>

      {/* ============================================================== */}
      {/* STATEFUL INSTAGRAM-STYLE COMMENTS DRAWER (Mobile Bottom Sheet / Desktop inline) */}
      {/* ============================================================== */}
      
      {/* Backdrop blur overlay on mobile only when comments drawer is active */}
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
            className="border-t border-white/10 bg-[#0B0B12] overflow-hidden rounded-t-[28px] max-[640px]:fixed max-[640px]:bottom-0 max-[640px]:inset-x-0 max-[640px]:z-[150] max-[640px]:max-h-[75vh] max-[640px]:flex max-[640px]:flex-col max-[640px]:shadow-[0_-8px_32px_rgba(0,0,0,0.7)]"
          >
            
            {/* Instagram style header with top drag handle & close buttons */}
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
            <form onSubmit={handleAddComment} className="p-3 bg-[#12131C] border-t border-white/5 flex gap-2 items-center sticky bottom-0 z-10">
              
              <div className="flex-1 flex gap-1.5 items-center bg-white/5 border border-white/10 rounded-full px-3.5 py-2 focus-within:border-purple/50 focus-within:ring-1 focus-within:ring-purple/20 transition-all">
                
                {/* Emoji panel toggle */}
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

                {/* GIPHY visual toggle */}
                <button
                  type="button"
                  onClick={() => alert("GIPHY attachments active!")}
                  className="text-gray-text hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>

              </div>

              {/* Glowing pill send button */}
              <button
                type="submit"
                className="h-9 w-9 rounded-full bg-purple hover:bg-opacity-90 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-md select-none flex-shrink-0"
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
