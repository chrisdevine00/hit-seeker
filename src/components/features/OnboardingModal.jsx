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
  ArrowRight,
  Check,
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { Button } from '../ui';
import { TAB_IDS } from '../../constants';

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
    setShowTripSettings,
    setActiveTab,
    setTripSubTab,
  } = useUI();

  // Track navigation direction for slide animation
  const [direction, setDirection] = useState('right');
  // Track completed onboarding actions
  const [invitedCrew, setInvitedCrew] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  if (!showOnboarding) return null;

  const goNext = () => {
    setDirection('right');
    setOnboardingStep(onboardingStep + 1);
  };

  const goBack = () => {
    setDirection('left');
    setOnboardingStep(onboardingStep - 1);
  };

  const handleInviteCrew = () => {
    setInvitedCrew(true);
    pauseOnboarding();
    setShowTripSettings(true);
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    pauseOnboarding();
    setActiveTab(TAB_IDS.TRIP);
    setTripSubTab('casinos');
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Sliding Card */}
      <div
        key={onboardingStep}
        className={`card-3d max-w-sm w-full p-6 max-h-[80vh] overflow-y-auto ${
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center animate-icon-bounce">
                <Users size={32} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
              <p className="text-[#888]">You're all set!</p>
            </div>

            <div className="space-y-3">
              {/* Invite Your Crew */}
              <button
                onClick={handleInviteCrew}
                className={`card-3d-trip w-full p-4 text-left animate-list-item transition-all ${
                  invitedCrew ? 'opacity-60' : 'hover:scale-[1.02]'
                }`}
                style={{ animationDelay: '0.1s' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      invitedCrew ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                    }`}>
                      {invitedCrew ? (
                        <Check size={20} className="text-emerald-400" />
                      ) : (
                        <Users size={20} className="text-blue-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-white font-semibold">Invite Your Crew</span>
                      <p className="text-[#888] text-sm">Share your trip code with friends</p>
                    </div>
                  </div>
                  {!invitedCrew && <ArrowRight size={18} className="text-[#666]" />}
                </div>
              </button>

              {/* Check In */}
              <button
                onClick={handleCheckIn}
                className={`card-3d w-full p-4 text-left animate-list-item transition-all ${
                  checkedIn ? 'opacity-60' : 'hover:scale-[1.02]'
                }`}
                style={{ animationDelay: '0.2s' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      checkedIn ? 'bg-emerald-500/20' : 'bg-[#d4a855]/20'
                    }`}>
                      {checkedIn ? (
                        <Check size={20} className="text-emerald-400" />
                      ) : (
                        <MapPin size={20} className="text-[#d4a855]" />
                      )}
                    </div>
                    <div>
                      <span className="text-white font-semibold">Check in to a Casino</span>
                      <p className="text-[#888] text-sm">Let your crew know where you are</p>
                    </div>
                  </div>
                  {!checkedIn && <ArrowRight size={18} className="text-[#666]" />}
                </div>
              </button>

              {/* Just Let Me In */}
              <button
                onClick={completeOnboarding}
                className="card-3d w-full p-4 text-left animate-list-item hover:scale-[1.02] transition-all"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#333] flex items-center justify-center shrink-0">
                      <ArrowRight size={20} className="text-[#888]" />
                    </div>
                    <div>
                      <span className="text-white font-semibold">Just let me in</span>
                      <p className="text-[#888] text-sm">Skip and start exploring</p>
                    </div>
                  </div>
                </div>
              </button>
            </div>
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

      {/* Progress Dots - Below card */}
      <div className="flex justify-center gap-2 mt-4">
        {[1, 2, 3, 4, 5].map(step => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === onboardingStep
                ? 'w-6 bg-gradient-to-r from-[#d4a855] to-amber-500'
                : step < onboardingStep
                  ? 'w-1.5 bg-[#d4a855]'
                  : 'w-1.5 bg-[#333]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
