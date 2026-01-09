import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Gem } from 'lucide-react';

// Generate initial sparkles
const generateSparkles = () => {
  const sparkles = [];
  for (let i = 0; i < 20; i++) {
    sparkles.push({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 8 + Math.random() * 12,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5,
    });
  }
  return sparkles;
};

export function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [sparkles, setSparkles] = useState(generateSparkles);

  // Respawn sparkles periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => prev.map(sparkle => {
        if (Math.random() < 0.15) {
          return {
            ...sparkle,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: 8 + Math.random() * 12,
            duration: 3 + Math.random() * 4,
            delay: 0,
            key: Date.now() + sparkle.id,
          };
        }
        return sparkle;
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0d0d0d] overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary pulsing glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 168, 85, 0.15) 0%, rgba(212, 168, 85, 0.05) 40%, transparent 70%)',
            animation: 'login-glow-pulse 4s ease-in-out infinite',
          }}
        />
        {/* Secondary ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212, 168, 85, 0.08) 0%, transparent 60%)',
            animation: 'login-glow-pulse 6s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Floating sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.key || sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            opacity: 0,
            animation: `sparkle-float ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 4px rgba(212, 168, 85, 0.6))' }}>
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill="#d4a855"
            />
          </svg>
        </div>
      ))}

      {/* Rotating light rays - centered on page behind logo */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        style={{
          transform: 'translateY(-60px)', // Offset to align with icon
        }}
      >
        <div
          className="relative"
          style={{
            width: '150vmax',
            height: '150vmax',
            animation: 'spin-rays-slow 45s linear infinite',
          }}
        >
          {[...Array(12)].map((_, i) => {
            const opacities = [0.4, 0.6, 0.35, 0.55, 0.45, 0.5, 0.38, 0.58, 0.42, 0.52, 0.36, 0.48];
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 origin-top"
                style={{
                  width: '3px',
                  height: '50%',
                  background: 'linear-gradient(to bottom, transparent 10%, rgba(212, 168, 85, 0.5) 30%, rgba(255, 215, 0, 0.3) 60%, transparent 100%)',
                  transform: `translate(-50%, 0) rotate(${i * 30}deg)`,
                  opacity: opacities[i] * 0.5,
                  filter: 'blur(1px)',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Logo and tagline */}
      <div className="text-center mb-10 relative animate-fade-in-up z-10">
        {/* Icon with enhanced glow and shimmer */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(212, 168, 85, 0.3) 0%, transparent 70%)',
              animation: 'icon-glow-pulse 2s ease-in-out infinite',
              transform: 'scale(1.5)',
            }}
          />
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#d4a855]/20 to-amber-600/10 flex items-center justify-center animate-fade-in-scale animation-delay-100 border border-[#d4a855]/20 overflow-hidden">
            <Gem size={40} className="text-[#d4a855] relative z-10" style={{ filter: 'drop-shadow(0 0 8px rgba(212, 168, 85, 0.5))' }} />
            {/* Shimmer overlay on icon */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
                animation: 'icon-shimmer 2.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Logo text with shimmer on full text */}
        <h1 className="text-5xl font-bold mb-3 animate-fade-in-up animation-delay-200 relative" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #ffffff, #ffffff, #d4a855, #ffd700, #d4a855, #ffffff, #ffffff)',
              backgroundSize: '200% 100%',
              animation: 'text-shimmer 3s ease-in-out infinite',
            }}
          >
            Hit
          </span>
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #d4a855, #d4a855, #ffd700, #ffffff, #ffd700, #d4a855, #d4a855)',
              backgroundSize: '200% 100%',
              animation: 'text-shimmer 3s ease-in-out infinite',
            }}
          >
            Seeker
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-[#888] text-lg animate-fade-in-up animation-delay-300">
          Find the edge together
        </p>
      </div>

      {/* Sign in button */}
      <div className="w-full max-w-sm animate-fade-in-up animation-delay-400 z-10">
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
      <div className="mt-12 text-center animate-fade-in-up animation-delay-500 z-10">
        <p className="text-[#666] text-sm">
          Scout advantage plays with your crew
        </p>
        <p className="text-[#555] text-xs mt-2">
          Create a trip • Invite friends • Share finds in real-time
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes login-glow-pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes sparkle-float {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          20% { opacity: 0.6; transform: translateY(-10px) scale(0.8); }
          50% { opacity: 0.4; transform: translateY(-25px) scale(0.6); }
          80% { opacity: 0.2; transform: translateY(-40px) scale(0.4); }
          100% { opacity: 0; transform: translateY(-50px) scale(0.3); }
        }

        @keyframes spin-rays-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes icon-glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1.5); }
          50% { opacity: 0.8; transform: scale(1.8); }
        }

        @keyframes icon-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes text-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
