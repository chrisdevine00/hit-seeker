import React, { useState } from 'react';
import { ChevronDown, Flame, Edit3, Trash2, X, Camera } from 'lucide-react';
import { Button } from '../../../components/ui';
import { formatRelativeTime } from '../../../utils';

/**
 * NoteCard - Displays a spot/note card for Slots, VP, or Bloody Mary
 *
 * @param {Object} note - The note object with type, casino, machine/game info, etc.
 * @param {Function} onEdit - Callback when edit is clicked (receives note)
 * @param {Function} onDelete - Callback when delete is clicked (receives note id)
 * @param {boolean} isOwn - Whether the current user owns this note
 * @param {Function} getPhotoUrl - Function to get public URL for photo_path
 */
export function NoteCard({ note, onEdit, onDelete, isOwn, getPhotoUrl }) {
  const [expanded, setExpanded] = useState(false);
  const [showFullPhoto, setShowFullPhoto] = useState(false);
  const isVP = note.type === 'vp';
  const isBloody = note.type === 'bloody';
  const title = isBloody ? 'Bloody Mary' : isVP ? (note.vpGameName || note.vpGame) : note.machine;
  const photoUrl = note.photo_path && getPhotoUrl ? getPhotoUrl(note.photo_path) : null;
  const subtitle = isVP ? `${note.vpPayTable} • ${note.vpReturn}%` : null;

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
    <div className={`${getCardClass()} overflow-hidden`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getBadgeClass()}`}>
                {isBloody ? 'BLOODY' : isVP ? 'VP' : 'SLOT'}
              </span>
              {note.playable && <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/20 px-2 py-0.5 rounded-full">PLAYABLE</span>}
              <span className="text-white font-semibold truncate">{title}</span>
            </div>
            {subtitle && <p className="text-[#d4a855] text-sm mb-1">{subtitle}</p>}
            {/* Bloody rating display */}
            {isBloody && (note.bloodyRating > 0 || note.bloodySpice > 0) && (
              <div className="flex items-center gap-3 mb-1">
                {note.bloodyRating > 0 && (
                  <span className="text-yellow-400 text-sm">
                    {'★'.repeat(note.bloodyRating)}{'☆'.repeat(5 - note.bloodyRating)}
                  </span>
                )}
                {note.bloodySpice > 0 && (
                  <span className="text-orange-500 text-sm flex items-center gap-0.5">
                    {[...Array(note.bloodySpice)].map((_, i) => <Flame key={i} size={14} fill="currentColor" />)}
                  </span>
                )}
              </div>
            )}
            <p className="text-[#bbb] text-sm">{note.casino || 'Unknown casino'}</p>
            {note.denomination && <p className="text-[#888] text-xs">{note.denomination} denomination</p>}
            {/* Photo thumbnail */}
            {photoUrl && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowFullPhoto(true); }}
                className="mt-2 flex items-center gap-2 text-[#888] hover:text-white transition-colors"
              >
                <div className="w-12 h-12 rounded overflow-hidden border border-[#333] relative">
                  <img src={photoUrl} alt="Note photo" className="w-full h-full object-cover" />
                </div>
                <Camera size={14} className="text-[#d4a855]" />
              </button>
            )}
            {note.profiles?.display_name && (
              <p className="text-[#888] text-xs mt-1">by {note.profiles.display_name}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[#888] text-xs">{formatRelativeTime(note.created_at)}</p>
            <ChevronDown size={16} className={`text-[#888] mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#222] pt-3">
          {note.location && <p className="text-sm text-[#ccc] mb-2"><span className="text-[#888]">Location:</span> {note.location}</p>}
          {note.state && <p className="text-sm text-[#ccc] mb-3"><span className="text-[#888]">{isBloody ? 'Notes:' : isVP ? 'Notes:' : 'State:'}</span> {note.state}</p>}
          {isOwn && (
            <div className="flex gap-2">
              <Button onClick={() => onEdit(note)} variant="secondary" size="sm" className="flex-1 flex items-center justify-center gap-1">
                <Edit3 size={14} /> Edit
              </Button>
              <Button onClick={() => onDelete(note.id)} variant="danger-subtle" size="sm" className="flex items-center gap-1">
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Full Photo Modal */}
      {showFullPhoto && photoUrl && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullPhoto(false)}
        >
          <button
            onClick={() => setShowFullPhoto(false)}
            className="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-full"
          >
            <X size={24} />
          </button>
          <div className="max-w-full max-h-full">
            <img
              src={photoUrl}
              alt={title}
              className="max-w-full max-h-[80vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-center text-white mt-2 text-sm">{title} at {note.casino}</p>
          </div>
        </div>
      )}
    </div>
  );
}
