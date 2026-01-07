import React from 'react';
import { ChevronLeft, Users, CheckCircle2 } from 'lucide-react';
import { useUI } from '../../../context/UIContext';
import { useNotes, useCheckIns } from '../../../hooks';
import { Button } from '../../../components/ui';

/**
 * CasinoDetail - Detailed view of a casino in the trip tab
 * Shows casino info, check-in status, members present, and notes
 */
export function CasinoDetail({ onCheckIn }) {
  const { selectedCasino, setSelectedCasino } = useUI();
  const { notes } = useNotes();
  const { myCheckIn, checkOut, getMembersAtCasino } = useCheckIns();

  if (!selectedCasino) return null;

  const membersHere = getMembersAtCasino(selectedCasino.id);
  const casinoNotes = notes.filter(n => n.casino === selectedCasino.name);

  return (
    <div className="pb-24 space-y-4">
      <button
        onClick={() => setSelectedCasino(null)}
        className="no-animate flex items-center gap-2 text-[#d4a855]"
      >
        <ChevronLeft size={20} /> Back
      </button>

      <div className="bg-[#161616] border border-[#333] rounded p-4">
        <h2 className="text-2xl font-bold text-white mb-1">{selectedCasino.name}</h2>
        <p className="text-[#bbb]">{selectedCasino.owner} • {selectedCasino.area}</p>
        <p className="text-[#888] text-sm mt-1">{selectedCasino.size} • {selectedCasino.slots} slots</p>

        {myCheckIn?.casino_id === selectedCasino.id ? (
          <div className="mt-4 space-y-3">
            <div className="bg-emerald-900/40 border border-emerald-500/50 rounded p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} className="text-white" />
              </div>
              <div>
                <p className="text-emerald-400 font-semibold">You're Here</p>
                <p className="text-emerald-400/70 text-sm">Currently checked in</p>
              </div>
            </div>
            <button
              onClick={checkOut}
              className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#bbbbbb] py-3 rounded font-semibold transition-colors"
            >
              Check Out
            </button>
          </div>
        ) : (
          <Button
            onClick={() => onCheckIn(selectedCasino)}
            variant="success"
            className="w-full mt-4"
          >
            Check In Here
          </Button>
        )}
      </div>

      {selectedCasino.apNotes && (
        <div className="bg-amber-900/30 border border-amber-500/30 rounded p-4">
          <p className="text-amber-200 text-sm">{selectedCasino.apNotes}</p>
        </div>
      )}

      {/* Members at this casino */}
      {membersHere.length > 0 && (
        <div className="bg-[#161616] border border-[#333] rounded p-4">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Users size={18} /> Here Now
          </h3>
          <div className="space-y-2">
            {membersHere.map(checkin => (
              <div key={checkin.id} className="flex items-center gap-3 p-2 bg-[#0d0d0d]/50 rounded">
                {checkin.profiles?.avatar_url ? (
                  <img src={checkin.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-[#bbbbbb] text-sm">
                    {checkin.profiles?.display_name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <p className="text-white text-sm">{checkin.profiles?.display_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes for this casino */}
      {casinoNotes.length > 0 && (
        <div className="bg-[#161616] border border-[#333] rounded p-4">
          <h3 className="font-semibold text-white mb-3">Notes Here ({casinoNotes.length})</h3>
          <div className="space-y-2">
            {casinoNotes.slice(0, 5).map(note => (
              <div key={note.id} className="p-2 bg-[#0d0d0d]/50 rounded">
                <p className="text-white text-sm font-medium">{note.machine}</p>
                {note.state && <p className="text-[#bbbbbb] text-xs">{note.state}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
