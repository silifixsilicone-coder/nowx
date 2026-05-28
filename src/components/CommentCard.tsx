'use client';

import React, { useState } from 'react';
import { Heart, Reply, MoreHorizontal, Edit2, Trash2, Check, X } from 'lucide-react';
import { Comment } from '@/data/mockData';

interface CommentCardProps {
  comment: Comment;
  depth?: number;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  depth = 0,
  onEdit,
  onDelete
}) => {
  const [likes, setLikes] = useState(comment.likes);
  const [isLiked, setIsLiked] = useState(false);

  // Stateful Edit & Options Menu
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [showOptions, setShowOptions] = useState(false);

  const isOwner = comment.user.username === 'RoastMaster_99'; // Matches currentUser in mock data

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    if (onEdit) {
      onEdit(comment.id, editValue);
    }
    setIsEditing(false);
    setShowOptions(false);
  };

  const handleCancelEdit = () => {
    setEditValue(comment.content);
    setIsEditing(false);
    setShowOptions(false);
  };

  return (
    <div className="flex flex-col space-y-1.5 font-sans">
      <div className="flex gap-2.5 items-start">
        
        {/* Rounded Avatar Threads style */}
        <div className="h-7 w-7 rounded-full overflow-hidden flex-shrink-0 border border-white/10 shadow-inner mt-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={comment.user.avatar}
            alt={comment.user.displayName}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Comment Content Block */}
        <div className="flex-1 min-w-0 bg-[#12131C]/60 border border-white/5 rounded-2xl px-3.5 py-2.5 relative group">
          
          {/* Header Row */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white hover:underline cursor-pointer block leading-none">
                {comment.user.displayName}
              </span>
              {comment.user.isVerified && (
                <span className="text-[10px] text-purple font-black">⚡</span>
              )}
              <span className="text-[9.5px] text-gray-text font-bold block ml-1">
                @{comment.user.username} • {comment.timestamp}
              </span>
            </div>

            {/* Owner Actions Menu (Three-dot options) */}
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-gray-text hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer select-none"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>

                {showOptions && (
                  <div className="absolute right-0 top-6 z-30 bg-[#12131C] border border-white/15 rounded-xl py-1 shadow-2xl flex flex-col min-w-[80px]">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.8 text-[10px] font-bold text-gray-text hover:text-white hover:bg-white/5 transition-all cursor-pointer text-left w-full"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (onDelete) onDelete(comment.id);
                        setShowOptions(false);
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

          {/* Comment Body / Edit Input Field */}
          {isEditing ? (
            <div className="space-y-2 mt-1.5">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple/50"
                autoFocus
              />
              <div className="flex gap-1.5 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-gray-text hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-purple text-white text-[9px] font-black uppercase tracking-wider hover:bg-opacity-95 transition-colors cursor-pointer"
                >
                  <Check className="h-3 w-3" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/95 leading-relaxed break-words font-medium pr-4">
              {comment.content}
            </p>
          )}

          {/* Outlined Comment Actions Row */}
          {!isEditing && (
            <div className="flex items-center gap-4 mt-2.5 border-t border-white/5 pt-2">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-[10.5px] text-gray-text hover:text-pink transition-colors cursor-pointer select-none"
              >
                <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-pink text-pink' : ''}`} />
                <span className={isLiked ? 'text-pink font-bold' : ''}>{likes}</span>
              </button>
              <button className="flex items-center gap-1 text-[10.5px] text-gray-text hover:text-purple transition-colors cursor-pointer select-none">
                <Reply className="h-3.5 w-3.5" />
                <span>Reply</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Recursive replies support */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-6 border-l border-white/8 space-y-3 mt-2 ml-3.5">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default CommentCard;
