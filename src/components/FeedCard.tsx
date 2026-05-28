'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Bookmark,
  MoreHorizontal,
  Plus,
  Send,
  Smile,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Play,
  Music,
  MessageSquare,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '@/data/mockData';
import CommentCard from './CommentCard';

interface FeedCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onCommentClick?: (postId: string) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({ post, onLike }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showHeartPop, setShowHeartPop] = useState(false);

  // Comments state
  const [postComments, setPostComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');

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
  const handleDoubleTap = (e: React.MouseEvent) => {
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

  const handleVideoClick = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (isPlaying) {
      videoEl.pause();
      setIsPlaying(false);
    } else {
      videoEl.play().catch(err => console.log('Autoplay blocked:', err));
      setIsPlaying(true);
    }
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

  const handleEditComment = (commentId: string, newContent: string) => {
    setPostComments(prev =>
      prev.map(c => (c.id === commentId ? { ...c, content: newContent } : c))
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setPostComments(prev => prev.filter(c => c.id !== commentId));
  };

  const topComment = postComments[0];

  return (
    <div className="snap-start w-full h-full flex flex-col justify-between overflow-hidden bg-[#0A0A0A] relative select-none">
      
      {/* ============================================================== */}
      {/* 1. TOP CINEMATIC MEDIA SLIDE (60% Height) */}
      {/* ============================================================== */}
      <div 
        onClick={handleVideoClick}
        onMouseDown={handleDoubleTap}
        className="h-[58%] w-full relative overflow-hidden bg-black flex-shrink-0 cursor-pointer"
      >
        
        {/* Subtle blur background reflection depth */}
        {post.mediaUrl && post.type === 'image' && (
          <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-30 select-none pointer-events-none"
            style={{ backgroundImage: `url(${post.mediaUrl})` }}
          />
        )}

        {/* Media visual content container */}
        <div className="absolute inset-0 flex items-center justify-center z-10 w-full h-full">
          {post.type === 'image' && post.mediaUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.mediaUrl}
              alt="Reel Media"
              className="w-full h-full object-cover transition-transform duration-[12s] scale-100 hover:scale-[1.04]"
            />
          )}

          {post.type === 'video' && post.mediaUrl && (
            <video
              ref={videoRef}
              src={post.mediaUrl}
              loop
              muted={isVideoMuted}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}

          {post.type === 'discord-code' && (
            <div className="w-full h-full bg-[#1A1A1A] p-6 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-[#FF6A00] tracking-tight">{post.content}</span>
            </div>
          )}
        </div>

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
              <Heart className="h-20 w-20 fill-[#FF6A00] text-[#FF6A00] filter drop-shadow-[0_0_12px_rgba(255,106,0,0.8)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dark cinematic vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none z-20" />

        {/* Floating Pause icon indicator if paused */}
        {!isPlaying && (
          <div className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white pointer-events-none backdrop-blur-xs z-35">
            <Play className="h-6 w-6 fill-white ml-0.8" />
          </div>
        )}

        {/* BOTTOM-LEFT USER INFO OVERLAY */}
        <div className="absolute bottom-4 left-4 right-16 z-25 text-white space-y-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="h-8 w-8 rounded-full overflow-hidden border border-[#FF6A00]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.user.avatar} alt="avatar" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black block leading-none">{post.user.displayName}</span>
                <span className="text-[10px] text-[#FF6A00]">✓</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); }}
                  className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ml-1.5 transition-all select-none cursor-pointer ${
                    isFollowing ? 'border-white/20 bg-white/5 text-white' : 'border-[#FF6A00] bg-[#FF6A00]/10 text-[#FF6A00]'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
              <span className="text-[9px] text-gray-text block mt-0.5 leading-none">@{post.user.username}</span>
            </div>
          </div>

          <p className="text-[10.5px] font-medium leading-relaxed max-w-[90%] text-white/95 truncate">
            {post.content}
          </p>

          {/* Scrolling audio sound ticker */}
          <div className="flex items-center gap-1.5">
            <Music className="h-3 w-3 text-[#FF6A00] animate-bounce" />
            <div className="overflow-hidden w-36 text-[9.5px] font-bold text-gray-text">
              <motion.div
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="whitespace-nowrap"
              >
                Original Audio  •  {post.user.displayName}
              </motion.div>
            </div>
          </div>
        </div>

        {/* FLOATING ACTION TOOLBAR (RIGHT) */}
        <div className="absolute bottom-8 right-3 flex flex-col items-center gap-4.5 z-25 pointer-events-auto">
          
          {/* Profile follow overlay shortcut */}
          <div className="relative cursor-pointer mb-1">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 p-0.5 bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.user.avatar} alt="Author" className="h-full w-full rounded-full object-cover" />
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#FF6A00] text-[8px] text-white font-black rounded-full px-1.5 py-0.2 border border-black shadow">
              +
            </span>
          </div>

          {/* Like Button trigger */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleToggleLike(); }}
            className="flex flex-col items-center gap-0.8 cursor-pointer focus:outline-none"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/5 text-white hover:bg-black/60 transition-all ${
              isLiked ? 'bg-[#FF6A00]/10 border-[#FF6A00]/30 text-[#FF6A00]' : ''
            }`}>
              <Heart className={`h-4.8 w-4.8 ${isLiked ? 'fill-[#FF6A00] text-[#FF6A00] filter drop-shadow-[0_0_6px_rgba(255,106,0,0.5)]' : ''}`} />
            </div>
            <span className="text-[9.5px] font-black text-white">{likesCount.toLocaleString()}</span>
          </button>

          {/* Comment count viewer button */}
          <button 
            className="flex flex-col items-center gap-0.8 cursor-pointer focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/5 text-white hover:bg-black/60 transition-colors">
              <MessageSquare className="h-4.8 w-4.8" />
            </div>
            <span className="text-[9.5px] font-black text-white">{postComments.length}</span>
          </button>

          {/* Share Button trigger */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(`https://reactverse.app/post/${post.id}`);
              alert("Post link copied to clipboard! 🚀");
            }}
            className="flex flex-col items-center gap-0.8 cursor-pointer focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/5 text-white hover:bg-black/60 transition-colors">
              <Share2 className="h-4.8 w-4.8" />
            </div>
            <span className="text-[9.5px] font-black text-white">1.1k</span>
          </button>

          {/* Save Button trigger */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
            className="flex flex-col items-center gap-0.8 cursor-pointer focus:outline-none"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/5 text-white hover:bg-black/60 transition-colors ${
              isSaved ? 'text-[#FF6A00]' : ''
            }`}>
              <Bookmark className={`h-4.8 w-4.8 ${isSaved ? 'fill-[#FF6A00]' : ''}`} />
            </div>
            <span className="text-[9.5px] font-black text-white">Save</span>
          </button>

          {/* Mute toggle indicator button */}
          {post.type === 'video' && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsVideoMuted(!isVideoMuted); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors cursor-pointer"
            >
              {isVideoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}

        </div>

      </div>

      {/* ============================================================== */}
      {/* 2. SAVAGE INLINE COMMENTS DISCUSSION PANEL (42% Height) */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col bg-[#111111] border-t border-white/5 overflow-hidden select-none">
        
        {/* Comments Section Title bar */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-white/5">
          <span className="text-[9.5px] font-black uppercase text-white tracking-widest block">Top Comments</span>
          <span className="text-[8.5px] text-[#FF6A00] font-black uppercase tracking-wider block bg-[#FF6A00]/10 px-2 py-0.5 rounded">Savage Lobby 💬</span>
        </div>

        {/* Scrollable replies thread thread column */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3 pb-16 custom-scrollbar">
          
          {/* Highlighted Top Comment (Comment-first entertainment layer) */}
          {topComment ? (
            <div className="border border-[#FF6A00] bg-soft-orange shadow-[0_0_15px_rgba(255,106,0,0.15)] p-3 rounded-2xl relative overflow-hidden group">
              <div className="flex gap-2.5 items-start">
                <div className="h-7 w-7 rounded-full overflow-hidden flex-shrink-0 border border-white/10 mt-0.5">
                  <img src={topComment.user.avatar} alt="avatar" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 pr-10">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-black text-white hover:underline cursor-pointer leading-none">
                      {topComment.user.username}
                    </span>
                    <span className="text-[9px] text-[#FF6A00]">👑</span>
                    <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-[#FF6A00]/15 text-[#FF6A00] rounded leading-none">
                      Top Roast
                    </span>
                  </div>
                  <p className="text-[10.5px] text-white/95 leading-normal break-words font-extrabold italic pl-0.5">
                    "{topComment.content}"
                  </p>
                </div>
                
                {/* Heart aligned inside bubble bubble */}
                <div className="absolute right-3 top-4 flex items-center gap-0.8 text-gray-text hover:text-[#FF6A00] transition-colors cursor-pointer select-none">
                  <Heart className="h-3.5 w-3.5 fill-[#FF6A00] text-[#FF6A00] mr-0.5" />
                  <span className="text-[9.5px] font-black text-[#FF6A00]">12.6K</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
              <p className="text-[9px] text-gray-text font-black uppercase tracking-wider">Awaiting savage comments...</p>
            </div>
          )}

          {/* More Comments scroll list */}
          <div className="space-y-3">
            {postComments.slice(1).map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>

        </div>

        {/* Anchored Bottom Pill input composer form */}
        <form 
          onSubmit={handleAddComment}
          className="absolute bottom-0 inset-x-0 p-3 bg-[#111111] border-t border-white/5 flex gap-2.5 items-center z-30"
        >
          <div className="flex-1 flex gap-1.5 items-center bg-white/5 border border-white/10 rounded-full px-3.5 py-2 focus-within:border-[#FF6A00]/50 focus-within:ring-1 focus-within:ring-[#FF6A00]/20 transition-all">
            
            <button
              type="button"
              onClick={() => alert("Emoji selectors activated!")}
              className="text-gray-text hover:text-white p-0.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none"
            >
              <Smile className="h-4.2 w-4.2" />
            </button>

            <input
              type="text"
              placeholder="Add savage roast..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-text/60 focus:outline-none font-medium"
            />

            <button
              type="button"
              onClick={() => alert("GIPHY attachments active!")}
              className="text-gray-text hover:text-white p-0.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none"
            >
              <ImageIcon className="h-4.2 w-4.2" />
            </button>

          </div>

          <button
            type="submit"
            className="h-8.5 w-8.5 rounded-full bg-[#FF6A00] hover:bg-opacity-90 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-md select-none flex-shrink-0"
          >
            <Send className="h-3.5 w-3.5 text-white" />
          </button>
        </form>

      </div>

    </div>
  );
};

export default FeedCard;
