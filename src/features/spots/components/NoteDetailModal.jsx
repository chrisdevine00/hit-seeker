import React from 'react';
import { X, Edit3, Trash2, Flame, MapPin, Clock, User } from 'lucide-react';
import { Button } from '../../../components/ui';
import { formatRelativeTime } from '../../../utils';

/**
 * NoteDetailModal - Full detail view for a note
 * Shows all note information with edit/delete actions
 */
export function NoteDetailModal({ note, onClose, onEdit, onDelete, isOwn, getPhotoUrl }) {
  if (!note) return null;

  // Check both type field and legacy VP: prefix for backwards compatibility
  const isVP = note.type === 'vp' || note.machine?.startsWith('VP:');
  const isBloody = note.type === 'bloody';

  // Handle title for VP notes
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

  // Get badge styling
  const getBadgeClass = () => {
    if (isBloody) return 'bg-red-600 text-white';
    if (isVP) return 'bg-blue-600 text-white';
    return 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black';
  };

  // Get modal border color
  const getBorderClass = () => {
    if (isBloody) return 'border-red-500/30';
    if (isVP) return 'border-blue-500/30';
    return 'border-[#d4a855]/30';
  };

  const handleDelete = () => {
    if (confirm('Delete this note?')) {
      onDelete(note.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onEdit(note);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-[#1a1a1a] rounded-xl max-w-md w-full max-h-[85vh] overflow-y-auto border ${getBorderClass()}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#333] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded font-medium ${getBadgeClass()}`}>
              {isBloody ? 'BLOODY' : isVP ? 'VP' : 'SLOT'}
            </span>
            {note.playable && (
              <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/20 px-2 py-1 rounded-full">
                PLAYABLE
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-[#888] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Photo (if exists) */}
        {photoUrl && (
          <div className="w-full aspect-video bg-[#0d0d0d]">
            <img src={photoUrl} alt={title} className="w-full h-full object-contain" />
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {isVP && (note.vpPayTable || note.vpReturn) && (
              <p className="text-[#d4a855] text-sm mt-1">
                {[note.vpPayTable, note.vpReturn && `${note.vpReturn}%`].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>

          {/* Bloody Rating & Spice */}
          {isBloody && (note.bloodyRating > 0 || note.bloodySpice > 0) && (
            <div className="flex items-center gap-4">
              {note.bloodyRating > 0 && (
                <div>
                  <p className="text-[#888] text-xs mb-1">Rating</p>
                  <span className="text-yellow-400 text-lg">
                    {'★'.repeat(note.bloodyRating)}{'☆'.repeat(5 - note.bloodyRating)}
                  </span>
                </div>
              )}
              {note.bloodySpice > 0 && (
                <div>
                  <p className="text-[#888] text-xs mb-1">Spice</p>
                  <span className="text-orange-500 text-lg flex items-center gap-0.5">
                    {[...Array(note.bloodySpice)].map((_, i) => (
                      <Flame key={i} size={18} fill="currentColor" />
                    ))}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Casino */}
          <div className="flex items-center gap-2 text-[#bbb]">
            <MapPin size={16} className="text-[#888]" />
            <span>{note.casino || 'Unknown casino'}</span>
          </div>

          {/* Denomination (slots) */}
          {note.denomination && (
            <div className="text-[#888] text-sm">
              {note.denomination} denomination
            </div>
          )}

          {/* Location in casino */}
          {note.location && (
            <div className="bg-[#0d0d0d] rounded-lg p-3">
              <p className="text-[#888] text-xs uppercase tracking-wider mb-1">Location</p>
              <p className="text-white">{note.location}</p>
            </div>
          )}

          {/* State/Notes */}
          {note.state && (
            <div className="bg-[#0d0d0d] rounded-lg p-3">
              <p className="text-[#888] text-xs uppercase tracking-wider mb-1">
                {isBloody ? 'Notes' : isVP ? 'Notes' : 'State'}
              </p>
              <p className="text-white">{note.state}</p>
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-[#888] text-sm pt-2 border-t border-[#333]">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{formatRelativeTime(note.created_at)}</span>
            </div>
            {note.profiles?.display_name && (
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span>{note.profiles.display_name}</span>
              </div>
            )}
          </div>

          {/* Actions (if own note) */}
          {isOwn && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleEdit}
                variant="secondary"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Edit3 size={16} /> Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger-subtle"
                className="flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
