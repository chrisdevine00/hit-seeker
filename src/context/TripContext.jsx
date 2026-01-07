// Trip Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { STORAGE_KEYS } from '../constants';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripMembers, setTripMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's trips
  useEffect(() => {
    if (!user) {
      setTrips([]);
      setCurrentTrip(null);
      setLoading(false);
      return;
    }

    const fetchTrips = async () => {
      const { data, error } = await supabase
        .from('trip_members')
        .select(`
          trip_id,
          role,
          trips (
            id,
            name,
            description,
            share_code,
            created_by,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (!error && data) {
        const userTrips = data.map(tm => ({ ...tm.trips, role: tm.role }));
        setTrips(userTrips);

        // Auto-select first trip or last used
        const lastTripId = localStorage.getItem(STORAGE_KEYS.LAST_TRIP);
        const lastTrip = userTrips.find(t => t.id === lastTripId);
        if (lastTrip) {
          setCurrentTrip(lastTrip);
        } else if (userTrips.length > 0) {
          setCurrentTrip(userTrips[0]);
        }
      }
      setLoading(false);
    };

    fetchTrips();
  }, [user]);

  // Fetch trip members when trip changes
  useEffect(() => {
    if (!currentTrip) {
      setTripMembers([]);
      return;
    }

    localStorage.setItem(STORAGE_KEYS.LAST_TRIP, currentTrip.id);

    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('trip_members')
        .select(`
          user_id,
          role,
          joined_at,
          profiles (
            id,
            display_name,
            avatar_url,
            email
          )
        `)
        .eq('trip_id', currentTrip.id);

      if (!error && data) {
        setTripMembers(data.map(tm => ({ ...tm.profiles, role: tm.role, joined_at: tm.joined_at })));
      }
    };

    fetchMembers();
  }, [currentTrip]);

  const createTrip = async (name, description = '') => {
    const { data, error } = await supabase
      .from('trips')
      .insert({ name, description, created_by: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating trip:', error);
      return null;
    }

    // Add creator as owner
    await supabase
      .from('trip_members')
      .insert({ trip_id: data.id, user_id: user.id, role: 'owner' });

    const newTrip = { ...data, role: 'owner' };
    setTrips(prev => [...prev, newTrip]);
    setCurrentTrip(newTrip);
    return newTrip;
  };

  const joinTrip = async (shareCode) => {
    const { data, error } = await supabase.rpc('join_trip_by_code', { code: shareCode.toLowerCase() });

    if (error) {
      console.error('Error joining trip:', error);
      return { error: error.message };
    }

    // Fetch the trip details
    const { data: tripData } = await supabase
      .from('trips')
      .select('*')
      .eq('id', data)
      .single();

    if (tripData) {
      const newTrip = { ...tripData, role: 'member' };
      setTrips(prev => [...prev.filter(t => t.id !== tripData.id), newTrip]);
      setCurrentTrip(newTrip);
      return { trip: newTrip };
    }

    return { error: 'Failed to load trip' };
  };

  const selectTrip = (trip) => {
    setCurrentTrip(trip);
  };

  const clearTrip = () => {
    setCurrentTrip(null);
    localStorage.removeItem('hitSeeker_lastTrip');
  };

  return (
    <TripContext.Provider value={{
      trips,
      currentTrip,
      tripMembers,
      loading,
      createTrip,
      joinTrip,
      selectTrip,
      clearTrip
    }}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => useContext(TripContext);
