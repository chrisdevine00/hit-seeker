import React from 'react';
import { X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

/**
 * TierHelpModal - Explains the tier system (T1, T2, T3)
 * Can be reopened anytime from the Hunt tab
 */
export function TierHelpModal() {
  const { showTierHelp, setShowTierHelp } = useUI();

  if (!showTierHelp) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowTierHelp(false)}>
      <div className="bg-[#161616] border border-[#333] rounded max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Understanding Tiers</h2>
          <button onClick={() => setShowTierHelp(false)} className="text-[#aaa] hover:text-white" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shrink-0 mt-0.5">T1</span>
            <div>
              <p className="text-emerald-400 font-medium text-sm">Must-Hit-By Jackpots</p>
              <p className="text-[#aaa] text-xs">Progressive must hit before ceiling. Play when 90%+ filled.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shrink-0 mt-0.5">T2</span>
            <div>
              <p className="text-amber-400 font-medium text-sm">Persistent State</p>
              <p className="text-[#aaa] text-xs">Banked coins, meters, collectibles. Look for machines left in good states.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shrink-0 mt-0.5">T3</span>
            <div>
              <p className="text-red-400 font-medium text-sm">Entertainment Only</p>
              <p className="text-[#aaa] text-xs">No edge. House always wins long-term. Play for fun only.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowTierHelp(false)}
          className="w-full mt-4 bg-[#2a2a2a] hover:bg-[#333] text-white py-2 rounded text-sm transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
