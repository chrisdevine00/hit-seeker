import React from 'react';
import {
  Search,
  Calculator,
  Camera,
  Grid,
  Target,
  Users,
  StickyNote,
  BookOpen,
  Gem,
  Spade,
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { Button, FilledMapPin } from '../ui';

/**
 * OnboardingModal - 6-step walkthrough for new users
 * Explains tiers, tabs, and core features
 */
export function OnboardingModal() {
  const {
    showOnboarding,
    onboardingStep,
    setOnboardingStep,
    completeOnboarding,
  } = useUI();

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[#161616] border border-[#333] rounded max-w-sm w-full p-6 max-h-[90vh] overflow-y-auto">

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6].map(step => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors ${
                step === onboardingStep ? 'bg-gradient-to-r from-[#d4a855] to-amber-600' :
                step < onboardingStep ? 'bg-[#d4a855]/50' : 'bg-[#333]'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome + Tiers */}
        {onboardingStep === 1 && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="text-white">Welcome to </span>
                <span className="text-[#d4a855]">Hit</span><span className="bg-gradient-to-r from-[#d4a855] to-amber-600 bg-clip-text text-transparent">S</span><span className="text-[#d4a855]">eeker</span>
              </h1>
              <p className="text-[#aaa] text-sm">Your advantage play companion</p>
            </div>

            <p className="text-white text-center mb-4 font-medium">Machines are organized into 3 tiers:</p>

            <div className="space-y-3 mb-6">
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">T1</span>
                  <span className="text-emerald-400 font-semibold text-sm">Must-Hit-By</span>
                </div>
                <p className="text-[#bbb] text-xs">Jackpots that MUST hit by a ceiling amount.</p>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">T2</span>
                  <span className="text-amber-400 font-semibold text-sm">Persistent State</span>
                </div>
                <p className="text-[#bbb] text-xs">Machines that save progress between players.</p>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">T3</span>
                  <span className="text-red-400 font-semibold text-sm">Entertainment</span>
                </div>
                <p className="text-[#bbb] text-xs">No advantage play. Fun only!</p>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Hunt Tab */}
        {onboardingStep === 2 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                <Gem size={32} className="text-[#d4a855]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Hunt Tab</h2>
              <p className="text-[#aaa] text-sm">Find your next play</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <Search size={16} className="text-[#d4a855]" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Search 777 machines</p>
                  <p className="text-[#aaa] text-xs">By name, manufacturer, or type</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <Target size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Filter by AP Only</p>
                  <p className="text-[#aaa] text-xs">Show only advantage play machines (T1 & T2)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <Grid size={16} className="text-[#d4a855]" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Browse by category</p>
                  <p className="text-[#aaa] text-xs">Must-Hit-By, Persistent State, and more</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Machine Details */}
        {onboardingStep === 3 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                <Calculator size={32} className="text-[#d4a855]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Machine Details</h2>
              <p className="text-[#aaa] text-sm">Everything you need to decide</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded p-3">
                <p className="text-emerald-400 font-medium text-sm mb-1">T1: MHB Calculator</p>
                <p className="text-[#aaa] text-xs">Enter current value and ceiling to see if it's worth playing</p>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded p-3">
                <p className="text-amber-400 font-medium text-sm mb-1">T2: Visual Cues</p>
                <p className="text-[#aaa] text-xs">See exactly what to look for on the machine</p>
              </div>

              <div className="flex items-start gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <Camera size={16} className="text-[#d4a855]" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Add photos & notes</p>
                  <p className="text-[#aaa] text-xs">Remember where you found good machines</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Trip Coordination */}
        {onboardingStep === 4 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-[#d4a855]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Trip Tab</h2>
              <p className="text-[#aaa] text-sm">Coordinate with your team</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <FilledMapPin size={16} className="text-emerald-400" holeColor="#2a2a2a" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Check in to casinos</p>
                  <p className="text-[#aaa] text-xs">Let teammates know where you are</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <StickyNote size={16} className="text-[#d4a855]" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Share scouting notes</p>
                  <p className="text-[#aaa] text-xs">Team sees notes in real-time</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <Target size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Hot Opportunities</p>
                  <p className="text-[#aaa] text-xs">See today's best finds from the team</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 5: Video Poker */}
        {onboardingStep === 5 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                <Spade size={32} className="text-[#d4a855]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Video Poker</h2>
              <p className="text-[#aaa] text-sm">Find the best pay tables</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <Search size={16} className="text-[#d4a855]" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">88 Game Variants</p>
                  <p className="text-[#aaa] text-xs">Jacks or Better, Deuces Wild, Ultimate X, and more</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <Calculator size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Pay Table Analyzer</p>
                  <p className="text-[#aaa] text-xs">See return % and find HUNT-worthy machines</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Hand Checker</p>
                  <p className="text-[#aaa] text-xs">Enter your hand, get the optimal play</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 6: Get Started */}
        {onboardingStep === 6 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#d4a855]/20 rounded-full flex items-center justify-center">
                <Gem size={32} className="text-[#d4a855]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">You're Ready!</h2>
              <p className="text-[#aaa] text-sm">Time to hit the floor</p>
            </div>

            <div className="bg-[#1a1a1a] rounded p-4 mb-6">
              <p className="text-white font-medium text-sm mb-3">Quick start tips:</p>
              <ul className="space-y-2 text-[#aaa] text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#d4a855]">1.</span>
                  <span>Tap <strong className="text-white">Check In</strong> in the top-right</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4a855]">2.</span>
                  <span>Turn on <strong className="text-white">AP Only</strong> to focus on plays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4a855]">3.</span>
                  <span>Search for machines you see on the floor</span>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {onboardingStep > 1 && (
            <button
              onClick={() => setOnboardingStep(onboardingStep - 1)}
              className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-white font-semibold py-3 rounded transition-colors"
            >
              Back
            </button>
          )}

          {onboardingStep < 6 ? (
            <Button
              onClick={() => setOnboardingStep(onboardingStep + 1)}
              variant="primary"
              className="flex-1 py-3 font-bold"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={completeOnboarding}
              variant="primary"
              className="flex-1 py-3 font-bold"
            >
              Start Hunting
            </Button>
          )}
        </div>

        {/* Skip button */}
        {onboardingStep < 6 && (
          <button
            onClick={completeOnboarding}
            className="w-full mt-3 text-[#aaa] hover:text-[#aaa] text-sm transition-colors"
          >
            Skip intro
          </button>
        )}
      </div>
    </div>
  );
}
