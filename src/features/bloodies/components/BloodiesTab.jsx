import React, { useState, useEffect } from 'react';
import { GlassWater, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui';
import { HexBadge, BadgeDetailModal, BadgeUnlockModal, BLOODY_BADGES, checkBloodyBadges } from '../../../badges';
import { vegasCasinos } from '../../../data/casinos';
import { formatRelativeTime } from '../../../utils';
import { hapticSuccess, hapticCelebration } from '../../../lib/haptics';
import { LogBloodyModal } from './LogBloodyModal';

/**
 * BloodiesTab - Bloody Mary tracking tab with stats, badges, and history
 */
export function BloodiesTab() {
  // Load bloodies from localStorage
  const [bloodies, setBloodies] = useState(() => {
    const saved = localStorage.getItem('hitseeker_bloodies');
    return saved ? JSON.parse(saved) : [];
  });

  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [newBadges, setNewBadges] = useState([]);

  // Save bloodies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hitseeker_bloodies', JSON.stringify(bloodies));
  }, [bloodies]);

  // Calculate earned badges
  const earnedBadges = checkBloodyBadges(bloodies);

  // Get today's count
  const today = new Date().toDateString();
  const todayCount = bloodies.filter(b => new Date(b.timestamp).toDateString() === today).length;

  // Handle new bloody submission
  const handleLogBloody = (bloodyData) => {
    const newBloody = {
      id: Date.now().toString(),
      ...bloodyData
    };

    // Check for new badges before adding
    const oldEarned = checkBloodyBadges(bloodies);
    const newBloodies = [...bloodies, newBloody];
    const newEarned = checkBloodyBadges(newBloodies);

    // Find newly earned badges
    const justEarned = [];
    newEarned.forEach(badgeId => {
      if (!oldEarned.has(badgeId)) {
        justEarned.push(BLOODY_BADGES.find(b => b.id === badgeId));
      }
    });

    setBloodies(newBloodies);
    hapticSuccess();

    // Build toast message parts
    const parts = [];
    if (bloodyData.spice > 0) parts.push(`${bloodyData.spice}🔥`);
    if (bloodyData.rating > 0) parts.push(`${bloodyData.rating}⭐`);
    const prefix = parts.length > 0 ? `${parts.join(' ')} ` : '';

    toast.success(`${prefix}Bloody at ${bloodyData.location}`, {
      icon: <GlassWater size={18} className="text-red-400" />,
    });

    // Show badge unlock after a short delay
    if (justEarned.length > 0) {
      setTimeout(() => {
        hapticCelebration();
        setNewBadges(justEarned);
      }, 1500);
    }
  };

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
        <div className="bg-[#1a1a1a] rounded p-4 text-center border border-[#333]">
          <div className="text-4xl font-bold text-white">{bloodies.length}</div>
          <div className="text-gray-500 text-sm">Lifetime</div>
        </div>
        <div className="bg-[#1a1a1a] rounded p-4 text-center border border-[#333]">
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

      {/* Recent Bloodies */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Recent</h2>
        {bloodies.length === 0 ? (
          <div className="text-center py-8 bg-[#1a1a1a] rounded border border-[#333]">
            <GlassWater size={40} className="mx-auto text-[#444] mb-3" />
            <p className="text-[#888] mb-1">No bloodies logged yet</p>
            <p className="text-[#666] text-sm">Tap the button above to log your first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bloodies.slice(-5).reverse().map(bloody => (
              <div key={bloody.id} className="bg-[#1a1a1a] rounded p-3 border border-[#333]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white font-medium">{bloody.location}</div>
                    <div className="text-gray-500 text-xs">
                      {formatRelativeTime(bloody.timestamp)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {bloody.rating > 0 && (
                      <span className="text-yellow-400 text-sm">{'★'.repeat(bloody.rating)}</span>
                    )}
                    {bloody.spice > 0 && (
                      <span className="flex text-orange-500">
                        {[...Array(bloody.spice)].map((_, i) => <Flame key={i} size={14} fill="currentColor" />)}
                      </span>
                    )}
                  </div>
                </div>
                {bloody.notes && (
                  <div className="text-gray-400 text-sm mt-1 italic">"{bloody.notes}"</div>
                )}
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

      {/* Badge Unlock Modal */}
      <BadgeUnlockModal
        badges={newBadges}
        onDismiss={() => setNewBadges(prev => prev.slice(1))}
      />
    </div>
  );
}
