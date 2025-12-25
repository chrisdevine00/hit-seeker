// Hit Seeker Theme - Dark Gold
export const theme = {
  bg: {
    primary: '#0d0d0d',
    card: '#161616',
    cardHover: '#1c1c1c',
    input: '#1a1a1a',
  },
  accent: '#d4a855',
  accentDim: '#a67c3d',
  text: {
    primary: '#ffffff',
    secondary: '#999999',
    muted: '#666666',
  },
  border: '#2a2a2a',
  tier: {
    1: '#34c759',
    2: '#f5a623',
    3: '#ff4757',
  }
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
