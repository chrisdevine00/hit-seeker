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
  User,
  Users,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTrip } from '../../../context/TripContext';
import { useUI } from '../../../context/UIContext';
import { useSlots } from '../../../context/SlotsContext';
import { useNotes, useCheckIns, useBloodies } from '../../../hooks';
import { Button, FilledMapPin } from '../../../components/ui';
import { NoteForm, NoteCard, NoteDetailModal } from '../../spots';
import {
  HexBadge,
  BadgeDetailModal,
  SLOT_BADGES,
  VP_BADGES,
  TRIP_BADGES,
  BLOODY_BADGES,
  useBadges,
} from '../../../badges';
import { machines } from '../../../data/machines';
import { vegasCasinos } from '../../../data/casinos';
import { getTierColors, TAB_IDS } from '../../../constants';

/**
 * TripTab - Trip overview and management
 * Shows check-in status, team locations, hot opportunities, and recent activity
 */
export function TripTab({
  geoStatus,
  detectCasino,
  recentActivity,
  prefillMachine,
  setPrefillMachine,
  currentCasinoInfo,
  setEditingNote,
}) {
  const { user } = useAuth();
  const { currentTrip, tripMembers } = useTrip();
  const {
    showNoteForm,
    setShowNoteForm,
    setConfirmDelete,
    setActiveTab,
  } = useUI();
  const { selectMachine } = useSlots();
  const { notes, loading: notesLoading, addNote, refresh: refreshNotes, getNotePhotoUrl } = useNotes();
  const { myCheckIn, checkOut, getMembersAtCasino } = useCheckIns();
  const { bloodies } = useBloodies();
  const { earnedBadges } = useBadges();

  // Local state for badge UI
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [expandedBadgeSection, setExpandedBadgeSection] = useState(null);

  // Note detail modal
  const [selectedNote, setSelectedNote] = useState(null);

  // View mode toggle: 'my' or 'team'
  const [viewMode, setViewMode] = useState('my');

  // Pagination for notes
  const [notesPage, setNotesPage] = useState(1);
  const [teamNotesPage, setTeamNotesPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handleAddNote = async (noteData, photoFile = null) => {
    await addNote(noteData, photoFile);
    setShowNoteForm(false);
    setPrefillMachine(null);
  };

  // Get hot opportunities for today
  const getHotOpportunities = () => {
    const todaySlotNotes = notes.filter(n => {
      const noteDate = new Date(n.created_at).toDateString();
      const today = new Date().toDateString();
      if (noteDate !== today) return false;
      if (n.type === 'vp' || n.machine?.startsWith('VP:')) return false;
      const noteMachine = machines.find(m => m?.name === n.machine || m?.shortName === n.machine);
      return noteMachine && (noteMachine.tier === 1 || noteMachine.tier === 2);
    });

    const todayVPNotes = notes.filter(n => {
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

  // Convert bloodies to note-like objects for unified feed
  const bloodiesToNotes = (bloodiesArr) => bloodiesArr.map(b => ({
    id: `bloody-${b.id}`,
    _bloodyId: b.id, // Keep original ID for detail modal
    type: 'bloody',
    casino: b.location,
    bloodyRating: b.rating,
    bloodySpice: b.spice,
    content: b.notes,
    created_at: b.created_at,
    user_id: b.user_id,
    profiles: b.profiles,
  }));

  // Combined activity feed (notes + bloodies) sorted by date
  const allActivity = [...notes, ...bloodiesToNotes(bloodies)]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const myActivity = allActivity.filter(item => item.user_id === user?.id);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#333] -mx-4 mb-4">
        <h1 className="text-2xl font-bold text-white">Trip</h1>
        <p className="text-gray-500 text-sm">Manage your scouting trip</p>
      </div>

      <div className="space-y-4">
        {/* View Mode Toggle */}
        <div className="flex gap-1 p-1 bg-[#0d0d0d] rounded-lg">
          <button
            onClick={() => setViewMode('my')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'my'
                ? 'bg-[#d4a855] text-black'
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            <User size={16} />
            Me
          </button>
          <button
            onClick={() => setViewMode('team')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'team'
                ? 'bg-[#d4a855] text-black'
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            <Users size={16} />
            Team
          </button>
        </div>

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

        {/* Content based on view mode */}
        {viewMode === 'my' ? (
          /* MY DATA VIEW */
          <>
            {/* Current Trip Info */}
            <div className="card-3d-trip p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#aaa] text-xs uppercase tracking-wider mb-1">Current Trip</p>
                  <h2 className="text-xl font-bold text-white">{currentTrip?.name || 'No Trip'}</h2>
                </div>
                {currentTrip?.share_code && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentTrip.share_code);
                    }}
                    className="flex items-center gap-1.5 bg-[#2a2a2a] px-3 py-1.5 rounded text-[#d4a855] text-sm hover:bg-[#333] transition-colors"
                    title="Copy share code"
                  >
                    <Copy size={14} />
                    {currentTrip.share_code}
                  </button>
                )}
              </div>

              {/* Trip Stats - My stats */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#222]">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{tripMembers.length}</p>
                  <p className="text-[#aaa] text-xs">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#d4a855]">{notes.filter(n => n.user_id === user?.id).length}</p>
                  <p className="text-[#aaa] text-xs">My Notes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{bloodies.filter(b => b.user_id === user?.id).length}</p>
                  <p className="text-[#aaa] text-xs">My Bloodies</p>
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

            {/* Badges Section - More Prominent */}
            <div className="card-3d p-4">
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-[#d4a855]" />
                <p className="text-[#aaa] text-xs uppercase tracking-wider">My Achievements</p>
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

              {/* Bloody Badges */}
              <div className="border-t border-[#222] mb-2">
                <button
                  onClick={() => setExpandedBadgeSection(expandedBadgeSection === 'bloody' ? null : 'bloody')}
                  className="w-full flex items-center justify-between py-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">Bloody Badges</span>
                    <span className="text-[#666] text-xs">{earnedBadges.bloody?.size || 0}/{BLOODY_BADGES.length}</span>
                  </div>
                  {expandedBadgeSection === 'bloody' ? (
                    <ChevronUp size={18} className="text-[#888]" />
                  ) : (
                    <ChevronDown size={18} className="text-[#888]" />
                  )}
                </button>
                {expandedBadgeSection === 'bloody' && (
                  <div className="grid grid-cols-5 gap-2 pt-2 pb-3">
                    {BLOODY_BADGES.map(badge => (
                      <HexBadge
                        key={badge.id}
                        badge={badge}
                        earned={earnedBadges.bloody?.has(badge.id)}
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

            {/* My Activity - with pagination */}
            <div className="card-3d p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#aaa] text-xs uppercase tracking-wider">My Activity</p>
                <Button onClick={() => setShowNoteForm(true)} variant="primary" size="sm">
                  + Add
                </Button>
              </div>

              {showNoteForm && (
                <NoteForm
                  onSubmit={handleAddNote}
                  onCancel={() => { setShowNoteForm(false); setPrefillMachine(null); }}
                  prefillMachine={prefillMachine}
                  currentCasino={currentCasinoInfo?.name}
                />
              )}

              {(() => {
                const totalPages = Math.ceil(myActivity.length / ITEMS_PER_PAGE);
                const paginatedItems = myActivity.slice((notesPage - 1) * ITEMS_PER_PAGE, notesPage * ITEMS_PER_PAGE);

                if (notesLoading) {
                  return (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-6 h-6 text-[#d4a855] animate-spin" />
                    </div>
                  );
                }
                if (myActivity.length === 0) {
                  return (
                    <div className="text-center py-4">
                      <StickyNote size={24} className="mx-auto text-[#444] mb-2" />
                      <p className="text-[#aaa] text-sm">No activity yet</p>
                    </div>
                  );
                }
                return (
                  <>
                    <div className="space-y-3">
                      {paginatedItems.map(item => (
                        <NoteCard
                          key={item.id}
                          note={item}
                          onClick={setSelectedNote}
                          getPhotoUrl={getNotePhotoUrl}
                        />
                      ))}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-[#222]">
                        <button
                          onClick={() => setNotesPage(p => Math.max(1, p - 1))}
                          disabled={notesPage === 1}
                          className="p-1.5 rounded bg-[#1a1a1a] text-[#aaa] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="text-[#aaa] text-sm">{notesPage} / {totalPages}</span>
                        <button
                          onClick={() => setNotesPage(p => Math.min(totalPages, p + 1))}
                          disabled={notesPage === totalPages}
                          className="p-1.5 rounded bg-[#1a1a1a] text-[#aaa] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </>
        ) : (
          /* TEAM DATA VIEW */
          <>
            {/* Team Stats */}
            <div className="card-3d-trip p-4">
              <p className="text-[#aaa] text-xs uppercase tracking-wider mb-3">Team Stats</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{tripMembers.length}</p>
                  <p className="text-[#aaa] text-xs">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#d4a855]">{notes.length}</p>
                  <p className="text-[#aaa] text-xs">Notes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{bloodies.length}</p>
                  <p className="text-[#aaa] text-xs">Bloodies</p>
                </div>
              </div>
            </div>

            {/* Team Locations */}
            <div className="card-3d p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#aaa] text-xs uppercase tracking-wider">Team Locations</p>
                <span className="text-[#aaa] text-xs">{tripMembers.length} members</span>
              </div>
              <div className="space-y-2">
                {tripMembers.map((member) => {
                  const memberCasino = vegasCasinos.find(c => getMembersAtCasino(c.id).some(m => m.user_id === member.user_id));
                  const isYou = member.user_id === user?.id;
                  return (
                    <div key={member.user_id} className="flex items-center gap-3">
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

            {/* All Team Activity - with pagination */}
            {(() => {
              const totalPages = Math.ceil(allActivity.length / ITEMS_PER_PAGE);
              const paginatedItems = allActivity.slice((teamNotesPage - 1) * ITEMS_PER_PAGE, teamNotesPage * ITEMS_PER_PAGE);

              return (
                <div className="card-3d p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <p className="text-[#aaa] text-xs uppercase tracking-wider">Team Activity</p>
                      {allActivity.length > 0 && (
                        <span className="text-[#666] text-xs">{allActivity.length} total</span>
                      )}
                    </div>
                    <button onClick={refreshNotes} className="no-animate p-1 text-[#666] hover:text-white">
                      <RefreshCw size={14} />
                    </button>
                  </div>

                  {notesLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-6 h-6 text-[#d4a855] animate-spin" />
                    </div>
                  ) : allActivity.length === 0 ? (
                    <div className="text-center py-4">
                      <StickyNote size={24} className="mx-auto text-[#444] mb-2" />
                      <p className="text-[#aaa] text-sm">No team activity yet</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {paginatedItems.map(item => (
                          <NoteCard
                            key={item.id}
                            note={item}
                            onClick={setSelectedNote}
                            getPhotoUrl={getNotePhotoUrl}
                          />
                        ))}
                      </div>
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-[#222]">
                          <button
                            onClick={() => setTeamNotesPage(p => Math.max(1, p - 1))}
                            disabled={teamNotesPage === 1}
                            className="p-1.5 rounded bg-[#1a1a1a] text-[#aaa] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <span className="text-[#aaa] text-sm">{teamNotesPage} / {totalPages}</span>
                          <button
                            onClick={() => setTeamNotesPage(p => Math.min(totalPages, p + 1))}
                            disabled={teamNotesPage === totalPages}
                            className="p-1.5 rounded bg-[#1a1a1a] text-[#aaa] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        earned={selectedBadge && earnedBadges[selectedBadge.domain]?.has(selectedBadge.id)}
        onClose={() => setSelectedBadge(null)}
      />

      {/* Note Detail Modal */}
      <NoteDetailModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onEdit={setEditingNote}
        onDelete={setConfirmDelete}
        isOwn={selectedNote?.user_id === user?.id}
        getPhotoUrl={getNotePhotoUrl}
      />
    </div>
  );
}
