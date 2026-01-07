import React, { useState, useEffect } from 'react';
import { X, Flame } from 'lucide-react';
import { Button } from '../../../components/ui';
import { hapticLight } from '../../../lib/haptics';

/**
 * LogBloodyModal - Modal for logging a new Bloody Mary
 *
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Callback to close the modal
 * @param {Function} onSubmit - Callback when form is submitted (receives bloody data)
 * @param {Object[]} casinos - Array of casino objects for location selection
 */
export function LogBloodyModal({ isOpen, onClose, onSubmit, casinos }) {
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [rating, setRating] = useState(0);
  const [spice, setSpice] = useState(0);
  const [notes, setNotes] = useState('');

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const finalLocation = location === 'custom' ? customLocation : location;
    if (!finalLocation) return;

    onSubmit({
      location: finalLocation,
      rating,
      spice,
      notes,
      timestamp: new Date().toISOString(),
    });

    // Reset form
    setLocation('');
    setCustomLocation('');
    setRating(0);
    setSpice(0);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-[#1a1a1a] border-t border-[#333] rounded-t w-full max-w-md p-5 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white font-bold text-xl">Log a Bloody</h3>
          <button onClick={onClose} className="no-animate text-gray-400 hover:text-white text-2xl" aria-label="Close">&times;</button>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Location <span className="text-red-500">*</span></label>
          {location && location !== 'custom' ? (
            <button
              onClick={() => setLocation('')}
              className="w-full bg-gradient-to-r from-[#d4a855] to-amber-600 border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
            >
              <span className="truncate">{location}</span>
              <X size={18} className="shrink-0 ml-2 opacity-60" />
            </button>
          ) : location === 'custom' ? (
            <div>
              <button
                onClick={() => { setLocation(''); setCustomLocation(''); }}
                className="w-full bg-gradient-to-r from-[#d4a855] to-amber-600 border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
              >
                <span className="truncate">Other (custom)</span>
                <X size={18} className="shrink-0 ml-2 opacity-60" />
              </button>
              <input
                type="text"
                value={customLocation}
                onChange={e => setCustomLocation(e.target.value)}
                placeholder="Enter location name..."
                className="w-full mt-2 bg-[#242424] border border-[#444] rounded px-4 py-3 text-white placeholder-gray-600"
              />
            </div>
          ) : (
            <select
              value=""
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-[#242424] border border-[#444] rounded px-4 py-3 text-[#aaa] font-medium appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              <option value="" disabled>Select a location...</option>
              {casinos.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
              <option value="custom">Other (type below)</option>
            </select>
          )}
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => { hapticLight(); setRating(rating === star ? 0 : star); }}
                className={`text-3xl transition-all hover:scale-110 ${
                  star <= rating ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]' : 'text-gray-600'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Spice Level */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Spice Level</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(fire => (
              <button
                key={fire}
                onClick={() => { hapticLight(); setSpice(spice === fire ? 0 : fire); }}
                className={`transition-all hover:scale-110 ${
                  fire <= spice ? 'text-orange-500' : 'text-gray-600 opacity-40'
                }`}
              >
                <Flame size={28} fill="currentColor" />
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-5">
          <label className="text-gray-400 text-sm mb-1 block">Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Extra spicy, weak pour, great garnish..."
            className="w-full bg-[#242424] border border-[#444] rounded px-4 py-3 text-white placeholder-gray-600"
          />
        </div>

        {/* Validation Message */}
        {(!location || (location === 'custom' && !customLocation)) && (
          <p className="text-red-400 text-sm text-center mb-3">
            {!location ? 'Please select a location' : 'Please enter a location name'}
          </p>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!location || (location === 'custom' && !customLocation)}
          variant="danger"
          size="lg"
          className="w-full disabled:from-[#333] disabled:to-[#222] disabled:text-[#666] disabled:shadow-none disabled:cursor-not-allowed"
        >
          Log It!
        </Button>
      </div>
    </div>
  );
}
