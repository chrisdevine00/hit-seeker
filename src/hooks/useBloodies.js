// Bloodies Hook with Realtime
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export function useBloodies() {
  const { currentTrip } = useTrip();
  const { user } = useAuth();
  const [bloodies, setBloodies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTrip) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state when no trip
      setBloodies([]);
      setLoading(false);
      return;
    }

    // Fetch initial bloodies
    const fetchBloodies = async () => {
      const { data, error } = await supabase
        .from('bloodies')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq('trip_id', currentTrip.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBloodies(data);
      }
      setLoading(false);
    };

    fetchBloodies();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel(`bloodies:${currentTrip.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bloodies',
        filter: `trip_id=eq.${currentTrip.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          // Fetch the full bloody with profile
          supabase
            .from('bloodies')
            .select('*, profiles (display_name, avatar_url)')
            .eq('id', payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) setBloodies(prev => [data, ...prev]);
            });
        } else if (payload.eventType === 'UPDATE') {
          setBloodies(prev => prev.map(b => b.id === payload.new.id ? { ...b, ...payload.new } : b));
        } else if (payload.eventType === 'DELETE') {
          setBloodies(prev => prev.filter(b => b.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentTrip]);

  const addBloody = async (bloodyData) => {
    if (!currentTrip || !user) return null;

    const { data, error } = await supabase
      .from('bloodies')
      .insert({
        trip_id: currentTrip.id,
        user_id: user.id,
        location: bloodyData.location,
        rating: bloodyData.rating || 0,
        spice: bloodyData.spice || 0,
        notes: bloodyData.notes || null
      })
      .select('*, profiles (display_name, avatar_url)')
      .single();

    if (error) {
      console.error('Error adding bloody:', error);
      return null;
    }

    return data;
  };

  const deleteBloody = async (id) => {
    const { error } = await supabase
      .from('bloodies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting bloody:', error);
    } else {
      // Update local state immediately
      setBloodies(prev => prev.filter(b => b.id !== id));
    }
  };

  const refresh = async () => {
    if (!currentTrip) return;
    setLoading(true);
    const { data } = await supabase
      .from('bloodies')
      .select('*, profiles (display_name, avatar_url)')
      .eq('trip_id', currentTrip.id)
      .order('created_at', { ascending: false });
    if (data) setBloodies(data);
    setLoading(false);
  };

  return { bloodies, loading, addBloody, deleteBloody, refresh };
}
