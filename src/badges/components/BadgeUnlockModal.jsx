import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BADGE_COLORS } from '../definitions/badgeColors';
import { BADGE_ICONS } from '../definitions/badgeIcons';
import { Button } from '../../components/ui';

// Badge unlock celebration modal with enhanced effects
export function BadgeUnlockModal({ badges, onDismiss }) {
  const [showBadge, setShowBadge] = useState(false);
  const [explosions, setExplosions] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const confettiRef = useRef(null);

  // Get badge info (with fallbacks)
  const badge = badges?.[0];
  const colors = BADGE_COLORS[badge?.color] || BADGE_COLORS.amber;
  const effectType = badge?.effect || 'confetti';
  const IconComponent = badge ? BADGE_ICONS[badge.icon] : null;

  // Explosion positions for major badges
  const explosionPositions = [
    { top: '15%', left: '20%', delay: 0, scale: 1.0 },
    { top: '10%', left: '80%', delay: 100, scale: 1.1 },
    { top: '45%', left: '10%', delay: 200, scale: 0.9 },
    { top: '50%', left: '50%', delay: 350, scale: 1.4 },
    { top: '40%', left: '90%', delay: 450, scale: 1.0 },
    { top: '80%', left: '25%', delay: 550, scale: 1.1 },
    { top: '75%', left: '75%', delay: 650, scale: 0.95 },
  ];

  // Color palettes based on badge color
  const getColorPalette = useCallback((badgeColor) => {
    const palettes = {
      red: ['#ff4444', '#ff6b6b', '#ff8888', '#ffaaaa', '#cc0000'],
      amber: ['#d4a855', '#ffd700', '#ffb347', '#ffcc66', '#b8860b'],
      gold: ['#ffd700', '#ffcc00', '#ffdb4d', '#ffe066', '#b8860b'],
      green: ['#4ade80', '#22c55e', '#86efac', '#16a34a', '#15803d'],
      blue: ['#60a5fa', '#3b82f6', '#93c5fd', '#2563eb', '#1d4ed8'],
      purple: ['#a855f7', '#9333ea', '#c084fc', '#7c3aed', '#6b21a8'],
      pink: ['#f472b6', '#ec4899', '#f9a8d4', '#db2777', '#be185d'],
      cyan: ['#22d3ee', '#06b6d4', '#67e8f9', '#0891b2', '#0e7490'],
    };
    return palettes[badgeColor] || palettes.gold;
  }, []);

  // Fire confetti burst - colors match badge
  const fireConfetti = useCallback((badgeColor, effect) => {
    const duration = 3500;
    const end = Date.now() + duration;
    const colors = getColorPalette(badgeColor);

    // Heat colors for fire/explode
    const heatColors = ['#ff4500', '#ff6b00', '#ff8c00', '#ffa500', '#ffcc00', '#ff0000'];

    // Initial big burst from center
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      colors: effect === 'fire' || effect === 'explode' ? heatColors : colors,
      startVelocity: 55,
      gravity: 0.8,
      shapes: ['circle', 'square'],
      scalar: 1.3,
    });

    // Second wave burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.55, x: 0.5 },
        colors: effect === 'fire' || effect === 'explode' ? heatColors : colors,
        startVelocity: 40,
        gravity: 1,
      });
    }, 200);

    // Continuous side cannons (independent effect)
    const cannonInterval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(cannonInterval);
        return;
      }
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 40,
        origin: { x: 0, y: 0.7 },
        colors: effect === 'fire' || effect === 'explode' ? heatColors : colors,
        startVelocity: 35,
        gravity: 0.9,
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 40,
        origin: { x: 1, y: 0.7 },
        colors: effect === 'fire' || effect === 'explode' ? heatColors : colors,
        startVelocity: 35,
        gravity: 0.9,
      });
    }, 300);

    // Confetti rain from top - random positions across full width
    const sparkleInterval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(sparkleInterval);
        return;
      }

      // Fire multiple small bursts from random x positions across the screen
      for (let i = 0; i < 6; i++) {
        confetti({
          particleCount: 2,
          angle: 90,
          spread: 10,
          origin: { x: Math.random(), y: -0.05 },
          colors: colors,
          startVelocity: 6,
          gravity: 1.4,
          scalar: 0.9,
          drift: (Math.random() - 0.5) * 0.5,
          ticks: 350,
        });
      }
    }, 80);

    confettiRef.current = { cannon: cannonInterval, sparkle: sparkleInterval };
  }, [getColorPalette]);

  // Heat particles effect (for fire/explode) - slow rising embers
  const fireHeatParticles = useCallback(() => {
    const duration = 3500;
    const end = Date.now() + duration;
    const heatColors = ['#cc3300', '#b32d00', '#992600', '#e64500', '#cc2200', '#8b1a00'];

    // Slow rising embers - minimal velocity, strong negative gravity pulls them up
    const heatInterval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(heatInterval);
        return;
      }

      // Spawn embers across the bottom, they float up slowly
      for (let i = 0; i < 5; i++) {
        const xPos = 0.15 + Math.random() * 0.7; // Spread across 70% of screen width
        confetti({
          particleCount: 1,
          angle: 90,
          spread: 0,
          origin: { x: xPos, y: 1.05 },
          colors: [heatColors[Math.floor(Math.random() * heatColors.length)]],
          startVelocity: 2 + Math.random() * 3, // Very slow start
          gravity: -0.15 - Math.random() * 0.1, // Gentle upward pull
          scalar: 0.4 + Math.random() * 0.3, // Small particles
          drift: (Math.random() - 0.5) * 1.5, // Gentle wiggle
          ticks: 300 + Math.random() * 200, // Long life to rise high
          shapes: ['circle'],
          decay: 0.92 + Math.random() * 0.05, // Slow fade
        });
      }
    }, 50);

    return heatInterval;
  }, []);

  // Generate sparkle particles - fade in, rise, rotate, fade out, then respawn elsewhere
  const generateSparkles = useCallback(() => {
    const newSparkles = [];
    for (let i = 0; i < 25; i++) {
      newSparkles.push({
        id: i,
        left: 5 + Math.random() * 90,
        top: 10 + Math.random() * 80,
        size: 10 + Math.random() * 12, // 10-22px
        rotation: 45 + Math.random() * 30, // 45-75 degree rotation (gentler)
        duration: 1.8 + Math.random() * 1.2, // 1.8-3s lifecycle (slower)
        delay: Math.random() * 2, // Stagger initial appearance
        key: Date.now() + i, // Unique key for re-render
      });
    }
    setSparkles(newSparkles);
  }, []);

  // Respawn sparkles at new random locations after they complete animation
  const sparkleIntervalRef = useRef(null);
  useEffect(() => {
    if (sparkles.length > 0) {
      // Every 600ms, respawn a few sparkles at new locations
      sparkleIntervalRef.current = setInterval(() => {
        setSparkles(prev => prev.map(sparkle => {
          // 20% chance to respawn each sparkle at new location
          if (Math.random() < 0.2) {
            return {
              ...sparkle,
              left: 5 + Math.random() * 90,
              top: 10 + Math.random() * 80,
              size: 10 + Math.random() * 12,
              rotation: 45 + Math.random() * 30,
              duration: 1.8 + Math.random() * 1.2,
              delay: 0, // No delay on respawn
              key: Date.now() + sparkle.id, // New key forces animation restart
            };
          }
          return sparkle;
        }));
      }, 600);
    }
    return () => {
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current);
      }
    };
  }, [sparkles.length > 0]);

  // Reset state when badge changes
  useEffect(() => {
    if (badge?.id) {
      setShowBadge(false);
      setExplosions([]);
      setSparkles([]);
    }
  }, [badge?.id]);

  // Main effect for showing badge and triggering effects
  useEffect(() => {
    if (!badge) return;

    let heatInterval = null;

    // Show badge with animation
    const badgeTimer = setTimeout(() => {
      setShowBadge(true);

      // Fire confetti for confetti effect type - uses badge color
      if (effectType === 'confetti') {
        fireConfetti(badge.color, effectType);
        generateSparkles();
      }
    }, 100);

    // For explosion effect - heat particles, no regular confetti
    if (effectType === 'explode') {
      const newExplosions = explosionPositions.map((pos, i) => ({
        id: i,
        ...pos,
        visible: false,
        fading: false
      }));
      setExplosions(newExplosions);

      // Stagger the explosions
      explosionPositions.forEach((pos, i) => {
        setTimeout(() => {
          setExplosions(prev => prev.map(exp =>
            exp.id === i ? { ...exp, visible: true } : exp
          ));
        }, pos.delay);

        setTimeout(() => {
          setExplosions(prev => prev.map(exp =>
            exp.id === i ? { ...exp, fading: true } : exp
          ));
        }, pos.delay + 1200);

        setTimeout(() => {
          setExplosions(prev => prev.map(exp =>
            exp.id === i ? { ...exp, visible: false } : exp
          ));
        }, pos.delay + 1450);
      });

    }

    // Fire effect - heat particles rising (no sparkles)
    if (effectType === 'fire') {
      setTimeout(() => {
        heatInterval = fireHeatParticles();
      }, 300);
    }

    return () => {
      clearTimeout(badgeTimer);
      if (confettiRef.current) {
        if (confettiRef.current.cannon) clearInterval(confettiRef.current.cannon);
        if (confettiRef.current.sparkle) clearInterval(confettiRef.current.sparkle);
        if (typeof confettiRef.current === 'number') clearInterval(confettiRef.current);
      }
      if (heatInterval) clearInterval(heatInterval);
    };
  }, [badge?.id, badge?.color, effectType, fireConfetti, fireHeatParticles, generateSparkles]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    setShowBadge(false);
    setExplosions([]);
    setSparkles([]);
    if (confettiRef.current) {
      if (confettiRef.current.cannon) clearInterval(confettiRef.current.cannon);
      if (confettiRef.current.sparkle) clearInterval(confettiRef.current.sparkle);
      if (typeof confettiRef.current === 'number') clearInterval(confettiRef.current);
    }
    if (sparkleIntervalRef.current) {
      clearInterval(sparkleIntervalRef.current);
    }
    setTimeout(() => onDismiss(), 100);
  }, [onDismiss]);

  // Early return AFTER all hooks
  if (!badges || badges.length === 0 || !badge) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: effectType === 'fire'
            ? 'linear-gradient(to top, rgba(255, 60, 0, 0.6) 0%, rgba(255, 40, 0, 0.4) 25%, rgba(200, 30, 0, 0.2) 45%, transparent 60%)'
            : effectType === 'explode'
            ? undefined
            : 'radial-gradient(circle at 50% 50%, rgba(212, 168, 85, 0.25) 0%, transparent 60%)',
          opacity: showBadge ? 1 : 0,
          animation: showBadge && effectType !== 'explode' ? 'pulse-glow 2s ease-in-out infinite' : 'none',
        }}
      />

      {/* Explode nebula glow - multiple layered gradients */}
      {effectType === 'explode' && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 120% 100% at 50% 60%, rgba(255, 80, 0, 0.5) 0%, transparent 50%)',
              opacity: showBadge ? 1 : 0,
              animation: showBadge ? 'nebula-pulse-1 2s ease-out forwards' : 'none',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 120% at 40% 50%, rgba(255, 50, 0, 0.4) 0%, transparent 45%)',
              opacity: showBadge ? 1 : 0,
              animation: showBadge ? 'nebula-pulse-2 2.2s ease-out forwards' : 'none',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 100% 80% at 60% 45%, rgba(200, 60, 0, 0.35) 0%, transparent 55%)',
              opacity: showBadge ? 1 : 0,
              animation: showBadge ? 'nebula-pulse-3 1.8s ease-out forwards' : 'none',
            }}
          />
        </>
      )}

      {/* Floating sparkles - fade in, rise, rotate, fade out */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.key}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            zIndex: 60,
            opacity: 0,
            '--sparkle-rotation': `${sparkle.rotation}deg`,
            animation: `sparkle-lifecycle ${sparkle.duration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards, sparkle-opacity ${sparkle.duration}s ease-in-out forwards`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.6))' }}>
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill={effectType === 'fire' || effectType === 'explode' ? 'rgba(255, 150, 50, 1)' : 'rgba(255, 215, 0, 1)'}
            />
          </svg>
        </div>
      ))}

      {/* Shimmer rays */}
      {showBadge && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 origin-center"
              style={{
                width: '2px',
                height: '150%',
                background: 'linear-gradient(to bottom, transparent, rgba(255, 215, 0, 0.3), transparent)',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                animation: 'shimmer-ray 3s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Explosion effects */}
      {effectType === 'explode' && explosions.map(exp => exp.visible && (
        <div
          key={exp.id}
          className="absolute pointer-events-none"
          style={{
            top: exp.top,
            left: exp.left,
            transform: `translate(-50%, -50%) scale(${exp.scale})`,
            width: '300px',
            height: '300px',
            opacity: exp.fading ? 0 : 1,
            transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 51
          }}
        >
          <lottie-player
            src="/assets/explode.json"
            background="transparent"
            speed="1"
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ))}

      {/* Main content */}
      <div
        className="text-center relative z-[100]"
        style={{
          opacity: showBadge ? 1 : 0,
          transform: showBadge ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Header with animated sparkles */}
        <div className="mb-2 text-yellow-400 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          <span className="animate-shimmer bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent bg-[length:200%_100%]">
            Badge Unlocked!
          </span>
          <Sparkles size={16} className="animate-pulse" />
        </div>

        {/* Badge with effects */}
        <div className="relative mx-auto mb-4" style={{ width: '200px', height: '220px' }}>
          {/* Fire effect */}
          {effectType === 'fire' && (
            <div
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                bottom: '25px',
                width: '240px',
                height: '260px',
                zIndex: 1
              }}
            >
              <lottie-player
                src="/assets/fire-2.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}

          {/* Glow ring behind badge */}
          <div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: '160px',
              height: '160px',
              background: `radial-gradient(circle, ${effectType === 'fire' ? 'rgba(255,100,0,0.4)' : 'rgba(212,168,85,0.3)'} 0%, transparent 70%)`,
              animation: 'pulse-ring 1.5s ease-in-out infinite',
              zIndex: 0,
            }}
          />

          {/* Hexagon badge */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 bottom-0"
            style={{ zIndex: 10 }}
          >
            <div
              className={`w-32 h-[140px] bg-gradient-to-b ${colors.outline} flex items-center justify-center shadow-lg`}
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                boxShadow: effectType === 'fire' ? '0 0 80px rgba(255, 80, 0, 0.8), 0 0 120px rgba(255, 50, 0, 0.4)' :
                           effectType === 'explode' ? '0 0 80px rgba(255, 150, 0, 0.7), 0 0 120px rgba(255, 100, 0, 0.4)' :
                           '0 0 40px rgba(212, 168, 85, 0.4)',
                animation: 'badge-glow 2s ease-in-out infinite',
              }}
            >
              <div
                className={`w-28 h-[123px] bg-gradient-to-b ${colors.fill} flex items-center justify-center`}
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              >
                {IconComponent ? (
                  <IconComponent
                    size={48}
                    className="text-white drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">{badge.name}</h2>
        <p className="text-gray-400 mb-6">{badge.description}</p>

        <Button
          onClick={handleDismiss}
          variant="primary"
          size="lg"
          className="px-8 shadow-lg"
        >
          {badges.length > 1 ? `Next Badge → (${badges.length - 1} more)` : 'Awesome!'}
        </Button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes sparkle-lifecycle {
          0% {
            opacity: 0;
            transform: translateY(0) rotate(0deg) scale(0.7);
          }
          100% {
            opacity: 0;
            transform: translateY(-35px) rotate(var(--sparkle-rotation)) scale(0.7);
          }
        }

        @keyframes sparkle-opacity {
          0% { opacity: 0; }
          15% { opacity: 0.7; }
          35% { opacity: 0.5; }
          60% { opacity: 0.15; }
          100% { opacity: 0; }
        }

        @keyframes nebula-pulse-1 {
          0% { opacity: 0; filter: blur(20px); }
          30% { opacity: 0.6; filter: blur(40px); }
          100% { opacity: 0.9; filter: blur(60px); }
        }

        @keyframes nebula-pulse-2 {
          0% { opacity: 0; filter: blur(30px); }
          40% { opacity: 0.5; filter: blur(50px); }
          100% { opacity: 0.8; filter: blur(70px); }
        }

        @keyframes nebula-pulse-3 {
          0% { opacity: 0; filter: blur(15px); }
          35% { opacity: 0.4; filter: blur(35px); }
          100% { opacity: 0.7; filter: blur(55px); }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes shimmer-ray {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes badge-glow {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
