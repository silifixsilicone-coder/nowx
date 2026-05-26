'use client';

import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Search, 
  Bell, 
  Flame, 
  TrendingUp, 
  Timer, 
  MessageSquare, 
  Trophy,
  Plus,
  Compass,
  Home,
  User,
  Zap,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Battle {
  id: string;
  title: string;
  category: string;
  player1: { name: string; image: string; votes: number };
  player2: { name: string; image: string; votes: number };
  totalVotes: number;
  topComment: { user: string; text: string; Camp: string };
  timeLeft: { hours: number; minutes: number; seconds: number };
  isLive: boolean;
  statusTag: 'Live 🔴' | 'Trending 🔥' | 'Upcoming ⏳' | 'Savage 💀' | 'Hyped ⚡';
  hypeLevel: number;
}

interface BattleFeedPageProps {
  onJoinBattle: (battleId: string) => void;
  onViewChange?: (view: string) => void;
}

export const BattleFeedPage: React.FC<BattleFeedPageProps> = ({ onJoinBattle, onViewChange }) => {
  const [activeTab, setActiveTab] = useState('All ⚔️');
  const [searchQuery, setSearchQuery] = useState('');
  const [remindedBattles, setRemindedBattles] = useState<string[]>([]);

  // CURATED LIST OF LIVE & TRENDING SOCIAL BATTLES
  const [battles, setBattles] = useState<Battle[]>([
    {
      id: 'virat_rohit',
      title: 'King Virat Kohli vs Hitman Rohit Sharma',
      category: 'Cricket 🏏',
      player1: { name: 'Virat Fans 👑', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=200&h=200&fit=crop', votes: 14820 },
      player2: { name: 'Rohit Fans 🎯', image: 'https://images.unsplash.com/photo-1540747737956-37872404457a?w=200&h=200&fit=crop', votes: 13240 },
      totalVotes: 28060,
      topComment: { user: 'neon_rider', text: '76 International centuries and absolute fitness masterclass. King Kohli for a reason! 👑🔥', Camp: 'Virat Camp' },
      timeLeft: { hours: 14, minutes: 42, seconds: 18 },
      isLive: true,
      statusTag: 'Live 🔴',
      hypeLevel: 94
    },
    {
      id: 'marvel_dc',
      title: 'Marvel MCU vs DC Universe Storytelling',
      category: 'Movies 🎬',
      player1: { name: 'Marvel Cinematic 🦸‍♂️', image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=200&h=200&fit=crop', votes: 8940 },
      player2: { name: 'DC Dark Universe 🦇', image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=200&h=200&fit=crop', votes: 9410 },
      totalVotes: 18350,
      topComment: { user: 'framer_wizard', text: 'Nolans Dark Knight trilogy alone wipes out the entire MCU. Pure cinema and depth! 🦇💯', Camp: 'DC Camp' },
      timeLeft: { hours: 6, minutes: 12, seconds: 45 },
      isLive: true,
      statusTag: 'Trending 🔥',
      hypeLevel: 88
    },
    {
      id: 'next_remix',
      title: 'Next.js 16 Turbopack vs Remix Vite Engine',
      category: 'AI Battles/Fan Wars ⚔️',
      player1: { name: 'Next.js Turbo ⚛️', image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=200&h=200&fit=crop', votes: 12100 },
      player2: { name: 'Remix Loader 💿', image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=200&h=200&fit=crop', votes: 6450 },
      totalVotes: 18550,
      topComment: { user: 'rust_ace', text: 'Next.js zero config CSS theme-vars and Turbopack hot-reload is absolute wizardry! 🚀🎨', Camp: 'Next Camp' },
      timeLeft: { hours: 22, minutes: 9, seconds: 3 },
      isLive: true,
      statusTag: 'Hyped ⚡',
      hypeLevel: 96
    },
    {
      id: 'ai_dev',
      title: 'AI Coding Agent vs Senior Software Architect',
      category: 'AI Battles 🤖',
      player1: { name: 'Antigravity AI 🤖', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop', votes: 0 },
      player2: { name: 'Full-Stack Dev 👨‍💻', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop', votes: 0 },
      totalVotes: 0,
      topComment: { user: 'system_bot', text: 'Battle starts in 4 hours. Stakes: 100k React Points pool! Who writes the clean code fastest?', Camp: 'Dev Camp' },
      timeLeft: { hours: 3, minutes: 59, seconds: 59 },
      isLive: false,
      statusTag: 'Upcoming ⏳',
      hypeLevel: 75
    },
    {
      id: 'meme_doge',
      title: 'Dogecoin Memes vs Shiba Inu Roasts',
      category: 'Meme Battles 😂',
      player1: { name: 'Doge Army 🐕', image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=200&h=200&fit=crop', votes: 7800 },
      player2: { name: 'Shiba Clan 🦊', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&h=200&fit=crop', votes: 9810 },
      totalVotes: 17610,
      topComment: { user: 'tailwind_queen', text: 'Shiba Inu utilities are pure comedy. Doge holding the OG crown forever! 😂🐕', Camp: 'Doge Camp' },
      timeLeft: { hours: 1, minutes: 4, seconds: 12 },
      isLive: true,
      statusTag: 'Savage 💀',
      hypeLevel: 91
    }
  ]);

  // Tick down all timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setBattles((prevBattles) =>
        prevBattles.map((battle) => {
          const t = battle.timeLeft;
          if (t.seconds > 0) {
            return { ...battle, timeLeft: { ...t, seconds: t.seconds - 1 } };
          } else if (t.minutes > 0) {
            return { ...battle, timeLeft: { ...t, minutes: t.minutes - 1, seconds: 59 } };
          } else if (t.hours > 0) {
            return { ...battle, timeLeft: { hours: t.hours - 1, minutes: 59, seconds: 59 } };
          }
          return battle;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleReminderToggle = (id: string) => {
    if (remindedBattles.includes(id)) {
      setRemindedBattles(remindedBattles.filter((item) => item !== id));
    } else {
      setRemindedBattles([...remindedBattles, id]);
      alert('Reminder Set! We will ping you as soon as this AI duel starts.');
    }
  };

  const categories = [
    { id: 'All ⚔️', label: 'All Arena' },
    { id: 'Live 🔴', label: 'Live 🔴' },
    { id: 'Trending 🔥', label: 'Trending 🔥' },
    { id: 'Cricket 🏏', label: 'Cricket 🏏' },
    { id: 'Movies 🎬', label: 'Movies 🎬' },
    { id: 'Meme Battles 😂', label: 'Meme Battles 😂' },
    { id: 'Fan Wars ⚔️', label: 'Fan Wars ⚔️' },
    { id: 'AI Battles 🤖', label: 'AI Battles 🤖' }
  ];

  // Filtering Logic
  const filteredBattles = battles.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'All ⚔️') return matchesSearch;
    if (activeTab === 'Live 🔴') return b.isLive && matchesSearch;
    if (activeTab === 'Trending 🔥') return b.statusTag === 'Trending 🔥' && matchesSearch;
    return b.category === activeTab && matchesSearch;
  });

  // Curated Side widgets metrics
  const savageBattle = battles.find(b => b.statusTag === 'Savage 💀') || battles[4];
  const hypedBattle = battles.find(b => b.statusTag === 'Hyped ⚡') || battles[2];
  const upcomingBattle = battles.find(b => b.statusTag === 'Upcoming ⏳') || battles[3];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 md:pb-6 select-none font-sans">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple/15 flex items-center justify-center border border-purple/35 shadow-[0_0_12px_rgba(124,58,237,0.25)]">
            <Swords className="h-5.5 w-5.5 text-purple animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-purple tracking-widest block">CREATOR DUELS</span>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-wide">
              ReactVerse Battle Arena
            </h1>
          </div>
        </div>

        {/* Action icons bar */}
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search active duels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-text w-48 focus:outline-none focus:border-purple/50 focus:w-56 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-text" />
          </div>
          
          <button 
            onClick={() => alert('No new match notification updates.')}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-text hover:text-white hover:bg-white/10 transition-all cursor-pointer relative"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-pink" />
          </button>
        </div>
      </div>

      {/* 2. HORIZONTAL SCROLL CATEGORY TAB BAR */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 border-b border-white/5">
        {categories.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-purple text-white shadow-[0_0_15px_rgba(124,58,237,0.45)] border border-purple'
                  : 'bg-white/5 border border-white/5 text-gray-text hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid split layout: Center Feed Column + Right side widgets bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* --- LEFT / CENTER FEED COLUMN (Battles Deck Loop) --- */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          
          {filteredBattles.map((battle) => {
            // Percentages Calculation
            const isVoted = battle.totalVotes > 0;
            const pctA = isVoted ? Math.round((battle.player1.votes / battle.totalVotes) * 100) : 50;
            const pctB = isVoted ? 100 - pctA : 50;

            return (
              <div
                key={battle.id}
                className="glass-effect rounded-[28px] border border-white/8 p-5 relative overflow-hidden transition-all duration-300 hover:border-purple/35 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
              >
                {/* Floating absolute accent tags (Live, Trending, Savage, etc.) */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                  <span className="text-[10px] font-black text-white/90 bg-black/60 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple to-pink animate-pulse" />
                    {battle.category}
                  </span>
                  
                  <span 
                    className={`text-[10px] font-black text-white px-3 py-1 rounded-full border shadow-md uppercase tracking-wider ${
                      battle.statusTag === 'Live 🔴' ? 'bg-red-600/20 border-red-500/50 shadow-red-500/20 animate-pulse' :
                      battle.statusTag === 'Trending 🔥' ? 'bg-orange/20 border-orange/50 shadow-orange/20' :
                      battle.statusTag === 'Hyped ⚡' ? 'bg-purple/20 border-purple/50 shadow-purple/20' :
                      battle.statusTag === 'Savage 💀' ? 'bg-pink/20 border-pink/50 shadow-pink/20' :
                      'bg-white/10 border-white/20'
                    }`}
                  >
                    {battle.statusTag}
                  </span>
                </div>

                {/* Main Visual Arena Display (Dual image split + Center VS bubble) */}
                <div className="grid grid-cols-11 items-center gap-2 pt-6">
                  
                  {/* Player 1 Card */}
                  <div className="col-span-5 text-center space-y-2">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black/20 shadow-inner group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={battle.player1.image} alt={battle.player1.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 inset-x-2 text-[9px] sm:text-[10px] font-black text-white truncate">
                        {battle.player1.name}
                      </span>
                    </div>
                  </div>

                  {/* VS Indicator */}
                  <div className="col-span-1 flex justify-center z-10">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple via-pink to-orange flex items-center justify-center text-[10px] font-black text-white border-2 border-[#12131C] shadow-[0_0_12px_rgba(255,46,147,0.6)]">
                      VS
                    </div>
                  </div>

                  {/* Player 2 Card */}
                  <div className="col-span-5 text-center space-y-2">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black/20 shadow-inner group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={battle.player2.image} alt={battle.player2.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 inset-x-2 text-[9px] sm:text-[10px] font-black text-white truncate">
                        {battle.player2.name}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Title and stats bar */}
                <div className="mt-5 space-y-3">
                  <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
                    {battle.title}
                  </h3>

                  {/* Stateful split voting line ratios (if live) */}
                  {battle.isLive ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-black text-white uppercase">
                        <span className="text-purple">Team A: {pctA}%</span>
                        <span className="text-pink">Team B: {pctB}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden flex relative p-[0.5px]">
                        <div 
                          className="h-full bg-purple rounded-l-full shadow-[0_0_8px_rgba(124,58,237,0.5)] transition-all duration-500"
                          style={{ width: `${pctA}%` }}
                        />
                        <div 
                          className="h-full bg-pink rounded-r-full shadow-[0_0_8px_rgba(255,46,147,0.5)] transition-all duration-500"
                          style={{ width: `${pctB}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[8px] text-gray-text font-extrabold uppercase tracking-wider pt-0.5">
                        <span>📊 Total: {battle.totalVotes.toLocaleString()} Votes</span>
                        <span className="flex items-center gap-1">
                          <Timer className="h-3 w-3 text-orange" />
                          <span>Ends: {battle.timeLeft.hours}h : {battle.timeLeft.minutes}m : {battle.timeLeft.seconds}s</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-[9px] font-black text-orange uppercase tracking-widest flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-orange animate-ping" />
                        Battle Commencing Soon
                      </span>
                      <span className="text-[9px] font-mono text-white/90">
                        ⚡ Opens in: {battle.timeLeft.hours}h : {battle.timeLeft.minutes}m : {battle.timeLeft.seconds}s
                      </span>
                    </div>
                  )}

                  {/* Highlights/Top comment preview block */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex gap-2.5 items-start">
                    <MessageSquare className="h-4 w-4 text-purple flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-black text-purple uppercase">@{battle.topComment.user} • {battle.topComment.Camp}</span>
                      <p className="text-[11px] text-white/85 leading-normal mt-0.5 font-medium italic">
                        "{battle.topComment.text}"
                      </p>
                    </div>
                  </div>

                  {/* Action row button */}
                  <div className="flex gap-2 pt-2 border-t border-white/5 mt-3">
                    {battle.isLive ? (
                      <button
                        onClick={() => onJoinBattle(battle.id)}
                        className="flex-1 py-3 bg-gradient-to-r from-purple via-pink to-orange rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer text-center text-white hover:shadow-[0_0_15px_rgba(255,46,147,0.5)] transition-all duration-300"
                        style={{
                          boxShadow: "inset 0 0 8px rgba(255,255,255,0.2)"
                        }}
                      >
                        Enter Arena & Vote ⚔️
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReminderToggle(battle.id)}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer text-center transition-all duration-200 border ${
                          remindedBattles.includes(battle.id)
                            ? 'bg-orange/20 border-orange/45 text-orange'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                      >
                        {remindedBattles.includes(battle.id) ? 'Reminder Subscribed 🔔' : 'Remind Me of Battle 🔔'}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}

          {filteredBattles.length === 0 && (
            <div className="text-center py-16 glass-effect rounded-[28px] border border-white/5 space-y-2">
              <span className="text-3xl block">👾</span>
              <span className="text-xs text-gray-text font-black uppercase tracking-wider block">No matching active battles found.</span>
              <span className="text-[10px] text-gray-text/75 block">Try clearing search values or active tab selections!</span>
            </div>
          )}

        </div>

        {/* --- RIGHT SIDEBAR COLUMN: TRENDING DUELS (Desktop only) --- */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          
          {/* A. Top Savage highlight card */}
          <div className="glass-effect-card rounded-3xl p-5 border border-pink/35 shadow-[0_0_15px_rgba(255,46,147,0.06)] space-y-3 relative overflow-hidden">
            {/* Glow lights */}
            <div className="absolute top-0 right-0 h-10 w-10 bg-pink/15 rounded-full blur-md" />
            
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <span className="text-xs">💀</span>
              <span className="text-[10px] font-black text-pink uppercase tracking-widest">Most Savage Duel</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-white hover:underline cursor-pointer" onClick={() => onJoinBattle(savageBattle.id)}>
                {savageBattle.title}
              </h4>
              <div className="flex gap-2 items-center">
                <span className="text-[9px] text-gray-text font-extrabold uppercase">🔥 {savageBattle.hypeLevel}% Hype Friction</span>
                <span className="h-1.5 w-1.5 rounded-full bg-pink animate-pulse" />
              </div>
              <div className="p-2 rounded-xl bg-pink/5 border border-pink/20 text-[10px] italic text-pink/80 font-medium">
                "{savageBattle.topComment.text}"
              </div>
            </div>
          </div>

          {/* B. Most Hyped widget panel */}
          <div className="glass-effect rounded-[24px] p-5 border border-purple/35 shadow-[0_0_15px_rgba(124,58,237,0.06)] space-y-3 bg-white/[0.01]">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Zap className="h-4 w-4 text-purple animate-bounce" />
              <span className="text-[10px] font-black text-purple uppercase tracking-widest">Most Hyped Battle</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-white hover:underline cursor-pointer" onClick={() => onJoinBattle(hypedBattle.id)}>
                {hypedBattle.title}
              </h4>
              <div className="flex items-center justify-between text-[9px] text-gray-text font-bold">
                <span>🔥 Level: {hypedBattle.hypeLevel}%</span>
                <span>📈 {hypedBattle.totalVotes.toLocaleString()} votes logged</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple" style={{ width: `${hypedBattle.hypeLevel}%` }} />
              </div>
            </div>
          </div>

          {/* C. Upcoming battles widgets list */}
          <div className="glass-effect rounded-[24px] p-5 border border-white/5 space-y-3 bg-white/[0.01]">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Trophy className="h-4 w-4 text-orange" />
              <span className="text-[10px] font-black text-orange uppercase tracking-widest">Upcoming Duels Today</span>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-black text-white">
                  <span>{upcomingBattle.title}</span>
                </div>
                <div className="flex items-center justify-between text-[8px] text-gray-text font-bold uppercase">
                  <span>🤖 AI vs Human</span>
                  <span>⏳ starts in 4 hours</span>
                </div>
                <button
                  onClick={() => handleReminderToggle(upcomingBattle.id)}
                  className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                    remindedBattles.includes(upcomingBattle.id)
                      ? 'bg-orange/20 border-orange/45 text-orange'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {remindedBattles.includes(upcomingBattle.id) ? 'Reminder Pinned 🔔' : 'Subscribe to Battle 🔔'}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default BattleFeedPage;
