import React, { useState } from 'react';
import { ChevronRight, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { theme } from '../lib/theme';

export function TripSelectionScreen() {
  const { trips, loading, createTrip, joinTrip, selectTrip } = useTrip();
  const { signOut, profile, authTimeout, user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newTripName.trim()) return;
    setCreating(true);
    await createTrip(newTripName.trim());
    setCreating(false);
    setShowCreate(false);
    setNewTripName('');
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setCreating(true);
    setError('');
    const result = await joinTrip(joinCode.trim());
    if (result.error) {
      setError(result.error);
    } else {
      setShowJoin(false);
      setJoinCode('');
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: theme.bg.primary }}>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="text-white">Hit</span>
          <span style={{ color: theme.accent }}>Seeker</span>
        </h1>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: theme.accent }} />
      </div>
    );
  }

  // Show error if auth timed out
  if (authTimeout && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: theme.bg.primary }}>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="text-white">Hit</span>
          <span style={{ color: theme.accent }}>Seeker</span>
        </h1>
        <p className="text-white mb-2">Connection timed out</p>
        <p className="text-gray-400 text-sm mb-6 text-center">Having trouble connecting. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-lg font-semibold"
          style={{ background: theme.accent, color: '#000' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 pb-6"
      style={{ background: theme.bg.primary, paddingTop: 'calc(var(--sat, 0px) + 24px)' }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span className="text-white">Hit</span>
              <span style={{ color: theme.accent }}>Seeker</span>
            </h1>
            <p className="text-sm" style={{ color: theme.text.secondary }}>Welcome, {profile?.display_name || 'User'}</p>
          </div>
          <button
            onClick={signOut}
            className="p-2 transition-colors"
            style={{ color: theme.text.muted }}
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Trips List */}
        {trips.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Your Trips</h2>
            <div className="space-y-2">
              {trips.map(trip => (
                <button
                  key={trip.id}
                  onClick={() => selectTrip(trip)}
                  className="w-full rounded p-4 text-left transition-colors"
                  style={{ background: theme.bg.card, border: `1px solid ${theme.border}` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{trip.name}</h3>
                      <p className="text-sm" style={{ color: theme.text.muted }}>
                        {trip.role === 'owner' ? 'Owner' : 'Member'}
                      </p>
                    </div>
                    <ChevronRight size={20} style={{ color: theme.text.muted }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Create/Join Buttons */}
        <div className="space-y-3">
          {!showCreate && !showJoin && (
            <>
              <button
                onClick={() => setShowCreate(true)}
                className="w-full font-semibold py-4 rounded transition-colors"
                style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDim} 100%)`, color: '#000' }}
              >
                Create New Trip
              </button>
              <button
                onClick={() => setShowJoin(true)}
                className="w-full font-semibold py-4 rounded transition-colors"
                style={{ background: theme.bg.card, color: theme.text.primary, border: `1px solid ${theme.border}` }}
              >
                Join with Code
              </button>
            </>
          )}

          {/* Create Form */}
          {showCreate && (
            <div className="rounded p-4" style={{ background: theme.bg.card, border: `1px solid ${theme.border}` }}>
              <h3 className="font-semibold text-white mb-3">Create New Trip</h3>
              <input
                type="text"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder="Trip name (e.g., Vegas January 2025)"
                className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-gray-500 mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowCreate(false); setNewTripName(''); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newTripName.trim() || creating}
                  className="flex-1 bg-[#d4a855] hover:bg-[#a67c3d] disabled:opacity-50 text-white py-2 rounded flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create
                </button>
              </div>
            </div>
          )}

          {/* Join Form */}
          {showJoin && (
            <div className="bg-[#161616] rounded p-4 border border-[#333]">
              <h3 className="font-semibold text-white mb-3">Join a Trip</h3>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter share code"
                className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-gray-500 mb-3 uppercase"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowJoin(false); setJoinCode(''); setError(''); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoin}
                  disabled={!joinCode.trim() || creating}
                  className="flex-1 bg-[#d4a855] hover:bg-[#a67c3d] disabled:opacity-50 text-white py-2 rounded flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Join
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
