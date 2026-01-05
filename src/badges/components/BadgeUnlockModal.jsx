import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BADGE_COLORS } from '../definitions/badgeColors';
import { BADGE_ICONS } from '../definitions/badgeIcons';
import { Button } from '../../components/ui';

// Domain color themes for light rays
const DOMAIN_COLORS = {
  bloody: { primary: '#dc2626', secondary: '#fca5a5', glow: 'rgba(220, 38, 38, 0.4)' },
  slot: { primary: '#d4a855', secondary: '#ffd700', glow: 'rgba(212, 168, 85, 0.4)' },
  vp: { primary: '#0ea5e9', secondary: '#7dd3fc', glow: 'rgba(14, 165, 233, 0.4)' },
  trip: { primary: '#22c55e', secondary: '#86efac', glow: 'rgba(34, 197, 94, 0.4)' },
  casino: { primary: '#a855f7', secondary: '#d8b4fe', glow: 'rgba(168, 85, 247, 0.4)' },
};

// Tier-based settings
const TIER_SETTINGS = {
  common: { rayOpacity: 0.3, raySpeed: 8, glowIntensity: 0.3, celebration: 'none' },
  uncommon: { rayOpacity: 0.5, raySpeed: 6, glowIntensity: 0.5, celebration: 'confetti' },
  rare: { rayOpacity: 0.7, raySpeed: 4, glowIntensity: 0.7, celebration: 'confetti' },
  epic: { rayOpacity: 0.9, raySpeed: 3, glowIntensity: 0.9, celebration: 'fire' },
  legendary: { rayOpacity: 1.0, raySpeed: 2, glowIntensity: 1.0, celebration: 'explode' },
};

// Badge unlock celebration modal with enhanced effects
export function BadgeUnlockModal({ badges, onDismiss }) {
  const [showBadge, setShowBadge] = useState(false);
  const [explosions, setExplosions] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const confettiRef = useRef(null);

  // Get badge info (with fallbacks)
  const badge = badges?.[0];
  const colors = BADGE_COLORS[badge?.color] || BADGE_COLORS.amber;
  const domain = badge?.domain || 'slot';
  const tier = badge?.tier || 'common';
  const domainColors = DOMAIN_COLORS[domain] || DOMAIN_COLORS.slot;
  const tierSettings = TIER_SETTINGS[tier] || TIER_SETTINGS.common;

  // Use tier-based celebration unless explicitly set on badge
  const effectType = badge?.effect || tierSettings.celebration;
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

    // Initial big burst from center
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      colors: colors,
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
        colors: colors,
        startVelocity: 40,
        gravity: 1,
      });
    }, 200);

    // Continuous side cannons
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
        colors: colors,
        startVelocity: 35,
        gravity: 0.9,
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 40,
        origin: { x: 1, y: 0.7 },
        colors: colors,
        startVelocity: 35,
        gravity: 0.9,
      });
    }, 300);

    // Confetti rain from top
    const sparkleInterval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(sparkleInterval);
        return;
      }
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

  // Heat particles effect (for fire/explode)
  const fireHeatParticles = useCallback(() => {
    const duration = 3500;
    const end = Date.now() + duration;
    const heatColors = ['#cc3300', '#b32d00', '#992600', '#e64500', '#cc2200', '#8b1a00'];

    const heatInterval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(heatInterval);
        return;
      }
      for (let i = 0; i < 5; i++) {
        const xPos = 0.15 + Math.random() * 0.7;
        confetti({
          particleCount: 1,
          angle: 90,
          spread: 0,
          origin: { x: xPos, y: 1.05 },
          colors: [heatColors[Math.floor(Math.random() * heatColors.length)]],
          startVelocity: 2 + Math.random() * 3,
          gravity: -0.15 - Math.random() * 0.1,
          scalar: 0.4 + Math.random() * 0.3,
          drift: (Math.random() - 0.5) * 1.5,
          ticks: 300 + Math.random() * 200,
          shapes: ['circle'],
          decay: 0.92 + Math.random() * 0.05,
        });
      }
    }, 50);

    return heatInterval;
  }, []);

  // Generate sparkle particles
  const generateSparkles = useCallback(() => {
    const newSparkles = [];
    for (let i = 0; i < 25; i++) {
      newSparkles.push({
        id: i,
        left: 5 + Math.random() * 90,
        top: 10 + Math.random() * 80,
        size: 10 + Math.random() * 12,
        rotation: 45 + Math.random() * 30,
        duration: 1.8 + Math.random() * 1.2,
        delay: Math.random() * 2,
        key: Date.now() + i,
      });
    }
    setSparkles(newSparkles);
  }, []);

  // Respawn sparkles
  const sparkleIntervalRef = useRef(null);
  useEffect(() => {
    if (sparkles.length > 0) {
      sparkleIntervalRef.current = setInterval(() => {
        setSparkles(prev => prev.map(sparkle => {
          if (Math.random() < 0.2) {
            return {
              ...sparkle,
              left: 5 + Math.random() * 90,
              top: 10 + Math.random() * 80,
              size: 10 + Math.random() * 12,
              rotation: 45 + Math.random() * 30,
              duration: 1.8 + Math.random() * 1.2,
              delay: 0,
              key: Date.now() + sparkle.id,
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

      // Fire confetti for confetti effect type
      if (effectType === 'confetti') {
        fireConfetti(badge.color, effectType);
        generateSparkles();
      }
    }, 100);

    // For explosion effect
    if (effectType === 'explode') {
      const newExplosions = explosionPositions.map((pos, i) => ({
        id: i,
        ...pos,
        visible: false,
        fading: false
      }));
      setExplosions(newExplosions);

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

    // Fire effect
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

  // Generate light rays with domain colors
  const rayCount = tier === 'legendary' ? 16 : 12;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Light rays - always visible, intensity based on tier */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: showBadge ? 1 : 0,
          transition: 'opacity 0.5s ease-out',
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '200%',
            height: '200%',
            animation: showBadge ? `spin-rays ${tierSettings.raySpeed}s linear infinite` : 'none',
          }}
        >
          {[...Array(rayCount)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 origin-top"
              style={{
                width: tier === 'legendary' ? '4px' : '3px',
                height: '50%',
                background: tier === 'legendary'
                  ? `linear-gradient(to bottom, transparent 10%, ${['#ff6b6b', '#ffd700', '#4ade80', '#60a5fa', '#a855f7'][i % 5]} 30%, transparent 100%)`
                  : `linear-gradient(to bottom, transparent 10%, ${domainColors.primary} 30%, ${domainColors.secondary} 60%, transparent 100%)`,
                transform: `translate(-50%, 0) rotate(${i * (360 / rayCount)}deg)`,
                opacity: tierSettings.rayOpacity * (0.5 + Math.random() * 0.5),
                filter: `blur(${tier === 'legendary' ? 2 : 1}px)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Radial glow behind badge */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: effectType === 'fire'
            ? 'linear-gradient(to top, rgba(255, 60, 0, 0.6) 0%, rgba(255, 40, 0, 0.4) 25%, rgba(200, 30, 0, 0.2) 45%, transparent 60%)'
            : effectType === 'explode'
            ? undefined
            : `radial-gradient(circle at 50% 50%, ${domainColors.glow} 0%, transparent 60%)`,
          opacity: showBadge ? tierSettings.glowIntensity : 0,
          animation: showBadge && effectType !== 'explode' ? 'pulse-glow 2s ease-in-out infinite' : 'none',
        }}
      />

      {/* Explode nebula glow */}
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

      {/* Floating sparkles */}
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
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" style={{ filter: `drop-shadow(0 0 3px ${domainColors.secondary})` }}>
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill={domainColors.secondary}
            />
          </svg>
        </div>
      ))}

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

      {/* Main content with 3D spin entry */}
      <div
        className="text-center relative z-[100]"
        style={{
          opacity: showBadge ? 1 : 0,
          transform: showBadge ? 'perspective(1000px) rotateY(0deg) scale(1)' : 'perspective(1000px) rotateY(180deg) scale(0.5)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header */}
        <div className="mb-2 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2" style={{ color: domainColors.secondary }}>
          <Sparkles size={16} className="animate-pulse" />
          <span
            className="bg-clip-text text-transparent bg-[length:200%_100%]"
            style={{
              backgroundImage: `linear-gradient(90deg, ${domainColors.secondary}, white, ${domainColors.secondary})`,
              animation: 'shimmer 2s linear infinite',
            }}
          >
            Badge Unlocked!
          </span>
          <Sparkles size={16} className="animate-pulse" />
        </div>

        {/* Badge container with levitation */}
        <div
          className="relative mx-auto mb-4"
          style={{
            width: '200px',
            height: '240px',
            animation: showBadge ? 'levitate 3s ease-in-out infinite' : 'none',
          }}
        >
          {/* Fire effect */}
          {effectType === 'fire' && (
            <div
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                bottom: '45px',
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
              width: '180px',
              height: '180px',
              background: `radial-gradient(circle, ${domainColors.glow} 0%, transparent 70%)`,
              animation: 'pulse-ring 1.5s ease-in-out infinite',
              zIndex: 0,
            }}
          />

          {/* Hexagon badge */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ zIndex: 10, top: '20px' }}
          >
            <div
              className={`w-32 h-[140px] bg-gradient-to-b ${colors.outline} flex items-center justify-center`}
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                boxShadow: `0 0 ${40 + tierSettings.glowIntensity * 40}px ${domainColors.glow}, 0 0 ${80 + tierSettings.glowIntensity * 40}px ${domainColors.glow}`,
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

          {/* Shadow for levitation effect */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{
              bottom: '0px',
              width: '100px',
              height: '20px',
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.4), transparent)',
              borderRadius: '50%',
              animation: showBadge ? 'shadow-pulse 3s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        <h2 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">{badge.name}</h2>
        <p className="text-gray-400 mb-1">{badge.description}</p>
        <p className="text-xs uppercase tracking-wider mb-6" style={{ color: domainColors.primary }}>
          {tier} • {domain}
        </p>

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
        @keyframes spin-rays {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes levitate {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-12px); }
        }

        @keyframes shadow-pulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.4; }
          50% { transform: translateX(-50%) scale(0.7); opacity: 0.2; }
        }

        @keyframes sparkle-lifecycle {
          0% { transform: translateY(0) rotate(0deg) scale(0.7); }
          100% { transform: translateY(-35px) rotate(var(--sparkle-rotation)) scale(0.7); }
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
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes pulse-ring {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }

        @keyframes badge-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
