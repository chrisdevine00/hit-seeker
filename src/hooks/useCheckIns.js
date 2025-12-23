// Check-ins Hook with Realtime
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export function useCheckIns() {
  const { currentTrip } = useTrip();
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [myCheckIn, setMyCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTrip) {
      setCheckIns([]);
      setMyCheckIn(null);
      setLoading(false);
      return;
    }

    const fetchCheckIns = async () => {
      const { data, error } = await supabase
        .from('check_ins')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq('trip_id', currentTrip.id)
        .is('checked_out_at', null);

      if (!error && data) {
        setCheckIns(data);
        const mine = data.find(c => c.user_id === user?.id);
        setMyCheckIn(mine || null);
      }
      setLoading(false);
    };

    fetchCheckIns();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel(`checkins:${currentTrip.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'check_ins',
        filter: `trip_id=eq.${currentTrip.id}`
      }, () => {
        // Refetch all check-ins on any change
        fetchCheckIns();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentTrip, user]);

  const checkIn = async (casinoId, casinoName) => {
    if (!currentTrip || !user) return;

    // First check out of any existing check-in
    if (myCheckIn) {
      await supabase
        .from('check_ins')
        .update({ checked_out_at: new Date().toISOString() })
        .eq('id', myCheckIn.id);
    }

    // Then create new check-in
    const { data, error } = await supabase
      .from('check_ins')
      .insert({
        trip_id: currentTrip.id,
        user_id: user.id,
        casino_id: casinoId,
        casino_name: casinoName
      })
      .select()
      .single();

    if (error) {
      console.error('Error checking in:', error);
    } else if (data) {
      setMyCheckIn(data);
    }
  };

  const checkOut = async () => {
    if (!myCheckIn) return;

    const { error } = await supabase
      .from('check_ins')
      .update({ checked_out_at: new Date().toISOString() })
      .eq('id', myCheckIn.id);

    if (error) {
      console.error('Error checking out:', error);
    } else {
      setMyCheckIn(null);
    }
  };

  const getMembersAtCasino = (casinoId) => {
    return checkIns.filter(c => c.casino_id === casinoId);
  };

  return { checkIns, myCheckIn, loading, checkIn, checkOut, getMembersAtCasino };
}
