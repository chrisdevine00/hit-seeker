import React from 'react';
import { formatRelativeTime } from '../../../utils';

/**
 * NoteCard - Compact card for displaying a note
 * Photo thumbnail on the right, click to open detail modal
 */
export function NoteCard({ note, onClick, getPhotoUrl }) {
  // Check both type field and legacy VP: prefix for backwards compatibility
  const isVP = note.type === 'vp' || note.machine?.startsWith('VP:');
  const isBloody = note.type === 'bloody';

  // Handle title for VP notes - fall back to parsing machine field for legacy notes
  const getTitle = () => {
    if (isBloody) return 'Bloody Mary';
    if (isVP) {
      if (note.vpGameName || note.vpGame) return note.vpGameName || note.vpGame;
      if (note.machine?.startsWith('VP:')) return note.machine.replace('VP:', '').trim();
      return note.machine || 'Video Poker';
    }
    return note.machine || 'Unknown';
  };

  const title = getTitle();
  const photoUrl = note.photo_path && getPhotoUrl ? getPhotoUrl(note.photo_path) : null;

  // Build VP subtitle only with available fields
  const getSubtitle = () => {
    if (!isVP) return null;
    const parts = [];
    if (note.vpPayTable) parts.push(note.vpPayTable);
    if (note.vpReturn) parts.push(`${note.vpReturn}%`);
    return parts.length > 0 ? parts.join(' • ') : null;
  };
  const subtitle = getSubtitle();

  // Get badge color based on type
  const getBadgeClass = () => {
    if (isBloody) return 'bg-red-600 text-white';
    if (isVP) return 'bg-blue-600 text-white';
    return 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black';
  };

  // Get 3D card class based on type
  const getCardClass = () => {
    if (note.playable) return 'card-3d-tier1';
    if (isBloody) return 'card-3d-bloody';
    if (isVP) return 'card-3d-vp';
    return 'card-3d-slot';
  };

  return (
    <button
      onClick={() => onClick(note)}
      className={`${getCardClass()} w-full p-3 text-left flex items-center gap-3`}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getBadgeClass()}`}>
            {isBloody ? 'BLOODY' : isVP ? 'VP' : 'SLOT'}
          </span>
          {note.playable && (
            <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/20 px-1.5 py-0.5 rounded-full">
              PLAYABLE
            </span>
          )}
        </div>

        <p className="text-white font-semibold truncate">{title}</p>

        {subtitle && <p className="text-[#d4a855] text-sm">{subtitle}</p>}

        {/* Bloody rating preview */}
        {isBloody && note.bloodyRating > 0 && (
          <span className="text-yellow-400 text-xs">
            {'★'.repeat(note.bloodyRating)}{'☆'.repeat(5 - note.bloodyRating)}
          </span>
        )}

        <p className="text-[#888] text-sm truncate">{note.casino || 'Unknown casino'}</p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#666] text-xs">{formatRelativeTime(note.created_at)}</span>
          {note.profiles?.display_name && (
            <span className="text-[#555] text-xs">• {note.profiles.display_name}</span>
          )}
        </div>
      </div>

      {/* Photo thumbnail (right side) */}
      {photoUrl && (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#0d0d0d] shrink-0">
          <img src={photoUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </button>
  );
}
