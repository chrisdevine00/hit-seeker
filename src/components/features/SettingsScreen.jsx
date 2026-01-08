import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Users, Copy, LogOut, Smartphone, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';
import { useUI } from '../../context/UIContext';
import { useSlots } from '../../context/SlotsContext';
import { Button } from '../ui';
import { hapticLight } from '../../lib/haptics';

/**
 * SettingsScreen - Unified settings for user preferences and trip management
 * Organized into sections: Account, Preferences, Trip
 */
export function SettingsScreen() {
  const { user, profile, signOut } = useAuth();
  const { currentTrip, tripMembers, clearTrip } = useTrip();
  const {
    showTripSettings,
    setShowTripSettings,
    leftHandedMode,
    setLeftHandedMode,
    hapticsEnabled,
    setHapticsEnabled,
    resetOnboarding,
    resumeOnboarding,
  } = useUI();
  const { machineViewMode, updateViewMode } = useSlots();

  // Local state for collapsible members section
  const [showMembers, setShowMembers] = useState(false);

  if (!showTripSettings || !currentTrip) return null;

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              setShowTripSettings(false);
              resumeOnboarding();
            }}
            className="no-animate flex items-center gap-2 text-[#d4a855]"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* ACCOUNT SECTION */}
        <div className="card-3d p-4 mb-4">
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Account</h3>
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#d4a855] flex items-center justify-center text-black font-bold text-lg">
                {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{profile?.display_name || 'User'}</p>
              <p className="text-[#888] text-sm truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* PREFERENCES SECTION */}
        <div className="card-3d p-4 mb-4">
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">Preferences</h3>

          {/* Default View Mode */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white text-sm">Default View</p>
              <p className="text-[#666] text-xs">Card or list layout for machines</p>
            </div>
            <div className="flex bg-[#0d0d0d] rounded overflow-hidden">
              <button
                onClick={() => updateViewMode('cards')}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  machineViewMode === 'cards' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'text-[#888]'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => updateViewMode('list')}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  machineViewMode === 'list' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'text-[#888]'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Left-Handed Mode */}
          <div className="flex items-center justify-between py-3 border-t border-[#222]">
            <div>
              <p className="text-white text-sm">Left-Handed Mode</p>
              <p className="text-[#666] text-xs">Move Add button to left side</p>
            </div>
            <button
              onClick={() => setLeftHandedMode(!leftHandedMode)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                leftHandedMode ? 'bg-gradient-to-r from-[#d4a855] to-amber-600' : 'bg-[#333]'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                leftHandedMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Haptics Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-[#222]">
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-[#888]" />
              <div>
                <p className="text-white text-sm">Haptic Feedback</p>
                <p className="text-[#666] text-xs">Vibration on taps and actions</p>
              </div>
            </div>
            <button
              onClick={() => setHapticsEnabled(!hapticsEnabled)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                hapticsEnabled ? 'bg-gradient-to-r from-[#d4a855] to-amber-600' : 'bg-[#333]'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                hapticsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Reset Onboarding */}
          <div className="flex items-center justify-between py-3 border-t border-[#222]">
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-[#888]" />
              <div>
                <p className="text-white text-sm">Reset Onboarding</p>
                <p className="text-[#666] text-xs">View the intro walkthrough again</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowTripSettings(false);
                resetOnboarding();
              }}
              className="px-3 py-1.5 text-sm bg-[#0d0d0d] text-[#888] hover:text-white rounded transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* TRIP SECTION */}
        <div className="card-3d-trip p-4 mb-4">
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">
            Trip: {currentTrip.name}
          </h3>

          {/* Share Code */}
          <div className="mb-3">
            <p className="text-[#888] text-xs mb-2">Share Code</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentTrip.share_code.toUpperCase());
                hapticLight();
                toast.success('Code copied to clipboard!');
              }}
              className="w-full bg-[#0d0d0d] px-4 py-3 rounded flex items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-colors group"
            >
              <code className="text-white font-mono text-xl tracking-wider">
                {currentTrip.share_code.toUpperCase()}
              </code>
              <Copy size={18} className="text-[#666] group-hover:text-[#d4a855] transition-colors" />
            </button>
          </div>

          {/* Members (Collapsible) */}
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <span className="text-white text-sm flex items-center gap-2">
              <Users size={16} className="text-[#888]" />
              Members ({tripMembers.length})
            </span>
            {showMembers ? (
              <ChevronUp size={18} className="text-[#888]" />
            ) : (
              <ChevronDown size={18} className="text-[#888]" />
            )}
          </button>

          {showMembers && (
            <div className="space-y-2 mt-2 pt-2 border-t border-[#222]">
              {tripMembers.map((member, idx) => (
                <div key={member.user_id || `member-${idx}`} className="flex items-center gap-3 p-2 bg-[#0d0d0d]/50 rounded">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-[#bbbbbb] text-sm">
                      {member.display_name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm">{member.display_name || member.email}</p>
                    <p className="text-[#aaaaaa] text-xs">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Switch Trip Button */}
          <Button
            onClick={() => { clearTrip(); setShowTripSettings(false); }}
            variant="secondary"
            className="w-full py-3 flex items-center justify-center gap-2 mt-4 text-white"
          >
            <ChevronLeft size={18} /> Switch Trip
          </Button>
        </div>

        {/* SIGN OUT */}
        <Button
          onClick={signOut}
          variant="secondary"
          className="w-full py-3 flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
        >
          <LogOut size={18} /> Sign Out
        </Button>
      </div>
    </div>
  );
}
