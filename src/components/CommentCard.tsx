'use client';

import React, { useState } from 'react';
import { Heart, Reply } from 'lucide-react';
import { Comment } from '@/data/mockData';

interface CommentCardProps {
  comment: Comment;
  depth?: number;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment, depth = 0 }) => {
  const [likes, setLikes] = useState(comment.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex gap-3">
        
        {/* Avatar */}
        <div className="h-7 w-7 rounded-lg overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={comment.user.avatar}
            alt={comment.user.displayName}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Comment block */}
        <div className="flex-1 min-w-0 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2">
          
          {/* User header info */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-xs font-bold text-white hover:underline cursor-pointer">
              {comment.user.displayName}
            </span>
            {comment.user.isVerified && (
              <span className="text-[10px] text-purple">⚡</span>
            )}
            <span className="text-[9px] text-gray-text">
              @{comment.user.username} • {comment.timestamp}
            </span>
          </div>

          {/* Comment text */}
          <p className="text-xs text-white/90 leading-relaxed break-words">
            {comment.content}
          </p>

          {/* Comment actions row */}
          <div className="flex items-center gap-4 mt-2 border-t border-white/5 pt-1.5">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-[10px] text-gray-text hover:text-pink transition-colors cursor-pointer"
            >
              <Heart className={`h-3 w-3 ${isLiked ? 'fill-pink text-pink' : ''}`} />
              <span className={isLiked ? 'text-pink font-bold' : ''}>{likes}</span>
            </button>
            <button className="flex items-center gap-1 text-[10px] text-gray-text hover:text-purple transition-colors cursor-pointer">
              <Reply className="h-3 w-3" />
              <span>Reply</span>
            </button>
          </div>

        </div>
      </div>

      {/* Nested replies list rendering recursively */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-6 border-l border-white/10 space-y-3 mt-2 ml-3.5">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}

    </div>
  );
};

export default CommentCard;
