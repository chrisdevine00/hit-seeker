import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, Trash2, Loader2, Eye, Target, AlertTriangle, StickyNote } from 'lucide-react';
import { Button } from '../../../components/ui';
import { compressImage } from '../../../utils';
import { toast } from 'sonner';

/**
 * MachineDetail - Detailed view for a slot machine
 *
 * @param {Object} machine - The machine object with all details
 * @param {Function} onBack - Callback to go back to list
 * @param {Function} onAddNote - Callback to add a note (receives machine name)
 * @param {Object[]} photos - Array of photos for this machine
 * @param {Function} onAddPhoto - Callback to add a photo (receives machineId, file)
 * @param {Function} onDeletePhoto - Callback to delete a photo (receives machineId, photoId)
 * @param {Function} onViewPhoto - Callback to view a photo
 * @param {Function} getPhotoUrl - Function to get URL for a photo
 */
export function MachineDetail({ machine, onBack, onAddNote, photos, onAddPhoto, onDeletePhoto, onViewPhoto, getPhotoUrl }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const existingPhoto = photos.length > 0 ? photos[0] : null;

  const handleDeleteConfirm = async () => {
    if (existingPhoto) {
      await onDeletePhoto(machine.id, existingPhoto.id);
      toast.success('Photo deleted');
    }
    setShowDeleteConfirm(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (existingPhoto) {
      // Store file and show confirmation
      setPendingFile(file);
      setShowReplaceConfirm(true);
    } else {
      // No existing photo, just upload
      await uploadPhoto(file);
    }
    e.target.value = '';
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    const compressed = await compressImage(file);
    await onAddPhoto(machine.id, compressed);
    setUploading(false);
  };

  const handleReplaceConfirm = async () => {
    if (!pendingFile) return;
    setShowReplaceConfirm(false);

    // Delete old photo first
    if (existingPhoto) {
      await onDeletePhoto(machine.id, existingPhoto.id);
    }

    // Upload new photo
    await uploadPhoto(pendingFile);
    setPendingFile(null);
  };

  const handleReplaceCancel = () => {
    setShowReplaceConfirm(false);
    setPendingFile(null);
  };

  return (
    <div className="space-y-4">
      {/* Replace Photo Confirmation */}
      {showReplaceConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161616] rounded p-6 max-w-sm w-full border border-[#333]">
            <h3 className="text-lg font-semibold text-white mb-2">Replace Photo?</h3>
            <p className="text-[#bbbbbb] mb-6">The existing photo will be deleted and replaced with the new one.</p>
            <div className="space-y-2">
              <Button onClick={handleReplaceConfirm} variant="primary" className="w-full">Replace</Button>
              <Button onClick={handleReplaceCancel} variant="secondary" className="w-full">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Photo Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161616] rounded p-6 max-w-sm w-full border border-[#333]">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Photo?</h3>
            <p className="text-[#bbbbbb] mb-6">This action cannot be undone.</p>
            <div className="space-y-2">
              <Button onClick={handleDeleteConfirm} variant="danger" className="w-full">Delete</Button>
              <Button onClick={() => setShowDeleteConfirm(false)} variant="secondary" className="w-full">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBack();
        }}
        className="flex items-center gap-2 text-[#d4a855] mb-4 py-2 pr-4 -ml-2 pl-2 hover:bg-[#1c1c1c] rounded transition-colors"
      >
        <ChevronLeft size={20} /> Back
      </button>

      <div className="bg-[#161616] border border-[#333] rounded p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {existingPhoto ? (
              <button onClick={() => onViewPhoto(existingPhoto)} className="relative">
                <img src={getPhotoUrl(existingPhoto)} alt="" className="w-12 h-12 rounded object-cover" />
              </button>
            ) : (
              <button onClick={handlePhotoClick} className="w-12 h-12 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600" disabled={uploading}>
                {uploading ? <Loader2 className="w-5 h-5 animate-spin text-[#bbbbbb]" /> : <Camera size={20} className="text-[#bbbbbb]" />}
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-white">{machine.name}</h1>
              <p className="text-[#bbbbbb] text-sm">{machine.manufacturer}</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${machine.tier === 1 ? 'bg-emerald-600' : machine.tier === 2 ? 'bg-amber-600' : 'bg-red-600'} text-white`}>
            Tier {machine.tier}
          </span>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />

        {existingPhoto && (
          <div className="flex gap-2 mb-3">
            <button
              onClick={handlePhotoClick}
              className="flex-1 bg-[#0d0d0d] border border-[#333] hover:border-[#d4a855] text-[#aaa] hover:text-white text-sm flex items-center justify-center gap-2 py-2 px-3 rounded transition-colors"
              disabled={uploading}
            >
              <Camera size={16} /> {uploading ? 'Uploading...' : 'Replace'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-[#0d0d0d] border border-[#333] hover:border-red-500 text-[#aaa] hover:text-red-400 text-sm flex items-center justify-center gap-2 py-2 px-3 rounded transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}

        <p className="text-gray-300 bg-[#0d0d0d]/50 rounded p-3 text-sm">{machine.quickId}</p>
      </div>

      {/* Visual Info */}
      <div className="bg-[#161616] border border-[#333] rounded overflow-hidden">
        <div className="p-4 border-b border-[#333]">
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            <Eye size={18} className="text-[#d4a855]" /> What to Look For
          </h2>
        </div>
        <div className="p-4 space-y-3">
          <div className="bg-blue-900/30 rounded p-3">
            <p className="text-blue-300 text-xs uppercase tracking-wider font-semibold mb-1">Where to Look</p>
            <p className="text-white text-sm">{machine.visual.location}</p>
          </div>
          {machine.visual.appearance.map((item, i) => (
            <div key={i} className={`rounded p-3 ${item.highlight ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-[#0d0d0d]/50'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${item.highlight ? 'text-amber-400' : 'text-[#aaaaaa]'}`}>{item.label}</span>
              <p className={`text-sm ${item.highlight ? 'text-amber-200 font-semibold' : 'text-gray-300'}`}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Play Thresholds */}
      <div className="bg-[#161616] border border-[#333] rounded overflow-hidden">
        <div className="p-4 border-b border-[#333]">
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            <Target size={18} className="text-emerald-400" /> Play Thresholds
          </h2>
        </div>
        <div className="p-4 space-y-2">
          {Object.entries(machine.threshold).map(([key, value]) => (
            <div key={key} className="bg-[#0d0d0d]/50 rounded p-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#aaaaaa]">{key.replace(/([A-Z])/g, ' $1')}</span>
              <p className="text-gray-200 text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {machine.warning && (
        <div className="bg-red-900/30 border border-red-500/30 rounded p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <p className="text-red-200 text-sm">{machine.warning}</p>
        </div>
      )}

      <Button onClick={() => onAddNote(machine.name)} variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
        <StickyNote size={18} /> Add Note for {machine.shortName}
      </Button>
    </div>
  );
}
