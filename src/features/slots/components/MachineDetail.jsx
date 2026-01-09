import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, Trash2, Loader2, Eye, AlertTriangle, Calculator } from 'lucide-react';
import { Button } from '../../../components/ui';
import { FilledMapPin } from '../../../components/ui/FilledMapPin';
import { compressImage } from '../../../utils';
import { toast } from 'sonner';
import { useSlots } from '../../../context/SlotsContext';
import { useUI } from '../../../context/UIContext';
import { usePhotos } from '../../../hooks';

// Helper for tier colors
const getTierColors = (tier) => {
  switch (tier) {
    case 1:
      return {
        gradient: 'bg-gradient-to-br from-emerald-900/40 to-[#161616] border border-emerald-500/50',
        bg: 'bg-emerald-950/50',
        text: 'text-emerald-400',
        badgeOutline: 'border-emerald-500/50 text-emerald-400',
      };
    case 2:
      return {
        gradient: 'bg-gradient-to-br from-amber-900/40 to-[#161616] border border-amber-500/50',
        bg: 'bg-amber-950/50',
        text: 'text-amber-400',
        badgeOutline: 'border-amber-500/50 text-amber-400',
      };
    default:
      return {
        gradient: 'bg-gradient-to-br from-red-900/40 to-[#161616] border border-red-500/50',
        bg: 'bg-red-950/50',
        text: 'text-red-400',
        badgeOutline: 'border-red-500/50 text-red-400',
      };
  }
};

/**
 * MachineDetail - Detailed view for a slot machine
 * Uses SlotsContext for machine state and calculator
 * Uses UIContext for navigation and modals
 * Uses usePhotos for photo management
 */
export function MachineDetail() {
  const fileInputRef = useRef(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  // Slots Context
  const {
    selectedMachine,
    setSelectedMachine,
    setSearchQuery,
    calcCurrent,
    setCalcCurrent,
    calcCeiling,
    setCalcCeiling,
    calcResult,
  } = useSlots();

  // UI Context
  const {
    previousTab,
    setActiveTab,
    setPreviousTab,
    setViewingPhoto,
    openSpotter,
  } = useUI();

  // Photos
  const { getMachinePhotos, addPhoto, deletePhoto, getPhotoUrl } = usePhotos();

  if (!selectedMachine) return null;

  const tierColors = getTierColors(selectedMachine.tier);
  const machinePhotos = getMachinePhotos(selectedMachine.id);

  const handleBack = () => {
    setSelectedMachine(null);
    setSearchQuery('');
    if (previousTab) {
      setActiveTab(previousTab);
      setPreviousTab(null);
    }
  };

  const handleAddPhoto = async (file) => {
    setPhotoUploading(true);
    try {
      const compressed = await compressImage(file);
      await addPhoto(selectedMachine.id, compressed);
      toast.success('Photo added');
    } catch (err) {
      toast.error('Failed to add photo');
      console.error('Add photo error:', err);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (confirm('Delete this photo?')) {
      try {
        await deletePhoto(selectedMachine.id, photoId);
        toast.success('Photo deleted');
      } catch (err) {
        toast.error('Failed to delete photo');
        console.error('Delete photo error:', err);
      }
    }
  };

  const openSlotSpotter = () => {
    openSpotter({ machine: selectedMachine.name, type: 'slot' });
  };

  return (
    <div className="pb-24 space-y-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-[#d4a855]"
      >
        <ChevronLeft size={20} /> Back
      </button>

      {/* Machine Header */}
      <div className={`p-4 ${selectedMachine.tier === 1 ? 'card-3d-tier1' : selectedMachine.tier === 2 ? 'card-3d-tier2' : 'card-3d-tier3'}`}>
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs px-3 py-1 rounded border font-semibold ${tierColors.badgeOutline}`}>
            {selectedMachine.tier === 1 ? 'Tier 1 - Must Hit By' :
             selectedMachine.tier === 2 ? 'Tier 2 - Persistent State' :
             'Tier 3 - Entertainment'}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">{selectedMachine.shortName}</h2>
        <p className="text-[#aaa] text-sm mb-3">{selectedMachine.manufacturer} • {selectedMachine.releaseYear}</p>

        {/* Threshold Summary */}
        <div className="rounded p-3 bg-[#0d0d0d]/50">
          <p className="text-xs text-[#aaa] uppercase tracking-wider mb-1">Play When</p>
          <p className={`text-lg font-bold ${tierColors.text}`}>
            {selectedMachine.thresholdSummary}
          </p>
        </div>
      </div>

      {/* Quick ID */}
      <div className="card-3d p-4">
        <p className="text-xs text-[#aaa] uppercase tracking-wider mb-2">Quick ID</p>
        <p className="text-white">{selectedMachine.quickId}</p>
      </div>

      {/* MHB Calculator (Tier 1 only) */}
      {selectedMachine.tier === 1 && selectedMachine.category === 'must-hit-by' && (
        <div className="card-3d-tier1 p-4">
          <h3 className="font-bold text-emerald-400 mb-3 flex items-center gap-2 text-sm">
            <Calculator size={16} /> MHB Calculator
          </h3>
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <label className="text-xs text-[#aaa] block mb-1">Current $</label>
              <input
                type="number"
                placeholder="0.00"
                value={calcCurrent}
                onChange={(e) => setCalcCurrent(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-white text-lg"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[#aaa] block mb-1">Must Hit By $</label>
              <input
                type="number"
                placeholder="0.00"
                value={calcCeiling}
                onChange={(e) => setCalcCeiling(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-white text-lg"
              />
            </div>
          </div>
          {calcResult && (
            <div className={`p-4 rounded text-center ${
              parseFloat(calcResult) >= 90 ? 'bg-emerald-900/50 border border-emerald-500' :
              parseFloat(calcResult) >= 80 ? 'bg-amber-900/50 border border-amber-500' :
              'bg-red-900/50 border border-red-500'
            }`}>
              <p className={`text-4xl font-bold ${
                parseFloat(calcResult) >= 90 ? 'text-emerald-400' :
                parseFloat(calcResult) >= 80 ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {calcResult}%
              </p>
              <p className={`text-sm font-medium mt-1 ${
                parseFloat(calcResult) >= 90 ? 'text-emerald-300' :
                parseFloat(calcResult) >= 80 ? 'text-amber-300' :
                'text-red-300'
              }`}>
                {parseFloat(calcResult) >= 90 ? 'PLAY - Strong +EV' :
                 parseFloat(calcResult) >= 80 ? 'MARGINAL - Proceed with caution' :
                 'SKIP - Not worth it'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Visual Tips (Tier 2 with visual data) */}
      {selectedMachine.tier === 2 && selectedMachine.visual && (
        <div className="card-3d-tier2 p-4">
          <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2 text-sm">
            <Eye size={16} /> What to Look For
          </h3>
          <div className="space-y-2">
            {selectedMachine.visual.appearance?.map((item, i) => (
              <div key={i} className={`text-sm p-2 rounded ${item.highlight ? 'bg-amber-900/30 text-amber-200' : 'text-[#bbb]'}`}>
                <span className="text-[#aaa] font-medium">{item.label}:</span> {item.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tier 3 Warning */}
      {selectedMachine.tier === 3 && (
        <div className="card-3d-tier3 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold">No Advantage Play</p>
              <p className="text-[#bbb] text-sm mt-1">This machine has no exploitable features. Play for entertainment only with money you can afford to lose.</p>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Guide (Tier 1 & 2) */}
      {selectedMachine.threshold && (selectedMachine.tier === 1 || selectedMachine.tier === 2) && (
        <div className="card-3d p-4">
          <p className="text-xs text-[#aaa] uppercase tracking-wider mb-3">Strategy Guide</p>
          <div className="space-y-2">
            {selectedMachine.threshold.conservative && (
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5"></span>
                <div>
                  <p className="text-emerald-400 text-sm font-medium">Conservative</p>
                  <p className="text-[#bbb] text-sm">{selectedMachine.threshold.conservative}</p>
                </div>
              </div>
            )}
            {selectedMachine.threshold.aggressive && (
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5"></span>
                <div>
                  <p className="text-amber-400 text-sm font-medium">Aggressive</p>
                  <p className="text-[#bbb] text-sm">{selectedMachine.threshold.aggressive}</p>
                </div>
              </div>
            )}
            {selectedMachine.threshold.skip && (
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 mt-1.5"></span>
                <div>
                  <p className="text-red-400 text-sm font-medium">Skip When</p>
                  <p className="text-[#bbb] text-sm">{selectedMachine.threshold.skip}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={openSlotSpotter}
          variant="primary"
          className="flex items-center justify-center gap-2"
        >
          <FilledMapPin size={18} holeColor="#d4a855" />
          Spot It
        </Button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={photoUploading}
          className={`rounded p-3 flex items-center justify-center gap-2 transition-colors ${
            photoUploading
              ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
              : 'card-3d text-white hover:opacity-80'
          }`}
        >
          {photoUploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Camera size={18} />
              Add Photo
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleAddPhoto(file);
            e.target.value = '';
          }}
        />
      </div>

      {/* Photos */}
      <div className="card-3d p-4">
        <p className="text-xs text-[#aaa] uppercase tracking-wider mb-3">Your Photos</p>
        {machinePhotos.length === 0 ? (
          <div className="text-center py-4">
            <Camera size={24} className="mx-auto text-[#444] mb-2" />
            <p className="text-[#aaa] text-sm">No photos yet</p>
            <p className="text-[#555] text-xs mt-1">Tap "Add Photo" to capture this machine</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {machinePhotos.map(photo => (
              <div key={photo.id} className="relative aspect-square rounded overflow-hidden bg-[#0d0d0d] group">
                <button
                  onClick={() => setViewingPhoto(photo)}
                  className="w-full h-full"
                >
                  <img src={getPhotoUrl(photo)} alt="" className="w-full h-full object-cover" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePhoto(photo.id);
                  }}
                  className="absolute top-1 right-1 w-7 h-7 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
