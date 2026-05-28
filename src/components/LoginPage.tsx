'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone Mockup Active Story Index for simulated auto-scrolling interaction
  const [mockStoryIndex, setMockStoryIndex] = useState(0);

  // Auto-rotate mock stories in phone preview
  useEffect(() => {
    const timer = setInterval(() => {
      setMockStoryIndex((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate premium social media app opening loading animation
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B12] text-white flex items-center justify-center p-4 md:p-8 select-none overflow-hidden relative font-sans">
      
      {/* Background ambient glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] bg-[#FF2E93]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid split container for Split screen Desktop / Centered card Mobile layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* --- LEFT SIDE: PREMIUM SMARTPHONE MOCKUP (Desktop only) --- */}
        <div className="hidden lg:flex lg:col-span-6 justify-center items-center h-full relative">
          
          {/* Smartphone device container frame */}
          <div 
            className="w-[300px] h-[610px] rounded-[52px] bg-[#12131C] p-3.5 border-4 border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(124,58,237,0.15)] relative overflow-hidden transition-all duration-500 hover:border-purple/30 group"
          >
            {/* Ambient inner phone glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple/5 via-transparent to-pink/5 opacity-60 pointer-events-none" />

            {/* Smartphone top camera notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-32 bg-black rounded-full z-40 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-white/10 mr-12" />
              <span className="h-1 w-8 rounded-full bg-white/5" />
            </div>

            {/* Smartphone status bar */}
            <div className="flex justify-between items-center px-4 pt-1.5 pb-2 text-[9px] text-gray-text font-black tracking-widest uppercase border-b border-white/5 relative z-30 select-none">
              <span>9:41 🌐</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span className="h-3 w-5 border border-gray-text/50 rounded-sm p-[1px] flex items-center">
                  <span className="h-full w-4 bg-gray-text rounded-2xs" />
                </span>
              </div>
            </div>

            {/* Simulated Live App Screen Body */}
            <div className="flex flex-col h-[526px] overflow-hidden justify-between relative bg-[#0B0B12] text-white">
              
              {/* Mock App Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-[#12131C]/90 backdrop-blur-md">
                <span className="text-xs font-black bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent tracking-wider flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3 text-purple" />
                  ReactVerse
                </span>
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-pink animate-ping" />
                  <span className="text-[8px] font-black text-pink uppercase">LIVE FEED</span>
                </div>
              </div>

              {/* Scrollable Feed Emulator */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4">
                
                {/* 1. Stories tray mockup */}
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar items-center pb-1">
                  {[
                    { id: 0, label: 'AI Roast', color: 'from-purple to-pink', avatar: '🤖' },
                    { id: 1, label: 'Fan Battle', color: 'from-pink to-orange', avatar: '⚔️' },
                    { id: 2, label: 'Rust Crab', color: 'from-orange to-purple', avatar: '🦀' },
                    { id: 3, label: 'Aria Rose', color: 'from-purple to-pink', avatar: '💅' },
                  ].map((st) => {
                    const isActive = mockStoryIndex === st.id;
                    return (
                      <div key={st.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div 
                          className={`h-11 w-11 rounded-full p-[1.5px] bg-gradient-to-tr ${st.color} transition-all duration-500 ${
                            isActive ? 'scale-110 shadow-[0_0_10px_rgba(255,46,147,0.5)]' : 'opacity-65'
                          }`}
                        >
                          <div className="h-full w-full rounded-full bg-[#0B0B12] flex items-center justify-center text-sm font-black">
                            {st.avatar}
                          </div>
                        </div>
                        <span className="text-[7px] text-gray-text font-extrabold truncate max-w-[32px]">{st.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* 2. Breaking Spotlights banner */}
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-orange/15 to-pink/15 border border-white/5 relative overflow-hidden flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[6px] font-black text-orange uppercase tracking-wider block">SPOTLIGHT 🔥</span>
                    <span className="text-[8px] font-bold text-white block truncate">Virat Fans vs Rohit Fans Duel</span>
                  </div>
                  <span className="text-[8px] font-black text-pink bg-pink/10 border border-pink/30 px-1.5 py-0.5 rounded">94% Hype</span>
                </div>

                {/* 3. Feed Card Emulator */}
                <div className="p-3 rounded-xl bg-[#12131C] border border-white/5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded bg-purple/20 border border-purple/30 flex items-center justify-center text-[10px]">
                        🎨
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-white block">tailwind_queen</span>
                        <span className="text-[6px] text-gray-text block">r/tailwind</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold text-gray-text">2m ago</span>
                  </div>

                  <p className="text-[9px] text-white/90 leading-relaxed">
                    Tailwind CSS v4.0 compilation speeds are up to 10x faster now under Rust! 🦀⚡
                  </p>

                  <div className="aspect-video rounded-lg overflow-hidden border border-white/5 relative bg-[#0B0B12]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=280&h=160&fit=crop" 
                      alt="visual mockup" 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Top Highlighted Comment (Highly Visually Outstanding) */}
                  <div className="p-2 rounded-lg bg-purple/10 border border-purple/25 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[7px] font-black text-pink uppercase tracking-widest">🔥 HIGHLIGHTED ROAST</span>
                      <span className="text-[6px] text-gray-text">❤️ 1.2k</span>
                    </div>
                    <p className="text-[8.5px] font-extrabold italic text-white leading-normal">
                      "Australia airplane mode me hai 😂"
                    </p>
                    <span className="text-[6px] text-gray-text block mt-0.5">@neon_rider</span>
                  </div>

                  {/* Actions & Reactions */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-2 flex-wrap gap-1.5">
                    <div className="flex gap-1">
                      {['🔥', '😂', '💀'].map((emoji) => (
                        <span key={emoji} className="text-[8px] bg-white/5 border border-white/5 px-1.5 py-0.5 rounded-md">{emoji}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 text-[7px] font-black text-gray-text uppercase">
                      <span>💬 1.8k</span>
                      <span>🔄 share</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Mock Bottom Navigation */}
              <div className="border-t border-white/5 bg-[#12131C]/90 backdrop-blur-md py-1 px-4 flex items-center justify-between relative">
                {/* 4 dots/icons for items */}
                <div className="text-[10px] text-purple select-none cursor-not-allowed">🏠</div>
                <div className="text-[10px] text-gray-text select-none cursor-not-allowed">🧭</div>
                
                {/* Center floating Create button */}
                <div className="relative -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple to-pink text-white shadow-[0_0_10px_rgba(124,58,237,0.6)] border-2 border-[#0B0B12]">
                  <span className="text-sm font-black">+</span>
                </div>

                <div className="text-[10px] text-gray-text select-none cursor-not-allowed">⚔️</div>
                <div className="text-[10px] text-gray-text select-none cursor-not-allowed">👤</div>
              </div>

            </div>
          </div>

          {/* Glowing backdrops representing device reflections */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-40 bg-gradient-to-b from-purple to-pink blur-md rounded-full opacity-30 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-40 bg-gradient-to-b from-pink to-orange blur-md rounded-full opacity-30 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

        </div>

        {/* --- RIGHT SIDE: CENTERED LOGIN CARD --- */}
        <div className="col-span-1 lg:col-span-6 flex justify-center items-center">
          
          <div 
            className="w-full max-w-[400px] rounded-[32px] bg-[#12131C]/80 backdrop-blur-xl border border-white/10 p-7 sm:p-9 shadow-[0_0_50px_rgba(0,0,0,0.6),0_0_30px_rgba(124,58,237,0.1)] transition-all duration-300 hover:border-white/15"
          >
            
            {/* Top Logo and Tagline Container */}
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-r from-purple via-pink to-orange p-[1.5px] shadow-[0_0_15px_rgba(255,46,147,0.4)]">
                <div className="h-full w-full rounded-[14px] bg-[#0B0B12] flex items-center justify-center">
                  <Sparkles className="h-5.5 w-5.5 text-pink" />
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent select-none pt-1">
                ReactVerse
              </h1>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-text">
                Where Comments Become Entertainment
              </p>
            </div>

            {/* Login input credentials form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Alert Message for error logs */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-400 font-medium">
                  <AlertCircle className="h-4.5 w-4.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username Input box */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-text tracking-wider pl-1">Username or Email</label>
                <input
                  type="text"
                  placeholder="e.g. RoastMaster_99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1A1D29] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-text/60 focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20 transition-all duration-200"
                />
              </div>

              {/* Password Input Box */}
              <div className="space-y-1 relative">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-[10px] font-black uppercase text-gray-text tracking-wider">Password</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Redirecting to reset password...'); }} className="text-[9px] font-black uppercase text-purple hover:text-white transition-colors">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1A1D29] border border-white/5 rounded-2xl pl-4 pr-11 py-3 text-xs text-white placeholder-gray-text/60 focus:outline-none focus:border-purple/50 focus:ring-1 focus:ring-purple/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-text hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Action buttons (Login button) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-purple via-pink to-orange hover:shadow-[0_0_20px_rgba(255,46,147,0.5)] cursor-pointer active:scale-[0.98] transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed select-none"
                  style={{
                    boxShadow: "0 0 15px rgba(124, 58, 237, 0.3), inset 0 0 8px rgba(255, 255, 255, 0.2)"
                  }}
                >
                  {isSubmitting ? 'Verifying Profile...' : 'Open Feed 🚀'}
                </button>
              </div>

            </form>

            {/* Third party dividers */}
            <div className="relative my-6 text-center select-none">
              <span className="absolute inset-x-0 top-1/2 h-[1px] bg-white/5 -translate-y-1/2" />
              <span className="relative bg-[#12131C] px-3.5 text-[8px] font-black uppercase text-gray-text tracking-widest">
                or continue with
              </span>
            </div>

            {/* Google provider button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl text-xs font-extrabold bg-[#1A1D29] border border-white/10 hover:bg-[#222636] hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {/* Google Flat Vector SVG icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.59 5.59 0 0 1 8.4 12.928a5.59 5.59 0 0 1 5.591-5.59 5.46 5.46 0 0 1 3.794 1.504l3.142-3.142A9.9 9.9 0 0 0 13.99 3c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.786 0 9.99-4.062 9.99-9.99 0-.627-.05-1.285-.15-1.728H12.24Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Sign Up Footer redirection links */}
            <div className="text-center mt-7 text-[10px] text-gray-text font-medium select-none">
              <span>Don't have an account? </span>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert('Redirecting to create account form...'); }} 
                className="font-black text-pink hover:underline transition-all"
              >
                Sign Up Now
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginPage;
