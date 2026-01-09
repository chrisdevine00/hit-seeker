import React, { useState, useEffect, useMemo } from 'react';
import { GlassWater, Flame, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui';
import { HexBadge, BadgeDetailModal, BLOODY_BADGES, checkBloodyBadges, useBadges } from '../../../badges';
import { vegasCasinos } from '../../../data/casinos';
import { formatRelativeTime } from '../../../utils';
import { hapticSuccess } from '../../../lib/haptics';
import { LogBloodyModal } from './LogBloodyModal';
import { useBloodies } from '../../../hooks';
import { useTrip } from '../../../context/TripContext';
import { useAuth } from '../../../context/AuthContext';

/**
 * BloodiesTab - Bloody Mary tracking tab with stats, badges, and history
 * Badge unlock celebrations are handled globally by BadgeContext/App.jsx
 */
export function BloodiesTab() {
  const { user } = useAuth();
  const { currentTrip } = useTrip();
  const { bloodies, loading, addBloody } = useBloodies();
  const { updateBloodyBadges } = useBadges();

  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Filter to current user's bloodies for personal badge calculation
  const myBloodies = useMemo(
    () => bloodies.filter(b => b.user_id === user?.id),
    [bloodies, user?.id]
  );

  // Update badge context when user's bloodies change
  // Badge unlock celebrations are handled by the global BadgeContext
  useEffect(() => {
    updateBloodyBadges(myBloodies);
  }, [myBloodies, updateBloodyBadges]);

  // Calculate earned badges from personal bloodies (for display only)
  const earnedBadges = checkBloodyBadges(myBloodies);

  // Get today's count (personal)
  const today = new Date().toDateString();
  const todayCount = myBloodies.filter(b => {
    const timestamp = b.created_at || b.timestamp;
    return new Date(timestamp).toDateString() === today;
  }).length;

  // Handle new bloody submission
  const handleLogBloody = async (bloodyData) => {
    const newBloody = await addBloody(bloodyData);

    if (!newBloody) {
      toast.error('Failed to log bloody');
      return;
    }

    hapticSuccess();

    // Build toast message parts
    const parts = [];
    if (bloodyData.spice > 0) parts.push(`${bloodyData.spice}🔥`);
    if (bloodyData.rating > 0) parts.push(`${bloodyData.rating}⭐`);
    const prefix = parts.length > 0 ? `${parts.join(' ')} ` : '';

    toast.success(`${prefix}Bloody at ${bloodyData.location}`, {
      icon: <GlassWater size={18} className="text-red-400" />,
    });

    // Badge unlocks are handled automatically by the useEffect above
    // when myBloodies updates after addBloody completes
  };

  // No trip selected state
  if (!currentTrip) {
    return (
      <div className="pb-24">
        <div className="px-4 py-2 border-b border-[#333] -mx-4 mb-4">
          <h1 className="text-2xl font-bold text-white">Bloodies</h1>
          <p className="text-gray-500 text-sm">Track your Bloody Mary adventures</p>
        </div>
        <div className="text-center py-12">
          <GlassWater size={48} className="mx-auto text-[#444] mb-4" />
          <h2 className="text-white text-xl mb-2">No Trip Selected</h2>
          <p className="text-gray-500">Join or create a trip to track bloodies with your team</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="pb-24">
        <div className="px-4 py-2 border-b border-[#333] -mx-4 mb-4">
          <h1 className="text-2xl font-bold text-white">Bloodies</h1>
          <p className="text-gray-500 text-sm">Track your Bloody Mary adventures</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-[#d4a855]" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#333] -mx-4 mb-4">
        <h1 className="text-2xl font-bold text-white">Bloodies</h1>
        <p className="text-gray-500 text-sm">Track your Bloody Mary adventures</p>
      </div>

      <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-3d p-4 text-center">
          <div className="text-4xl font-bold text-white">{myBloodies.length}</div>
          <div className="text-gray-500 text-sm">My Lifetime</div>
        </div>
        <div className="card-3d p-4 text-center">
          <div className="text-4xl font-bold text-[#d4a855]">{todayCount}</div>
          <div className="text-gray-500 text-sm">Today</div>
        </div>
      </div>

      {/* Log Button */}
      <div>
        <Button
          onClick={() => setShowLogModal(true)}
          variant="danger"
          size="xl"
          className="w-full flex items-center justify-center gap-2"
        >
          <GlassWater size={24} />
          Log a Bloody
        </Button>
      </div>

      {/* Badges Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Badges</h2>
          <span className="text-sm text-gray-500">{earnedBadges.size} / {BLOODY_BADGES.length}</span>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-4 gap-4">
          {BLOODY_BADGES.map(badge => (
            <HexBadge
              key={badge.id}
              badge={badge}
              earned={earnedBadges.has(badge.id)}
              size="small"
              onClick={() => setSelectedBadge(badge)}
            />
          ))}
        </div>
      </div>

      {/* Recent Bloodies (Trip-wide) */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Recent</h2>
        {bloodies.length === 0 ? (
          <div className="text-center py-8 card-3d">
            <GlassWater size={40} className="mx-auto text-[#444] mb-3" />
            <p className="text-[#888] mb-1">No bloodies logged yet</p>
            <p className="text-[#666] text-sm">Tap the button above to log your first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bloodies.slice(0, 5).map(bloody => (
              <div key={bloody.id} className="card-3d-bloody p-3">
                <div className="flex gap-3">
                  {/* User Avatar */}
                  {bloody.profiles?.avatar_url ? (
                    <img
                      src={bloody.profiles.avatar_url}
                      alt=""
                      className="w-8 h-8 rounded-full shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#333] shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <div className="text-white font-medium truncate">{bloody.location}</div>
                        <div className="text-gray-500 text-xs">
                          {bloody.profiles?.display_name || 'Unknown'} • {formatRelativeTime(bloody.created_at || bloody.timestamp)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm shrink-0 ml-2">
                        <span className={`flex items-center gap-1 ${bloody.rating > 0 ? 'text-yellow-400' : 'text-[#444]'}`}>
                          {bloody.rating || '-'} <span className="text-base">★</span>
                        </span>
                        <span className={`flex items-center gap-1 ${bloody.spice > 0 ? 'text-orange-500' : 'text-[#444]'}`}>
                          {bloody.spice || '-'} <Flame size={14} fill="currentColor" />
                        </span>
                      </div>
                    </div>
                    {bloody.notes && (
                      <div className="text-gray-400 text-sm mt-1 italic truncate">"{bloody.notes}"</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Log Modal */}
      <LogBloodyModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSubmit={handleLogBloody}
        casinos={vegasCasinos}
      />

      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        earned={selectedBadge && earnedBadges.has(selectedBadge.id)}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
}
