/* eslint-disable react-refresh/only-export-components */
/**
 * BloodiesContext - Centralized bloodies state management
 * Provides shared bloodies data across all components
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useTrip } from './TripContext';
import { useAuth } from './AuthContext';

const BloodiesContext = createContext(null);

export function BloodiesProvider({ children }) {
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
              if (data) {
                // Add only if not already present (prevents duplicates)
                setBloodies(prev => {
                  if (prev.some(b => b.id === data.id)) return prev;
                  return [data, ...prev];
                });
              }
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

  const addBloody = useCallback(async (bloodyData) => {
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

    // Update local state immediately
    if (data) {
      setBloodies(prev => {
        if (prev.some(b => b.id === data.id)) return prev;
        return [data, ...prev];
      });
    }

    return data;
  }, [currentTrip, user]);

  const deleteBloody = useCallback(async (id) => {
    const { error } = await supabase
      .from('bloodies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting bloody:', error);
    } else {
      setBloodies(prev => prev.filter(b => b.id !== id));
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!currentTrip) return;
    setLoading(true);
    const { data } = await supabase
      .from('bloodies')
      .select('*, profiles (display_name, avatar_url)')
      .eq('trip_id', currentTrip.id)
      .order('created_at', { ascending: false });
    if (data) setBloodies(data);
    setLoading(false);
  }, [currentTrip]);

  const value = {
    bloodies,
    loading,
    addBloody,
    deleteBloody,
    refresh,
  };

  return (
    <BloodiesContext.Provider value={value}>
      {children}
    </BloodiesContext.Provider>
  );
}

export function useBloodies() {
  const context = useContext(BloodiesContext);
  if (!context) {
    throw new Error('useBloodies must be used within a BloodiesProvider');
  }
  return context;
}
