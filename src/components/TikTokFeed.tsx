'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageSquare, Share2, Music, Volume2, VolumeX, Sparkles, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTikTokVideos, TikTokVideo } from '@/data/mockData';

export const TikTokFeed: React.FC = () => {
  const [activeVideoId, setActiveVideoId] = useState(mockTikTokVideos[0].id);
  const [likesState, setLikesState] = useState<Record<string, { count: number; liked: boolean }>>(
    mockTikTokVideos.reduce((acc, video) => {
      acc[video.id] = { count: video.likes, liked: false };
      return acc;
    }, {} as Record<string, { count: number; liked: boolean }>)
  );
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer to track which video is fully in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoId = entry.target.getAttribute('data-video-id');
            if (videoId) {
              setActiveVideoId(videoId);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6, // Fire when 60% of the slide is visible
      }
    );

    const slides = container.querySelectorAll('.tiktok-slide');
    slides.forEach((slide) => observer.observe(slide));

    return () => {
      slides.forEach((slide) => observer.unobserve(slide));
    };
  }, []);

  const handleLike = (videoId: string) => {
    setLikesState((prev) => {
      const current = prev[videoId];
      if (current.liked) {
        return {
          ...prev,
          [videoId]: { count: current.count - 1, liked: false },
        };
      } else {
        return {
          ...prev,
          [videoId]: { count: current.count + 1, liked: true },
        };
      }
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] max-w-md mx-auto bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
      
      {/* Scrollable Snap container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll tiktok-container no-scrollbar"
      >
        {mockTikTokVideos.map((video) => (
          <TikTokVideoSlide
            key={video.id}
            video={video}
            isActive={activeVideoId === video.id}
            isLiked={likesState[video.id].liked}
            likesCount={likesState[video.id].count}
            isMuted={isVideoMuted}
            onLike={() => handleLike(video.id)}
            onMuteToggle={() => setIsVideoMuted(!isVideoMuted)}
          />
        ))}
      </div>

      {/* Floating Sparkle / Quick indicator */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-black/40 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
        <Sparkles className="h-3.5 w-3.5 text-orange animate-pulse" />
        <span className="text-[10px] font-black uppercase text-white tracking-wider">ReactVerse Shorts</span>
      </div>

    </div>
  );
};

interface TikTokVideoSlideProps {
  video: TikTokVideo;
  isActive: boolean;
  isLiked: boolean;
  likesCount: number;
  isMuted: boolean;
  onLike: () => void;
  onMuteToggle: () => void;
}

const TikTokVideoSlide: React.FC<TikTokVideoSlideProps> = ({
  video,
  isActive,
  isLiked,
  likesCount,
  isMuted,
  onLike,
  onMuteToggle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);

  // Play/Pause based on active view observer
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isActive) {
      videoEl.play().catch((err) => console.log('Autoplay blocked:', err));
      setIsPlaying(true);
    } else {
      videoEl.pause();
      videoEl.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleVideoClick = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isPlaying) {
      videoEl.pause();
      setIsPlaying(false);
    } else {
      videoEl.play();
      setIsPlaying(true);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    // Only double click
    if (e.detail === 2) {
      if (!isLiked) {
        onLike();
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
  };

  return (
    <div
      data-video-id={video.id}
      className="tiktok-slide relative w-full h-[calc(100vh-4rem)] flex-shrink-0 bg-[#060608]"
    >
      {/* Video Player */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        loop
        muted={isMuted}
        playsInline
        onClick={handleVideoClick}
        onMouseDown={handleDoubleTap}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Heart Pop Animation */}
      <AnimatePresence>
        {showHeartPop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.3, 0.9, 1], opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 m-auto flex h-24 w-24 items-center justify-center pointer-events-none z-30"
          >
            <Heart className="h-24 w-24 fill-pink text-pink filter drop-shadow-[0_0_20px_rgba(255,46,147,0.8)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark vignette layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/45 pointer-events-none" />

      {/* Floating Pause icon indicator if paused */}
      {!isPlaying && (
        <div className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/50 text-white pointer-events-none backdrop-blur-sm z-15">
          <Play className="h-8 w-8 fill-white ml-1" />
        </div>
      )}

      {/* Bottom Caption and description area */}
      <div className="absolute bottom-6 left-4 right-16 text-white z-10 space-y-3 pointer-events-none">
        
        {/* User identification */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="h-9 w-9 rounded-full overflow-hidden border border-purple">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.user.avatar}
              alt={video.user.displayName}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold block">{video.user.displayName}</span>
              <span className="text-[10px] text-purple">⚡</span>
            </div>
            <span className="text-[10px] text-gray-text block">@{video.user.username}</span>
          </div>
        </div>

        {/* Video text caption */}
        <p className="text-xs text-white/95 leading-relaxed font-normal">
          {video.caption}
        </p>

        {/* Scrolling audio ticker (analogous to TikTok vinyl track) */}
        <div className="flex items-center gap-2">
          <Music className="h-3.5 w-3.5 text-orange animate-bounce" />
          <div className="overflow-hidden w-40 text-[10px] font-bold text-gray-text">
            <motion.div
              animate={{ x: ['100%', '-100%'] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="whitespace-nowrap"
            >
              {video.musicName}
            </motion.div>
          </div>
        </div>

      </div>

      {/* Right Side Interaction Panel (TikTok core icons) */}
      <div className="absolute bottom-20 right-4 flex flex-col items-center gap-5 z-20">
        
        {/* Profile follow overlay */}
        <div className="relative">
          <div className="h-11 w-11 rounded-full overflow-hidden border border-white p-0.5 bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.user.avatar}
              alt="Author"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-purple text-[8px] font-black rounded-full px-1.5 py-0.2 border border-white">
            +
          </span>
        </div>

        {/* Like Button */}
        <button
          onClick={onLike}
          className="flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
        >
          <motion.div
            whileTap={{ scale: 0.7 }}
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/40 border border-white/5 text-white hover:bg-black/60 transition-all ${
              isLiked ? 'bg-pink/10 border-pink/30 text-pink' : ''
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-pink text-pink filter drop-shadow-[0_0_8px_rgba(255,46,147,0.5)]' : ''}`} />
          </motion.div>
          <span className="text-[10px] font-black text-white">
            {(likesCount / 1000).toFixed(1)}k
          </span>
        </button>

        {/* Comments Button */}
        <button className="flex flex-col items-center gap-1 cursor-pointer focus:outline-none">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 border border-white/5 text-white hover:bg-black/60 transition-colors">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black text-white">{video.comments}</span>
        </button>

        {/* Share Button */}
        <button className="flex flex-col items-center gap-1 cursor-pointer focus:outline-none">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 border border-white/5 text-white hover:bg-black/60 transition-colors">
            <Share2 className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-black text-white">{video.shares}</span>
        </button>

        {/* Video mute icon */}
        <button
          onClick={onMuteToggle}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
        </button>

        {/* Rotating Vinyl Record Indicator */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="h-9 w-9 rounded-full bg-gradient-to-tr from-pink via-purple to-orange p-[1.5px] shadow-lg shadow-purple/10"
        >
          <div className="h-full w-full rounded-full bg-black overflow-hidden border border-black/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.user.avatar}
              alt="Rotating Vinyl"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

      </div>

    </div>
  );
};

export default TikTokFeed;
