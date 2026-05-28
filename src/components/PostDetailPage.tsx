'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  ChevronLeft,
  MoreHorizontal,
  Smile,
  Image as ImageIcon,
  Send,
  Trash2,
  Edit2,
  Check,
  X,
  Volume2,
  VolumeX,
  Flame,
  Award,
  ListFilter,
  Copy,
  AlertTriangle,
  CornerDownRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post, Comment, currentUser } from '@/data/mockData';

interface PostDetailPageProps {
  post: Post;
  onBack: () => void;
  currentUser: any;
  onLikePost: (postId: string) => void;
  onUpdateComments: (postId: string, comments: Comment[]) => void;
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({
  post,
  onBack,
  currentUser,
  onLikePost,
  onUpdateComments
}) => {
  // Stateful states
  const [postComments, setPostComments] = useState<Comment[]>(post.comments);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [postLikes, setPostLikes] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Advanced premium production features
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showEmojiTray, setShowEmojiTray] = useState(false);
  const [showGifDrawer, setShowGifDrawer] = useState(false);

  // Curated lists
  const POPULAR_EMOJIS = ['🔥', '👑', '💬', '❤️', '👏', '😂', '💯', '💀', '👀', '🚀', '🙌', '✨'];
  const MOCK_GIFS = [
    { id: 'gif_1', name: 'Savage Roast 🌶️', url: 'https://media.giphy.com/media/l0HU8V1CHKT6HXkJW/giphy.gif' },
    { id: 'gif_2', name: 'Mind Blown 🤯', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
    { id: 'gif_3', name: 'Savage Clap 👏', url: 'https://media.giphy.com/media/3o7qE1YN7aBOFPRw8E/giphy.gif' },
    { id: 'gif_4', name: 'Web Dev Magic 💻', url: 'https://media.giphy.com/media/L3X9GvK6wKaT8ITdSd/giphy.gif' },
    { id: 'gif_5', name: 'Mic Drop 🎤', url: 'https://media.giphy.com/media/d0SEajbg30GB2/giphy.gif' },
  ];

  // Multiple media simulation list
  const mediaList = [
    post.mediaUrl,
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop'
  ].filter(Boolean) as string[];

  // Sorting
  const [commentsSort, setCommentsSort] = useState<'top' | 'new' | 'trending'>('top');

  // Comment input
  const [commentText, setCommentText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  
  // Stateful Editing
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  
  // Comment Options popover & tap modals
  const [showOptionsCommentId, setShowOptionsCommentId] = useState<string | null>(null);
  const [tappedComment, setTappedComment] = useState<Comment | null>(null);

  // Synced state updates
  useEffect(() => {
    onUpdateComments(post.id, postComments);
  }, [postComments]);

  const handlePostLike = () => {
    if (isLiked) {
      setPostLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setPostLikes(prev => prev + 1);
      setIsLiked(true);
    }
    onLikePost(post.id);
  };

  // Add Comment (Bubbling replies or roots)
  const handlePublishComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
      },
      content: commentText,
      timestamp: '1m',
      likes: 1,
      replies: []
    };

    if (activeReplyId) {
      // Append nested recursively
      const appendReplyRecursively = (list: Comment[]): Comment[] => {
        return list.map(c => {
          if (c.id === activeReplyId) {
            return {
              ...c,
              replies: [newComment, ...(c.replies || [])]
            };
          }
          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: appendReplyRecursively(c.replies)
            };
          }
          return c;
        });
      };
      setPostComments(prev => appendReplyRecursively(prev));
    } else {
      // Root Comment
      setPostComments(prev => [newComment, ...prev]);
    }

    setCommentText('');
    setActiveReplyId(null);
  };

  // Stateful Edit comment
  const handleSaveEdit = (commentId: string) => {
    if (!editingText.trim()) return;
    const editRecursively = (list: Comment[]): Comment[] => {
      return list.map(c => {
        if (c.id === commentId) {
          return { ...c, content: editingText };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: editRecursively(c.replies) };
        }
        return c;
      });
    };
    setPostComments(prev => editRecursively(prev));
    setEditingCommentId(null);
  };

  // Stateful Delete comment
  const handleDeleteComment = (commentId: string) => {
    const deleteRecursively = (list: Comment[]): Comment[] => {
      return list
        .filter(c => c.id !== commentId)
        .map(c => {
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: deleteRecursively(c.replies) };
          }
          return c;
        });
    };
    setPostComments(prev => deleteRecursively(prev));
    setShowOptionsCommentId(null);
  };

  // Stateful Like comment
  const handleLikeComment = (commentId: string) => {
    const isAlreadyLiked = likedCommentIds.has(commentId);
    const newLiked = new Set(likedCommentIds);
    if (isAlreadyLiked) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
    }
    setLikedCommentIds(newLiked);

    const likeRecursively = (list: Comment[]): Comment[] => {
      return list.map(c => {
        if (c.id === commentId) {
          return { ...c, likes: isAlreadyLiked ? Math.max(0, c.likes - 1) : c.likes + 1 };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: likeRecursively(c.replies) };
        }
        return c;
      });
    };
    setPostComments(prev => likeRecursively(prev));
  };

  // Dynamic Popularity styling based on Likes
  const getCommentCardStyles = (likesCount: number) => {
    if (likesCount >= 500) {
      return {
        className: "border border-yellow-500/50 bg-yellow-500/[0.04] shadow-[0_0_15px_rgba(234,179,8,0.12)]",
        badge: "Fan Favorite 👑",
        accentText: "text-yellow-400 font-bold"
      };
    } else if (likesCount >= 100) {
      return {
        className: "border border-orange/45 bg-orange/[0.03] shadow-[0_0_12px_rgba(255,138,0,0.1)]",
        badge: "Hot Roast 🔥",
        accentText: "text-orange font-bold"
      };
    } else if (likesCount >= 50) {
      return {
        className: "border border-pink/35 bg-pink/[0.02] shadow-[0_0_8px_rgba(255,46,147,0.08)]",
        badge: "Pink Star ✨",
        accentText: "text-pink font-bold"
      };
    } else if (likesCount >= 20) {
      return {
        className: "border border-purple/20 bg-purple/[0.02] shadow-[0_0_6px_rgba(124,58,237,0.06)]",
        badge: "Trending ⚡",
        accentText: "text-purple font-bold"
      };
    } else {
      return {
        className: "border border-white/5 bg-white/[0.01]",
        badge: null,
        accentText: "text-gray-text font-bold"
      };
    }
  };

  // Sorting logic
  const getSortedComments = () => {
    const list = [...postComments];
    if (commentsSort === 'new') {
      return list.reverse();
    }
    if (commentsSort === 'trending') {
      return list.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0));
    }
    return list.sort((a, b) => b.likes - a.likes);
  };

  // Helper: Copy Comment Content
  const handleCopyCommentContent = (content: string) => {
    navigator.clipboard.writeText(content);
    alert("Comment copied to clipboard! 📋");
    setTappedComment(null);
  };

  // Recursive Render Comment deck
  const renderPremiumComments = (list: Comment[], depth = 0): React.ReactNode => {
    return list.map((comment) => {
      const isOwner = comment.user.username === currentUser.username;
      const styles = getCommentCardStyles(comment.likes);

      return (
        <div key={comment.id} className="flex flex-col space-y-2 mt-3 select-none relative">
          
          <div className="flex gap-2.5 items-start">
            {/* Avatar */}
            <div className="h-7 w-7 rounded-full overflow-hidden flex-shrink-0 border border-white/10 shadow-inner mt-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={comment.user.avatar} alt="avatar" className="h-full w-full object-cover" />
            </div>

            {/* Comment container with dynamic popularity accents */}
            <div
              onClick={() => setTappedComment(comment)}
              className={`flex-1 min-w-0 rounded-2xl px-3.5 py-2.5 relative group cursor-pointer ${styles.className}`}
            >
              {/* Header commenter info */}
              <div className="flex items-center justify-between gap-1 mb-1.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-white hover:underline block leading-none">
                    {comment.user.displayName}
                  </span>
                  {comment.user.isVerified && (
                    <span className="text-[10px] text-purple font-black">⚡</span>
                  )}
                  <span className="text-[9px] text-gray-text font-bold block ml-1">
                    @{comment.user.username} • {comment.timestamp} ago
                  </span>
                </div>

                {/* Popular comment Badge next to header */}
                {styles.badge && (
                  <span className={`text-[7px] font-black uppercase tracking-wider ${styles.accentText} px-1.8 py-0.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-0.5`}>
                    <span>{styles.badge}</span>
                  </span>
                )}

                {/* Owner Actions menu trigger */}
                {isOwner && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOptionsCommentId(showOptionsCommentId === comment.id ? null : comment.id);
                      }}
                      className="text-gray-text hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer select-none"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>

                    {showOptionsCommentId === comment.id && (
                      <div className="absolute right-0 top-6 z-30 bg-[#12131C] border border-white/15 rounded-xl py-1 shadow-2xl flex flex-col min-w-[80px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCommentId(comment.id);
                            setEditingText(comment.content);
                            setShowOptionsCommentId(null);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.8 text-[10px] font-bold text-gray-text hover:text-white hover:bg-white/5 transition-all cursor-pointer text-left w-full"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComment(comment.id);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.8 text-[10px] font-bold text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer text-left w-full border-t border-white/5"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Text / Stateful input edit blocks */}
              {editingCommentId === comment.id ? (
                <div className="space-y-2 mt-1.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple/50 font-medium"
                    autoFocus
                  />
                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-gray-text hover:text-white"
                    >
                      <X className="h-3 w-3" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-purple text-white text-[9px] font-black uppercase tracking-wider hover:bg-opacity-95"
                    >
                      <Check className="h-3 w-3" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pl-0.5">
                  {comment.content.startsWith('http') && (comment.content.includes('giphy.com') || comment.content.includes('.gif')) ? (
                    <div className="relative max-w-[200px] aspect-[4/3] rounded-xl overflow-hidden border border-white/15 bg-black/30 mt-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] group-hover:border-purple/35 transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={comment.content} alt="gif reaction" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <p className="text-xs text-white/95 leading-relaxed break-words font-medium pr-4">
                      {comment.content}
                    </p>
                  )}
                </div>
              )}

              {/* Outlined Comment Actions */}
              {!editingCommentId && (
                <div className="flex items-center gap-4 mt-2.5 border-t border-white/5 pt-2 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeComment(comment.id);
                    }}
                    className="flex items-center gap-1 text-[10px] text-gray-text hover:text-pink transition-colors cursor-pointer select-none"
                  >
                    <Heart className={`h-3.5 w-3.5 transition-transform duration-200 ${likedCommentIds.has(comment.id) ? 'fill-pink text-pink scale-110' : ''}`} />
                    <span className={likedCommentIds.has(comment.id) ? 'text-pink font-bold' : ''}>{comment.likes}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveReplyId(comment.id === activeReplyId ? null : comment.id);
                    }}
                    className={`flex items-center gap-1 text-[10px] transition-colors cursor-pointer select-none ${activeReplyId === comment.id ? 'text-purple font-bold' : 'text-gray-text hover:text-purple'}`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Reply</span>
                  </motion.button>
                </div>
              )}

            </div>
          </div>

          {/* Sub-reply inline composer */}
          {activeReplyId === comment.id && (
            <div className="pl-6 ml-3.5 mt-2 flex gap-2">
              <input
                type="text"
                placeholder={`Reply to @${comment.user.username}...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-white/5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50"
              />
              <button
                onClick={handlePublishComment}
                className="px-3.5 py-1.5 rounded-xl bg-purple text-white text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setActiveReplyId(null);
                  setCommentText('');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 text-gray-text text-[10px] font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Indented Thread reply lists recursions with clean lines */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="pl-5 border-l border-white/8 space-y-3 mt-2 ml-3.5 relative">
              <div className="absolute left-0 top-0 bottom-4 w-[1px] bg-white/5 pointer-events-none" />
              {renderPremiumComments(comment.replies, depth + 1)}
            </div>
          )}

        </div>
      );
    });
  };

  return (
    <div className="min-h-screen md:min-h-0 bg-background text-white select-none">
      
      {/* 1. INTERACTION TAP MODAL POPUP FOR COMMENTS (Reply, Copy, Share, Report) */}
      <AnimatePresence>
        {tappedComment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTappedComment(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[28px] bg-[#12131C] border border-white/10 p-5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-16 -left-16 h-36 w-36 bg-purple/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-16 -right-16 h-36 w-36 bg-pink/10 rounded-full blur-2xl" />

              <div className="flex justify-between items-center pb-2.5 border-b border-white/5 mb-4 relative z-10">
                <span className="text-[10px] font-black uppercase text-pink tracking-widest block">Roast Quick Actions</span>
                <button onClick={() => setTappedComment(null)} className="text-gray-text hover:text-white">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Text Preview */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 mb-4 relative z-10">
                <p className="text-[11.5px] text-white font-medium italic leading-relaxed">
                  "{tappedComment.content}"
                </p>
                <span className="text-[8.5px] text-gray-text block mt-1.5 font-bold uppercase">
                  @{tappedComment.user.username} • {tappedComment.likes} Likes
                </span>
              </div>

              {/* Action buttons list */}
              <div className="space-y-2 relative z-10">
                <button
                  onClick={() => {
                    setActiveReplyId(tappedComment.id);
                    setTappedComment(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Reply in Thread</span>
                </button>
                
                <button
                  onClick={() => handleCopyCommentContent(tappedComment.content)}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-text hover:text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Roast Text</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://reactverse.app/comment/${tappedComment.id}`);
                    alert("Comment share link copied to clipboard! 🚀");
                    setTappedComment(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-text hover:text-white text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Comment Link</span>
                </button>

                <button
                  onClick={() => {
                    alert("Roast comment reported successfully. Out moderators will evaluate context constraints immediately.");
                    setTappedComment(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:text-red-500 hover:bg-red-500/20 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Report Abuse / Profanity</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN SPLIT RESPONSIVE VIEWPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-6xl mx-auto md:p-4">
        
        {/* ============================================================== */}
        {/* LEFT DECK: Post details (Desktop: sticky / Mobile: standard) */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Header row (Mobile back overlay & user banner) */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5 px-2 relative">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-purple hover:text-white border border-purple/35 hover:bg-purple/10 px-3 py-1.8 rounded-xl transition-all cursor-pointer shadow-md bg-purple/5"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.user.avatar} alt="avatar" className="h-full w-full object-cover" />
              </div>
              <span className="text-[10px] font-black text-white hover:underline cursor-pointer">@{post.user.username}</span>
            </div>
            
            <div className="flex items-center gap-1.5 relative">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg cursor-pointer transition-all active:scale-95 border ${
                  isFollowing 
                    ? 'text-gray-text bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'text-purple bg-purple/5 border-purple/35 hover:bg-purple/15'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowPostMenu(!showPostMenu)}
                  className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-gray-text hover:text-white transition-colors cursor-pointer"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
                
                <AnimatePresence>
                  {showPostMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-8 z-40 bg-[#12131C] border border-white/15 rounded-xl py-1.5 shadow-2xl flex flex-col min-w-[130px] backdrop-blur-md"
                    >
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://reactverse.app/post/${post.id}`);
                          alert("Post link copied to clipboard! 🔗");
                          setShowPostMenu(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-text hover:text-white hover:bg-white/5 transition-all text-left w-full cursor-pointer"
                      >
                        <Share2 className="h-3 w-3 text-purple" />
                        <span>Copy Link</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsSaved(!isSaved);
                          alert(isSaved ? "Removed from saved posts!" : "Post saved successfully! 📂");
                          setShowPostMenu(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-text hover:text-white hover:bg-white/5 transition-all text-left w-full cursor-pointer border-t border-white/5"
                      >
                        <Bookmark className={`h-3 w-3 ${isSaved ? 'text-orange fill-orange' : 'text-gray-text'}`} />
                        <span>{isSaved ? 'Unsave Post' : 'Save Post'}</span>
                      </button>
                      <button
                        onClick={() => {
                          alert("Thank you! This post has been flagged for active engineering verification.");
                          setShowPostMenu(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-all text-left w-full cursor-pointer border-t border-white/5"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        <span>Report Post</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Large Visual Card */}
          <div className="bg-[#12131C] border border-white/5 rounded-3xl p-3 space-y-3.5 relative overflow-visible">
            {post.type === 'image' && mediaList.length > 0 && (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeMediaIndex}
                    src={mediaList[activeMediaIndex]}
                    alt={`media ${activeMediaIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Navigation arrows (only show on hover if multiple media available!) */}
                {mediaList.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveMediaIndex(prev => (prev === 0 ? mediaList.length - 1 : prev - 1))}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveMediaIndex(prev => (prev === mediaList.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer rotate-180"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}

                {/* Dot Pagination indicator bar */}
                {mediaList.length > 1 && (
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-2 py-1 rounded-full border border-white/5 z-10">
                    {mediaList.map((_, idx) => (
                      <span
                        key={idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`h-1.5 w-1.5 rounded-full transition-all cursor-pointer ${
                          idx === activeMediaIndex ? 'bg-purple w-3' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {post.type === 'video' && post.mediaUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                <video src={post.mediaUrl} className="w-full h-full object-cover" autoPlay loop muted={isVideoMuted} />
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="absolute bottom-2.5 right-2.5 p-1 rounded-lg bg-black/60 border border-white/10 text-white"
                >
                  {isVideoMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </button>
              </div>
            )}

            {post.type === 'discord-code' && post.mediaUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/75">
                <pre className="p-3 overflow-x-auto text-[9px] font-mono text-pink/90 leading-4">
                  <code>{post.mediaUrl}</code>
                </pre>
              </div>
            )}

            {/* Title & Caption */}
            <div className="space-y-1 pl-1">
              {post.title && (
                <h2 className="text-sm sm:text-base font-black text-white leading-snug">{post.title}</h2>
              )}
              <p className="text-xs text-gray-text leading-relaxed font-medium">
                <span className="font-extrabold text-white mr-1">@{post.user.username}</span>
                {post.content}
              </p>
            </div>

            {/* Outlined Action icons */}
            <div className="flex justify-between items-center border-t border-white/5 pt-3">
              <div className="flex gap-4">
                <button onClick={handlePostLike} className="flex items-center gap-1 text-[10.5px] font-black text-gray-text hover:text-pink">
                  <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-pink text-pink' : ''}`} />
                  <span className={isLiked ? 'text-pink' : ''}>{postLikes}</span>
                </button>
                <button className="flex items-center gap-1 text-[10.5px] font-black text-gray-text hover:text-purple">
                  <MessageSquare className="h-4.5 w-4.5" />
                  <span>{postComments.length}</span>
                </button>
                <button 
                  onClick={() => alert("Link copied! Share details.")}
                  className="text-gray-text hover:text-cyan-400"
                >
                  <Share2 className="h-4.5 w-4.5" />
                </button>
              </div>

              <button onClick={() => setIsSaved(!isSaved)} className="text-gray-text hover:text-orange">
                <Bookmark className={`h-4.5 w-4.5 ${isSaved ? 'fill-orange text-orange' : ''}`} />
              </button>
            </div>

          </div>

        </div>

        {/* ============================================================== */}
        {/* RIGHT DECK: Scrollable comment thread with sticky sort header */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-[#12131C] border border-white/5 rounded-3xl p-4 min-h-[400px] lg:h-[580px] overflow-hidden relative">
          
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Sticky Sorting bar */}
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5 bg-[#12131C] sticky top-0 z-25 flex-shrink-0">
              <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                <ListFilter className="h-3.5 w-3.5 text-purple" />
                <span>Comments sorting</span>
              </span>
              <div className="flex gap-1 bg-white/5 border border-white/5 rounded-lg p-0.5">
                {[
                  { id: 'top', label: 'Top', icon: Flame },
                  { id: 'new', label: 'New', icon: Clock },
                  { id: 'trending', label: 'Hot', icon: TrendingUp },
                ].map((tab) => {
                  const isActive = commentsSort === tab.id;
                  const IconComponent = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCommentsSort(tab.id as any)}
                      className={`flex items-center gap-0.8 px-2.5 py-1.2 rounded-md text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                        isActive ? 'bg-purple text-white' : 'text-gray-text hover:text-white'
                      }`}
                    >
                      <IconComponent className="h-2.5 w-2.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 custom-scrollbar">
              {postComments.length > 0 ? (
                renderPremiumComments(getSortedComments())
              ) : (
                <div className="py-16 text-center space-y-1.5">
                  <span className="text-2xl block animate-bounce">⚔️</span>
                  <span className="text-[9px] font-black text-orange uppercase tracking-wider block">Lobby Vacant</span>
                  <p className="text-[9.5px] text-gray-text px-12 leading-relaxed">
                    Awaiting savage comment roasts. Be the first to strike and capture the hero slot!
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Sticky Round-pill Comment input composer at bottom */}
          <div className="pt-3.5 border-t border-white/5 bg-[#12131C] flex flex-col gap-2 flex-shrink-0 relative z-20">
            {/* Horizontal inline Emoji Selection Tray */}
            <AnimatePresence>
              {showEmojiTray && (
                <motion.div
                  initial={{ opacity: 0, y: 8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 8, height: 0 }}
                  className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1.5 border border-white/5 rounded-2xl bg-white/[0.02]"
                >
                  {POPULAR_EMOJIS.map((emoji) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setCommentText(prev => prev + emoji)}
                      className="text-lg p-1.2 rounded-lg hover:bg-white/5 transition-all cursor-pointer flex-shrink-0"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Horizontal inline reaction GIF drawer selection */}
            <AnimatePresence>
              {showGifDrawer && (
                <motion.div
                  initial={{ opacity: 0, y: 8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 8, height: 0 }}
                  className="flex flex-col gap-2 p-3 border border-white/5 rounded-2xl bg-white/[0.02] overflow-hidden"
                >
                  <div className="flex justify-between items-center px-0.5">
                    <span className="text-[8px] font-black uppercase text-pink tracking-widest block">Trending Reaction GIFs</span>
                    <span className="text-[8px] font-bold text-gray-text uppercase">Giphy Integration</span>
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
                    {MOCK_GIFS.map((gif) => (
                      <motion.button
                        key={gif.id}
                        type="button"
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          const newComment: Comment = {
                            id: `c_${Date.now()}`,
                            user: {
                              id: currentUser.id,
                              username: currentUser.username,
                              displayName: currentUser.displayName,
                              avatar: currentUser.avatar,
                              isVerified: currentUser.isVerified,
                            },
                            content: gif.url,
                            timestamp: '1m',
                            likes: 1,
                            replies: []
                          };
                          
                          if (activeReplyId) {
                            const appendReplyRecursively = (list: Comment[]): Comment[] => {
                              return list.map(c => {
                                if (c.id === activeReplyId) {
                                  return {
                                    ...c,
                                    replies: [newComment, ...(c.replies || [])]
                                  };
                                }
                                if (c.replies && c.replies.length > 0) {
                                  return {
                                    ...c,
                                    replies: appendReplyRecursively(c.replies)
                                  };
                                }
                                return c;
                              });
                            };
                            setPostComments(prev => appendReplyRecursively(prev));
                          } else {
                            setPostComments(prev => [newComment, ...prev]);
                          }
                          setShowGifDrawer(false);
                        }}
                        className="relative w-24 aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black/40 flex-shrink-0 cursor-pointer shadow-md group text-left"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={gif.url} alt={gif.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/30 to-transparent p-1.5">
                          <span className="text-[7px] font-black text-white/90 truncate block">{gif.name}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handlePublishComment} className="flex gap-2 items-center">
              <div className="flex-1 flex gap-1.5 items-center bg-white/5 border border-white/10 rounded-full px-3.5 py-2.5 focus-within:border-purple/50 focus-within:ring-1 focus-within:ring-purple/20 transition-all">
                
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiTray(!showEmojiTray);
                    setShowGifDrawer(false);
                  }}
                  className={`p-1 rounded-full transition-colors cursor-pointer select-none ${showEmojiTray ? 'text-purple bg-purple/10' : 'text-gray-text hover:text-white hover:bg-white/5'}`}
                >
                  <Smile className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  placeholder={activeReplyId ? "Write a nested reply..." : "Add a comment..."}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white placeholder-gray-text focus:outline-none font-medium"
                />

                <button
                  type="button"
                  onClick={() => {
                    setShowGifDrawer(!showGifDrawer);
                    setShowEmojiTray(false);
                  }}
                  className={`p-1 rounded-full transition-colors cursor-pointer select-none ${showGifDrawer ? 'text-pink bg-pink/10' : 'text-gray-text hover:text-white hover:bg-white/5'}`}
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                type="submit"
                className="h-9.5 w-9.5 rounded-full bg-purple hover:bg-opacity-90 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-md select-none flex-shrink-0"
              >
                <Send className="h-4 w-4 text-white" />
              </motion.button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PostDetailPage;
