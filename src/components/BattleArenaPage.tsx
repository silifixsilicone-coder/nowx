'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Swords,
  Timer,
  Trophy,
  Users,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BattleArenaPageProps {
  onBack?: () => void;
}

export const BattleArenaPage: React.FC<BattleArenaPageProps> = ({ onBack }) => {
  // Live Vote counts
  const [votesVirat, setVotesVirat] = useState(14820);
  const [votesRohit, setVotesRohit] = useState(13240);
  const [hasVoted, setHasVoted] = useState<'virat' | 'rohit' | null>(null);
  
  // Timer State ticking down
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 18 });

  // Mock comments from each camp
  const [viratComments, setViratComments] = useState([
    { id: 'vc1', user: 'neon_rider', text: '76 International centuries and absolute fitness masterclass. King Kohli for a reason! 👑🔥', likes: 452 },
    { id: 'vc2', user: 'rust_ace', text: 'Chase master! When the pressure increases, Virat just scales up. Pure goat behavior! 🐐', likes: 210 }
  ]);

  const [rohitComments, setRohitComments] = useState([
    { id: 'rc1', user: 'tailwind_queen', text: '5 IPL Trophies as captain and three Double Centuries in ODIs. Hitman timing is unmatched! 🎯⚾', likes: 382 },
    { id: 'rc2', user: 'framer_wizard', text: 'His pull shot is the most aesthetic thing in cricket. Pure elegance and effortless sixes! 💯', likes: 198 }
  ]);

  const [newComment, setNewComment] = useState('');
  const [selectedCamp, setSelectedCamp] = useState<'virat' | 'rohit'>('virat');

  // Clock Ticker Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVote = (side: 'virat' | 'rohit') => {
    if (hasVoted) return;
    setHasVoted(side);
    if (side === 'virat') {
      setVotesVirat((prev) => prev + 1);
    } else {
      setVotesRohit((prev) => prev + 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const freshComment = {
      id: `c_${Date.now()}`,
      user: 'RoastMaster_99',
      text: newComment,
      likes: 1,
    };

    if (selectedCamp === 'virat') {
      setViratComments([freshComment, ...viratComments]);
    } else {
      setRohitComments([freshComment, ...rohitComments]);
    }
    setNewComment('');
  };

  // Percentages Calculation
  const totalVotes = votesVirat + votesRohit;
  const pctVirat = Math.round((votesVirat / totalVotes) * 100);
  const pctRohit = 100 - pctVirat;

  // Hype Meter Level calculation (e.g. high heat!)
  const hypeLevel = 94; // Custom cyberpunk hot dial

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none pb-24 md:pb-6">
      
      {/* Top back navigation header bar */}
      {onBack && (
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple hover:text-white border border-purple/35 hover:bg-purple/10 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md bg-purple/5"
          >
            ← Back to Space Feed
          </button>
          <span className="text-[10px] font-black uppercase text-gray-text tracking-widest">
            ReactVerse Arena
          </span>
        </div>
      )}

      {/* 1. Header Banner & Countdown Timer */}
      <div className="glass-effect rounded-[24px] p-5 border border-white/8 relative overflow-hidden bg-gradient-to-tr from-purple/10 to-pink/5">
        <div className="absolute top-0 right-0 h-16 w-16 bg-orange/15 rounded-full blur-md" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange/15 flex items-center justify-center border border-orange/30">
              <Swords className="h-5.5 w-5.5 text-orange animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-orange tracking-widest block">GRAND BATTLE CHAMPIONSHIP</span>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                King Virat vs Hitman Rohit
              </h2>
            </div>
          </div>

          {/* Countdown timer with neon borders */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-4 py-2 rounded-2xl shadow-inner flex-shrink-0">
            <Timer className="h-4 w-4 text-pink animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-[10px] font-black text-gray-text uppercase mr-1">Ends In:</span>
            <span className="text-xs font-mono font-black text-gradient">
              {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Battle Arena Grid (Team Virat vs Team Rohit) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative items-stretch">
        
        {/* Glow VS Logo suspended centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-pink via-purple to-orange text-white text-base font-black shadow-[0_0_20px_rgba(255,46,147,0.7)] border-3 border-[#0B0B12] pointer-events-none animate-pulse">
          VS
        </div>

        {/* Team A: Virat Fans Deck */}
        <motion.div
          whileHover={{ y: -4 }}
          className={`glass-effect-card rounded-3xl p-5 space-y-4 border flex flex-col justify-between ${
            hasVoted === 'virat' ? 'border-purple/60 bg-purple/5 shadow-[0_0_25px_rgba(124,58,237,0.15)]' : 'border-white/5'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">👑</span>
                <div>
                  <span className="text-sm font-black text-white block">King's Army</span>
                  <span className="text-[9px] text-purple font-black block">TEAM VIRAT KOHLI</span>
                </div>
              </div>
              <span className="text-[10px] font-black text-purple">{votesVirat.toLocaleString()} Fans</span>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black/20 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=450&h=300&fit=crop" alt="Virat Kohli Camp" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-3 left-3 text-[10px] font-black text-white uppercase tracking-wider bg-purple/20 border border-purple/35 px-2.5 py-0.8 rounded-lg backdrop-blur-sm">
                Aggression & Passion ⚡
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleVote('virat')}
              disabled={hasVoted !== null}
              className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all shadow-md ${
                hasVoted === 'virat'
                  ? 'bg-purple text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-purple'
                  : hasVoted === 'rohit'
                  ? 'bg-white/5 border border-white/5 text-gray-text opacity-40 cursor-not-allowed'
                  : 'bg-purple/10 border border-purple/35 text-purple hover:bg-purple hover:text-white'
              }`}
            >
              {hasVoted === 'virat' ? 'Voted' : 'Support Virat 👑'}
            </button>
          </div>
        </motion.div>

        {/* Team B: Rohit Fans Deck */}
        <motion.div
          whileHover={{ y: -4 }}
          className={`glass-effect-card rounded-3xl p-5 space-y-4 border flex flex-col justify-between ${
            hasVoted === 'rohit' ? 'border-pink/60 bg-pink/5 shadow-[0_0_25px_rgba(255,46,147,0.15)]' : 'border-white/5'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎯</span>
                <div>
                  <span className="text-sm font-black text-white block">Hitman Clan</span>
                  <span className="text-[9px] text-pink font-black block">TEAM ROHIT SHARMA</span>
                </div>
              </div>
              <span className="text-[10px] font-black text-pink">{votesRohit.toLocaleString()} Fans</span>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black/20 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1540747737956-37872404457a?w=450&h=300&fit=crop" alt="Rohit Sharma Camp" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-3 left-3 text-[10px] font-black text-white uppercase tracking-wider bg-pink/20 border border-pink/35 px-2.5 py-0.8 rounded-lg backdrop-blur-sm">
                Elegance & Timing 🏏
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleVote('rohit')}
              disabled={hasVoted !== null}
              className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all shadow-md ${
                hasVoted === 'rohit'
                  ? 'bg-pink text-white shadow-[0_0_15px_rgba(255,46,147,0.5)] border border-pink'
                  : hasVoted === 'virat'
                  ? 'bg-white/5 border border-white/5 text-gray-text opacity-40 cursor-not-allowed'
                  : 'bg-pink/10 border border-pink/35 text-pink hover:bg-pink hover:text-white'
              }`}
            >
              {hasVoted === 'rohit' ? 'Voted' : 'Support Rohit 🎯'}
            </button>
          </div>
        </motion.div>

      </div>

      {/* 3. Live Voting Percentage progress bar */}
      <div className="glass-effect rounded-2xl p-4 border border-white/5 bg-white/[0.01] space-y-2">
        <div className="flex justify-between items-center text-xs font-black text-white">
          <span className="text-purple uppercase">Virat Army: {pctVirat}%</span>
          <span className="text-pink uppercase">Rohit Clan: {pctRohit}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden flex relative shadow-inner">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${pctVirat}%` }}
            transition={{ type: 'spring', stiffness: 80 }}
            className="h-full bg-purple rounded-l-full shadow-[0_0_10px_rgba(124,58,237,0.7)]"
          />
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${pctRohit}%` }}
            transition={{ type: 'spring', stiffness: 80 }}
            className="h-full bg-pink rounded-r-full shadow-[0_0_10px_rgba(255,46,147,0.7)]"
          />
        </div>
        <span className="text-[9px] text-gray-text block text-center uppercase tracking-widest pt-1">
          📊 Total Votes Logged: {totalVotes.toLocaleString()}
        </span>
      </div>

      {/* 4. Hype Meter (Glowing progress dial temperature) */}
      <div className="glass-effect-card rounded-[24px] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange animate-bounce" />
            <span className="text-xs font-black text-white uppercase tracking-wider">Hype Arena Temperature</span>
          </div>
          <span className="text-[10px] font-black text-orange border border-orange/30 px-2 py-0.5 rounded bg-orange/10">
            SUPER HOT 🔥
          </span>
        </div>
        
        <div className="relative">
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: `${hypeLevel}%` }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-purple via-pink to-orange shadow-[0_0_15px_rgba(255,138,0,0.6)]"
            />
          </div>
          <span className="text-[10px] font-black text-white/90 block mt-2 text-center tracking-wide">
            🔥 {hypeLevel}% Arena Friction! Supporter Hype is peaked at maximum levels.
          </span>
        </div>
      </div>

      {/* 5. Battle Stats & Supporter Leaders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Battle Stats card */}
        <div className="glass-effect rounded-2xl p-4 border border-white/5 bg-white/[0.01] space-y-3 md:col-span-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-text/75">
            Duel Analytics
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
              <Users className="h-4 w-4 text-purple mx-auto mb-1.5" />
              <span className="text-[9px] font-bold text-gray-text block uppercase">Online Fans</span>
              <span className="text-sm font-black text-white">4.2k live</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
              <TrendingUp className="h-4 w-4 text-pink mx-auto mb-1.5" />
              <span className="text-[9px] font-bold text-gray-text block uppercase">Hype Velocity</span>
              <span className="text-sm font-black text-pink">124 votes/m</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center col-span-2 sm:col-span-1">
              <Trophy className="h-4 w-4 text-orange mx-auto mb-1.5" />
              <span className="text-[9px] font-bold text-gray-text block uppercase">Prize Pool</span>
              <span className="text-sm font-black text-orange">+50k points</span>
            </div>
          </div>
        </div>

        {/* Top Supporters Leaders */}
        <div className="glass-effect rounded-2xl p-4 border border-white/5 bg-white/[0.01] space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-text/75">
            Top Hype Donors
          </p>
          
          <div className="space-y-2.5">
            {[
              { rank: 1, user: 'neon_rider', points: '4.2k Hype', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop' },
              { rank: 2, user: 'tailwind_queen', points: '3.8k Hype', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop' },
              { rank: 3, user: 'framer_wizard', points: '2.5k Hype', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop' },
            ].map((donor) => (
              <div key={donor.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-orange">#{donor.rank}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={donor.avatar} alt="supporter" className="h-6 w-6 rounded object-cover border border-white/10" />
                  <span className="text-xs font-bold text-white">@{donor.user}</span>
                </div>
                <span className="text-[9px] font-black text-purple">{donor.points}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Camp Roasts Comments Section */}
      <div className="glass-effect rounded-[24px] p-5 border border-white/5 bg-white/[0.01] space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple" />
            <span className="text-xs font-black text-white uppercase tracking-wider">Camp Fan Roasts</span>
          </div>
          
          {/* Camp filter switcher */}
          <div className="flex gap-2 p-0.5 rounded-xl bg-white/5 border border-white/5">
            <button
              onClick={() => setSelectedCamp('virat')}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer focus:outline-none ${
                selectedCamp === 'virat' ? 'bg-purple text-white shadow-md' : 'text-gray-text hover:text-white'
              }`}
            >
              Virat Camp
            </button>
            <button
              onClick={() => setSelectedCamp('rohit')}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer focus:outline-none ${
                selectedCamp === 'rohit' ? 'bg-pink text-white shadow-md' : 'text-gray-text hover:text-white'
              }`}
            >
              Rohit Camp
            </button>
          </div>
        </div>

        {/* List of custom camp comments */}
        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
          {selectedCamp === 'virat' ? (
            viratComments.map((comm) => (
              <div key={comm.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex gap-3">
                <div className="h-7 w-7 rounded bg-purple/15 flex items-center justify-center text-xs font-black text-purple uppercase">
                  V
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black text-purple">@{comm.user} • Virat Camp</span>
                  <p className="text-xs text-white/95 mt-1 font-medium italic">"{comm.text}"</p>
                </div>
              </div>
            ))
          ) : (
            rohitComments.map((comm) => (
              <div key={comm.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex gap-3">
                <div className="h-7 w-7 rounded bg-pink/15 flex items-center justify-center text-xs font-black text-pink uppercase">
                  R
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black text-pink">@{comm.user} • Rohit Camp</span>
                  <p className="text-xs text-white/95 mt-1 font-medium italic">"{comm.text}"</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment input form */}
        <form onSubmit={handleAddComment} className="flex gap-3 pt-3 border-t border-white/5">
          <input
            type="text"
            placeholder={`Publish a roast supporting ${selectedCamp === 'virat' ? 'Team Virat' : 'Team Rohit'}...`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-text focus:outline-none focus:border-purple/50"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple hover:bg-opacity-95 text-white text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1"
          >
            <span>Roast</span>
            <span>🚀</span>
          </button>
        </form>

      </div>

    </div>
  );
};

export default BattleArenaPage;
