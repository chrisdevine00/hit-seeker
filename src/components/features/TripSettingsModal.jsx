import React from 'react';
import { ChevronLeft, Users, Copy, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';
import { useUI } from '../../context/UIContext';
import { useSlots } from '../../context/SlotsContext';
import { Button } from '../ui';
import { hapticLight } from '../../lib/haptics';

/**
 * TripSettingsModal - Trip settings, members, and user preferences
 * Shows share code, member list, view mode, left-handed toggle
 */
export function TripSettingsModal() {
  const { user, profile, signOut } = useAuth();
  const { currentTrip, tripMembers, clearTrip } = useTrip();
  const {
    showTripSettings,
    setShowTripSettings,
    leftHandedMode,
    setLeftHandedMode,
  } = useUI();
  const { machineViewMode, updateViewMode } = useSlots();

  if (!showTripSettings || !currentTrip) return null;

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6">
      <div className="max-w-md mx-auto">
        <button onClick={() => setShowTripSettings(false)} className="no-animate flex items-center gap-2 text-[#d4a855] mb-6">
          <ChevronLeft size={20} /> Back
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">{currentTrip.name}</h2>

        <div className="bg-[#161616] rounded p-4 mb-4 border border-[#333]">
          <h3 className="font-semibold text-white mb-3">Share Code</h3>
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
          <p className="text-[#bbbbbb] text-sm text-center mt-2">Tap to copy and share with friends</p>
        </div>

        <div className="bg-[#161616] rounded p-4 mb-4 border border-[#333]">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Users size={18} /> Members ({tripMembers.length})
          </h3>
          <div className="space-y-2">
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
        </div>

        {/* User Settings Section */}
        <div className="bg-[#161616] rounded p-4 mb-4 border border-[#333]">
          <h3 className="font-semibold text-white mb-4">Settings</h3>

          {/* Account Info */}
          <div className="flex items-center gap-3 p-3 bg-[#0d0d0d]/50 rounded mb-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#d4a855] flex items-center justify-center text-black font-bold">
                {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{profile?.display_name || 'User'}</p>
              <p className="text-[#888] text-sm truncate">{user?.email}</p>
            </div>
          </div>

          {/* Default View Mode */}
          <div className="flex items-center justify-between py-3 border-t border-[#333]">
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
          <div className="flex items-center justify-between py-3 border-t border-[#333]">
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
        </div>

        <Button
          onClick={() => { clearTrip(); setShowTripSettings(false); }}
          variant="secondary"
          className="w-full py-3 flex items-center justify-center gap-2 mb-3 text-white"
        >
          <ChevronLeft size={18} /> Switch Trip
        </Button>

        <Button onClick={signOut} variant="secondary" className="w-full py-3 flex items-center justify-center gap-2">
          <LogOut size={18} /> Sign Out
        </Button>
      </div>
    </div>
  );
}
