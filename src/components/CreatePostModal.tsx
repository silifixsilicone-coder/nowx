'use client';

import React, { useState } from 'react';
import { X, Sparkles, Code, Image as ImageIcon, Type, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { Post, currentUser } from '@/data/mockData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Post) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [postType, setPostType] = useState<'text' | 'image' | 'discord-code'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [community, setCommunity] = useState('r/general');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const newPost: Post = {
      id: `post_${Date.now()}`,
      user: currentUser,
      type: postType,
      title: title ? title : undefined,
      content: content,
      mediaUrl: mediaUrl ? mediaUrl : undefined,
      likes: 1,
      upvotes: 1,
      downvotes: 0,
      commentsCount: 0,
      comments: [],
      community: community ? community : undefined,
      tags: tags,
      isLiked: true,
      voteStatus: 'upvoted',
    };

    onSubmit(newPost);
    // Reset values
    setTitle('');
    setContent('');
    setMediaUrl('');
    setTagsInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Card content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-lg rounded-3xl glass-effect-card p-6 shadow-2xl border border-white/10 z-10 overflow-hidden"
      >
        
        {/* Glow lights behind */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-pink/20 blur-3xl" />

        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange" />
            <h3 className="text-base font-extrabold text-white tracking-wide">
              Create Space Post
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-text hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* Post format toggles */}
          <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/5">
            <button
              type="button"
              onClick={() => setPostType('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer focus:outline-none ${
                postType === 'text' ? 'bg-purple/20 text-purple' : 'text-gray-text hover:text-white'
              }`}
            >
              <Type className="h-4 w-4" />
              <span>Text</span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('image')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer focus:outline-none ${
                postType === 'image' ? 'bg-purple/20 text-purple' : 'text-gray-text hover:text-white'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Visual Link</span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('discord-code')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer focus:outline-none ${
                postType === 'discord-code' ? 'bg-purple/20 text-purple' : 'text-gray-text hover:text-white'
              }`}
            >
              <Code className="h-4 w-4" />
              <span>Code Snippet</span>
            </button>
          </div>

          {/* Destination community list input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-text uppercase block mb-1">
                Post Target Space
              </label>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple/50"
              >
                <option value="r/general">r/general-chat</option>
                <option value="r/nextjs">r/nextjs</option>
                <option value="r/tailwind">r/tailwind</option>
                <option value="r/digitalart">r/digitalart</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-text uppercase block mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="react, frontend, dev"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20"
              />
            </div>
          </div>

          {/* Optional Title input */}
          <div>
            <label className="text-[10px] font-bold text-gray-text uppercase block mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Give your thoughts a trending headline..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20"
            />
          </div>

          {/* Main Content text block */}
          <div>
            <label className="text-[10px] font-bold text-gray-text uppercase block mb-1">
              Content body
            </label>
            <textarea
              placeholder={
                postType === 'discord-code'
                  ? 'Paste your cool functional components, typescript scripts or code algorithms here...'
                  : 'What\'s happening inside your React project today? Write it down...'
              }
              value={content}
              rows={4}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20 font-sans leading-relaxed resize-none custom-scrollbar"
            />
          </div>

          {/* Direct Visual link input conditional */}
          {postType === 'image' && (
            <div>
              <label className="text-[10px] font-bold text-gray-text uppercase block mb-1">
                Visual Image Direct Link (URL)
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20"
              />
              <span className="text-[9px] text-gray-text block mt-1">
                Paste absolute web URLs of custom visuals or Unsplash tags to render in Feed Cards.
              </span>
            </div>
          )}

          {/* Modal bottom action button row */}
          <div className="flex gap-3 justify-end pt-2 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="glow"
              size="sm"
              className="px-5 py-2 flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Publish Post</span>
            </Button>
          </div>

        </form>

      </motion.div>
    </div>
  );
};

export default CreatePostModal;
