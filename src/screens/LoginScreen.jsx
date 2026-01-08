import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Gem } from 'lucide-react';

export function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0d0d0d] overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4a855]/5 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* Logo and tagline */}
      <div className="text-center mb-10 relative animate-fade-in-up">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#d4a855]/20 to-amber-600/10 flex items-center justify-center animate-fade-in-scale animation-delay-100">
          <Gem size={40} className="text-[#d4a855]" />
        </div>

        {/* Logo text */}
        <h1 className="text-5xl font-bold mb-3 animate-fade-in-up animation-delay-200" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="text-white">Hit</span>
          <span className="bg-gradient-to-r from-[#d4a855] to-amber-500 bg-clip-text text-transparent">Seeker</span>
        </h1>

        {/* Tagline */}
        <p className="text-[#888] text-lg animate-fade-in-up animation-delay-300">
          Find the edge together
        </p>
      </div>

      {/* Sign in button */}
      <div className="w-full max-w-sm animate-fade-in-up animation-delay-400">
        <button
          onClick={signInWithGoogle}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {/* Footer text */}
      <div className="mt-12 text-center animate-fade-in-up animation-delay-500">
        <p className="text-[#666] text-sm">
          Scout advantage plays with your crew
        </p>
        <p className="text-[#555] text-xs mt-2">
          Create a trip • Invite friends • Share finds in real-time
        </p>
      </div>
    </div>
  );
}
