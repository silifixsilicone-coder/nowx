'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Hash,
  Volume2,
  Send,
  Users,
  Smile,
  Mic,
  MicOff,
  Headphones,
  PhoneOff,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  mockDiscordServers,
  mockDiscordChats,
  currentUser,
  mockUsers,
  ChatMessage
} from '@/data/mockData';

interface DiscordChatProps {
  serverId?: string;
}

export const DiscordChat: React.FC<DiscordChatProps> = ({
  serverId = 'server_react',
}) => {
  const activeServer = mockDiscordServers.find((s) => s.id === serverId) || mockDiscordServers[0];
  const [activeChannelId, setActiveChannelId] = useState(activeServer.channels[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showMemberBar, setShowMemberBar] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync server change with channel selection
  useEffect(() => {
    setActiveChannelId(activeServer.channels[0].id);
  }, [activeServer]);

  // Load chat messages based on channel change
  useEffect(() => {
    const defaultChat = mockDiscordChats[activeChannelId] || [];
    setMessages(defaultChat);
  }, [activeChannelId]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatar: currentUser.avatar,
      },
      content: inputText,
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        
        const existingReactions = msg.reactions || [];
        const match = existingReactions.find((r) => r.emoji === emoji);

        if (match) {
          return {
            ...msg,
            reactions: existingReactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            ),
          };
        } else {
          return {
            ...msg,
            reactions: [...existingReactions, { emoji, count: 1, users: [currentUser.id] }],
          };
        }
      })
    );
  };

  const handleChannelSelect = (channel: any) => {
    if (channel.type === 'voice') {
      setIsVoiceConnected(true);
    } else {
      setActiveChannelId(channel.id);
    }
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] w-full rounded-3xl overflow-hidden bg-[#0F0F16] border border-white/5 shadow-2xl">
      
      {/* Channels column (Discord Channel List) */}
      <div className="w-56 bg-[#0B0B11] border-r border-white/5 flex flex-col justify-between select-none">
        
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-4 custom-scrollbar">
          
          {/* Server header */}
          <div className="px-2 pb-2 border-b border-white/5 flex items-center justify-between mb-2">
            <span className="text-sm font-black text-white truncate">
              {activeServer.name}
            </span>
            <span className="text-[10px] text-purple">🟢 Live</span>
          </div>

          {/* Text Channels list */}
          <div className="space-y-1">
            <p className="px-2 text-[9px] font-black uppercase tracking-widest text-gray-text/60">
              Text Channels
            </p>
            {activeServer.channels
              .filter((c) => c.type === 'text')
              .map((chan) => {
                const isActive = activeChannelId === chan.id;
                return (
                  <button
                    key={chan.id}
                    onClick={() => handleChannelSelect(chan)}
                    className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple/15 text-white border-l-2 border-purple'
                        : 'text-gray-text hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{chan.name}</span>
                  </button>
                );
              })}
          </div>

          {/* Voice Channels list */}
          <div className="space-y-1">
            <p className="px-2 text-[9px] font-black uppercase tracking-widest text-gray-text/60">
              Voice Channels
            </p>
            {activeServer.channels
              .filter((c) => c.type === 'voice')
              .map((chan) => (
                <button
                  key={chan.id}
                  onClick={() => handleChannelSelect(chan)}
                  className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-gray-text hover:text-white hover:bg-white/5 cursor-pointer`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Volume2 className="h-3.5 w-3.5 text-orange flex-shrink-0" />
                    <span className="truncate">{chan.name}</span>
                  </div>
                  {isVoiceConnected && (
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </button>
              ))}
          </div>

        </div>

        {/* Bottom Voice Status (Discord Status Bar) */}
        {isVoiceConnected && (
          <div className="border-t border-white/5 bg-[#09090D] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] font-black text-green-400 block">Voice Connected</span>
                <span className="text-[9px] text-gray-text truncate block">Lounge Voice / ReactVerse</span>
              </div>
              <button
                onClick={() => setIsVoiceConnected(false)}
                className="text-pink hover:bg-pink/15 p-1 rounded-md transition-colors cursor-pointer"
              >
                <PhoneOff className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <div className="flex items-center justify-around gap-1 pt-1 border-t border-white/5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${isMuted ? 'text-pink' : 'text-gray-text'}`}
              >
                {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setIsDeafened(!isDeafened)}
                className={`p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${isDeafened ? 'text-pink' : 'text-gray-text'}`}
              >
                <Headphones className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Main chat center pane */}
      <div className="flex-1 flex flex-col justify-between bg-[#111119] min-w-0">
        
        {/* Top Channel details header */}
        <div className="h-14 border-b border-white/5 px-4 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <Hash className="h-4.5 w-4.5 text-gray-text" />
            <span className="text-xs font-black text-white">
              {activeChannelId}
            </span>
            <span className="hidden sm:inline text-[10px] text-gray-text">
              • Welcome to the beginning of this channel thread!
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMemberBar(!showMemberBar)}
              className="text-gray-text hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Users className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Message Feed list scroll area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className="group flex gap-3 hover:bg-white/[0.02] p-2 rounded-xl transition-all relative">
              
              {/* Sender avatar */}
              <div className="h-9 w-9 rounded-xl overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={msg.user.avatar}
                  alt={msg.user.displayName}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Message structure */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-black text-white hover:underline cursor-pointer">
                    {msg.user.displayName}
                  </span>
                  {msg.user.id === 'me' && (
                    <span className="inline-flex items-center text-[8px] bg-purple/20 text-purple border border-purple/30 font-black uppercase tracking-wider rounded px-1.5">
                      Dev
                    </span>
                  )}
                  <span className="text-[9px] text-gray-text">
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-xs text-white/95 leading-relaxed break-words font-normal">
                  {msg.content}
                </p>

                {/* Reaction emojis row if any */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {msg.reactions.map((react) => (
                      <button
                        key={react.emoji}
                        onClick={() => handleAddReaction(msg.id, react.emoji)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 hover:bg-purple/10 text-[10px] font-bold text-gray-text hover:text-purple transition-all cursor-pointer"
                      >
                        <span>{react.emoji}</span>
                        <span>{react.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Floating hover Reactions panel bar */}
              <div className="absolute right-4 top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 border border-white/10 rounded-xl px-2 py-1 flex items-center gap-1.5 shadow-lg backdrop-blur-sm z-10">
                {['🔥', '💡', '💯', '❤️'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddReaction(msg.id, emoji)}
                    className="hover:scale-125 transition-transform text-xs cursor-pointer p-0.5"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input rich box typing section */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/[0.005]">
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl focus-within:border-purple/50 focus-within:ring-2 focus-within:ring-purple/20 transition-all pr-3">
            <button
              type="button"
              className="text-gray-text hover:text-white p-2.5 rounded-xl cursor-pointer"
            >
              <Smile className="h-4.5 w-4.5" />
            </button>
            <input
              type="text"
              placeholder={`Message #${activeChannelId}`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-transparent border-0 px-2 py-3 text-xs text-white placeholder-gray-text focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-purple hover:bg-opacity-95 text-white transition-colors cursor-pointer active:scale-95 flex items-center justify-center flex-shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

      </div>

      {/* Members list Sidebar column (Discord Right panel - Desktop only) */}
      <AnimatePresence>
        {showMemberBar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:flex flex-col bg-[#0B0B11] border-l border-white/5 w-50 p-4 space-y-4 select-none"
          >
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-text/60">
              Online Members (4)
            </p>

            <div className="space-y-3">
              {/* User rows */}
              <div className="flex items-center gap-2.5">
                <div className="relative h-7 w-7 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUser.avatar}
                    alt="Current user"
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-card bg-green-500" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-white truncate block">
                    {currentUser.displayName}
                  </span>
                  <span className="text-[8px] text-purple font-black block">Alex</span>
                </div>
              </div>

              {mockUsers.map((mUser) => (
                <div key={mUser.id} className="flex items-center gap-2.5">
                  <div className="relative h-7 w-7 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mUser.avatar}
                      alt={mUser.displayName}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-card ${
                      mUser.status === 'online' ? 'bg-green-500' : mUser.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-white truncate block">
                      {mUser.displayName}
                    </span>
                    <span className="text-[8px] text-gray-text block">@{mUser.username}</span>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DiscordChat;
