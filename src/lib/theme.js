// =============================================================================
// HIT SEEKER DESIGN TOKENS
// =============================================================================
// Single source of truth for all color values in the application.
// Use these tokens instead of hardcoding hex values.

/**
 * Core color palette - raw hex values
 * Use these for CSS-in-JS or when Tailwind classes aren't available
 */
export const colors = {
  // Brand
  gold: {
    DEFAULT: '#d4a855',
    dim: '#a67c3d',
    hover: '#c49745',
  },

  // Surfaces (dark theme)
  surface: {
    base: '#0d0d0d',      // Main background
    raised: '#161616',     // Cards, modals
    elevated: '#1a1a1a',   // Inputs, hover states
    overlay: '#1c1c1c',    // Overlay backgrounds
  },

  // Borders
  border: {
    DEFAULT: '#333333',    // Primary border
    muted: '#2a2a2a',      // Subtle borders
    subtle: '#222222',     // Very subtle borders
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: '#bbbbbb',
    tertiary: '#aaaaaa',
    muted: '#888888',
    disabled: '#666666',
  },

  // Tier colors (for slot machines)
  tier: {
    1: '#34c759',  // Emerald/Green - Must Hit By
    2: '#f5a623',  // Amber/Orange - Persistent State
    3: '#ff4757',  // Red - Entertainment
  },

  // Status colors
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Domain colors (for badges)
  domain: {
    slot: '#d4a855',    // Gold
    vp: '#22c55e',      // Green
    bloody: '#ef4444',  // Red
    trip: '#3b82f6',    // Blue
  },
};

/**
 * Theme object - backwards compatible with existing code
 * @deprecated Use `colors` export instead for new code
 */
export const theme = {
  bg: {
    primary: colors.surface.base,
    card: colors.surface.raised,
    cardHover: colors.surface.overlay,
    input: colors.surface.elevated,
  },
  accent: colors.gold.DEFAULT,
  accentDim: colors.gold.dim,
  text: {
    primary: colors.text.primary,
    secondary: colors.text.tertiary,
    muted: colors.text.disabled,
  },
  border: colors.border.muted,
  tier: colors.tier,
};

/**
 * Tailwind class presets for common patterns
 * Use these to maintain consistency across components
 */
export const tw = {
  // Backgrounds
  bgBase: 'bg-[#0d0d0d]',
  bgRaised: 'bg-[#161616]',
  bgElevated: 'bg-[#1a1a1a]',

  // Text colors
  textPrimary: 'text-white',
  textSecondary: 'text-[#bbb]',
  textMuted: 'text-[#888]',
  textDisabled: 'text-[#666]',
  textGold: 'text-[#d4a855]',

  // Borders
  borderDefault: 'border-[#333]',
  borderMuted: 'border-[#222]',

  // Gold gradient (used frequently)
  goldGradient: 'bg-gradient-to-r from-[#d4a855] to-amber-600',
  goldGradientText: 'bg-gradient-to-r from-[#d4a855] to-amber-600 bg-clip-text text-transparent',

  // Common button styles
  btnGold: 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black font-semibold',
  btnGoldHover: 'hover:from-[#c49745] hover:to-amber-500',

  // Card styles
  card: 'bg-[#161616] border border-[#333] rounded',
  cardHover: 'hover:bg-[#1a1a1a] transition-colors',
};

// Inject global styles for fonts and scrollbars
export function injectGlobalStyles() {
  if (typeof document === 'undefined') return;

  // Scrollbar hide utility
  const scrollbarHideId = 'scrollbar-hide-style';
  if (!document.getElementById(scrollbarHideId)) {
    const scrollbarHideStyle = document.createElement('style');
    scrollbarHideStyle.id = scrollbarHideId;
    scrollbarHideStyle.textContent = `
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(scrollbarHideStyle);
  }

  // Load Lottie player script
  const lottieScriptId = 'lottie-player-script';
  if (!document.getElementById(lottieScriptId)) {
    const lottieScript = document.createElement('script');
    lottieScript.id = lottieScriptId;
    lottieScript.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
    document.head.appendChild(lottieScript);
  }

  // Main styles
  const styleId = 'hit-seeker-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&display=swap');

      html { overflow-x: hidden; overflow-y: scroll; }
      body { overflow-x: hidden; max-width: 100vw; }

      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 3px; }
      ::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #555; }
      * { scrollbar-width: thin; scrollbar-color: #444 #1a1a1a; }

      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      /* Bloodies Feature Animations */
      @keyframes slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }

      @keyframes slide-in-right {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

      @keyframes badge-reveal {
        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
        60% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      .animate-badge-reveal { animation: badge-reveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}
