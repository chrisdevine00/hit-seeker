// Notes Hook with Realtime
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export function useNotes() {
  const { currentTrip } = useTrip();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTrip) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state when no trip
      setNotes([]);
      setLoading(false);
      return;
    }

    // Fetch initial notes
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from('notes')
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
        setNotes(data);
      }
      setLoading(false);
    };

    fetchNotes();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel(`notes:${currentTrip.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: `trip_id=eq.${currentTrip.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          // Fetch the full note with profile
          supabase
            .from('notes')
            .select('*, profiles (display_name, avatar_url)')
            .eq('id', payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) setNotes(prev => [data, ...prev]);
            });
        } else if (payload.eventType === 'UPDATE') {
          setNotes(prev => prev.map(n => n.id === payload.new.id ? { ...n, ...payload.new } : n));
        } else if (payload.eventType === 'DELETE') {
          setNotes(prev => prev.filter(n => n.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentTrip]);

  const addNote = async (noteData) => {
    if (!currentTrip || !user) return;

    const { data, error } = await supabase
      .from('notes')
      .insert({
        trip_id: currentTrip.id,
        user_id: user.id,
        machine: noteData.machine,
        casino: noteData.casino,
        location: noteData.location,
        state: noteData.state,
        playable: noteData.playable || false
      })
      .select('*, profiles (display_name, avatar_url)')
      .single();

    if (error) {
      console.error('Error adding note:', error);
      return null;
    }

    return data;
  };

  const updateNote = async (id, updates) => {
    const { error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
    } else {
      // Update local state immediately
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const refresh = async () => {
    if (!currentTrip) return;
    setLoading(true);
    const { data } = await supabase
      .from('notes')
      .select('*, profiles (display_name, avatar_url)')
      .eq('trip_id', currentTrip.id)
      .order('created_at', { ascending: false });
    if (data) setNotes(data);
    setLoading(false);
  };

  return { notes, loading, addNote, updateNote, deleteNote, refresh };
}
