import React from 'react';
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { formatRelativeTime } from '../../utils/formatRelativeTime';

/**
 * PhotoViewer - Full-screen photo viewer with navigation and delete
 *
 * @param {Object} photo - The current photo object
 * @param {string} photoUrl - URL of the current photo
 * @param {string} machineName - Name of the machine/item
 * @param {Function} onClose - Callback to close the viewer
 * @param {Function} onDelete - Callback to delete a photo (receives photo id)
 * @param {Object[]} allPhotos - Array of all photos for navigation
 * @param {Function} onNavigate - Callback when navigating to another photo
 */
export function PhotoViewer({ photo, photoUrl, machineName, onClose, onDelete, allPhotos, onNavigate }) {
  const currentIndex = allPhotos.findIndex(p => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPhotos.length - 1;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black/80">
        <div>
          <h3 className="text-white font-semibold">{machineName}</h3>
          {photo.casino && <p className="text-[#bbbbbb] text-sm">{photo.casino}</p>}
        </div>
        <button onClick={onClose} className="no-animate text-white p-2" aria-label="Close"><X size={24} /></button>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {hasPrev && (
          <button onClick={() => onNavigate(allPhotos[currentIndex - 1])} className="no-animate absolute left-2 bg-black/50 p-2 rounded-full text-white">
            <ChevronLeft size={24} />
          </button>
        )}
        <img src={photoUrl} alt={machineName} className="max-h-full max-w-full object-contain" />
        {hasNext && (
          <button onClick={() => onNavigate(allPhotos[currentIndex + 1])} className="no-animate absolute right-2 bg-black/50 p-2 rounded-full text-white">
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div className="p-4 bg-black/80 flex items-center justify-between">
        <div>
          <p className="text-[#bbbbbb] text-sm">{currentIndex + 1} of {allPhotos.length}</p>
          <p className="text-[#aaaaaa] text-xs">{formatRelativeTime(photo.created_at)}</p>
        </div>
        <Button onClick={() => onDelete(photo.id)} variant="danger-subtle" size="sm" className="flex items-center gap-2">
          <Trash2 size={16} /> Delete
        </Button>
      </div>
    </div>
  );
}
