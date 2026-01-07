import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Navigation,
  Loader2,
  MapPin,
  StickyNote,
  Target,
  RefreshCw,
  Copy,
  Award,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTrip } from '../../../context/TripContext';
import { useUI } from '../../../context/UIContext';
import { useSlots } from '../../../context/SlotsContext';
import { useNotes, useCheckIns } from '../../../hooks';
import { Button, FilledMapPin } from '../../../components/ui';
import { NoteForm, NoteCard } from '../../spots';
import {
  HexBadge,
  BadgeDetailModal,
  SLOT_BADGES,
  VP_BADGES,
  TRIP_BADGES,
  useBadges,
} from '../../../badges';
import { machines } from '../../../data/machines';
import { vegasCasinos } from '../../../data/casinos';
import { getTierColors, TAB_IDS } from '../../../constants';
import { formatRelativeTime } from '../../../utils';

// Demo data with relative timestamps - created once at module load
const DEMO_NOW = Date.now();
const DEMO_NOTES = [
  { id: 'demo1', machine: 'Ocean Magic Grand', content: '4 bubbles in rows 1-2, near high limit', casino: 'Flamingo', created_at: new Date(DEMO_NOW).toISOString() },
  { id: 'demo2', machine: 'Piggy Bankin\'', content: 'Both pigs fat by sports book', casino: 'LINQ', created_at: new Date(DEMO_NOW).toISOString() },
  { id: 'demo3', machine: 'Wheel of Fortune MHB', content: 'Major at $485/$500 (97%)', casino: 'Caesars Palace', created_at: new Date(DEMO_NOW - 3600000).toISOString() },
  { id: 'demo4', machine: 'Lucky Wealth Cat', content: '6 orbs stacked low', casino: 'Paris', created_at: new Date(DEMO_NOW - 86400000).toISOString() },
  { id: 'demo5', machine: 'Buffalo Gold', content: 'Just for fun, hit bonus', casino: 'Harrahs', created_at: new Date(DEMO_NOW - 86400000 * 2).toISOString() },
];

const DEMO_MEMBERS = [
  { user_id: 'demo1', display_name: 'You', role: 'owner' },
  { user_id: 'demo2', display_name: 'Mike', role: 'member' },
  { user_id: 'demo3', display_name: 'Sarah', role: 'member' },
];

/**
 * TripTab - Trip overview and management
 * Shows check-in status, team locations, hot opportunities, and recent activity
 */
export function TripTab({
  geoStatus,
  detectCasino,
  recentActivity,
  filteredNotes,
  prefillMachine,
  setPrefillMachine,
  currentCasinoInfo,
  setEditingNote,
}) {
  const { user } = useAuth();
  const { currentTrip, tripMembers } = useTrip();
  const {
    tripSubTab,
    setTripSubTab,
    showNoteForm,
    setShowNoteForm,
    setConfirmDelete,
    setActiveTab,
  } = useUI();
  const { selectMachine } = useSlots();
  const { notes, loading: notesLoading, addNote, refresh: refreshNotes } = useNotes();
  const { myCheckIn, checkOut, getMembersAtCasino } = useCheckIns();
  const { earnedBadges } = useBadges();

  // Local state for badge UI
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [expandedBadgeSection, setExpandedBadgeSection] = useState(null);

  const handleAddNote = async (noteData) => {
    await addNote(noteData);
    setShowNoteForm(false);
    setPrefillMachine(null);
  };

  // Use demo data when no real data exists
  const demoNotes = notes.length === 0 ? DEMO_NOTES : notes;
  const demoMembers = tripMembers.length <= 1 ? DEMO_MEMBERS : tripMembers;
  const isDemo = notes.length === 0;

  // Get hot opportunities for today
  const getHotOpportunities = () => {
    const todaySlotNotes = demoNotes.filter(n => {
      const noteDate = new Date(n.created_at).toDateString();
      const today = new Date().toDateString();
      if (noteDate !== today) return false;
      if (n.type === 'vp' || n.machine?.startsWith('VP:')) return false;
      const noteMachine = machines.find(m => m?.name === n.machine || m?.shortName === n.machine);
      return noteMachine && (noteMachine.tier === 1 || noteMachine.tier === 2);
    });

    const todayVPNotes = demoNotes.filter(n => {
      const noteDate = new Date(n.created_at).toDateString();
      const today = new Date().toDateString();
      if (noteDate !== today) return false;
      return (n.type === 'vp' || n.machine?.startsWith('VP:')) && n.vpReturn >= 99;
    });

    const todayVPActivity = recentActivity.filter(a => {
      const actDate = new Date(a.timestamp).toDateString();
      const today = new Date().toDateString();
      return actDate === today && a.type === 'vp' && a.vpReturn >= 99;
    });

    return [
      ...todaySlotNotes.map(n => ({ ...n, itemType: 'slot' })),
      ...todayVPNotes.map(n => ({ ...n, itemType: 'vp' })),
      ...todayVPActivity.map(a => ({ ...a, itemType: 'vp-activity' })),
    ];
  };

  const hotItems = getHotOpportunities();

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#333] -mx-4 mb-4">
        <h1 className="text-2xl font-bold text-white">Trip</h1>
        <p className="text-gray-500 text-sm">Manage your scouting trip</p>
      </div>

      <div className="space-y-4">
        {/* Quick Check-in Button */}
        {!myCheckIn ? (
          <button
            onClick={detectCasino}
            disabled={geoStatus === 'loading'}
            className="w-full bg-gradient-to-r from-[#d4a855] to-amber-600 text-black py-3.5 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#d4a855]/20"
          >
            {geoStatus === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
            {geoStatus === 'loading' ? 'Detecting Location...' : 'Check In to a Casino'}
          </button>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <MapPin size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 font-medium">Checked in</p>
                <p className="text-white text-sm">{myCheckIn.casino_name}</p>
              </div>
            </div>
            <button
              onClick={checkOut}
              className="text-[#888] hover:text-white text-sm px-3 py-1.5 rounded bg-[#1a1a1a] hover:bg-[#252525] transition-colors"
            >
              Check Out
            </button>
          </div>
        )}

        {/* Overview Content */}
        {tripSubTab !== 'notes' && (
          <>
            {isDemo && (
              <div className="bg-amber-900/20 border border-amber-500/30 rounded p-3 text-center">
                <p className="text-amber-400 text-sm">Demo Mode - Showing sample data</p>
              </div>
            )}

            {/* Current Trip Info */}
            <div className="card-3d-trip p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#aaa] text-xs uppercase tracking-wider mb-1">Current Trip</p>
                  <h2 className="text-xl font-bold text-white">{currentTrip?.name || 'Vegas January 2025'}</h2>
                </div>
                {(currentTrip?.share_code || isDemo) && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentTrip?.share_code || 'DEMO123');
                    }}
                    className="flex items-center gap-1.5 bg-[#2a2a2a] px-3 py-1.5 rounded text-[#d4a855] text-sm hover:bg-[#333] transition-colors"
                    title="Copy share code"
                  >
                    <Copy size={14} />
                    {currentTrip?.share_code || 'DEMO123'}
                  </button>
                )}
              </div>

              {/* Trip Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#222]">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{demoMembers.length}</p>
                  <p className="text-[#aaa] text-xs">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#d4a855]">{demoNotes.length}</p>
                  <p className="text-[#aaa] text-xs">Notes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">
                    {demoNotes.filter(n => {
                      const noteDate = new Date(n.created_at).toDateString();
                      const today = new Date().toDateString();
                      return noteDate === today;
                    }).length}
                  </p>
                  <p className="text-[#aaa] text-xs">Today</p>
                </div>
              </div>
            </div>

            {/* Hot Opportunities */}
            {hotItems.length > 0 && (
              <div className="bg-gradient-to-br from-amber-900/20 to-[#161616] border border-amber-500/30 rounded p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} className="text-amber-400" />
                  <p className="text-amber-400 text-sm font-semibold">Hot Opportunities Today</p>
                </div>
                <div className="space-y-2">
                  {hotItems.slice(0, 4).map((item, idx) => {
                    const isVP = item.itemType === 'vp' || item.itemType === 'vp-activity';
                    const noteMachine = !isVP ? machines.find(m => m?.name === item.machine || m?.shortName === item.machine) : null;
                    const title = isVP ? (item.vpGameName || item.machine?.replace('VP: ', '')) : item.machine;
                    const subtitle = isVP ? `${item.vpPayTable} • ${item.vpReturn}%` : null;

                    return (
                      <button
                        key={`hot-${item.itemType}-${item.id || idx}`}
                        onClick={() => {
                          if (!isVP && noteMachine) {
                            selectMachine(noteMachine);
                            setActiveTab(TAB_IDS.HUNT);
                          } else if (isVP) {
                            setActiveTab(TAB_IDS.VP);
                          }
                        }}
                        className="w-full bg-[#0d0d0d] rounded p-3 text-left hover:bg-[#1a1a1a] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'}`}>
                              {isVP ? 'VP' : 'SLOT'}
                            </span>
                            {!isVP && noteMachine && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${getTierColors(noteMachine?.tier).badgeOutline}`}>
                                Tier {noteMachine?.tier}
                              </span>
                            )}
                            {isVP && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                                {item.vpReturn}%
                              </span>
                            )}
                            <span className="text-white text-sm font-medium">{title}</span>
                          </div>
                          <ChevronRight size={14} className="text-[#aaa]" />
                        </div>
                        {subtitle && <p className="text-[#d4a855] text-xs">{subtitle}</p>}
                        {!isVP && item.content && <p className="text-[#aaa] text-xs truncate">{item.content}</p>}
                        {item.casino && (
                          <p className="text-amber-400/70 text-xs mt-1">@ {item.casino}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Team Locations */}
            {demoMembers.length > 1 && (
              <div className="card-3d p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#aaa] text-xs uppercase tracking-wider">Team Locations</p>
                  <span className="text-[#aaa] text-xs">{demoMembers.length} members</span>
                </div>
                <div className="space-y-2">
                  {demoMembers.map((member, idx) => {
                    const memberCasino = isDemo
                      ? (idx === 1 ? vegasCasinos.find(c => c.name === 'Flamingo') : idx === 2 ? vegasCasinos.find(c => c.name === 'LINQ') : null)
                      : vegasCasinos.find(c => getMembersAtCasino(c.id).some(m => m.user_id === member.user_id));
                    const isYou = isDemo ? idx === 0 : member.user_id === user?.id;
                    return (
                      <div key={member.user_id || `demo-member-${idx}`} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          isYou ? 'bg-[#d4a855]' : 'bg-[#333]'
                        }`}>
                          {member.display_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {member.display_name || 'Unknown'}
                            {isYou && <span className="text-[#aaa] font-normal"> (you)</span>}
                          </p>
                        </div>
                        {memberCasino ? (
                          <span className="text-emerald-400 text-xs bg-emerald-400/10 px-2 py-1 rounded-full">
                            {memberCasino.name}
                          </span>
                        ) : (
                          <span className="text-[#aaa] text-xs">Not checked in</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="card-3d p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#aaa] text-xs uppercase tracking-wider">Recent Activity</p>
                <button onClick={() => setTripSubTab('notes')} className="text-[#d4a855] text-xs">View All</button>
              </div>
              {demoNotes.length === 0 && recentActivity.length === 0 ? (
                <div className="text-center py-4">
                  <StickyNote size={24} className="mx-auto text-[#444] mb-2" />
                  <p className="text-[#aaa] text-sm">No activity yet</p>
                  <p className="text-[#555] text-xs mt-1">Spot machines or VP pay tables to track them</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Show recent activity first */}
                  {recentActivity.slice(0, 3).map(activity => {
                    const isVP = activity.type === 'vp';
                    const title = isVP ? activity.vpGameName : activity.machine;
                    const subtitle = isVP ? `${activity.vpPayTable} • ${activity.vpReturn}%` : activity.state;

                    return (
                      <div key={`activity-${activity.id}`} className="bg-[#0d0d0d] rounded p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'}`}>
                              {isVP ? 'VP' : 'SLOT'}
                            </span>
                            <div>
                              <p className="text-white text-sm font-medium">{title}</p>
                              {subtitle && <p className="text-[#d4a855] text-xs">{subtitle}</p>}
                            </div>
                          </div>
                          <span className="text-[#aaa] text-xs whitespace-nowrap">
                            {formatRelativeTime(activity.timestamp)}
                          </span>
                        </div>
                        {activity.casino && (
                          <p className="text-[#aaa] text-xs mt-1 flex items-center gap-1">
                            <FilledMapPin size={10} className="text-[#aaa]" holeColor="#161616" /> {activity.casino}
                            {activity.location && ` • ${activity.location}`}
                          </p>
                        )}
                        {activity.playable && (
                          <span className="inline-block mt-2 text-emerald-400 text-xs font-semibold bg-emerald-400/20 px-2 py-0.5 rounded-full">
                            PLAYABLE
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {/* If no recent activity, show notes */}
                  {recentActivity.length === 0 && demoNotes.slice(0, 3).map(note => {
                    const isVP = note.type === 'vp' || note.machine?.startsWith('VP:');
                    const noteMachine = !isVP ? machines.find(m => m?.name === note.machine || m?.shortName === note.machine) : null;

                    return (
                      <div key={`note-${note.id}`} className="bg-[#0d0d0d] rounded p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'}`}>
                              {isVP ? 'VP' : 'SLOT'}
                            </span>
                            {!isVP && noteMachine && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${getTierColors(noteMachine.tier).badgeOutline}`}>
                                Tier {noteMachine.tier}
                              </span>
                            )}
                            <p className="text-white text-sm font-medium">{note.machine}</p>
                          </div>
                          <span className="text-[#aaa] text-xs whitespace-nowrap">
                            {new Date(note.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[#bbb] text-sm">{note.content || note.state}</p>
                        {note.casino && (
                          <p className="text-[#aaa] text-xs mt-1 flex items-center gap-1">
                            <FilledMapPin size={10} className="text-[#aaa]" holeColor="#161616" /> {note.casino}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Badges Section */}
            <div className="card-3d p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-[#d4a855]" />
                <p className="text-[#aaa] text-xs uppercase tracking-wider">Achievements</p>
              </div>

              {/* Slot Badges */}
              <div className="mb-2">
                <button
                  onClick={() => setExpandedBadgeSection(expandedBadgeSection === 'slot' ? null : 'slot')}
                  className="w-full flex items-center justify-between py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">Slot Badges</span>
                    <span className="text-[#666] text-xs">{earnedBadges.slot?.size || 0}/{SLOT_BADGES.length}</span>
                  </div>
                  {expandedBadgeSection === 'slot' ? (
                    <ChevronUp size={18} className="text-[#888]" />
                  ) : (
                    <ChevronDown size={18} className="text-[#888]" />
                  )}
                </button>
                {expandedBadgeSection === 'slot' && (
                  <div className="grid grid-cols-5 gap-2 pt-2 pb-3">
                    {SLOT_BADGES.map(badge => (
                      <HexBadge
                        key={badge.id}
                        badge={badge}
                        earned={earnedBadges.slot?.has(badge.id)}
                        size="small"
                        onClick={() => setSelectedBadge(badge)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* VP Badges */}
              <div className="border-t border-[#222] mb-2">
                <button
                  onClick={() => setExpandedBadgeSection(expandedBadgeSection === 'vp' ? null : 'vp')}
                  className="w-full flex items-center justify-between py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">VP Badges</span>
                    <span className="text-[#666] text-xs">{earnedBadges.vp?.size || 0}/{VP_BADGES.length}</span>
                  </div>
                  {expandedBadgeSection === 'vp' ? (
                    <ChevronUp size={18} className="text-[#888]" />
                  ) : (
                    <ChevronDown size={18} className="text-[#888]" />
                  )}
                </button>
                {expandedBadgeSection === 'vp' && (
                  <div className="grid grid-cols-5 gap-2 pt-2 pb-3">
                    {VP_BADGES.map(badge => (
                      <HexBadge
                        key={badge.id}
                        badge={badge}
                        earned={earnedBadges.vp?.has(badge.id)}
                        size="small"
                        onClick={() => setSelectedBadge(badge)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Trip Badges */}
              <div className="border-t border-[#222]">
                <button
                  onClick={() => setExpandedBadgeSection(expandedBadgeSection === 'trip' ? null : 'trip')}
                  className="w-full flex items-center justify-between py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">Trip Badges</span>
                    <span className="text-[#666] text-xs">{earnedBadges.trip?.size || 0}/{TRIP_BADGES.length}</span>
                  </div>
                  {expandedBadgeSection === 'trip' ? (
                    <ChevronUp size={18} className="text-[#888]" />
                  ) : (
                    <ChevronDown size={18} className="text-[#888]" />
                  )}
                </button>
                {expandedBadgeSection === 'trip' && (
                  <div className="grid grid-cols-5 gap-2 pt-2 pb-3">
                    {TRIP_BADGES.map(badge => (
                      <HexBadge
                        key={badge.id}
                        badge={badge}
                        earned={earnedBadges.trip?.has(badge.id)}
                        size="small"
                        onClick={() => setSelectedBadge(badge)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Notes View */}
        {tripSubTab === 'notes' && (
          <>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setTripSubTab('overview')}
                className="flex items-center gap-1 text-[#888] hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
                <span className="text-sm">Back</span>
              </button>
              <h2 className="text-lg font-bold text-white">Scouting Notes</h2>
              <div className="flex items-center gap-2">
                <button onClick={refreshNotes} className="no-animate p-2 text-[#bbbbbb] hover:text-white">
                  <RefreshCw size={18} />
                </button>
                <Button onClick={() => setShowNoteForm(true)} variant="primary" size="sm">
                  + Add
                </Button>
              </div>
            </div>

            {showNoteForm && (
              <NoteForm
                onSubmit={handleAddNote}
                onCancel={() => { setShowNoteForm(false); setPrefillMachine(null); }}
                prefillMachine={prefillMachine}
                currentCasino={currentCasinoInfo?.name}
              />
            )}

            {notesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-[#d4a855] animate-spin" />
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                  <StickyNote size={28} className="text-[#444]" />
                </div>
                <p className="text-white font-medium mb-2">No scouting notes yet</p>
                <p className="text-[#aaa] text-sm mb-4 max-w-xs mx-auto">
                  Spot a good machine? Add a note to remember it or share with your team.
                </p>
                <Button
                  onClick={() => setShowNoteForm(true)}
                  variant="primary"
                  size="sm"
                  className="inline-flex items-center gap-2"
                >
                  <StickyNote size={16} />
                  Add Your First Note
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={setEditingNote}
                    onDelete={setConfirmDelete}
                    isOwn={note.user_id === user?.id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        earned={selectedBadge && earnedBadges[selectedBadge.domain]?.has(selectedBadge.id)}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
}
