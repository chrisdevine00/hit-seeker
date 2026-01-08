import React, { useState } from 'react';
import {
  Gem,
  Spade,
  GlassWater,
  Calculator,
  Eye,
  BookOpen,
  Users,
  MapPin,
  Share2,
  Plus,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useUI } from '../../context/UIContext';
import { useTrip } from '../../context/TripContext';
import { useCheckIns } from '../../hooks';
import { Button } from '../ui';
import { hapticLight, hapticSuccess } from '../../lib/haptics';

// Fire gold confetti celebration
const fireGoldConfetti = () => {
  const goldColors = ['#d4a855', '#ffd700', '#ffb347', '#ffcc66', '#b8860b', '#f59e0b'];

  // Big center burst
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5, x: 0.5 },
    colors: goldColors,
    startVelocity: 55,
    gravity: 0.8,
    scalar: 1.2,
  });

  // Second wave
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.55, x: 0.5 },
      colors: goldColors,
      startVelocity: 45,
      gravity: 0.9,
    });
  }, 100);

  // Side cannons
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.6 },
      colors: goldColors,
      startVelocity: 50,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.6 },
      colors: goldColors,
      startVelocity: 50,
    });
  }, 200);

  // Extra top sprinkle
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 180,
      origin: { y: 0.3, x: 0.5 },
      colors: goldColors,
      startVelocity: 30,
      gravity: 1.2,
      scalar: 0.9,
    });
  }, 300);
};

/**
 * OnboardingModal - 5-step walkthrough for new users
 * Step 1: Overview (Slots, VP, Bloodies)
 * Step 2: Slots details
 * Step 3: Video Poker details
 * Step 4: Bloodies details
 * Step 5: Get Started with action buttons
 */
export function OnboardingModal() {
  const {
    showOnboarding,
    onboardingStep,
    setOnboardingStep,
    completeOnboarding,
    pauseOnboarding,
    setTriggerCheckIn,
  } = useUI();
  const { currentTrip, clearTrip } = useTrip();
  const { myCheckIn } = useCheckIns();

  // Track navigation direction for slide animation
  const [direction, setDirection] = useState('right');
  // Track completed onboarding actions
  const [invitedCrew, setInvitedCrew] = useState(false);
  // Check-in status comes from actual check-in state
  const checkedIn = !!myCheckIn;

  if (!showOnboarding) return null;

  const goNext = () => {
    setDirection('right');
    setOnboardingStep(onboardingStep + 1);
  };

  const goBack = () => {
    setDirection('left');
    setOnboardingStep(onboardingStep - 1);
  };

  const handleInviteCrew = async () => {
    // If no trip, navigate to trip selection to create one
    if (!currentTrip) {
      pauseOnboarding();
      clearTrip(); // This triggers TripSelectionScreen
      return;
    }

    // Share the trip code
    const shareCode = currentTrip.share_code.toUpperCase();
    const shareText = `Join my trip "${currentTrip.name}" on HitSeeker! Use code: ${shareCode}`;

    hapticLight();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my HitSeeker trip!',
          text: shareText,
        });
        setInvitedCrew(true);
        toast.success('Invite sent!');
      } catch (err) {
        // User cancelled or share failed - fall back to clipboard
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(shareCode);
          setInvitedCrew(true);
          toast.success('Code copied to clipboard!');
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(shareCode);
      setInvitedCrew(true);
      toast.success('Code copied to clipboard!');
    }
  };

  const handleCheckIn = () => {
    pauseOnboarding();
    setTriggerCheckIn(true);
  };

  const handleComplete = () => {
    hapticSuccess();
    fireGoldConfetti();
    // Delay closing so confetti is visible
    setTimeout(() => {
      completeOnboarding();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 pb-16 overflow-hidden">
      {/* Sliding Card */}
      <div
        key={onboardingStep}
        className={`card-3d max-w-sm w-full p-6 max-h-[75vh] overflow-y-auto ${
          direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
        }`}
      >
        {/* Step 1: Overview */}
        {onboardingStep === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#d4a855]/20 to-amber-600/10 flex items-center justify-center animate-icon-bounce">
                <Gem size={32} className="text-[#d4a855]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Welcome to HitSeeker
              </h1>
              <p className="text-[#888]">Your advantage play companion</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="card-3d p-4 animate-list-item" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d4a855]/20 flex items-center justify-center shrink-0">
                    <Gem size={20} className="text-[#d4a855]" />
                  </div>
                  <div>
                    <span className="text-white font-semibold">Slot Machines</span>
                    <p className="text-[#888] text-sm">Search 777+ machines with advantage play potential</p>
                  </div>
                </div>
              </div>

              <div className="card-3d-vp p-4 animate-list-item" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Spade size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-white font-semibold">Video Poker</span>
                    <p className="text-[#888] text-sm">88 games with pay tables and perfect strategy</p>
                  </div>
                </div>
              </div>

              <div className="card-3d-bloody p-4 animate-list-item" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                    <GlassWater size={20} className="text-red-400" />
                  </div>
                  <div>
                    <span className="text-white font-semibold">Bloodies</span>
                    <p className="text-[#888] text-sm">Track your Bloody Mary adventures with your crew</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Slots Details */}
        {onboardingStep === 2 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#d4a855]/20 to-amber-600/10 flex items-center justify-center animate-icon-bounce">
                <Gem size={32} className="text-[#d4a855]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Slot Machines</h2>
              <p className="text-[#888]">Organized by advantage tier</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="card-3d-tier1 p-3 animate-list-item" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded font-bold shrink-0">T1</span>
                  <div>
                    <span className="text-emerald-400 font-semibold">Must-Hit-By</span>
                    <p className="text-[#888] text-sm">Jackpots guaranteed to hit by a ceiling</p>
                  </div>
                </div>
              </div>

              <div className="card-3d-tier2 p-3 animate-list-item" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3">
                  <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded font-bold shrink-0">T2</span>
                  <div>
                    <span className="text-amber-400 font-semibold">Persistent State</span>
                    <p className="text-[#888] text-sm">Progress carries between players</p>
                  </div>
                </div>
              </div>

              <div className="card-3d-tier3 p-3 animate-list-item" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold shrink-0">T3</span>
                  <div>
                    <span className="text-red-400 font-semibold">Entertainment</span>
                    <p className="text-[#888] text-sm">No edge — just for fun</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Video Poker Details */}
        {onboardingStep === 3 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center animate-icon-bounce">
                <Spade size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Video Poker</h2>
              <p className="text-[#888]">Play with perfect strategy</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="card-3d-vp p-4 animate-list-item" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-white font-semibold">88 Game Variants</span>
                    <p className="text-[#888] text-sm">Jacks or Better, Deuces Wild, and more</p>
                  </div>
                </div>
              </div>

              <div className="card-3d-vp p-4 animate-list-item" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3">
                  <Calculator size={20} className="text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-white font-semibold">Pay Table Analysis</span>
                    <p className="text-[#888] text-sm">See expected return percentages instantly</p>
                  </div>
                </div>
              </div>

              <div className="card-3d-vp p-4 animate-list-item" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-white font-semibold">Hand Checker</span>
                    <p className="text-[#888] text-sm">Input any hand, see the optimal hold</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Bloodies Details */}
        {onboardingStep === 4 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center animate-icon-bounce">
                <GlassWater size={32} className="text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Bloodies</h2>
              <p className="text-[#888]">Track your Bloody Mary journey</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="card-3d-bloody p-4 animate-list-item" style={{ animationDelay: '0.1s' }}>
                <p className="text-white font-semibold">Log Every Bloody</p>
                <p className="text-[#888] text-sm">Rate the taste and spice level at every casino</p>
              </div>

              <div className="card-3d-bloody p-4 animate-list-item" style={{ animationDelay: '0.2s' }}>
                <p className="text-white font-semibold">Earn Badges</p>
                <p className="text-[#888] text-sm">Unlock 31 badges from First Blood to Capsaicin King</p>
              </div>

              <div className="card-3d-bloody p-4 animate-list-item" style={{ animationDelay: '0.3s' }}>
                <p className="text-white font-semibold">Share with Your Crew</p>
                <p className="text-[#888] text-sm">See what your trip members are drinking in real-time</p>
              </div>
            </div>
          </>
        )}

        {/* Step 5: Get Started */}
        {onboardingStep === 5 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#d4a855]/20 to-amber-600/10 flex items-center justify-center animate-icon-bounce">
                <Gem size={32} className="text-[#d4a855]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
              <p className="text-[#888]">Try these to get the most out of HitSeeker</p>
            </div>

            <div className="space-y-3 mb-6">
              {/* Invite Your Crew - Primary if not done */}
              {invitedCrew ? (
                <div className="card-3d p-4 opacity-60 animate-list-item" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Check size={18} className="text-emerald-400" />
                    </div>
                    <span className="text-white font-medium">Invite Your Crew</span>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleInviteCrew}
                  variant="primary"
                  className="w-full py-4 flex items-center justify-center gap-2 animate-list-item"
                  style={{ animationDelay: '0.1s' }}
                >
                  {currentTrip ? (
                    <>
                      <Share2 size={18} />
                      <span>Invite Your Crew</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Create a Trip</span>
                    </>
                  )}
                </Button>
              )}

              {/* Check In - Primary if invite done but not checked in */}
              {checkedIn ? (
                <div className="card-3d p-4 opacity-60 animate-list-item" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Check size={18} className="text-emerald-400" />
                    </div>
                    <span className="text-white font-medium">Check in to a Casino</span>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleCheckIn}
                  variant={invitedCrew ? 'primary' : 'secondary'}
                  className="w-full py-4 flex items-center justify-center gap-2 animate-list-item"
                  style={{ animationDelay: '0.2s' }}
                >
                  <MapPin size={18} />
                  <span>Check in to a Casino</span>
                </Button>
              )}

              {/* Start Exploring - Primary if both done */}
              <Button
                onClick={handleComplete}
                variant={invitedCrew && checkedIn ? 'primary' : 'secondary'}
                className="w-full py-4 animate-list-item"
                style={{ animationDelay: '0.3s' }}
              >
                Start Exploring
              </Button>
            </div>

            {/* Back button for Step 5 */}
            <Button
              onClick={goBack}
              variant="secondary"
              className="w-full py-3"
            >
              Back
            </Button>
          </>
        )}

        {/* Navigation Buttons */}
        {onboardingStep < 5 && (
          <div className="flex gap-3">
            {onboardingStep > 1 && (
              <Button
                onClick={goBack}
                variant="secondary"
                className="flex-1 py-3"
              >
                Back
              </Button>
            )}

            <Button
              onClick={goNext}
              variant="primary"
              className="flex-1 py-3 font-bold"
            >
              Next
            </Button>
          </div>
        )}

        {/* Skip button (not on final step) */}
        {onboardingStep < 5 && (
          <button
            onClick={completeOnboarding}
            className="w-full mt-3 text-[#666] hover:text-[#888] text-sm transition-colors"
          >
            Skip intro
          </button>
        )}
      </div>

      {/* Progress Dots - Fixed at bottom */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2">
        {[1, 2, 3, 4, 5].map(step => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              step === onboardingStep
                ? 'scale-150 bg-[#d4a855] animate-dot-pulse'
                : step < onboardingStep
                  ? 'bg-[#d4a855]'
                  : 'bg-[#444]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
