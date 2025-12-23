import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Calculator, ChevronRight, ChevronDown, ChevronUp, Check, X, AlertTriangle, Info, Home, List, Building2, StickyNote, Trash2, Edit3, Eye, MapPin, Target, ChevronLeft, Navigation, LogOut, CheckCircle2, Camera, ImagePlus, Users, Share2, Copy, RefreshCw, Loader2, Grid, LayoutList, Crosshair, Map, BookOpen, Spade, Heart, Diamond, Club, Gem } from 'lucide-react';

// Inject scrollbar-hide utility CSS
const scrollbarHideStyle = document.createElement('style');
scrollbarHideStyle.textContent = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(scrollbarHideStyle);

// ============================================
// HIT SEEKER THEME - Dark Gold
// ============================================
const theme = {
  bg: {
    primary: '#0d0d0d',
    card: '#161616',
    cardHover: '#1c1c1c',
    input: '#1a1a1a',
  },
  accent: '#d4a855',
  accentDim: '#a67c3d',
  text: {
    primary: '#ffffff',
    secondary: '#999999',
    muted: '#666666',
  },
  border: '#2a2a2a',
  tier: {
    1: '#34c759',
    2: '#f5a623',
    3: '#ff4757',
  }
};

// Inject global styles for fonts and scrollbars
if (typeof document !== 'undefined') {
  // Load Lottie player script
  const lottieScriptId = 'lottie-player-script';
  if (!document.getElementById(lottieScriptId)) {
    const lottieScript = document.createElement('script');
    lottieScript.id = lottieScriptId;
    lottieScript.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
    document.head.appendChild(lottieScript);
  }
  
  const styleId = 'hit-seeker-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&display=swap');
      
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 3px; }
      ::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #555; }
      * { scrollbar-width: thin; scrollbar-color: #444 #1a1a1a; }
      
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      
      /* Bloodies Feature Animations */
      @keyframes slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      
      @keyframes slide-in-right {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      
      @keyframes badge-reveal {
        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
        60% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      .animate-badge-reveal { animation: badge-reveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// SUPABASE CLIENT
// ============================================
const supabaseUrl = 'https://kuutnqehwiyhdkipoevg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dXRucWVod2l5aGRraXBvZXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjk0NDksImV4cCI6MjA4MTY0NTQ0OX0.3e5cMpUA2hmNC436sn8ygy1fl9b59UneHByjtFb1Rek';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) console.error('Error signing in:', error);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

// ============================================
// TRIP CONTEXT
// ============================================
const TripContext = createContext(null);

function TripProvider({ children }) {
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
        const lastTripId = localStorage.getItem('hitSeeker_lastTrip');
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

    localStorage.setItem('hitSeeker_lastTrip', currentTrip.id);

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

  return (
    <TripContext.Provider value={{ 
      trips, 
      currentTrip, 
      tripMembers, 
      loading, 
      createTrip, 
      joinTrip, 
      selectTrip 
    }}>
      {children}
    </TripContext.Provider>
  );
}

const useTrip = () => useContext(TripContext);

// ============================================
// DATA HOOKS
// ============================================

// Notes hook with realtime
function useNotes() {
  const { currentTrip } = useTrip();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTrip) {
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

// Photos hook with realtime
function usePhotos() {
  const { currentTrip } = useTrip();
  const { user } = useAuth();
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTrip) {
      setPhotos({});
      setLoading(false);
      return;
    }

    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('machine_photos')
        .select('*')
        .eq('trip_id', currentTrip.id);

      if (!error && data) {
        // Group by machine_id
        const grouped = data.reduce((acc, photo) => {
          if (!acc[photo.machine_id]) acc[photo.machine_id] = [];
          acc[photo.machine_id].push(photo);
          return acc;
        }, {});
        setPhotos(grouped);
      }
      setLoading(false);
    };

    fetchPhotos();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel(`photos:${currentTrip.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'machine_photos',
        filter: `trip_id=eq.${currentTrip.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const photo = payload.new;
          setPhotos(prev => ({
            ...prev,
            [photo.machine_id]: [...(prev[photo.machine_id] || []), photo]
          }));
        } else if (payload.eventType === 'DELETE') {
          setPhotos(prev => {
            const machineId = payload.old.machine_id;
            return {
              ...prev,
              [machineId]: (prev[machineId] || []).filter(p => p.id !== payload.old.id)
            };
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentTrip]);

  const addPhoto = async (machineId, file, casino = null) => {
    if (!currentTrip || !user) return;

    // Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${currentTrip.id}/${machineId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('machine-photos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('machine-photos')
      .getPublicUrl(fileName);

    // Create database record
    const { data, error } = await supabase
      .from('machine_photos')
      .insert({
        trip_id: currentTrip.id,
        user_id: user.id,
        machine_id: machineId,
        storage_path: fileName,
        casino
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving photo record:', error);
      return null;
    }

    return { ...data, publicUrl };
  };

  const deletePhoto = async (machineId, photoId) => {
    const photo = photos[machineId]?.find(p => p.id === photoId);
    if (!photo) return;

    // Delete from storage
    await supabase.storage
      .from('machine-photos')
      .remove([photo.storage_path]);

    // Delete from database
    await supabase
      .from('machine_photos')
      .delete()
      .eq('id', photoId);
  };

  const getPhotoUrl = (photo) => {
    if (!photo?.storage_path) return null;
    const { data: { publicUrl } } = supabase.storage
      .from('machine-photos')
      .getPublicUrl(photo.storage_path);
    return publicUrl;
  };

  const getMachinePhotos = (machineId) => photos[machineId] || [];
  
  const getLatestPhoto = (machineId) => {
    const machinePhotos = getMachinePhotos(machineId);
    return machinePhotos.length > 0 ? machinePhotos[machinePhotos.length - 1] : null;
  };

  return { photos, loading, addPhoto, deletePhoto, getPhotoUrl, getMachinePhotos, getLatestPhoto };
}

// Check-ins hook with realtime
function useCheckIns() {
  const { currentTrip, tripMembers } = useTrip();
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

// ============================================
// LOGIN SCREEN
// ============================================
function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [joining, setJoining] = useState(false);
  const [shareCode, setShareCode] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: theme.bg.primary }}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="text-white">Hit</span>
          <span style={{ color: theme.accent }}>Seeker</span>
        </h1>
        <p style={{ color: theme.text.secondary }}>Advantage Slots Scouting</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={signInWithGoogle}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        {/* Apple sign-in can be added later */}
      </div>

      <div className="mt-8 text-center text-sm" style={{ color: theme.text.muted }}>
        <p>Sign in to create or join a trip</p>
        <p className="mt-1">Your friends can join with a share code</p>
      </div>
    </div>
  );
}

// ============================================
// TRIP SELECTION SCREEN
// ============================================
function TripSelectionScreen() {
  const { trips, loading, createTrip, joinTrip, selectTrip } = useTrip();
  const { signOut, profile } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newTripName.trim()) return;
    setCreating(true);
    await createTrip(newTripName.trim());
    setCreating(false);
    setShowCreate(false);
    setNewTripName('');
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setCreating(true);
    setError('');
    const result = await joinTrip(joinCode.trim());
    if (result.error) {
      setError(result.error);
    } else {
      setShowJoin(false);
      setJoinCode('');
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg.primary }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: theme.accent }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: theme.bg.primary }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span className="text-white">Hit</span>
              <span style={{ color: theme.accent }}>Seeker</span>
            </h1>
            <p className="text-sm" style={{ color: theme.text.secondary }}>Welcome, {profile?.display_name || 'User'}</p>
          </div>
          <button
            onClick={signOut}
            className="p-2 transition-colors"
            style={{ color: theme.text.muted }}
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Trips List */}
        {trips.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Your Trips</h2>
            <div className="space-y-2">
              {trips.map(trip => (
                <button
                  key={trip.id}
                  onClick={() => selectTrip(trip)}
                  className="w-full rounded p-4 text-left transition-colors"
                  style={{ background: theme.bg.card, border: `1px solid ${theme.border}` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{trip.name}</h3>
                      <p className="text-sm" style={{ color: theme.text.muted }}>
                        {trip.role === 'owner' ? 'Owner' : 'Member'}
                      </p>
                    </div>
                    <ChevronRight size={20} style={{ color: theme.text.muted }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Create/Join Buttons */}
        <div className="space-y-3">
          {!showCreate && !showJoin && (
            <>
              <button
                onClick={() => setShowCreate(true)}
                className="w-full font-semibold py-4 rounded transition-colors"
                style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDim} 100%)`, color: '#000' }}
              >
                Create New Trip
              </button>
              <button
                onClick={() => setShowJoin(true)}
                className="w-full font-semibold py-4 rounded transition-colors"
                style={{ background: theme.bg.card, color: theme.text.primary, border: `1px solid ${theme.border}` }}
              >
                Join with Code
              </button>
            </>
          )}

          {/* Create Form */}
          {showCreate && (
            <div className="rounded p-4" style={{ background: theme.bg.card, border: `1px solid ${theme.border}` }}>
              <h3 className="font-semibold text-white mb-3">Create New Trip</h3>
              <input
                type="text"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder="Trip name (e.g., Vegas January 2025)"
                className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-gray-500 mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowCreate(false); setNewTripName(''); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newTripName.trim() || creating}
                  className="flex-1 bg-[#d4a855] hover:bg-[#a67c3d] disabled:opacity-50 text-white py-2 rounded flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create
                </button>
              </div>
            </div>
          )}

          {/* Join Form */}
          {showJoin && (
            <div className="bg-[#161616] rounded p-4 border border-[#333]">
              <h3 className="font-semibold text-white mb-3">Join a Trip</h3>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter share code"
                className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-gray-500 mb-3 uppercase"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowJoin(false); setJoinCode(''); setError(''); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoin}
                  disabled={!joinCode.trim() || creating}
                  className="flex-1 bg-[#d4a855] hover:bg-[#a67c3d] disabled:opacity-50 text-white py-2 rounded flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Join
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// TRIP HEADER COMPONENT
// ============================================
function TripHeader({ onOpenSettings, onLocationClick, myCheckIn }) {
  const { currentTrip, tripMembers } = useTrip();

  return (
    <div className="bg-[#161616] border-b border-[#333] px-4 py-3">
      <div className="flex items-center justify-between">
        <button onClick={onOpenSettings} className="flex items-center gap-2">
          <span className="font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="text-white">Hit</span>
            <span style={{ color: '#d4a855' }}>Seeker</span>
          </span>
          <div className="ml-1">
            <h1 className="font-bold text-white text-sm">{currentTrip.name}</h1>
            <p className="text-xs text-[#bbbbbb]">{tripMembers.length} members</p>
          </div>
        </button>

        {myCheckIn ? (
          <button 
            onClick={onLocationClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors font-medium shadow-lg shadow-emerald-900/30"
          >
            <MapPin size={16} className="shrink-0" />
            <span className="truncate max-w-[120px]">{myCheckIn.casino_name}</span>
          </button>
        ) : (
          <button 
            onClick={onLocationClick}
            className="bg-[#d4a855] hover:bg-[#c49745] text-black text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors font-semibold shadow-lg shadow-amber-900/30"
          >
            <MapPin size={16} />
            <span>Check In</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPRESS IMAGE UTILITY
// ============================================
const compressImage = (file, maxWidth = 800) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.8);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// ============================================
// FORMAT RELATIVE TIME
// ============================================
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return null;
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return then.toLocaleDateString();
};

// ============================================
// DEBOUNCE HOOK
// ============================================
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

// ============================================
// MACHINE DATA
// ============================================
// Machine Categories for filtering/display
const machineCategories = {
  'must-hit-by': { name: 'Must-Hit-By Progressives', description: 'Progressive jackpots that MUST pay before reaching ceiling amount' },
  'banked-coins': { name: 'Banked Coins/Symbols', description: 'Machines that accumulate coins, gems, or symbols over time' },
  'expanding-reels': { name: 'Expanding Reels/Ways', description: 'Machines where reels grow taller, increasing ways to win' },
  'cycle-bonus': { name: 'Cycle/Meter Bonus', description: 'Machines with meters that fill toward guaranteed bonus' },
  'persistent-state': { name: 'Other Persistent State', description: 'Various machines with carryover features' },
  'entertainment': { name: 'Entertainment (No AP)', description: 'Popular licensed/themed machines - NO advantage play edge, just for fun!' }
};

const machines = [
  // =============================================
  // MUST-HIT-BY PROGRESSIVES (Tier 1)
  // =============================================
  {
    id: 'wheel-of-fortune-mhb',
    name: 'Wheel of Fortune (Must-Hit-By)',
    shortName: 'Wheel of Fortune MHB',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Classic wheel on top + "Must Hit By" display showing current/ceiling amounts',
    visual: {
      location: 'TOP of cabinet shows progressive displays with "Must Hit By" text',
      appearance: [
        { label: 'Display', text: 'Current amount + ceiling amount (e.g., "$487.23 Must Hit By $500")' },
        { label: 'Wheel', text: 'Iconic spinning wheel on top of cabinet' },
        { label: 'Versions', text: 'Multiple versions exist - look for MHB text specifically' },
      ],
      colors: 'Blue/purple cabinet with gold wheel',
      example: 'Mini at $48.50 MHB $50, Minor at $180 MHB $200'
    },
    thresholdSummary: '90%+ of ceiling',
    thresholdDetail: 'Use calculator: Current ÷ Ceiling × 100. At 90%+, math favors you. Each progressive tier (Mini, Minor, Major) has own ceiling.',
    threshold: {
      conservative: '90%+ of any ceiling',
      aggressive: '85%+ with multiple meters high',
      quickMath: '(Current ÷ Must-Hit-By) × 100'
    },
    notes: 'Multiple progressive tiers - check ALL of them. Higher tiers = bigger swings.',
    hasCalculator: true
  },

  {
    id: 'fu-dai-lian-lian-mhb',
    name: 'Fu Dai Lian Lian (Must-Hit-By)',
    shortName: 'Fu Dai Lian Lian',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Asian theme with lucky bags + Must-Hit-By progressive display',
    visual: {
      location: 'Progressive displays at top showing MHB amounts',
      appearance: [
        { label: 'Theme', text: 'Red/gold Asian theme with lucky money bags' },
        { label: 'MHB Display', text: 'Shows current value and ceiling for each tier' },
        { label: 'Tiers', text: 'Mini, Minor, Major, Grand - each with own MHB ceiling' },
      ],
      colors: 'Red and gold Asian prosperity theme',
      example: 'Major at $920 Must Hit By $1,000'
    },
    thresholdSummary: '90%+ of any ceiling',
    thresholdDetail: 'Same math as all MHB games. Check each tier separately.',
    threshold: {
      conservative: '90%+ of ceiling',
      aggressive: '85%+ on Major/Grand tiers'
    },
    notes: 'Part of larger MHB family from IGT. Very common on floors.',
    hasCalculator: true
  },

  {
    id: 'money-mania-mhb',
    name: 'Money Mania (Must-Hit-By)',
    shortName: 'Money Mania',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Various themes (Cleopatra, Pharaoh\'s Fortune) with MHB progressives',
    visual: {
      location: 'TOP displays showing "Must Hit By" with current/ceiling',
      appearance: [
        { label: 'Themes', text: 'Cleopatra, Pharaoh\'s Fortune, Sphinx Wild, and more' },
        { label: 'MHB Display', text: 'Clearly shows ceiling amount for each tier' },
        { label: 'Format', text: 'Bright LED numbers with MHB text' },
      ],
      colors: 'Varies by theme (Egyptian gold, etc.)',
      example: '$475.50 Must Hit By $500'
    },
    thresholdSummary: '90%+ of ceiling',
    thresholdDetail: 'Standard MHB math applies.',
    threshold: {
      conservative: '90%+ of ceiling',
      aggressive: '85%+ if multiple tiers are high'
    },
    notes: 'Multiple theme variations - all use same MHB mechanic.',
    hasCalculator: true
  },

  {
    id: 'generic-mhb',
    name: 'Other Must-Hit-By Games',
    shortName: 'Any MHB Game',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Various (Konami, WMS, IGT, Ainsworth)',
    quickId: 'ANY machine showing "Must Hit By" or "Must Award By" text with ceiling amount',
    visual: {
      location: 'TOP of machine, above main screen',
      appearance: [
        { label: 'Key Text', text: 'Look for "Must Hit By $X" or "Must Award By $X"', highlight: true },
        { label: 'Display', text: 'Current amount (changing) next to ceiling (static)' },
        { label: 'Format', text: 'LED-style digits, often red/gold/green' },
      ],
      colors: 'Varies - look for the MHB text',
      example: 'Current: $487.23 | Must Hit By: $500.00'
    },
    thresholdSummary: '90%+ of ceiling (use calculator)',
    thresholdDetail: 'Divide current by ceiling × 100. At 90%+ you have edge. At 80-89% marginal. Below 80% skip.',
    threshold: {
      conservative: '90%+ of ceiling',
      aggressive: '80%+ of ceiling',
      skip: 'Below 80%'
    },
    warning: 'AVOID AGS machines (River Dragons, Rakin\' Bacon) — programmed to hit at 99%+. Check cabinet for AGS logo.',
    notes: 'This is your catch-all for any MHB game you find.',
    hasCalculator: true
  },

  // =============================================
  // BANKED COINS/SYMBOLS (Tier 1)
  // =============================================

  {
    id: 'golden-egypt',
    name: 'Golden Egypt',
    shortName: 'Golden Egypt',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Gold coins in meter boxes ABOVE each reel',
    visual: {
      location: 'ABOVE each reel (not on the reels) — rectangular meter boxes',
      appearance: [
        { label: 'Coins', text: 'Small GOLD CIRCLES with Egyptian designs' },
        { label: 'Meters', text: 'Dark rectangular boxes above each reel, holds 0-2 coins each' },
        { label: '2 coins', text: 'That reel goes WILD for 2 spins (glows gold)', highlight: true },
      ],
      colors: 'Gold and blue Egyptian theme — pharaoh imagery, hieroglyphics',
      example: 'Empty = dark box. 1 coin = one gold circle. 2 coins = reel about to go wild'
    },
    thresholdSummary: '1+ coin on two of columns 1-3',
    thresholdDetail: 'Reels are numbered 1-5 from left to right. Since wins pay left-to-right, wild reels on columns 1-3 are valuable.',
    threshold: {
      conservative: '1+ coin on two of first three columns',
      aggressive: 'Any 2 coins total on columns 1-3',
      skip: 'Coins only on columns 4-5 (right side)'
    },
    notes: 'CHECK ALL BET LEVELS — each is independent!',
    checkBetLevels: true
  },

  {
    id: 'ocean-magic',
    name: 'Ocean Magic',
    shortName: 'Ocean Magic',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Blue bubbles floating up on underwater-themed reels',
    visual: {
      location: 'On the reels AND below the bottom row',
      appearance: [
        { label: 'Bubbles', text: 'TRANSLUCENT BLUE-GREEN circles with shimmer/glow' },
        { label: 'Movement', text: 'Float UP one row per spin until they exit top', highlight: true },
        { label: 'Below reels', text: 'Look for curved bubble shapes about to enter' },
      ],
      colors: 'Deep blue underwater background — fish, seahorses, coral',
      example: 'Bubbles visible below play area = about to float up'
    },
    thresholdSummary: 'Any bubble rows 1-3 on reels 2-4',
    thresholdDetail: 'Bubbles are wild symbols that float up one row per spin. Reels 2-4 (middle) are most valuable.',
    threshold: {
      conservative: 'Any bubble in rows 1-3 on reels 2, 3, or 4',
      aggressive: 'Multiple bubbles in good positions',
      quit: 'All bubbles floated off top, none visible below'
    },
    notes: 'Very visual — can spot from distance without sitting down.',
    checkBetLevels: false
  },

  {
    id: 'magic-of-nile',
    category: 'banked-coins',
    name: 'Magic of the Nile',
    shortName: 'Magic of Nile',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Three colored obelisks on LEFT side — look for SPARKLING gems',
    visual: {
      location: 'LEFT SIDE of screen — three tall vertical columns (obelisks)',
      appearance: [
        { label: 'Obelisks', text: 'RED (left), BLUE (middle), GREEN (right) columns' },
        { label: 'Segments', text: 'Each divided into 3 segments, light up bottom-to-top' },
        { label: 'KEY CUE', text: 'Gem at TOP of obelisk SPARKLES when 2+ segments lit', highlight: true },
      ],
      colors: 'Egyptian/Nile theme — blue water, pyramids, golden accents',
      example: 'SPARKLING GEM = 2+ gems collected'
    },
    thresholdSummary: '2+ sparkling gems (2 colors with 2+ each)',
    thresholdDetail: 'Each obelisk tracks gems of its color. When 2+ gems are collected, the gem at the top sparkles.',
    threshold: {
      conservative: 'Two colors with 2 gems each (two sparkling gems)',
      aggressive: 'Any 4 gems total',
      quickScout: 'Just look for SPARKLING gems'
    },
    notes: '5 BET LEVELS, each independent!',
    checkBetLevels: true
  },

  {
    id: 'buffalo-link',
    category: 'cycle-bonus',
    name: 'Buffalo Link',
    shortName: 'Buffalo Link',
    tier: 2,
    manufacturer: 'Aristocrat',
    quickId: 'Meter on RIGHT side showing buffalo head count out of 1,800',
    visual: {
      location: 'RIGHT SIDE of screen — vertical progress bar',
      appearance: [
        { label: 'Meter', text: 'Shows count like "847 / 1,800"' },
        { label: 'Symbols', text: 'HEADS increment meter, BODIES trigger Hold & Spin' },
        { label: 'Cycle', text: 'Starts at 100 after bonus, auto-triggers at 1,800' },
      ],
      colors: 'Purple/orange sunset, mountain scenery',
      example: 'Meter at 1,450+ = playable territory'
    },
    thresholdSummary: '1,450+ on meter (out of 1,800)',
    thresholdDetail: 'The meter fills as buffalo head symbols land. At 1,800, a bonus is guaranteed.',
    threshold: {
      conservative: '1,450+ (about 80% of 1,800)',
      aggressive: '1,300-1,400 at higher bet levels'
    },
    notes: 'Very popular but high threshold.',
    checkBetLevels: false
  },

  {
    id: 'hexbreaker',
    category: 'expanding-reels',
    name: 'Hexbreak3r',
    shortName: 'Hexbreak3r',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Reels at different heights + "Ways to Win" number',
    visual: {
      location: 'BOTTOM LEFT shows "Ways to Win"',
      appearance: [
        { label: 'Reels', text: 'Each of 5 reels can show 3-8 positions' },
        { label: 'Prize orbs', text: 'GLOWING ORBS above each reel' },
        { label: 'Horseshoes', text: 'ORANGE = +1 height, BLUE = +2 height' },
      ],
      colors: 'Dark purple/black + neon green',
      example: 'Ways = product of heights'
    },
    thresholdSummary: '6,000+ ways OR any reel at 8',
    thresholdDetail: 'More ways = more chances to win per spin.',
    threshold: {
      conservative: '6,000+ ways OR any reel at 8',
      best: 'Center column (reel 3) at 6+'
    },
    notes: 'High variance.',
    checkBetLevels: false
  },

  {
    id: 'huff-n-puff',
    category: 'persistent-state',
    name: 'Huff N\' Puff Series',
    shortName: 'Huff N\' Puff',
    tier: 2,
    manufacturer: 'Light & Wonder',
    quickId: 'Three Little Pigs theme — houses being built',
    visual: {
      location: 'Houses appear on reel positions during bonus',
      appearance: [
        { label: 'Houses', text: 'STRAW → WOOD → BRICK → MANSION' },
        { label: 'Scatters', text: 'YELLOW HARD HATS trigger free spins' },
        { label: 'Wheel', text: 'BUZZSAW symbols trigger wheel spin' },
      ],
      colors: 'Cartoon pigs, Big Bad Wolf',
      example: 'Wolf blows down houses at bonus end'
    },
    thresholdSummary: 'Mid-bonus with brick houses',
    thresholdDetail: 'NOT persistent state — value resets when bonus ends.',
    threshold: {
      play: 'NOT traditional persistent state',
      lookFor: 'Someone abandoned MID-BONUS'
    },
    notes: 'Mid-bonus abandonment is rare.',
    checkBetLevels: false
  },

  {
    id: 'regal-riches',
    category: 'banked-coins',
    name: 'Regal Riches',
    shortName: 'Regal Riches',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Four colored meter bars (Blue/Purple/Green/Yellow)',
    visual: {
      location: 'Four colored progress bars on sides',
      appearance: [
        { label: 'Meters', text: 'BLUE, PURPLE, GREEN, YELLOW' },
        { label: 'Display', text: 'Shows count like "7/50"' },
        { label: 'Wilds', text: 'Wild symbols add to bank' },
      ],
      colors: 'Purple/gold royal theme',
      example: 'Blue at 8+, Purple at 56+'
    },
    thresholdSummary: 'Blue 8+ / Purple 56+ / Green 81+ / Yellow 106+',
    thresholdDetail: 'Each color has a different scale.',
    threshold: {
      blue: '8+ wilds',
      purple: '56+ wilds',
      green: '81+ wilds',
      yellow: '106+ wilds'
    },
    notes: 'Each bet level has INDEPENDENT meters!',
    checkBetLevels: true
  },

  {
    id: 'buffalo-ascension',
    category: 'expanding-reels',
    name: 'Buffalo Ascension',
    shortName: 'Buffalo Ascension',
    tier: 2,
    manufacturer: 'Aristocrat',
    quickId: 'Middle three reels at different heights',
    visual: {
      location: 'Middle reels (2, 3, 4) at different heights',
      appearance: [
        { label: 'Expanding', text: 'Reels 2, 3, 4 grow from 4 to 7 positions' },
        { label: 'Arrows', text: 'GOLD ARROW symbols grow reels' },
        { label: 'Prizes', text: 'Above reels: "Stampede" or progressive' },
      ],
      colors: 'Buffalo theme — sunset colors',
      example: 'Max = 5,488 ways'
    },
    thresholdSummary: '3,136+ ways to win',
    thresholdDetail: 'Ways = product of all reel heights.',
    threshold: {
      conservative: '3,136+ ways',
      best: 'Reels 2 or 4 at height 7'
    },
    warning: 'HIGH VARIANCE — brutal swings.',
    checkBetLevels: false
  },

  {
    id: 'cash-falls',
    category: 'banked-coins',
    name: 'Cash Falls',
    shortName: 'Cash Falls',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Column containers ABOVE reels filling with coins',
    visual: {
      location: 'ABOVE main reels — column containers',
      appearance: [
        { label: 'Columns', text: '5 containers that fill with GOLD COINS' },
        { label: 'Visual', text: 'Coins stack up visibly' },
        { label: 'Trigger', text: 'Coins "fall" when columns fill' },
      ],
      colors: 'Various themes',
      example: 'Multiple columns half full'
    },
    thresholdSummary: 'Multiple columns more than half full',
    thresholdDetail: 'Coins accumulate in containers above each reel.',
    threshold: {
      play: 'Multiple columns visually more than half full'
    },
    notes: 'Check all bet levels.',
    checkBetLevels: true
  },

  {
    id: 'rich-little-piggies',
    category: 'banked-coins',
    name: 'Rich Little Piggies',
    shortName: 'Rich Little Piggies',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Three piggy banks that grow FATTER',
    visual: {
      location: 'Three colored piggy banks',
      appearance: [
        { label: 'Pigs', text: 'BLUE, YELLOW, RED piggy banks' },
        { label: 'KEY CUE', text: 'Pigs VISUALLY GROW FATTER', highlight: true },
        { label: 'State', text: 'FAT = lots banked' },
      ],
      colors: 'Cartoon pig theme',
      example: 'Both blue AND yellow pigs fat'
    },
    thresholdSummary: 'Blue AND yellow pigs both FAT',
    thresholdDetail: 'Visual "fatness" correlates with coins banked.',
    threshold: {
      play: 'Blue AND yellow pigs both visibly fat'
    },
    warning: 'CONTROVERSIAL — high variance.',
    checkBetLevels: false
  },

  {
    id: 'piggy-bankin',
    category: 'banked-coins',
    name: 'Piggy Bankin\'',
    shortName: 'Piggy Bankin\'',
    tier: 3,
    manufacturer: 'WMS Classic',
    quickId: 'CLASSIC 3-reel with 9 piggy banks in top box',
    visual: {
      location: 'TOP BOX above mechanical reels',
      appearance: [
        { label: 'Cabinet', text: 'OLDER 3-REEL MECHANICAL slot' },
        { label: 'Top box', text: '9 cartoon PIGGY BANKS in a row' },
        { label: 'Mechanic', text: '510 coins across 9 pigs' },
      ],
      colors: 'Classic WMS style',
      example: 'Fewer pigs = closer to bonus'
    },
    thresholdSummary: '≤3 piggies remaining',
    thresholdDetail: 'Fewer pigs = fewer coins before lucky one.',
    threshold: {
      conservative: '3 or fewer piggies remaining',
      aggressive: '4-5 remaining'
    },
    notes: 'CLASSIC MACHINE — increasingly RARE.',
    checkBetLevels: false
  },
  
  // =============================================
  // ADDITIONAL TIER 1 MACHINES
  // =============================================

  {
    id: 'scarab-link',
    name: 'Scarab Link',
    shortName: 'Scarab Link',
    category: 'cycle-bonus',
    tier: 1,
    manufacturer: 'IGT',
    quickId: '10-spin cycle — scarabs collected on spins 1-9 go WILD on spin 10',
    visual: {
      location: 'Counter showing which spin you\'re on (1-10)',
      appearance: [
        { label: 'Counter', text: 'Shows current spin number out of 10', highlight: true },
        { label: 'Scarabs', text: 'Beetle symbols collected during spins 1-9' },
        { label: 'Spin 10', text: 'ALL collected scarabs turn WILD' },
      ],
      colors: 'Egyptian gold/blue theme with scarab beetles',
      example: 'Spin 7 with 5 scarabs collected = good setup'
    },
    thresholdSummary: 'Spin 7+ with 3+ scarabs collected',
    thresholdDetail: 'The later in the cycle with more scarabs = more wilds on spin 10.',
    threshold: {
      conservative: 'Spin 8-9 with 4+ scarabs',
      aggressive: 'Spin 7+ with 3+ scarabs',
      best: 'Spin 9 with 5+ scarabs'
    },
    notes: 'Very common machine. Easy to spot cycle counter.',
    checkBetLevels: true
  },

  {
    id: 'treasure-ball',
    name: 'Treasure Ball',
    shortName: 'Treasure Ball',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Treasure chest that fills with gold coins above reels',
    visual: {
      location: 'Treasure chest display ABOVE the reels',
      appearance: [
        { label: 'Chest', text: 'Animated treasure chest that fills with coins' },
        { label: 'Coins', text: 'Gold coins visually stack up in chest' },
        { label: 'Trigger', text: 'When full, triggers bonus round' },
      ],
      colors: 'Gold/brown pirate treasure theme',
      example: 'Chest 75%+ full = worth playing'
    },
    thresholdSummary: 'Chest more than half full',
    thresholdDetail: 'Visual inspection - the fuller the chest, the closer to bonus.',
    threshold: {
      conservative: '75%+ full',
      aggressive: '50%+ full'
    },
    notes: 'Check all bet levels - each independent.',
    checkBetLevels: true
  },

  {
    id: 'wonka-3-reel',
    name: 'Willy Wonka 3-Reel',
    shortName: 'Wonka 3-Reel',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'WMS',
    quickId: 'Oompa Loompa meters on sides tracking progress to features',
    visual: {
      location: 'Side panels showing Oompa Loompa character meters',
      appearance: [
        { label: 'Meters', text: 'Multiple character meters (Oompa Loompas, etc.)' },
        { label: 'Progress', text: 'Bars fill up as symbols land' },
        { label: 'Features', text: 'Different bonuses for each character' },
      ],
      colors: 'Colorful Wonka chocolate factory theme',
      example: 'Multiple meters at 75%+'
    },
    thresholdSummary: 'Any meter at 75%+ OR multiple meters at 50%+',
    thresholdDetail: 'Each meter triggers a different bonus when full.',
    threshold: {
      conservative: 'Any meter at 80%+',
      aggressive: '2+ meters at 50%+'
    },
    notes: 'Multiple versions exist - look for the banked meters.',
    checkBetLevels: false
  },

  // =============================================
  // ADDITIONAL MACHINES FROM RESEARCH
  // =============================================

  {
    id: 'prosperity-pearl',
    name: 'Prosperity Pearl',
    shortName: 'Prosperity Pearl',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Sister game to Regal Riches - three colored pearl meters + hidden center meter',
    visual: {
      location: 'Three large meters at top (purple/green/gold) + small center meter above reel 3',
      appearance: [
        { label: 'Main Meters', text: 'Purple (MHB 75), Green (MHB 100), Gold (MHB 125)' },
        { label: 'Center Meter', text: 'Small meter above reel 3, starts at 5, KEY for advantage plays', highlight: true },
        { label: 'Pearls', text: 'Colored pearls on reels increase corresponding meters' },
      ],
      colors: 'Ocean blue theme with pearls',
      example: 'Center meter at 8+ = playable'
    },
    thresholdSummary: 'Center meter 8+ OR main meters at 63/83/113',
    thresholdDetail: 'Hidden center meter triggers random wilds. Main meters: Purple 63+, Green 83+, Gold 113+ (assuming others at reset).',
    threshold: {
      conservative: 'Center meter 10+',
      aggressive: 'Center meter 8+',
      mainMeters: 'Purple 63, Green 83, Gold 113'
    },
    notes: 'CHECK ALL BET LEVELS - center meter varies! Tap each bet to see it.',
    checkBetLevels: true
  },

  {
    id: 'dragonsphere',
    name: 'DragonSphere',
    shortName: 'DragonSphere',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Ocean Magic clone - orbs float DOWN instead of up',
    visual: {
      location: 'On the reels - look for glowing orbs ABOVE the top row',
      appearance: [
        { label: 'Orbs', text: 'Glowing wild orbs that float DOWN one row per spin' },
        { label: 'Direction', text: 'Orbs come from TOP (opposite of Ocean Magic)', highlight: true },
        { label: 'Dragon symbols', text: 'If orb lands on dragon, expands to adjacent spots' },
      ],
      colors: 'Dragon/fire theme, red and gold',
      example: 'Orbs visible in top rows on reels 1-4 = playable'
    },
    thresholdSummary: 'Orbs in rows 1-4 on reels 1-4 (ignore reel 5)',
    thresholdDetail: 'Same as Ocean Magic but orbs descend. Ignore reel 5 (pays left-to-right) and bottom row (about to exit).',
    threshold: {
      conservative: 'Multiple orbs in rows 1-3 on reels 1-4',
      aggressive: 'Any orb in good position',
      quit: 'All orbs have fallen off bottom'
    },
    notes: 'Less scouted than Ocean Magic - may find more plays.',
    checkBetLevels: true
  },

  {
    id: 'legends-fire-water',
    name: 'Legends of Fire and Water',
    shortName: 'Legends Fire/Water',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'Spielo/GTECH',
    quickId: 'Dragon wild stack meters above reels 1, 3, and 5',
    visual: {
      location: 'Meters ABOVE reels 1, 3, and 5 showing wild count',
      appearance: [
        { label: 'Meters', text: 'Numbers above reels 1, 3, 5 showing accumulated wilds' },
        { label: 'Yin-Yang', text: 'Gold yin-yang adds 1-3 wilds, broken reduces by 10-100%' },
        { label: 'Dragon', text: 'Full wild dragon adds 5 to that reel\'s meter' },
      ],
      colors: 'Asian dragon theme with fire/water elements',
      example: 'Columns 1 & 3 in high teens = playable'
    },
    thresholdSummary: 'Columns 1 & 3 in high teens OR either over 20',
    thresholdDetail: 'Focus on columns 1 & 3 (most valuable). Column 5 count doesn\'t matter for play decision.',
    threshold: {
      conservative: 'Both columns 1 & 3 at 17+',
      aggressive: 'Either column 1 or 3 over 20',
      quit: 'When broken yin-yangs drop meters below threshold'
    },
    notes: 'Streaky game - losses usually small, positive runs can be great.',
    checkBetLevels: true
  },

  {
    id: 'progressive-free-games',
    name: 'Progressive Free Games (Triple Double Diamond / Phoenix)',
    shortName: 'Progressive Free Games',
    category: 'cycle-bonus',
    tier: 1,
    manufacturer: 'IGT',
    quickId: '3-reel with three MHB free game meters (2x, 5x, 10x) - must hit by 15',
    visual: {
      location: 'Three meters on screen showing free games remaining until trigger',
      appearance: [
        { label: '2x Meter', text: 'Red meter - 2x multiplier free games (cycles every ~48 spins)' },
        { label: '5x Meter', text: 'Green meter - 5x multiplier free games (cycles every ~175 spins)' },
        { label: '10x Meter', text: 'Blue meter - 10x multiplier free games (cycles every ~600 spins)', highlight: true },
      ],
      colors: 'Classic 3-reel look (Triple Double Diamond or Phoenix theme)',
      example: '10x meter at 14 = very playable'
    },
    thresholdSummary: '12+ red, 13+ green, 14+ blue',
    thresholdDetail: 'Meters move on fixed cycles. At 15 it triggers. Higher multiplier = better payout potential.',
    threshold: {
      conservative: '14 on any meter',
      aggressive: '12 red, 13 green, 14 blue',
      best: '14 on the 10x (blue) meter'
    },
    notes: 'Very popular among APs. Meters are competitive - take plays when you find them.',
    checkBetLevels: false
  },

  {
    id: 'treasure-box-igt',
    name: 'Treasure Box',
    shortName: 'Treasure Box',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Coin counter showing coins needed to trigger respin bonus (starts at 6)',
    visual: {
      location: 'Top screen shows coin count needed for respin bonus',
      appearance: [
        { label: 'Counter', text: 'Number showing coins needed (starts at 6, decreases)', highlight: true },
        { label: 'Key Symbol', text: 'Key on reel 3 reduces counter by 1' },
        { label: 'Respin Bonus', text: 'Collect coins, multipliers, and progressive jewels' },
      ],
      colors: 'Pirate treasure theme',
      example: 'Counter at 3 or less = good play'
    },
    thresholdSummary: '4 or less coins needed',
    thresholdDetail: 'Counter starts at 6, decreases as coins land or keys appear. Play until you trigger respin bonus.',
    threshold: {
      conservative: '3 or less',
      aggressive: '4 or less',
      skip: '5 or more'
    },
    notes: 'CHECK ALL BET LEVELS - each is independent. Higher bets = higher variance.',
    checkBetLevels: true
  },

  {
    id: 'jackpot-explosion',
    name: 'Jackpot Explosion',
    shortName: 'Jackpot Explosion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    quickId: 'Community volcano that fills with lava - erupts to award progressive',
    visual: {
      location: 'Shared volcano display above bank of linked machines',
      appearance: [
        { label: 'Volcano', text: 'Animated volcano that fills with lava' },
        { label: 'Lava Level', text: 'Higher = closer to eruption', highlight: true },
        { label: 'Progressives', text: 'Four progressives awarded when volcano erupts' },
      ],
      colors: 'Red/orange volcanic theme',
      example: 'Lava near very top = worth playing'
    },
    thresholdSummary: 'Lava near very top of volcano',
    thresholdDetail: 'Community game - consider how many others are playing and their bet sizes.',
    threshold: {
      conservative: 'Lava at 90%+ of volcano height',
      aggressive: 'Lava at 80%+ with low-betting opponents'
    },
    notes: 'Not a primary AP target - good backup when other plays are cleaned out.',
    checkBetLevels: false
  },

  {
    id: 'spy-vs-spy',
    name: 'Spy vs Spy',
    shortName: 'Spy vs Spy',
    category: 'banked-coins',
    tier: 3,
    manufacturer: 'WMS',
    quickId: 'OLDER game - Black and White spy meters on sides',
    visual: {
      location: 'Spy meters on left and right sides of screen',
      appearance: [
        { label: 'Black Spy', text: 'Meter on one side' },
        { label: 'White Spy', text: 'Meter on other side' },
        { label: 'Bonus', text: 'Triggers when either spy meter fills' },
      ],
      colors: 'Black and white MAD Magazine comic style',
      example: 'Either spy meter nearly full'
    },
    thresholdSummary: 'Either spy meter 80%+ full',
    thresholdDetail: 'Older game - increasingly rare but still found in some casinos.',
    threshold: {
      conservative: 'Either meter 90%+',
      aggressive: 'Either meter 75%+'
    },
    notes: 'RARE - based on MAD Magazine comic. Worth playing if you find one.',
    checkBetLevels: false
  },

  {
    id: 'dice-seeker',
    name: 'Dice Seeker',
    shortName: 'Dice Seeker',
    category: 'cycle-bonus',
    tier: 2,
    manufacturer: 'Everi',
    quickId: 'Dice symbols accumulate - bonus triggers when you collect enough',
    visual: {
      location: 'Dice counter/meter on screen',
      appearance: [
        { label: 'Dice', text: 'Dice symbols land and accumulate' },
        { label: 'Counter', text: 'Shows progress toward bonus' },
        { label: 'Bonus', text: 'Triggered when threshold reached' },
      ],
      colors: 'Varies by theme',
      example: 'High dice count = playable'
    },
    thresholdSummary: 'High dice accumulation (varies by version)',
    thresholdDetail: 'Feature attached to various Everi slot themes.',
    threshold: {
      conservative: 'Counter very close to triggering',
      aggressive: 'Counter past halfway'
    },
    notes: 'Newer manufacturer - watch for this feature on Everi cabinets.',
    checkBetLevels: true
  },

  {
    id: 'green-stamps',
    name: 'S&H Green Stamps',
    shortName: 'Green Stamps',
    category: 'banked-coins',
    tier: 3,
    manufacturer: 'Bally',
    quickId: 'CLASSIC - Stamp book fills with green stamps (1x, 2x, 5x multipliers)',
    visual: {
      location: 'Stamp book display showing collected stamps',
      appearance: [
        { label: 'Book', text: 'Visual stamp book that fills up' },
        { label: 'Stamps', text: 'Green stamps with 1x, 2x, 5x multipliers' },
        { label: 'Bonus', text: 'When book is full, free games trigger' },
      ],
      colors: 'Retro green stamp theme',
      example: 'Book nearly full = strong play'
    },
    thresholdSummary: 'Book mostly full (visual inspection)',
    thresholdDetail: 'Need at least 2000 credits bankroll per denomination.',
    threshold: {
      conservative: 'Book 90%+ full',
      aggressive: 'Book 75%+ full'
    },
    warning: 'VERY RARE machine - classic that\'s nearly extinct.',
    notes: 'One of the original advantage slots. If you find one, consider yourself lucky.',
    checkBetLevels: false
  },

  {
    id: 'star-watch-magma',
    name: 'Star Watch Magma',
    shortName: 'Star Watch Magma',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    quickId: 'Volcano wheel at top with star symbols that award instant prizes',
    visual: {
      location: 'Large volcano wheel display at top of tall cabinet',
      appearance: [
        { label: 'Stars', text: 'Star symbols on reels award credit prizes or wheel spins' },
        { label: 'Volcano Wheel', text: 'Spin for Mini/Major/Mega/Maxi prizes' },
        { label: 'Strike Zone', text: 'Higher bets activate more reels for stars' },
      ],
      colors: 'Space/volcano theme with fiery colors',
      example: 'Multiple pending wheel spins = playable'
    },
    thresholdSummary: 'Multiple accumulated wheel spins OR high progressive',
    thresholdDetail: 'Check if previous player left wheel spins. Maxi resets at $5,000, Major at $500.',
    threshold: {
      conservative: '3+ wheel spins banked',
      aggressive: '2+ wheel spins with high progressive'
    },
    notes: 'Requires extra bet for full features. 43-inch tall cabinet.',
    checkBetLevels: true
  },

  {
    id: 'rescue-spin',
    name: 'Rescue Spin (Aruze games)',
    shortName: 'Rescue Spin',
    category: 'cycle-bonus',
    tier: 2,
    manufacturer: 'Aruze',
    quickId: 'Countdown meter to guaranteed bonus (usually 500 spins) with multiplier',
    visual: {
      location: 'Right side of screen - countdown number + multiplier',
      appearance: [
        { label: 'Countdown', text: 'Number showing spins until guaranteed bonus (starts ~500)' },
        { label: 'Multiplier', text: 'Average bet per line throughout play (1x-5x)', highlight: true },
        { label: 'Activation', text: 'May need to press button to activate (costs 5¢)' },
      ],
      colors: 'Varies by theme (Shen Long, Last Emperor, etc.)',
      example: '200 spins remaining with 3x+ multiplier'
    },
    thresholdSummary: '200 or fewer spins remaining (adjust for multiplier)',
    thresholdDetail: 'Higher multiplier = take at higher spin counts. Low multiplier (1-1.5x) = wait for ~150.',
    threshold: {
      conservative: '150 or less with any multiplier',
      aggressive: '225 or less with 3.5x+ multiplier',
      ideal: '100 or less with high multiplier'
    },
    notes: 'ACTIVATE RESCUE SPIN if not already on (press button, costs 5¢). Less common now.',
    checkBetLevels: false
  },

  // =============================================
  // NEW 2022-2025 MACHINES (from machinepro.club)
  // =============================================
  
  // --- WHEEL OF FORTUNE FAMILY ---

  {
    id: 'wof-4d',
    name: 'Wheel of Fortune 4D',
    shortName: 'WOF 4D',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Dollar symbol holders above reels - collect 2 to turn reel wild for 2 spins',
    visual: {
      location: 'Above each reel - small holders showing collected $ symbols',
      appearance: [
        { label: 'Collectors', text: 'Small boxes above each reel (hold 0-2 dollar symbols)' },
        { label: 'Wild Reels', text: 'When holder has 2, that reel turns wild for 2 spins', highlight: true },
        { label: 'Cabinet', text: '4D cabinet with physical spinning wheel on top' },
      ],
      colors: 'Blue/purple with iconic WOF wheel',
      example: 'Reels 2 and 4 have 1 dollar symbol each collected'
    },
    thresholdSummary: 'Any reel with 1+ collected',
    thresholdDetail: 'Look for 1 or more dollar symbols collected above any reel. Multiple reels with 1 = better play.',
    threshold: {
      conservative: '2+ reels with 1 symbol each',
      aggressive: 'Any reel with 1 symbol',
      ideal: '3+ reels with 1 symbol each'
    },
    notes: 'Very common on floors. Easier version of Golden Egypt mechanic.',
    checkBetLevels: false
  },

  {
    id: 'wof-4d-collectors',
    name: 'Wheel of Fortune 4D Collector\'s Edition',
    shortName: 'WOF 4D Collectors',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Credit prizes above reels that build up - Collect symbol awards them',
    visual: {
      location: 'Above each reel - credit prize amounts that grow',
      appearance: [
        { label: 'Prize Display', text: 'Credit amounts above each reel (grow as coins land)', highlight: true },
        { label: 'Collect', text: 'Landing Collect symbol in reel awards that prize' },
        { label: 'Reset', text: 'Prize resets after collection' },
      ],
      colors: 'Blue/purple WOF theme',
      example: 'Reel 3 shows $45.00 credit prize built up'
    },
    thresholdSummary: 'Any prize 25x+ bet or higher',
    thresholdDetail: 'Credit prizes above reels should be significantly above starting value.',
    threshold: {
      conservative: 'Any prize 30x+ bet',
      aggressive: 'Any prize 20x+ bet',
      ideal: 'Multiple prizes 25x+ bet'
    },
    notes: 'Different from regular WOF 4D - this collects credit values.',
    checkBetLevels: true
  },

  {
    id: 'wof-high-roller',
    name: 'Wheel of Fortune High Roller',
    shortName: 'WOF High Roller',
    category: 'expanding-reels',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Reels expand from 3 to 8 high - arrows above reels track height',
    visual: {
      location: 'Above reels - wheel spin awards; Reels visibly different heights',
      appearance: [
        { label: 'Reel Height', text: 'Reels start 3 high, expand to max 8', highlight: true },
        { label: 'Wheel Awards', text: 'Awards above each reel (multi-pointer, multiplier wheels)' },
        { label: 'Trigger', text: 'High Roller symbol on max height reel triggers wheel' },
      ],
      colors: 'Premium WOF cabinet',
      example: 'Reels at heights 5-6-7-5-4'
    },
    thresholdSummary: 'Any reel at 6+ height',
    thresholdDetail: 'Higher reels = closer to triggering wheel awards. Look for reels approaching 8.',
    threshold: {
      conservative: 'Any reel at 7+',
      aggressive: 'Any reel at 6+',
      ideal: 'Multiple reels at 6+'
    },
    notes: 'Higher bet levels = faster reel expansion.',
    checkBetLevels: true
  },

  // --- IGT GRAND SERIES (Updated classics) ---

  {
    id: 'golden-egypt-grand',
    name: 'Golden Egypt Grand',
    shortName: 'Golden Egypt Grand',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Coin holders above reels - fill holder for wild reel (2-4 spins)',
    visual: {
      location: 'Above each reel - coin collection holders',
      appearance: [
        { label: 'Holders', text: 'Show collected coins above each reel', highlight: true },
        { label: 'Wild Duration', text: '2, 3, or 4 spins wild based on coins collected' },
        { label: 'Theme', text: 'Egyptian pyramid/pharaoh theme' },
      ],
      colors: 'Gold and blue Egyptian theme',
      example: 'Reel 3 has 3/4 coins collected'
    },
    thresholdSummary: 'Any reel with 2+ coins of 4',
    thresholdDetail: 'More coins = closer to wild reel. 3/4 coins is ideal find.',
    threshold: {
      conservative: 'Any reel at 3/4 coins',
      aggressive: 'Any reel at 2/4 coins',
      ideal: 'Multiple reels at 2+ coins'
    },
    notes: 'Updated version of classic Golden Egypt. Very common.',
    checkBetLevels: false
  },

  {
    id: 'golden-jungle-grand',
    name: 'Golden Jungle Grand',
    shortName: 'Golden Jungle Grand',
    category: 'cycle-bonus',
    tier: 1,
    manufacturer: 'IGT',
    quickId: '10-spin cycle - collect Buddha symbols above reels for wild reels on spin 10',
    visual: {
      location: 'Above reels - Buddha collection + spin counter (1-10)',
      appearance: [
        { label: 'Spin Counter', text: 'Shows current spin in 10-spin cycle (1-10)', highlight: true },
        { label: 'Buddha Symbols', text: 'Collected above each reel (need 2 for wild)' },
        { label: 'Reset', text: 'Cycle resets after spin 10' },
      ],
      colors: 'Gold jungle theme',
      example: 'Spin 7/10, reels 2 and 4 have 2 Buddhas each'
    },
    thresholdSummary: 'Spin 5+ with 2+ reels having 2 Buddhas',
    thresholdDetail: 'The later in cycle + more Buddhas = better. Need 2 Buddhas per reel for wild.',
    threshold: {
      conservative: 'Spin 7+ with 2+ wild reels ready',
      aggressive: 'Spin 5+ with 2+ wild reels ready',
      ideal: 'Spin 8+ with 3+ wild reels ready'
    },
    notes: 'Easy to see cycle progress. 10-spin limit makes bankroll predictable.',
    checkBetLevels: false
  },

  {
    id: 'ocean-magic-grand',
    name: 'Ocean Magic Grand',
    shortName: 'Ocean Magic Grand',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Wild bubbles float UP one row per spin - land on Ocean Magic symbol for expanding wilds',
    visual: {
      location: 'On the reels - bubbles with "WILD" text floating upward',
      appearance: [
        { label: 'Bubbles', text: 'Wild bubbles on reels that move UP each spin', highlight: true },
        { label: 'Target', text: 'Ocean Magic symbol - bubble landing on it expands wilds' },
        { label: 'Movement', text: 'Bubbles rise one row per spin' },
      ],
      colors: 'Blue underwater ocean theme',
      example: 'Bubbles in rows 2-3 on reels 1,3,4'
    },
    thresholdSummary: 'Multiple bubbles in lower rows (1-3)',
    thresholdDetail: 'Bubbles in lower rows have more spins to potentially hit Ocean Magic symbols.',
    threshold: {
      conservative: '3+ bubbles in rows 1-3',
      aggressive: '2+ bubbles in rows 1-4',
      ideal: '4+ bubbles spread across lower rows'
    },
    notes: 'Updated version of Ocean Magic. Ignore reel 5 bubbles (less valuable).',
    checkBetLevels: false
  },

  // --- POPULAR 2023-2025 RELEASES ---

  {
    id: 'lucky-pick',
    name: 'Lucky Pick',
    shortName: 'Lucky Pick',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Board above reels with 21 covered picks - reveal credit prizes and upgrades',
    visual: {
      location: 'Above reels - 4x5+ grid of covered pick squares',
      appearance: [
        { label: 'Pick Board', text: '21 covered squares above reels', highlight: true },
        { label: 'Revealed', text: 'Some picks may already be revealed (credit values or upgrades)' },
        { label: 'Trigger', text: 'Lucky Pick symbol reveals one pick; 3 scatters = free games' },
      ],
      colors: 'Varies (Bumble Bee, Cash Tree, Leprechaun themes)',
      example: '8 picks revealed, several showing upgrade icons'
    },
    thresholdSummary: '8+ picks revealed with upgrades showing',
    thresholdDetail: 'More revealed picks (especially upgrades) = better bonus when triggered.',
    threshold: {
      conservative: '10+ picks revealed',
      aggressive: '6+ picks revealed with 2+ upgrades',
      ideal: '12+ picks with multiple upgrades'
    },
    notes: 'MOST LUCRATIVE newer AP game per machinepro.club. Complex but huge wins possible.',
    checkBetLevels: true
  },

  {
    id: 'dancing-drums-golden',
    name: 'Dancing Drums: Golden Drums',
    shortName: 'DD Golden Drums',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    quickId: 'Multiplier above reel 1 (starts 2x) - persists until used in Golden Respin',
    visual: {
      location: 'Above reel 1 / on bet pad - multiplier value (2x, 3x, etc.)',
      appearance: [
        { label: 'Multiplier', text: 'Current multiplier shown above first reel', highlight: true },
        { label: 'Build Up', text: 'Drum +1 symbols increment multiplier' },
        { label: 'Golden Respin', text: 'Drum in reels 1+2 triggers feature using multiplier' },
      ],
      colors: 'Red/gold Dancing Drums theme',
      example: 'Multiplier showing 5x above reel 1'
    },
    thresholdSummary: 'Multiplier at 4x or higher',
    thresholdDetail: 'Higher multiplier = bigger wins when Golden Respin triggers.',
    threshold: {
      conservative: '5x+ multiplier',
      aggressive: '4x+ multiplier',
      ideal: '6x+ multiplier'
    },
    notes: 'Different from regular Dancing Drums. Look for "Golden Drums" subtitle.',
    checkBetLevels: false
  },

  {
    id: 'dragon-unleashed',
    name: 'Dragon Unleashed',
    shortName: 'Dragon Unleashed',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Orbs with credits fall DOWN one row per spin - 6 orbs triggers hold & spin',
    visual: {
      location: 'On reels - orbs with credit values that shift DOWN',
      appearance: [
        { label: 'Orbs', text: 'Credit value orbs on reels moving DOWN each spin', highlight: true },
        { label: 'Stacking', text: 'Orbs often stack vertically (up to 4 tall)' },
        { label: 'Trigger', text: '6 orbs on screen triggers hold & spin' },
      ],
      colors: 'Red/gold dragon theme (Prosperity Packets, Red Fleet, etc.)',
      example: 'Stack of 3 orbs in top rows of reel 2'
    },
    thresholdSummary: '4+ orbs visible in upper rows',
    thresholdDetail: 'Orbs in upper rows have more spins to accumulate to 6.',
    threshold: {
      conservative: '5+ orbs visible',
      aggressive: '4+ orbs in rows 1-2',
      ideal: '5+ orbs with stacked positions'
    },
    notes: 'Themes: Prosperity Packets, Red Fleet, Three Legends, Treasured Happiness.',
    checkBetLevels: false
  },

  {
    id: 'ultimate-fire-link-cash-falls',
    name: 'Ultimate Fire Link Cash Falls',
    shortName: 'UFL Cash Falls',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Fireballs fill columns - fill entire reel to win all credits in that column',
    visual: {
      location: 'On reels - fireballs with credit values + spin counters',
      appearance: [
        { label: 'Fireballs', text: 'Credit value fireballs on reels', highlight: true },
        { label: 'Counter', text: '3-spin countdown below each reel with fireballs' },
        { label: 'Fill Column', text: 'Fill entire reel before counter hits 0 = win all' },
      ],
      colors: 'Fire Link orange/red theme (China Street, Olvera Street)',
      example: 'Reel 3 has 3/4 positions filled, counter at 2'
    },
    thresholdSummary: 'Any column with 3+ fireballs',
    thresholdDetail: 'Close to filling a column with spins remaining = good play.',
    threshold: {
      conservative: 'Any column 3/4 full with counter 2+',
      aggressive: 'Any column 3/4 full with counter 1+',
      ideal: 'Multiple columns close to filling'
    },
    notes: 'Part of popular Fire Link family. Look for Fire Link Feature fireball.',
    checkBetLevels: true
  },

  {
    id: 'fu-dai-lian-lian-boost',
    name: 'Fu Dai Lian Lian Boost',
    shortName: 'FDLL Boost',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Three bags fill with coins/jewels - fuller bags = boosted bonus features',
    visual: {
      location: 'Above reels - 3 bags (different colors) showing fill level',
      appearance: [
        { label: 'Bags', text: 'Three colored bags above reels', highlight: true },
        { label: 'Fill Level', text: 'Bags get fatter and show jewels when full' },
        { label: 'Boost', text: 'Full bags = enhanced bonus features (NOT closer to triggering)' },
      ],
      colors: 'Red/gold Asian theme with peacock/tiger variants',
      example: 'Two bags showing jewels (glowing)'
    },
    thresholdSummary: '2+ bags with jewels showing',
    thresholdDetail: 'Jewels mean bag is full and bonus will be "boosted" when it hits.',
    threshold: {
      conservative: 'All 3 bags with jewels',
      aggressive: '2+ bags with jewels',
      ideal: 'All 3 bags with jewels + high progressive'
    },
    notes: 'IMPORTANT: Fuller bags do NOT mean bonus is closer - just better when it hits.',
    checkBetLevels: false,
    warning: 'Bags being full does NOT increase trigger chance - only improves bonus quality!'
  },

  {
    id: 'phoenix-link',
    name: 'Phoenix Link',
    shortName: 'Phoenix Link',
    category: 'cycle-bonus',
    tier: 1,
    manufacturer: 'Aristocrat',
    quickId: 'Phoenix counter resets 100-1500, MUST HIT BY 1888',
    visual: {
      location: 'Counter showing phoenix symbols collected',
      appearance: [
        { label: 'Counter', text: 'Shows current phoenix count (resets 100-1500)', highlight: true },
        { label: 'MHB', text: 'Must hit by 1888' },
        { label: 'Trigger', text: 'Accumulate phoenix symbols for hold & spin' },
      ],
      colors: 'Red/orange phoenix fire theme',
      example: 'Counter at 1650/1888'
    },
    thresholdSummary: '1700+ on counter (90% of 1888)',
    thresholdDetail: 'Standard MHB math: counter ÷ 1888 × 100.',
    threshold: {
      conservative: '1700+ (90%)',
      aggressive: '1600+ (85%)',
      ideal: '1750+ (93%)'
    },
    notes: 'From Aristocrat - different from IGT games. Very popular.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'ultra-rush-gold',
    name: 'Ultra Rush Gold',
    shortName: 'Ultra Rush Gold',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'Everi',
    quickId: 'Gold scatters lock for 3 spins - 6 scatters triggers bonus',
    visual: {
      location: 'On reels - gold scatter symbols with lock counters',
      appearance: [
        { label: 'Scatters', text: 'Gold symbols that lock for 3 spins when they land', highlight: true },
        { label: 'Counter', text: 'Each scatter shows spins remaining (3→2→1→gone)' },
        { label: 'Goal', text: 'Get 6 scatters on screen simultaneously' },
      ],
      colors: 'Gold theme (African Adventure, Mythical Phoenix, Tiger Run)',
      example: '4 scatters visible with mixed counters'
    },
    thresholdSummary: '4+ scatters visible',
    thresholdDetail: 'More scatters with higher counters = better chance to reach 6.',
    threshold: {
      conservative: '5+ scatters on screen',
      aggressive: '4+ scatters with 2+ showing 3 spins',
      ideal: '5+ scatters with most at 2-3 spins'
    },
    notes: 'Everi game - less common than IGT but solid when found.',
    checkBetLevels: false
  },

  {
    id: 'power-push',
    name: 'Power Push',
    shortName: 'Power Push',
    category: 'cycle-bonus',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Coin pusher tray - coins stack in back, push triggers at 300 coins (12 full stacks)',
    visual: {
      location: 'Above reels - coin pusher tray with stacks and prizes',
      appearance: [
        { label: 'Stacks', text: '12 stacks of coins in back of tray (25 coins each)', highlight: true },
        { label: 'Prizes', text: 'Credit values and jackpots on the tray' },
        { label: 'Push', text: 'MHB at 300 coins total (12 full stacks)' },
      ],
      colors: 'Jin Gou or Long De Xiyue theme',
      example: '9 stacks full, 10th partially filled'
    },
    thresholdSummary: '250+ coins collected (83%+)',
    thresholdDetail: 'Count stacks: each full stack = 25 coins. 10+ full stacks = good play.',
    threshold: {
      conservative: '270+ coins (10.8 stacks)',
      aggressive: '250+ coins (10 stacks)',
      ideal: '280+ coins (11+ stacks)'
    },
    notes: 'Unique coin pusher mechanic. Also check what prizes are visible on tray.',
    checkBetLevels: false
  },

  {
    id: 'rich-little-piggies-2',
    name: 'Rich Little Piggies Hog Wild / Meal Ticket',
    shortName: 'RLP Hog Wild',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    quickId: 'Three pigs that get fatter - blue (spins), yellow (jackpots), red (wilds/symbols)',
    visual: {
      location: 'Above reels - 3 pigs (blue, yellow, red) at varying sizes',
      appearance: [
        { label: 'Pigs', text: 'Three pigs that grow fatter as features build', highlight: true },
        { label: 'Blue', text: 'Increasing free games count' },
        { label: 'Yellow', text: 'Better jackpot chances' },
        { label: 'Red', text: 'Guaranteed wilds (Hog Wild) or symbol removal (Meal Ticket)' },
      ],
      colors: 'Colorful farm/pig theme',
      example: 'All 3 pigs visibly fat'
    },
    thresholdSummary: 'All 3 pigs visibly fat',
    thresholdDetail: 'Fatter pigs = better features when bonus triggers. NOT closer to triggering.',
    threshold: {
      conservative: 'All 3 pigs at max fat',
      aggressive: '2+ pigs very fat',
      ideal: 'All 3 pigs max fat + coins visible'
    },
    notes: 'Like FDLL Boost - fat pigs improve bonus quality, NOT trigger chance.',
    warning: 'Fat pigs do NOT increase trigger probability!',
    checkBetLevels: false
  },

  {
    id: 'crackin-cash',
    name: 'Crackin\' Cash',
    shortName: 'Crackin Cash',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Three balloons above each reel - rocket symbols award balloon prizes',
    visual: {
      location: 'Above each reel - 3 stacked balloons with credit values',
      appearance: [
        { label: 'Balloons', text: 'Purple (small), green (larger), jackpot balloons above reels', highlight: true },
        { label: 'Values', text: 'Credit values shown on balloons' },
        { label: 'Rockets', text: 'Single rocket = 1 balloon; Triple rocket = all 3' },
      ],
      colors: 'Colorful balloon/celebration theme',
      example: 'Multiple green/jackpot balloons in bottom positions'
    },
    thresholdSummary: 'High-value balloons in bottom position',
    thresholdDetail: 'Balloons push up when new ones land. Bottom balloon = next to be awarded.',
    threshold: {
      conservative: 'Jackpot balloon in bottom position on any reel',
      aggressive: 'Green balloon in bottom on 2+ reels',
      ideal: 'Multiple jackpot/green balloons in bottom positions'
    },
    notes: 'New balloons push old ones up. Track what\'s about to be awarded.',
    checkBetLevels: false
  },

  {
    id: 'bustin-money',
    name: 'Bustin\' Money',
    shortName: 'Bustin Money',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Three safes (red/green/blue) above reels - build up spins, ways, and multiplier',
    visual: {
      location: 'Above reels - 3 safes that get fatter as features build',
      appearance: [
        { label: 'Red Safe', text: 'Increasing free games count' },
        { label: 'Green Safe', text: 'Increasing ways to win' },
        { label: 'Blue Safe', text: 'Increasing multiplier', highlight: true },
        { label: 'Fat Level', text: 'Safes get fatter as they build' },
      ],
      colors: 'Red/green/blue safes',
      example: 'Blue safe visibly large, others medium'
    },
    thresholdSummary: 'Any safe visibly large/fat',
    thresholdDetail: 'Fatter safes = better features. Can trigger 1, 2, or all 3 together.',
    threshold: {
      conservative: 'All 3 safes showing fat',
      aggressive: '2+ safes fat',
      ideal: 'All 3 safes max fat'
    },
    notes: 'Like other persistent state - fat improves bonus, NOT trigger rate.',
    checkBetLevels: false
  },

  {
    id: 'cash-cano',
    name: 'Cash Cano',
    shortName: 'Cash Cano',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Four rows of gems above reels - fill row + unlock during hold & spin for jackpot',
    visual: {
      location: 'Above reels - 4 horizontal rows of gem positions',
      appearance: [
        { label: 'Rows', text: 'Minor, Maxi, Major, Grand rows', highlight: true },
        { label: 'Gems', text: 'Gems with credit values fill positions' },
        { label: 'Jackpot', text: '3 gems in row = jackpot eligible if row unlocks' },
      ],
      colors: 'Roman Riches or Tiki theme',
      example: 'Minor row has 2 gems, Major has 3 gems'
    },
    thresholdSummary: 'Any row with 2+ gems collected',
    thresholdDetail: '3 gems in a row enables jackpot. More gems = better hold & spin.',
    threshold: {
      conservative: '2+ rows with 2+ gems each',
      aggressive: 'Any row with 3 gems',
      ideal: 'Major/Grand row with 3 gems'
    },
    notes: 'Hold & spin must unlock rows by landing more gems. Higher rows = bigger jackpots.',
    checkBetLevels: true
  },

  {
    id: 'treasure-box-2',
    name: 'Treasure Box Kingdom/Dynasty',
    shortName: 'Treasure Box K/D',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Counter shows coins needed for respin - key symbols on reel 3 reduce count',
    visual: {
      location: 'Counter showing coins needed (starts at 6)',
      appearance: [
        { label: 'Counter', text: 'Number showing coins needed for bonus (6→5→4→...)', highlight: true },
        { label: 'Keys', text: 'Key on reel 3 reduces counter by 1' },
        { label: 'Trigger', text: 'Land required coins OR key when counter = 1' },
      ],
      colors: 'Kingdom or Dynasty Asian theme',
      example: 'Counter showing 3 coins needed'
    },
    thresholdSummary: '4 or less coins needed',
    thresholdDetail: 'Lower counter = easier to trigger bonus.',
    threshold: {
      conservative: '3 or less',
      aggressive: '4 or less',
      ideal: '2 or less'
    },
    notes: 'CHECK ALL BET LEVELS - each has independent counter!',
    checkBetLevels: true
  },

  {
    id: 'regal-riches-2',
    name: 'Regal Riches (MHB Wilds)',
    shortName: 'Regal Riches',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Four colored MHB wild meters - blue (base), purple/green/yellow (free games)',
    visual: {
      location: 'Above middle reel - wild counters with MHB ceilings',
      appearance: [
        { label: 'Blue Wilds', text: 'Counter above reel 3, MHB 50 (base game)', highlight: true },
        { label: 'Purple', text: 'MHB 75 - Minor free games wilds' },
        { label: 'Green', text: 'MHB 100 - Major free games wilds' },
        { label: 'Yellow', text: 'MHB 125 - Mega free games wilds' },
      ],
      colors: 'Purple/regal theme',
      example: 'Blue at 42/50, Green at 88/100'
    },
    thresholdSummary: 'Any meter at 85%+ of ceiling',
    thresholdDetail: 'Blue: 43+. Purple: 64+. Green: 85+. Yellow: 106+.',
    threshold: {
      conservative: '90%+ on any meter',
      aggressive: '85%+ on any meter',
      ideal: 'Multiple meters at 85%+'
    },
    notes: 'Check ALL bet levels. Hidden center meter above reel 3 too!',
    hasCalculator: true,
    checkBetLevels: true
  },

  {
    id: 'diamond-collector',
    name: 'Diamond Collector',
    shortName: 'Diamond Collector',
    category: 'cycle-bonus',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Collect 15 diamonds to trigger free spins - counter shows progress',
    visual: {
      location: 'Diamond counter showing collected/15',
      appearance: [
        { label: 'Counter', text: 'Shows X/15 diamonds collected', highlight: true },
        { label: 'Themes', text: 'Wolfpack or Elite 7s variants' },
        { label: 'Trigger', text: '15 diamonds = free spins bonus' },
      ],
      colors: 'Blue diamond theme',
      example: 'Counter at 12/15'
    },
    thresholdSummary: '12+ diamonds collected',
    thresholdDetail: 'Higher count = fewer spins to trigger bonus.',
    threshold: {
      conservative: '13+ diamonds',
      aggressive: '11+ diamonds',
      ideal: '14 diamonds'
    },
    notes: 'Simple mechanic - just count diamonds.',
    checkBetLevels: false
  },

  {
    id: 'hyper-orbs',
    name: 'Hyper Orbs',
    shortName: 'Hyper Orbs',
    category: 'cycle-bonus',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Collect 15 orbs to trigger free spins bonus',
    visual: {
      location: 'Orb counter showing collected/15',
      appearance: [
        { label: 'Counter', text: 'Shows X/15 orbs collected', highlight: true },
        { label: 'Themes', text: 'King of the Seas or Dragon Sense' },
        { label: 'Trigger', text: '15 orbs = free spins' },
      ],
      colors: 'Blue/teal ocean or dragon theme',
      example: 'Counter at 11/15'
    },
    thresholdSummary: '12+ orbs collected',
    thresholdDetail: 'Same as Diamond Collector mechanic.',
    threshold: {
      conservative: '13+ orbs',
      aggressive: '11+ orbs',
      ideal: '14 orbs'
    },
    notes: 'Identical mechanic to Diamond Collector with different theme.',
    checkBetLevels: false
  },

  {
    id: 'top-up-fortunes',
    name: 'Top Up Fortunes',
    shortName: 'Top Up Fortunes',
    category: 'expanding-reels',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Reels expand from 3 to 6 high - symbols land to expand, counter shows spins at height',
    visual: {
      location: 'Reels at different heights + green spin counters in corners',
      appearance: [
        { label: 'Reel Height', text: 'Reels 3-6 symbols tall', highlight: true },
        { label: 'Counter', text: 'Green squares show spins remaining at current height' },
        { label: 'Expand', text: 'Volcano/trident symbols expand reels' },
      ],
      colors: 'Flame or Ocean theme',
      example: 'Reels at 5-6-4-5-3 heights'
    },
    thresholdSummary: 'Any reel at 5+ height',
    thresholdDetail: 'Taller reels = more ways + better line hits + Add Wild chance on max.',
    threshold: {
      conservative: '2+ reels at 5+ height',
      aggressive: 'Any reel at 5+ height',
      ideal: '3+ reels at 5+ with counters at 2-3'
    },
    notes: 'Max height reel (6) + expansion symbol = Add Wild feature.',
    checkBetLevels: false
  },

  {
    id: 'sumo-kitty',
    name: 'Sumo Kitty / Lucha Kitty',
    shortName: 'Sumo/Lucha Kitty',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    quickId: 'Gold frames lock on reels for 3 spins - coins in frames pay all connected frames',
    visual: {
      location: 'On reels - gold/glowing frames around certain positions',
      appearance: [
        { label: 'Frames', text: 'Gold frames that persist for 3 spins', highlight: true },
        { label: 'Connection', text: 'Connected frames pay together when coin lands in any' },
        { label: 'Counter', text: 'Frames show 3-2-1 countdown' },
      ],
      colors: 'Sumo (Japanese) or Lucha (Mexican wrestling) theme',
      example: 'Large connected frame cluster with high counters'
    },
    thresholdSummary: 'Large connected frame clusters',
    thresholdDetail: 'More connected frames = bigger potential payout.',
    threshold: {
      conservative: '8+ connected frames',
      aggressive: '6+ connected frames with 2+ spins',
      ideal: '10+ connected frames'
    },
    notes: 'Unique mechanic - coin in ANY connected frame pays ALL connected frames.',
    checkBetLevels: false
  },

  {
    id: 'aztec-vault',
    name: 'Aztec Vault / Cleopatra\'s Vault',
    shortName: 'Aztec/Cleo Vault',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Coin columns above reels - fill any column to win all coins on board',
    visual: {
      location: 'Above reels - vertical columns collecting coins with values',
      appearance: [
        { label: 'Columns', text: 'Coin collection columns above each reel', highlight: true },
        { label: 'Fill', text: 'Fill any column = win ALL coins on board' },
        { label: 'Reset', text: 'All coins clear after any column fills' },
      ],
      colors: 'Aztec gold or Egyptian Cleopatra theme',
      example: 'Column 3 has 4/5 coins, high values visible'
    },
    thresholdSummary: 'Any column with 4+ coins AND high values',
    thresholdDetail: 'Close to filling + high total value = good play.',
    threshold: {
      conservative: 'Any column 4/5 full with 100x+ total value',
      aggressive: 'Any column 4/5 full',
      ideal: 'Multiple columns 3-4/5 full with high values'
    },
    notes: 'Winning clears ALL coins - so total board value matters.',
    checkBetLevels: false
  },

  {
    id: 'lucky-coin-link',
    name: 'Lucky Coin Link',
    shortName: 'Lucky Coin Link',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Coin holders below reels - fill all 5 for respin feature',
    visual: {
      location: 'Below reels - 5 coin holder positions',
      appearance: [
        { label: 'Holders', text: '5 coin holders below reels (one per reel)', highlight: true },
        { label: 'Fill', text: 'All 5 filled = respin feature' },
        { label: 'Bet Level', text: 'Higher bets start with more coins collected' },
      ],
      colors: 'Asian Dreaming or Atlantica theme',
      example: '4/5 holders filled'
    },
    thresholdSummary: '4/5 holders filled at any bet level',
    thresholdDetail: 'Check all bet levels - higher bets start with more coins.',
    threshold: {
      conservative: '4/5 at max bet (starts with 3)',
      aggressive: '4/5 at any bet',
      ideal: '4/5 with high values on board'
    },
    notes: 'Highest bet starts with 3 coins, lowest starts with 0.',
    checkBetLevels: true
  },

  {
    id: 'dragon-spin-crosslink',
    name: 'Dragon Spin CrossLink',
    shortName: 'DS CrossLink',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Five gold bags above reels fill with gold - fuller bags = better Dragon Spin feature',
    visual: {
      location: 'Above reels - 5 bags showing fill level (empty to full of gold)',
      appearance: [
        { label: 'Bags', text: '5 bags above reels filling with gold', highlight: true },
        { label: 'Fill Level', text: 'More gold = larger credit prizes in feature' },
        { label: 'Trigger', text: 'Gold medallion can randomly trigger Dragon Spin' },
      ],
      colors: 'Air, Earth, Fire, or Water dragon themes',
      example: 'Bags 2 and 4 nearly full of gold'
    },
    thresholdSummary: 'Multiple bags 75%+ full',
    thresholdDetail: 'Fuller bags add bigger credit prizes to Dragon Spin reels.',
    threshold: {
      conservative: '3+ bags 75%+ full',
      aggressive: '2+ bags 75%+ full',
      ideal: '4+ bags nearly full'
    },
    notes: 'Bag fullness improves feature quality, NOT trigger rate.',
    checkBetLevels: false
  },

  {
    id: 'frankenstein',
    name: 'Frankenstein',
    shortName: 'Frankenstein',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Prize array above reels with multipliers - Power Up adds multipliers, It\'s Alive awards prizes',
    visual: {
      location: 'Above reels - array of jackpot and credit prizes with multiplier badges',
      appearance: [
        { label: 'Prizes', text: 'Jackpots (orange flame) and credits (blue) above', highlight: true },
        { label: 'Multipliers', text: 'Badges on prizes showing 2x, 3x, etc.' },
        { label: 'Power Up', text: 'Reel 1 symbol adds multipliers to prizes' },
      ],
      colors: 'Halloween/monster theme',
      example: 'Major jackpot showing 4x multiplier'
    },
    thresholdSummary: 'High multipliers on major prizes',
    thresholdDetail: 'Multipliers persist until It\'s Alive feature awards and resets them.',
    threshold: {
      conservative: '3x+ on Major/Grand jackpot',
      aggressive: '2x+ on multiple prizes',
      ideal: '4x+ on Grand jackpot'
    },
    notes: 'Unique mechanic - multipliers build on prizes until awarded.',
    checkBetLevels: false
  },

  {
    id: 'rising-phoenix',
    name: 'Rising Phoenix',
    shortName: 'Rising Phoenix',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Wheel with multipliers + flame meter (4 spots) - 4 phoenixes triggers multiplied spin',
    visual: {
      location: 'Wheel above reels with multiplier values + flame meter inside',
      appearance: [
        { label: 'Wheel', text: 'Multipliers around wheel (increase over time)', highlight: true },
        { label: 'Flame Meter', text: '4 spots inside wheel - fill for wheel spin' },
        { label: 'Phoenix', text: 'Landing phoenix fills meter + makes reel wild' },
      ],
      colors: 'Red/orange phoenix fire theme',
      example: 'Wheel showing 5x-8x multipliers, meter at 3/4'
    },
    thresholdSummary: 'Flame meter 3/4 AND high wheel multipliers',
    thresholdDetail: 'Wheel multipliers increase when meter fills without line hit.',
    threshold: {
      conservative: 'Meter 3/4 with wheel showing 6x+ average',
      aggressive: 'Meter 2/4 with wheel showing 8x+ average',
      ideal: 'Meter 3/4 with 10x+ multipliers visible'
    },
    notes: 'Multipliers build when no line hit on full meter. Very streaky.',
    checkBetLevels: false
  },

  {
    id: 'temple-falls',
    name: 'Temple Falls',
    shortName: 'Temple Falls',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: '5x7 grid of coins above reels - bottom row coins drop during feature',
    visual: {
      location: 'Above reels - 5 columns × 7 rows of coin prizes',
      appearance: [
        { label: 'Grid', text: '35 coin positions with credit values', highlight: true },
        { label: 'High Value', text: 'Red background coins = 12.5x+ value' },
        { label: 'Wheel', text: 'Wheel coins award jackpot spin' },
      ],
      colors: 'Temple/ancient ruins theme',
      example: 'Bottom row has 3 red (high value) coins'
    },
    thresholdSummary: 'High value coins in bottom row positions',
    thresholdDetail: 'Bottom coins are next to drop. Red = 12.5x+, Wheel = jackpot.',
    threshold: {
      conservative: '2+ red/wheel coins in bottom row',
      aggressive: '1+ wheel coin in bottom row',
      ideal: '3+ high value coins in bottom 2 rows'
    },
    notes: 'All coins eventually award - bottom row is next. Track high values.',
    checkBetLevels: false
  },

  {
    id: 'river-dragons',
    name: 'River Dragons / Fire Wolf 2',
    shortName: 'River Dragons',
    category: 'must-hit-by',
    tier: 2,
    manufacturer: 'AGS',
    quickId: 'Two MHB progressives: $500 and $5,000 ceilings',
    visual: {
      location: 'Top of cabinet - two progressive displays',
      appearance: [
        { label: 'Lower MHB', text: '$500 ceiling progressive', highlight: true },
        { label: 'Upper MHB', text: '$5,000 ceiling progressive' },
        { label: 'Themes', text: 'River Dragons, Fire Wolf 2, Forest Dragons, Wolf Queen' },
      ],
      colors: 'Dragon or wolf themes',
      example: 'Lower at $485, Upper at $4,750'
    },
    thresholdSummary: '90%+ on either progressive',
    thresholdDetail: '$500 meter: $450+. $5,000 meter: $4,500+.',
    threshold: {
      conservative: '90%+ on either',
      aggressive: '85%+ on $5,000 meter',
      ideal: 'Both at 85%+'
    },
    notes: 'AGS games - different from IGT. $500 hits more often.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'stack-up-pays',
    name: 'Stack Up Pays / Ascending Fortunes',
    shortName: 'Stack Up Pays',
    category: 'must-hit-by',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Five MHB free games meters - reel expansions instead of extra spins',
    visual: {
      location: 'Five colored meters above reels',
      appearance: [
        { label: 'Mega (Red)', text: 'Resets 250, MHB 350' },
        { label: 'Grand (Orange)', text: 'Resets 200, MHB 250' },
        { label: 'Major (Purple)', text: 'Resets 150, MHB 200', highlight: true },
        { label: 'Minor (Green)', text: 'Resets 100, MHB 150' },
        { label: 'Mini (Blue)', text: 'Resets 75, MHB 125' },
      ],
      colors: 'Island Riches or Sakura Riches theme',
      example: 'Major at 185/200, Minor at 140/150'
    },
    thresholdSummary: '90%+ on any meter',
    thresholdDetail: 'Higher meters = more reel expansions = more ways to win.',
    threshold: {
      conservative: '90%+ on Major/Grand/Mega',
      aggressive: '85%+ on any meter',
      ideal: 'Multiple meters at 85%+'
    },
    notes: 'Meters give reel expansions not extra spins. Check all.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'rocket-rumble',
    name: 'Rocket Rumble',
    shortName: 'Rocket Rumble',
    category: 'must-hit-by',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Four MHB free games meters - Blue 8-15, Green 10-20, Purple 20-35, Red 50-100',
    visual: {
      location: 'Four colored meters above reels',
      appearance: [
        { label: 'Blue', text: 'Resets 8, MHB 15' },
        { label: 'Green', text: 'Resets 10, MHB 20' },
        { label: 'Purple', text: 'Resets 20, MHB 35', highlight: true },
        { label: 'Red', text: 'Resets 50, MHB 100' },
      ],
      colors: 'Space/rocket theme',
      example: 'Purple at 32/35, Red at 88/100'
    },
    thresholdSummary: '90%+ on any meter',
    thresholdDetail: 'Blue: 14+. Green: 18+. Purple: 32+. Red: 90+.',
    threshold: {
      conservative: '90%+ on Purple or Red',
      aggressive: '85%+ on any meter',
      ideal: 'Multiple meters at 85%+'
    },
    notes: 'Smaller MHB windows than Stack Up Pays.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'regal-link',
    name: 'Regal Link',
    shortName: 'Regal Link',
    category: 'must-hit-by',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Five MHB wild meters + random silver wilds in base game',
    visual: {
      location: 'Five gem-colored meters showing wild counts',
      appearance: [
        { label: 'Amber', text: 'Resets 30, MHB 50' },
        { label: 'Sapphire', text: 'Resets 40, MHB 60' },
        { label: 'Amethyst', text: 'Resets 50, MHB 75', highlight: true },
        { label: 'Emerald', text: 'Resets 75, MHB 100' },
        { label: 'Diamond', text: 'Resets 175, MHB 200' },
      ],
      colors: 'Lion or Raven theme',
      example: 'Amethyst at 70/75, Emerald at 92/100'
    },
    thresholdSummary: '90%+ on any meter',
    thresholdDetail: 'Amber: 45+. Sapphire: 54+. Amethyst: 68+. Emerald: 90+. Diamond: 180+.',
    threshold: {
      conservative: '90%+ on higher meters',
      aggressive: '85%+ on any meter',
      ideal: 'Multiple meters at 85%+'
    },
    notes: 'Also has silver wilds that trigger randomly during base game.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'treasure-shot',
    name: 'Treasure Shot',
    shortName: 'Treasure Shot',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Wild bags and treasure chests above reels - blue/red bags (base), chests (free games)',
    visual: {
      location: 'Above reels - bags and treasure chests with wild counts',
      appearance: [
        { label: 'Blue/Red Bags', text: 'Base game wilds, MHB at 10 each' },
        { label: 'Blue Chest', text: 'Free games wilds, MHB 100', highlight: true },
        { label: 'Green/Purple Chest', text: 'Free games wilds, MHB 75 each' },
      ],
      colors: 'Pirate Ship or Robin Hood theme',
      example: 'Blue chest at 92/100, Red bag at 8/10'
    },
    thresholdSummary: '85%+ on any chest, or bag at 10',
    thresholdDetail: 'Bags trigger at 10 (base game). Chests are MHB for free games.',
    threshold: {
      conservative: 'Any chest at 90%+',
      aggressive: 'Any bag at 10 OR chest at 85%+',
      ideal: 'Multiple chests/bags near ceiling'
    },
    notes: 'Bags trigger immediately at 10. Chests require free games to trigger.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'pinwheel-prizes',
    name: 'Pinwheel Prizes',
    shortName: 'Pinwheel Prizes',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Five colored pinwheels above reels - wedges increase value and upgrade to gold',
    visual: {
      location: 'Above reels - 5 pinwheels with 8 wedges each',
      appearance: [
        { label: 'Wedges', text: 'Credit values that grow as symbols land' },
        { label: 'Gold Wedges', text: 'Upgraded wedges include free spins', highlight: true },
        { label: 'Trigger', text: '3 same-color scatters = spin that pinwheel' },
      ],
      colors: 'Green, blue, purple, orange, red pinwheels',
      example: 'Red pinwheel has 4 gold wedges with high values'
    },
    thresholdSummary: 'Any pinwheel with 3+ gold wedges AND high values',
    thresholdDetail: 'Gold wedges include free spins. Higher values = better awards.',
    threshold: {
      conservative: 'Any pinwheel with 4+ gold wedges',
      aggressive: 'Any pinwheel with 3+ gold wedges + 20x+ average',
      ideal: 'Multiple pinwheels with gold wedges'
    },
    notes: 'Wedges reset after being won. Track which pinwheels are built up.',
    checkBetLevels: false
  },

  {
    id: 'golden-beasts',
    name: 'Golden Beasts / Golden Elements',
    shortName: 'Golden Beasts',
    category: 'cycle-bonus',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'MHB super spin at 180 special symbols collected',
    visual: {
      location: 'Counter showing special symbols collected',
      appearance: [
        { label: 'Counter', text: 'Shows X/180 symbols collected', highlight: true },
        { label: 'MHB', text: 'Must hit before 180' },
        { label: 'Award', text: 'Super spin feature' },
      ],
      colors: 'Golden beast or elements theme',
      example: 'Counter at 165/180'
    },
    thresholdSummary: '162+ collected (90%)',
    thresholdDetail: 'Standard MHB math: 90% = 162, 85% = 153.',
    threshold: {
      conservative: '162+ (90%)',
      aggressive: '153+ (85%)',
      ideal: '170+ (94%)'
    },
    notes: 'Simple counter mechanic. Easy to evaluate.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'block-bonanza',
    name: 'Block Bonanza',
    shortName: 'Block Bonanza',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Colored blocks with credits above reels - dollar symbols pay corresponding block values',
    visual: {
      location: 'Above reels - 3x5 grid of colored blocks with credit values',
      appearance: [
        { label: 'Blocks', text: 'Credit values in blocks matching reel positions', highlight: true },
        { label: 'Dollar Trigger', text: 'Dollar in reels 1-3 = win corresponding block above' },
        { label: 'High Values', text: 'Look for blocks with elevated credit values' },
      ],
      colors: 'Hawaii or Rio theme',
      example: 'Top row blocks showing 50x, 75x, 60x values'
    },
    thresholdSummary: 'Multiple high-value blocks in triggerable positions',
    thresholdDetail: 'Only reels 1-3 positions can trigger. Focus on those columns.',
    threshold: {
      conservative: '3+ blocks at 25x+ in reels 1-3',
      aggressive: '2+ blocks at 30x+ in reels 1-3',
      ideal: 'Reel 1-3 top row with 40x+ average'
    },
    notes: 'Blocks correspond to reel positions. Only reels 1-3 matter for trigger.',
    checkBetLevels: true
  },

  {
    id: 'wolf-peak',
    name: 'Wolf Peak / Cat Peak / Fu Ren Wu',
    shortName: 'Wolf/Cat Peak',
    category: 'persistent-state',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Expanding wilds stay for 4 spins - arrow shows up/down expansion direction',
    visual: {
      location: 'On reels - yellow/orange WILD symbols with directional arrows',
      appearance: [
        { label: 'Wilds', text: 'Yellow background wilds with up/down arrows', highlight: true },
        { label: 'Expansion', text: 'Wilds expand one position per spin in arrow direction' },
        { label: 'Duration', text: '4 spins then disappear' },
      ],
      colors: 'Wolf, Cat, or Asian theme',
      example: 'Wild on row 2 with up arrow (will expand to rows 1-4)'
    },
    thresholdSummary: 'Multiple expanding wilds with 3+ spins remaining',
    thresholdDetail: 'Wilds that will expand to cover full reels = best.',
    threshold: {
      conservative: '2+ wilds with 3+ spins in expandable positions',
      aggressive: 'Any wild with 4 spins in center position',
      ideal: '3+ wilds with good expansion paths'
    },
    notes: 'Track expansion direction. Center positions expand both ways.',
    checkBetLevels: false
  },

  {
    id: 'magic-treasures-gold',
    name: 'Magic Treasures Gold',
    shortName: 'MT Gold',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Three pots (gold/purple/green) with money ball counters - random trigger awards all',
    visual: {
      location: 'Above reels - 3 pots showing collected money ball counts',
      appearance: [
        { label: 'Pots', text: 'Gold, purple, green pots with counters', highlight: true },
        { label: 'Collection', text: 'Money balls increment corresponding pot' },
        { label: 'Trigger', text: 'Random trigger when money ball lands' },
      ],
      colors: 'Emperor or Empress Asian theme',
      example: 'Gold pot at 45, Purple at 30, Green at 25'
    },
    thresholdSummary: 'Any pot with 40+ balls',
    thresholdDetail: 'Higher counts = more value when triggered. All pots pay when any triggers.',
    threshold: {
      conservative: 'Any pot at 50+',
      aggressive: 'Any pot at 40+ OR total 100+',
      ideal: 'Multiple pots at 40+'
    },
    notes: 'Random trigger - not MHB. Higher counts just mean better payouts.',
    checkBetLevels: false
  },

  {
    id: 'lucky-empress',
    name: 'Lucky Empress / Inca Empress',
    shortName: 'Lucky Empress',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Multiplier tiles queue on left side of rows - active multiplier shows "10X NEXT PAY"',
    visual: {
      location: 'Left side of rows - tile placeholders and active multiplier',
      appearance: [
        { label: 'Tiles', text: 'Diamond/circle tiles queue on left of rows', highlight: true },
        { label: 'Multipliers', text: 'Revealed: 2x, 3x, 5x, 8x, 10x, or 12x' },
        { label: 'Active', text: 'Shows "10X NEXT PAY" when multiplier is ready' },
      ],
      colors: 'Asian Lucky or Incan theme',
      example: 'Row 2 shows "8X NEXT PAY" with 2 more tiles queued'
    },
    thresholdSummary: 'High multiplier (8x+) active OR queued',
    thresholdDetail: 'Active multipliers apply to next line hit starting from that row.',
    threshold: {
      conservative: '10x+ multiplier active',
      aggressive: '8x+ multiplier active OR 10x+ queued',
      ideal: 'Multiple rows with high multipliers active/queued'
    },
    notes: 'Multipliers persist until used. Queued tiles become active after current is used.',
    checkBetLevels: false
  },

  // =============================================
  // ENTERTAINMENT - NO ADVANTAGE PLAY (Popular Licensed/Themed)
  // These machines have NO edge - they're just fun to play!
  // =============================================
  
  // --- TV SHOWS ---

  {
    id: 'game-of-thrones',
    name: 'Game of Thrones',
    shortName: 'GOT',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'HBO series theme with house selection - multiple versions exist',
    visual: {
      location: 'Large cabinet with GOT branding, often multi-screen setup',
      appearance: [
        { label: 'Theme', text: 'Stark, Lannister, Targaryen, Baratheon house themes' },
        { label: 'Cabinet', text: 'Often on premium Arc or King Max cabinets' },
        { label: 'Versions', text: 'Winter is Coming, Fire & Blood, multiple seasons' },
      ],
      colors: 'Dark medieval aesthetic with house sigils',
      example: 'Located in high-traffic areas due to popularity'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'This is an entertainment machine only. There is no mathematical edge to be found.',
    notes: 'Extremely popular franchise. Multiple bonus rounds with show clips. Great for fans but no AP opportunity.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'house-of-the-dragon',
    name: 'House of the Dragon',
    shortName: 'HOTD',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'GOT prequel series - NEW 2024 release on King Max cabinet',
    visual: {
      location: 'Premium King Max cabinet with dragon imagery',
      appearance: [
        { label: 'Theme', text: 'Targaryen civil war era, dragons featured prominently' },
        { label: 'Cabinet', text: 'King Max premium cabinet' },
        { label: 'Release', text: 'New 2024 release' },
      ],
      colors: 'Red/black Targaryen theme',
      example: 'Look for dragon imagery and HOTD branding'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Newest GOT-universe game. Based on HBO hit series. Premium cabinet experience.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'walking-dead',
    name: 'The Walking Dead',
    shortName: 'Walking Dead',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'AMC zombie series - multiple versions with show clips and characters',
    visual: {
      location: 'Various cabinet sizes with Walking Dead branding',
      appearance: [
        { label: 'Theme', text: 'Zombie apocalypse with Rick, Daryl, Michonne' },
        { label: 'Versions', text: 'Multiple seasons/editions available' },
        { label: 'Features', text: 'Walker Wilds, CDC bonus, various pick games' },
      ],
      colors: 'Dark, gritty post-apocalyptic aesthetic',
      example: 'Often found near other Aristocrat licensed games'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Long-running licensed series from Aristocrat. Multiple versions with different bonuses.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'big-bang-theory',
    name: 'The Big Bang Theory',
    shortName: 'Big Bang',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'CBS sitcom theme - Bazinga bonus with Sheldon, Leonard, and gang',
    visual: {
      location: 'Large Behemoth cabinet with life-size character displays',
      appearance: [
        { label: 'Theme', text: 'Apartment setting with main cast' },
        { label: 'Cabinet', text: 'Behemoth super-sized cabinet' },
        { label: 'Bonus', text: 'Bazinga feature with show clips' },
      ],
      colors: 'Bright sitcom aesthetic',
      example: 'Characters appear nearly life-size on large screen'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Premium cabinet experience. Great for fans of the show.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'sons-of-anarchy',
    name: 'Sons of Anarchy',
    shortName: 'Sons of Anarchy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'SAMCRO motorcycle club theme',
    visual: {
      location: 'Premium cabinet with SOA reaper logo',
      appearance: [
        { label: 'Theme', text: 'SAMCRO motorcycle club, Jax Teller, club members' },
        { label: 'Cabinet', text: 'Verve HD or Arc cabinet' },
        { label: 'Features', text: 'Motorcycle ride bonus, club vote feature' },
      ],
      colors: 'Black leather and chrome aesthetic',
      example: 'Look for reaper logo and motorcycle imagery'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Popular with fans of the FX series. Mature themes.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'breaking-bad',
    name: 'Breaking Bad',
    shortName: 'Breaking Bad',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'AMC drama - Walter White and Jesse Pinkman theme',
    visual: {
      location: 'Crystal Core 42 cabinet',
      appearance: [
        { label: 'Theme', text: 'Heisenberg, blue crystals, RV lab' },
        { label: 'Cabinet', text: 'Crystal Core 42" vertical monitor' },
        { label: 'Features', text: 'Multi-level progressive, show footage' },
      ],
      colors: 'Blue crystal and desert aesthetic',
      example: 'Look for Heisenberg hat imagery'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Critically acclaimed series brought to slots. Powerful imagery from the show.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'squid-game',
    name: 'Squid Game',
    shortName: 'Squid Game',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Netflix Korean drama - green tracksuits, masked guards, deadly games',
    visual: {
      location: 'Modern cabinet with distinctive Squid Game branding',
      appearance: [
        { label: 'Theme', text: 'Green tracksuits, pink soldiers, doll from Red Light Green Light' },
        { label: 'Release', text: 'March 2024 release' },
        { label: 'Features', text: 'Various deadly game bonuses' },
      ],
      colors: 'Green and pink contrast, dystopian aesthetic',
      example: 'Look for the giant doll or masked guards'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Based on Netflix global phenomenon. New 2024 release. Season 3 coming soon.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'ellen',
    name: 'The Ellen DeGeneres Show',
    shortName: 'Ellen',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Talk show theme with Ellen hosting bonus games',
    visual: {
      location: 'Crystal Core 42 cabinet',
      appearance: [
        { label: 'Theme', text: 'Ellen show set, dancing, audience games' },
        { label: 'Cabinet', text: 'Large vertical monitor' },
        { label: 'Features', text: 'Dance bonus, show-style mini games' },
      ],
      colors: 'Bright, cheerful daytime TV aesthetic',
      example: 'Ellen character animations throughout'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Fun, upbeat game based on popular talk show.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'sex-and-the-city',
    name: 'Sex and the City',
    shortName: 'SATC',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'HBO series - Carrie, Samantha, Charlotte, Miranda shopping in NYC',
    visual: {
      location: 'Various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'NYC fashion, four main characters, shoe shopping' },
        { label: 'Versions', text: 'Multiple versions including Ultra' },
        { label: 'Features', text: 'Shoe bonus, cosmopolitan cocktails' },
      ],
      colors: 'Pink, glamorous NYC aesthetic',
      example: 'Shoe symbols and NYC skyline'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Long-running licensed game. Multiple versions exist.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  
  // --- MOVIES ---

  {
    id: 'willy-wonka',
    name: 'Willy Wonka',
    shortName: 'Wonka',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: '1971 Chocolate Factory movie - Oompa Loompas, golden tickets, Gene Wilder',
    visual: {
      location: 'Various cabinet sizes, often curved or dual-screen',
      appearance: [
        { label: 'Theme', text: 'Chocolate factory, Oompa Loompas, golden elevator' },
        { label: 'Versions', text: 'World of Wonka, Pure Imagination, Dream Factory, Wonkavator' },
        { label: 'Features', text: 'Golden ticket unwrapping, Oompa Loompa wilds' },
      ],
      colors: 'Colorful candy factory aesthetic',
      example: 'Look for Gene Wilder imagery and candy symbols'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Extremely popular series with multiple versions. Great bonuses with movie footage. Legendary status among slot players.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'wizard-of-oz',
    name: 'The Wizard of Oz',
    shortName: 'Wizard of Oz',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: '1939 classic - Dorothy, Toto, yellow brick road, ruby slippers',
    visual: {
      location: 'Various cabinets including premium setups',
      appearance: [
        { label: 'Theme', text: 'Emerald City, Scarecrow, Tin Man, Cowardly Lion' },
        { label: 'Versions', text: 'Road to Emerald City, Ruby Slippers, Over the Rainbow, many more' },
        { label: 'Features', text: 'Flying monkey bonus, witch melting feature' },
      ],
      colors: 'Sepia to Technicolor transition, emerald green',
      example: 'Ruby slippers, yellow brick road imagery'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'One of the most licensed slot themes ever. Countless versions over decades. New online versions launching 2025.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'ghostbusters',
    name: 'Ghostbusters',
    shortName: 'Ghostbusters',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: '1984 movie - Slimer, Stay Puft, proton packs, who you gonna call?',
    visual: {
      location: 'CrystalCurve TRUE 4D cabinet (premium versions)',
      appearance: [
        { label: 'Theme', text: 'Ghost busting, Slimer, Stay Puft Marshmallow Man' },
        { label: 'Cabinet', text: '4D version with haptic feedback and 3D without glasses' },
        { label: 'Features', text: 'Ghost blasting bonus, trap bonus' },
      ],
      colors: 'Green ghost slime, red/white logo',
      example: 'Slimer animations, proton pack imagery'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Multiple versions including impressive 4D experience with haptic technology. TRUE 3D without glasses.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'jurassic-park',
    name: 'Jurassic Park',
    shortName: 'Jurassic Park',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Spielberg dinosaur movie - T-Rex, raptors, Isla Nublar',
    visual: {
      location: 'Crystal Core Duo cabinet with expanding reels',
      appearance: [
        { label: 'Theme', text: 'Dinosaurs, DNA extraction, park gates' },
        { label: 'Cabinet', text: 'Dual 42" monitors' },
        { label: 'Features', text: 'T-Rex chase bonus, reels expand to 10 rows' },
      ],
      colors: 'Jungle green, amber, dinosaur imagery',
      example: 'T-Rex roaring, park logo'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Outstanding HD video quality. T-Rex bonus is a crowd favorite.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'batman-classic',
    name: 'Batman Classic TV Series',
    shortName: 'Batman 60s',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: '1960s Adam West Batman - POW! BAM! ZONK! campy fun',
    visual: {
      location: 'Helix Wonder Wheels cabinet',
      appearance: [
        { label: 'Theme', text: 'Adam West Batman, Burt Ward Robin, classic villains' },
        { label: 'Features', text: 'Batcave bonus, villain showdowns, comic book graphics' },
        { label: 'Style', text: 'Campy 1960s comic book aesthetic' },
      ],
      colors: 'Bright comic book colors, POW/BAM graphics',
      example: 'Adam West in costume, Batmobile'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Nostalgic fun for fans of the 1960s series. Great villain roster.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'dark-knight',
    name: 'The Dark Knight',
    shortName: 'Dark Knight',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Playtech/Various',
    quickId: 'Christopher Nolan Batman trilogy - Joker, serious tone',
    visual: {
      location: 'Various premium cabinets',
      appearance: [
        { label: 'Theme', text: 'Gotham City, Heath Ledger Joker, Batman vs villains' },
        { label: 'Features', text: 'Progressive jackpots, Joker bonus rounds' },
        { label: 'Style', text: 'Dark, gritty, cinematic' },
      ],
      colors: 'Dark black and blue, Gotham aesthetic',
      example: 'Joker face imagery, Bat signal'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Based on critically acclaimed film. Darker tone than classic Batman.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'superman',
    name: 'Superman / Man of Steel',
    shortName: 'Superman',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'DC superhero - Clark Kent, Metropolis, Lex Luthor',
    visual: {
      location: 'Wonder Wheels format',
      appearance: [
        { label: 'Theme', text: 'Superman flying, Metropolis, Kryptonian powers' },
        { label: 'Features', text: 'Flying bonus, expanding wilds' },
        { label: 'Versions', text: 'Classic Superman and Man of Steel movie versions' },
      ],
      colors: 'Red, blue, yellow - classic Superman colors',
      example: 'Superman logo, flying animations'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Iconic superhero theme. Multiple versions exist.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'wonder-woman',
    name: 'Wonder Woman',
    shortName: 'Wonder Woman',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Various',
    quickId: 'DC Amazon warrior - Themyscira, lasso of truth',
    visual: {
      location: 'Various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'Diana Prince, Amazon warriors, Greek mythology' },
        { label: 'Features', text: 'Ares showdown bonus, shield bonus' },
        { label: 'Style', text: 'Heroic warrior aesthetic' },
      ],
      colors: 'Red, gold, blue warrior colors',
      example: 'Wonder Woman in battle stance'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Popular DC heroine. Often found near other DC games.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'dumb-and-dumber',
    name: 'Dumb & Dumber',
    shortName: 'Dumb & Dumber',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: '1994 comedy - Lloyd and Harry, Mutt Cutts van, Aspen trip',
    visual: {
      location: 'Helix Wonder Wheels cabinet',
      appearance: [
        { label: 'Theme', text: 'Jim Carrey, Jeff Daniels, road trip comedy' },
        { label: 'Features', text: 'Movie clips and quotes throughout' },
        { label: 'Style', text: 'Hilarious 90s comedy aesthetic' },
      ],
      colors: 'Bright, comedic styling',
      example: 'Lloyd and Harry orange and blue tuxedos'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Hilarious for fans of the movie. Great use of movie clips.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'hangover',
    name: 'The Hangover',
    shortName: 'Hangover',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Vegas bachelor party gone wrong - tiger, baby, Zach Galifianakis',
    visual: {
      location: 'Various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'Wolfpack, Vegas chaos, Mr. Chow, Mike Tyson\'s tiger' },
        { label: 'Features', text: 'Vegas-themed bonuses, movie clips' },
        { label: 'Style', text: 'Wild Vegas party aesthetic' },
      ],
      colors: 'Vegas neon and chaos',
      example: 'Movie poster imagery, tiger, baby Carlos'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Meta - playing a Vegas slot about a Vegas movie IN Vegas.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'bridesmaids',
    name: 'Bridesmaids',
    shortName: 'Bridesmaids',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Comedy hit - Kristen Wiig, wedding chaos, airplane scene',
    visual: {
      location: 'Standard cabinet',
      appearance: [
        { label: 'Theme', text: 'Wedding party, dress shopping, bachelorette party' },
        { label: 'Features', text: 'Themed bonus rounds from movie scenes' },
        { label: 'Style', text: 'Wedding comedy aesthetic' },
      ],
      colors: 'Pink bridal party colors',
      example: 'Bridesmaids characters in pink dresses'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Popular comedy brought to slots.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'terminator-2',
    name: 'Terminator 2: Judgment Day',
    shortName: 'Terminator 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Various',
    quickId: 'James Cameron sci-fi - Arnold, T-1000, Hasta la vista baby',
    visual: {
      location: 'Various premium cabinets',
      appearance: [
        { label: 'Theme', text: 'T-800, T-1000, Sarah Connor, Skynet' },
        { label: 'Features', text: 'Iconic movie scenes, liquid metal effects' },
        { label: 'Style', text: 'Dark sci-fi apocalyptic' },
      ],
      colors: 'Metal, chrome, fire and blue time travel effects',
      example: 'Arnold with shotgun, T-1000 morphing'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Classic action sci-fi translated to slots. I\'ll be back.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'mad-max',
    name: 'Mad Max: Fury Road',
    shortName: 'Mad Max',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Post-apocalyptic chase - Furiosa, War Boys, witness me',
    visual: {
      location: 'Edge X cabinet with dual curved displays',
      appearance: [
        { label: 'Theme', text: 'War rig, desert chase, Immortan Joe' },
        { label: 'Cabinet', text: 'Edge X premium cabinet' },
        { label: 'Features', text: 'High-octane bonus rounds' },
      ],
      colors: 'Orange desert, chrome, black',
      example: 'War rig imagery, skull steering wheel'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Visually stunning game based on visually stunning film.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'ted',
    name: 'Ted',
    shortName: 'Ted',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Various',
    quickId: 'Seth MacFarlane comedy - talking teddy bear, Mark Wahlberg',
    visual: {
      location: 'Standard cabinet',
      appearance: [
        { label: 'Theme', text: 'Ted the bear, Boston setting, adult humor' },
        { label: 'Features', text: 'Ted animations and voice clips' },
        { label: 'Style', text: 'R-rated comedy aesthetic' },
      ],
      colors: 'Brown teddy bear, Boston colors',
      example: 'Ted with beer bottle'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Adult comedy theme. Ted provides commentary throughout play.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  
  // --- MUSIC/CELEBRITIES ---

  {
    id: 'michael-jackson',
    name: 'Michael Jackson',
    shortName: 'MJ',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally/Light & Wonder',
    quickId: 'King of Pop - music videos, moonwalk, classic songs',
    visual: {
      location: 'Pro Wheel cabinet with surround sound chair',
      appearance: [
        { label: 'Theme', text: 'Michael Jackson performances, iconic outfits' },
        { label: 'Songs', text: 'Beat It, Billie Jean, Bad, Smooth Criminal, and more' },
        { label: 'Features', text: 'Music video bonuses, concert experience' },
      ],
      colors: 'Glittery, performance stage aesthetic',
      example: 'Michael in various iconic poses/outfits'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Outstanding audio experience. Multiple versions: King of Pop, Icon, Wanna Be Startin\' Somethin\'. A must-play for MJ fans.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'elvis',
    name: 'Elvis',
    shortName: 'Elvis',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'The King - Vegas era, jumpsuits, classic hits',
    visual: {
      location: 'Various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'Elvis performances, Vegas residency, iconic moments' },
        { label: 'Songs', text: 'Hound Dog, Jailhouse Rock, Viva Las Vegas' },
        { label: 'Versions', text: 'Multiple Elvis-themed games exist' },
      ],
      colors: 'Vegas gold, white jumpsuit, 1970s aesthetic',
      example: 'Elvis in iconic jumpsuit pose'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Fitting to play Elvis in Vegas. Long-running theme with devoted fans.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'britney-spears',
    name: 'Britney Spears',
    shortName: 'Britney',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Pop princess - Hit Me Baby, Oops I Did It Again',
    visual: {
      location: 'Premium cabinet',
      appearance: [
        { label: 'Theme', text: 'Britney performances, music videos, costumes' },
        { label: 'Songs', text: 'Classic Britney hits' },
        { label: 'Versions', text: 'Original and "One More Time" version' },
      ],
      colors: 'Pop star pink and glitter',
      example: 'Britney in iconic outfits'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'For fans of 90s/2000s pop. She had a Vegas residency too!',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'dolly-parton',
    name: 'Dolly Parton',
    shortName: 'Dolly',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Country legend - 9 to 5, Jolene, rhinestones',
    visual: {
      location: 'Standard cabinet',
      appearance: [
        { label: 'Theme', text: 'Dolly performances, country aesthetic' },
        { label: 'Songs', text: '9 to 5, Jolene, I Will Always Love You' },
        { label: 'Style', text: 'Rhinestone country glamour' },
      ],
      colors: 'Country sparkle, blonde wigs',
      example: 'Dolly in signature look'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Beloved country icon with devoted fan base.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  
  // --- GAME SHOWS ---

  {
    id: 'wheel-of-fortune-entertainment',
    name: 'Wheel of Fortune (Standard)',
    shortName: 'WOF Standard',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Classic game show - spinning wheel, buy a vowel (NON-MHB versions)',
    visual: {
      location: 'Various cabinets, often with physical spinning wheel on top',
      appearance: [
        { label: 'Theme', text: 'TV game show with Pat and Vanna' },
        { label: 'Features', text: 'Wheel spin bonus, puzzle solving' },
        { label: 'Note', text: 'Look for versions WITHOUT Must-Hit-By display' },
      ],
      colors: 'Blue, yellow, classic game show look',
      example: 'Physical wheel spinning above machine'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Note: MHB versions of Wheel of Fortune ARE advantage play - check for MHB display!',
    notes: 'Most popular slot theme for 25+ years. NOT the same as MHB versions which have advantage play potential.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'Check if this is MHB version - those have AP opportunity!'
  },

  {
    id: 'jeopardy',
    name: 'Jeopardy!',
    shortName: 'Jeopardy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Quiz show - What is... answers in question form',
    visual: {
      location: 'Standard cabinet',
      appearance: [
        { label: 'Theme', text: 'Game board, categories, Daily Doubles' },
        { label: 'Features', text: 'Trivia bonus rounds' },
        { label: 'Style', text: 'Classic Jeopardy board aesthetic' },
      ],
      colors: 'Blue board, gold text',
      example: 'Jeopardy board with dollar amounts'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Long-running game show brought to slots.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'price-is-right',
    name: 'The Price is Right',
    shortName: 'Price is Right',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Come on down! Pricing games, Big Wheel, Showcase Showdown',
    visual: {
      location: 'Various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'Bob Barker/Drew Carey show, pricing games' },
        { label: 'Features', text: 'Plinko bonus, Big Wheel spin, showcase' },
        { label: 'Versions', text: 'Showcase Showdown, Video Slots versions' },
      ],
      colors: 'Game show bright colors',
      example: 'Plinko board, Big Wheel'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Popular pricing games translated to slot bonuses.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'deal-or-no-deal',
    name: 'Deal or No Deal',
    shortName: 'Deal or No Deal',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Various',
    quickId: 'Briefcase game show - 26 models, banker phone calls',
    visual: {
      location: 'Standard cabinet',
      appearance: [
        { label: 'Theme', text: 'Briefcases, banker offers, risk vs reward' },
        { label: 'Features', text: 'Briefcase picking bonus, banker negotiations' },
        { label: 'Style', text: 'Game show studio setting' },
      ],
      colors: 'Black briefcases, gold accents',
      example: '26 briefcases with dollar amounts'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Risk vs reward gameplay mirrors the TV show tension.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  
  // --- BOARD GAMES ---

  {
    id: 'monopoly',
    name: 'Monopoly',
    shortName: 'Monopoly',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Classic board game - Mr. Monopoly, property buying, Go to Jail',
    visual: {
      location: 'Various cabinets',
      appearance: [
        { label: 'Theme', text: 'Board game properties, Mr. Monopoly (Rich Uncle Pennybags)' },
        { label: 'Versions', text: 'DOZENS of versions - Express, Super Money, Boardwalk Sevens' },
        { label: 'Features', text: 'Board game bonus, property collection' },
      ],
      colors: 'Green and white board game aesthetic',
      example: 'Mr. Monopoly character, game board'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'One of the most frequently updated themes. New versions every year. Perfect theme for slots.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  
  // --- CLASSIC POPULAR SLOTS (No AP but extremely common) ---

  {
    id: 'buffalo-standard',
    name: 'Buffalo (Standard)',
    shortName: 'Buffalo',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Most popular slot theme ever - stampede of buffalo, sunset wilds',
    visual: {
      location: 'Everywhere - Buffalo is EVERYWHERE',
      appearance: [
        { label: 'Theme', text: 'American West, buffalo stampede, eagles, wolves' },
        { label: 'Versions', text: 'Buffalo Gold, Grand, Link, Stampede, Chief, Ultimate, Ascension, etc.' },
        { label: 'Features', text: 'Xtra Reel Power, sunset wilds multiply, free games' },
      ],
      colors: 'Orange sunset, brown buffalo, American West palette',
      example: 'Buffalo head symbol, sunset wild with multiplier'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY (standard versions)',
    thresholdDetail: 'Some Buffalo versions (like Buffalo Link) may have AP elements - check specific version.',
    notes: 'Arguably the most successful slot machine ever made. You\'ll find Buffalo in every casino.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'Some Buffalo versions may have AP - check specific variant!'
  },

  {
    id: '88-fortunes-standard',
    name: '88 Fortunes (Standard)',
    shortName: '88 Fortunes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Asian luck theme - Fu Bat jackpots, gold symbols, 88 is lucky',
    visual: {
      location: 'Very common - Asian-themed areas',
      appearance: [
        { label: 'Theme', text: 'Asian prosperity, gold coins, fu bats' },
        { label: 'Features', text: 'Pick your bet level for jackpots, Fu Bat feature' },
        { label: 'Versions', text: 'Lucky Gong, Money Coins, Gold, etc.' },
      ],
      colors: 'Red and gold Chinese prosperity theme',
      example: 'Gold gong, fu bat, 88 branding'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Standard 88 Fortunes has no AP opportunity.',
    notes: 'One of the most popular slots in US casinos. #1 or #2 with Buffalo.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'dancing-drums-standard',
    name: 'Dancing Drums (Standard)',
    shortName: 'Dancing Drums',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Fu Babies, dancing drums, Asian prosperity theme',
    visual: {
      location: 'Asian-themed slot areas',
      appearance: [
        { label: 'Theme', text: 'Red drums, Fu Babies, Chinese New Year celebration' },
        { label: 'Features', text: 'Mystery bonus, Fu Baby wilds, jackpots' },
        { label: 'Versions', text: 'Prosperity, Explosion, Golden Drums (Golden has AP!)' },
      ],
      colors: 'Red and gold celebration theme',
      example: 'Dancing drum symbols, Fu Babies'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY (standard)',
    thresholdDetail: 'Note: "Golden Drums" version DOES have AP potential - different game!',
    notes: 'Part of the 88 Fortunes family. Extremely popular.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'Golden Drums version has AP - check which version!'
  },

  {
    id: 'lightning-link',
    name: 'Lightning Link',
    shortName: 'Lightning Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Hold & spin pioneer - lightning bolt locks, 4-tier progressives',
    visual: {
      location: 'Often in dedicated Lightning Link banks',
      appearance: [
        { label: 'Theme', text: 'Various themes - Heart Throb, Sahara Gold, High Stakes, etc.' },
        { label: 'Features', text: 'Hold & Spin bonus that started the trend' },
        { label: 'Progressives', text: 'Mini, Minor, Major, Grand jackpots' },
      ],
      colors: 'Varies by theme, lightning bolt branding',
      example: 'Lightning bolt symbols locking in place'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Lightning Link pioneered the hold & spin mechanic but has no inherent AP.',
    notes: 'The game that started the modern hold & spin craze. Every manufacturer copied this.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'dragon-link',
    name: 'Dragon Link',
    shortName: 'Dragon Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Asian-themed Lightning Link - dragon orbs, hold & spin, 4-tier jackpots',
    visual: {
      location: 'Often in dedicated Dragon Link areas',
      appearance: [
        { label: 'Theme', text: 'Dragon themes - Autumn Moon, Golden Century, Spring Festival, etc.' },
        { label: 'Features', text: 'Hold & Spin with dragon orbs' },
        { label: 'Progressives', text: 'Mini, Minor, Major, Grand jackpots' },
      ],
      colors: 'Red and gold Asian dragon theme',
      example: 'Dragon orbs with credit values'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Dragon Link is sister game to Lightning Link with Asian theme.',
    notes: 'Extremely popular. Phoenix Link is the 2024 successor.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'cleopatra',
    name: 'Cleopatra',
    shortName: 'Cleopatra',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Egyptian queen - pyramids, scarabs, classic IGT game',
    visual: {
      location: 'Found in most casinos',
      appearance: [
        { label: 'Theme', text: 'Ancient Egypt, Cleopatra, pyramids, sphinx' },
        { label: 'Features', text: 'Free spins with multiplier' },
        { label: 'Versions', text: 'Original, II, MegaJackpots, Gold, etc.' },
      ],
      colors: 'Gold and blue Egyptian aesthetic',
      example: 'Cleopatra face, scarab beetles, Eye of Horus'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Classic slot with no AP opportunity.',
    notes: 'One of the most successful slot themes in history. Still popular after 20+ years.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'quick-hit',
    name: 'Quick Hit',
    shortName: 'Quick Hit',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Classic Bally game - Quick Hit symbols, scatter pays',
    visual: {
      location: 'Common throughout casinos',
      appearance: [
        { label: 'Theme', text: 'Classic slot symbols with Quick Hit scatter' },
        { label: 'Features', text: 'Quick Hit scatter awards, free games' },
        { label: 'Versions', text: 'Platinum, Black Gold, Pro, many more' },
      ],
      colors: 'Various themes, Quick Hit logo consistent',
      example: 'Quick Hit flame scatter symbol'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Long-running series with devoted following.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'lock-it-link',
    name: 'Lock It Link',
    shortName: 'Lock It Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Hold & spin family - Piggy Bankin\' is most famous version',
    visual: {
      location: 'Found throughout casinos',
      appearance: [
        { label: 'Theme', text: 'Various - Piggy Bankin\' (pig with coins), others' },
        { label: 'Features', text: 'Hold & spin lock feature' },
        { label: 'Versions', text: 'Piggy Bankin\', Nightlife, Loteria, etc.' },
      ],
      colors: 'Varies by theme',
      example: 'Lock It Link logo, Piggy Bankin\' pig'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Piggy Bankin\' version is extremely popular. "We got a piggy!"',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'mighty-cash',
    name: 'Mighty Cash',
    shortName: 'Mighty Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Hold & spin with zapper feature',
    visual: {
      location: 'Common in Aristocrat areas',
      appearance: [
        { label: 'Theme', text: 'Various - Double Up, Tiger Roars, Dragon Flies, etc.' },
        { label: 'Features', text: 'Hold & spin, zapper can upgrade symbols' },
        { label: 'Style', text: 'Premium cabinet presentation' },
      ],
      colors: 'Varies by theme',
      example: 'Mighty Cash branding, zapper feature'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Aristocrat\'s answer to Lightning Link. Many theme variations.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'wonder-4',
    name: 'Wonder 4',
    shortName: 'Wonder 4',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Play 4 games at once - Buffalo, Miss Kitty, Pompeii, etc.',
    visual: {
      location: 'Common in Aristocrat areas',
      appearance: [
        { label: 'Theme', text: 'Multi-game: 4 classic Aristocrat games simultaneously' },
        { label: 'Features', text: 'Choose 1-4 games to play at once, super free games' },
        { label: 'Versions', text: 'Tower, Jackpots, Special Edition, etc.' },
      ],
      colors: 'Four quadrant display',
      example: 'Four game panels on one screen'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Play Buffalo, Miss Kitty, Pompeii, Wild Splash all at once!',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'triple-double-diamond',
    name: 'Triple Double Diamond',
    shortName: 'Triple Dbl Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Classic 3-reel - diamond symbols with multipliers',
    visual: {
      location: 'Often in classic/high limit areas',
      appearance: [
        { label: 'Theme', text: 'Classic 3-reel with diamond symbols' },
        { label: 'Features', text: 'Wild multipliers up to 9x' },
        { label: 'Style', text: 'Traditional slot machine look' },
      ],
      colors: 'Blue diamonds, classic red 7s',
      example: 'Diamond symbols, classic 3-reel layout'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'For fans of classic 3-reel slot machines. Simple but satisfying.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'double-diamond',
    name: 'Double Diamond',
    shortName: 'Double Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'The classic - simple 3-reel, diamond wilds double wins',
    visual: {
      location: 'Classic slot areas',
      appearance: [
        { label: 'Theme', text: 'Original 3-reel classic' },
        { label: 'Features', text: 'Wild symbol doubles wins' },
        { label: 'Style', text: 'Timeless slot machine design' },
      ],
      colors: 'Blue diamond, classic symbols',
      example: 'Single diamond wild symbol'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'One of the most iconic slot machines ever made. Timeless.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'lobstermania',
    name: 'Lucky Larry\'s Lobstermania',
    shortName: 'Lobstermania',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Maine lobster theme - buoy picking bonus, Lucky Larry character',
    visual: {
      location: 'Found in most IGT areas',
      appearance: [
        { label: 'Theme', text: 'Maine lobster fishing, buoys, ocean' },
        { label: 'Features', text: 'Buoy picking bonus, Lucky Larry animations' },
        { label: 'Versions', text: 'Original, 2, 3, etc.' },
      ],
      colors: 'Ocean blue, red lobsters',
      example: 'Larry the lobster character, buoys'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Beloved classic with memorable bonus. Lucky Larry is iconic.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'stinkin-rich',
    name: 'Stinkin\' Rich',
    shortName: 'Stinkin Rich',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Skunks and money theme - "skunks gone wild" feature',
    visual: {
      location: 'Common IGT game',
      appearance: [
        { label: 'Theme', text: 'Wealthy skunks, money, diamonds' },
        { label: 'Features', text: 'Multi-tiered free spins, wild features' },
        { label: 'Versions', text: 'Original, Skunks Gone Wild' },
      ],
      colors: 'Green money, black/white skunks',
      example: 'Skunk characters with money'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Long-running popular game. Skunks Gone Wild version is newer.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  // =============================================
  // NEW ADDITIONS - December 2024
  // =============================================

  {
    id: 'wolf-run-eclipse',
    name: 'Wolf Run Eclipse',
    shortName: 'Wolf Run Eclipse',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Wolf theme with 4 free spin meters (Mini/Minor/Major/Mega) that persist between sessions',
    visual: {
      location: 'Check the free spin meters at top of screen for each bet level',
      appearance: [
        { label: 'Meters', text: 'Four free spin counters: Mini, Minor, Major, Mega' },
        { label: 'Theme', text: 'Wolves, moonlit forest, Native American totems' },
        { label: 'Reels', text: '5x4 layout with 40 paylines' },
        { label: 'Key Symbol', text: 'Free Games Bonus symbols on reel 4 add to meters' },
      ],
      colors: 'Purple/blue twilight forest with gold accents',
      example: 'Mini: 15 spins, Minor: 22 spins, Major: 18 spins'
    },
    thresholdSummary: 'High meter counts (volatile - large bankroll needed)',
    thresholdDetail: 'Meters persist and build up as bonus symbols land on reel 4. Mini/Minor/Major reset to 5 spins. Mega resets to 100. NOT must-hit-by - triggers are random. Very high volatility.',
    threshold: {
      conservative: 'Machine Pro Club has specific thresholds',
      aggressive: 'Look for elevated meters across multiple tiers',
      note: 'Requires large bankroll due to high volatility'
    },
    notes: 'Sister game to Cats Wild Serengeti. One of the most popular current AP slots but very volatile. Check all bet levels as meters are separate per bet. Only for experienced APs.',
    hasCalculator: true,
    checkBetLevels: true,
    warning: 'HIGH VOLATILITY - Large bankroll required!'
  },

  {
    id: 'green-machine-bingo',
    name: 'Green Machine Bingo',
    shortName: 'Green Machine Bingo',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Bingo/slot hybrid - 5x5 grid where balls lock for 2-3 spins',
    visual: {
      location: '5x5 bingo grid with center free space (gold star)',
      appearance: [
        { label: 'Grid', text: '5x5 matrix like bingo card' },
        { label: 'Balls', text: 'Cash denomination balls ($3, $5, $10, $20) lock for 2-3 spins' },
        { label: 'Goal', text: 'Complete 5 in a row (horizontal, vertical, diagonal)' },
        { label: 'Bonus', text: 'Super Bingo Bonus when line goes through center star' },
      ],
      colors: 'Green money theme with colorful bingo balls',
      example: 'Balls showing multipliers locked on grid'
    },
    thresholdSummary: 'NO CONFIRMED AP VALUE',
    thresholdDetail: 'Progress is tied to bet level and balls persist briefly. However, no confirmed advantage play strategy exists. Treat as entertainment.',
    notes: 'Hybrid game combining slot and bingo mechanics. Four jackpots available. Progress persists per bet level if you change bets. Fun concept but not confirmed AP.',
    hasCalculator: false,
    checkBetLevels: true,
    warning: 'NO CONFIRMED AP - Likely entertainment only'
  },

  {
    id: 'magic-treasures-gold-empress',
    name: 'Magic Treasures Gold Empress',
    shortName: 'Magic Treasures',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Unknown',
    quickId: 'Asian empress theme - check for any persistent meters or features',
    visual: {
      location: 'Look for any counters, meters, or collection features',
      appearance: [
        { label: 'Theme', text: 'Asian/Chinese empress, gold treasures' },
        { label: 'Check For', text: 'Any visible meters, counters, or "collect" features' },
        { label: 'Note', text: 'Limited information available on this title' },
      ],
      colors: 'Gold and red Asian theme',
      example: 'Report any persistent features you observe'
    },
    thresholdSummary: 'UNKNOWN - NEEDS RESEARCH',
    thresholdDetail: 'Limited information available. If you see any persistent meters, counters, or must-hit-by displays, note them for research.',
    notes: 'Not enough data to confirm AP value. If you play this, look for: must-hit-by progressives, banked bonuses, persistent counters, or collection features. Report findings!',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'UNKNOWN VALUE - Research needed'
  },

  {
    id: 'jackpot-party',
    name: 'Jackpot Party',
    shortName: 'Jackpot Party',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS/Light & Wonder',
    quickId: 'Classic party theme - presents, noisemakers, bonus picking game',
    visual: {
      location: 'Common floor game in various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'Party celebration - presents, balloons, noisemakers' },
        { label: 'Bonus', text: 'Pick presents for prizes, avoid "Party Poopers"' },
        { label: 'Versions', text: 'Original, Super Jackpot Party, Jackpot Block Party' },
        { label: 'Style', text: 'Colorful, festive, classic WMS game' },
      ],
      colors: 'Bright party colors - purple, gold, red, blue',
      example: 'Gift boxes to pick during bonus round'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. Classic bonus picking game with no persistent state or must-hit-by features.',
    notes: 'One of the most iconic WMS slots. Fun bonus round but purely entertainment - no mathematical edge available.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  // =============================================
  // BULK AP MACHINES FROM MACHINE PRO CLUB - December 2024
  // =============================================

  {
    id: 'alien-heroes',
    name: 'Alien Heroes',
    shortName: 'Alien Heroes',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Unknown',
    releaseYear: 2023,
    quickId: 'Scatter-only game - collect stars in 3 containers to activate hero features',
    visual: {
      location: 'Look for 3 containers on the right side of the reels showing star collection',
      appearance: [
        { label: 'Mechanics', text: 'All symbols are scatters - no paylines' },
        { label: 'Goal', text: 'Land 8 of same symbol to trigger free games' },
        { label: 'Stars', text: 'Collect 3 stars in a container to activate hero feature' },
      ],
      colors: 'Space/alien theme',
      example: '2 stars in container = close to hero activation'
    },
    thresholdSummary: '2+ stars in any container',
    thresholdDetail: 'When 3 stars are collected in a container, hero feature activates on next spin giving better chance at 8-symbol trigger.',
    notes: 'Unique scatter-only mechanic. Look for partially filled star containers.',
    hasCalculator: false,
    releaseYear: 2023
  },

  {
    id: 'ascending-fortunes',
    name: 'Ascending Fortunes: Jewel Oasis / Pagoda Rising',
    shortName: 'Ascending Fortunes',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: '5 must-hit-by free games meters (Mega/Grand/Major/Minor/Mini) with reel expansions',
    visual: {
      location: 'Check the 5 progressive meters at top of screen',
      appearance: [
        { label: 'Mega (red)', text: 'Resets 250, hits by 350' },
        { label: 'Grand (orange)', text: 'Resets 200, hits by 250' },
        { label: 'Major (purple)', text: 'Resets 150, hits by 200' },
        { label: 'Minor (green)', text: 'Resets 100, hits by 150' },
        { label: 'Mini (blue)', text: 'Resets 75, hits by 125' },
      ],
      colors: 'Asian theme with colorful meters',
      example: 'Mega at 320/350 = 91% = PLAY'
    },
    thresholdSummary: '85%+ of any ceiling',
    thresholdDetail: 'Each meter builds reel expansions for free games (more ways to win). Calculate: current ÷ ceiling.',
    threshold: {
      conservative: '90%+ of any ceiling',
      aggressive: '85%+ especially on higher tiers'
    },
    notes: 'Similar to Stack Up Pays. Reel expansions increase ways to win during bonus.',
    hasCalculator: true
  },

  {
    id: 'azure-dragon',
    name: 'Azure Dragon / Emerald Guardian',
    shortName: 'Azure Dragon',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: '4 progressive free games meters (Mega/Maxi/Minor/Mini) - NOT must-hit-by',
    visual: {
      location: 'Check 4 free games meters - symbols on reel 4 add to meters',
      appearance: [
        { label: 'Meters', text: 'Mega, Maxi, Minor, Mini free games' },
        { label: 'Trigger', text: 'Random - NOT guaranteed to hit' },
        { label: 'Build', text: 'Symbols on reel 4 increase meter counts' },
      ],
      colors: 'Blue dragon / Green guardian themes',
      example: 'High meter counts = more free spins when triggered'
    },
    thresholdSummary: 'High meter counts (VOLATILE)',
    thresholdDetail: 'NOT must-hit-by - triggers are random. Only play with elevated meters AND large bankroll.',
    notes: 'Sister games. Very volatile - only for experienced APs. Similar to Wolf Run Eclipse.',
    hasCalculator: false,
    warning: 'HIGH VOLATILITY - Not must-hit-by!'
  },

  {
    id: 'cash-falls-huo-zhu',
    name: 'Cash Falls: Huo Zhu / Pirate\'s Trove / Island Bounty',
    shortName: 'Cash Falls',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Coins land in reels with 3-spin counter - fill reel to win all credits',
    visual: {
      location: 'Watch for coins locked in reels with countdown timers',
      appearance: [
        { label: 'Coins', text: 'Land with credit values, lock for 3 spins' },
        { label: 'Counter', text: 'Resets to 3 when new coin lands in same reel' },
        { label: 'Goal', text: 'Fill entire reel before counter hits 0' },
      ],
      colors: 'Various themes (Asian, Pirate, Island)',
      example: 'Reel with 3-4 coins and 2+ spins remaining'
    },
    thresholdSummary: 'Reel 3-4 coins full with spins remaining',
    thresholdDetail: 'Look for reels nearly full (3-4 coins of 4 needed) with 2+ spins on counter.',
    notes: 'Multiple themes available. Counter mechanics are key - watch the timers.',
    hasCalculator: false
  },

  {
    id: 'igt-classic-hits',
    name: 'IGT Classic Hits: Coyote Moon / Money Storm / Lobstermania Deluxe',
    shortName: 'IGT Classic Hits',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: '3 must-hit-by progressives per bet level (15 total progressives)',
    visual: {
      location: 'Check all 3 progressive displays at each bet level',
      appearance: [
        { label: 'Progressives', text: 'Top (large), Middle (medium), Bottom (small)' },
        { label: 'Bet Levels', text: '5 different bet levels, each with own progressives' },
        { label: 'Total', text: '15 progressives to check per machine' },
      ],
      colors: 'Classic IGT themes',
      example: 'Any progressive at 90%+ of ceiling'
    },
    thresholdSummary: '90%+ on any progressive',
    thresholdDetail: 'Check ALL bet levels - each has 3 separate progressives. 15 opportunities per machine.',
    threshold: {
      conservative: '90%+ of any ceiling',
      aggressive: '85%+ especially on higher tiers'
    },
    notes: 'Three classic themes. Must check all 5 bet levels × 3 progressives = 15 checks!',
    hasCalculator: true,
    checkBetLevels: true
  },

  {
    id: 'lobstermania-4-link',
    name: 'Lucky Larry\'s Lobstermania 4 Link',
    shortName: 'Lobstermania 4 Link',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Loot Awards above reels 2-4 - activate when 2 coins collected',
    visual: {
      location: 'Check Loot Award displays above reels 2, 3, and 4',
      appearance: [
        { label: 'Awards', text: 'Loot Awards above middle 3 reels' },
        { label: 'Coins', text: 'Need 2 coins to activate award' },
        { label: 'Trigger', text: 'Award activates when 2nd coin lands' },
      ],
      colors: 'Lobster/ocean theme',
      example: '1 coin already in multiple reels'
    },
    thresholdSummary: '1 coin in 2+ reels',
    thresholdDetail: 'Look for reels with 1 coin already collected. One more coin = instant Loot Award.',
    notes: 'Sister game Shrimpmania plays identically. Check middle 3 reels only.',
    hasCalculator: false
  },

  {
    id: 'magic-of-the-nile',
    name: 'Magic of the Nile',
    shortName: 'Magic of the Nile',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2021,
    quickId: '3 obelisks with 3 segments each - fill obelisk to trigger bonus',
    visual: {
      location: 'Watch 3 obelisks above reels showing segment fill',
      appearance: [
        { label: 'Obelisks', text: '3 obelisks, each with 3 segments' },
        { label: 'Fill', text: 'Scarab symbols fill segments' },
        { label: 'Trigger', text: 'Full obelisk = bonus feature' },
      ],
      colors: 'Egyptian Nile theme',
      example: 'Obelisk with 2/3 segments filled'
    },
    thresholdSummary: 'Any obelisk 2/3 full',
    thresholdDetail: 'Simple fill mechanic. Look for obelisks one segment from triggering.',
    notes: 'Each obelisk triggers a different bonus. Straightforward to evaluate.',
    hasCalculator: false
  },

  {
    id: 'magic-treasures',
    name: 'Magic Treasures: Dragon / Tiger',
    shortName: 'Magic Treasures',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Money balls collect in bowl counter - random trigger awards all balls',
    visual: {
      location: 'Green bowl shows money ball count (starts at 5)',
      appearance: [
        { label: 'Counter', text: 'Shows collected money balls' },
        { label: 'Trigger', text: 'Random when money ball lands' },
        { label: 'Reset', text: 'Resets to 5 after feature' },
      ],
      colors: 'Asian dragon/tiger themes',
      example: 'Counter at 25+ money balls'
    },
    thresholdSummary: '20+ money balls collected',
    thresholdDetail: 'More balls = bigger payout when feature triggers. Random trigger, but higher count = better value.',
    notes: 'Foundation for Magic Treasures Gold. Simple accumulator mechanic.',
    hasCalculator: false
  },

  {
    id: 'treasure-box',
    name: 'Treasure Box: Kingdom / Dynasty',
    shortName: 'Treasure Box',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'Keys reduce coins needed for bonus - start at 6, keys on reel 3 reduce count',
    visual: {
      location: 'Watch coin requirement counter and keys collected',
      appearance: [
        { label: 'Coins Needed', text: 'Starts at 6, reduced by keys' },
        { label: 'Keys', text: 'Land on middle reel to reduce requirement' },
        { label: 'Trigger', text: 'Land required coins at once for bonus' },
      ],
      colors: 'Kingdom/Dynasty themes',
      example: 'Only 2 coins needed = very playable'
    },
    thresholdSummary: '3 or fewer coins needed',
    thresholdDetail: 'Keys make bonus easier to trigger. At 2-3 coins needed, hitting bonus becomes much more likely.',
    notes: 'Keys are key! Watch the requirement counter, not just coin count.',
    hasCalculator: false
  },

  {
    id: 'treasure-hunter',
    name: 'Treasure Hunter',
    shortName: 'Treasure Hunter',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Unknown',
    releaseYear: 2022,
    quickId: 'Collect 3 pearls under jackpot to win it (Major/Maxi/Minor/Mini)',
    visual: {
      location: 'Pearl collection under each of 4 jackpots',
      appearance: [
        { label: 'Jackpots', text: 'Major, Maxi, Minor, Mini' },
        { label: 'Pearls', text: 'Collect 3 per jackpot to win' },
        { label: 'Progress', text: 'Shows X/3 pearls per jackpot' },
      ],
      colors: 'Ocean treasure theme',
      example: '2/3 pearls under any jackpot'
    },
    thresholdSummary: '2 pearls under any jackpot',
    thresholdDetail: 'Simple - 3 pearls = jackpot. Look for any jackpot with 2 pearls collected.',
    notes: 'Very straightforward. Higher jackpots = better value at 2/3.',
    hasCalculator: false
  },

  {
    id: 'ufl-cash-falls',
    name: 'Ultimate Fire Link Cash Falls: China Street / Olvera Street',
    shortName: 'UFL Cash Falls',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Fireballs with credits fill reels - 3-spin counter, fill reel to win + possible bonus',
    visual: {
      location: 'Watch for fireballs locked in reels with timers',
      appearance: [
        { label: 'Fireballs', text: 'Land with credits, lock for 3 spins' },
        { label: 'Counter', text: 'Resets to 3 when new fireball lands in reel' },
        { label: 'Special', text: 'Fire Link Feature fireball triggers bonus' },
      ],
      colors: 'Fire Link red/gold theme',
      example: 'Reel nearly full with Fire Link symbol present'
    },
    thresholdSummary: 'Reel 3+ full with spins remaining',
    thresholdDetail: 'Like Cash Falls but with Fire Link bonus potential. Special fireball fills reel = extra feature.',
    notes: 'Combines Cash Falls mechanic with Fire Link bonus. Watch for special fireball.',
    hasCalculator: false
  },

  {
    id: 'wheel-of-fortune-4d',
    name: 'Wheel of Fortune 4D',
    shortName: 'WoF 4D',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Dollar symbol holders above reels - 2 to fill, reel goes wild for 2 spins',
    visual: {
      location: 'Check dollar symbol holders above each reel',
      appearance: [
        { label: 'Holders', text: 'Each reel has holder for 2 dollar symbols' },
        { label: 'When Full', text: 'Reel turns wild for 2 spins' },
        { label: 'Classic', text: 'Wheel of Fortune theme with 4D cabinet' },
      ],
      colors: 'Classic WoF blue/gold',
      example: 'Holder with 1/2 dollar symbols'
    },
    thresholdSummary: 'Multiple holders at 1/2',
    thresholdDetail: 'Similar to Golden Egypt Grand. Wild reels dramatically improve win potential.',
    notes: 'One of the best known AP games. Higher bet level than Golden Egypt.',
    hasCalculator: false
  },

  {
    id: 'wheel-of-fortune-high-roller',
    name: 'Wheel of Fortune High Roller',
    shortName: 'WoF High Roller',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Reels expand 3→8 high - max height triggers wheel spin award above',
    visual: {
      location: 'Watch reel heights and wheel awards above each reel',
      appearance: [
        { label: 'Reels', text: 'Expand from 3 to 8 symbols tall' },
        { label: 'High Roller', text: 'Symbol lands to expand reel' },
        { label: 'Max Height', text: 'At 8, next HR symbol triggers wheel above' },
      ],
      colors: 'WoF theme with high roller styling',
      example: 'Reel at 7 height = one away from wheel'
    },
    thresholdSummary: 'Reels at 6+ height',
    thresholdDetail: 'Like Buffalo Ascension. Reels at 7 = one symbol from triggering wheel spin.',
    notes: 'Wheel spins can have multipliers and multi-pointers. Watch reel heights.',
    hasCalculator: false
  },

  {
    id: 'wizard-of-oz-ftybr',
    name: 'Wizard of Oz: Follow the Yellow Brick Road',
    shortName: 'WoO Yellow Brick',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: '3 progressive free games meters (Silver/Gold/Emerald) - NOT must-hit-by',
    visual: {
      location: 'Check 3 free games meters',
      appearance: [
        { label: 'Meters', text: 'Silver, Gold, Emerald free games' },
        { label: 'Build', text: 'Red shoes on reel 5 increase meters' },
        { label: 'Trigger', text: 'Random - NOT guaranteed' },
      ],
      colors: 'Wizard of Oz theme',
      example: 'High meter counts but random trigger'
    },
    thresholdSummary: 'High meters (VERY VOLATILE)',
    thresholdDetail: 'NOT must-hit-by - extremely volatile. Only for experienced APs with large bankrolls.',
    notes: 'Beautiful game but very dangerous. Triggers are completely random.',
    hasCalculator: false,
    warning: 'EXTREMELY VOLATILE - Not must-hit-by!'
  },

  {
    id: 'cats-wild-serengeti',
    name: 'Cats Wild Serengeti',
    shortName: 'Cats Wild Serengeti',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Sister game to Wolf Run Eclipse - 4 free spin meters that persist',
    visual: {
      location: 'Check the free spin meters at top of screen for each bet level',
      appearance: [
        { label: 'Meters', text: 'Four free spin counters: Mini, Minor, Major, Mega' },
        { label: 'Theme', text: 'African cats, Serengeti savanna' },
        { label: 'Mechanics', text: 'Identical to Wolf Run Eclipse' },
      ],
      colors: 'Golden savanna sunset colors',
      example: 'Check all bet levels for elevated meters'
    },
    thresholdSummary: 'High meter counts (volatile)',
    thresholdDetail: 'Plays identically to Wolf Run Eclipse. NOT must-hit-by. Very high volatility.',
    notes: 'Sister game to Wolf Run Eclipse. Same strategy applies. Check all bet levels.',
    hasCalculator: true,
    checkBetLevels: true,
    warning: 'HIGH VOLATILITY - Large bankroll required!'
  },

  {
    id: 'frankenstein-slot',
    name: 'Frankenstein',
    shortName: 'Frankenstein',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Unknown',
    releaseYear: 2023,
    quickId: 'Prizes above reels gain multipliers - It\'s Alive feature shoots to win prizes',
    visual: {
      location: 'Watch prize array above reels and attached multipliers',
      appearance: [
        { label: 'Prizes', text: 'Jackpots (orange flame) and credits (blue electric)' },
        { label: 'Multipliers', text: 'Power Up symbol adds multipliers to prizes' },
        { label: 'Feature', text: 'It\'s Alive shoots electricity to win prizes' },
      ],
      colors: 'Horror/electric theme',
      example: 'High multipliers (3x+) on jackpot prizes'
    },
    thresholdSummary: 'High multipliers on good prizes',
    thresholdDetail: 'Multipliers persist and apply when prize is won. Look for multipliers on jackpots.',
    notes: 'After feature, multipliers reset and 2-3 new ones added randomly. Track the buildup.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-autumn-moon',
    name: 'Dragon Link: Autumn Moon',
    shortName: 'Dragon Link Autumn',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Hold & Spin with dragon pearls - the most popular slot in Vegas',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Floor managers consistently rank Dragon Link #1. Hold & Spin triggers with 6+ pearls. Four progressive jackpots.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-golden-century',
    name: 'Dragon Link: Golden Century',
    shortName: 'Dragon Link Golden',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Hold & Spin dragon theme - golden variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Part of the dominant Dragon Link family. Same mechanics as Autumn Moon with different theme.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-peace-prosperity',
    name: 'Dragon Link: Peace & Prosperity',
    shortName: 'Dragon Link Peace',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Hold & Spin dragon theme - peace variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Dragon Link variant. Same core mechanics.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-spring-festival',
    name: 'Dragon Link: Spring Festival',
    shortName: 'Dragon Link Spring',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Hold & Spin dragon theme - spring festival variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Seasonal Dragon Link variant. Identical mechanics.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-happy-prosperous',
    name: 'Dragon Link: Happy & Prosperous',
    shortName: 'Dragon Link Happy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Hold & Spin dragon theme - happy variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newer Dragon Link variant with same proven mechanics.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-genghis-khan',
    name: 'Dragon Link: Genghis Khan',
    shortName: 'Dragon Link Genghis',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Hold & Spin with Mongol warrior theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Warrior-themed Dragon Link with same core mechanics.',
    hasCalculator: false
  },
  
  // LIGHTNING LINK SERIES (Aristocrat) - Pioneer of Hold & Spin

  {
    id: 'lightning-link-sahara-gold',
    name: 'Lightning Link: Sahara Gold',
    shortName: 'Lightning Sahara',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Original Hold & Spin mechanic - 6 pearls triggers feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lightning Link pioneered the Hold & Spin mechanic that revolutionized slots. Desert theme.',
    hasCalculator: false
  },

  {
    id: 'lightning-link-high-stakes',
    name: 'Lightning Link: High Stakes',
    shortName: 'Lightning High Stakes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Hold & Spin with card/poker theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Lightning Link variant with gambling theme.',
    hasCalculator: false
  },

  {
    id: 'lightning-link-happy-lantern',
    name: 'Lightning Link: Happy Lantern',
    shortName: 'Lightning Lantern',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Hold & Spin with Asian lantern theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Asian-themed Lightning Link variant.',
    hasCalculator: false
  },

  {
    id: 'lightning-link-bengal-treasures',
    name: 'Lightning Link: Bengal Treasures',
    shortName: 'Lightning Bengal',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Hold & Spin with tiger/Indian theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Tiger-themed Lightning Link variant.',
    hasCalculator: false
  },

  {
    id: 'lightning-link-magic-pearl',
    name: 'Lightning Link: Magic Pearl',
    shortName: 'Lightning Pearl',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Hold & Spin with ocean/mermaid theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ocean-themed Lightning Link variant.',
    hasCalculator: false
  },

  {
    id: 'lightning-link-moon-race',
    name: 'Lightning Link: Moon Race',
    shortName: 'Lightning Moon Race',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Hold & Spin with space/moon theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Space-themed Lightning Link variant.',
    hasCalculator: false
  },
  
  // BUFFALO SERIES (Aristocrat) - Iconic Vegas Brand

  {
    id: 'buffalo-original',
    name: 'Buffalo',
    shortName: 'Buffalo Original',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2008,
    quickId: 'The original - 1024 ways, stacked wilds, free games with multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'The OG that launched a franchise. Still going strong 15+ years later. High volatility classic.',
    hasCalculator: false
  },

  {
    id: 'buffalo-gold',
    name: 'Buffalo Gold',
    shortName: 'Buffalo Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2016,
    quickId: 'Collect 15 gold buffalo heads during bonus for multipliers up to 27x',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Most popular Buffalo variant. Gold head collection adds massive multipliers in bonus. Very high volatility.',
    hasCalculator: false
  },

  {
    id: 'buffalo-grand',
    name: 'Buffalo Grand',
    shortName: 'Buffalo Grand',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Premium Buffalo with wheel bonus and grand jackpot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wheel bonus can award progressive jackpots. Premium cabinet experience.',
    hasCalculator: false
  },

  {
    id: 'buffalo-diamond',
    name: 'Buffalo Diamond',
    shortName: 'Buffalo Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Diamond symbols add extra features during free games',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Diamond collection mechanic enhances bonus rounds.',
    hasCalculator: false
  },

  {
    id: 'buffalo-gold-revolution',
    name: 'Buffalo Gold Revolution',
    shortName: 'Buffalo Revolution',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Updated Buffalo Gold with enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Evolution of Buffalo Gold with modern cabinet and features.',
    hasCalculator: false
  },

  {
    id: 'buffalo-chief',
    name: 'Buffalo Chief',
    shortName: 'Buffalo Chief',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'Chief variant with expanding reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newer Buffalo with expanding reel mechanics.',
    hasCalculator: false
  },
  
  // DANCING DRUMS SERIES (Light & Wonder/SG)

  {
    id: 'dancing-drums',
    name: 'Dancing Drums',
    shortName: 'Dancing Drums',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2017,
    quickId: 'Asian drums theme - Fu Bat jackpot feature, 243 ways',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Very popular Asian-themed slot. Fu Bat feature triggers jackpot picks. Mystery choice free games.',
    hasCalculator: false
  },

  {
    id: 'dancing-drums-explosion',
    name: 'Dancing Drums Explosion',
    shortName: 'DD Explosion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Enhanced Dancing Drums with explosion feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Upgraded version with additional features. One of the most faithful land-to-online transitions.',
    hasCalculator: false
  },

  {
    id: 'dancing-drums-prosperity',
    name: 'Dancing Drums Prosperity',
    shortName: 'DD Prosperity',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Prosperity variant with enhanced jackpot features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest Dancing Drums with prosperity theme.',
    hasCalculator: false
  },
  
  // 88 FORTUNES SERIES (Light & Wonder/SG)

  {
    id: '88-fortunes',
    name: '88 Fortunes',
    shortName: '88 Fortunes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2015,
    quickId: 'Gold symbols trigger Fu Bat jackpot feature - 243 ways',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Asian luck theme. Fu Bat bonus picks from 4 jackpots. Medium volatility, great for extended play.',
    hasCalculator: false
  },

  {
    id: '88-fortunes-diamond',
    name: '88 Fortunes Diamond',
    shortName: '88 Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Diamond variant with enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced version with diamond collection mechanic.',
    hasCalculator: false
  },

  {
    id: '88-fortunes-lucky-gong',
    name: '88 Fortunes Lucky Gong',
    shortName: '88 Lucky Gong',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Gong feature adds wilds and multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gong bonus can transform symbols for big wins.',
    hasCalculator: false
  },
  
  // HUFF N PUFF SERIES (Light & Wonder)

  {
    id: 'huff-n-more-puff',
    name: 'Huff N\' More Puff',
    shortName: 'Huff N More',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Sequel with enhanced pig features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular sequel with additional bonus features.',
    hasCalculator: false
  },

  {
    id: 'huff-n-even-more-puff',
    name: 'Huff N\' Even More Puff',
    shortName: 'Huff N Even More',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Latest sequel with Golden Buzzsaw feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newest version. Golden Buzzsaw shreds reels for guaranteed wins. $50k+ wins reported at Venetian.',
    hasCalculator: false
  },
  
  // ULTIMATE FIRE LINK SERIES (Light & Wonder)

  {
    id: 'ultimate-fire-link',
    name: 'Ultimate Fire Link',
    shortName: 'Fire Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Fireball collection triggers Hold & Spin feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Hold & Spin game. Multiple themed variants available.',
    hasCalculator: false
  },

  {
    id: 'ufl-china-street',
    name: 'Ultimate Fire Link: China Street',
    shortName: 'Fire Link China',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Asian-themed Fire Link variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese theme with Fire Link mechanics.',
    hasCalculator: false
  },

  {
    id: 'ufl-olvera-street',
    name: 'Ultimate Fire Link: Olvera Street',
    shortName: 'Fire Link Olvera',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Mexican-themed Fire Link variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mexican marketplace theme with Fire Link mechanics.',
    hasCalculator: false
  },

  {
    id: 'ufl-glacier-gold',
    name: 'Ultimate Fire Link: Glacier Gold',
    shortName: 'Fire Link Glacier',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Ice/glacier themed Fire Link variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Winter theme with Fire Link mechanics.',
    hasCalculator: false
  },

  {
    id: 'ufl-explosion',
    name: 'Ultimate Fire Link Explosion',
    shortName: 'Fire Link Explosion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Enhanced Fire Link with explosion features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Premium version with enhanced features.',
    hasCalculator: false
  },
  
  // LOCK IT LINK SERIES (Light & Wonder)

  {
    id: 'lock-it-link-nightlife',
    name: 'Lock It Link: Nightlife',
    shortName: 'Lock It Nightlife',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2017,
    quickId: 'Lock symbols in place - party/nightclub theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Locking reel mechanic. Nightclub theme with neon aesthetics.',
    hasCalculator: false
  },

  {
    id: 'lock-it-link-diamonds',
    name: 'Lock It Link: Diamonds',
    shortName: 'Lock It Diamonds',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Diamond theme with locking mechanic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic diamond theme with Lock It Link feature.',
    hasCalculator: false
  },

  {
    id: 'lock-it-link-loteria',
    name: 'Lock It Link: Loteria',
    shortName: 'Lock It Loteria',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Mexican lottery card theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mexican Loteria card theme with Lock It Link mechanics.',
    hasCalculator: false
  },
  
  // CLASSIC IGT SLOTS

  {
    id: 'cleopatra-ii',
    name: 'Cleopatra II',
    shortName: 'Cleopatra II',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Sequel with increasing multipliers during free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced version with multipliers that increase with each retrigger.',
    hasCalculator: false
  },

  {
    id: 'da-vinci-diamonds',
    name: 'Da Vinci Diamonds',
    shortName: 'Da Vinci Diamonds',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2007,
    quickId: 'Tumbling reels - winning symbols disappear for new wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pioneer of tumbling reels mechanic. Renaissance art theme. Multiple consecutive wins possible.',
    hasCalculator: false
  },

  {
    id: 'wolf-run',
    name: 'Wolf Run',
    shortName: 'Wolf Run',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2006,
    quickId: 'Wolf pack theme - 40 paylines, stacked wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic IGT with stacked wilds. Howling wolves and nature theme.',
    hasCalculator: false
  },

  {
    id: 'siberian-storm',
    name: 'Siberian Storm',
    shortName: 'Siberian Storm',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2011,
    quickId: 'White tiger theme - 720 ways MultiWay Xtra',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'MultiWay Xtra pays both ways. Stunning white tiger graphics.',
    hasCalculator: false
  },

  {
    id: 'texas-tea',
    name: 'Texas Tea',
    shortName: 'Texas Tea',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2005,
    quickId: 'Oil baron theme - oil derrick bonus game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Named "Top 5 favorite video slots" by Strictly Slots. Classic oil tycoon theme.',
    hasCalculator: false
  },

  {
    id: 'triple-diamond',
    name: 'Triple Diamond',
    shortName: 'Triple Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1994,
    quickId: '3-reel classic - triple diamonds multiply wins 3x',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Evolution of Double Diamond. Two triple diamonds = 9x multiplier.',
    hasCalculator: false
  },

  {
    id: 'kitty-glitter',
    name: 'Kitty Glitter',
    shortName: 'Kitty Glitter',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2011,
    quickId: 'Glamorous cats theme - diamond collection during free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Collect diamonds during free spins for extra wilds. Cute cat theme.',
    hasCalculator: false
  },

  {
    id: 'golden-goddess',
    name: 'Golden Goddess',
    shortName: 'Golden Goddess',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2011,
    quickId: 'Greek mythology theme - super stacks feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Super Stacks can fill reels with same symbol. Elegant Greek theme.',
    hasCalculator: false
  },
  
  // KONAMI POPULAR SLOTS

  {
    id: 'china-shores',
    name: 'China Shores',
    shortName: 'China Shores',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2010,
    quickId: 'Panda theme - action stacked symbols, up to 320 free games',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Konami\'s first major online hit. Massive free spin potential. Action stacked symbols.',
    hasCalculator: false
  },

  {
    id: 'chili-chili-fire',
    name: 'Chili Chili Fire',
    shortName: 'Chili Chili Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Mexican theme - fade away feature, action stacked symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fiery Mexican theme. Fade Away feature gives cascading wins. 96.09% RTP.',
    hasCalculator: false
  },

  {
    id: 'lion-festival',
    name: 'Lion Festival: Boosted Celebration',
    shortName: 'Lion Festival',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Chinese lion dance theme - boosted free spins option',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Can exchange regular free spins for super spins with larger multipliers.',
    hasCalculator: false
  },

  {
    id: 'fortune-stacks',
    name: 'Fortune Stacks',
    shortName: 'Fortune Stacks',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2016,
    quickId: 'Asian fortune theme - action stacked symbols with multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Action stacked symbols get 2x, 3x, or 5x multipliers during free spins.',
    hasCalculator: false
  },

  {
    id: 'lotus-land',
    name: 'Lotus Land',
    shortName: 'Lotus Land',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2014,
    quickId: 'Peaceful Asian garden theme - wild reels feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Serene lotus theme. Wild reels can appear during base game.',
    hasCalculator: false
  },
  
  // WMS/LIGHT & WONDER CLASSICS

  {
    id: 'zeus',
    name: 'Zeus',
    shortName: 'Zeus',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2006,
    quickId: 'Greek god theme - 30 paylines, free spins with wild reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'WMS classic. Simple but engaging. Multiple sequels spawned.',
    hasCalculator: false
  },

  {
    id: 'zeus-iii',
    name: 'Zeus III',
    shortName: 'Zeus III',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: '6-reel version with 192 ways, hot hot super respin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Extended 6-reel format. Hot Hot Super Respin feature.',
    hasCalculator: false
  },

  {
    id: 'kronos',
    name: 'Kronos',
    shortName: 'Kronos',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Titan father of Zeus - similar mechanics to Zeus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Zeus companion game. Same core mechanics with Titan theme.',
    hasCalculator: false
  },

  {
    id: 'raging-rhino',
    name: 'Raging Rhino',
    shortName: 'Raging Rhino',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'African safari theme - 4096 ways, free spins with multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: '4096 ways to win. High volatility. Retriggers add multipliers.',
    hasCalculator: false
  },

  {
    id: 'monopoly-big-event',
    name: 'Monopoly Big Event',
    shortName: 'Monopoly Big Event',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2016,
    quickId: 'Monopoly board game theme - side bet for enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Big Bet feature unlocks enhanced bonus rounds. 99% RTP with Big Bet.',
    hasCalculator: false
  },
  
  // AGS POPULAR SLOTS

  {
    id: 'rakin-bacon',
    name: 'Rakin\' Bacon',
    shortName: 'Rakin\' Bacon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Pig theme - 243 ways, Power XStream pays both directions',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Very popular on Vegas floors. Reel Surge expands reels. 95.89% RTP.',
    hasCalculator: false
  },

  {
    id: 'rakin-bacon-link',
    name: 'Rakin\' Bacon Link',
    shortName: 'Rakin Bacon Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: 'Link version with hold and spin feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newer version combining Rakin Bacon with Hold & Spin mechanics.',
    hasCalculator: false
  },

  {
    id: 'fire-wolf-ii-ags',
    name: 'Fire Wolf II (AGS)',
    shortName: 'Fire Wolf II AGS',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Wolf theme - up to 128 free spins, mystery jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High volatility. Reel Surge and Power XStream mechanics. Note: Different from MHB version.',
    hasCalculator: false
  },

  {
    id: 'fu-nan-fu-nu',
    name: 'Fu Nan Fu Nu',
    shortName: 'Fu Nan Fu Nu',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2017,
    quickId: 'Lucky boy/girl theme - Power XStream, random jackpot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Distinctive screen layout. Random jackpot pick feature.',
    hasCalculator: false
  },
  
  // EVERI POPULAR SLOTS

  {
    id: 'cash-machine',
    name: 'Cash Machine',
    shortName: 'Cash Machine',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2018,
    quickId: 'ATM/money theme - simple high-paying symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Everi game. Money/ATM theme. Straightforward gameplay.',
    hasCalculator: false
  },

  {
    id: 'smokin-hot-gems',
    name: 'Smokin\' Hot Gems',
    shortName: 'Smokin Hot Gems',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2019,
    quickId: 'Gem/jewel theme with fire elements',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Everi gem-themed slot.',
    hasCalculator: false
  },

  {
    id: 'press-your-luck',
    name: 'Press Your Luck',
    shortName: 'Press Your Luck',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'TV game show theme - avoid the Whammy!',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Based on classic game show. Big Board bonus with Whammy risk.',
    hasCalculator: false
  },
  
  // PROGRESSIVES/WIDE AREA

  {
    id: 'megabucks',
    name: 'Megabucks',
    shortName: 'Megabucks',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1986,
    quickId: 'Nevada-wide progressive - starts at $10 million minimum jackpot',
    thresholdSummary: 'NO ADVANTAGE PLAY - Worst odds on floor',
    notes: 'Holds the record: $39.7M won at Excalibur in 2003. 11%+ house edge. Play for the dream, not the math.',
    hasCalculator: false,
    warning: 'WORST ODDS - ~11% house edge!'
  },

  {
    id: 'wheel-of-fortune-progressive',
    name: 'Wheel of Fortune Progressive',
    shortName: 'WoF Progressive',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1996,
    quickId: 'Wide-area progressive linked across Nevada',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Multiple jackpot tiers. The iconic spinning wheel. One of Vegas\'s most recognizable games.',
    hasCalculator: false
  },
  
  // OTHER POPULAR VEGAS MACHINES,

  {
    id: 'invaders-planet-moolah',
    name: 'Invaders from Planet Moolah',
    shortName: 'Planet Moolah',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Alien cow theme - cascading reels with free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Quirky alien cow invasion theme. Cascading reels for consecutive wins.',
    hasCalculator: false
  },

  {
    id: 'money-link',
    name: 'Money Link: The Great Immortals',
    shortName: 'Money Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Link feature with immortal characters theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newer Light & Wonder link game. Popular on Vegas floors.',
    hasCalculator: false
  },

  {
    id: 'james-bond-thunderball',
    name: 'James Bond: Thunderball',
    shortName: 'Bond Thunderball',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: '007 license - spy theme with multiple bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed James Bond theme. Multiple bonus rounds.',
    hasCalculator: false
  },

  {
    id: 'the-walking-dead',
    name: 'The Walking Dead',
    shortName: 'Walking Dead',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'AMC zombie series theme - walker bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed AMC theme. Multiple walker-themed bonus rounds.',
    hasCalculator: false
  },
  
  // =============================================
  // G2E 2025 RELEASES (October 2025)
  // These are hitting casino floors late 2025 / early 2026
  // =============================================
  
  // IGT G2E 2025 - AP RELEVANT

  {
    id: 'surefire-frenzy-link',
    name: 'SureFire Frenzy Link',
    shortName: 'SureFire Frenzy',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: '27 MUST-HIT-BY PROGRESSIVES - Most ever in a single machine! Linked bank competition.',
    visual: {
      location: 'Check ALL 27 progressive displays - players compete within linked bank',
      appearance: [
        { label: 'Progressives', text: '27 separate must-hit-by meters' },
        { label: 'Competition', text: 'Linked machines - players race to hit' },
        { label: 'Strategy', text: 'Check entire bank for best opportunities' },
      ],
      colors: 'Modern IGT cabinet design',
      example: 'Any meter at 90%+ = potential play'
    },
    thresholdSummary: '90%+ on any of 27 meters',
    thresholdDetail: 'MOST MHB PROGRESSIVES EVER. Each meter is independent. Check all 27 for plays. Linked bank means competition with other players.',
    threshold: {
      conservative: '90%+ of any ceiling',
      aggressive: '85%+ on multiple meters'
    },
    notes: 'Debuted G2E 2025. Revolutionary number of MHB progressives. Worth learning all meter ceilings.',
    hasCalculator: true,
    checkBetLevels: true,
    warning: 'NEW RELEASE - Learn all 27 meter ceilings!'
  },

  {
    id: 'wheel-of-fortune-cash-machine',
    name: 'Wheel of Fortune Cash Machine Jackpots',
    shortName: 'WoF Cash Machine',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'IGT + Everi merger flagship - Cash Machine base game + WoF wheel bonus',
    thresholdSummary: 'NO CONFIRMED AP - Research needed',
    notes: 'Star product of IGT/Everi merger. Cash Machine gameplay with Wheel of Fortune bonus wheel. On 12-foot MegaTower Rise cabinet. Research for potential AP features.',
    hasCalculator: false,
    warning: 'NEW - Research for AP potential'
  },

  {
    id: 'magic-treasures-lock-respin',
    name: 'Magic Treasures Lock & Respin',
    shortName: 'Magic Treasures L&R',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Updated Magic Treasures with lock and respin mechanic',
    thresholdSummary: 'Similar to original - check money ball count',
    thresholdDetail: 'Likely similar mechanics to original Magic Treasures. Watch for accumulated money balls.',
    notes: 'G2E 2025 release on RISE32 cabinet. Research specific mechanics when encountered.',
    hasCalculator: false,
    warning: 'NEW - Verify mechanics match original'
  },

  {
    id: 'eternal-link',
    name: 'Eternal Link: Warrior\'s Empire',
    shortName: 'Eternal Link',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'New IGT link series - research mechanics when encountered',
    thresholdSummary: 'UNKNOWN - New release',
    notes: 'Major new IGT franchise debuting G2E 2025. On RISE55 cabinet. Research for AP potential.',
    hasCalculator: false,
    warning: 'NEW - Research AP potential'
  },
  
  // IGT G2E 2025 - Entertainment

  {
    id: 'smokin-hot-stuff-wicked-wheel-grand',
    name: 'Smokin\' Hot Stuff Wicked Wheel Grand',
    shortName: 'Hot Stuff Wicked',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Hot Stuff devil character + Wicked Wheel mechanic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Dynasty Luna cabinet. Combines Hot Stuff IP with Wicked Wheel feature.',
    hasCalculator: false
  },

  {
    id: 'magic-rockets-tiger',
    name: 'Magic Rockets Tiger',
    shortName: 'Magic Rockets Tiger',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Rocket-themed slot with tiger variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on RISE55 cabinet.',
    hasCalculator: false
  },

  {
    id: 'magic-rockets-dragon',
    name: 'Magic Rockets Dragon',
    shortName: 'Magic Rockets Dragon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Rocket-themed slot with dragon variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on RISE55 cabinet.',
    hasCalculator: false
  },

  {
    id: 'jackpot-express-igt',
    name: 'Jackpot Express',
    shortName: 'Jackpot Express',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Train-themed jackpot game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Dynasty Sol cabinet.',
    hasCalculator: false
  },

  {
    id: 'stink-link-hawaii',
    name: 'Stink Link: Hawaii',
    shortName: 'Stink Link Hawaii',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Link game with Hawaiian theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on RISE32 cabinet.',
    hasCalculator: false
  },

  {
    id: 'stink-link-wild-west',
    name: 'Stink Link: Wild West',
    shortName: 'Stink Link West',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Link game with Western theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on RISE32 cabinet.',
    hasCalculator: false
  },

  {
    id: 'king-khufu',
    name: 'King Khufu',
    shortName: 'King Khufu',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Egyptian pharaoh theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on RISE32 cabinet. Egyptian pyramid builder theme.',
    hasCalculator: false
  },

  {
    id: 'whitney-houston-slots',
    name: 'Whitney Houston Slots',
    shortName: 'Whitney Houston',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Licensed Whitney Houston music theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed music slot featuring Whitney Houston. Recent hit release.',
    hasCalculator: false
  },

  {
    id: 'prosperity-link-2025',
    name: 'Prosperity Link (2025)',
    shortName: 'Prosperity Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Updated Prosperity Link with new features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 updated version of Prosperity Link series.',
    hasCalculator: false
  },

  {
    id: 'tiger-and-dragon-2025',
    name: 'Tiger and Dragon (2025)',
    shortName: 'Tiger and Dragon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Updated Tiger and Dragon with Cash on Reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Won "Top Performing New Premium Game" at EKG Slot Awards.',
    hasCalculator: false
  },

  {
    id: 'wof-cash-on-reels',
    name: 'Wheel of Fortune Cash on Reels',
    shortName: 'WoF Cash on Reels',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'WoF with Cash on Reels mechanic on RISE55/MegaTower cabinets',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Multi-level progressive on spectacular new cabinets.',
    hasCalculator: false
  },

  {
    id: 'kitty-glitter-grand',
    name: 'Kitty Glitter Grand',
    shortName: 'Kitty Glitter Grand',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Premium version of classic Kitty Glitter',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Simultaneous land-based and online launch. Premium cabinet experience.',
    hasCalculator: false
  },
  
  // ARISTOCRAT G2E 2025

  {
    id: 'buffalo-mega-stampede',
    name: 'Buffalo Mega Stampede',
    shortName: 'Buffalo Mega',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Expanding reels + Hold & Spin + 3-level Bonus Meter',
    visual: {
      location: 'Check the 3-level Bonus Meter progress',
      appearance: [
        { label: 'Reels', text: 'Expanding reels during features' },
        { label: 'Hold & Spin', text: 'Standard Aristocrat H&S mechanic' },
        { label: 'Bonus Meter', text: '3 levels - check progress' },
      ],
      colors: 'Buffalo orange/sunset theme',
      example: 'Bonus meter nearly full on any level'
    },
    thresholdSummary: 'Check 3-level Bonus Meter',
    thresholdDetail: 'Builds on Buffalo Ultimate Stampede. Watch the 3-level bonus meter for accumulated progress.',
    notes: 'G2E 2025 release. Latest Buffalo evolution. Research specific meter thresholds.',
    hasCalculator: false,
    warning: 'NEW - Research meter thresholds'
  },

  {
    id: 'phoenix-link-confucius',
    name: 'Phoenix Link: Confucius Say',
    shortName: 'Phoenix Confucius',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Phoenix rises to revive bonus rounds - similar to Dragon Link but with revival feature',
    visual: {
      location: 'Phoenix symbol counter + revival indicator',
      appearance: [
        { label: 'Counter', text: 'Similar to Dragon Link mechanics' },
        { label: 'Phoenix Revival', text: 'Bonus can revive for additional wins' },
        { label: 'Hold & Spin', text: 'Standard Aristocrat H&S' },
      ],
      colors: 'Red/gold phoenix fire theme',
      example: 'Counter near ceiling + revival potential'
    },
    thresholdSummary: 'Similar to Dragon Link - check counter',
    thresholdDetail: 'New Phoenix Link series. Phoenix revival feature extends bonus rounds. Research specific ceiling values.',
    notes: 'G2E 2025 release. Phoenix can revive bonus for more wins. Sister game to Dragon Link.',
    hasCalculator: false,
    warning: 'NEW - Research ceiling values'
  },

  {
    id: 'phoenix-link-general-tso',
    name: 'Phoenix Link: General Tso',
    shortName: 'Phoenix General Tso',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Phoenix Link variant with General Tso theme',
    thresholdSummary: 'Similar to Dragon Link mechanics',
    notes: 'G2E 2025 release. Part of new Phoenix Link series with revival feature.',
    hasCalculator: false,
    warning: 'NEW - Research ceiling values'
  },

  {
    id: 'phoenix-link-queen-chiu',
    name: 'Phoenix Link: Queen Chiu',
    shortName: 'Phoenix Queen Chiu',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Phoenix Link variant with Queen theme',
    thresholdSummary: 'Similar to Dragon Link mechanics',
    notes: 'G2E 2025 release. Part of new Phoenix Link series with revival feature.',
    hasCalculator: false,
    warning: 'NEW - Research ceiling values'
  },

  {
    id: 'phoenix-link-sensei-master',
    name: 'Phoenix Link: Sensei Master',
    shortName: 'Phoenix Sensei',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Phoenix Link variant with martial arts master theme',
    thresholdSummary: 'Similar to Dragon Link mechanics',
    notes: 'G2E 2025 release. Part of new Phoenix Link series with revival feature.',
    hasCalculator: false,
    warning: 'NEW - Research ceiling values'
  },

  {
    id: 'monopoly-big-board-bucks',
    name: 'Monopoly Big Board Bucks',
    shortName: 'Monopoly Big Board',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'First Aristocrat Monopoly under new Hasbro license - pot collection + Hold & Spin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. First Monopoly game under Aristocrat\'s new Hasbro license. On Baron Portrait cabinet.',
    hasCalculator: false
  },

  {
    id: 'millioniser',
    name: 'Millioni$er',
    shortName: 'Millioniser',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'New mechanic + progressive jackpot on Baron Portrait cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Introduces new game mechanic. On Baron Portrait cabinet.',
    hasCalculator: false
  },

  {
    id: 'bao-zhu-zhao-fu-firecrackers',
    name: 'Bao Zhu Zhao Fu Firecrackers Express',
    shortName: 'BZZF Firecrackers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: '5 overlapping features = up to 31 different bonus combos',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Double, Ultra, Zone, Twin, Extra features can all overlap.',
    hasCalculator: false
  },
  
  // LIGHT & WONDER G2E 2025

  {
    id: 'dancing-drums-revolution',
    name: 'Dancing Drums Revolution',
    shortName: 'DD Revolution',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Latest Dancing Drums on LightWave cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on new LightWave cabinet system. Spectacular light show integration.',
    hasCalculator: false
  },

  {
    id: 'frankenstein-returns',
    name: 'Frankenstein Returns',
    shortName: 'Frankenstein Returns',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Universal Monsters Frankenstein sequel on LightWave',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on LightWave cabinet. Universal Monsters license.',
    hasCalculator: false
  },

  {
    id: 'visitors-planet-moolah',
    name: 'Visitors From Planet Moolah',
    shortName: 'Visitors Moolah',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Sequel to Invaders from Planet Moolah on LightWave',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on LightWave cabinet. Alien cow theme continues.',
    hasCalculator: false
  },

  {
    id: 'ufl-cash-falls-explosion',
    name: 'Ultimate Fire Link Cash Falls Explosion',
    shortName: 'UFL Cash Falls Exp',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Combined Fire Link + Cash Falls mechanics on LightWave',
    thresholdSummary: 'Check fireball fill + reel counters',
    thresholdDetail: 'Combines Cash Falls fill mechanic with Fire Link features. Watch for partially filled reels.',
    notes: 'G2E 2025 release on LightWave cabinet. Combines two popular mechanics.',
    hasCalculator: false,
    warning: 'NEW - Research specific thresholds'
  },

  {
    id: 'jackpot-party-vip-disco',
    name: 'Jackpot Party VIP-Disco',
    shortName: 'JP VIP Disco',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Modern disco party version of classic Jackpot Party',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on LightWave cabinet. Evolution of 1998 WMS classic.',
    hasCalculator: false
  },

  {
    id: 'willy-wonka-sweet-selection',
    name: 'Willy Wonka Sweet Selection',
    shortName: 'Wonka Sweet',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Four-pot Wonka with Golden Goose Hold & Spin feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Cosmic Sky cabinet. Free-spin + hold-and-spin features.',
    hasCalculator: false
  },

  {
    id: 'squid-game-slot',
    name: 'Squid Game',
    shortName: 'Squid Game',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Netflix series license - Red Light Green Light, Tug of War, Glass Tile games',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed from most-popular Netflix series. On HORIZON 75-inch cabinet. Features iconic show games.',
    hasCalculator: false
  },
  
  // KONAMI G2E 2025

  {
    id: 'money-in-the-bank-konami',
    name: 'Money in the Bank',
    shortName: 'Money in Bank',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'New Konami parent franchise - accumulator mechanic',
    thresholdSummary: 'Check bank accumulation',
    thresholdDetail: 'New parent franchise from Konami. Bank accumulation mechanic - research specific thresholds.',
    notes: 'G2E 2025 major new franchise. Multiple derivative games expected. Worth learning.',
    hasCalculator: false,
    warning: 'NEW FRANCHISE - Research mechanics'
  },

  {
    id: 'bomberman-boom',
    name: 'Bomberman Boom',
    shortName: 'Bomberman Boom',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'Bomberman license - 3 bomb collection pots, bombs break walls for prizes',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Solstice 49C cabinet. Licensed Bomberman character. Three bonus types.',
    hasCalculator: false
  },

  {
    id: 'china-shores-link-majesty',
    name: 'China Shores Link Majesty',
    shortName: 'CS Link Majesty',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'China Shores with 3 panda pots that enhance free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Solstice 49C. Evolution of classic China Shores.',
    hasCalculator: false
  },

  {
    id: 'red-fortune-rail',
    name: 'Red Fortune Rail',
    shortName: 'Red Fortune Rail',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'Train theme - hold-and-spin within hold-and-spin feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Yin-yang symbols trigger second H&S within H&S feature.',
    hasCalculator: false
  },

  {
    id: 'broadside-bounty',
    name: 'Broadside Bounty',
    shortName: 'Broadside Bounty',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'Pirate ship cannon theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Pirate/naval battle theme.',
    hasCalculator: false
  },

  {
    id: 'kintsugi-cat',
    name: 'Kintsugi Cat',
    shortName: 'Kintsugi Cat',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'Japanese art theme with lucky cat',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Kintsugi (gold repair art) + maneki-neko theme.',
    hasCalculator: false
  },

  {
    id: 'volcanic-rock-fire',
    name: 'Volcanic Rock Fire',
    shortName: 'Volcanic Rock Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'Volcano/fire theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Fire/lava theme.',
    hasCalculator: false
  },
  
  // AGS G2E 2025

  {
    id: 'moo-cluck-oink',
    name: 'Moo Cluck Oink',
    shortName: 'Moo Cluck Oink',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Farm-themed three-pot metamorphic game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Spectra UR43 Premium cabinet. Farm animal theme.',
    hasCalculator: false
  },

  {
    id: 'rakin-bacon-odyssey',
    name: 'Rakin\' Bacon Odyssey',
    shortName: 'Rakin Bacon Odyssey',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Cornsquealius returns in adventure theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Popular pig character Cornsquealius continues.',
    hasCalculator: false
  },

  {
    id: 'rakin-bacon-sahara',
    name: 'Rakin\' Bacon Sahara',
    shortName: 'Rakin Bacon Sahara',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Cornsquealius in desert/Sahara theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Desert-themed Rakin Bacon variant.',
    hasCalculator: false
  },

  {
    id: 'fu-nan-fu-nu-prosperity',
    name: 'Fu Nan Fu Nu Prosperity',
    shortName: 'FNFN Prosperity',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Premium merchandising version of Fu Nan Fu Nu',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Premium cabinet version.',
    hasCalculator: false
  },

  {
    id: 'fu-nan-fu-nu-longevity',
    name: 'Fu Nan Fu Nu Longevity',
    shortName: 'FNFN Longevity',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Premium merchandising version with longevity theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Premium cabinet version.',
    hasCalculator: false
  },

  {
    id: 'triple-coin-treasures-gold',
    name: 'Triple Coin Treasures Gold',
    shortName: 'Triple Coin Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Four-pot version of award-winning Triple Coin Treasures',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Won "Best Slot Product" at 2024 GGB Gaming & Technology Awards.',
    hasCalculator: false
  },
  
  // AINSWORTH G2E 2025

  {
    id: 'train-heist-robbers-roost',
    name: 'Train Heist: Robber\'s Roost',
    shortName: 'Train Heist Robbers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2025,
    quickId: 'Western train robbery theme - 3 collection pots, train chase bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Train robber chases train to collect credits. Three pots boost values.',
    hasCalculator: false
  },

  {
    id: 'train-heist-rio-grande',
    name: 'Train Heist: Rio Grande Pass',
    shortName: 'Train Heist Rio',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2025,
    quickId: 'Mexican bandito train robbery variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Mexican bandito theme with train chase bonus.',
    hasCalculator: false
  },
  
  // EVERI/IGT G2E 2025 (pre-merger Everi games now under IGT)

  {
    id: 'powerball-slot',
    name: 'Powerball',
    shortName: 'Powerball',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Licensed Powerball lottery theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Licensed lottery brand. Launching Q4 2025.',
    hasCalculator: false
  },

  {
    id: 'casper-slot',
    name: 'Casper',
    shortName: 'Casper',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Casper the Friendly Ghost license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Announced G2E 2025. May not be widely deployed yet.',
    hasCalculator: false
  },

  {
    id: 'fire-lion',
    name: 'Fire Lion',
    shortName: 'Fire Lion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Australian-designed fire lion theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Developed by Australian designer in collaboration with Everi.',
    hasCalculator: false
  },
  
  // INCREDIBLE TECHNOLOGIES G2E 2025

  {
    id: 'double-stack-up-pays',
    name: 'Double Stack-Up Pays',
    shortName: 'Double Stack-Up',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2025,
    quickId: 'Expanding reels - can trigger 2 bonuses or win 2 jackpots at once',
    thresholdSummary: 'Check reel expansion state',
    thresholdDetail: 'Similar to Stack Up Pays but can double-trigger. Watch for expanded reel states.',
    notes: 'G2E 2025 release on new Prism Spark curved-screen cabinet.',
    hasCalculator: false,
    warning: 'NEW - Research specific mechanics'
  },
  
  // INTERBLOCK G2E 2025 (ETG focused)

  {
    id: 'marble-run-2025',
    name: 'Marble Run (2025)',
    shortName: 'Marble Run',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Interblock',
    releaseYear: 2025,
    quickId: 'Improved marble racing ETG - expanding/contracting track',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 improved version. Part of AMUSE series. Casual gambler focused.',
    hasCalculator: false
  },

  // =============================================
  // MACHINE PRO CLUB AP MACHINES (79 documented)
  // Adding all missing AP machines from their list
  // =============================================


  {
    id: 'ascending-fortunes-jewel-oasis',
    name: 'Ascending Fortunes: Jewel Oasis',
    shortName: 'Ascending Jewel',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: '5 MHB free games meters - reel expansions increase ways to win',
    visual: {
      location: 'Five colored meters above reels',
      appearance: [
        { label: 'Mega (red)', text: 'Resets 250, hits by 350' },
        { label: 'Grand (orange)', text: 'Resets 200, hits by 250' },
        { label: 'Major (purple)', text: 'Resets 150, hits by 200' },
        { label: 'Minor (green)', text: 'Resets 100, hits by 150' },
        { label: 'Mini (blue)', text: 'Resets 75, hits by 125' }
      ]
    },
    thresholdSummary: 'Mega 320+, Grand 230+, Major 180+',
    thresholdDetail: 'Same mechanics as Stack Up Pays. Meters build reel expansions for 10 free games.',
    notes: 'Sister game to Stack Up Pays with different theme.',
    hasCalculator: true
  },

  {
    id: 'ascending-fortunes-pagoda-rising',
    name: 'Ascending Fortunes: Pagoda Rising',
    shortName: 'Ascending Pagoda',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: '5 MHB free games meters - same as Jewel Oasis',
    thresholdSummary: 'Mega 320+, Grand 230+, Major 180+',
    thresholdDetail: 'Same mechanics as Stack Up Pays/Jewel Oasis.',
    notes: 'Asian pagoda theme variant of Ascending Fortunes.',
    hasCalculator: true
  },

  {
    id: 'cleopatras-vault',
    name: 'Cleopatra\'s Vault',
    shortName: 'Cleo Vault',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2022,
    quickId: 'Same as Aztec Vault - fill column to win',
    thresholdSummary: 'Column nearly full (1-2 coins needed)',
    thresholdDetail: 'Identical mechanics to Aztec Vault with Egyptian theme.',
    notes: 'Sister game to Aztec Vault.',
    hasCalculator: false
  },

  {
    id: 'big-ocean-jackpots',
    name: 'Big Ocean Jackpots',
    shortName: 'Big Ocean',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Bubbles move up each spin - jackpot bubbles on coins = win',
    visual: {
      location: 'Bubbles floating above reels',
      appearance: [
        { label: 'Jackpot bubbles', text: 'Mini, Minor, Maxi prizes' },
        { label: 'Wild bubbles', text: 'Turn poker symbols wild' },
        { label: 'Movement', text: 'Bubbles move up 1 position per spin' }
      ]
    },
    thresholdSummary: 'Jackpot bubble 1-2 rows from coin position',
    thresholdDetail: 'Bubbles move up each spin. Jackpot bubble landing on coin = win that jackpot.',
    notes: 'Track bubble positions relative to coin symbols.',
    hasCalculator: false
  },

  {
    id: 'block-bonanza-hawaii',
    name: 'Block Bonanza: Hawaii',
    shortName: 'Block Hawaii',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Colored blocks above reels with credit values - dollar symbols trigger corresponding block prizes',
    visual: {
      location: 'Blocks above reels matching positions below',
      appearance: [
        { label: 'Blocks', text: 'Credit values in colored blocks' },
        { label: 'Trigger', text: 'Dollar in reels 1-3 = win matching block' }
      ]
    },
    thresholdSummary: 'High credit values in blocks',
    thresholdDetail: 'Look for blocks with much higher than normal credit values.',
    notes: 'Block positions match reel positions below.',
    hasCalculator: false
  },

  {
    id: 'block-bonanza-rio',
    name: 'Block Bonanza: Rio',
    shortName: 'Block Rio',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as Hawaii - high value blocks',
    thresholdSummary: 'High credit values in blocks',
    notes: 'Rio carnival theme variant.',
    hasCalculator: false
  },

  {
    id: 'bonus-builder-emerald',
    name: 'Bonus Builder: Emerald Spins',
    shortName: 'Bonus Builder',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: '3 bonuses (red/blue/purple) - clovers build features or trigger',
    visual: {
      location: 'Three bonus meters - red, blue, purple',
      appearance: [
        { label: 'Red bonus', text: 'Expanded reels' },
        { label: 'Blue bonus', text: 'More free spins' },
        { label: 'Purple bonus', text: 'Low symbols removed' }
      ]
    },
    thresholdSummary: 'Any bonus meter highly built up',
    thresholdDetail: 'Clover symbols can build OR trigger bonuses. Higher build = better bonus when triggered.',
    notes: 'Complex game - features stack. MPC has calculator.',
    hasCalculator: true
  },

  {
    id: 'captain-riches',
    name: 'Captain Riches',
    shortName: 'Captain Riches',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Coin holders above reels 2-4 - 3 coins = wild reel for 3 spins',
    visual: {
      location: 'Coin holders above reels 2, 3, 4',
      appearance: [
        { label: 'Coins', text: 'Collect 3 to activate wild reel' },
        { label: 'Wild duration', text: '3 spins once activated' }
      ]
    },
    thresholdSummary: '2 coins collected in any holder',
    thresholdDetail: 'WARNING: Borderline AP trap. Understand mechanics before playing.',
    notes: 'MPC warns this is borderline - be careful.',
    hasCalculator: false,
    warning: 'Borderline AP trap - research first'
  },

  {
    id: 'tiki-fortune',
    name: 'Tiki Fortune',
    shortName: 'Tiki Fortune',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Same as Captain Riches - 3 coins = wild reel',
    thresholdSummary: '2 coins collected in any holder',
    notes: 'Sister game to Captain Riches. Same AP trap warning.',
    hasCalculator: false,
    warning: 'Borderline AP trap - research first'
  },

  {
    id: 'mine-blast',
    name: 'Mine Blast',
    shortName: 'Mine Blast',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2022,
    quickId: 'Same mechanics as Captain Riches/Tiki Fortune',
    thresholdSummary: '2 coins collected in any holder',
    notes: 'Mining theme variant. Same AP trap warning.',
    hasCalculator: false,
    warning: 'Borderline AP trap - research first'
  },

  {
    id: 'cash-cano-roman',
    name: 'Cash Cano: Roman Riches',
    shortName: 'Cash Cano Roman',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: '4 rows of gems above reels - fill row + unlock = jackpot',
    visual: {
      location: 'Four rows above reels (minor, maxi, major, grand)',
      appearance: [
        { label: 'Gems', text: 'Credit prizes in 4 rows' },
        { label: 'Trigger', text: 'Gem in each of middle 3 reels' },
        { label: 'Unlock', text: 'Rows unlock during hold & spin' }
      ]
    },
    thresholdSummary: 'High value gems + rows nearly full',
    thresholdDetail: '3 gems in row = jackpot IF row unlocks. Hold & spin unlocks rows.',
    notes: 'Complex unlock mechanic. Research before playing.',
    hasCalculator: false
  },

  {
    id: 'cash-cano-tiki',
    name: 'Cash Cano: Tiki',
    shortName: 'Cash Cano Tiki',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: 'Same as Roman Riches with tiki theme',
    thresholdSummary: 'High value gems + rows nearly full',
    notes: 'Tiki theme variant of Cash Cano.',
    hasCalculator: false
  },

  {
    id: 'dancing-drums-golden-drums',
    name: 'Dancing Drums: Golden Drums',
    shortName: 'DD Golden',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Multiplier builds above reel 1 - applies to Golden Respin feature',
    visual: {
      location: 'Multiplier display above first reel',
      appearance: [
        { label: 'Multiplier', text: 'Increases with +1 drum symbols' },
        { label: 'Golden Respin', text: 'Drums in reels 1-2 trigger feature' },
        { label: 'Reset', text: 'Only resets if glowing green drums land' }
      ]
    },
    thresholdSummary: 'High multiplier (8x+)',
    thresholdDetail: 'Multiplier applies to glowing green drum prizes. Persists until green drums actually land.',
    notes: 'Different from regular Dancing Drums. Learn the multiplier mechanics.',
    hasCalculator: false
  },

  {
    id: 'diamond-collector-wolfpack',
    name: 'Diamond Collector: Wolfpack',
    shortName: 'Diamond Wolfpack',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Collect 15 diamonds = free spins bonus',
    visual: {
      location: 'Diamond counter display',
      appearance: [
        { label: 'Counter', text: 'Shows diamonds collected (0-15)' },
        { label: 'Trigger', text: '15 diamonds = free spins' }
      ]
    },
    thresholdSummary: '12+ diamonds collected',
    thresholdDetail: 'Simple collection mechanic. 15 diamonds guarantees bonus trigger.',
    notes: 'Straightforward AP game.',
    hasCalculator: false
  },

  {
    id: 'diamond-collector-elite7s',
    name: 'Diamond Collector: Elite 7\'s',
    shortName: 'Diamond Elite7s',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as Wolfpack - 15 diamonds = bonus',
    thresholdSummary: '12+ diamonds collected',
    notes: '7s theme variant.',
    hasCalculator: false
  },

  {
    id: 'diamonds-devils-deluxe',
    name: 'Diamonds & Devils Deluxe',
    shortName: 'Diamonds Devils',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'Collect 3 diamonds per reel for prizes - devils REMOVE diamonds',
    visual: {
      location: 'Prize displays and diamond holders above reels',
      appearance: [
        { label: 'Diamonds', text: 'Collect 3 to win prize' },
        { label: 'Devils', text: 'REMOVE 1 diamond' },
        { label: 'Reset', text: 'Devil with 0 diamonds = full reset' }
      ]
    },
    thresholdSummary: '2 diamonds + built up prizes',
    thresholdDetail: 'WARNING: Devils remove progress. 0 diamonds + devil = resets credits AND free games.',
    notes: 'Can lose progress. Risk/reward calculation needed.',
    hasCalculator: false,
    warning: 'Devils can reset your progress!'
  },

  {
    id: 'jade-monkey-deluxe',
    name: 'Jade Monkey Deluxe',
    shortName: 'Jade Monkey Dlx',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'Same as Diamonds & Devils - monkeys remove progress',
    thresholdSummary: '2 diamonds + built up prizes',
    notes: 'Asian theme variant. Same reset warning.',
    hasCalculator: false,
    warning: 'Jade monkeys can reset your progress!'
  },

  {
    id: 'dragon-lights-fortune-skies',
    name: 'Dragon Lights: Fortune Skies',
    shortName: 'Dragon Lights FS',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: '4 progressive free games meters - NOT must-hit-by - VOLATILE',
    visual: {
      location: 'Four meters: mini, minor, major, mega',
      appearance: [
        { label: 'Meters', text: 'Build with symbols in reel 5' },
        { label: 'Trigger', text: 'Random - NOT guaranteed' }
      ]
    },
    thresholdSummary: 'Very high meter values',
    thresholdDetail: 'WARNING: NOT must-hit-by. Extremely volatile. Large bankroll required.',
    notes: 'MPC warns: only for experienced APs with large bankrolls.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'dragon-lights-mystical-falls',
    name: 'Dragon Lights: Mystical Falls',
    shortName: 'Dragon Lights MF',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Same as Fortune Skies - VOLATILE',
    thresholdSummary: 'Very high meter values',
    notes: 'Waterfall theme variant. Same volatility warning.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'dragon-lights-secret-fortress',
    name: 'Dragon Lights: Secret Fortress',
    shortName: 'Dragon Lights SF',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Same as Fortune Skies - VOLATILE',
    thresholdSummary: 'Very high meter values',
    notes: 'Fortress theme variant. Same volatility warning.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'dragon-spin-crosslink-air',
    name: 'Dragon Spin CrossLink: Air',
    shortName: 'DS CrossLink Air',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: '5 bags fill with gold - fuller bags = bigger prizes in Dragon Spin feature',
    visual: {
      location: 'Five gold bags above reels',
      appearance: [
        { label: 'Bags', text: 'Fill when medallions land' },
        { label: 'Dragon Spin', text: 'Random trigger when medallion lands' },
        { label: 'Prizes', text: 'Fuller bags = larger credit prizes' }
      ]
    },
    thresholdSummary: 'Multiple bags nearly full',
    thresholdDetail: 'Gold medallions fill corresponding bags. Dragon Spin can trigger any time medallion lands.',
    notes: 'Track bag fill levels across all 5 positions.',
    hasCalculator: false
  },

  {
    id: 'dragon-spin-crosslink-earth',
    name: 'Dragon Spin CrossLink: Earth',
    shortName: 'DS CrossLink Earth',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Air variant',
    thresholdSummary: 'Multiple bags nearly full',
    notes: 'Earth element theme.',
    hasCalculator: false
  },

  {
    id: 'dragon-spin-crosslink-fire',
    name: 'Dragon Spin CrossLink: Fire',
    shortName: 'DS CrossLink Fire',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Air variant',
    thresholdSummary: 'Multiple bags nearly full',
    notes: 'Fire element theme.',
    hasCalculator: false
  },

  {
    id: 'dragon-spin-crosslink-water',
    name: 'Dragon Spin CrossLink: Water',
    shortName: 'DS CrossLink Water',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Air variant',
    thresholdSummary: 'Multiple bags nearly full',
    notes: 'Water element theme.',
    hasCalculator: false
  },

  {
    id: 'dragon-unleashed-prosperity',
    name: 'Dragon Unleashed: Prosperity Packets',
    shortName: 'Dragon Unleashed PP',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Orbs with credits shift down each spin - 6 orbs = hold & spin',
    visual: {
      location: 'Orbs on reels that shift down',
      appearance: [
        { label: 'Orbs', text: 'Credit prizes, shift down each spin' },
        { label: 'Trigger', text: '6 orbs on screen = hold & spin' },
        { label: 'Stacks', text: 'Often land in connected stacks of 4' }
      ]
    },
    thresholdSummary: '4-5 orbs already on screen',
    thresholdDetail: 'Orbs persist and shift down. 6 total triggers hold & spin.',
    notes: 'Watch for orbs about to shift off bottom.',
    hasCalculator: false
  },

  {
    id: 'dragon-unleashed-red-fleet',
    name: 'Dragon Unleashed: Red Fleet',
    shortName: 'Dragon Unleashed RF',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Prosperity Packets',
    thresholdSummary: '4-5 orbs already on screen',
    notes: 'Naval theme variant.',
    hasCalculator: false
  },

  {
    id: 'dragon-unleashed-three-legends',
    name: 'Dragon Unleashed: Three Legends',
    shortName: 'Dragon Unleashed 3L',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Prosperity Packets',
    thresholdSummary: '4-5 orbs already on screen',
    notes: 'Three Kingdoms theme variant.',
    hasCalculator: false
  },

  {
    id: 'dragon-unleashed-treasured-happiness',
    name: 'Dragon Unleashed: Treasured Happiness',
    shortName: 'Dragon Unleashed TH',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Prosperity Packets',
    thresholdSummary: '4-5 orbs already on screen',
    notes: 'Happiness/prosperity theme variant.',
    hasCalculator: false
  },

  {
    id: 'frankenstein-ap',
    name: 'Frankenstein',
    shortName: 'Frankenstein',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Multipliers build on prize array - Power Up adds multipliers, It\'s Alive awards prizes',
    visual: {
      location: 'Prize array above reels with multipliers',
      appearance: [
        { label: 'Prizes', text: 'Jackpots (orange) and credits (blue)' },
        { label: 'Power Up', text: 'Adds multipliers to prizes' },
        { label: 'It\'s Alive', text: 'Awards prizes with multipliers' }
      ]
    },
    thresholdSummary: 'High multipliers on jackpot prizes',
    thresholdDetail: 'Multipliers persist. It\'s Alive in reel 1 + Frankenstein heads in 2-5 = win prizes.',
    notes: 'MPC has calculator. Complex but lucrative.',
    hasCalculator: true
  },

  {
    id: 'fu-dai-lian-lian-peacock',
    name: 'Fu Dai Lian Lian: Boost Peacock',
    shortName: 'FDLL Peacock',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: '3 bags fill with coins - jewels = boosted bonus features',
    visual: {
      location: 'Three bags above reels',
      appearance: [
        { label: 'Bags', text: 'Fill with colored coins' },
        { label: 'Jewels', text: 'Appear when bag nearly full' },
        { label: 'Boost', text: 'Jewels = enhanced bonus features' }
      ]
    },
    thresholdSummary: 'Bags with jewels (glowing)',
    thresholdDetail: 'Jewels mean BETTER bonus, NOT closer to trigger. Fuller bags improve features when bonus hits.',
    notes: 'Fuller bags = better bonus, but trigger is still random.',
    hasCalculator: false
  },

  {
    id: 'fu-dai-lian-lian-tiger',
    name: 'Fu Dai Lian Lian: Boost Tiger',
    shortName: 'FDLL Tiger',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'Same as Peacock variant',
    thresholdSummary: 'Bags with jewels (glowing)',
    notes: 'Tiger theme variant.',
    hasCalculator: false
  },

  {
    id: 'golden-elements-brilliant',
    name: 'Golden Elements: Brilliant Fortunes',
    shortName: 'Golden Elements',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Same as Golden Beasts - MHB 180',
    thresholdSummary: '160+ symbols collected',
    notes: 'Elements theme variant.',
    hasCalculator: false
  },

  {
    id: 'grand-buddha-link',
    name: 'Grand Buddha Link',
    shortName: 'Grand Buddha',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Line hits create persistent multipliers (8 spins) - left side 5-12x, right side 3x',
    visual: {
      location: 'Multiplier positions on left and right of reels',
      appearance: [
        { label: 'Left', text: '8x, 6x, 5x multipliers' },
        { label: 'Right', text: '3x multipliers' },
        { label: 'Duration', text: '8 spins once activated' }
      ]
    },
    thresholdSummary: 'High multipliers with spins remaining',
    thresholdDetail: 'Line hits turn symbols into multipliers. Track positions and remaining spins.',
    notes: 'Complex tracking required.',
    hasCalculator: false
  },

  {
    id: 'grand-cat-link',
    name: 'Grand Cat Link',
    shortName: 'Grand Cat',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as Grand Buddha Link',
    thresholdSummary: 'High multipliers with spins remaining',
    notes: 'Cat theme variant.',
    hasCalculator: false
  },

  {
    id: 'hyper-orbs-king-seas',
    name: 'Hyper Orbs: King of the Seas',
    shortName: 'Hyper Orbs KotS',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Collect 15 orbs = free spins bonus',
    visual: {
      location: 'Orb counter display',
      appearance: [
        { label: 'Counter', text: 'Orbs collected (0-15)' },
        { label: 'Trigger', text: '15 orbs = free spins' }
      ]
    },
    thresholdSummary: '12+ orbs collected',
    thresholdDetail: 'Simple collection. 15 orbs = guaranteed bonus.',
    notes: 'Similar to Diamond Collector.',
    hasCalculator: false
  },

  {
    id: 'hyper-orbs-dragon-sense',
    name: 'Hyper Orbs: Dragon Sense',
    shortName: 'Hyper Orbs DS',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as King of the Seas',
    thresholdSummary: '12+ orbs collected',
    notes: 'Dragon theme variant.',
    hasCalculator: false
  },

  {
    id: 'jackpot-catcher-sun',
    name: 'Jackpot Catcher: Sun',
    shortName: 'JP Catcher Sun',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2022,
    quickId: 'Glowing rings lock for 3 spins - credit values in rings = win',
    visual: {
      location: 'Glowing rings on reels',
      appearance: [
        { label: 'Rings', text: 'Lock for 3 spins (3 segments)' },
        { label: 'Win', text: 'Credit value lands in ring = award' }
      ]
    },
    thresholdSummary: 'Multiple rings with 2-3 segments',
    thresholdDetail: 'Each ring has 3 segments showing spins remaining. Credit symbol in ring = win that amount.',
    notes: 'Track ring positions and remaining spins.',
    hasCalculator: false
  },

  {
    id: 'jackpot-catcher-moon',
    name: 'Jackpot Catcher: Moon',
    shortName: 'JP Catcher Moon',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2022,
    quickId: 'Same as Sun variant',
    thresholdSummary: 'Multiple rings with 2-3 segments',
    notes: 'Moon theme variant.',
    hasCalculator: false
  },

  {
    id: 'jewel-collection-dragon',
    name: 'Jewel Collection: Dragon',
    shortName: 'Jewel Coll Dragon',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: '4 jewel meters + scatter meter (MHB 777) - wilds added to reels',
    visual: {
      location: 'Four jewel meters + scatter meter',
      appearance: [
        { label: 'Amethyst', text: 'Random wilds (like Regal Riches blue)' },
        { label: 'Sapphire/Emerald/Ruby', text: 'Free games wilds' },
        { label: 'Scatter', text: 'MHB by 777 = mystery free games' }
      ]
    },
    thresholdSummary: 'High meter values OR scatter near 777',
    thresholdDetail: 'NOT like Regal Riches MHB - wilds are added to reel strip, not guaranteed to land.',
    notes: 'Complex game. Research differences from Regal Riches.',
    hasCalculator: false
  },

  {
    id: 'jewel-collection-vault',
    name: 'Jewel Collection: Vault',
    shortName: 'Jewel Coll Vault',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Same as Dragon variant',
    thresholdSummary: 'High meter values OR scatter near 777',
    notes: 'Vault theme variant.',
    hasCalculator: false
  },

  {
    id: 'joe-blow-diamonds',
    name: 'Joe Blow Diamonds',
    shortName: 'Joe Blow Dia',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: '3 dynamite sticks above reel = wild reel for 3 spins - chain reaction possible',
    visual: {
      location: 'Dynamite stick holders above reels',
      appearance: [
        { label: 'Sticks', text: 'Collect 3 per reel' },
        { label: 'Wild', text: '3 spins when triggered' },
        { label: 'Chain', text: 'New wild resets ALL wild reels to 3 spins' }
      ]
    },
    thresholdSummary: '2 sticks on multiple reels',
    thresholdDetail: 'Chain reaction: if another reel hits 3 sticks while wild active, ALL wild reels reset to 3 spins.',
    notes: 'Chain reactions can be very profitable.',
    hasCalculator: false
  },

  {
    id: 'joe-blow-gold',
    name: 'Joe Blow Gold',
    shortName: 'Joe Blow Gold',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Same as Diamonds variant',
    thresholdSummary: '2 sticks on multiple reels',
    notes: 'Gold theme variant.',
    hasCalculator: false
  },

  {
    id: 'knock-knock-guardians-queen',
    name: 'Knock Knock Guardians: Queen',
    shortName: 'KK Guard Queen',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: '2 bonuses with 3 upgrade levels each - orbs upgrade or trigger',
    visual: {
      location: 'Two cat figures (left and right) + 4 free spins meters',
      appearance: [
        { label: 'Left cat', text: 'Symbol Change Bonus (1-3 symbols upgraded)' },
        { label: 'Right cat', text: 'Reel Grow Bonus (1024-7776 ways)' },
        { label: 'Orbs', text: 'White=left, Black=right' }
      ]
    },
    thresholdSummary: 'Either bonus at level 2-3',
    thresholdDetail: 'Higher levels = much better bonuses. Both bonuses can trigger together.',
    notes: 'Complex but rewarding. Learn all upgrade levels.',
    hasCalculator: false
  },

  {
    id: 'knock-knock-guardians-raider',
    name: 'Knock Knock Guardians: Raider',
    shortName: 'KK Guard Raider',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: 'Same as Queen variant',
    thresholdSummary: 'Either bonus at level 2-3',
    notes: 'Raider theme variant.',
    hasCalculator: false
  },

  {
    id: 'life-of-luxury-hot-diamonds',
    name: 'Life of Luxury Hot Diamonds',
    shortName: 'LoL Hot Diamonds',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'WMS',
    releaseYear: 2020,
    quickId: '3 progressive free games meters (car/boat/plane) - NOT MHB - VOLATILE',
    visual: {
      location: 'Three meters: car, boat, plane',
      appearance: [
        { label: 'Meters', text: 'Build with landing symbols' },
        { label: 'Trigger', text: 'Random - NOT guaranteed' }
      ]
    },
    thresholdSummary: 'Very high meter values',
    thresholdDetail: 'WARNING: NOT must-hit-by. Extremely volatile. Large bankroll required.',
    notes: 'MPC warns: only for experienced APs. Titles include Far East Fortunes, Great Eagle, Jungle Cats, Mermaid\'s Gold.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'lucky-coin-link-asian',
    name: 'Lucky Coin Link: Asian Dreaming',
    shortName: 'Lucky Coin Asian',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2022,
    quickId: 'Coin holders below reels - all 5 full = re-spin feature',
    visual: {
      location: 'Coin holders below each reel',
      appearance: [
        { label: 'Holders', text: '1 coin each, 5 total' },
        { label: 'Bet levels', text: 'Higher bets start with more coins' },
        { label: 'Trigger', text: 'All 5 full = re-spin feature' }
      ]
    },
    thresholdSummary: '4 coins collected',
    thresholdDetail: 'Highest bet resets with 3 coins, lowest with 0. Check bet level requirements.',
    notes: 'Bet level affects starting coins.',
    hasCalculator: false
  },

  {
    id: 'lucky-coin-link-atlantica',
    name: 'Lucky Coin Link: Atlantica',
    shortName: 'Lucky Coin Atlantica',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2022,
    quickId: 'Same as Asian Dreaming',
    thresholdSummary: '4 coins collected',
    notes: 'Atlantis theme variant.',
    hasCalculator: false
  },

  {
    id: 'inca-empress',
    name: 'Inca Empress',
    shortName: 'Inca Empress',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Same as Lucky Empress with circular tiles',
    thresholdSummary: 'High multipliers (8x+) active or queued',
    notes: 'Inca theme variant with circular tiles instead of diamonds.',
    hasCalculator: false
  },

  {
    id: 'shrimpmania-4-link',
    name: 'Super Sally\'s Shrimpmania 4 Link',
    shortName: 'Shrimpmania 4',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Same as Lobstermania 4 Link',
    thresholdSummary: '1 coin on multiple reels',
    notes: 'Shrimp theme companion game.',
    hasCalculator: false
  },

  {
    id: 'lucky-pick-bumble-bee',
    name: 'Lucky Pick: Bumble Bee',
    shortName: 'Lucky Pick BB',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: '21 picks on board - reveal upgrades for free games - HIGHLY LUCRATIVE',
    visual: {
      location: 'Board with 21 covered picks above reels',
      appearance: [
        { label: 'Picks', text: 'Credits (immediate) or upgrades' },
        { label: 'Trigger', text: '3 bonus scatters = free games' },
        { label: 'Reset', text: 'After bonus, 3 non-credit picks revealed' }
      ]
    },
    thresholdSummary: 'Many upgrades already revealed',
    thresholdDetail: 'MPC says MOST LUCRATIVE AP game in years. Complex strategy - basic and advanced methods.',
    notes: 'Worth extensive study. Can get massive wins on small bets.',
    hasCalculator: false,
    warning: 'Complex - study MPC guide thoroughly'
  },

  {
    id: 'lucky-pick-cash-tree',
    name: 'Lucky Pick: Cash Tree',
    shortName: 'Lucky Pick CT',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Same as Bumble Bee - HIGHLY LUCRATIVE',
    thresholdSummary: 'Many upgrades already revealed',
    notes: 'Cash tree theme variant.',
    hasCalculator: false,
    warning: 'Complex - study MPC guide thoroughly'
  },

  {
    id: 'lucky-pick-leprechaun',
    name: 'Lucky Pick: Leprechaun',
    shortName: 'Lucky Pick Lep',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Same as Bumble Bee - HIGHLY LUCRATIVE',
    thresholdSummary: 'Many upgrades already revealed',
    notes: 'Leprechaun theme variant.',
    hasCalculator: false,
    warning: 'Complex - study MPC guide thoroughly'
  },

  {
    id: 'lunar-disc',
    name: 'Lunar Disc',
    shortName: 'Lunar Disc',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: '6 discs collected = bonus that turns random symbol wild',
    visual: {
      location: 'Disc counter display',
      appearance: [
        { label: 'Counter', text: 'Discs collected (0-6)' },
        { label: 'Bonus', text: 'Random symbol turns wild' }
      ]
    },
    thresholdSummary: '5 discs collected',
    thresholdDetail: '6 discs triggers bonus. Random symbol selected and all instances turn wild.',
    notes: 'Simple collection mechanic.',
    hasCalculator: false
  },

  {
    id: 'fortune-disc',
    name: 'Fortune Disc',
    shortName: 'Fortune Disc',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: 'Same as Lunar Disc',
    thresholdSummary: '5 discs collected',
    notes: 'Fortune theme variant.',
    hasCalculator: false
  },

  {
    id: 'pillars-of-cash-celestial',
    name: 'Pillars of Cash: Celestial Fortune',
    shortName: 'Pillars Celestial',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: 'Pillars above reels build credit prizes - gold dragon = chance to win pillar',
    visual: {
      location: 'Pillars above each reel with credit values',
      appearance: [
        { label: 'Pillars', text: 'Grow when coins land' },
        { label: 'Spin counter', text: '3 green dots per level' },
        { label: 'Gold dragon', text: 'Max height = chance to win' }
      ]
    },
    thresholdSummary: 'High value pillars near max height',
    thresholdDetail: 'Complex: pillars grow/shrink, values accumulate, gold dragon needed to win.',
    notes: 'Track both pillar heights and accumulated values.',
    hasCalculator: false
  },

  {
    id: 'pillars-of-cash-festive',
    name: 'Pillars of Cash: Festive Fortune',
    shortName: 'Pillars Festive',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: 'Same as Celestial Fortune',
    thresholdSummary: 'High value pillars near max height',
    notes: 'Festive theme variant.',
    hasCalculator: false
  },

  {
    id: 'pinwheel-prizes-cat-tiger',
    name: 'Pinwheel Prizes: Cat & Tiger',
    shortName: 'Pinwheel Cat',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: '5 pinwheels with 8 wedges each - scatter symbols build values and upgrade wedges',
    visual: {
      location: 'Five colored pinwheels above reels',
      appearance: [
        { label: 'Wedges', text: '8 per pinwheel, credits or golden (credits + spins)' },
        { label: 'Build', text: 'Scatters increase wedge values' },
        { label: 'Trigger', text: '3 same-color scatters = spin that wheel' }
      ]
    },
    thresholdSummary: 'High value wedges or multiple golden wedges',
    thresholdDetail: 'Track all 5 pinwheels. Golden wedges include free spins with credit prize.',
    notes: 'Complex tracking across 5 wheels.',
    hasCalculator: false
  },

  {
    id: 'pinwheel-prizes-majestic',
    name: 'Pinwheel Prizes: Majestic Oasis',
    shortName: 'Pinwheel Majestic',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: 'Same as Cat & Tiger',
    thresholdSummary: 'High value wedges or multiple golden wedges',
    notes: 'Oasis theme variant.',
    hasCalculator: false
  },

  {
    id: 'power-push-jin-gou',
    name: 'Power Push: Jin Gou',
    shortName: 'Power Push JG',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Coin pusher - 12 full stacks (300 coins) = guaranteed push bonus',
    visual: {
      location: 'Tray above reels with coin stacks',
      appearance: [
        { label: 'Stacks', text: '25 coins each, at back of tray' },
        { label: 'Prizes', text: 'Coins and prizes on tray' },
        { label: 'Push', text: 'MHB after 300 coins (12 stacks)' }
      ]
    },
    thresholdSummary: '10+ stacks full (250+ coins)',
    thresholdDetail: 'Push bonus guaranteed after 12 full stacks. Prizes on tray fall off and are awarded.',
    notes: 'Physical coin pusher mechanic.',
    hasCalculator: false
  },

  {
    id: 'power-push-long-de',
    name: 'Power Push: Long De Xiyue',
    shortName: 'Power Push LDX',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as Jin Gou',
    thresholdSummary: '10+ stacks full (250+ coins)',
    notes: 'Dragon theme variant.',
    hasCalculator: false
  },

  {
    id: 'prize-pool-cactus',
    name: 'Prize Pool: Cactus Cash',
    shortName: 'Prize Pool Cactus',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Blocks above reels with credit values - 4+ Prize Pool scatters = win corresponding blocks',
    visual: {
      location: 'Colored blocks above reels matching positions',
      appearance: [
        { label: 'Blocks', text: 'Credit values in matching positions' },
        { label: 'Trigger', text: '4+ Prize Pool scatters' },
        { label: 'Award', text: 'Win blocks matching scatter positions' }
      ]
    },
    thresholdSummary: 'High credit values in blocks',
    thresholdDetail: 'Similar to Block Bonanza. 4+ scatters needed (vs 3 for Block Bonanza).',
    notes: 'Track block values at all positions.',
    hasCalculator: false
  },

  {
    id: 'prize-pool-fierce-dragon',
    name: 'Prize Pool: Fierce Dragon',
    shortName: 'Prize Pool Dragon',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Same as Cactus Cash',
    thresholdSummary: 'High credit values in blocks',
    notes: 'Dragon theme variant.',
    hasCalculator: false
  },

  {
    id: 'raise-the-sails',
    name: 'Raise the Sails',
    shortName: 'Raise Sails',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: '3 progressive free games meters (bronze/silver/gold) - NOT MHB - VOLATILE',
    visual: {
      location: 'Three meters: bronze, silver, gold',
      appearance: [
        { label: 'Meters', text: 'Build with landing symbols' },
        { label: 'Trigger', text: 'Collect symbol in reel 5 + matching color' }
      ]
    },
    thresholdSummary: 'Very high meter values',
    thresholdDetail: 'WARNING: NOT must-hit-by. Collect symbol required in reel 5. Extremely volatile.',
    notes: 'MPC warns: extremely volatile game.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'san-xing-riches',
    name: 'San Xing Riches',
    shortName: 'San Xing',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Same as Raise the Sails - VOLATILE',
    thresholdSummary: 'Very high meter values',
    notes: 'Chinese theme variant. Same volatility warning.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'red-silk',
    name: 'Red Silk',
    shortName: 'Red Silk',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Coin holders above reels - 2 coins = wild reel for 2 spins',
    visual: {
      location: 'Coin holders above each reel',
      appearance: [
        { label: 'Holders', text: 'Fill with 2 coins' },
        { label: 'Wild', text: '2 spins when full' }
      ]
    },
    thresholdSummary: '1 coin on multiple reels',
    thresholdDetail: '2 coins = wild reel for 2 spins. Simple mechanic.',
    notes: 'Similar to Golden Egypt Grand but 2 coins instead of variable.',
    hasCalculator: false
  },

  {
    id: 'aztec-chief',
    name: 'Aztec Chief',
    shortName: 'Aztec Chief',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Same as Red Silk',
    thresholdSummary: '1 coin on multiple reels',
    notes: 'Aztec theme variant.',
    hasCalculator: false
  },

  {
    id: 'regal-link-lion',
    name: 'Regal Link: Lion',
    shortName: 'Regal Link Lion',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: '5 MHB free games meters with different wild counts',
    visual: {
      location: 'Five meters: amber, sapphire, amethyst, emerald, diamond',
      appearance: [
        { label: 'Amber', text: 'Resets 30, hits by 50' },
        { label: 'Sapphire', text: 'Resets 40, hits by 60' },
        { label: 'Amethyst', text: 'Resets 50, hits by 75' },
        { label: 'Emerald', text: 'Resets 75, hits by 100' },
        { label: 'Diamond', text: 'Resets 175, hits by 200' }
      ]
    },
    thresholdSummary: 'Any meter near ceiling',
    thresholdDetail: 'Also has silver wilds awarded randomly during base game.',
    notes: 'Multiple MHB opportunities per machine.',
    hasCalculator: false
  },

  {
    id: 'regal-link-raven',
    name: 'Regal Link: Raven',
    shortName: 'Regal Link Raven',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'Same as Lion variant',
    thresholdSummary: 'Any meter near ceiling',
    notes: 'Raven theme variant.',
    hasCalculator: false
  },

  {
    id: 'rich-little-piggies-hog-wild',
    name: 'Rich Little Piggies: Hog Wild',
    shortName: 'Piggies Hog Wild',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: '3 pigs build features - blue=spins, yellow=jackpots, red=wilds - NOT MHB',
    visual: {
      location: 'Three pigs above reels',
      appearance: [
        { label: 'Blue pig', text: 'Increasing free games' },
        { label: 'Yellow pig', text: 'Jackpot chances' },
        { label: 'Red pig', text: 'Guaranteed wilds (Hog Wild)' }
      ]
    },
    thresholdSummary: 'Fat pigs with built up features',
    thresholdDetail: 'Pigs get fatter as features build. NOT MHB - trigger is random.',
    notes: 'Similar to Bustin Money but with pigs. Red pig gives guaranteed wilds in this version.',
    hasCalculator: false
  },

  {
    id: 'rich-little-piggies-meal-ticket',
    name: 'Rich Little Piggies: Meal Ticket',
    shortName: 'Piggies Meal Ticket',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Hog Wild but red pig removes low symbols instead',
    thresholdSummary: 'Fat pigs with built up features',
    notes: 'Red pig removes lowest paying symbols instead of guaranteed wilds.',
    hasCalculator: false
  },

  {
    id: 'rich-little-sheep-on-the-lamb',
    name: 'Rich Little Sheep: On the Lamb',
    shortName: 'Sheep On Lamb',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: '3 sheep upgrade hold & spin - left=head start, middle=jackpots, right=rows',
    visual: {
      location: 'Three sheep above reels',
      appearance: [
        { label: 'Left sheep', text: 'Head start spins (before H&S begins)' },
        { label: 'Middle sheep', text: 'Jackpot value increases' },
        { label: 'Right sheep', text: 'Extra rows in H&S grid' }
      ]
    },
    thresholdSummary: 'Upgraded sheep features',
    thresholdDetail: 'Colored coins upgrade or trigger 1, 2, or all 3 sheep.',
    notes: 'Sheep version of Rich Little Piggies concept.',
    hasCalculator: false
  },

  {
    id: 'rich-little-sheep-wool-street',
    name: 'Rich Little Sheep: Wool Street Riches',
    shortName: 'Sheep Wool Street',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Same as On the Lamb',
    thresholdSummary: 'Upgraded sheep features',
    notes: 'Wall Street theme variant.',
    hasCalculator: false
  },

  {
    id: 'rising-phoenix-ap',
    name: 'Rising Phoenix',
    shortName: 'Rising Phoenix',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Phoenix = wild reel, fills flame meter, 4 flames = wheel spin multiplier',
    visual: {
      location: 'Wheel above reels with multipliers + flame meter inside',
      appearance: [
        { label: 'Phoenix', text: 'Wild reel, adds to flame meter' },
        { label: 'Flame meter', text: '4 spots to fill' },
        { label: 'Wheel', text: 'Spins when meter full + line hit' }
      ]
    },
    thresholdSummary: '3 flames + high multipliers on wheel',
    thresholdDetail: 'If no line hit when meter full, 2-3 wheel multipliers increase by 1x.',
    notes: 'Multipliers can build up significantly.',
    hasCalculator: false
  },

  {
    id: 'lucha-kitty',
    name: 'Lucha Kitty',
    shortName: 'Lucha Kitty',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Same as Sumo Kitty',
    thresholdSummary: 'Many connected gold frames',
    notes: 'Mexican wrestling theme variant.',
    hasCalculator: false
  },

  {
    id: 'super-bowl-jackpots',
    name: 'Super Bowl Jackpots',
    shortName: 'Super Bowl JP',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: '2-Minute Drill every 22-26 min - prizes collect, 4 consecutive = win all',
    visual: {
      location: 'Holding area with 4 spots above reels',
      appearance: [
        { label: '2-Min Drill', text: 'Bank-wide feature, 2 min countdown' },
        { label: 'Collection', text: 'Prizes accumulate in 4 spots' },
        { label: 'Win', text: '4 consecutive prize spins = win all' }
      ]
    },
    thresholdSummary: '3 spots filled after 2-Minute Drill ends',
    thresholdDetail: 'Prizes persist after feature ends! Check for partially filled boards.',
    notes: 'Time-based feature on entire bank. Scout after drill ends.',
    hasCalculator: false
  },

  {
    id: 'top-up-fortunes-flame',
    name: 'Top Up Fortunes: Flame',
    shortName: 'Top Up Flame',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Volcano symbols expand reels (3→6 high) - max height = Add Wild feature',
    visual: {
      location: 'Reels that expand in height + green dot counters',
      appearance: [
        { label: 'Expansion', text: '3 to 6 symbols tall' },
        { label: 'Counter', text: 'Green dots show spins at height' },
        { label: 'Max height', text: 'Volcano on max = Add Wild feature' }
      ]
    },
    thresholdSummary: 'Reels at 5-6 height with spins remaining',
    thresholdDetail: 'Taller reels = better line hits, more bonus chances, more H&S chances.',
    notes: 'Track both height and remaining spins per reel.',
    hasCalculator: false
  },

  {
    id: 'top-up-fortunes-ocean',
    name: 'Top Up Fortunes: Ocean',
    shortName: 'Top Up Ocean',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as Flame with trident instead of volcano',
    thresholdSummary: 'Reels at 5-6 height with spins remaining',
    notes: 'Ocean theme variant.',
    hasCalculator: false
  },

  {
    id: 'treasure-box-kingdom',
    name: 'Treasure Box: Kingdom',
    shortName: 'Treasure Box King',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Keys reduce coins needed to trigger respin bonus (6→1)',
    visual: {
      location: 'Key counter on middle reel',
      appearance: [
        { label: 'Keys', text: 'Reduce coins needed from 6' },
        { label: 'Trigger', text: 'Land required coins for respin bonus' },
        { label: 'Auto-trigger', text: 'Key symbol with 1 coin needed = auto bonus' }
      ]
    },
    thresholdSummary: '1-2 coins needed (4-5 keys collected)',
    thresholdDetail: 'Each key reduces requirement by 1. At 1 coin needed, key symbol auto-triggers.',
    notes: 'Simple key collection mechanic.',
    hasCalculator: false
  },

  {
    id: 'treasure-box-dynasty',
    name: 'Treasure Box: Dynasty',
    shortName: 'Treasure Box Dyn',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Same as Kingdom',
    thresholdSummary: '1-2 coins needed (4-5 keys collected)',
    notes: 'Dynasty theme variant.',
    hasCalculator: false
  },

  {
    id: 'treasure-shot-pirate',
    name: 'Treasure Shot: Pirate Ship',
    shortName: 'Treasure Shot Pirate',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'MHB wilds in bags (base game) and chests (free games) - similar to Regal Riches',
    visual: {
      location: 'Bags (base game) and chests (free games)',
      appearance: [
        { label: 'Blue/Red bags', text: 'Random trigger, MHB at 10' },
        { label: 'Blue chest', text: 'MHB at 100 (free games)' },
        { label: 'Green/Purple', text: 'MHB at 75 (free games)' }
      ]
    },
    thresholdSummary: 'Bags at 8-9 OR chests near ceiling',
    thresholdDetail: 'Multiple MHB wild features. Base game bags + free game chests.',
    notes: 'Similar to Regal Riches mechanics.',
    hasCalculator: false
  },

  {
    id: 'treasure-shot-robin-hood',
    name: 'Treasure Shot: Robin Hood',
    shortName: 'Treasure Shot Robin',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'Same as Pirate Ship',
    thresholdSummary: 'Bags at 8-9 OR chests near ceiling',
    notes: 'Robin Hood theme variant.',
    hasCalculator: false
  },

  {
    id: 'voodoo-jackpots',
    name: 'Voodoo Jackpots: Jack\'s Gold',
    shortName: 'Voodoo Jackpots',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: '2 progressive free games meters (green/purple) - voodoo doll randomly triggers',
    visual: {
      location: 'Two meters: green and purple (6-20 spins each)',
      appearance: [
        { label: 'Meters', text: 'Start at 6, cap at 20 free spins' },
        { label: 'Voodoo doll', text: 'Appears in center, awards prizes' },
        { label: 'Trigger', text: 'Random - voodoo doll can increase or trigger' }
      ]
    },
    thresholdSummary: 'Either meter at 15+ free spins',
    thresholdDetail: 'Voodoo doll appearance can build meters or trigger them.',
    notes: 'MPC has calculator.',
    hasCalculator: true
  },

  {
    id: 'wheel-of-fortune-4d-collectors',
    name: 'Wheel of Fortune 4D Collector\'s Edition',
    shortName: 'WoF 4D Collectors',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2021,
    quickId: 'Credit prizes above reels build - Collect symbol wins that prize',
    visual: {
      location: 'Credit prize displays above each reel',
      appearance: [
        { label: 'Prizes', text: 'Build when coins land' },
        { label: 'Collect', text: 'Collect symbol = win prize above' }
      ]
    },
    thresholdSummary: 'High credit values above reels',
    thresholdDetail: 'Collect symbol in reel = win that reel\'s accumulated prize.',
    notes: 'Different mechanic from regular 4D.',
    hasCalculator: false
  },

  {
    id: 'wizard-of-oz-yellow-brick',
    name: 'Wizard of Oz: Follow the Yellow Brick Road',
    shortName: 'WoO Yellow Brick',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: '3 progressive free games meters (silver/gold/emerald) - red shoes in reel 5 builds - NOT MHB',
    visual: {
      location: 'Three meters: silver, gold, emerald',
      appearance: [
        { label: 'Meters', text: 'Build with red shoes in reel 5' },
        { label: 'Trigger', text: 'Random - NOT guaranteed' }
      ]
    },
    thresholdSummary: 'Very high meter values',
    thresholdDetail: 'WARNING: NOT must-hit-by. Extremely volatile.',
    notes: 'Another high-volatility non-MHB game.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'cat-peak',
    name: 'Cat Peak',
    shortName: 'Cat Peak',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2021,
    quickId: 'Same as Wolf Peak',
    thresholdSummary: 'Expanding wilds with 2-3 spins remaining',
    notes: 'Cat theme variant.',
    hasCalculator: false
  },

  {
    id: 'fu-ren-wu',
    name: 'Fu Ren Wu',
    shortName: 'Fu Ren Wu',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2021,
    quickId: 'Same as Wolf Peak',
    thresholdSummary: 'Expanding wilds with 2-3 spins remaining',
    notes: 'Chinese theme variant.',
    hasCalculator: false
  },

  {
    id: 'zhao-cai-zhu-piggy',
    name: 'Zhao Cai Zhu: Gettin\' Piggy With It',
    shortName: 'ZCZ Piggy',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: 'Pig collection mechanic - MPC has calculator',
    thresholdSummary: 'Check MPC calculator',
    thresholdDetail: 'Complex mechanics - use MPC calculator for accurate plays.',
    notes: 'MPC has dedicated calculator for this game.',
    hasCalculator: true
  },

  {
    id: 'yo-ho-hog',
    name: 'Yo Ho Hog',
    shortName: 'Yo Ho Hog',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: 'Same as Zhao Cai Zhu - pirate pig theme',
    thresholdSummary: 'Check MPC calculator',
    notes: 'Pirate theme variant. Same calculator.',
    hasCalculator: true
  },

  // =============================================
  // ADDITIONAL POPULAR VEGAS FLOOR MACHINES
  // Based on comprehensive floor audit
  // =============================================

  // MORE IGT CLASSICS
  {
    id: 'black-widow',
    name: 'Black Widow',
    shortName: 'Black Widow',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Spider-themed with Super Stacks feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular IGT classic with stacked symbols and free spins.',
    hasCalculator: false
  },
  {
    id: 'triple-fortune-dragon',
    name: 'Triple Fortune Dragon',
    shortName: 'Triple Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Asian dragon theme with multipliers up to 27x',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Part of Fortune series. Features unlockable free spins with massive multipliers.',
    hasCalculator: false
  },
  {
    id: 'ocean-belles',
    name: 'Ocean Belles',
    shortName: 'Ocean Belles',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Mermaid theme with multiple bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Underwater theme with stacked wilds and free spins.',
    hasCalculator: false
  },
  {
    id: 'cash-eruption',
    name: 'Cash Eruption',
    shortName: 'Cash Eruption',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2020,
    quickId: 'Volcano theme with hold & spin feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular IGT link game with multiple themes.',
    hasCalculator: false
  },
  {
    id: 'mystical-unicorn',
    name: 'Mystical Unicorn',
    shortName: 'Mystical Unicorn',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2011,
    quickId: 'Fantasy unicorn theme with cascading reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'WMS classic with tumbling reels feature.',
    hasCalculator: false
  },
  {
    id: 'spartacus',
    name: 'Spartacus Gladiator of Rome',
    shortName: 'Spartacus',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Roman gladiator theme with colossal reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Features Colossal Reels - two linked reel sets.',
    hasCalculator: false
  },
  {
    id: 'jade-elephant',
    name: 'Jade Elephant',
    shortName: 'Jade Elephant',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Asian elephant theme with bonus wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular WMS game with multiple bonus features.',
    hasCalculator: false
  },
  {
    id: 'bier-haus',
    name: 'Bier Haus',
    shortName: 'Bier Haus',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'German beer festival theme with locked wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Oktoberfest theme. Up to 80 free spins with locking wilds.',
    hasCalculator: false
  },
  {
    id: 'pixies-of-the-forest',
    name: 'Pixies of the Forest',
    shortName: 'Pixies Forest',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2008,
    quickId: 'Enchanted forest theme with tumbling reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of the first tumbling reel slots. Still very popular.',
    hasCalculator: false
  },
  {
    id: 'double-happiness-panda',
    name: 'Double Happiness Panda',
    shortName: 'Double Happiness',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2018,
    quickId: 'Panda theme with double symbol feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Ainsworth Asian theme slot.',
    hasCalculator: false
  },
  {
    id: 'mustang-money',
    name: 'Mustang Money',
    shortName: 'Mustang Money',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2015,
    quickId: 'Wild horse theme with free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Ainsworth title with Western theme.',
    hasCalculator: false
  },
  {
    id: 'quick-hit-platinum',
    name: 'Quick Hit Platinum',
    shortName: 'Quick Hit Plat',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2016,
    quickId: 'Classic Quick Hit with platinum jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Part of legendary Quick Hit series.',
    hasCalculator: false
  },
  {
    id: 'quick-hit-pro',
    name: 'Quick Hit Pro',
    shortName: 'Quick Hit Pro',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2018,
    quickId: 'Enhanced Quick Hit with more features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Modern Quick Hit variant.',
    hasCalculator: false
  },
  {
    id: 'blazing-7s',
    name: 'Blazing 7s',
    shortName: 'Blazing 7s',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 1999,
    quickId: 'Classic 3-reel sevens slot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of the most iconic classic slots ever made.',
    hasCalculator: false
  },
  {
    id: 'titanic',
    name: 'Titanic',
    shortName: 'Titanic',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2015,
    quickId: 'Movie-themed with Heart of the Ocean feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed from James Cameron film. Multiple bonus features.',
    hasCalculator: false
  },

  // MORE ARISTOCRAT
  {
    id: 'miss-kitty',
    name: 'Miss Kitty',
    shortName: 'Miss Kitty',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2010,
    quickId: 'Cat theme with xtra reel power',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Aristocrat classic with medium volatility.',
    hasCalculator: false
  },
  {
    id: 'sun-and-moon',
    name: 'Sun and Moon',
    shortName: 'Sun and Moon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2011,
    quickId: 'Mayan theme with 50 free spins potential',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Aristocrat with massive free spin potential.',
    hasCalculator: false
  },
  {
    id: 'where-the-gold',
    name: 'Where\'s the Gold',
    shortName: 'Where\'s the Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2008,
    quickId: 'Gold mining theme with pick bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Iconic Australian pokie now popular worldwide.',
    hasCalculator: false
  },
  {
    id: 'more-chilli',
    name: 'More Chilli',
    shortName: 'More Chilli',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2012,
    quickId: 'Mexican theme with reel power',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sequel to More Hearts. Popular Mexican theme.',
    hasCalculator: false
  },
  {
    id: 'more-hearts',
    name: 'More Hearts',
    shortName: 'More Hearts',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2010,
    quickId: 'Romance theme with multiplying wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Aristocrat with heart-themed features.',
    hasCalculator: false
  },
  {
    id: '5-dragons',
    name: '5 Dragons',
    shortName: '5 Dragons',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2009,
    quickId: 'Asian dragon theme with reel power',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of Aristocrat\'s most popular Asian themes.',
    hasCalculator: false
  },
  {
    id: 'queen-of-the-nile',
    name: 'Queen of the Nile',
    shortName: 'Queen Nile',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 1997,
    quickId: 'Classic Egyptian theme - one of oldest Aristocrat slots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Legendary Aristocrat classic. Still on many floors.',
    hasCalculator: false
  },
  {
    id: 'pompeii',
    name: 'Pompeii',
    shortName: 'Pompeii',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2012,
    quickId: 'Ancient Rome theme with reel power',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Aristocrat with Roman theme.',
    hasCalculator: false
  },
  {
    id: 'dollar-storm',
    name: 'Dollar Storm',
    shortName: 'Dollar Storm',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Hold & Spin with multiple themes',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Similar to Lightning Link but with dollar theme.',
    hasCalculator: false
  },
  {
    id: 'lightning-dollar-link',
    name: 'Lightning Dollar Link',
    shortName: 'Lightning Dollar',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Lightning Link meets Dollar Storm',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines Lightning Link and Dollar Storm features.',
    hasCalculator: false
  },
  {
    id: 'tarzan-grand',
    name: 'Tarzan Grand',
    shortName: 'Tarzan Grand',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Tarzan license with progressive link',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed Tarzan theme on premium cabinet.',
    hasCalculator: false
  },

  // MORE KONAMI
  {
    id: 'golden-peach',
    name: 'Golden Peach',
    shortName: 'Golden Peach',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Asian theme with action stacked symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Konami with good bonus features.',
    hasCalculator: false
  },
  {
    id: 'radiant-witch',
    name: 'Radiant Witch',
    shortName: 'Radiant Witch',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Halloween theme with action stacked symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Konami Halloween theme.',
    hasCalculator: false
  },
  {
    id: 'solstice-celebration',
    name: 'Solstice Celebration',
    shortName: 'Solstice Celeb',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Nature theme with expanding wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Beautiful seasonal theme from Konami.',
    hasCalculator: false
  },

  // MORE LIGHT & WONDER / SCIENTIFIC GAMES
  {
    id: 'james-bond-007',
    name: 'James Bond 007',
    shortName: 'James Bond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2017,
    quickId: 'James Bond license with multiple movie themes',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed Bond slot with spy features.',
    hasCalculator: false
  },
  {
    id: 'epic-monopoly-ii',
    name: 'Epic Monopoly II',
    shortName: 'Epic Monopoly II',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2015,
    quickId: 'Monopoly colossal reels with board game bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Features Colossal Reels and board game feature.',
    hasCalculator: false
  },
  {
    id: 'goldfish',
    name: 'Goldfish',
    shortName: 'Goldfish',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2006,
    quickId: 'Aquarium theme with multiple bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic WMS with multiple fish-themed bonuses.',
    hasCalculator: false
  },
  {
    id: 'life-of-luxury',
    name: 'Life of Luxury',
    shortName: 'Life of Luxury',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2009,
    quickId: 'Luxury theme with progressive meters',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic WMS with car/boat/plane progressive.',
    hasCalculator: false
  },

  // MORE AGS
  {
    id: 'starry-night',
    name: 'Starry Night',
    shortName: 'Starry Night',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Van Gogh art theme with bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Art-themed AGS slot with beautiful graphics.',
    hasCalculator: false
  },
  {
    id: 'gold-dragon-red-dragon',
    name: 'Gold Dragon Red Dragon',
    shortName: 'Gold Red Dragon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2018,
    quickId: 'Dual dragon theme with split reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular AGS Asian theme.',
    hasCalculator: false
  },

  // EVERI
  {
    id: 'jackpot-inferno',
    name: 'Jackpot Inferno',
    shortName: 'JP Inferno',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2018,
    quickId: 'Fire theme with multiple jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Everi with progressive jackpots.',
    hasCalculator: false
  },
  {
    id: 'cash-burst',
    name: 'Cash Burst',
    shortName: 'Cash Burst',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Money theme with burst feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Everi hold & spin style game.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - DRAGON LINK
  // =============================================
  {
    id: 'dragon-link-panda-magic',
    name: 'Dragon Link: Panda Magic',
    shortName: 'DL Panda Magic',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Cute panda theme - most accessible Dragon Link variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lowest denomination Dragon Link ($0.01-$2.00). Dancing pandas, family-friendly theme.',
    hasCalculator: false
  },
  {
    id: 'dragon-link-silk-road',
    name: 'Dragon Link: Silk Road',
    shortName: 'DL Silk Road',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Trade route theme - expanding wilds in free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Silk Road trading theme. Key feature is expanding wild during bonus.',
    hasCalculator: false
  },
  {
    id: 'dragon-link-peace-long-life',
    name: 'Dragon Link: Peace & Long Life',
    shortName: 'DL Peace & Long',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Peaceful theme - wilds double wins in bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Every wild symbol doubles wins during bonus round.',
    hasCalculator: false
  },
  {
    id: 'dragon-link-peacock-princess',
    name: 'Dragon Link: Peacock Princess',
    shortName: 'DL Peacock',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'Peacock/princess theme with elegant visuals',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Colorful peacock and princess imagery. Standard Dragon Link mechanics.',
    hasCalculator: false
  },
  {
    id: 'dragon-link-eyes-of-fortune',
    name: 'Dragon Link: Eyes of Fortune',
    shortName: 'DL Eyes Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Fortune-themed with lucky symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Eyes of Fortune theme with standard Dragon Link Hold & Spin.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - LIGHTNING LINK
  // =============================================
  {
    id: 'lightning-link-tiki-fire',
    name: 'Lightning Link: Tiki Fire',
    shortName: 'LL Tiki Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Polynesian tiki theme - original 4 Lightning Link games',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of the original 4 Lightning Link titles. Tiki/Hawaiian theme.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-heart-throb',
    name: 'Lightning Link: Heart Throb',
    shortName: 'LL Heart Throb',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Romance/heart theme with pink aesthetics',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Heart and romance theme. Pink and red color scheme.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-eyes-of-fortune',
    name: 'Lightning Link: Eyes of Fortune',
    shortName: 'LL Eyes Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Fortune-themed with Asian symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Asian fortune theme with standard Lightning Link mechanics.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-dragons-riches',
    name: 'Lightning Link: Dragon\'s Riches',
    shortName: 'LL Dragon Riches',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Dragon theme similar to Dragon Link',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon theme on Lightning Link platform.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-wild-chuco',
    name: 'Lightning Link: Wild Chuco',
    shortName: 'LL Wild Chuco',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Wild West/Mexican theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wild West meets Mexican culture theme.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-best-bet',
    name: 'Lightning Link: Best Bet',
    shortName: 'LL Best Bet',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Horse racing theme - low symbols removed in free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Horse racing theme. Free spins remove low-paying symbols for better odds.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-magic-totem',
    name: 'Lightning Link: Magic Totem',
    shortName: 'LL Magic Totem',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Native American totem theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Totem pole theme with nature imagery.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-mine-mine-mine',
    name: 'Lightning Link: Mine Mine Mine',
    shortName: 'LL Mine Mine',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Mining/gold theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold mining theme with pickaxe and gold nugget symbols.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-raging-bull',
    name: 'Lightning Link: Raging Bull',
    shortName: 'LL Raging Bull',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Bull/rodeo Western theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Powerful bull imagery. Popular in Australia.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-fire-idol',
    name: 'Lightning Link: Fire Idol',
    shortName: 'LL Fire Idol',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Ancient fire temple theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire idol/temple theme with blazing imagery.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - BUFFALO
  // =============================================
  {
    id: 'buffalo-stampede',
    name: 'Buffalo Stampede',
    shortName: 'Buffalo Stampede',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2013,
    quickId: 'Early Buffalo sequel with stampede bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Part of Xtra Reel Power series. 1024 ways to win.',
    hasCalculator: false
  },
  {
    id: 'buffalo-deluxe',
    name: 'Buffalo Deluxe',
    shortName: 'Buffalo Deluxe',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'Enhanced Buffalo with more features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Upgraded version of original Buffalo.',
    hasCalculator: false
  },
  {
    id: 'buffalo-max',
    name: 'Buffalo Max',
    shortName: 'Buffalo Max',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Maximum multipliers version',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Higher multiplier potential than standard Buffalo.',
    hasCalculator: false
  },
  {
    id: 'buffalo-xtreme',
    name: 'Buffalo Xtreme',
    shortName: 'Buffalo Xtreme',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Extreme volatility Buffalo variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High volatility version with bigger swing potential.',
    hasCalculator: false
  },
  {
    id: 'buffalo-cash',
    name: 'Buffalo Cash',
    shortName: 'Buffalo Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Buffalo with standalone cash jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Standalone jackpots unlike linked Buffalo Link.',
    hasCalculator: false
  },
  {
    id: 'buffalo-gold-collection',
    name: 'Buffalo Gold Collection',
    shortName: 'Buffalo Gold Coll',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Collection of Buffalo Gold variants',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Multiple Buffalo Gold games in one cabinet.',
    hasCalculator: false
  },
  {
    id: 'buffalo-gold-max-power',
    name: 'Buffalo Gold Max Power',
    shortName: 'Buffalo Max Power',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'Up to 46,656 ways to win - newest Buffalo',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest Buffalo release. Dynamic reels 2-6 symbols per spin.',
    hasCalculator: false
  },
  {
    id: 'buffalo-friends',
    name: 'Buffalo & Friends',
    shortName: 'Buffalo & Friends',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2023,
    quickId: 'Buffalo with multiple animal friends',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Buffalo meets other popular Aristocrat animal themes.',
    hasCalculator: false
  },
  {
    id: 'buffalo-ultimate-stampede',
    name: 'Buffalo Ultimate Stampede',
    shortName: 'Buffalo Ultimate',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2023,
    quickId: 'Ultimate Buffalo experience with Hold & Spin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines classic Buffalo with Hold & Spin mechanics.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - 88 FORTUNES
  // =============================================
  {
    id: '88-fortunes-megaways',
    name: '88 Fortunes Megaways',
    shortName: '88 Fortunes Mega',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: '88 Fortunes with Megaways mechanic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Up to 117,649 ways to win with Megaways.',
    hasCalculator: false
  },
  {
    id: '88-fortunes-mystery-cash',
    name: '88 Fortunes Mystery Cash',
    shortName: '88 Mystery Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: '88 Fortunes with mystery cash feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mystery cash awards during gameplay.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - DANCING DRUMS
  // =============================================
  {
    id: 'dancing-drums-slot-festival',
    name: 'Dancing Drums Slot Festival',
    shortName: 'DD Slot Festival',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Festival edition with enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Festival celebration theme with upgraded bonuses.',
    hasCalculator: false
  },
  {
    id: 'dancing-drums-gold',
    name: 'Dancing Drums Gold',
    shortName: 'DD Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Gold-themed Dancing Drums',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden color scheme with enhanced jackpots.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - WHEEL OF FORTUNE
  // =============================================
  {
    id: 'wheel-of-fortune-triple-gold',
    name: 'Wheel of Fortune Triple Gold',
    shortName: 'WoF Triple Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Triple the gold multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold-themed WoF with triple multipliers.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-triple-extreme',
    name: 'Wheel of Fortune Triple Extreme Spin',
    shortName: 'WoF Triple Extreme',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Three mini wheels plus main wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Multiple wheel bonuses for extreme excitement.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-megaways',
    name: 'Wheel of Fortune Megaways',
    shortName: 'WoF Megaways',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'WoF with Megaways mechanic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic WoF meets Megaways for more ways to win.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-on-tour',
    name: 'Wheel of Fortune On Tour',
    shortName: 'WoF On Tour',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Travel-themed WoF across USA',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Road trip across America theme.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-hawaiian',
    name: 'Wheel of Fortune Hawaiian Getaway',
    shortName: 'WoF Hawaiian',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2018,
    quickId: 'Hawaiian vacation theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Tropical Hawaiian theme with beach imagery.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-gold-spin',
    name: 'Wheel of Fortune Gold Spin',
    shortName: 'WoF Gold Spin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2017,
    quickId: 'Gold-themed with special gold spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden wheel with enhanced spin features.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-wild-gems',
    name: 'Wheel of Fortune Wild Gems',
    shortName: 'WoF Wild Gems',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2020,
    quickId: 'Gem-themed with wild features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Colorful gem symbols with wild bonuses.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-double-diamond',
    name: 'Wheel of Fortune Double Diamond',
    shortName: 'WoF Double Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2015,
    quickId: 'Classic Double Diamond meets WoF',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines two IGT classics.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - LOCK IT LINK
  // =============================================
  {
    id: 'lock-it-link-cats-hats-bats',
    name: 'Lock It Link: Cats, Hats & More Bats',
    shortName: 'LIL Cats Hats Bats',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Halloween theme with cats and bats',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Spooky fun theme with Hold & Spin.',
    hasCalculator: false
  },
  {
    id: 'lock-it-link-eureka-reel-blast',
    name: 'Lock It Link: Eureka Reel Blast',
    shortName: 'LIL Eureka',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Mining/eureka theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold mining eureka moment theme.',
    hasCalculator: false
  },
  {
    id: 'lock-it-link-piggy-bankin',
    name: 'Lock It Link: Piggy Bankin\'',
    shortName: 'LIL Piggy Bankin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Piggy bank theme - same as standalone Piggy Bankin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lock It Link version of popular Piggy Bankin.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - IGT
  // =============================================
  {
    id: 'cats',
    name: 'Cats',
    shortName: 'Cats',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2006,
    quickId: 'Classic cat-themed with split symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of IGT\'s most enduring classics. Split symbols feature.',
    hasCalculator: false
  },
  {
    id: 'red-white-blue',
    name: 'Red White & Blue',
    shortName: 'Red White Blue',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1996,
    quickId: 'Classic 3-reel American theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Iconic patriotic 3-reel classic.',
    hasCalculator: false
  },
  {
    id: 'five-times-pay',
    name: 'Five Times Pay',
    shortName: '5x Pay',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1999,
    quickId: 'Classic 3-reel with 5x multiplier',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Simple classic with powerful multiplier.',
    hasCalculator: false
  },
  {
    id: 'ten-times-pay',
    name: 'Ten Times Pay',
    shortName: '10x Pay',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2001,
    quickId: 'Classic 3-reel with 10x multiplier',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Higher multiplier classic slot.',
    hasCalculator: false
  },
  {
    id: 'lucky-larry-lobstermania',
    name: 'Lucky Larry\'s Lobstermania',
    shortName: 'Lobstermania',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2006,
    quickId: 'Lobster fishing theme - iconic buoy bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pick lobster pots bonus. One of IGT\'s biggest hits.',
    hasCalculator: false
  },
  {
    id: 'lobstermania-2',
    name: 'Lobstermania 2',
    shortName: 'Lobstermania 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Sequel with more bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Lobstermania with additional bonuses.',
    hasCalculator: false
  },
  {
    id: 'lobstermania-3',
    name: 'Lobstermania 3',
    shortName: 'Lobstermania 3',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2018,
    quickId: 'Third installment with progressive',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest Lobstermania with progressive jackpot.',
    hasCalculator: false
  },
  {
    id: 'triple-diamond-free-games',
    name: 'Triple Diamond Free Games',
    shortName: 'Triple Diamond FG',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2015,
    quickId: 'Triple Diamond with free spins added',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Triple Diamond with bonus round.',
    hasCalculator: false
  },
  {
    id: 'wolf-run-2',
    name: 'Wolf Run 2',
    shortName: 'Wolf Run 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Wolf Run sequel with enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Modern sequel to classic Wolf Run.',
    hasCalculator: false
  },
  {
    id: 'ghostbusters-plus',
    name: 'Ghostbusters Plus',
    shortName: 'Ghostbusters Plus',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2018,
    quickId: 'Enhanced Ghostbusters with more features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Upgraded Ghostbusters with additional bonuses.',
    hasCalculator: false
  },
  {
    id: 'star-trek',
    name: 'Star Trek',
    shortName: 'Star Trek',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2013,
    quickId: 'Classic Star Trek license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Original series Star Trek theme.',
    hasCalculator: false
  },
  {
    id: 'family-guy',
    name: 'Family Guy',
    shortName: 'Family Guy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Animated TV show license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Family Guy animated theme with character bonuses.',
    hasCalculator: false
  },
  {
    id: 'hex-breaker-2',
    name: 'Hexbreaker 2',
    shortName: 'Hexbreaker 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2013,
    quickId: 'Hexagonal reel pattern',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Unique hexagonal reel layout.',
    hasCalculator: false
  },
  {
    id: 'triple-fortune-dragon-unleashed',
    name: 'Triple Fortune Dragon Unleashed',
    shortName: 'TFD Unleashed',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Enhanced Triple Fortune Dragon',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Upgraded version with unleashed dragons.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - ARISTOCRAT
  // =============================================
  {
    id: '50-dragons',
    name: '50 Dragons',
    shortName: '50 Dragons',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2009,
    quickId: '50 paylines with dragon pearls',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Aristocrat with dragon pearl collection.',
    hasCalculator: false
  },
  {
    id: '50-lions',
    name: '50 Lions',
    shortName: '50 Lions',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2006,
    quickId: 'African safari with 50 paylines',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'African theme. Part of Reel Power series.',
    hasCalculator: false
  },
  {
    id: 'timber-wolf',
    name: 'Timber Wolf',
    shortName: 'Timber Wolf',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2008,
    quickId: 'Wolf pack theme - 1024 ways',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular wolf theme similar to Buffalo.',
    hasCalculator: false
  },
  {
    id: 'timber-wolf-deluxe',
    name: 'Timber Wolf Deluxe',
    shortName: 'Timber Wolf DX',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'Enhanced Timber Wolf',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Deluxe version with improved features.',
    hasCalculator: false
  },
  {
    id: 'wicked-winnings',
    name: 'Wicked Winnings',
    shortName: 'Wicked Winnings',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2002,
    quickId: 'Classic with stacked wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of Aristocrat\'s first major video slot hits.',
    hasCalculator: false
  },
  {
    id: 'wicked-winnings-2',
    name: 'Wicked Winnings II',
    shortName: 'Wicked Winnings 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2007,
    quickId: 'Sequel with enhanced wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular sequel with stacked wild birds.',
    hasCalculator: false
  },
  {
    id: 'wicked-winnings-3',
    name: 'Wicked Winnings III',
    shortName: 'Wicked Winnings 3',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2012,
    quickId: 'Third installment of series',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest in the Wicked Winnings trilogy.',
    hasCalculator: false
  },
  {
    id: 'indian-dreaming',
    name: 'Indian Dreaming',
    shortName: 'Indian Dreaming',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 1999,
    quickId: 'Native American dream theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Aristocrat with dream catcher bonus.',
    hasCalculator: false
  },
  {
    id: 'geisha',
    name: 'Geisha',
    shortName: 'Geisha',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2005,
    quickId: 'Japanese geisha theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Elegant Japanese theme with geisha symbols.',
    hasCalculator: false
  },
  {
    id: 'big-red',
    name: 'Big Red',
    shortName: 'Big Red',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2004,
    quickId: 'Australian outback kangaroo theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Iconic Australian pokie with kangaroo.',
    hasCalculator: false
  },
  {
    id: 'choy-sun-doa',
    name: 'Choy Sun Doa',
    shortName: 'Choy Sun Doa',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2010,
    quickId: 'God of Wealth theme - 243 ways',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Asian prosperity theme with Choy Sun character.',
    hasCalculator: false
  },
  {
    id: 'lucky-88',
    name: 'Lucky 88',
    shortName: 'Lucky 88',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2011,
    quickId: 'Chinese luck theme with 88 multiplier',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lucky 8s theme with dice roll bonus.',
    hasCalculator: false
  },
  {
    id: 'wild-panda',
    name: 'Wild Panda',
    shortName: 'Wild Panda',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2011,
    quickId: 'Panda theme with 100 paylines',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cute panda imagery with Asian theme.',
    hasCalculator: false
  },
  {
    id: 'lightning-cash',
    name: 'Lightning Cash',
    shortName: 'Lightning Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Like Lightning Link but standalone jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Similar to Lightning Link but with standalone (not linked) jackpots.',
    hasCalculator: false
  },
  {
    id: 'dragon-cash',
    name: 'Dragon Cash',
    shortName: 'Dragon Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Like Dragon Link but standalone jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Higher min bet than Dragon Link, standalone jackpots.',
    hasCalculator: false
  },
  {
    id: 'cashman-fever',
    name: 'Cashman Fever',
    shortName: 'Cashman Fever',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Mr. Cashman character with fever bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Mr. Cashman character slot.',
    hasCalculator: false
  },
  {
    id: 'cash-express',
    name: 'Cash Express',
    shortName: 'Cash Express',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Train theme with cash bonuses',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Train-themed with express bonus feature.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - LIGHT & WONDER / WMS
  // =============================================
  {
    id: 'jungle-wild',
    name: 'Jungle Wild',
    shortName: 'Jungle Wild',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2010,
    quickId: 'Jungle theme with cascading reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular WMS jungle adventure theme.',
    hasCalculator: false
  },
  {
    id: 'jungle-wild-2',
    name: 'Jungle Wild II',
    shortName: 'Jungle Wild 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Sequel with enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced jungle adventure.',
    hasCalculator: false
  },
  {
    id: 'super-jackpot-party',
    name: 'Super Jackpot Party',
    shortName: 'Super JP Party',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2007,
    quickId: 'Party theme - iconic WMS bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic party bonus picking game.',
    hasCalculator: false
  },
  {
    id: 'alice-in-wonderland',
    name: 'Alice in Wonderland',
    shortName: 'Alice Wonderland',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2010,
    quickId: 'Lewis Carroll classic theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wonderland theme with multiple bonuses.',
    hasCalculator: false
  },
  {
    id: 'gems-gems-gems',
    name: 'Gems Gems Gems',
    shortName: 'Gems Gems Gems',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Colorful gem theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Vibrant gemstone theme.',
    hasCalculator: false
  },
  {
    id: 'black-knight',
    name: 'Black Knight',
    shortName: 'Black Knight',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Medieval knight theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dark medieval theme with knight warrior.',
    hasCalculator: false
  },
  {
    id: 'black-knight-2',
    name: 'Black Knight II',
    shortName: 'Black Knight 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2015,
    quickId: 'Sequel with colossal reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced with Colossal Reels feature.',
    hasCalculator: false
  },
  {
    id: 'bruce-lee',
    name: 'Bruce Lee',
    shortName: 'Bruce Lee',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Martial arts legend license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Bruce Lee license with martial arts theme.',
    hasCalculator: false
  },
  {
    id: 'kiss',
    name: 'KISS',
    shortName: 'KISS',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Rock band license with classic hits',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'KISS rock band license with music.',
    hasCalculator: false
  },
  {
    id: 'monopoly-once-around-deluxe',
    name: 'Monopoly Once Around Deluxe',
    shortName: 'Monopoly Once',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Monopoly board game bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Move around the Monopoly board for prizes.',
    hasCalculator: false
  },
  {
    id: 'monopoly-money',
    name: 'Monopoly Money',
    shortName: 'Monopoly Money',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Cash-themed Monopoly',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Monopoly with focus on cash prizes.',
    hasCalculator: false
  },
  {
    id: 'wizard-of-oz-emerald-city',
    name: 'Wizard of Oz: Emerald City',
    shortName: 'WoZ Emerald City',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Wizard of Oz in Emerald City',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Follow the yellow brick road to Emerald City.',
    hasCalculator: false
  },
  {
    id: 'wizard-of-oz-ruby-slippers',
    name: 'Wizard of Oz: Ruby Slippers',
    shortName: 'WoZ Ruby Slippers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Dorothy\'s ruby slippers theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic WMS Oz game with ruby slipper bonus.',
    hasCalculator: false
  },
  {
    id: 'ultimate-fire-link-rue-royale',
    name: 'Ultimate Fire Link: Rue Royale',
    shortName: 'UFL Rue Royale',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'French Quarter New Orleans theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newest Fire Link with New Orleans Mardi Gras theme.',
    hasCalculator: false
  },
  {
    id: 'ultimate-fire-link-brazil',
    name: 'Ultimate Fire Link: Brazil',
    shortName: 'UFL Brazil',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Brazilian carnival theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Colorful Brazil carnival theme.',
    hasCalculator: false
  },
  {
    id: 'ultimate-fire-link-north-shore',
    name: 'Ultimate Fire Link: North Shore',
    shortName: 'UFL North Shore',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Hawaiian surf theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Surfing and Hawaiian beach theme.',
    hasCalculator: false
  },
  {
    id: 'ultimate-fire-link-by-the-bay',
    name: 'Ultimate Fire Link: By The Bay',
    shortName: 'UFL By The Bay',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'San Francisco bay theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'San Francisco/California bay area theme.',
    hasCalculator: false
  },
  {
    id: 'james-bond-casino-royale',
    name: 'James Bond: Casino Royale',
    shortName: 'Bond Casino Royal',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Daniel Craig Bond movie theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Casino Royale movie theme.',
    hasCalculator: false
  },
  {
    id: 'james-bond-goldfinger',
    name: 'James Bond: Goldfinger',
    shortName: 'Bond Goldfinger',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Classic Connery Bond film',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Goldfinger classic Bond theme.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - KONAMI
  // =============================================
  {
    id: 'african-diamond',
    name: 'African Diamond',
    shortName: 'African Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2012,
    quickId: 'African safari with diamond jackpot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Safari theme with diamond collection.',
    hasCalculator: false
  },
  {
    id: 'full-moon-diamond',
    name: 'Full Moon Diamond',
    shortName: 'Full Moon Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2015,
    quickId: 'Werewolf/moon theme with diamonds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mystical moon theme.',
    hasCalculator: false
  },
  {
    id: 'dragon-treasure',
    name: 'Dragon Treasure',
    shortName: 'Dragon Treasure',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2014,
    quickId: 'Dragon hoarding treasure theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon guarding treasure.',
    hasCalculator: false
  },
  {
    id: 'roman-tribune',
    name: 'Roman Tribune',
    shortName: 'Roman Tribune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2016,
    quickId: 'Roman empire military theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Roman soldier and colosseum theme.',
    hasCalculator: false
  },
  {
    id: 'celestial-sun-riches',
    name: 'Celestial Sun Riches',
    shortName: 'Celestial Sun',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Celestial/space theme with sun',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cosmic sun and stars theme.',
    hasCalculator: false
  },
  {
    id: 'money-galaxy',
    name: 'Money Galaxy',
    shortName: 'Money Galaxy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: 'Space/galaxy money theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Galactic cash theme.',
    hasCalculator: false
  },
  {
    id: 'beat-the-field',
    name: 'Beat the Field',
    shortName: 'Beat the Field',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2020,
    quickId: 'Horse racing theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Horse racing competition theme.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - AGS
  // =============================================
  {
    id: 'golden-wins',
    name: 'Golden Wins',
    shortName: 'Golden Wins',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2018,
    quickId: 'Gold/wealth theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden prosperity theme.',
    hasCalculator: false
  },
  {
    id: 'colossal-diamonds',
    name: 'Colossal Diamonds',
    shortName: 'Colossal Diamonds',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Large diamond symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Big diamond symbols feature.',
    hasCalculator: false
  },
  {
    id: 'jade-wins',
    name: 'Jade Wins',
    shortName: 'Jade Wins',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Asian jade gemstone theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Jade and Asian fortune theme.',
    hasCalculator: false
  },
  {
    id: 'lucky-lightning',
    name: 'Lucky Lightning',
    shortName: 'Lucky Lightning',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Lightning strike luck theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lightning bolt brings luck.',
    hasCalculator: false
  },
  {
    id: 'royal-riches',
    name: 'Royal Riches',
    shortName: 'Royal Riches',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2018,
    quickId: 'Royal monarchy wealth theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Kings, queens, and royal treasures.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - EVERI
  // =============================================
  {
    id: 'cash-machine-wild',
    name: 'Cash Machine Wild',
    shortName: 'Cash Machine Wild',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2019,
    quickId: 'Cash Machine with wild features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Cash Machine with wilds.',
    hasCalculator: false
  },
  {
    id: 'triple-cash-wheel',
    name: 'Triple Cash Wheel',
    shortName: 'Triple Cash Wheel',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Three cash wheels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Triple wheel bonus feature.',
    hasCalculator: false
  },
  {
    id: 'jackpot-streams',
    name: 'Jackpot Streams',
    shortName: 'Jackpot Streams',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Streaming jackpot feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Multiple jackpot streams.',
    hasCalculator: false
  },
  {
    id: 'player-classic',
    name: 'Player Classic',
    shortName: 'Player Classic',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2018,
    quickId: 'Classic style slot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Traditional classic slot feel.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - AINSWORTH
  // =============================================
  {
    id: 'eagle-bucks',
    name: 'Eagle Bucks',
    shortName: 'Eagle Bucks',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2016,
    quickId: 'American eagle theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Patriotic eagle theme.',
    hasCalculator: false
  },
  {
    id: 'grand-dragon',
    name: 'Grand Dragon',
    shortName: 'Grand Dragon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2017,
    quickId: 'Asian dragon theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese dragon theme.',
    hasCalculator: false
  },
  {
    id: 'stormin-7s',
    name: 'Stormin\' 7s',
    shortName: 'Stormin 7s',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2015,
    quickId: 'Classic 7s with storm theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sevens with lightning storm effects.',
    hasCalculator: false
  },
  {
    id: 'shaman-spirit',
    name: 'Shaman\'s Spirit',
    shortName: 'Shaman Spirit',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2018,
    quickId: 'Native American shaman theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mystical shaman and spirit theme.',
    hasCalculator: false
  },
  {
    id: 'mammoth-power',
    name: 'Mammoth Power',
    shortName: 'Mammoth Power',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2019,
    quickId: 'Ice age mammoth theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Woolly mammoth prehistoric theme.',
    hasCalculator: false
  },

  // =============================================
  // LICENSED/BRANDED GAMES
  // =============================================
  {
    id: 'willy-wonka-dreamers',
    name: 'Willy Wonka: World of Wonka Dreamers',
    shortName: 'Wonka Dreamers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Wonka chocolate factory theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Expanded Wonka world theme.',
    hasCalculator: false
  },
  {
    id: 'grease',
    name: 'Grease',
    shortName: 'Grease',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2012,
    quickId: 'Musical movie license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Grease movie and musical theme.',
    hasCalculator: false
  },
  {
    id: 'elvira',
    name: 'Elvira: Mistress of the Dark',
    shortName: 'Elvira',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Horror hostess icon',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Elvira horror comedy theme.',
    hasCalculator: false
  },
  {
    id: 'anchorman',
    name: 'Anchorman',
    shortName: 'Anchorman',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Will Ferrell comedy movie',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ron Burgundy news team theme.',
    hasCalculator: false
  },
  {
    id: 'sharknado',
    name: 'Sharknado',
    shortName: 'Sharknado',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Cult disaster movie',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Campy shark tornado movie theme.',
    hasCalculator: false
  },
  {
    id: 'game-of-thrones-fire-ice',
    name: 'Game of Thrones: Fire & Ice',
    shortName: 'GoT Fire Ice',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'HBO series - fire and ice theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'House Targaryen vs Stark theme.',
    hasCalculator: false
  },
  {
    id: 'big-bang-theory-jackpot',
    name: 'Big Bang Theory: Jackpot',
    shortName: 'Big Bang Jackpot',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'TV sitcom nerds theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sheldon and gang with progressive.',
    hasCalculator: false
  },
  {
    id: 'rolling-stones',
    name: 'The Rolling Stones',
    shortName: 'Rolling Stones',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Rock legends music license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mick Jagger and classic Stones songs.',
    hasCalculator: false
  },
  {
    id: 'madonna',
    name: 'Madonna',
    shortName: 'Madonna',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'Pop queen music license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Madonna greatest hits theme.',
    hasCalculator: false
  },
  {
    id: 'mariah-carey',
    name: 'Mariah Carey',
    shortName: 'Mariah Carey',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2023,
    quickId: 'Pop diva music license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mariah Carey music themed.',
    hasCalculator: false
  },
  {
    id: 'ozzy-osbourne',
    name: 'Ozzy Osbourne',
    shortName: 'Ozzy Osbourne',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Prince of Darkness rock legend',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Black Sabbath frontman theme.',
    hasCalculator: false
  },
  {
    id: 'guns-n-roses',
    name: 'Guns N\' Roses',
    shortName: 'Guns N Roses',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2016,
    quickId: 'Rock band music license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Appetite for Destruction era theme.',
    hasCalculator: false
  },
  {
    id: 'motley-crue',
    name: 'Mötley Crüe',
    shortName: 'Motley Crue',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Hair metal band license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Kickstart My Heart and classics.',
    hasCalculator: false
  },
  {
    id: 'def-leppard',
    name: 'Def Leppard',
    shortName: 'Def Leppard',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: '80s rock band license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pour Some Sugar On Me theme.',
    hasCalculator: false
  },
  {
    id: 'beetlejuice',
    name: 'Beetlejuice',
    shortName: 'Beetlejuice',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Tim Burton movie ghost',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Beetlejuice Beetlejuice Beetlejuice!',
    hasCalculator: false
  },
  {
    id: 'mad-max-fury-road',
    name: 'Mad Max: Fury Road',
    shortName: 'Mad Max',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Post-apocalyptic action movie',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Witness me! War rig theme.',
    hasCalculator: false
  },
  {
    id: 'jurassic-world',
    name: 'Jurassic World',
    shortName: 'Jurassic World',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Dinosaur movie franchise',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'T-Rex and velociraptors theme.',
    hasCalculator: false
  },
  {
    id: 'jaws',
    name: 'Jaws',
    shortName: 'Jaws',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Spielberg shark classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'You\'re gonna need a bigger boat.',
    hasCalculator: false
  },
  {
    id: 'jumanji',
    name: 'Jumanji',
    shortName: 'Jumanji',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Adventure board game movie',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Jungle adventure board game theme.',
    hasCalculator: false
  },
  {
    id: 'back-to-the-future',
    name: 'Back to the Future',
    shortName: 'Back to Future',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2020,
    quickId: 'Time travel movie classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'DeLorean and 1.21 gigawatts!',
    hasCalculator: false
  },
  {
    id: 'baywatch',
    name: 'Baywatch',
    shortName: 'Baywatch',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2017,
    quickId: 'Beach lifeguard TV show',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Hasselhoff and slow-motion running.',
    hasCalculator: false
  },
  {
    id: 'breakfast-at-tiffanys',
    name: 'Breakfast at Tiffany\'s',
    shortName: 'Breakfast Tiffany',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Audrey Hepburn classic film',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Elegant Audrey Hepburn theme.',
    hasCalculator: false
  },
  {
    id: 'igt-top-dollar',
    name: 'Top Dollar',
    shortName: 'Top Dollar',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1998,
    quickId: 'Classic IGT with top dollar bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Iconic IGT classic still on many floors.',
    hasCalculator: false
  },
  {
    id: 'double-top-dollar',
    name: 'Double Top Dollar',
    shortName: 'Double Top Dollar',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2005,
    quickId: 'Enhanced Top Dollar with double feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Double the Top Dollar fun.',
    hasCalculator: false
  },
  {
    id: 'triple-top-dollar',
    name: 'Triple Top Dollar',
    shortName: 'Triple Top Dollar',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2010,
    quickId: 'Triple feature Top Dollar',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Triple version of classic.',
    hasCalculator: false
  },

  // =============================================
  // 2023-2025 RECENT RELEASES
  // =============================================
  {
    id: 'crazy-money-gold',
    name: 'Crazy Money Gold',
    shortName: 'Crazy Money Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Gold-themed Crazy Money',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest in Crazy Money series.',
    hasCalculator: false
  },
  {
    id: 'ocean-riches',
    name: 'Ocean Riches',
    shortName: 'Ocean Riches',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: 'Underwater treasure theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ocean floor riches theme.',
    hasCalculator: false
  },
  {
    id: 'fu-xuan',
    name: 'Fu Xuan',
    shortName: 'Fu Xuan',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: 'Asian fortune theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese prosperity slot.',
    hasCalculator: false
  },
  {
    id: 'coin-trio',
    name: 'Coin Trio',
    shortName: 'Coin Trio',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Triple coin collection feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Three-coin collection mechanic.',
    hasCalculator: false
  },
  {
    id: 'fortune-fury',
    name: 'Fortune Fury',
    shortName: 'Fortune Fury',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2023,
    quickId: 'Furious fortune theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High energy fortune theme.',
    hasCalculator: false
  },
  {
    id: 'fire-link-power-4',
    name: 'Fire Link Power 4',
    shortName: 'Fire Link Power 4',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Four-game Fire Link experience',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Four Fire Link games in one cabinet.',
    hasCalculator: false
  },
  {
    id: 'dragon-link-lightning',
    name: 'Dragon Link Lightning',
    shortName: 'DL Lightning',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'Dragon Link meets Lightning mechanics',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines Dragon Link with lightning effects.',
    hasCalculator: false
  },
  {
    id: 'dancing-drums-link',
    name: 'Dancing Drums Link',
    shortName: 'DD Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Dancing Drums with linked jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dancing Drums with linked progressive.',
    hasCalculator: false
  },

  // =============================================
  // ADDITIONAL POPULAR FLOOR MACHINES - BATCH 2
  // =============================================

  // MORE IGT CLASSICS & POPULAR
  {
    id: 'double-diamond-2000',
    name: 'Double Diamond 2000',
    shortName: 'DD 2000',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2000,
    quickId: 'Millennium version of classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Y2K version of the classic Double Diamond.',
    hasCalculator: false
  },
  {
    id: 'double-diamond-deluxe',
    name: 'Double Diamond Deluxe',
    shortName: 'DD Deluxe',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2008,
    quickId: 'Enhanced Double Diamond',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Upgraded classic with more features.',
    hasCalculator: false
  },
  {
    id: 'triple-diamond-haywire',
    name: 'Triple Diamond Haywire',
    shortName: 'TD Haywire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Triple Diamond with wild feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Haywire feature adds excitement.',
    hasCalculator: false
  },
  {
    id: 'sizzling-7s',
    name: 'Sizzling 7s',
    shortName: 'Sizzling 7s',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2005,
    quickId: 'Classic 7s with sizzle',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Hot 7s theme classic.',
    hasCalculator: false
  },
  {
    id: 'wild-cherry',
    name: 'Wild Cherry',
    shortName: 'Wild Cherry',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2003,
    quickId: 'Cherry-themed classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic fruit machine style.',
    hasCalculator: false
  },
  {
    id: 'mega-jackpots-cleopatra',
    name: 'MegaJackpots Cleopatra',
    shortName: 'MJ Cleopatra',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Cleopatra with progressive',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wide area progressive Cleopatra.',
    hasCalculator: false
  },
  {
    id: 'mega-jackpots-siberian-storm',
    name: 'MegaJackpots Siberian Storm',
    shortName: 'MJ Siberian Storm',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2017,
    quickId: 'Siberian Storm with progressive',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wide area progressive version.',
    hasCalculator: false
  },
  {
    id: 'cleopatra-gold',
    name: 'Cleopatra Gold',
    shortName: 'Cleopatra Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2018,
    quickId: 'Gold-themed Cleopatra',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden version of classic Cleopatra.',
    hasCalculator: false
  },
  {
    id: 'cleopatra-plus',
    name: 'Cleopatra Plus',
    shortName: 'Cleopatra Plus',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Enhanced Cleopatra with more features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Plus version with additional bonuses.',
    hasCalculator: false
  },
  {
    id: 'cash-spin',
    name: 'Cash Spin',
    shortName: 'Cash Spin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Wheel spin for cash',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Spin the wheel for cash prizes.',
    hasCalculator: false
  },
  {
    id: 'money-storm',
    name: 'Money Storm',
    shortName: 'Money Storm',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2015,
    quickId: 'Stormy money theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Weather meets money theme.',
    hasCalculator: false
  },
  {
    id: 'paradise-garden',
    name: 'Paradise Garden',
    shortName: 'Paradise Garden',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2020,
    quickId: 'Garden of Eden theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lush garden paradise setting.',
    hasCalculator: false
  },
  {
    id: 'invaders-attack-planet-moolah',
    name: 'Invaders Attack from the Planet Moolah',
    shortName: 'Invaders Attack',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2014,
    quickId: 'Alien cow invasion cascading reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Aliens meets Planet Moolah theme.',
    hasCalculator: false
  },
  {
    id: 'return-planet-moolah',
    name: 'Return to Planet Moolah',
    shortName: 'Return Moolah',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Sequel to Planet Moolah',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Return to the alien cow planet.',
    hasCalculator: false
  },
  {
    id: 'prowling-panther',
    name: 'Prowling Panther',
    shortName: 'Prowling Panther',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Jungle panther with multiway',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Jungle theme with prowling black panther.',
    hasCalculator: false
  },
  {
    id: 'fire-opals',
    name: 'Fire Opals',
    shortName: 'Fire Opals',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Gem-themed with fire opals',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Colorful gemstone theme.',
    hasCalculator: false
  },
  {
    id: 'secrets-of-the-forest',
    name: 'Secrets of the Forest',
    shortName: 'Secrets Forest',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2013,
    quickId: 'Mystical forest fairy theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enchanted forest with magical creatures.',
    hasCalculator: false
  },
  {
    id: 'treasures-of-troy',
    name: 'Treasures of Troy',
    shortName: 'Treasures Troy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2011,
    quickId: 'Ancient Troy theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Helen of Troy and Trojan horse theme.',
    hasCalculator: false
  },
  {
    id: 'sphinx-3d',
    name: 'Sphinx 3D',
    shortName: 'Sphinx 3D',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Egyptian sphinx in 3D',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: '3D graphics Egyptian theme.',
    hasCalculator: false
  },
  {
    id: 'cats-slot',
    name: 'CATS',
    shortName: 'CATS',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2009,
    quickId: 'Big cat wildlife theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lions, tigers, leopards theme.',
    hasCalculator: false
  },

  // MORE ARISTOCRAT
  {
    id: 'heart-of-vegas',
    name: 'Heart of Vegas',
    shortName: 'Heart of Vegas',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Vegas heart theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Love Vegas theme.',
    hasCalculator: false
  },
  {
    id: 'quick-fire-flaming-jackpots',
    name: 'Quick Fire Flaming Jackpots',
    shortName: 'Quick Fire Flaming',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Fast action fire jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Quick hitting fire jackpot theme.',
    hasCalculator: false
  },
  {
    id: 'moon-festival',
    name: 'Moon Festival',
    shortName: 'Moon Festival',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Chinese moon festival theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mid-Autumn Festival celebration theme.',
    hasCalculator: false
  },
  {
    id: 'spring-carnival',
    name: 'Spring Carnival',
    shortName: 'Spring Carnival',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2016,
    quickId: 'Australian horse racing carnival',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Melbourne Cup racing theme.',
    hasCalculator: false
  },
  {
    id: 'double-happiness',
    name: 'Double Happiness',
    shortName: 'Double Happiness',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2013,
    quickId: 'Chinese wedding/happiness theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese double happiness symbol.',
    hasCalculator: false
  },
  {
    id: 'golden-peony',
    name: 'Golden Peony',
    shortName: 'Golden Peony',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Asian golden flower theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden peony flower Asian theme.',
    hasCalculator: false
  },
  {
    id: 'mighty-cash-original',
    name: 'Mighty Cash',
    shortName: 'Mighty Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Cash collection theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Collect mighty cash prizes.',
    hasCalculator: false
  },
  {
    id: 'mighty-cash-ultra',
    name: 'Mighty Cash Ultra',
    shortName: 'Mighty Cash Ultra',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Enhanced Mighty Cash',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ultra version with bigger prizes.',
    hasCalculator: false
  },
  {
    id: 'wonder-4-boost',
    name: 'Wonder 4 Boost',
    shortName: 'Wonder 4 Boost',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Wonder 4 with boost feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Four games with boost multiplier.',
    hasCalculator: false
  },
  {
    id: 'wonder-4-tall-fortunes',
    name: 'Wonder 4 Tall Fortunes',
    shortName: 'W4 Tall Fortunes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Wonder 4 on tall cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Premium Wonder 4 on tall screen.',
    hasCalculator: false
  },
  {
    id: 'walking-dead-2',
    name: 'The Walking Dead 2',
    shortName: 'Walking Dead 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Walking Dead sequel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Second Walking Dead slot.',
    hasCalculator: false
  },
  {
    id: 'sons-of-anarchy-2015',
    name: 'Sons of Anarchy',
    shortName: 'Sons of Anarchy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Motorcycle gang TV show',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Biker gang SAMCRO theme.',
    hasCalculator: false
  },

  // MORE LIGHT & WONDER / WMS / BALLY
  {
    id: 'wizard-of-oz-tin-man',
    name: 'Wizard of Oz: Tin Man',
    shortName: 'WoZ Tin Man',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2016,
    quickId: 'Tin Man focused Oz game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Tin Man character focus.',
    hasCalculator: false
  },
  {
    id: 'wizard-of-oz-scarecrow',
    name: 'Wizard of Oz: Scarecrow',
    shortName: 'WoZ Scarecrow',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2016,
    quickId: 'Scarecrow focused Oz game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Scarecrow character focus.',
    hasCalculator: false
  },
  {
    id: 'quick-hit-black-gold',
    name: 'Quick Hit Black Gold',
    shortName: 'QH Black Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2014,
    quickId: 'Oil/gold themed Quick Hit',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Texas oil baron theme Quick Hit.',
    hasCalculator: false
  },
  {
    id: 'quick-hit-fever',
    name: 'Quick Hit Fever',
    shortName: 'QH Fever',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2017,
    quickId: 'Hot fever Quick Hit',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fever hot streak theme.',
    hasCalculator: false
  },
  {
    id: 'quick-hit-ultra-pays',
    name: 'Quick Hit Ultra Pays',
    shortName: 'QH Ultra Pays',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Ultra pays Quick Hit',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced pays version.',
    hasCalculator: false
  },
  {
    id: 'cash-wizard',
    name: 'Cash Wizard',
    shortName: 'Cash Wizard',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2011,
    quickId: 'Magical wizard cash theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wizard creates magical cash.',
    hasCalculator: false
  },
  {
    id: 'dragon-spin',
    name: 'Dragon Spin',
    shortName: 'Dragon Spin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2015,
    quickId: 'Spinning dragon reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon with spinning reel feature.',
    hasCalculator: false
  },
  {
    id: 'hot-hot-penny',
    name: 'Hot Hot Penny',
    shortName: 'Hot Hot Penny',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Hot penny slot theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Penny themed with hot features.',
    hasCalculator: false
  },
  {
    id: 'great-eagle',
    name: 'Great Eagle',
    shortName: 'Great Eagle',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Majestic eagle theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'American eagle patriotic theme.',
    hasCalculator: false
  },
  {
    id: 'great-eagle-returns',
    name: 'Great Eagle Returns',
    shortName: 'Great Eagle Ret',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2017,
    quickId: 'Eagle sequel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Eagle returns with more features.',
    hasCalculator: false
  },
  {
    id: 'robin-hood',
    name: 'Robin Hood',
    shortName: 'Robin Hood',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Steal from rich Robin Hood',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sherwood Forest adventure.',
    hasCalculator: false
  },
  {
    id: 'lord-of-the-rings',
    name: 'Lord of the Rings',
    shortName: 'LOTR',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Tolkien fantasy epic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Middle Earth adventure theme.',
    hasCalculator: false
  },
  {
    id: 'fortune-coin',
    name: 'Fortune Coin',
    shortName: 'Fortune Coin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Lucky coin fortune theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden fortune coin theme.',
    hasCalculator: false
  },
  {
    id: 'fortune-coin-boost',
    name: 'Fortune Coin Boost',
    shortName: 'Fortune Coin Boost',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Fortune Coin with boost',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Boosted version with multipliers.',
    hasCalculator: false
  },
  {
    id: 'cash-galaxy',
    name: 'Cash Galaxy',
    shortName: 'Cash Galaxy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Galactic cash theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Space themed cash game.',
    hasCalculator: false
  },
  {
    id: 'cash-connection-charming-lady',
    name: 'Cash Connection: Charming Lady',
    shortName: 'CC Charming Lady',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Lady luck cash connection',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Charming lady brings luck.',
    hasCalculator: false
  },
  {
    id: '777-jackpot',
    name: '777 Jackpot',
    shortName: '777 Jackpot',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Classic 777 with jackpot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Triple sevens jackpot theme.',
    hasCalculator: false
  },

  // MORE KONAMI
  {
    id: 'china-mystery',
    name: 'China Mystery',
    shortName: 'China Mystery',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2014,
    quickId: 'Chinese mystery theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mysterious Chinese symbols.',
    hasCalculator: false
  },
  {
    id: 'gypsy-fire',
    name: 'Gypsy Fire',
    shortName: 'Gypsy Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2013,
    quickId: 'Fortune teller theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fortune teller and crystal ball.',
    hasCalculator: false
  },
  {
    id: 'golden-wolves',
    name: 'Golden Wolves',
    shortName: 'Golden Wolves',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Wolf pack with gold theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden wolf pack hunt.',
    hasCalculator: false
  },
  {
    id: 'electrifying-riches',
    name: 'Electrifying Riches',
    shortName: 'Electrifying Rich',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Electric money theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Electric riches theme.',
    hasCalculator: false
  },
  {
    id: 'jackpot-streak',
    name: 'Jackpot Streak',
    shortName: 'Jackpot Streak',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2020,
    quickId: 'Jackpot winning streak',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Hot streak jackpot theme.',
    hasCalculator: false
  },
  {
    id: 'sparkling-nightlife',
    name: 'Sparkling Nightlife',
    shortName: 'Sparkling Night',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Vegas nightclub theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Glamorous nightclub setting.',
    hasCalculator: false
  },
  {
    id: 'great-moai',
    name: 'Great Moai',
    shortName: 'Great Moai',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2016,
    quickId: 'Easter Island statues',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Easter Island Moai heads theme.',
    hasCalculator: false
  },
  {
    id: 'scroll-of-wonder',
    name: 'Scroll of Wonder',
    shortName: 'Scroll Wonder',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: 'Magic scroll Asian theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ancient magic scroll theme.',
    hasCalculator: false
  },
  {
    id: 'riches-of-the-sea',
    name: 'Riches of the Sea',
    shortName: 'Riches of Sea',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Underwater treasure theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ocean floor riches.',
    hasCalculator: false
  },
  {
    id: 'lucky-o-leary',
    name: 'Lucky O\'Leary',
    shortName: 'Lucky O\'Leary',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Irish leprechaun luck',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lucky Irish leprechaun theme.',
    hasCalculator: false
  },

  // MORE AGS
  {
    id: 'xtreme-jackpots',
    name: 'Xtreme Jackpots',
    shortName: 'Xtreme Jackpots',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Extreme jackpot action',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High action jackpot theme.',
    hasCalculator: false
  },
  {
    id: 'fire-pearl',
    name: 'Fire Pearl',
    shortName: 'Fire Pearl',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Flaming pearl theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire and pearl dragon theme.',
    hasCalculator: false
  },
  {
    id: 'phoenix-rising',
    name: 'Phoenix Rising',
    shortName: 'Phoenix Rising',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2018,
    quickId: 'Rising phoenix bird',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Phoenix rebirth theme.',
    hasCalculator: false
  },
  {
    id: 'action-dragons',
    name: 'Action Dragons',
    shortName: 'Action Dragons',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Action-packed dragon theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High action dragon game.',
    hasCalculator: false
  },
  {
    id: 'money-charge-jackpots',
    name: 'Money Charge Jackpots',
    shortName: 'Money Charge JP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2022,
    quickId: 'Charging money jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Money charges up jackpots.',
    hasCalculator: false
  },
  {
    id: 'olympus-strikes',
    name: 'Olympus Strikes',
    shortName: 'Olympus Strikes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Greek god thunder',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Zeus thunderbolt theme.',
    hasCalculator: false
  },
  {
    id: 'orion-rising',
    name: 'Orion Rising',
    shortName: 'Orion Rising',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Constellation theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Orion constellation theme.',
    hasCalculator: false
  },

  // MORE EVERI
  {
    id: 'money-rain',
    name: 'Money Rain',
    shortName: 'Money Rain',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2019,
    quickId: 'Raining money theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Money falling from sky.',
    hasCalculator: false
  },
  {
    id: 'cash-cove',
    name: 'Cash Cove',
    shortName: 'Cash Cove',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Pirate treasure cove',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pirate treasure hideaway.',
    hasCalculator: false
  },
  {
    id: 'jewel-jackpots',
    name: 'Jewel Jackpots',
    shortName: 'Jewel Jackpots',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Gemstone jackpot theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Collect jewels for jackpots.',
    hasCalculator: false
  },
  {
    id: 'cashin-catch',
    name: 'Cashin\' Catch',
    shortName: 'Cashin Catch',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2022,
    quickId: 'Fishing for cash theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fishing game catches cash.',
    hasCalculator: false
  },
  {
    id: 'gold-standard-jackpots',
    name: 'Gold Standard Jackpots',
    shortName: 'Gold Standard JP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Gold bar jackpot theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold bars and jackpots.',
    hasCalculator: false
  },

  // MORE AINSWORTH
  {
    id: 'players-choice',
    name: 'Player\'s Choice',
    shortName: 'Players Choice',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2017,
    quickId: 'Multi-game player choice',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Choose between multiple games.',
    hasCalculator: false
  },
  {
    id: 'thunder-cash',
    name: 'Thunder Cash',
    shortName: 'Thunder Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2018,
    quickId: 'Thunder storm cash theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lightning and cash theme.',
    hasCalculator: false
  },
  {
    id: 'pac-man-wild-edition',
    name: 'PAC-MAN Wild Edition',
    shortName: 'PAC-MAN Wild',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2019,
    quickId: 'Classic arcade PAC-MAN',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Arcade game license.',
    hasCalculator: false
  },
  {
    id: 'sky-dancer',
    name: 'Sky Dancer',
    shortName: 'Sky Dancer',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2020,
    quickId: 'Dancer in the sky theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ethereal sky dancer.',
    hasCalculator: false
  },
  {
    id: 'golden-incas',
    name: 'Golden Incas',
    shortName: 'Golden Incas',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2019,
    quickId: 'Inca gold treasure',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Incan gold treasure hunt.',
    hasCalculator: false
  },

  // MORE INCREDIBLE TECHNOLOGIES
  {
    id: 'crazy-money-ii',
    name: 'Crazy Money II',
    shortName: 'Crazy Money II',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2017,
    quickId: 'Crazy Money sequel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Second Crazy Money game.',
    hasCalculator: false
  },
  {
    id: 'money-mania',
    name: 'Money Mania',
    shortName: 'Money Mania',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2020,
    quickId: 'Money madness theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Money-crazy theme.',
    hasCalculator: false
  },
  {
    id: 'triple-cash-jackpots',
    name: 'Triple Cash Jackpots',
    shortName: 'Triple Cash JP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2021,
    quickId: 'Three cash jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Triple jackpot chances.',
    hasCalculator: false
  },
  {
    id: 'jackpot-explosion-it',
    name: 'Jackpot Explosion',
    shortName: 'JP Explosion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Explosive jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Explosive jackpot feature.',
    hasCalculator: false
  },

  // ADDITIONAL LICENSED GAMES
  {
    id: 'the-mask',
    name: 'The Mask',
    shortName: 'The Mask',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2017,
    quickId: 'Jim Carrey comedy movie',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sssmokin! The Mask movie theme.',
    hasCalculator: false
  },
  {
    id: 'ace-ventura',
    name: 'Ace Ventura: Pet Detective',
    shortName: 'Ace Ventura',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Jim Carrey pet detective',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Alrighty then! Movie theme.',
    hasCalculator: false
  },
  {
    id: 'ferris-bueller',
    name: 'Ferris Bueller\'s Day Off',
    shortName: 'Ferris Bueller',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2015,
    quickId: '80s teen comedy classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Life moves pretty fast movie.',
    hasCalculator: false
  },
  {
    id: 'tmnt',
    name: 'Teenage Mutant Ninja Turtles',
    shortName: 'TMNT',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Cowabunga! Pizza time',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Turtle power!',
    hasCalculator: false
  },
  {
    id: 'nightmare-on-elm-street',
    name: 'A Nightmare on Elm Street',
    shortName: 'Elm Street',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Freddy Krueger horror',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Whatever you do, don\'t fall asleep.',
    hasCalculator: false
  },
  {
    id: 'braveheart',
    name: 'Braveheart',
    shortName: 'Braveheart',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Mel Gibson Scottish epic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'FREEDOM! Scottish battle theme.',
    hasCalculator: false
  },
  {
    id: 'planet-of-the-apes',
    name: 'Planet of the Apes',
    shortName: 'Planet Apes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Apes take over the world',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Caesar and apes theme.',
    hasCalculator: false
  },
  {
    id: 'godzilla',
    name: 'Godzilla',
    shortName: 'Godzilla',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'King of the monsters',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Giant monster destruction theme.',
    hasCalculator: false
  },
  {
    id: 'transformers',
    name: 'Transformers: Battle for Cybertron',
    shortName: 'Transformers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2017,
    quickId: 'Robots in disguise',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Autobots vs Decepticons.',
    hasCalculator: false
  },
  {
    id: 'cluedo',
    name: 'Cluedo',
    shortName: 'Cluedo',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Classic board game mystery',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Who did it mystery theme.',
    hasCalculator: false
  },
  {
    id: 'simpsons',
    name: 'The Simpsons',
    shortName: 'Simpsons',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'D\'oh! Animated family',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Homer and Springfield gang.',
    hasCalculator: false
  },
  {
    id: 'south-park',
    name: 'South Park',
    shortName: 'South Park',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Adult cartoon humor',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'They killed Kenny! theme.',
    hasCalculator: false
  },
  {
    id: 'austin-powers',
    name: 'Austin Powers',
    shortName: 'Austin Powers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Yeah baby! Spy spoof',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'International man of mystery.',
    hasCalculator: false
  },
  {
    id: 'zorro',
    name: 'Zorro',
    shortName: 'Zorro',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2010,
    quickId: 'Masked hero swashbuckler',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Z marks the spot!',
    hasCalculator: false
  },
  {
    id: 'golden-jungle',
    name: 'Golden Jungle',
    shortName: 'Golden Jungle',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Jungle with golden treasure',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden treasures in jungle.',
    hasCalculator: false
  },
  {
    id: 'african-treasure',
    name: 'African Treasure',
    shortName: 'African Treasure',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2018,
    quickId: 'African safari treasure',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Safari adventure treasures.',
    hasCalculator: false
  },
  {
    id: 'jaguar-moon',
    name: 'Jaguar Moon',
    shortName: 'Jaguar Moon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2019,
    quickId: 'Moonlit jaguar theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Jungle jaguar under moonlight.',
    hasCalculator: false
  },
  {
    id: 'penguin-pays',
    name: 'Penguin Pays',
    shortName: 'Penguin Pays',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'Arctic penguin theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cute penguins on ice.',
    hasCalculator: false
  },
  {
    id: 'panda-king',
    name: 'Panda King',
    shortName: 'Panda King',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2016,
    quickId: 'Panda royalty theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'King of the pandas.',
    hasCalculator: false
  },
  {
    id: 'lucky-honeycomb',
    name: 'Lucky Honeycomb',
    shortName: 'Lucky Honeycomb',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Bee and honeycomb theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sweet honeycomb prizes.',
    hasCalculator: false
  },
  {
    id: 'mystic-pearls',
    name: 'Mystic Pearls',
    shortName: 'Mystic Pearls',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Mystical ocean pearls',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Underwater pearl magic.',
    hasCalculator: false
  },
  {
    id: 'outback-jack',
    name: 'Outback Jack',
    shortName: 'Outback Jack',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2007,
    quickId: 'Australian outback explorer',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Australian adventure theme.',
    hasCalculator: false
  },
  {
    id: 'sahara-gold-ll',
    name: 'Sahara Gold',
    shortName: 'Sahara Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Desert gold treasure theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lightning Link desert variant.',
    hasCalculator: false
  },

  // =============================================
  // MISSING 2023-2025 MAJOR RELEASES
  // =============================================

  // ARISTOCRAT 2024-2025 NEW RELEASES
  {
    id: 'hyperlink',
    name: 'Hyperlink',
    shortName: 'Hyperlink',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Follow-up to Buffalo Ultimate Stampede - multi-denom',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Three multi-denom game choice. Premium lease game.',
    hasCalculator: false
  },
  {
    id: 'touchdown-link',
    name: 'Touchdown Link',
    shortName: 'Touchdown Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'NFL series - touchdown scoring theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'NFL license. Mars X Flex cabinet.',
    hasCalculator: false
  },
  {
    id: 'touchdown-trio',
    name: 'Touchdown Trio',
    shortName: 'Touchdown Trio',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'NFL series - Marquee cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'NFL triple game experience.',
    hasCalculator: false
  },
  {
    id: 'triple-score',
    name: 'Triple Score',
    shortName: 'Triple Score',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'NFL series - Mars Portrait cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'NFL football scoring theme.',
    hasCalculator: false
  },
  {
    id: 'overtime-cash',
    name: 'Overtime Cash',
    shortName: 'Overtime Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'NFL high-denom 3-reel with Interception feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'NFL license. Marquis cabinet. Extra credit activates Interception Feature.',
    hasCalculator: false
  },
  {
    id: 'buffalo-gold-cash-collection',
    name: 'Buffalo Gold Cash Collection',
    shortName: 'Buffalo Gold CC',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'Buffalo Gold on Baron cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Buffalo Gold on new Baron dual-screen cabinet.',
    hasCalculator: false
  },
  {
    id: 'ju-cai-jin-gui',
    name: 'Ju Cai Jin Gui',
    shortName: 'Ju Cai Jin Gui',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'Asian prosperity theme - Baron cabinet launch',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese fortune theme. Baron cabinet debut.',
    hasCalculator: false
  },
  {
    id: 'phantom-2025',
    name: 'Phantom',
    shortName: 'Phantom 2025',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Phantom of the Opera - new 2025 version',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: '16 years after 2009 version. G2E 2024 and ICE 2025 debut.',
    hasCalculator: false
  },
  {
    id: 'whisker-wheels',
    name: 'Whisker Wheels',
    shortName: 'Whisker Wheels',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'Cat-themed wheel bonus game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular cat theme with wheel feature.',
    hasCalculator: false
  },
  {
    id: 'buffalo-strike',
    name: 'Buffalo Strike!',
    shortName: 'Buffalo Strike',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2023,
    quickId: 'Buffalo on MarsX Flex cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Buffalo theme on 55-inch top monitor MarsX Flex.',
    hasCalculator: false
  },
  {
    id: 'fu-dai-lian-lian-turtle',
    name: 'Fu Dai Lian Lian Turtle',
    shortName: 'FDLL Turtle',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2023,
    quickId: 'Fu Dai Lian Lian turtle theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Turtle-themed Fu Dai Lian Lian variant.',
    hasCalculator: false
  },

  // IGT 2024-2025 NEW RELEASES
  {
    id: 'wheel-of-fortune-cash-link-big-money',
    name: 'Wheel of Fortune Cash Link Big Money',
    shortName: 'WoF CL Big Money',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: 'WoF Trio cabinet - physical wheel across 3 cabinets',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2024 debut. Large physical wheel spans three cabinets.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-cash-link-reels-dd',
    name: 'Wheel of Fortune Cash Link Reels Double Diamond',
    shortName: 'WoF CL DD',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: 'First stepper Cash Link - DiamondRS Wheel cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines WoF, Cash Link, and Double Diamond. Ultra Link series.',
    hasCalculator: false
  },
  {
    id: 'pirate-link-drakes-treasure',
    name: 'Pirate Link: Drake\'s Treasure',
    shortName: 'Pirate Link Drake',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: 'Pirate adventure with treasure hunting',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pirate theme with progressive jackpots.',
    hasCalculator: false
  },
  {
    id: 'mystery-of-the-lamp',
    name: 'Mystery of the Lamp',
    shortName: 'Mystery Lamp',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: 'Magical lamp theme - expanding wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Aladdin-style magical theme.',
    hasCalculator: false
  },
  {
    id: 'red-hot-tamales-pinata',
    name: 'Red Hot Tamales! Piñata Bash',
    shortName: 'Red Hot Pinata',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: 'Mexican theme - interactive piñata bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Bash the piñata for credits and jackpots.',
    hasCalculator: false
  },
  {
    id: 'double-diamond-3x4x5',
    name: 'Double Diamond 3x4x5',
    shortName: 'DD 3x4x5',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Double Diamond with up to 20x multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced multiplier version of classic.',
    hasCalculator: false
  },
  {
    id: 'pyramidion',
    name: 'Pyramidion',
    shortName: 'Pyramidion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Egyptian pyramid theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Modern Egyptian theme slot.',
    hasCalculator: false
  },
  {
    id: 'pixies-of-the-forest-2',
    name: 'Pixies of the Forest II',
    shortName: 'Pixies 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Sequel to enchanted forest classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pixies return with enhanced features.',
    hasCalculator: false
  },

  // LIGHT & WONDER 2024-2025 NEW RELEASES
  {
    id: 'quick-hit-link',
    name: 'Quick Hit Link',
    shortName: 'Quick Hit Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Quick Hit with linked jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Quick Hit with progressive link.',
    hasCalculator: false
  },
  {
    id: 'shenlong-unleashed',
    name: 'Shenlong Unleashed',
    shortName: 'Shenlong',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Chinese dragon unleashed theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon theme with unleashed feature.',
    hasCalculator: false
  },
  {
    id: 'cash-falls-pirates-trove',
    name: 'Cash Falls: Pirate\'s Trove',
    shortName: 'CF Pirates Trove',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Pirate theme - 21,025x max win',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Highest max win in Cash Falls series.',
    hasCalculator: false
  },
  {
    id: 'cash-falls-island-bounty',
    name: 'Cash Falls: Island Bounty',
    shortName: 'CF Island Bounty',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Tropical island theme - 21,025x max',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Island treasure hunting theme.',
    hasCalculator: false
  },
  {
    id: 'add-em-up-gold',
    name: 'Add Em Up Gold',
    shortName: 'Add Em Up Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Add up symbols for prizes - gold theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest Cash Falls series game.',
    hasCalculator: false
  },
  {
    id: 'ufl-cash-falls-glacier-gold',
    name: 'Ultimate Fire Link Cash Falls: Glacier Gold',
    shortName: 'UFL CF Glacier',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Fire Link meets Cash Falls - ice theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines Fire Link and Cash Falls mechanics.',
    hasCalculator: false
  },

  // KONAMI 2024-2025 NEW RELEASES
  {
    id: 'money-in-bank-gold',
    name: 'Money in the Bank Gold',
    shortName: 'MITB Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2024,
    quickId: 'Gold-themed Money in the Bank',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Premium version of Money in the Bank series.',
    hasCalculator: false
  },
  {
    id: 'solstice-celebration-link',
    name: 'Solstice Celebration Link',
    shortName: 'Solstice Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2024,
    quickId: 'Nature solstice theme with linked jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Solstice theme on Solstice 49C cabinet.',
    hasCalculator: false
  },
  {
    id: 'all-aboard-dynamite-dash',
    name: 'All Aboard Dynamite Dash',
    shortName: 'All Aboard DD',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2024,
    quickId: 'Train theme with dynamite feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'All Aboard series with explosive feature.',
    hasCalculator: false
  },
  {
    id: 'fu-gui-rong-hua',
    name: 'Fu Gui Rong Hua',
    shortName: 'Fu Gui Rong Hua',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2024,
    quickId: 'Chinese wealth and prosperity theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Asian fortune theme.',
    hasCalculator: false
  },

  // AGS 2024-2025 NEW RELEASES
  {
    id: 'rakin-bacon-deluxe',
    name: 'Rakin\' Bacon Deluxe',
    shortName: 'Rakin Bacon DX',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2024,
    quickId: 'Enhanced Rakin Bacon with more features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Deluxe version with upgraded bonuses.',
    hasCalculator: false
  },
  {
    id: 'super-wheel-blast',
    name: 'Super Wheel Blast',
    shortName: 'Super Wheel Blast',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2024,
    quickId: 'Wheel bonus with explosive wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Powerful wheel bonus feature.',
    hasCalculator: false
  },
  {
    id: 'golden-wins-infinity',
    name: 'Golden Wins Infinity',
    shortName: 'Golden Wins Inf',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2024,
    quickId: 'Infinite golden wins potential',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Expanded Golden Wins with infinite feature.',
    hasCalculator: false
  },

  // EVERI 2024-2025 NEW RELEASES (merged with IGT)
  {
    id: 'player-epic',
    name: 'Player Epic',
    shortName: 'Player Epic',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2024,
    quickId: 'Epic player wins theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Premium Everi release.',
    hasCalculator: false
  },
  {
    id: 'smokin-hot-jackpots',
    name: 'Smokin\' Hot Jackpots',
    shortName: 'Smokin Hot JP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2024,
    quickId: 'Hot smoking jackpot theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire and smoke jackpot theme.',
    hasCalculator: false
  },
  {
    id: 'cash-machine-link',
    name: 'Cash Machine Link',
    shortName: 'Cash Machine Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2024,
    quickId: 'Cash Machine with linked jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cash Machine series with progressive link.',
    hasCalculator: false
  },

  // =============================================
  // CONFIRMED VEGAS FLOOR GAMES - MISSING ADDITIONS
  // =============================================

  // COIN COMBO SERIES (Popular Hold & Spin)
  {
    id: 'coin-combo-marvelous-mouse',
    name: 'Coin Combo: Marvelous Mouse',
    shortName: 'CC Marvelous Mouse',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Mouse theme - coin collection Hold & Spin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Coin Combo series. Hold & Spin mechanic.',
    hasCalculator: false
  },
  {
    id: 'coin-combo-sahara-gold',
    name: 'Coin Combo: Sahara Gold',
    shortName: 'CC Sahara Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Desert theme Coin Combo',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Desert treasure Hold & Spin.',
    hasCalculator: false
  },
  {
    id: 'coin-combo-copa-cash',
    name: 'Coin Combo: Copa Cash',
    shortName: 'CC Copa Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Latin theme Coin Combo',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latin celebration theme.',
    hasCalculator: false
  },

  // PINBALL (High-limit classic)
  {
    id: 'pinball',
    name: 'Pinball',
    shortName: 'Pinball',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2004,
    quickId: 'High-limit classic with pinball bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High-limit favorite. Pinball machine bonus game.',
    hasCalculator: false
  },
  {
    id: 'pinball-double-gold',
    name: 'Pinball Double Gold',
    shortName: 'Pinball Dbl Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2010,
    quickId: 'Gold-themed Pinball variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Pinball with gold theme.',
    hasCalculator: false
  },

  // MORE ALL ABOARD VARIANTS (Confirmed popular)
  {
    id: 'all-aboard-piggy-pennies',
    name: 'All Aboard: Piggy Pennies',
    shortName: 'All Aboard Piggy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: 'Pig theme train game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Piggy bank meets train theme.',
    hasCalculator: false
  },
  {
    id: 'all-aboard-gold-express',
    name: 'All Aboard: Gold Express',
    shortName: 'All Aboard Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Gold train express theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden train express.',
    hasCalculator: false
  },

  // MORE DOLLAR STORM (Confirmed on floors)
  {
    id: 'dollar-storm-ninja-moon',
    name: 'Dollar Storm: Ninja Moon',
    shortName: 'DS Ninja Moon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Ninja theme Dollar Storm',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ninja theme with Dollar Storm mechanics.',
    hasCalculator: false
  },
  {
    id: 'dollar-storm-caribbean-gold',
    name: 'Dollar Storm: Caribbean Gold',
    shortName: 'DS Caribbean',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Caribbean pirate Dollar Storm',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Caribbean pirate treasure theme.',
    hasCalculator: false
  },
  {
    id: 'dollar-storm-egyptian-jewels',
    name: 'Dollar Storm: Egyptian Jewels',
    shortName: 'DS Egyptian',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Egyptian theme Dollar Storm',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Egyptian jewels theme.',
    hasCalculator: false
  },

  // MORE CASH EXPRESS (Confirmed Hold & Spin family)
  {
    id: 'cash-express-luxury-line',
    name: 'Cash Express: Luxury Line',
    shortName: 'CE Luxury Line',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Luxury train theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Premium luxury train experience.',
    hasCalculator: false
  },
  {
    id: 'cash-express-gold-class',
    name: 'Cash Express: Gold Class',
    shortName: 'CE Gold Class',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'First class gold train',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold class train experience.',
    hasCalculator: false
  },

  // JIN JI BAO XI (Mentioned as Dragon Link alternative)
  {
    id: 'jin-ji-bao-xi',
    name: 'Jin Ji Bao Xi',
    shortName: 'Jin Ji Bao Xi',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Golden rooster prosperity - Dragon Link competitor',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Similar to Dragon Link. Chinese prosperity theme.',
    hasCalculator: false
  },
  {
    id: 'jin-ji-bao-xi-rising',
    name: 'Jin Ji Bao Xi: Rising Fortunes',
    shortName: 'JJBX Rising',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Rising fortunes variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Jin Ji Bao Xi.',
    hasCalculator: false
  },

  // MORE PLANET MOOLAH (Confirmed penny slot favorite)
  {
    id: 'planet-moolah',
    name: 'Planet Moolah',
    shortName: 'Planet Moolah',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2012,
    quickId: 'Alien cow invasion - cascading reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Iconic cascading reels with alien cows.',
    hasCalculator: false
  },

  // MORE MONOPOLY (Confirmed penny slot favorite)
  {
    id: 'monopoly-big-money-reel',
    name: 'Monopoly Big Money Reel',
    shortName: 'Monopoly Big Money',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Big wheel Monopoly',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Large wheel bonus Monopoly.',
    hasCalculator: false
  },
  {
    id: 'monopoly-hot-shot',
    name: 'Monopoly Hot Shot',
    shortName: 'Monopoly Hot Shot',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Hot Shot series Monopoly',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Monopoly with Hot Shot mechanics.',
    hasCalculator: false
  },
  {
    id: 'monopoly-party-train',
    name: 'Monopoly Party Train',
    shortName: 'Monopoly Train',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2015,
    quickId: 'Train themed Monopoly',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Monopoly railroad theme.',
    hasCalculator: false
  },

  // TARZAN (Mentioned at Downtown Grand)
  {
    id: 'tarzan-lord-jungle',
    name: 'Tarzan: Lord of the Jungle',
    shortName: 'Tarzan Lord',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'King of jungle Tarzan',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Tarzan rules the jungle.',
    hasCalculator: false
  },

  // VEGAS FLOOR CONFIRMED ADDITIONS

  {
    id: 'da-vinci-diamonds-dual',
    name: 'Da Vinci Diamonds Dual Play',
    shortName: 'Da Vinci Dual',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Enhanced Da Vinci with dual reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Two reel sets for double the action.',
    hasCalculator: false
  },
  {
    id: 'kingpin-bowling',
    name: 'Kingpin Bowling',
    shortName: 'Kingpin Bowling',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Bowling alley theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Bowling strike bonus game.',
    hasCalculator: false
  },


  {
    id: '100-pandas',
    name: '100 Pandas',
    shortName: '100 Pandas',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: '100 paylines panda theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cute panda bears with 100 paylines.',
    hasCalculator: false
  },
  {
    id: 'wild-bear-paws',
    name: 'Wild Bear Paws',
    shortName: 'Wild Bear Paws',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Bear claw stacked wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Bear theme with stacked wilds.',
    hasCalculator: false
  },
  {
    id: 'day-of-the-dead',
    name: 'Day of the Dead',
    shortName: 'Day of the Dead',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2015,
    quickId: 'Mexican Dia de los Muertos - hexagonal reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Unique hexagonal 3-4-5 reels layout.',
    hasCalculator: false
  },
  {
    id: 'plants-vs-zombies',
    name: 'Plants vs Zombies',
    shortName: 'Plants vs Zombies',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2018,
    quickId: 'PopCap video game license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Based on popular mobile game.',
    hasCalculator: false
  },
  {
    id: 'game-of-gods',
    name: 'Game of the Gods',
    shortName: 'Game of Gods',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Greek gods mythology',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Greek mythology gods theme.',
    hasCalculator: false
  },
  {
    id: 'sizzling-7',
    name: 'Sizzling 7',
    shortName: 'Sizzling 7',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1998,
    quickId: 'Hot sevens classic slot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic hot 7s theme.',
    hasCalculator: false
  },
  {
    id: 'star-trek-against-all-odds',
    name: 'Star Trek: Against All Odds',
    shortName: 'Star Trek AAO',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2013,
    quickId: 'Original Star Trek series',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Kirk, Spock, Enterprise theme.',
    hasCalculator: false
  },
  {
    id: 'elvis-little-more-action',
    name: 'Elvis: A Little More Action',
    shortName: 'Elvis Action',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2006,
    quickId: 'Elvis Presley music theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'The King of Rock and Roll.',
    hasCalculator: false
  },
  {
    id: 'scarab',
    name: 'Scarab',
    shortName: 'Scarab',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2017,
    quickId: 'Egyptian scarab beetle',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Egyptian beetle riches.',
    hasCalculator: false
  },
  {
    id: 'scarab-grand',
    name: 'Scarab Grand',
    shortName: 'Scarab Grand',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Enhanced Scarab with progressives',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Grand version with bigger jackpots.',
    hasCalculator: false
  },

  // === ARISTOCRAT CATALOG EXPANSION ===
  {
    id: 'lets-go-fishing',
    name: 'Let\'s Go Fish\'n',
    shortName: 'Lets Go Fishn',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2012,
    quickId: 'Fishing reel bonus game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cast your line fishing bonus.',
    hasCalculator: false
  },
  {
    id: 'big-fish',
    name: 'Big Fish',
    shortName: 'Big Fish',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Big catch fishing theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Land the big fish for big wins.',
    hasCalculator: false
  },
  {
    id: 'fire-light',
    name: 'Fire Light',
    shortName: 'Fire Light',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2013,
    quickId: 'Phoenix firebird theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Firebird rising from flames.',
    hasCalculator: false
  },
  {
    id: 'fire-light-2',
    name: 'Fire Light II',
    shortName: 'Fire Light 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Enhanced firebird sequel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sequel with more features.',
    hasCalculator: false
  },
  {
    id: 'red-baron',
    name: 'Red Baron',
    shortName: 'Red Baron',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2010,
    quickId: 'WWI flying ace biplane',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'WWI dogfight aerial combat.',
    hasCalculator: false
  },

  {
    id: 'moon-maiden',
    name: 'Moon Maiden',
    shortName: 'Moon Maiden',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'Mystical moon goddess',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Moon goddess stacked wilds.',
    hasCalculator: false
  },
  {
    id: 'fortune-king',
    name: 'Fortune King',
    shortName: 'Fortune King',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Chinese fortune king',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese wealth god.',
    hasCalculator: false
  },
  {
    id: 'fortune-king-gold',
    name: 'Fortune King Gold',
    shortName: 'Fortune King Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Gold enhanced Fortune King',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced gold version.',
    hasCalculator: false
  },
  {
    id: 'player-piano',
    name: 'Player Piano',
    shortName: 'Player Piano',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2016,
    quickId: 'Old west saloon piano',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wild west saloon theme.',
    hasCalculator: false
  },
  {
    id: 'panda-panda',
    name: 'Panda Panda',
    shortName: 'Panda Panda',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Playful panda bears',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cute panda antics.',
    hasCalculator: false
  },
  {
    id: 'wonder-4-spinning-fortunes',
    name: 'Wonder 4 Spinning Fortunes',
    shortName: 'W4 Spinning',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Wonder 4 with wheel bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wheel bonus on Wonder 4.',
    hasCalculator: false
  },
  {
    id: 'wonder-4-stars',
    name: 'Wonder 4 Stars',
    shortName: 'W4 Stars',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Star-themed Wonder 4',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Stellar Wonder 4 variant.',
    hasCalculator: false
  },

  {
    id: 'lightning-cash-high-stakes',
    name: 'Lightning Cash: High Stakes',
    shortName: 'LC High Stakes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'High denomination Lightning Cash',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High-limit Lightning Cash.',
    hasCalculator: false
  },
  {
    id: 'lightning-cash-magic-pearl',
    name: 'Lightning Cash: Magic Pearl',
    shortName: 'LC Magic Pearl',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Pearl theme Lightning Cash',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ocean pearl theme.',
    hasCalculator: false
  },
  {
    id: 'mighty-cash-double-up',
    name: 'Mighty Cash Double Up',
    shortName: 'MC Double Up',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Double your Mighty Cash wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Double up feature on Mighty Cash.',
    hasCalculator: false
  },
  {
    id: 'mighty-cash-big-money',
    name: 'Mighty Cash Big Money',
    shortName: 'MC Big Money',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Larger jackpots Mighty Cash',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced jackpot version.',
    hasCalculator: false
  },

  {
    id: 'dragon-cash-gold-dragon',
    name: 'Dragon Cash: Gold Dragon',
    shortName: 'DC Gold Dragon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'Golden dragon variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold dragon theme.',
    hasCalculator: false
  },
  {
    id: 'quick-fire-jackpots',
    name: 'Quick Fire Jackpots',
    shortName: 'Quick Fire JP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Fast hitting jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Quick hitting jackpot system.',
    hasCalculator: false
  },





  // === KONAMI CATALOG EXPANSION ===
  
  {
    id: 'china-shores-great-stacks',
    name: 'China Shores: Great Stacks',
    shortName: 'China Shores GS',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Stacked symbols China Shores',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Great Stacks feature added.',
    hasCalculator: false
  },

  {
    id: 'lion-carnival',
    name: 'Lion Carnival',
    shortName: 'Lion Carnival',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Carnival lion theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Festive lion carnival.',
    hasCalculator: false
  },
  {
    id: 'charms-link',
    name: 'Charms Link',
    shortName: 'Charms Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Lucky charms link feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lucky charms collection.',
    hasCalculator: false
  },
  {
    id: 'charms-link-golden-princess',
    name: 'Charms Link: Golden Princess',
    shortName: 'Charms Link GP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2020,
    quickId: 'Princess themed Charms Link',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Princess charms theme.',
    hasCalculator: false
  },
  {
    id: 'treasure-trove',
    name: 'Treasure Trove',
    shortName: 'Treasure Trove',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Pirate treasure collection',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pirate treasure hunting.',
    hasCalculator: false
  },
  {
    id: 'star-watch-fire',
    name: 'Star Watch Fire',
    shortName: 'Star Watch Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2020,
    quickId: 'Fire version Star Watch',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire themed stargazing.',
    hasCalculator: false
  },
  {
    id: 'dragon-celebration',
    name: 'Dragon Celebration',
    shortName: 'Dragon Celebration',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Dragon festival celebration',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon festival theme.',
    hasCalculator: false
  },
  {
    id: 'wild-stallion',
    name: 'Wild Stallion',
    shortName: 'Wild Stallion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2016,
    quickId: 'Wild horse running free',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mustang horse theme.',
    hasCalculator: false
  },
  {
    id: 'wealth-dynasty',
    name: 'Wealth Dynasty',
    shortName: 'Wealth Dynasty',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Chinese wealth dynasty',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Imperial wealth theme.',
    hasCalculator: false
  },
  {
    id: 'enchanted-gardens',
    name: 'Enchanted Gardens',
    shortName: 'Enchanted Gardens',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Magical garden theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Beautiful enchanted garden.',
    hasCalculator: false
  },
  {
    id: 'golden-wolves-grand',
    name: 'Golden Wolves Grand',
    shortName: 'Golden Wolves Gr',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: 'Grand version golden wolves',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced wolf pack game.',
    hasCalculator: false
  },
  {
    id: 'sparkling-roses',
    name: 'Sparkling Roses',
    shortName: 'Sparkling Roses',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Romantic roses theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Romance and roses.',
    hasCalculator: false
  },
  {
    id: 'solstice-fortune',
    name: 'Solstice Fortune',
    shortName: 'Solstice Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Nature solstice fortune',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Solstice nature theme.',
    hasCalculator: false
  },

  // === AGS CATALOG EXPANSION ===
  {
    id: 'bonanza-blast',
    name: 'Bonanza Blast',
    shortName: 'Bonanza Blast',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Mining bonanza explosion',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mining dynamite theme.',
    hasCalculator: false
  },
  {
    id: 'bonanza-blast-double-gold',
    name: 'Bonanza Blast: Double Gold',
    shortName: 'BB Double Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Gold themed Bonanza Blast',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Double the gold mining.',
    hasCalculator: false
  },
  {
    id: 'golden-wins-deluxe',
    name: 'Golden Wins Deluxe',
    shortName: 'Golden Wins DX',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Deluxe golden wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Golden Wins.',
    hasCalculator: false
  },
  {
    id: 'colossal-diamonds-wild',
    name: 'Colossal Diamonds: Wild',
    shortName: 'Colossal Wild',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Wild diamonds colossal',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wild expanding diamonds.',
    hasCalculator: false
  },
  {
    id: 'xtreme-jackpots-blazing',
    name: 'Xtreme Jackpots: Blazing',
    shortName: 'Xtreme Blazing',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Blazing hot Xtreme Jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire themed Xtreme.',
    hasCalculator: false
  },
  {
    id: 'xtreme-jackpots-lucky-tiger',
    name: 'Xtreme Jackpots: Lucky Tiger',
    shortName: 'Xtreme Tiger',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Tiger themed Xtreme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lucky tiger theme.',
    hasCalculator: false
  },
  {
    id: 'fu-nan-fu-nu-boost',
    name: 'Fu Nan Fu Nu Boost',
    shortName: 'FNFN Boost',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2022,
    quickId: 'Boosted Fu Nan Fu Nu',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Boost feature added.',
    hasCalculator: false
  },
  {
    id: 'lucky-rising-phoenix',
    name: 'Lucky Rising Phoenix',
    shortName: 'Lucky Phoenix',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Phoenix rising lucky',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lucky phoenix theme.',
    hasCalculator: false
  },
  {
    id: 'jade-wins-link',
    name: 'Jade Wins Link',
    shortName: 'Jade Wins Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Linked jade wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Jade link feature.',
    hasCalculator: false
  },
  {
    id: 'golden-spins',
    name: 'Golden Spins',
    shortName: 'Golden Spins',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Golden free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden wheel spins.',
    hasCalculator: false
  },

  // === EVERI CATALOG EXPANSION ===
  {
    id: 'cash-machine-emerald',
    name: 'Cash Machine Emerald',
    shortName: 'CM Emerald',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Emerald theme Cash Machine',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Green emerald theme.',
    hasCalculator: false
  },
  {
    id: 'cash-machine-diamond',
    name: 'Cash Machine Diamond',
    shortName: 'CM Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Diamond theme Cash Machine',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sparkling diamond theme.',
    hasCalculator: false
  },
  {
    id: 'jackpot-streams-fire',
    name: 'Jackpot Streams: Fire',
    shortName: 'JP Streams Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Fire themed jackpot streams',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Flaming jackpot streams.',
    hasCalculator: false
  },
  {
    id: 'jackpot-streams-ice',
    name: 'Jackpot Streams: Ice',
    shortName: 'JP Streams Ice',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Ice themed jackpot streams',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Frozen ice jackpots.',
    hasCalculator: false
  },
  {
    id: 'money-rain-deluxe',
    name: 'Money Rain Deluxe',
    shortName: 'Money Rain DX',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Deluxe money rain',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced money rain.',
    hasCalculator: false
  },
  {
    id: 'cash-cove-pirate',
    name: 'Cash Cove: Pirate',
    shortName: 'Cash Cove Pirate',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Pirate treasure cove',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pirate treasure hunting.',
    hasCalculator: false
  },
  {
    id: 'player-classic-gold',
    name: 'Player Classic Gold',
    shortName: 'Player Classic G',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Gold version Player Classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden classic player.',
    hasCalculator: false
  },
  {
    id: 'triple-cash-spin',
    name: 'Triple Cash Spin',
    shortName: 'Triple Cash Spin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2019,
    quickId: 'Triple spinning cash wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Three wheel bonus.',
    hasCalculator: false
  },

  // === AINSWORTH CATALOG EXPANSION ===
  
  {
    id: 'rumble-rumble',
    name: 'Rumble Rumble',
    shortName: 'Rumble Rumble',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2015,
    quickId: 'Thunder rumbling theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Thundering action.',
    hasCalculator: false
  },
  {
    id: 'royal-elephant',
    name: 'Royal Elephant',
    shortName: 'Royal Elephant',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2016,
    quickId: 'Majestic royal elephant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Indian royal elephant.',
    hasCalculator: false
  },
  {
    id: 'big-thunder',
    name: 'Big Thunder',
    shortName: 'Big Thunder',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2017,
    quickId: 'Thunder storm theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Big thunderstorm.',
    hasCalculator: false
  },
  {
    id: 'fortune-star',
    name: 'Fortune Star',
    shortName: 'Fortune Star',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2018,
    quickId: 'Lucky fortune star',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Star of fortune.',
    hasCalculator: false
  },
  {
    id: 'golden-streak',
    name: 'Golden Streak',
    shortName: 'Golden Streak',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2019,
    quickId: 'Winning golden streak',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Hot streak of gold.',
    hasCalculator: false
  },
  {
    id: 'jiulong-baohu',
    name: 'Jiulong Baohu',
    shortName: 'Jiulong Baohu',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2020,
    quickId: 'Nine dragons treasure',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Nine dragon protector.',
    hasCalculator: false
  },
  {
    id: 'flying-horse',
    name: 'Flying Horse',
    shortName: 'Flying Horse',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2017,
    quickId: 'Pegasus flying horse',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Winged horse theme.',
    hasCalculator: false
  },
  {
    id: 'multi-extreme',
    name: 'Multi Extreme',
    shortName: 'Multi Extreme',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2019,
    quickId: 'Extreme multi-game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Multiple games extreme.',
    hasCalculator: false
  },
  {
    id: 'golden-fortune',
    name: 'Golden Fortune',
    shortName: 'Golden Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2020,
    quickId: 'Golden good fortune',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fortune of gold.',
    hasCalculator: false
  },

  // === WMS CATALOG EXPANSION ===
  
  {
    id: 'raging-rhino-rampage',
    name: 'Raging Rhino Rampage',
    shortName: 'RR Rampage',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2020,
    quickId: 'Enhanced rampage rhino',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Rampage bonus feature.',
    hasCalculator: false
  },

  {
    id: 'kronos-unleashed',
    name: 'Kronos Unleashed',
    shortName: 'Kronos Unleashed',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2017,
    quickId: 'Kronos freed from chains',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Unleashed titan power.',
    hasCalculator: false
  },

  {
    id: 'zeus-ii',
    name: 'Zeus II',
    shortName: 'Zeus II',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Sequel to Zeus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Zeus features.',
    hasCalculator: false
  },

  {
    id: 'zeus-1000',
    name: 'Zeus 1000',
    shortName: 'Zeus 1000',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2017,
    quickId: 'Zeus with 1000 ways',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: '1000 ways to win Zeus.',
    hasCalculator: false
  },
  {
    id: 'colossal-reels',
    name: 'Colossal Reels',
    shortName: 'Colossal Reels',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Giant reel mechanic pioneer',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'First colossal reels system.',
    hasCalculator: false
  },


  {
    id: 'montezuma',
    name: 'Montezuma',
    shortName: 'Montezuma',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Aztec emperor theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Aztec emperor Montezuma.',
    hasCalculator: false
  },
  {
    id: 'nascar',
    name: 'NASCAR',
    shortName: 'NASCAR',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Stock car racing',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'NASCAR racing license.',
    hasCalculator: false
  },
  {
    id: 'super-monopoly-money',
    name: 'Super Monopoly Money',
    shortName: 'Super Monopoly',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Enhanced Monopoly with wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Super wheel bonus.',
    hasCalculator: false
  },
  {
    id: 'fire-queen',
    name: 'Fire Queen',
    shortName: 'Fire Queen',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Fiery queen theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire queen royalty.',
    hasCalculator: false
  },

  // === BALLY CATALOG EXPANSION ===,

  {
    id: 'quick-hit-cash-wheel',
    name: 'Quick Hit Cash Wheel',
    shortName: 'QH Cash Wheel',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2019,
    quickId: 'Quick Hit with cash wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wheel bonus on Quick Hit.',
    hasCalculator: false
  },
  {
    id: 'playboy',
    name: 'Playboy',
    shortName: 'Playboy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2012,
    quickId: 'Playboy magazine license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Playboy bunny theme.',
    hasCalculator: false
  },
  {
    id: 'moon-goddess',
    name: 'Moon Goddess',
    shortName: 'Moon Goddess',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2014,
    quickId: 'Lunar goddess theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Moon goddess mythology.',
    hasCalculator: false
  },
  {
    id: 'dragon-emperor',
    name: 'Dragon Emperor',
    shortName: 'Dragon Emperor',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2015,
    quickId: 'Chinese dragon emperor',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon emperor theme.',
    hasCalculator: false
  },

  // === INCREDIBLE TECHNOLOGIES EXPANSION ===
  {
    id: 'crazy-money-deluxe',
    name: 'Crazy Money Deluxe',
    shortName: 'Crazy Money DX',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2018,
    quickId: 'Deluxe crazy money',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced crazy money.',
    hasCalculator: false
  },
  {
    id: 'money-wheel',
    name: 'Money Wheel',
    shortName: 'Money Wheel',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2017,
    quickId: 'Giant money wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wheel of money.',
    hasCalculator: false
  },
  {
    id: 'money-madness',
    name: 'Money Madness',
    shortName: 'Money Madness',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2019,
    quickId: 'Mad for money',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Money madness theme.',
    hasCalculator: false
  },
  {
    id: 'golden-coins',
    name: 'Golden Coins',
    shortName: 'Golden Coins',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2018,
    quickId: 'Golden coin collection',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Collect golden coins.',
    hasCalculator: false
  },
  {
    id: 'triple-fortune',
    name: 'Triple Fortune',
    shortName: 'Triple Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2019,
    quickId: 'Triple fortune wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Three times fortune.',
    hasCalculator: false
  },
  // Additional machines to reach 777
  {
    id: 'panda-magic',
    name: 'Panda Magic',
    shortName: 'Panda Magic',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Panda theme with hold & spin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Aristocrat game with panda theme.',
    hasCalculator: false
  },
  {
    id: 'gold-stacks-88',
    name: 'Gold Stacks 88',
    shortName: 'Gold Stacks 88',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Gold theme with 88 feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Asian-themed with stacking wilds.',
    hasCalculator: false
  },
  {
    id: 'rising-fortunes',
    name: 'Rising Fortunes',
    shortName: 'Rising Fortunes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Golden reels ascending feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fortune-themed with rising jackpots.',
    hasCalculator: false
  },
  {
    id: 'lucky-buddha',
    name: 'Lucky Buddha',
    shortName: 'Lucky Buddha',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2016,
    quickId: 'Buddha statue with orbs',
    thresholdSummary: 'Play when 4+ orbs collected',
    threshold: {
      conservative: 'Look for 5+ orbs banked',
      aggressive: '4+ orbs can be worth a shot'
    },
    visual: {
      location: 'Orb count above reels',
      appearance: [
        { label: 'Orbs', text: 'Golden orbs collect near Buddha', highlight: true },
        { label: 'Trigger', text: '8 orbs triggers feature' }
      ]
    },
    notes: 'Similar to Lucky Wealth Cat mechanics.',
    hasCalculator: false
  },
  {
    id: 'golden-century',
    name: 'Dragon Link: Golden Century',
    shortName: 'Golden Century',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Dragon Link with golden coins',
    thresholdSummary: 'Check orb/coin count',
    threshold: {
      conservative: 'Look for 5+ coins banked',
      aggressive: '4+ coins may be worth playing'
    },
    visual: {
      location: 'Coin counter on screen',
      appearance: [
        { label: 'Coins', text: 'Golden coins stack during play', highlight: true },
        { label: 'Trigger', text: 'Fill meter for bonus' }
      ]
    },
    notes: 'Dragon Link variant with Golden Century theme.',
    hasCalculator: false
  },
  {
    id: 'epic-fortunes',
    name: 'Epic Fortunes',
    shortName: 'Epic Fortunes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2020,
    quickId: 'Epic hero theme slots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Adventure-themed Konami game.',
    hasCalculator: false
  },
  {
    id: 'quick-spin',
    name: 'Quick Spin',
    shortName: 'Quick Spin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Fast-paced spinning action',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High-speed gameplay option.',
    hasCalculator: false
  },
  {
    id: 'fu-dai-lian-lian',
    name: 'Fu Dai Lian Lian',
    shortName: 'Fu Dai Lian Lian',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2020,
    quickId: 'Red bags with gold coins',
    thresholdSummary: 'Look for filled red bags',
    threshold: {
      conservative: '3+ bags filled',
      aggressive: '2+ bags with good denomination'
    },
    visual: {
      location: 'Red bag meters on top screen',
      appearance: [
        { label: 'Bags', text: 'Red bags fill with gold coins', highlight: true },
        { label: 'Bonus', text: 'Full bags trigger feature' }
      ]
    },
    notes: 'Similar to Dancing Drums mechanics.',
    hasCalculator: false
  },
  {
    id: 'ultimate-firelink',
    name: 'Ultimate Fire Link',
    shortName: 'Ultimate Fire Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Fire Link hold and spin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Fire Link series entry.',
    hasCalculator: false
  },
  {
    id: 'more-more-chilli',
    name: 'More More Chilli',
    shortName: 'More More Chilli',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Sequel to More Chilli',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced version of More Chilli.',
    hasCalculator: false
  },
  {
    id: 'all-aboard',
    name: 'All Aboard',
    shortName: 'All Aboard',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Train theme with pick bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Train-themed Konami game.',
    hasCalculator: false
  },
  {
    id: 'can-can-de-paris',
    name: 'Can Can de Paris',
    shortName: 'Can Can de Paris',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'French dancer theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Parisian-themed Aristocrat slot.',
    hasCalculator: false
  }
];

// ============================================
// VIDEO POKER DATA
// Reference: VPFree2.com & WizardOfOdds.com - authoritative VP sources
// ============================================

// VP Game Categories
const vpCategories = {
  'standard': { name: 'Standard Games', description: 'Classic video poker variants' },
  'bonus': { name: 'Bonus Poker Family', description: 'Enhanced payouts for four of a kind' },
  'wild': { name: 'Wild Card Games', description: 'Games with wild cards (Deuces, Jokers)' },
  'ultimate-x': { name: 'Ultimate X Family', description: 'Multiplier-based games' },
  'multi-play': { name: 'Multi-Play & Multi-Strike', description: 'Multiple hands or levels' },
  'wheel': { name: 'Wheel Bonus Games', description: 'Games with wheel bonus features' },
  'specialty': { name: 'Specialty Games', description: 'Unique mechanics and variants' },
};

const vpGames = {
  // ============================================
  // STANDARD GAMES
  // ============================================
  'jacks-or-better': {
    id: 'jacks-or-better',
    name: 'Jacks or Better',
    shortName: 'JoB',
    category: 'standard',
    description: 'The classic. Pair of Jacks or better to win.',
    popularity: 100,
    payTables: [
      { id: '9-6', label: '9/6 Full Pay', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 98.45, rating: 'OK' },
      { id: '8-6', label: '8/6', fh: 8, fl: 6, return: 98.39, rating: 'OK' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.30, rating: 'AVOID' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 96.15, rating: 'AVOID' },
      { id: '6-5', label: '6/5', fh: 6, fl: 5, return: 95.00, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Hold any paying hand (pair J+ through Royal)' },
      { priority: 2, rule: '4 to a Royal > anything except pat SF/Royal' },
      { priority: 3, rule: 'Low pair > 4 to a Flush on standard pay' },
      { priority: 4, rule: 'Never hold a kicker' },
    ],
  },
  'tens-or-better': {
    id: 'tens-or-better',
    name: 'Tens or Better',
    shortName: 'ToB',
    category: 'standard',
    description: 'Like JoB but pair of 10s pays. Lower other payouts.',
    popularity: 60,
    payTables: [
      { id: '6-5', label: '6/5 Full Pay', fh: 6, fl: 5, return: 99.14, rating: 'HUNT' },
      { id: '5-5', label: '5/5', fh: 5, fl: 5, return: 98.01, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Tens pay! Adjust accordingly' },
      { priority: 2, rule: 'Otherwise similar to JoB' },
    ],
  },
  'all-american': {
    id: 'all-american',
    name: 'All American',
    shortName: 'AA',
    category: 'standard',
    description: 'Straight, Flush, SF all pay 8. Two pair pays 1.',
    popularity: 55,
    payTables: [
      { id: '8-8-8', label: '8/8/8 Full Pay', fh: 8, fl: 8, return: 100.72, rating: 'HUNT' },
      { id: '8-8-25', label: '8/8/25', fh: 8, fl: 8, return: 99.60, rating: 'HUNT' },
      { id: '1-1-1', label: '1/1/1 (bad)', fh: 1, fl: 1, return: 95.00, rating: 'AVOID' },
    ],
    keyLookup: 'Flush / Straight / SF payout (usually same)',
    strategyTips: [
      { priority: 1, rule: 'Flushes pay same as full house!' },
      { priority: 2, rule: 'Straights very valuable (pay 8)' },
      { priority: 3, rule: 'Two pair only pays 1' },
    ],
  },

  // ============================================
  // BONUS POKER FAMILY
  // ============================================
  'bonus-poker': {
    id: 'bonus-poker',
    name: 'Bonus Poker',
    shortName: 'BP',
    category: 'bonus',
    description: 'Like JoB but bonus payouts for quads.',
    popularity: 90,
    payTables: [
      { id: '8-5', label: '8/5 Full Pay', fh: 8, fl: 5, return: 99.17, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.01, rating: 'OK' },
      { id: '6-5', label: '6/5', fh: 6, fl: 5, return: 96.87, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Four Aces pays 80 (vs 25 in JoB)' },
      { priority: 2, rule: 'Four 2-4 pays 40' },
      { priority: 3, rule: 'Strategy similar to JoB' },
    ],
  },
  'bonus-poker-deluxe': {
    id: 'bonus-poker-deluxe',
    name: 'Bonus Poker Deluxe',
    shortName: 'BPD',
    category: 'bonus',
    description: 'All quads pay 80. Two pair pays 1.',
    popularity: 70,
    payTables: [
      { id: '9-6', label: '9/6 Full Pay', fh: 9, fl: 6, return: 99.64, rating: 'HUNT' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 98.55, rating: 'OK' },
      { id: '8-6', label: '8/6', fh: 8, fl: 6, return: 98.49, rating: 'OK' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.40, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'All quads pay 80 - simpler decisions' },
      { priority: 2, rule: 'Two pair only pays 1!' },
    ],
  },
  'double-bonus': {
    id: 'double-bonus',
    name: 'Double Bonus',
    shortName: 'DB',
    category: 'bonus',
    description: 'Higher quad payouts. Four Aces pays 160.',
    popularity: 85,
    payTables: [
      { id: '10-7', label: '10/7 Full Pay', fh: 10, fl: 7, return: 100.17, rating: 'HUNT' },
      { id: '9-7', label: '9/7', fh: 9, fl: 7, return: 99.11, rating: 'HUNT' },
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 97.81, rating: 'OK' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 96.38, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Four Aces pays 160!' },
      { priority: 2, rule: 'Flush pays 7 on good tables - changes strategy' },
      { priority: 3, rule: '4 to flush > low pair on 10/7 and 9/7' },
    ],
  },
  'double-double-bonus': {
    id: 'double-double-bonus',
    name: 'Double Double Bonus',
    shortName: 'DDB',
    category: 'bonus',
    description: 'Kickers matter for PAT quads only! Four Aces + 2-4 pays 400.',
    popularity: 95,
    payTables: [
      { id: '10-6', label: '10/6 Full Pay', fh: 10, fl: 6, return: 100.07, rating: 'HUNT' },
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 98.98, rating: 'OK' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 97.87, rating: 'AVOID' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 96.79, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Do NOT hold kickers with trips!' },
      { priority: 2, rule: 'AAA alone (EV 62.45) > AAA+kicker (EV 59.15)' },
      { priority: 3, rule: 'Only hold kicker with PAT quads' },
    ],
  },
  'triple-double-bonus': {
    id: 'triple-double-bonus',
    name: 'Triple Double Bonus',
    shortName: 'TDB',
    category: 'bonus',
    description: 'Very volatile. 4A+kicker = 4000 (same as Royal!).',
    popularity: 80,
    payTables: [
      { id: '9-7', label: '9/7 Full Pay', fh: 9, fl: 7, return: 99.58, rating: 'HUNT' },
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 98.15, rating: 'OK' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 96.72, rating: 'AVOID' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 95.97, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'HOLD kickers with AAA/222/333/444!' },
      { priority: 2, rule: '4A + 2-4 kicker = 4000 (same as Royal!)' },
      { priority: 3, rule: 'Very high variance' },
    ],
  },
  'triple-triple-bonus': {
    id: 'triple-triple-bonus',
    name: 'Triple Triple Bonus',
    shortName: 'TTB',
    category: 'bonus',
    description: 'Even more volatile. SF pays 100.',
    popularity: 65,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.79, rating: 'HUNT' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 98.61, rating: 'OK' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.47, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'SF pays 100 (double normal!)' },
      { priority: 2, rule: 'Extremely high variance' },
    ],
  },
  'super-double-bonus': {
    id: 'super-double-bonus',
    name: 'Super Double Bonus',
    shortName: 'SDB',
    category: 'bonus',
    description: 'Four Aces pays 160. Four J-K pays 120.',
    popularity: 60,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.69, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.77, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Face card quads pay 120' },
      { priority: 2, rule: 'Aces still king at 160' },
    ],
  },
  'super-aces': {
    id: 'super-aces',
    name: 'Super Aces Bonus',
    shortName: 'SA',
    category: 'bonus',
    description: 'Four Aces pays 400! Very volatile.',
    popularity: 70,
    payTables: [
      { id: '8-5', label: '8/5 Full Pay', fh: 8, fl: 5, return: 99.94, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.86, rating: 'OK' },
      { id: '6-5', label: '6/5', fh: 6, fl: 5, return: 97.78, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Four Aces = 400! Hold Aces aggressively' },
      { priority: 2, rule: 'Single Ace has extra value' },
    ],
  },
  'white-hot-aces': {
    id: 'white-hot-aces',
    name: 'White Hot Aces',
    shortName: 'WHA',
    category: 'bonus',
    description: 'Four Aces pays 240. Four 2-4 pays 120.',
    popularity: 65,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.57, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.50, rating: 'OK' },
      { id: '6-5', label: '6/5', fh: 6, fl: 5, return: 97.43, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Four Aces = 240' },
      { priority: 2, rule: 'Four 2-4 = 120' },
    ],
  },
  'aces-and-faces': {
    id: 'aces-and-faces',
    name: 'Aces and Faces',
    shortName: 'A&F',
    category: 'bonus',
    description: 'Bonus pays for quad Aces (80) and Faces (40).',
    popularity: 55,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.26, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.10, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Quad Aces = 80, Quad J/Q/K = 40' },
    ],
  },
  'double-aces-and-faces': {
    id: 'double-aces-and-faces',
    name: 'Double Aces and Faces',
    shortName: 'DA&F',
    category: 'bonus',
    description: 'Enhanced Aces and Faces with higher payouts.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.47, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.82, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Higher pays than standard A&F' },
    ],
  },
  'aces-and-eights': {
    id: 'aces-and-eights',
    name: 'Aces and Eights',
    shortName: 'A&8',
    category: 'bonus',
    description: 'Bonus for quad Aces and quad 8s.',
    popularity: 50,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.78, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.44, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Quad Aces and 8s pay 80' },
      { priority: 2, rule: 'Sevens pay 50' },
    ],
  },
  'bonus-deuces-wild': {
    id: 'bonus-deuces-wild',
    name: 'Bonus Deuces Wild',
    shortName: 'BDW',
    category: 'bonus',
    description: 'Deuces wild with bonus quad payouts.',
    popularity: 60,
    payTables: [
      { id: '13-4-3', label: '13/4/3 Full Pay', fh: 4, fl: 3, return: 99.86, rating: 'HUNT' },
      { id: '10-4-3', label: '10/4/3', fh: 4, fl: 3, return: 99.06, rating: 'OK' },
    ],
    keyLookup: 'Five of Kind / Four of Kind payout',
    strategyTips: [
      { priority: 1, rule: 'Wild deuces + bonus quad pays' },
      { priority: 2, rule: 'Different strategy from regular DW' },
    ],
  },
  'double-bonus-deuces-wild': {
    id: 'double-bonus-deuces-wild',
    name: 'Double Bonus Deuces Wild',
    shortName: 'DBDW',
    category: 'bonus',
    description: 'Deuces wild with even higher bonus pays.',
    popularity: 50,
    payTables: [
      { id: '9-4-3', label: '9/4/3', fh: 4, fl: 3, return: 99.81, rating: 'HUNT' },
    ],
    keyLookup: 'Four of Kind / Wild Royal payout',
    strategyTips: [
      { priority: 1, rule: 'Combines wild cards with bonus pays' },
    ],
  },
  'super-bonus-deuces-wild': {
    id: 'super-bonus-deuces-wild',
    name: 'Super Bonus Deuces Wild',
    shortName: 'SBDW',
    category: 'bonus',
    description: 'Enhanced Bonus Deuces with even higher pays.',
    popularity: 45,
    payTables: [
      { id: '12-4-3', label: '12/4/3', fh: 4, fl: 3, return: 99.52, rating: 'HUNT' },
    ],
    keyLookup: 'Five of Kind / Four Deuces payout',
    strategyTips: [
      { priority: 1, rule: 'Higher wild pays than standard BDW' },
    ],
  },
  'triple-bonus': {
    id: 'triple-bonus',
    name: 'Triple Bonus',
    shortName: 'TB',
    category: 'bonus',
    description: 'Four Aces pays 240. SF pays 100.',
    popularity: 55,
    payTables: [
      { id: '9-7', label: '9/7', fh: 9, fl: 7, return: 99.94, rating: 'HUNT' },
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.16, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.03, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'SF pays 100!' },
      { priority: 2, rule: 'Four Aces = 240' },
    ],
  },
  'triple-bonus-plus': {
    id: 'triple-bonus-plus',
    name: 'Triple Bonus Poker Plus',
    shortName: 'TBP',
    category: 'bonus',
    description: 'Triple Bonus with enhanced pays.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.80, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.94, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Enhanced Triple Bonus' },
    ],
  },
  'super-triple-bonus': {
    id: 'super-triple-bonus',
    name: 'Super Triple Bonus',
    shortName: 'STB',
    category: 'bonus',
    description: 'Even higher pays than Triple Bonus.',
    popularity: 40,
    payTables: [
      { id: '9-7', label: '9/7', fh: 9, fl: 7, return: 99.82, rating: 'HUNT' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Top tier of Triple Bonus family' },
    ],
  },
  'royal-aces-bonus': {
    id: 'royal-aces-bonus',
    name: 'Royal Aces Bonus',
    shortName: 'RAB',
    category: 'bonus',
    description: 'Four Aces pays 800. Min hand is pair of Aces.',
    popularity: 35,
    payTables: [
      { id: '8-6', label: '8/6', fh: 8, fl: 6, return: 99.58, rating: 'HUNT' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Four Aces = 800!' },
      { priority: 2, rule: 'Min hand is pair of Aces (not Jacks)' },
    ],
  },
  'nevada-bonus': {
    id: 'nevada-bonus',
    name: 'Nevada Bonus Poker',
    shortName: 'NB',
    category: 'bonus',
    description: 'Bonus pays with different structure.',
    popularity: 30,
    payTables: [
      { id: '10-6', label: '10/6', fh: 10, fl: 6, return: 99.26, rating: 'HUNT' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Nevada-specific pay structure' },
    ],
  },
  'ultra-bonus': {
    id: 'ultra-bonus',
    name: 'Ultra Bonus Poker',
    shortName: 'UB',
    category: 'bonus',
    description: 'High bonus quad pays.',
    popularity: 35,
    payTables: [
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 99.20, rating: 'HUNT' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'High variance bonus game' },
    ],
  },
  'hyper-bonus': {
    id: 'hyper-bonus',
    name: 'Hyper Bonus Poker',
    shortName: 'HB',
    category: 'bonus',
    description: 'Very high quad pays.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.00, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Extremely volatile' },
    ],
  },
  'pyramid-bonus': {
    id: 'pyramid-bonus',
    name: 'Pyramid Bonus Poker',
    shortName: 'PB',
    category: 'bonus',
    description: 'Pyramid-structured bonus pays.',
    popularity: 25,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 98.90, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Tiered bonus structure' },
    ],
  },

  // ============================================
  // WILD CARD GAMES
  // ============================================
  'deuces-wild': {
    id: 'deuces-wild',
    name: 'Deuces Wild',
    shortName: 'DW',
    category: 'wild',
    description: 'All 2s are wild. Completely different strategy.',
    popularity: 95,
    payTables: [
      { id: 'full-pay', label: 'Full Pay (NSUD)', fh: 4, fl: 3, return: 100.76, rating: 'HUNT' },
      { id: '25-15-9', label: '25/15/9', fh: 4, fl: 3, return: 99.73, rating: 'HUNT' },
      { id: '20-12-9', label: '20/12/9', fh: 4, fl: 3, return: 99.12, rating: 'OK' },
      { id: '25-16-10', label: '25/16/10 Illinois', fh: 4, fl: 3, return: 98.91, rating: 'OK' },
    ],
    keyLookup: 'Natural Royal / 5K / Wild Royal payout',
    strategyTips: [
      { priority: 1, rule: 'NEVER discard a deuce!' },
      { priority: 2, rule: 'Strategy changes based on # of deuces' },
      { priority: 3, rule: 'Minimum win is 3 of a kind' },
    ],
  },
  'loose-deuces': {
    id: 'loose-deuces',
    name: 'Loose Deuces',
    shortName: 'LD',
    category: 'wild',
    description: 'Deuces wild with 4 deuces paying 500 (2500 for max bet).',
    popularity: 60,
    payTables: [
      { id: '17-10', label: '500/17/10 Full Pay', fh: 3, fl: 2, return: 101.60, rating: 'HUNT' },
      { id: '15-10', label: '500/15/10', fh: 3, fl: 2, return: 100.97, rating: 'HUNT' },
      { id: '12-11', label: '500/12/11', fh: 3, fl: 2, return: 100.47, rating: 'HUNT' },
    ],
    keyLookup: 'Four Deuces / 5K / SF payout',
    strategyTips: [
      { priority: 1, rule: '3 Deuces: DUMP everything, chase 4D!' },
      { priority: 2, rule: 'Break wild royal/5K with 3 deuces!' },
      { priority: 3, rule: '4 Deuces = 500 (same as 2 royals!)' },
    ],
  },
  'double-deuces': {
    id: 'double-deuces',
    name: 'Double Deuces',
    shortName: 'DD',
    category: 'wild',
    description: 'Deuces wild with enhanced quad payouts.',
    popularity: 45,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 4, fl: 3, return: 99.62, rating: 'HUNT' },
    ],
    keyLookup: 'Four Deuces / Wild Royal payout',
    strategyTips: [
      { priority: 1, rule: 'Enhanced Deuces Wild' },
    ],
  },
  'joker-poker-kings': {
    id: 'joker-poker-kings',
    name: 'Joker Poker (Kings+)',
    shortName: 'JPK',
    category: 'wild',
    description: '53-card deck. Joker is wild. Kings or better pays.',
    popularity: 70,
    payTables: [
      { id: '20-7-5', label: '20/7/5 Full Pay', fh: 7, fl: 5, return: 100.64, rating: 'HUNT' },
      { id: '18-7-5', label: '18/7/5', fh: 7, fl: 5, return: 99.29, rating: 'HUNT' },
      { id: '17-7-5', label: '17/7/5', fh: 7, fl: 5, return: 98.93, rating: 'HUNT' },
      { id: '16-7-5', label: '16/7/5', fh: 7, fl: 5, return: 97.24, rating: 'OK' },
    ],
    keyLookup: 'Four of Kind / Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Joker is wild - hold it always!' },
      { priority: 2, rule: 'K/A pairs pay, Q and below do NOT' },
      { priority: 3, rule: 'With Joker: Hold Joker + K/A' },
    ],
  },
  'joker-poker-twopair': {
    id: 'joker-poker-twopair',
    name: 'Joker Poker (Two Pair+)',
    shortName: 'JP2',
    category: 'wild',
    description: '53-card deck. Min hand is TWO PAIR (pairs don\'t pay!).',
    popularity: 55,
    payTables: [
      { id: '20-10-6', label: '20/10/6 Full Pay', fh: 10, fl: 6, return: 99.92, rating: 'HUNT' },
      { id: '16-8-5', label: '16/8/5', fh: 8, fl: 5, return: 98.59, rating: 'HUNT' },
    ],
    keyLookup: 'Four of Kind / Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Min hand is TWO PAIR!' },
      { priority: 2, rule: 'NO pairs pay (even K/A!)' },
      { priority: 3, rule: 'More aggressive draw strategy' },
    ],
  },
  'joker-poker-aces': {
    id: 'joker-poker-aces',
    name: 'Joker Wild (Aces+)',
    shortName: 'JPA',
    category: 'wild',
    description: '53-card deck. Min hand is pair of Aces.',
    popularity: 45,
    payTables: [
      { id: '17-7-5', label: '17/7/5', fh: 7, fl: 5, return: 99.10, rating: 'HUNT' },
    ],
    keyLookup: 'Four of Kind / Full House payout',
    strategyTips: [
      { priority: 1, rule: 'Min hand is pair of Aces' },
    ],
  },
  'double-joker': {
    id: 'double-joker',
    name: 'Double Joker',
    shortName: 'DJ',
    category: 'wild',
    description: '54-card deck with TWO jokers wild.',
    popularity: 40,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 5, fl: 4, return: 99.97, rating: 'HUNT' },
    ],
    keyLookup: 'Natural Royal / 5K payout',
    strategyTips: [
      { priority: 1, rule: 'TWO jokers in deck!' },
      { priority: 2, rule: 'High hit frequency' },
    ],
  },
  'deuces-and-joker': {
    id: 'deuces-and-joker',
    name: 'Deuces and Joker Wild',
    shortName: 'D&J',
    category: 'wild',
    description: '53-card deck. All deuces AND joker wild.',
    popularity: 50,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 3, fl: 2, return: 99.06, rating: 'OK' },
    ],
    keyLookup: 'Natural Royal / 5K / 4 Deuces payout',
    strategyTips: [
      { priority: 1, rule: '5 wild cards total!' },
      { priority: 2, rule: 'Very high hit frequency' },
    ],
  },
  'sevens-wild': {
    id: 'sevens-wild',
    name: 'Sevens Wild',
    shortName: 'SW',
    category: 'wild',
    description: 'All 7s are wild.',
    popularity: 35,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 5, fl: 4, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Natural Royal / Five of Kind payout',
    strategyTips: [
      { priority: 1, rule: 'All 7s are wild' },
      { priority: 2, rule: 'Similar to Deuces strategy concepts' },
    ],
  },
  'sevens-and-joker': {
    id: 'sevens-and-joker',
    name: 'Sevens and Joker Wild',
    shortName: 'S&J',
    category: 'wild',
    description: '53-card deck. 7s and Joker wild.',
    popularity: 25,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 4, fl: 3, return: 98.50, rating: 'OK' },
    ],
    keyLookup: 'Five 7s / Natural Royal payout',
    strategyTips: [
      { priority: 1, rule: '5 wild cards in deck' },
    ],
  },
  'one-eyed-jacks': {
    id: 'one-eyed-jacks',
    name: 'One-Eyed Jacks',
    shortName: 'OEJ',
    category: 'wild',
    description: 'J♥ and J♠ are wild.',
    popularity: 30,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 8, fl: 5, return: 99.52, rating: 'HUNT' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Only 2 wild cards in deck' },
      { priority: 2, rule: 'One-eyed Jacks (J♥ J♠) are wild' },
    ],
  },
  'faces-n-deuces': {
    id: 'faces-n-deuces',
    name: "Faces n' Deuces",
    shortName: 'FnD',
    category: 'wild',
    description: 'Deuces wild with face card bonus.',
    popularity: 30,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 4, fl: 3, return: 99.40, rating: 'HUNT' },
    ],
    keyLookup: 'Quad Faces / Deuces pays',
    strategyTips: [
      { priority: 1, rule: 'Combines wild deuces with face bonus' },
    ],
  },
  'acey-deucey': {
    id: 'acey-deucey',
    name: 'Acey Deucey Poker',
    shortName: 'AD',
    category: 'wild',
    description: 'Deuces wild with Ace bonus.',
    popularity: 25,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 4, fl: 3, return: 99.20, rating: 'HUNT' },
    ],
    keyLookup: 'Quad Aces / Deuces pays',
    strategyTips: [
      { priority: 1, rule: 'Wild deuces plus Ace bonuses' },
    ],
  },

  // ============================================
  // ULTIMATE X FAMILY
  // ============================================
  'ultimate-x-jacks': {
    id: 'ultimate-x-jacks',
    name: 'Ultimate X (Jacks or Better)',
    shortName: 'UX-JoB',
    category: 'ultimate-x',
    description: 'JoB with multipliers. Wins give 2x-12x on next hand. Uses standard JoB strategy.',
    popularity: 85,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.30, rating: 'AVOID' },
    ],
    keyLookup: 'Base pay table (multipliers add ~0.2%)',
    strategyTips: [
      { priority: 1, rule: 'Use standard Jacks or Better strategy!' },
      { priority: 2, rule: 'Multipliers (2x-12x) don\'t change optimal play' },
      { priority: 3, rule: 'Royal = 12x, SF = 10x on next hand' },
      { priority: 4, rule: 'Must play 3-10 hands simultaneously' },
    ],
  },
  'ultimate-x-bonus': {
    id: 'ultimate-x-bonus',
    name: 'Ultimate X (Bonus Poker)',
    shortName: 'UX-BP',
    category: 'ultimate-x',
    description: 'Bonus Poker with Ultimate X multipliers. Uses standard BP strategy.',
    popularity: 75,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.17, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.01, rating: 'OK' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Use standard Bonus Poker strategy!' },
      { priority: 2, rule: 'Quad bonuses + multipliers = volatile' },
      { priority: 3, rule: 'Multipliers don\'t change optimal play' },
    ],
  },
  'ultimate-x-ddb': {
    id: 'ultimate-x-ddb',
    name: 'Ultimate X (Double Double Bonus)',
    shortName: 'UX-DDB',
    category: 'ultimate-x',
    description: 'DDB with Ultimate X multipliers. Uses standard DDB strategy with kicker rules.',
    popularity: 80,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 98.98, rating: 'OK' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 97.87, rating: 'AVOID' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Use standard DDB strategy with kickers!' },
      { priority: 2, rule: 'Hold AAA + kicker (2/3/4) for 400-coin draw' },
      { priority: 3, rule: 'Kickers + multipliers = huge volatility' },
    ],
  },
  'ultimate-x-double-bonus': {
    id: 'ultimate-x-double-bonus',
    name: 'Ultimate X (Double Bonus)',
    shortName: 'UX-DB',
    category: 'ultimate-x',
    description: 'Double Bonus with Ultimate X multipliers. Uses standard DB strategy.',
    popularity: 70,
    payTables: [
      { id: '9-7', label: '9/7', fh: 9, fl: 7, return: 99.11, rating: 'HUNT' },
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 97.81, rating: 'OK' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Use standard Double Bonus strategy!' },
      { priority: 2, rule: '4 Aces = 160 coins + potential multiplier' },
      { priority: 3, rule: 'Multipliers don\'t change optimal play' },
    ],
  },
  'ultimate-x-bpd': {
    id: 'ultimate-x-bpd',
    name: 'Ultimate X (Bonus Poker Deluxe)',
    shortName: 'UX-BPD',
    category: 'ultimate-x',
    description: 'BPD with Ultimate X multipliers. All quads pay 80. Uses BP strategy.',
    popularity: 60,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.64, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.40, rating: 'AVOID' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Use Bonus Poker strategy!' },
      { priority: 2, rule: 'All quads = 80 coins (no kicker bonuses)' },
      { priority: 3, rule: 'Multipliers don\'t change optimal play' },
    ],
  },
  'ultimate-x-joker': {
    id: 'ultimate-x-joker',
    name: 'Ultimate X (Joker Poker)',
    shortName: 'UX-JP',
    category: 'ultimate-x',
    description: 'Joker Poker Kings with Ultimate X multipliers. Uses JPK strategy.',
    popularity: 50,
    payTables: [
      { id: '20-7', label: '20/7/5', fh: 7, fl: 5, return: 100.64, rating: 'HUNT' },
      { id: '17-7', label: '17/7/5', fh: 7, fl: 5, return: 99.07, rating: 'OK' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Use Joker Poker Kings strategy!' },
      { priority: 2, rule: 'K/A pairs pay, Q and below don\'t' },
      { priority: 3, rule: 'Hold Joker + K/A for paying pair' },
      { priority: 4, rule: 'Multipliers don\'t change optimal play' },
    ],
  },
  'ultimate-x-gold': {
    id: 'ultimate-x-gold',
    name: 'Ultimate X Gold',
    shortName: 'UX-G',
    category: 'ultimate-x',
    description: 'Enhanced Ultimate X with better multipliers.',
    popularity: 55,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.70, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + enhanced multipliers',
    strategyTips: [
      { priority: 1, rule: 'Better multipliers than standard UX' },
    ],
  },
  'ultimate-x-bonus-streak': {
    id: 'ultimate-x-bonus-streak',
    name: 'Ultimate X Bonus Streak',
    shortName: 'UXBS',
    category: 'ultimate-x',
    description: 'UX with streak bonus feature.',
    popularity: 65,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.60, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + streak bonus',
    strategyTips: [
      { priority: 1, rule: 'Multipliers can streak/accumulate' },
    ],
  },

  // ============================================
  // MULTI-PLAY & MULTI-STRIKE
  // ============================================
  'multi-strike': {
    id: 'multi-strike',
    name: 'Multi-Strike Poker',
    shortName: 'MS',
    category: 'multi-play',
    description: '4 levels. Win to advance. Multipliers 1x-2x-4x-8x.',
    popularity: 70,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.79, rating: 'HUNT' },
      { id: '8-5', label: '8/5 JoB', fh: 8, fl: 5, return: 97.81, rating: 'OK' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Must win to advance levels' },
      { priority: 2, rule: 'Level 4 = 8x multiplier!' },
      { priority: 3, rule: 'Free ride cards help advance' },
    ],
  },
  'multi-strike-16x': {
    id: 'multi-strike-16x',
    name: 'Multi-Strike Poker 16X',
    shortName: 'MS16',
    category: 'multi-play',
    description: '5 levels with 16x top multiplier.',
    popularity: 50,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.85, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: '5 levels: 1x-2x-4x-8x-16x' },
      { priority: 2, rule: 'Even more volatile than standard MS' },
    ],
  },
  'spin-poker': {
    id: 'spin-poker',
    name: 'Spin Poker',
    shortName: 'SP',
    category: 'multi-play',
    description: '9-line with spinning pattern. Same strategy as single.',
    popularity: 60,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table (same return as single)',
    strategyTips: [
      { priority: 1, rule: 'Same strategy as single-line' },
      { priority: 2, rule: '9 hands share same draw cards' },
    ],
  },
  'triple-play': {
    id: 'triple-play',
    name: 'Triple Play Poker',
    shortName: 'TP',
    category: 'multi-play',
    description: '3 hands. Same initial cards, different draws.',
    popularity: 55,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Same strategy as single-line' },
      { priority: 2, rule: 'Higher variance than single' },
    ],
  },
  'five-play': {
    id: 'five-play',
    name: 'Five Play Poker',
    shortName: '5P',
    category: 'multi-play',
    description: '5 hands. Same initial cards, different draws.',
    popularity: 50,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Same strategy as single-line' },
    ],
  },
  'ten-play': {
    id: 'ten-play',
    name: 'Ten Play Poker',
    shortName: '10P',
    category: 'multi-play',
    description: '10 hands simultaneously.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Very high variance' },
    ],
  },
  'super-times-pay': {
    id: 'super-times-pay',
    name: 'Super Times Pay',
    shortName: 'STP',
    category: 'multi-play',
    description: 'Random multipliers 2x-10x on hands.',
    popularity: 65,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table + random multipliers',
    strategyTips: [
      { priority: 1, rule: 'Random multiplier appears on deal' },
      { priority: 2, rule: 'Same base strategy' },
    ],
  },
  'double-super-times-pay': {
    id: 'double-super-times-pay',
    name: 'Double Super Times Pay',
    shortName: 'DSTP',
    category: 'multi-play',
    description: 'Enhanced Super Times Pay multipliers.',
    popularity: 50,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.60, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + better multipliers',
    strategyTips: [
      { priority: 1, rule: 'Better multiplier frequency' },
    ],
  },
  'hot-roll': {
    id: 'hot-roll',
    name: 'Hot Roll Poker',
    shortName: 'HR',
    category: 'multi-play',
    description: 'Dice roll on wins determines multiplier.',
    popularity: 55,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.64, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + dice multiplier',
    strategyTips: [
      { priority: 1, rule: 'Win triggers dice roll for multiplier' },
      { priority: 2, rule: '7 = point, keeps rolling' },
    ],
  },
  'super-hot-roll': {
    id: 'super-hot-roll',
    name: 'Super Hot Roll',
    shortName: 'SHR',
    category: 'multi-play',
    description: 'Enhanced Hot Roll with better odds.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.70, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + enhanced dice',
    strategyTips: [
      { priority: 1, rule: 'Better multiplier structure' },
    ],
  },

  // ============================================
  // WHEEL BONUS GAMES
  // ============================================
  'wheel-poker': {
    id: 'wheel-poker',
    name: 'Wheel Poker',
    shortName: 'WP',
    category: 'wheel',
    description: 'Quads trigger wheel spin for bonus.',
    popularity: 55,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.20, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + wheel bonus',
    strategyTips: [
      { priority: 1, rule: 'Four of a kind spins the wheel' },
      { priority: 2, rule: 'Wheel can give big multipliers' },
    ],
  },
  'wheel-poker-deluxe': {
    id: 'wheel-poker-deluxe',
    name: 'Wheel Poker Deluxe',
    shortName: 'WPD',
    category: 'wheel',
    description: 'Enhanced Wheel Poker.',
    popularity: 45,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + better wheel',
    strategyTips: [
      { priority: 1, rule: 'Better wheel prizes' },
    ],
  },
  'ultimate-x-wheel': {
    id: 'ultimate-x-wheel',
    name: 'Ultimate X Wheel Poker',
    shortName: 'UXW',
    category: 'wheel',
    description: 'Ultimate X combined with wheel bonus.',
    popularity: 50,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.65, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + UX + wheel',
    strategyTips: [
      { priority: 1, rule: 'Multipliers AND wheel bonus' },
    ],
  },
  'quick-quads': {
    id: 'quick-quads',
    name: 'Quick Quads',
    shortName: 'QQ',
    category: 'wheel',
    description: 'Extra bet adds "quick quad" bonus cards.',
    popularity: 60,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.52, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + quick quad bonus',
    strategyTips: [
      { priority: 1, rule: 'Extra bet for bonus quick quad cards' },
      { priority: 2, rule: 'Bonus cards help make quads' },
    ],
  },
  'lucky-quads-wheel': {
    id: 'lucky-quads-wheel',
    name: "Lucky Quads Wheel Poker",
    shortName: 'LQW',
    category: 'wheel',
    description: 'Quads trigger wheel and quick quads.',
    popularity: 40,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.00, rating: 'OK' },
    ],
    keyLookup: 'Base pay + wheel + quick quads',
    strategyTips: [
      { priority: 1, rule: 'Multiple bonus features' },
    ],
  },
  'wheel-of-fortune-poker': {
    id: 'wheel-of-fortune-poker',
    name: 'Wheel of Fortune Poker',
    shortName: 'WoF',
    category: 'wheel',
    description: 'Licensed WoF theme with wheel bonus.',
    popularity: 50,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.10, rating: 'OK' },
    ],
    keyLookup: 'Base pay + WoF wheel',
    strategyTips: [
      { priority: 1, rule: 'Standard wheel mechanic, WoF theme' },
    ],
  },

  // ============================================
  // SPECIALTY GAMES
  // ============================================
  'pick-em-poker': {
    id: 'pick-em-poker',
    name: "Pick'em Poker",
    shortName: 'PeP',
    category: 'specialty',
    description: 'Pick 1 of 2 columns. Only 2 decision points.',
    popularity: 50,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 9, fl: 6, return: 99.95, rating: 'HUNT' },
    ],
    keyLookup: 'Standard pay table',
    strategyTips: [
      { priority: 1, rule: 'Only 2 decisions per hand' },
      { priority: 2, rule: 'Much simpler than standard VP' },
      { priority: 3, rule: 'Pick highest value column' },
    ],
  },
  'draw-poker-dream-card': {
    id: 'draw-poker-dream-card',
    name: 'Dream Card Poker',
    shortName: 'DC',
    category: 'specialty',
    description: 'Pick a "dream card" before the deal.',
    popularity: 40,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 8, fl: 5, return: 99.50, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Pick card you want before deal' },
      { priority: 2, rule: 'Changes strategy significantly' },
    ],
  },
  'peek-and-play': {
    id: 'peek-and-play',
    name: 'Peek and Play Poker',
    shortName: 'PnP',
    category: 'specialty',
    description: 'See one draw card before hold decision.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.60, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'See one replacement card early' },
      { priority: 2, rule: 'Changes hold decisions' },
    ],
  },
  'super-peek-and-play': {
    id: 'super-peek-and-play',
    name: 'Super Peek and Play',
    shortName: 'SPnP',
    category: 'specialty',
    description: 'Enhanced Peek and Play.',
    popularity: 35,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.65, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'See more peek cards' },
    ],
  },
  'look-ahead': {
    id: 'look-ahead',
    name: 'Look Ahead Poker',
    shortName: 'LA',
    category: 'specialty',
    description: 'See future cards before decision.',
    popularity: 35,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.40, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Similar to Peek and Play' },
    ],
  },
  'super-look-ahead': {
    id: 'super-look-ahead',
    name: 'Super Look Ahead Poker',
    shortName: 'SLA',
    category: 'specialty',
    description: 'Enhanced Look Ahead.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.50, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'More look ahead cards' },
    ],
  },
  'double-draw': {
    id: 'double-draw',
    name: 'Double Draw Poker',
    shortName: 'DDr',
    category: 'specialty',
    description: 'Two draw phases. Unique mechanic.',
    popularity: 35,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 8, fl: 5, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Get two chances to draw' },
      { priority: 2, rule: 'Different strategy required' },
    ],
  },
  'double-pay': {
    id: 'double-pay',
    name: 'Double Pay Poker',
    shortName: 'DP',
    category: 'specialty',
    description: 'Certain hands pay double.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.40, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table + double feature',
    strategyTips: [
      { priority: 1, rule: 'Specific hands pay 2x' },
    ],
  },
  '2-ways-royal': {
    id: '2-ways-royal',
    name: '2 Ways Royal',
    shortName: '2WR',
    category: 'specialty',
    description: 'Two ways to make a Royal Flush.',
    popularity: 35,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 8, fl: 5, return: 99.45, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Hi and Lo royals both pay' },
    ],
  },
  'shockwave': {
    id: 'shockwave',
    name: 'Shockwave Poker',
    shortName: 'SW',
    category: 'specialty',
    description: 'Special bonus feature poker.',
    popularity: 40,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.50, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Bonus feature mechanic' },
    ],
  },
  'all-aces': {
    id: 'all-aces',
    name: 'All Aces Video Poker',
    shortName: 'ALA',
    category: 'specialty',
    description: 'Four Aces pays extremely high.',
    popularity: 45,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.92, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + Ace bonus',
    strategyTips: [
      { priority: 1, rule: 'Aces are extremely valuable' },
    ],
  },
  'five-aces': {
    id: 'five-aces',
    name: 'Five Aces Poker',
    shortName: '5A',
    category: 'specialty',
    description: 'Wild card allows 5 Aces.',
    popularity: 30,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 7, fl: 5, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: '5 Aces possible with wild' },
    ],
  },
  'sequential-royal': {
    id: 'sequential-royal',
    name: 'Sequential Royal',
    shortName: 'SR',
    category: 'specialty',
    description: 'Sequential Royal pays huge bonus.',
    popularity: 35,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.20, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + sequential bonus',
    strategyTips: [
      { priority: 1, rule: '10-J-Q-K-A in order = mega pay' },
    ],
  },
  'chase-the-royal': {
    id: 'chase-the-royal',
    name: 'Chase The Royal',
    shortName: 'CTR',
    category: 'specialty',
    description: 'Progressive royal chase mechanic.',
    popularity: 40,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.50, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Chase mechanic for royals' },
    ],
  },
  'reversible-royals': {
    id: 'reversible-royals',
    name: 'Reversible Royals',
    shortName: 'RR',
    category: 'specialty',
    description: 'Royals can go both directions.',
    popularity: 30,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.55, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'A-2-3-4-5 royal pays too' },
    ],
  },
  'flush-fever': {
    id: 'flush-fever',
    name: 'Flush Fever',
    shortName: 'FF',
    category: 'specialty',
    description: '4 to a flush gets free redraws.',
    popularity: 45,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.60, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + flush fever bonus',
    strategyTips: [
      { priority: 1, rule: '4 suited = free redraws for flush' },
      { priority: 2, rule: 'Makes flush draws more valuable' },
    ],
  },
  'atomic-fever': {
    id: 'atomic-fever',
    name: 'Atomic Fever',
    shortName: 'AF',
    category: 'specialty',
    description: 'Fever bonus variant.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.40, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + fever bonus',
    strategyTips: [
      { priority: 1, rule: 'Fever mechanic variant' },
    ],
  },
  'fever-aces': {
    id: 'fever-aces',
    name: 'Fever Aces',
    shortName: 'FA',
    category: 'specialty',
    description: 'Ace-focused fever variant.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + ace fever',
    strategyTips: [
      { priority: 1, rule: 'Aces trigger fever bonus' },
    ],
  },
  'extra-draw-frenzy': {
    id: 'extra-draw-frenzy',
    name: 'Extra Draw Frenzy',
    shortName: 'EDF',
    category: 'specialty',
    description: 'Extra draw opportunities.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.70, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + extra draws',
    strategyTips: [
      { priority: 1, rule: 'More draw opportunities' },
      { priority: 2, rule: 'Good return with proper play' },
    ],
  },
  'face-card-frenzy': {
    id: 'face-card-frenzy',
    name: 'Face Card Frenzy',
    shortName: 'FCF',
    category: 'specialty',
    description: 'Face cards trigger frenzy bonus.',
    popularity: 35,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.40, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + face frenzy',
    strategyTips: [
      { priority: 1, rule: 'Face cards more valuable' },
    ],
  },
  'magic-deal': {
    id: 'magic-deal',
    name: 'Magic Deal',
    shortName: 'MD',
    category: 'specialty',
    description: 'Magic card changes one card.',
    popularity: 35,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.35, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Magic card transforms' },
    ],
  },
  'power-quads': {
    id: 'power-quads',
    name: 'Power Quads',
    shortName: 'PQ',
    category: 'specialty',
    description: 'Enhanced quad payouts.',
    popularity: 40,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.45, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + quad bonus',
    strategyTips: [
      { priority: 1, rule: 'Extra value on quads' },
    ],
  },
  'straight-flush-bonus': {
    id: 'straight-flush-bonus',
    name: 'Straight Flush Bonus',
    shortName: 'SFB',
    category: 'specialty',
    description: 'Enhanced straight flush pays.',
    popularity: 35,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.60, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + SF bonus',
    strategyTips: [
      { priority: 1, rule: 'SF draws more valuable' },
    ],
  },
  'powerhouse': {
    id: 'powerhouse',
    name: 'Powerhouse Poker',
    shortName: 'PH',
    category: 'specialty',
    description: 'Enhanced power feature.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Power feature mechanic' },
    ],
  },
  'jackpot-poker': {
    id: 'jackpot-poker',
    name: 'Jackpot Poker',
    shortName: 'JP',
    category: 'specialty',
    description: 'Progressive jackpot feature.',
    popularity: 45,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 98.50, rating: 'OK' },
    ],
    keyLookup: 'Base pay + jackpot (varies)',
    strategyTips: [
      { priority: 1, rule: 'Progressive adds value' },
      { priority: 2, rule: 'Check meter level' },
    ],
  },
};
// Card deck for hand analyzer
const SUITS = [
  { symbol: '♠', name: 'spades', color: 'text-black', pickerColor: 'text-white' },
  { symbol: '♥', name: 'hearts', color: 'text-red-500', pickerColor: 'text-red-400' },
  { symbol: '♦', name: 'diamonds', color: 'text-red-500', pickerColor: 'text-red-400' },
  { symbol: '♣', name: 'clubs', color: 'text-black', pickerColor: 'text-white' }
];
const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const RANK_VALUES = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
const HIGH_CARDS = ['A', 'K', 'Q', 'J'];

// Hand evaluation functions
const evaluateHand = (cards, gameType = 'jacks-or-better') => {
  if (!cards || cards.length !== 5 || cards.some(c => !c)) return null;
  
  // Check if this is a deuces wild variant
  const deucesWildGames = ['deuces-wild', 'bonus-deuces-wild', 'double-bonus-deuces-wild', 'super-bonus-deuces-wild', 'loose-deuces', 'double-deuces', 'deuces-and-joker', 'faces-n-deuces', 'acey-deucey'];
  const isDeucesWild = deucesWildGames.includes(gameType);
  
  const ranks = cards.map(c => c.rank);
  const suits = cards.map(c => c.suit);
  const values = cards.map(c => RANK_VALUES[c.rank]).sort((a, b) => a - b);
  
  // Count suits and ranks
  const suitCounts = {};
  const rankCounts = {};
  suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
  ranks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);
  
  // For deuces wild, count wilds and adjust
  const deuceCount = isDeucesWild ? (rankCounts['2'] || 0) : 0;
  
  // For deuces wild evaluation
  if (isDeucesWild && deuceCount > 0) {
    // Get non-deuce cards
    const nonDeuceRanks = ranks.filter(r => r !== '2');
    const nonDeuceSuits = cards.filter(c => c.rank !== '2').map(c => c.suit);
    
    const ndRankCounts = {};
    nonDeuceRanks.forEach(r => ndRankCounts[r] = (ndRankCounts[r] || 0) + 1);
    const ndSortedCounts = Object.values(ndRankCounts).sort((a, b) => b - a);
    const maxOfKind = (ndSortedCounts[0] || 0) + deuceCount;
    
    // Check for 5 of a kind
    if (maxOfKind >= 5) return { name: 'Five of a Kind', rank: 2, payout: 15 };
    
    // Check for wild royal / straight flush / flush / straight
    const ndSuitCounts = {};
    nonDeuceSuits.forEach(s => ndSuitCounts[s] = (ndSuitCounts[s] || 0) + 1);
    const maxSameSuit = Math.max(...Object.values(ndSuitCounts), 0);
    const isFlushPossible = maxSameSuit + deuceCount >= 5;
    
    // Check for royal flush with wilds
    if (isFlushPossible) {
      const flushSuit = Object.keys(ndSuitCounts).find(s => ndSuitCounts[s] === maxSameSuit);
      const flushCards = cards.filter(c => c.suit === flushSuit && c.rank !== '2');
      const royalRanks = ['A', 'K', 'Q', 'J', '10'];
      const royalCount = flushCards.filter(c => royalRanks.includes(c.rank)).length;
      if (royalCount + deuceCount >= 5 && flushCards.every(c => royalRanks.includes(c.rank))) {
        return { name: deuceCount > 0 ? 'Wild Royal Flush' : 'Natural Royal Flush', rank: 1, payout: deuceCount > 0 ? 25 : 800 };
      }
    }
    
    // 4 of a kind
    if (maxOfKind >= 4) return { name: 'Four of a Kind', rank: 3, payout: 5 };
    
    // Full house (trips + pair with wilds)
    const secondHighest = ndSortedCounts[1] || 0;
    if (ndSortedCounts[0] + deuceCount >= 3 && secondHighest >= 2) {
      return { name: 'Full House', rank: 4, payout: 3 };
    }
    
    // Flush
    if (isFlushPossible) return { name: 'Flush', rank: 5, payout: 2 };
    
    // Straight check with wilds
    const ndValues = cards.filter(c => c.rank !== '2').map(c => RANK_VALUES[c.rank]);
    const uniqueNdValues = [...new Set(ndValues)].sort((a, b) => a - b);
    // Check if we can make a straight with deuces filling gaps
    let canMakeStraight = false;
    for (let start = 1; start <= 10; start++) {
      const target = [start, start+1, start+2, start+3, start+4].map(v => v > 13 ? v - 13 + 1 : v);
      // Handle ace-high (10-J-Q-K-A)
      if (start === 10) {
        const aceHighTarget = [10, 11, 12, 13, 14];
        const missing = aceHighTarget.filter(v => !uniqueNdValues.includes(v)).length;
        if (missing <= deuceCount) canMakeStraight = true;
      } else {
        const missing = target.filter(v => !uniqueNdValues.includes(v)).length;
        if (missing <= deuceCount && uniqueNdValues.every(v => target.includes(v) || v === 14)) canMakeStraight = true;
      }
    }
    // Check wheel (A-2-3-4-5) - but 2s are wild so it's A-3-4-5 + wilds
    const wheelTarget = [14, 3, 4, 5]; // A, 3, 4, 5 (2 is wild)
    const wheelMissing = wheelTarget.filter(v => !uniqueNdValues.includes(v)).length;
    if (wheelMissing <= deuceCount && uniqueNdValues.every(v => wheelTarget.includes(v))) canMakeStraight = true;
    
    if (canMakeStraight) return { name: 'Straight', rank: 6, payout: 2 };
    
    // Three of a kind
    if (maxOfKind >= 3) return { name: 'Three of a Kind', rank: 7, payout: 1 };
    
    // In deuces wild, pairs don't pay - minimum is 3 of a kind
    return { name: 'No Win', rank: 11, payout: 0 };
  }
  
  // Standard (non-wild) evaluation
  const isFlush = Object.values(suitCounts).some(c => c === 5);
  const sortedCounts = Object.values(rankCounts).sort((a, b) => b - a);
  
  // Check for straight (including wheel: A-2-3-4-5)
  const uniqueValues = [...new Set(values)];
  const isWheel = uniqueValues.length === 5 && 
    uniqueValues.includes(14) && uniqueValues.includes(2) && 
    uniqueValues.includes(3) && uniqueValues.includes(4) && uniqueValues.includes(5);
  const isRegularStraight = uniqueValues.length === 5 && (values[4] - values[0] === 4);
  const isStraight = isWheel || isRegularStraight;
  
  // Check for royal (10-J-Q-K-A)
  const isRoyal = uniqueValues.length === 5 && 
    [10, 11, 12, 13, 14].every(v => uniqueValues.includes(v));
  
  // Determine hand
  if (isRoyal && isFlush) return { name: 'Royal Flush', rank: 1, payout: 800 };
  if (isStraight && isFlush) return { name: 'Straight Flush', rank: 2, payout: 50 };
  if (sortedCounts[0] === 4) {
    const quadRank = Object.keys(rankCounts).find(r => rankCounts[r] === 4);
    if (gameType === 'double-double-bonus') {
      const kicker = Object.keys(rankCounts).find(r => rankCounts[r] === 1);
      if (quadRank === 'A' && ['2', '3', '4'].includes(kicker)) return { name: 'Four Aces + 2-4', rank: 3, payout: 400 };
      if (['2', '3', '4'].includes(quadRank) && ['A', '2', '3', '4'].includes(kicker)) return { name: 'Four 2-4 + A-4', rank: 3, payout: 160 };
    }
    if (gameType === 'double-bonus' || gameType === 'double-double-bonus') {
      if (quadRank === 'A') return { name: 'Four Aces', rank: 3, payout: 160 };
      if (['2', '3', '4'].includes(quadRank)) return { name: 'Four 2-4', rank: 3, payout: 80 };
      return { name: 'Four 5-K', rank: 3, payout: 50 };
    }
    if (gameType === 'bonus-poker') {
      if (quadRank === 'A') return { name: 'Four Aces', rank: 3, payout: 80 };
      if (['2', '3', '4'].includes(quadRank)) return { name: 'Four 2-4', rank: 3, payout: 40 };
      return { name: 'Four 5-K', rank: 3, payout: 25 };
    }
    return { name: 'Four of a Kind', rank: 3, payout: 25 };
  }
  if (sortedCounts[0] === 3 && sortedCounts[1] === 2) return { name: 'Full House', rank: 4, payout: 9 };
  if (isFlush) return { name: 'Flush', rank: 5, payout: 6 };
  if (isStraight) return { name: 'Straight', rank: 6, payout: 4 };
  if (sortedCounts[0] === 3) return { name: 'Three of a Kind', rank: 7, payout: 3 };
  if (sortedCounts[0] === 2 && sortedCounts[1] === 2) return { name: 'Two Pair', rank: 8, payout: 2 };
  if (sortedCounts[0] === 2) {
    const pairRank = Object.keys(rankCounts).find(r => rankCounts[r] === 2);
    if (HIGH_CARDS.includes(pairRank)) return { name: 'Jacks or Better', rank: 9, payout: 1 };
    return { name: 'Low Pair', rank: 10, payout: 0 };
  }
  return { name: 'High Card', rank: 11, payout: 0 };
};

// Analyze draws and potential
const analyzeDraws = (cards) => {
  if (!cards || cards.length !== 5) return {};
  
  const ranks = cards.map(c => c.rank);
  const suits = cards.map(c => c.suit);
  const values = cards.map(c => RANK_VALUES[c.rank]);
  
  const suitCounts = {};
  const rankCounts = {};
  suits.forEach((s, i) => {
    if (!suitCounts[s]) suitCounts[s] = [];
    suitCounts[s].push(i);
  });
  ranks.forEach((r, i) => {
    if (!rankCounts[r]) rankCounts[r] = [];
    rankCounts[r].push(i);
  });
  
  const draws = {};
  
  // Check for flush draws
  Object.entries(suitCounts).forEach(([suit, indices]) => {
    if (indices.length === 4) {
      draws.fourToFlush = { indices, suit };
    }
    if (indices.length >= 3) {
      // Check for royal draw
      const flushCards = indices.map(i => cards[i]);
      const royalRanks = ['A', 'K', 'Q', 'J', '10'];
      const royalIndices = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalIndices.length === 4) {
        draws.fourToRoyal = { indices: royalIndices };
      } else if (royalIndices.length === 3) {
        draws.threeToRoyal = { indices: royalIndices };
      }
    }
  });
  
  // Check for straight draws
  const sortedValues = [...new Set(values)].sort((a, b) => a - b);
  // 4 to a straight (open-ended or inside)
  for (let i = 1; i <= 10; i++) {
    const straightValues = [i, i+1, i+2, i+3, i+4];
    if (i === 10) straightValues[4] = 14; // 10-J-Q-K-A
    const matchingIndices = [];
    straightValues.forEach(v => {
      const idx = values.indexOf(v === 14 && !values.includes(14) ? 1 : v);
      if (values.includes(v)) {
        matchingIndices.push(values.indexOf(v));
      }
    });
    // Also check for wheel (A-2-3-4-5)
  }
  
  // Check for pairs/trips
  Object.entries(rankCounts).forEach(([rank, indices]) => {
    if (indices.length === 3) draws.threeOfKind = { indices, rank };
    if (indices.length === 2) {
      if (HIGH_CARDS.includes(rank)) {
        draws.highPair = { indices, rank };
      } else {
        draws.lowPair = { indices, rank };
      }
    }
  });
  
  // High cards
  const highCardIndices = cards.map((c, i) => HIGH_CARDS.includes(c.rank) ? i : -1).filter(i => i >= 0);
  if (highCardIndices.length > 0) draws.highCards = { indices: highCardIndices };
  
  return draws;
};

// ============================================
// WoO-VERIFIED VIDEO POKER STRATEGY ENGINE
// Source: wizardofodds.com
// ============================================

// Pay table ID mapping from game/FH/FL to strategy key
const PAY_TABLE_STRATEGIES = {
  // JACKS OR BETTER - FH/FL combinations
  'jacks-or-better': {
    '9/6': 'JOB_9_6', '8/6': 'JOB_8_6', '8/5': 'JOB_9_6', // 8/5 uses 9/6 per WoO (0.01% penalty)
    '9/5': 'JOB_9_6', '7/5': 'JOB_9_6', '6/5': 'JOB_9_6'
  },
  'tens-or-better': { '6/5': 'JOB_9_6', '5/5': 'JOB_9_6' },
  
  // BONUS POKER FAMILY
  'bonus-poker': { '8/5': 'BP_8_5', '7/5': 'BP_8_5', '6/5': 'BP_8_5' },
  'bonus-poker-deluxe': { '9/6': 'BP_8_5', '9/5': 'BP_8_5', '8/6': 'BP_8_5', '8/5': 'BP_8_5' },
  'double-bonus': { '10/7': 'DB_10_7', '9/7': 'DB_10_7', '9/6': 'DB_10_7', '9/5': 'DB_10_7' },
  'double-double-bonus': { '10/6': 'DDB_9_6', '9/6': 'DDB_9_6', '9/5': 'DDB_9_6', '8/5': 'DDB_9_6' },
  'triple-double-bonus': { '9/7': 'TDB_9_7', '9/6': 'TDB_9_7', '9/5': 'TDB_9_7', '8/5': 'TDB_9_7' },
  'super-double-bonus': { '9/6': 'DB_10_7', '8/5': 'DB_10_7' },
  
  // DEUCES WILD FAMILY
  'deuces-wild': { 'NSUD': 'DW_NSUD', 'Illinois': 'DW_NSUD', 'Colorado': 'DW_NSUD', '16/10': 'DW_NSUD', '15/9': 'DW_NSUD', '13/8': 'DW_NSUD' },
  'bonus-deuces-wild': { '13/4': 'BDW_13_4', '9/4': 'BDW_13_4', '9/4/4': 'BDW_13_4' },
  'loose-deuces': { '17/10': 'LD_FULL', '15/8': 'LD_FULL', '12/11': 'LD_FULL' },
  
  // JOKER POKER (53-card deck)
  'joker-poker-kings': { '20/7': 'JPK_FULL', '17/7': 'JPK_FULL', '15/7': 'JPK_FULL' },
  'joker-poker-twopair': { '20/8': 'JP2_FULL', '17/7': 'JP2_FULL', '20/10': 'JP2_FULL' },
  
  // ULTIMATE X VARIANTS (use base game strategies - multipliers add ~0.2% but don't change optimal play)
  // Per WoO: "The basic strategy for Ultimate X is identical to the base game"
  'ultimate-x-jacks': { '9/6': 'JOB_9_6', '8/5': 'JOB_9_6' },
  'ultimate-x-bonus': { '8/5': 'BP_8_5', '7/5': 'BP_8_5' },
  'ultimate-x-ddb': { '9/6': 'DDB_9_6', '9/5': 'DDB_9_6' },
  'ultimate-x-double-bonus': { '9/7': 'DB_10_7', '9/6': 'DB_10_7' },
  'ultimate-x-bpd': { '9/6': 'BP_8_5', '8/5': 'BP_8_5' }, // Bonus Poker Deluxe uses BP strategy
  'ultimate-x-joker': { '20/7': 'JPK_FULL', '17/7': 'JPK_FULL' },
};

// WoO Optimal Strategy Hierarchies
// Each entry: { rank, name, ev, check: function(cards, analysis) => { indices } or null }

const STRATEGY_HIERARCHIES = {
  // ============================================
  // JACKS OR BETTER 9/6 (36 lines) - WoO Optimal
  // Return: 99.54%
  // ============================================
  'JOB_9_6': [
    { rank: 1, name: "Royal Flush", ev: 800.0000, check: (c, h) => h.isRoyalFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 2, name: "Straight Flush", ev: 50.0000, check: (c, h) => h.isStraightFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 3, name: "Four of a Kind", ev: 25.0000, check: (c, h) => h.is4K ? { indices: [0,1,2,3,4] } : null },
    { rank: 4, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    { rank: 5, name: "Full House", ev: 9.0000, check: (c, h) => h.isFullHouse ? { indices: [0,1,2,3,4] } : null },
    { rank: 6, name: "Flush", ev: 6.0000, check: (c, h) => h.isFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 7, name: "Three of a Kind", ev: 4.3025, check: (c, h) => h.trips },
    { rank: 8, name: "Straight", ev: 4.0000, check: (c, h) => h.isStraight ? { indices: [0,1,2,3,4] } : null },
    { rank: 9, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 10, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 11, name: "High Pair (J+)", ev: 1.5365, check: (c, h) => h.highPair },
    { rank: 12, name: "3 to Royal Flush", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 13, name: "4 to Flush", ev: 1.2766, check: (c, h) => h.fourToFlush },
    { rank: 14, name: "TJQK Unsuited", ev: 0.8723, check: (c, h) => h.unsuitedTJQK },
    { rank: 15, name: "Low Pair", ev: 0.8237, check: (c, h) => h.lowPair },
    { rank: 16, name: "4 to Outside Straight", ev: 0.6809, check: (c, h) => h.fourToOutside },
    { rank: 17, name: "3 to SF (Type 1)", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 18, name: "Suited QJ", ev: 0.6004, check: (c, h) => h.suitedQJ },
    { rank: 19, name: "JQKA Unsuited", ev: 0.5957, check: (c, h) => h.unsuitedJQKA },
    { rank: 20, name: "Suited KQ/KJ", ev: 0.5821, check: (c, h) => h.suitedKQKJ },
    { rank: 21, name: "Suited AK/AQ/AJ", ev: 0.5678, check: (c, h) => h.suitedAHigh },
    { rank: 22, name: "4 to Inside Straight (3 HC)", ev: 0.5319, check: (c, h) => h.fourToInside3HC },
    { rank: 23, name: "3 to SF (Type 2)", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 24, name: "JQK Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedJQK },
    { rank: 25, name: "JQ Unsuited", ev: 0.4980, check: (c, h) => h.unsuitedJQ },
    { rank: 26, name: "Suited TJ", ev: 0.4968, check: (c, h) => h.suitedTJ },
    { rank: 27, name: "KQ/KJ Unsuited", ev: 0.4862, check: (c, h) => h.unsuitedKQKJ },
    { rank: 28, name: "Suited TQ", ev: 0.4825, check: (c, h) => h.suitedTQ },
    { rank: 29, name: "AK/AQ/AJ Unsuited", ev: 0.4743, check: (c, h) => h.unsuitedAHigh },
    { rank: 30, name: "J Only", ev: 0.4713, check: (c, h) => h.singleJ },
    { rank: 31, name: "Suited TK", ev: 0.4682, check: (c, h) => h.suitedTK },
    { rank: 32, name: "Q Only", ev: 0.4681, check: (c, h) => h.singleQ },
    { rank: 33, name: "K Only", ev: 0.4649, check: (c, h) => h.singleK },
    { rank: 34, name: "A Only", ev: 0.4640, check: (c, h) => h.singleA },
    { rank: 35, name: "3 to SF (Type 3)", ev: 0.4431, check: (c, h) => h.threeToSF3 },
    { rank: 36, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
  
  // ============================================
  // JACKS OR BETTER 8/6 (27 lines) - WoO
  // Return: 98.39%
  // Key difference: Flush/Straight moved up relative to Two Pair
  // ============================================
  'JOB_8_6': [
    { rank: 1, name: "Full House or better", ev: 8.0000, check: (c, h) => (h.isRoyalFlush || h.isStraightFlush || h.is4K || h.isFullHouse) ? { indices: [0,1,2,3,4] } : null },
    { rank: 2, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    { rank: 3, name: "Three of a Kind", ev: 4.3025, check: (c, h) => h.trips },
    { rank: 4, name: "Flush", ev: 6.0000, check: (c, h) => h.isFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 5, name: "Straight", ev: 4.0000, check: (c, h) => h.isStraight ? { indices: [0,1,2,3,4] } : null },
    { rank: 6, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 7, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 8, name: "High Pair", ev: 1.5365, check: (c, h) => h.highPair },
    { rank: 9, name: "3 to Royal Flush", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 10, name: "4 to Flush", ev: 1.2766, check: (c, h) => h.fourToFlush },
    { rank: 11, name: "TJQK Unsuited", ev: 0.8723, check: (c, h) => h.unsuitedTJQK },
    { rank: 12, name: "Low Pair", ev: 0.8237, check: (c, h) => h.lowPair },
    { rank: 13, name: "4 to Outside Straight", ev: 0.6809, check: (c, h) => h.fourToOutside },
    { rank: 14, name: "3 to SF (Type 1)", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 15, name: "JQKA Unsuited", ev: 0.5957, check: (c, h) => h.unsuitedJQKA },
    { rank: 16, name: "2 to Royal: JQ/JK/QK/JA/QA/KA", ev: 0.5750, check: (c, h) => h.twoToRoyalHigh },
    { rank: 17, name: "4 to Inside Straight 3HC", ev: 0.5319, check: (c, h) => h.fourToInside3HC },
    { rank: 18, name: "3 to SF (Type 2)", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 19, name: "JQK Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedJQK },
    { rank: 20, name: "JQ/QK Unsuited", ev: 0.4930, check: (c, h) => h.unsuitedJQ || h.unsuitedQK },
    { rank: 21, name: "Suited TJ/TQ", ev: 0.4896, check: (c, h) => h.suitedTJ || h.suitedTQ },
    { rank: 22, name: "JK/QA Unsuited", ev: 0.4802, check: (c, h) => h.unsuitedJK || h.unsuitedQA },
    { rank: 23, name: "JA/KA Unsuited", ev: 0.4743, check: (c, h) => h.unsuitedJA || h.unsuitedKA },
    { rank: 24, name: "Suited TK", ev: 0.4682, check: (c, h) => h.suitedTK },
    { rank: 25, name: "Single J/Q/K/A", ev: 0.4671, check: (c, h) => h.singleJ || h.singleQ || h.singleK || h.singleA },
    { rank: 26, name: "3 to SF (Type 3)", ev: 0.4431, check: (c, h) => h.threeToSF3 },
    { rank: 27, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
  
  // ============================================
  // BONUS POKER 8/5 (28 lines) - WoO
  // Return: 99.17%
  // ============================================
  'BP_8_5': [
    { rank: 1, name: "Pat 4K/SF/RF", ev: 25.0000, check: (c, h) => (h.isRoyalFlush || h.isStraightFlush || h.is4K) ? { indices: [0,1,2,3,4] } : null },
    { rank: 2, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    { rank: 3, name: "Pat Straight/Flush/FH", ev: 6.0000, check: (c, h) => (h.isStraight || h.isFlush || h.isFullHouse) ? { indices: [0,1,2,3,4] } : null },
    { rank: 4, name: "Three of a Kind", ev: 4.3025, check: (c, h) => h.trips },
    { rank: 5, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 6, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 7, name: "High Pair", ev: 1.5365, check: (c, h) => h.highPair },
    { rank: 8, name: "3 to Royal Flush", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 9, name: "4 to Flush", ev: 1.2766, check: (c, h) => h.fourToFlush },
    { rank: 10, name: "KQJT Unsuited", ev: 0.8723, check: (c, h) => h.unsuitedTJQK },
    { rank: 11, name: "Low Pair", ev: 0.8237, check: (c, h) => h.lowPair },
    { rank: 12, name: "4 to Outside Straight", ev: 0.6809, check: (c, h) => h.fourToOutside },
    { rank: 13, name: "3 to SF Type 1", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 14, name: "AKQJ Unsuited", ev: 0.5957, check: (c, h) => h.unsuitedJQKA },
    { rank: 15, name: "2 Suited High Cards", ev: 0.5750, check: (c, h) => h.suitedTwoHigh },
    { rank: 16, name: "3 to SF Type 2", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 17, name: "4 to Inside Straight 3HC", ev: 0.5319, check: (c, h) => h.fourToInside3HC },
    { rank: 18, name: "JQK Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedJQK },
    { rank: 19, name: "JQ Unsuited", ev: 0.4980, check: (c, h) => h.unsuitedJQ },
    { rank: 20, name: "3 to SF Type 3", ev: 0.4700, check: (c, h) => h.threeToSF3 },
    { rank: 21, name: "KQ/KJ Unsuited", ev: 0.4862, check: (c, h) => h.unsuitedKQKJ },
    { rank: 22, name: "Suited JT", ev: 0.4968, check: (c, h) => h.suitedTJ },
    { rank: 23, name: "AK/AQ/AJ Unsuited", ev: 0.4743, check: (c, h) => h.unsuitedAHigh },
    { rank: 24, name: "A Only", ev: 0.4640, check: (c, h) => h.singleA },
    { rank: 25, name: "Suited KT/QT", ev: 0.4753, check: (c, h) => h.suitedKTQT },
    { rank: 26, name: "J/Q/K Only", ev: 0.4680, check: (c, h) => h.singleJQK },
    { rank: 27, name: "3 to SF Type 4", ev: 0.4431, check: (c, h) => h.threeToSF4 },
    { rank: 28, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
  
  // ============================================
  // DOUBLE BONUS 10/7 (34 lines) - WoO
  // Return: 100.17%
  // ============================================
  'DB_10_7': [
    { rank: 1, name: "Pat SF/4K/RF", ev: 50.0000, check: (c, h) => (h.isRoyalFlush || h.isStraightFlush || h.is4K) ? { indices: [0,1,2,3,4] } : null },
    { rank: 2, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    { rank: 3, name: "Three Aces", ev: 7.6809, check: (c, h) => h.threeAces },
    { rank: 4, name: "Pat Straight/Flush/FH", ev: 7.0000, check: (c, h) => (h.isStraight || h.isFlush || h.isFullHouse) ? { indices: [0,1,2,3,4] } : null },
    { rank: 5, name: "Three of a Kind (not A)", ev: 4.4681, check: (c, h) => h.tripsNonAce },
    { rank: 6, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 7, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 8, name: "High Pair", ev: 1.5365, check: (c, h) => h.highPair },
    { rank: 9, name: "4 to Flush", ev: 1.4894, check: (c, h) => h.fourToFlush },
    { rank: 10, name: "3 to Royal Flush", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 11, name: "4 to Outside Straight", ev: 0.8511, check: (c, h) => h.fourToOutside },
    { rank: 12, name: "Low Pair", ev: 0.8237, check: (c, h) => h.lowPair },
    { rank: 13, name: "AKQJ Unsuited", ev: 0.7447, check: (c, h) => h.unsuitedJQKA },
    { rank: 14, name: "3 to SF Type 1", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 15, name: "4 to Inside Straight 3HC", ev: 0.5745, check: (c, h) => h.fourToInside3HC },
    { rank: 16, name: "Suited QJ", ev: 0.6004, check: (c, h) => h.suitedQJ },
    { rank: 17, name: "3 to Flush 2HC", ev: 0.5532, check: (c, h) => h.threeToFlush2HC },
    { rank: 18, name: "2 Suited High Cards", ev: 0.5750, check: (c, h) => h.suitedTwoHigh },
    { rank: 19, name: "4 to Inside Straight 2HC", ev: 0.5319, check: (c, h) => h.fourToInside2HC },
    { rank: 20, name: "3 to SF Type 2", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 21, name: "4 to Inside Straight 1HC", ev: 0.4894, check: (c, h) => h.fourToInside1HC },
    { rank: 22, name: "KQJ Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedKQJ },
    { rank: 23, name: "Suited JT", ev: 0.4968, check: (c, h) => h.suitedTJ },
    { rank: 24, name: "QJ Unsuited", ev: 0.4980, check: (c, h) => h.unsuitedJQ },
    { rank: 25, name: "3 to Flush 1HC", ev: 0.4787, check: (c, h) => h.threeToFlush1HC },
    { rank: 26, name: "Suited QT", ev: 0.4825, check: (c, h) => h.suitedTQ },
    { rank: 27, name: "3 to SF Type 3", ev: 0.4431, check: (c, h) => h.threeToSF3 },
    { rank: 28, name: "KQ/KJ Unsuited", ev: 0.4862, check: (c, h) => h.unsuitedKQKJ },
    { rank: 29, name: "A Only", ev: 0.4640, check: (c, h) => h.singleA },
    { rank: 30, name: "Suited KT", ev: 0.4682, check: (c, h) => h.suitedTK },
    { rank: 31, name: "J/Q/K Only", ev: 0.4671, check: (c, h) => h.singleJQK },
    { rank: 32, name: "4 to Inside Straight 0HC", ev: 0.4255, check: (c, h) => h.fourToInside0HC },
    { rank: 33, name: "3 to Flush 0HC", ev: 0.4106, check: (c, h) => h.threeToFlush0HC },
    { rank: 34, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
  
  // ============================================
  // DOUBLE DOUBLE BONUS 9/6 (39 lines) - WoO
  // Return: 98.98%
  // ============================================
  'DDB_9_6': [
    { rank: 1, name: "Royal Flush", ev: 800.0000, check: (c, h) => h.isRoyalFlush ? { indices: [0,1,2,3,4] } : null },
    // Pat quads with kicker - keep all 5!
    { rank: 2, name: "4 Aces w/2-4 Kicker", ev: 400.0000, check: (c, h) => h.fourAcesWithKicker },
    { rank: 3, name: "4 2-4s w/A-4 Kicker", ev: 160.0000, check: (c, h) => h.fourLowWithKicker },
    { rank: 4, name: "Four of a Kind", ev: 80.0000, check: (c, h) => h.is4K ? { indices: [0,1,2,3,4] } : null },
    { rank: 5, name: "Straight Flush", ev: 50.0000, check: (c, h) => h.isStraightFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 6, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    // DDB: Do NOT hold kicker with trips! EV for AAA alone (62.45) > AAA+kicker (59.15)
    // You get 2 cards to draw the 4th Ace vs only 1 card if holding kicker
    { rank: 7, name: "Three Aces", ev: 10.42, check: (c, h) => h.threeAces },
    { rank: 8, name: "Full House", ev: 9.0000, check: (c, h) => h.isFullHouse ? { indices: [0,1,2,3,4] } : null },
    { rank: 9, name: "Flush", ev: 6.0000, check: (c, h) => h.isFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 10, name: "Three of a Kind (2s-4s)", ev: 5.50, check: (c, h) => h.threeLow },
    { rank: 11, name: "Straight", ev: 4.0000, check: (c, h) => h.isStraight ? { indices: [0,1,2,3,4] } : null },
    { rank: 12, name: "Three of a Kind", ev: 4.3025, check: (c, h) => h.trips },
    { rank: 13, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 14, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 15, name: "Pair of Aces", ev: 1.6809, check: (c, h) => h.pairAces },
    { rank: 16, name: "3 to RF: JQK", ev: 1.4468, check: (c, h) => h.threeToRoyalJQK },
    { rank: 17, name: "Pair of Kings", ev: 1.5365, check: (c, h) => h.pairKings },
    { rank: 18, name: "3 to RF: TJQ", ev: 1.3617, check: (c, h) => h.threeToRoyalTJQ },
    { rank: 19, name: "Pair of J/Q", ev: 1.5365, check: (c, h) => h.pairJQ },
    { rank: 20, name: "4 to Flush", ev: 1.2766, check: (c, h) => h.fourToFlush },
    { rank: 21, name: "3 to RF (other)", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 22, name: "4 to Straight: 89TJ/9TJQ/TJQK", ev: 0.8723, check: (c, h) => h.fourToStraightHigh },
    { rank: 23, name: "Low Pair", ev: 0.8237, check: (c, h) => h.lowPair },
    { rank: 24, name: "4 to Outside Straight (mid)", ev: 0.6809, check: (c, h) => h.fourToOutside },
    { rank: 25, name: "3 to SF Type 1", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 26, name: "JQKA Unsuited", ev: 0.5957, check: (c, h) => h.unsuitedJQKA },
    { rank: 27, name: "2 to RF: JQ/JK/QK/JA/QA/KA", ev: 0.5750, check: (c, h) => h.twoToRoyalHigh },
    { rank: 28, name: "4 to Inside Straight 3HC", ev: 0.5319, check: (c, h) => h.fourToInside3HC },
    { rank: 29, name: "3 to SF Type 2", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 30, name: "JQK Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedJQK },
    { rank: 31, name: "4 to Inside (89JQ/8TJQ/9TJK/9TQK)", ev: 0.5106, check: (c, h) => h.fourToInsideSpecial },
    { rank: 32, name: "JQ Unsuited", ev: 0.4980, check: (c, h) => h.unsuitedJQ },
    { rank: 33, name: "A Only", ev: 0.4640, check: (c, h) => h.singleA },
    { rank: 34, name: "Suited TJ", ev: 0.4968, check: (c, h) => h.suitedTJ },
    { rank: 35, name: "JK/QK Unsuited", ev: 0.4862, check: (c, h) => h.unsuitedJKQK },
    { rank: 36, name: "3 to Flush 2HC (low)", ev: 0.4787, check: (c, h) => h.threeToFlush2HC },
    { rank: 37, name: "Suited TQ/TK", ev: 0.4753, check: (c, h) => h.suitedTQTK },
    { rank: 38, name: "J/Q/K Only", ev: 0.4671, check: (c, h) => h.singleJQK },
    { rank: 39, name: "3 to SF Type 3", ev: 0.4431, check: (c, h) => h.threeToSF3 },
    { rank: 40, name: "4 to Inside Straight 0HC", ev: 0.4255, check: (c, h) => h.fourToInside0HC },
    { rank: 41, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
  
  // ============================================
  // TRIPLE DOUBLE BONUS 9/7 - WoO
  // Return: 99.58%
  // KEY DIFFERENCE FROM DDB: Hold kicker with 3 Aces/2s/3s/4s
  // because 4A+kicker = 4000 (same as royal!)
  // ============================================
  'TDB_9_7': [
    { rank: 1, name: "Royal Flush", ev: 800.0000, check: (c, h) => h.isRoyalFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 2, name: "4 Aces w/2-4 Kicker", ev: 800.0000, check: (c, h) => h.fourAcesWithKicker },  // Same as royal in TDB!
    { rank: 3, name: "4 2-4s w/A-4 Kicker", ev: 400.0000, check: (c, h) => h.fourLowWithKicker },
    { rank: 4, name: "Four of a Kind", ev: 80.0000, check: (c, h) => h.is4K ? { indices: [0,1,2,3,4] } : null },
    { rank: 5, name: "Straight Flush", ev: 50.0000, check: (c, h) => h.isStraightFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 6, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    // KEY TDB RULE: 3 Aces + kicker (2/3/4) - hold all 4 cards!
    // EV ~97 coins vs ~75 for 3 Aces alone
    { rank: 7, name: "Three Aces + Kicker", ev: 97.13, check: (c, h) => h.threeAcesWithKicker },
    // 3 of 2s/3s/4s with A/2/3/4 kicker
    { rank: 8, name: "Three 2-4s + Kicker", ev: 45.0, check: (c, h) => h.threeLowWithKicker },
    { rank: 9, name: "Three Aces", ev: 75.39, check: (c, h) => h.threeAces },
    { rank: 10, name: "Full House", ev: 9.0000, check: (c, h) => h.isFullHouse ? { indices: [0,1,2,3,4] } : null },
    { rank: 11, name: "Flush", ev: 7.0000, check: (c, h) => h.isFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 12, name: "Straight", ev: 4.0000, check: (c, h) => h.isStraight ? { indices: [0,1,2,3,4] } : null },
    { rank: 13, name: "Three 2-4s", ev: 4.5, check: (c, h) => h.threeLow },
    { rank: 14, name: "Three of a Kind", ev: 4.3025, check: (c, h) => h.trips },
    { rank: 15, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 16, name: "Pair of Aces", ev: 1.6809, check: (c, h) => h.pairAces },
    { rank: 17, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 18, name: "High Pair JQK", ev: 1.5365, check: (c, h) => h.highPairJQK },
    { rank: 19, name: "3 to Royal Flush", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 20, name: "4 to Flush", ev: 1.4894, check: (c, h) => h.fourToFlush },  // Flush pays 7
    { rank: 21, name: "Pair of 2s/3s/4s", ev: 0.9, check: (c, h) => h.pairLow },
    { rank: 22, name: "4 to Outside Straight", ev: 0.8511, check: (c, h) => h.fourToOutside },
    { rank: 23, name: "Low Pair 5-10", ev: 0.8237, check: (c, h) => h.lowPairMid },
    { rank: 24, name: "JQKA Unsuited", ev: 0.7447, check: (c, h) => h.unsuitedJQKA },
    { rank: 25, name: "3 to SF Type 1", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 26, name: "Suited QJ", ev: 0.6004, check: (c, h) => h.suitedQJ },
    { rank: 27, name: "4 to Inside Straight 3HC", ev: 0.5745, check: (c, h) => h.fourToInside3HC },
    { rank: 28, name: "2 Suited High Cards", ev: 0.5750, check: (c, h) => h.suitedTwoHigh },
    { rank: 29, name: "3 to SF Type 2", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 30, name: "4 to Inside Straight 2HC", ev: 0.5319, check: (c, h) => h.fourToInside2HC },
    { rank: 31, name: "JQK Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedJQK },
    { rank: 32, name: "JQ Unsuited", ev: 0.4980, check: (c, h) => h.unsuitedJQ },
    { rank: 33, name: "A Only", ev: 0.4640, check: (c, h) => h.singleA },
    { rank: 34, name: "Suited TJ", ev: 0.4968, check: (c, h) => h.suitedTJ },
    { rank: 35, name: "J/Q/K Only", ev: 0.4671, check: (c, h) => h.singleJQK },
    { rank: 36, name: "3 to SF Type 3", ev: 0.4431, check: (c, h) => h.threeToSF3 },
    { rank: 37, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
};

// ============================================
// WoO HAND ANALYSIS HELPERS
// ============================================

const WOO_RANK_VALUES = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
const WOO_HIGH_CARDS = ['J', 'Q', 'K', 'A'];

function analyzeHandForWoO(cards) {
  if (!cards || cards.length !== 5 || cards.some(c => !c)) return null;
  
  const ranks = cards.map(c => c.rank);
  const suits = cards.map(c => c.suit);
  const values = cards.map(c => WOO_RANK_VALUES[c.rank]);
  
  // Rank and suit counts
  const rankCounts = {};
  const suitCounts = {};
  ranks.forEach((r, i) => { if (!rankCounts[r]) rankCounts[r] = []; rankCounts[r].push(i); });
  suits.forEach((s, i) => { if (!suitCounts[s]) suitCounts[s] = []; suitCounts[s].push(i); });
  
  // Find pairs, trips, quads
  const pairs = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 2);
  const tripsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 3);
  const quads = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 4);
  
  // Flush check
  const flushSuit = Object.entries(suitCounts).find(([s, arr]) => arr.length === 5)?.[0];
  const isFlush = !!flushSuit;
  
  // Straight check
  const sortedValues = [...values].sort((a, b) => a - b);
  const isWheel = sortedValues.join(',') === '2,3,4,5,14';
  const isSequential = !isWheel && sortedValues.every((v, i) => i === 0 || v === sortedValues[i-1] + 1);
  const isStraight = isWheel || isSequential;
  
  // Royal check
  const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
  const isRoyal = isFlush && royalRanks.every(r => ranks.includes(r));
  
  // Build result object with all possible holds
  const result = {
    // Pat hands
    isRoyalFlush: isRoyal,
    isStraightFlush: isFlush && isStraight && !isRoyal,
    is4K: quads.length > 0,
    isFullHouse: tripsArr.length === 1 && pairs.length === 1,
    isFlush: isFlush && !isStraight,
    isStraight: isStraight && !isFlush,
    
    // Made hands
    trips: tripsArr.length > 0 ? { indices: tripsArr[0][1] } : null,
    threeAces: tripsArr.length > 0 && tripsArr[0][0] === 'A' ? { indices: tripsArr[0][1] } : null,
    tripsNonAce: tripsArr.length > 0 && tripsArr[0][0] !== 'A' ? { indices: tripsArr[0][1] } : null,
    twoPair: pairs.length === 2 ? { indices: [...pairs[0][1], ...pairs[1][1]] } : null,
    highPair: pairs.length >= 1 && WOO_HIGH_CARDS.includes(pairs[0][0]) ? { indices: pairs[0][1] } : null,
    lowPair: pairs.length >= 1 && !WOO_HIGH_CARDS.includes(pairs[0][0]) ? { indices: pairs[0][1] } : null,
    pairAces: pairs.find(([r]) => r === 'A') ? { indices: pairs.find(([r]) => r === 'A')[1] } : null,
    pairKings: pairs.find(([r]) => r === 'K') ? { indices: pairs.find(([r]) => r === 'K')[1] } : null,
    pairJQ: pairs.find(([r]) => ['J', 'Q'].includes(r)) ? { indices: pairs.find(([r]) => ['J', 'Q'].includes(r))[1] } : null,
    
    // Drawing hands initialized to null
    fourToRoyal: null, threeToRoyal: null, threeToRoyalJQK: null, threeToRoyalTJQ: null, twoToRoyalHigh: null,
    fourToSF: null, threeToSF1: null, threeToSF2: null, threeToSF3: null, threeToSF4: null,
    fourToFlush: null, threeToFlush2HC: null, threeToFlush1HC: null, threeToFlush0HC: null,
    fourToOutside: null, fourToStraightHigh: null, fourToInside3HC: null, fourToInside2HC: null, 
    fourToInside1HC: null, fourToInside0HC: null, fourToInsideSpecial: null,
    suitedQJ: null, suitedKQKJ: null, suitedAHigh: null, suitedTJ: null, suitedTQ: null, suitedTK: null,
    suitedTQTK: null, suitedKTQT: null, suitedTwoHigh: null,
    unsuitedTJQK: null, unsuitedJQKA: null, unsuitedJQK: null, unsuitedKQJ: null, unsuitedJQ: null,
    unsuitedKQKJ: null, unsuitedJKQK: null, unsuitedAHigh: null, unsuitedQK: null, unsuitedJK: null,
    unsuitedQA: null, unsuitedJA: null, unsuitedKA: null,
    singleA: null, singleK: null, singleQ: null, singleJ: null, singleJQK: null,
    fourAcesWithKicker: null,
    // TDB-specific
    fourLowWithKicker: null,
    threeAcesWithKicker: null,
    threeLowWithKicker: null,
    threeLow: null,
    pairLow: null,
    lowPairMid: null,
    highPairJQK: null
  };
  
  // Check for royal/SF draws
  for (const [suit, indices] of Object.entries(suitCounts)) {
    if (indices.length >= 4) {
      const suitedCards = indices.map(i => cards[i]);
      const suitedRanks = suitedCards.map(c => c.rank);
      const royalCount = suitedRanks.filter(r => royalRanks.includes(r)).length;
      
      // 4 to Royal
      if (royalCount === 4) {
        const royalIndices = indices.filter(i => royalRanks.includes(cards[i].rank));
        result.fourToRoyal = { indices: royalIndices };
      }
      
      // 4 to SF (not royal) - includes both open-ended (span=3) and inside (span=4)
      // Per WoO: 4-SF Open EV ~4.07, 4-SF Inside EV ~2.73 - BOTH beat High Pair (1.54) and 4-Flush (1.28)
      const suitedValues = suitedCards.map(c => WOO_RANK_VALUES[c.rank]).sort((a, b) => a - b);
      const span = suitedValues[suitedValues.length - 1] - suitedValues[0];
      if (span <= 4 && royalCount < 4) {
        // Distinguish between open (span=3) and inside (span=4) for proper ranking
        if (span <= 3) {
          result.fourToSFOpen = { indices };
        } else {
          result.fourToSFInside = { indices };
        }
        // Generic fourToSF for strategies that don't distinguish
        result.fourToSF = { indices };
      }
      
      // 4 to Flush (not SF draw)
      if (!result.fourToSF && !result.fourToRoyal) {
        result.fourToFlush = { indices };
      }
    }
    
    if (indices.length >= 3) {
      const suitedCards = indices.map(i => cards[i]);
      const suitedRanks = suitedCards.map(c => c.rank);
      const royalCount = suitedRanks.filter(r => royalRanks.includes(r)).length;
      
      // 3 to Royal
      if (royalCount >= 3) {
        const royalIndices = indices.filter(i => royalRanks.includes(cards[i].rank)).slice(0, 3);
        result.threeToRoyal = { indices: royalIndices };
        
        const royalRanksHeld = royalIndices.map(i => cards[i].rank);
        if (royalRanksHeld.includes('J') && royalRanksHeld.includes('Q') && royalRanksHeld.includes('K')) {
          result.threeToRoyalJQK = { indices: royalIndices };
        }
        if (royalRanksHeld.includes('10') && royalRanksHeld.includes('J') && royalRanksHeld.includes('Q')) {
          result.threeToRoyalTJQ = { indices: royalIndices };
        }
      }
      
      // 3 to SF - analyze gaps and high cards
      const suitedValues = suitedCards.map(c => WOO_RANK_VALUES[c.rank]).sort((a, b) => a - b);
      const highCount = suitedCards.filter(c => WOO_HIGH_CARDS.includes(c.rank)).length;
      const gaps = suitedValues[suitedValues.length - 1] - suitedValues[0] - (suitedValues.length - 1);
      
      if (suitedValues[suitedValues.length - 1] - suitedValues[0] <= 4) {
        const sfIndices = indices.slice(0, 3);
        if (highCount >= gaps) result.threeToSF1 = { indices: sfIndices };
        else if (gaps === 1 || (gaps === 2 && highCount >= 1)) result.threeToSF2 = { indices: sfIndices };
        else if (gaps === 2 && highCount === 0) result.threeToSF3 = { indices: sfIndices };
        else result.threeToSF4 = { indices: sfIndices };
      }
      
      // 3 to Flush with high cards
      const hcCount = suitedCards.filter(c => WOO_HIGH_CARDS.includes(c.rank)).length;
      if (hcCount >= 2) result.threeToFlush2HC = { indices: indices.slice(0, 3) };
      else if (hcCount === 1) result.threeToFlush1HC = { indices: indices.slice(0, 3) };
      else result.threeToFlush0HC = { indices: indices.slice(0, 3) };
    }
    
    // 2 to Royal (high cards only, no T)
    if (indices.length >= 2) {
      const royalIndices = indices.filter(i => royalRanks.includes(cards[i].rank) && cards[i].rank !== '10');
      if (royalIndices.length >= 2) {
        result.twoToRoyalHigh = { indices: royalIndices.slice(0, 2) };
      }
    }
  }
  
  // Check suited high card pairs
  for (const [suit, indices] of Object.entries(suitCounts)) {
    if (indices.length >= 2) {
      const suitedRanks = indices.map(i => cards[i].rank);
      if (suitedRanks.includes('Q') && suitedRanks.includes('J')) {
        result.suitedQJ = { indices: [indices[suitedRanks.indexOf('Q')], indices[suitedRanks.indexOf('J')]] };
      }
      if (suitedRanks.includes('K') && (suitedRanks.includes('Q') || suitedRanks.includes('J'))) {
        const kIdx = indices[suitedRanks.indexOf('K')];
        const otherIdx = suitedRanks.includes('Q') ? indices[suitedRanks.indexOf('Q')] : indices[suitedRanks.indexOf('J')];
        result.suitedKQKJ = { indices: [kIdx, otherIdx] };
      }
      if (suitedRanks.includes('A') && ['K', 'Q', 'J'].some(r => suitedRanks.includes(r))) {
        const aIdx = indices[suitedRanks.indexOf('A')];
        const otherRank = ['K', 'Q', 'J'].find(r => suitedRanks.includes(r));
        result.suitedAHigh = { indices: [aIdx, indices[suitedRanks.indexOf(otherRank)]] };
      }
      if (suitedRanks.includes('10') && suitedRanks.includes('J')) {
        result.suitedTJ = { indices: [indices[suitedRanks.indexOf('10')], indices[suitedRanks.indexOf('J')]] };
      }
      if (suitedRanks.includes('10') && suitedRanks.includes('Q')) {
        result.suitedTQ = { indices: [indices[suitedRanks.indexOf('10')], indices[suitedRanks.indexOf('Q')]] };
      }
      if (suitedRanks.includes('10') && suitedRanks.includes('K')) {
        result.suitedTK = { indices: [indices[suitedRanks.indexOf('10')], indices[suitedRanks.indexOf('K')]] };
      }
      // Any two suited high cards
      const suitedHigh = indices.filter(i => WOO_HIGH_CARDS.includes(cards[i].rank));
      if (suitedHigh.length >= 2) {
        result.suitedTwoHigh = { indices: suitedHigh.slice(0, 2) };
      }
      if (suitedRanks.includes('10') && (suitedRanks.includes('K') || suitedRanks.includes('Q'))) {
        result.suitedKTQT = result.suitedTK || result.suitedTQ;
        result.suitedTQTK = result.suitedTQ || result.suitedTK;
      }
    }
  }
  
  // Check unsuited combinations
  const findUnsuited = (targetRanks) => {
    const matchingIndices = [];
    for (const targetRank of targetRanks) {
      const idx = cards.findIndex((c, i) => c.rank === targetRank && !matchingIndices.includes(i));
      if (idx >= 0) matchingIndices.push(idx);
    }
    if (matchingIndices.length === targetRanks.length) {
      const matchSuits = matchingIndices.map(i => cards[i].suit);
      if (new Set(matchSuits).size > 1) {
        return { indices: matchingIndices };
      }
    }
    return null;
  };
  
  result.unsuitedTJQK = findUnsuited(['10', 'J', 'Q', 'K']);
  result.unsuitedJQKA = findUnsuited(['J', 'Q', 'K', 'A']);
  result.unsuitedJQK = findUnsuited(['J', 'Q', 'K']);
  result.unsuitedKQJ = result.unsuitedJQK;
  result.unsuitedJQ = findUnsuited(['J', 'Q']);
  result.unsuitedKQKJ = findUnsuited(['K', 'Q']) || findUnsuited(['K', 'J']);
  result.unsuitedJKQK = findUnsuited(['J', 'K']) || findUnsuited(['Q', 'K']);
  result.unsuitedAHigh = findUnsuited(['A', 'K']) || findUnsuited(['A', 'Q']) || findUnsuited(['A', 'J']);
  result.unsuitedQK = findUnsuited(['Q', 'K']);
  result.unsuitedJK = findUnsuited(['J', 'K']);
  result.unsuitedQA = findUnsuited(['Q', 'A']);
  result.unsuitedJA = findUnsuited(['J', 'A']);
  result.unsuitedKA = findUnsuited(['K', 'A']);
  
  // Single high cards
  for (const [rank, key] of [['A', 'singleA'], ['K', 'singleK'], ['Q', 'singleQ'], ['J', 'singleJ']]) {
    const idx = cards.findIndex(c => c.rank === rank);
    if (idx >= 0) result[key] = { indices: [idx] };
  }
  const jqkIdx = cards.findIndex(c => ['J', 'Q', 'K'].includes(c.rank));
  if (jqkIdx >= 0) result.singleJQK = { indices: [jqkIdx] };
  
  // Check for straights
  for (let skip = 0; skip < 5; skip++) {
    const subset = cards.filter((_, i) => i !== skip);
    const subValues = subset.map(c => WOO_RANK_VALUES[c.rank]).sort((a, b) => a - b);
    const uniqueValues = [...new Set(subValues)];
    
    if (uniqueValues.length === 4) {
      const span = uniqueValues[3] - uniqueValues[0];
      const hcCount = subset.filter(c => WOO_HIGH_CARDS.includes(c.rank)).length;
      const indices = [0,1,2,3,4].filter(i => i !== skip);
      
      // Open-ended (span = 3, not at edges)
      if (span === 3 && uniqueValues[0] >= 2 && uniqueValues[3] <= 13) {
        result.fourToOutside = { indices };
        if (uniqueValues[0] >= 8) {
          result.fourToStraightHigh = { indices };
        }
      }
      
      // Inside straight (span = 4)
      if (span === 4) {
        if (hcCount >= 3) result.fourToInside3HC = { indices };
        else if (hcCount === 2) result.fourToInside2HC = { indices };
        else if (hcCount === 1) result.fourToInside1HC = { indices };
        else result.fourToInside0HC = { indices };
        
        // Special inside straights for DDB
        const ranksHeld = indices.map(i => cards[i].rank);
        if ((ranksHeld.includes('8') && ranksHeld.includes('9') && ranksHeld.includes('J') && ranksHeld.includes('Q')) ||
            (ranksHeld.includes('8') && ranksHeld.includes('10') && ranksHeld.includes('J') && ranksHeld.includes('Q')) ||
            (ranksHeld.includes('9') && ranksHeld.includes('10') && ranksHeld.includes('J') && ranksHeld.includes('K')) ||
            (ranksHeld.includes('9') && ranksHeld.includes('10') && ranksHeld.includes('Q') && ranksHeld.includes('K'))) {
          result.fourToInsideSpecial = { indices };
        }
      }
    }
  }
  
  // DDB: 4 Aces with 2-4 kicker
  if (quads.length > 0 && quads[0][0] === 'A') {
    const kickerIdx = [0,1,2,3,4].find(i => !quads[0][1].includes(i));
    const kickerRank = cards[kickerIdx].rank;
    if (['2', '3', '4'].includes(kickerRank)) {
      result.fourAcesWithKicker = { indices: [0,1,2,3,4] };
    }
  }
  
  // TDB: 4 of 2s/3s/4s with A/2/3/4 kicker
  if (quads.length > 0 && ['2', '3', '4'].includes(quads[0][0])) {
    const kickerIdx = [0,1,2,3,4].find(i => !quads[0][1].includes(i));
    const kickerRank = cards[kickerIdx].rank;
    if (['A', '2', '3', '4'].includes(kickerRank)) {
      result.fourLowWithKicker = { indices: [0,1,2,3,4] };
    }
  }
  
  // TDB: 3 Aces with 2/3/4 kicker - HOLD THE KICKER!
  if (tripsArr.length > 0 && tripsArr[0][0] === 'A') {
    const nonTripIndices = [0,1,2,3,4].filter(i => !tripsArr[0][1].includes(i));
    const kickers = nonTripIndices.map(i => cards[i].rank);
    const hasKicker = kickers.some(k => ['2', '3', '4'].includes(k));
    if (hasKicker) {
      const kickerIdx = nonTripIndices.find(i => ['2', '3', '4'].includes(cards[i].rank));
      result.threeAcesWithKicker = { indices: [...tripsArr[0][1], kickerIdx] };
    }
  }
  
  // TDB: 3 of 2s/3s/4s with A/2/3/4 kicker
  if (tripsArr.length > 0 && ['2', '3', '4'].includes(tripsArr[0][0])) {
    const nonTripIndices = [0,1,2,3,4].filter(i => !tripsArr[0][1].includes(i));
    const kickers = nonTripIndices.map(i => cards[i].rank);
    const hasKicker = kickers.some(k => ['A', '2', '3', '4'].includes(k));
    if (hasKicker) {
      const kickerIdx = nonTripIndices.find(i => ['A', '2', '3', '4'].includes(cards[i].rank));
      result.threeLowWithKicker = { indices: [...tripsArr[0][1], kickerIdx] };
    }
    // Also set threeLow (without kicker consideration)
    result.threeLow = { indices: tripsArr[0][1] };
  }
  
  // TDB: Pair of 2s/3s/4s (special ranking)
  if (pairs.length >= 1 && ['2', '3', '4'].includes(pairs[0][0])) {
    result.pairLow = { indices: pairs[0][1] };
  }
  
  // TDB: Low pair 5-10 (mid range)
  if (pairs.length >= 1 && ['5', '6', '7', '8', '9', '10'].includes(pairs[0][0])) {
    result.lowPairMid = { indices: pairs[0][1] };
  }
  
  // TDB: High pair JQK (not aces - aces handled separately)
  if (pairs.length >= 1 && ['J', 'Q', 'K'].includes(pairs[0][0])) {
    result.highPairJQK = { indices: pairs[0][1] };
  }
  
  return result;
}

// ============================================
// MAIN WoO RECOMMENDATION FUNCTION
// ============================================

const getWoOStrategyRecommendation = (cards, payTable = null, gameType = 'jacks-or-better') => {
  if (!cards || cards.length !== 5 || cards.some(c => !c)) return null;
  
  // Get pay table key
  const fhfl = payTable ? `${payTable.fh}/${payTable.fl}` : '9/6';
  const gameStrategies = PAY_TABLE_STRATEGIES[gameType];
  const strategyKey = gameStrategies?.[fhfl] || gameStrategies?.['9/6'] || 'JOB_9_6';
  
  // Handle Deuces Wild games
  const deucesWildGames = ['deuces-wild', 'double-deuces'];
  if (deucesWildGames.includes(gameType)) {
    return getDeucesWildWoORecommendation(cards, payTable);
  }
  
  // Handle Loose Deuces (4 deuces = 500!)
  if (gameType === 'loose-deuces') {
    return getLooseDeucesWoORecommendation(cards, payTable);
  }
  
  // Handle Bonus Deuces Wild (has different pay table and strategy)
  if (gameType === 'bonus-deuces-wild') {
    return getBonusDeucesWildWoORecommendation(cards, payTable);
  }
  
  // Handle Joker Poker Kings or Better (53-card deck, min hand: Kings+)
  if (gameType === 'joker-poker-kings') {
    return getJokerPokerKingsWoORecommendation(cards, payTable);
  }
  
  // Handle Joker Poker Two Pair (53-card deck, min hand: Two Pair)
  if (gameType === 'joker-poker-twopair') {
    return getJokerPokerTwoPairWoORecommendation(cards, payTable);
  }
  
  // Handle Ultimate X variants - route to base game strategies
  // Per WoO: Basic strategy for Ultimate X is identical to base game
  // Multipliers add ~0.2% return but don't change optimal play decisions
  if (gameType === 'ultimate-x-jacks') {
    const result = getWoOStrategyRecommendation(cards, payTable, 'jacks-or-better');
    if (result) result.note = 'Ultimate X: Same strategy as base JoB (multipliers add ~0.2%)';
    return result;
  }
  if (gameType === 'ultimate-x-bonus') {
    const result = getWoOStrategyRecommendation(cards, payTable, 'bonus-poker');
    if (result) result.note = 'Ultimate X: Same strategy as base BP (multipliers add ~0.2%)';
    return result;
  }
  if (gameType === 'ultimate-x-ddb') {
    const result = getWoOStrategyRecommendation(cards, payTable, 'double-double-bonus');
    if (result) result.note = 'Ultimate X: Same strategy as base DDB (multipliers add ~0.2%)';
    return result;
  }
  if (gameType === 'ultimate-x-double-bonus') {
    const result = getWoOStrategyRecommendation(cards, payTable, 'double-bonus');
    if (result) result.note = 'Ultimate X: Same strategy as base DB (multipliers add ~0.2%)';
    return result;
  }
  if (gameType === 'ultimate-x-bpd') {
    const result = getWoOStrategyRecommendation(cards, payTable, 'bonus-poker-deluxe');
    if (result) result.note = 'Ultimate X: Same strategy as base BPD (multipliers add ~0.2%)';
    return result;
  }
  if (gameType === 'ultimate-x-joker') {
    const result = getJokerPokerKingsWoORecommendation(cards, payTable);
    if (result) result.note = 'Ultimate X: Same strategy as base Joker Poker Kings (multipliers add ~0.2%)';
    return result;
  }
  
  // Handle other Joker Poker games (fallback to Kings strategy)
  if (gameType.includes('joker')) {
    return getJokerPokerWoORecommendation(cards, payTable);
  }
  
  // Get strategy hierarchy
  const hierarchy = STRATEGY_HIERARCHIES[strategyKey];
  if (!hierarchy) {
    // Fallback to JoB 9/6
    return getWoOStrategyRecommendation(cards, { fh: 9, fl: 6 }, 'jacks-or-better');
  }
  
  // Analyze hand
  const analysis = analyzeHandForWoO(cards);
  if (!analysis) return null;
  
  // Find best play from hierarchy
  for (const line of hierarchy) {
    const match = line.check(cards, analysis);
    if (match) {
      return {
        hold: match.indices,
        name: line.name,
        reason: `EV: ${line.ev.toFixed(4)} • WoO Optimal`,
        payout: line.ev,
        rank: line.rank,
        source: 'wizardofodds.com'
      };
    }
  }
  
  // Fallback
  return { hold: [], name: 'Discard All', reason: 'Draw 5 new cards', payout: 0.36, rank: 99 };
};

// Deuces Wild WoO recommendation
const getDeucesWildWoORecommendation = (cards, payTable) => {
  const deuceCount = cards.filter(c => c.rank === '2').length;
  const deuceIndices = cards.map((c, i) => c.rank === '2' ? i : -1).filter(i => i >= 0);
  const nonDeuceCards = cards.filter(c => c.rank !== '2');
  const nonDeuceIndices = cards.map((c, i) => c.rank !== '2' ? i : -1).filter(i => i >= 0);
  
  // Analyze non-deuce cards
  const ranks = cards.map(c => c.rank);
  const rankCounts = {};
  ranks.forEach((r, i) => { 
    if (r !== '2') {
      if (!rankCounts[r]) rankCounts[r] = []; 
      rankCounts[r].push(i); 
    }
  });
  
  // Find pairs/trips among non-deuces
  const pairsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 2);
  const tripsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 3);
  const quadsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 4);
  
  // Check for suited NON-DEUCE cards (deuces are wild and can be any suit!)
  const nonDeuceSuitCounts = {};
  nonDeuceCards.forEach((c, origIdx) => {
    const realIdx = nonDeuceIndices[nonDeuceCards.indexOf(c)] !== undefined ? 
      cards.findIndex((card, i) => card === c && card.rank !== '2') : -1;
    // Find the actual index in original cards array
    const actualIdx = cards.indexOf(c);
    if (!nonDeuceSuitCounts[c.suit]) nonDeuceSuitCounts[c.suit] = [];
    nonDeuceSuitCounts[c.suit].push(actualIdx);
  });
  
  const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
  const WOO_RANK_VALUES_DW = { '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  
  if (deuceCount === 4) {
    return { hold: [0,1,2,3,4], name: 'Four Deuces', reason: 'EV: 200.00 • WoO Optimal', payout: 200, source: 'wizardofodds.com' };
  }
  
  if (deuceCount === 3) {
    // Check for wild royal (3 deuces + 2 royal cards same suit among non-deuces)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for 5 of a kind (3 deuces + pair)
    if (pairsArr.length > 0) {
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 15.00 • Keep it!', payout: 15, source: 'wizardofodds.com' };
    }
    return { hold: deuceIndices, name: '3 Deuces', reason: 'EV: 14.41 • Draw for Wild Royal/5K', payout: 14.41, source: 'wizardofodds.com' };
  }
  
  if (deuceCount === 2) {
    // Check for wild royal (2 deuces + 3 royal cards same suit among non-deuces)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for straight flush (2 deuces + 3 suited cards that can make SF)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          // With 2 deuces filling gaps, span of 4 or less means we have SF
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 9.00 • Keep it!', payout: 9, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Check for 5 of a kind (2 deuces + trips)
    if (tripsArr.length > 0) {
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 15.00 • Keep it!', payout: 15, source: 'wizardofodds.com' };
    }
    // Check for 4 of a kind (2 deuces + pair) - draw for 5K
    if (pairsArr.length > 0) {
      const pairIndices = pairsArr[0][1];
      return { hold: [...deuceIndices, ...pairIndices], name: 'Four of a Kind', reason: 'EV: 5.76 • Draw 1 for 5K', payout: 5.76, source: 'wizardofodds.com' };
    }
    // Check for 4 to wild royal (2 deuces + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [...deuceIndices, ...royalInSuit.slice(0, 2)], name: '4 to Wild Royal', reason: 'EV: 14.89 • Draw 1', payout: 14.89, source: 'wizardofodds.com' };
      }
    }
    return { hold: deuceIndices, name: '2 Deuces', reason: 'EV: 3.07 • Draw for Quads+', payout: 3.07, source: 'wizardofodds.com' };
  }
  
  if (deuceCount === 1) {
    const deuceIdx = deuceIndices[0];
    
    // Check for wild royal (1 deuce + 4 royal cards same suit among NON-DEUCES)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length === 4) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for 5 of a kind (deuce + quads)
    if (quadsArr.length > 0) {
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 15.00 • Keep it!', payout: 15, source: 'wizardofodds.com' };
    }
    // Check for straight flush (1 deuce + 4 suited cards that form SF)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 4) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 4) {
          const span = vals[vals.length - 1] - vals[0];
          // With 1 deuce filling a gap, span of 4 or less means SF
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 9.00 • Keep it!', payout: 9, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Check for 4 of a kind (deuce + trips)
    if (tripsArr.length > 0) {
      const tripIndices = tripsArr[0][1];
      return { hold: [...deuceIndices, ...tripIndices], name: 'Four of a Kind', reason: 'EV: 5.76 • Draw 1 for 5K', payout: 5.76, source: 'wizardofodds.com' };
    }
    // Check for 4 to wild royal (1 deuce + 3 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [deuceIdx, ...royalInSuit.slice(0, 3)], name: '4 to Wild Royal', reason: 'EV: 3.40 • Draw 1', payout: 3.40, source: 'wizardofodds.com' };
      }
    }
    // Full house check (deuce + 2 pairs = FH)
    if (pairsArr.length >= 2) {
      return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 3.00 • Keep it!', payout: 3, source: 'wizardofodds.com' };
    }
    // Flush check (deuce + 4 same suit non-deuces, but not SF)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 4) {
        return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 2.00 • Keep it!', payout: 2, source: 'wizardofodds.com' };
      }
    }
    // Straight check - need to verify non-deuces can form straight with wild
    const nonDeuceVals = nonDeuceCards.map(c => WOO_RANK_VALUES_DW[c.rank]).filter(v => v).sort((a,b) => a-b);
    if (nonDeuceVals.length === 4) {
      const uniqueVals = [...new Set(nonDeuceVals)];
      if (uniqueVals.length === 4) {
        const span = uniqueVals[3] - uniqueVals[0];
        if (span <= 4) {
          return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 2.00 • Keep it!', payout: 2, source: 'wizardofodds.com' };
        }
        // Check for wheel (A-2-3-4-5 but 2 is wild)
        if (uniqueVals.includes(14) && uniqueVals.includes(3) && uniqueVals.includes(4) && uniqueVals.includes(5)) {
          return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 2.00 • Keep it!', payout: 2, source: 'wizardofodds.com' };
        }
      }
    }
    // THREE OF A KIND (deuce + pair) - THIS IS THE KEY FIX!
    if (pairsArr.length > 0) {
      const pairIndices = pairsArr[0][1];
      return { hold: [...deuceIndices, ...pairIndices], name: 'Three of a Kind', reason: 'EV: 1.51 • Draw 2 for Quads+', payout: 1.51, source: 'wizardofodds.com' };
    }
    // 4 to straight flush (1 deuce + 3 suited that can make SF)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [deuceIdx, ...indices.slice(0, 3)], name: '4 to Straight Flush', reason: 'EV: 1.22 • Draw 1', payout: 1.22, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // 3 to wild royal (1 deuce + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [deuceIdx, ...royalInSuit.slice(0, 2)], name: '3 to Wild Royal', reason: 'EV: 1.17 • Draw 2', payout: 1.17, source: 'wizardofodds.com' };
      }
    }
    // Just the deuce
    return { hold: deuceIndices, name: '1 Deuce', reason: 'EV: 1.01 • Draw 4 for Trips+', payout: 1.01, source: 'wizardofodds.com' };
  }
  
  // 0 Deuces - use standard analysis
  const analysis = analyzeHandForWoO(cards);
  if (analysis.isRoyalFlush) return { hold: [0,1,2,3,4], name: 'Natural Royal', reason: 'EV: 800.00 • Jackpot!', payout: 800, source: 'wizardofodds.com' };
  if (analysis.fourToRoyal) return { hold: analysis.fourToRoyal.indices, name: '4 to Royal', reason: 'EV: 19.83 • WoO Optimal', payout: 19.83, source: 'wizardofodds.com' };
  if (analysis.isStraightFlush) return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 9.00', payout: 9, source: 'wizardofodds.com' };
  if (analysis.is4K) return { hold: [0,1,2,3,4], name: 'Four of a Kind', reason: 'EV: 5.00', payout: 5, source: 'wizardofodds.com' };
  if (analysis.isFullHouse) return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 3.00', payout: 3, source: 'wizardofodds.com' };
  if (analysis.isFlush) return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 2.00', payout: 2, source: 'wizardofodds.com' };
  if (analysis.isStraight) return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 2.00', payout: 2, source: 'wizardofodds.com' };
  if (analysis.trips) return { hold: analysis.trips.indices, name: 'Three of a Kind', reason: 'EV: 1.02 • Draw 2', payout: 1.02, source: 'wizardofodds.com' };
  if (analysis.fourToSF) return { hold: analysis.fourToSF.indices, name: '4 to SF', reason: 'EV: 1.22 • WoO Optimal', payout: 1.22, source: 'wizardofodds.com' };
  if (analysis.threeToRoyal) return { hold: analysis.threeToRoyal.indices, name: '3 to Royal', reason: 'EV: 1.30 • WoO Optimal', payout: 1.30, source: 'wizardofodds.com' };
  if (analysis.fourToFlush) return { hold: analysis.fourToFlush.indices, name: '4 to Flush', reason: 'EV: 0.51', payout: 0.51, source: 'wizardofodds.com' };
  // In DW, discard one pair from two pair (two pair doesn't pay!)
  if (analysis.twoPair) {
    const firstPair = pairsArr[0]?.[1] || [];
    return { hold: firstPair, name: 'One Pair (discard 2P)', reason: 'EV: 0.56 • DW: Two pair pays nothing!', payout: 0.56, source: 'wizardofodds.com' };
  }
  if (analysis.lowPair || analysis.highPair) {
    const pairResult = analysis.lowPair || analysis.highPair;
    return { hold: pairResult.indices, name: 'Pair', reason: 'EV: 0.56 • WoO Optimal', payout: 0.56, source: 'wizardofodds.com' };
  }
  if (analysis.fourToOutside) return { hold: analysis.fourToOutside.indices, name: '4 to Straight', reason: 'EV: 0.51', payout: 0.51, source: 'wizardofodds.com' };
  if (analysis.threeToSF1 || analysis.threeToSF2) {
    const sf = analysis.threeToSF1 || analysis.threeToSF2;
    return { hold: sf.indices, name: '3 to SF', reason: 'EV: 0.45', payout: 0.45, source: 'wizardofodds.com' };
  }
  return { hold: [], name: 'Discard All', reason: 'EV: 0.32 • No valuable holds', payout: 0.32, source: 'wizardofodds.com' };
};

// Joker Poker WoO recommendation
const getJokerPokerWoORecommendation = (cards, payTable) => {
  const hasJoker = cards.some(c => c.rank === 'JOKER' || c.isJoker);
  if (hasJoker) {
    const jokerIndices = cards.map((c, i) => (c.rank === 'JOKER' || c.isJoker) ? i : -1).filter(i => i >= 0);
    return { hold: jokerIndices, name: 'Joker', reason: 'Always hold the Joker • WoO', payout: 0.74 };
  }
  
  const analysis = analyzeHandForWoO(cards);
  if (analysis.isRoyalFlush) return { hold: [0,1,2,3,4], name: 'Natural Royal', reason: 'Jackpot!', payout: 800 };
  if (analysis.fourToRoyal) return { hold: analysis.fourToRoyal.indices, name: '4 to Royal', reason: 'EV: 19.66 • WoO', payout: 19.66 };
  if (analysis.isStraightFlush) return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 50.00', payout: 50 };
  if (analysis.is4K) return { hold: [0,1,2,3,4], name: 'Four of a Kind', reason: 'EV: 17.00', payout: 17 };
  if (analysis.fourToSF) return { hold: analysis.fourToSF.indices, name: '4 to SF', reason: 'EV: 3.32 • WoO', payout: 3.32 };
  if (analysis.isFullHouse) return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 7.00', payout: 7 };
  if (analysis.isFlush) return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 5.00', payout: 5 };
  if (analysis.isStraight) return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 3.00', payout: 3 };
  if (analysis.trips) return { hold: analysis.trips.indices, name: 'Three of a Kind', reason: 'EV: 2.00', payout: 2 };
  if (analysis.threeToRoyal) return { hold: analysis.threeToRoyal.indices, name: '3 to Royal', reason: 'EV: 1.45 • WoO', payout: 1.45 };
  if (analysis.twoPair) return { hold: analysis.twoPair.indices, name: 'Two Pair', reason: 'EV: 1.00', payout: 1 };
  if (analysis.pairKings || analysis.pairAces) {
    const pair = analysis.pairKings || analysis.pairAces;
    return { hold: pair.indices, name: 'Pair K/A', reason: 'Kings or Better • WoO', payout: 1 };
  }
  if (analysis.threeToSF1 || analysis.threeToSF2) {
    const sf = analysis.threeToSF1 || analysis.threeToSF2;
    return { hold: sf.indices, name: '3 to SF', reason: 'EV: 0.72 • WoO', payout: 0.72 };
  }
  if (analysis.lowPair) return { hold: analysis.lowPair.indices, name: 'Low Pair', reason: 'EV: 0.62 • WoO', payout: 0.62 };
  if (analysis.fourToFlush) return { hold: analysis.fourToFlush.indices, name: '4 to Flush', reason: 'EV: 0.77', payout: 0.77 };
  if (analysis.fourToOutside) return { hold: analysis.fourToOutside.indices, name: '4 to Straight', reason: 'EV: 0.60', payout: 0.60 };
  if (analysis.singleK || analysis.singleA) {
    const single = analysis.singleK || analysis.singleA;
    return { hold: single.indices, name: 'K or A', reason: 'EV: 0.42 • WoO', payout: 0.42 };
  }
  return { hold: [], name: 'Discard All', reason: 'EV: 0.39 • Draw 5', payout: 0.39 };
};

// ============================================
// BONUS DEUCES WILD WoO Strategy (13/4/3)
// Return: 98.80%
// Source: https://wizardofodds.com/games/video-poker/strategy/bonus-deuces-wild/13-4-3/
// Key differences from regular DW:
//   - 4 Deuces + Ace = 400 (same as royal value, hold ace!)
//   - 5 Aces = 80
//   - 5 of 3s/4s/5s = 40
//   - 5 of 6s-Ks = 20
// ============================================
const getBonusDeucesWildWoORecommendation = (cards, payTable) => {
  const deuceCount = cards.filter(c => c.rank === '2').length;
  const deuceIndices = cards.map((c, i) => c.rank === '2' ? i : -1).filter(i => i >= 0);
  const nonDeuceCards = cards.filter(c => c.rank !== '2');
  const nonDeuceIndices = cards.map((c, i) => c.rank !== '2' ? i : -1).filter(i => i >= 0);
  
  // Analyze non-deuce cards
  const rankCounts = {};
  cards.forEach((c, i) => { 
    if (c.rank !== '2') {
      if (!rankCounts[c.rank]) rankCounts[c.rank] = []; 
      rankCounts[c.rank].push(i); 
    }
  });
  
  const pairsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 2);
  const tripsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 3);
  const quadsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 4);
  
  // Check for Aces among non-deuces
  const aceIndices = rankCounts['A'] || [];
  const hasAce = aceIndices.length > 0;
  
  // Check for suited NON-DEUCE cards
  const nonDeuceSuitCounts = {};
  nonDeuceCards.forEach(c => {
    const actualIdx = cards.indexOf(c);
    if (!nonDeuceSuitCounts[c.suit]) nonDeuceSuitCounts[c.suit] = [];
    nonDeuceSuitCounts[c.suit].push(actualIdx);
  });
  
  const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
  const WOO_RANK_VALUES_DW = { '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  
  // === 4 DEUCES ===
  if (deuceCount === 4) {
    // BDW RULE: 4 Deuces + Ace = 400 (same as keeping all 5!)
    if (hasAce) {
      return { hold: [0,1,2,3,4], name: 'Four Deuces + Ace', reason: 'EV: 400.00 • BDW Jackpot!', payout: 400, source: 'wizardofodds.com' };
    }
    return { hold: [0,1,2,3,4], name: 'Four Deuces', reason: 'EV: 200.00 • Keep it!', payout: 200, source: 'wizardofodds.com' };
  }
  
  // === 3 DEUCES ===
  if (deuceCount === 3) {
    // Check for wild royal (3 deuces + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for 5 of a kind (3 deuces + pair)
    if (pairsArr.length > 0) {
      const pairRank = pairsArr[0][0];
      if (pairRank === 'A') {
        return { hold: [0,1,2,3,4], name: 'Five Aces', reason: 'EV: 80.00 • BDW Bonus!', payout: 80, source: 'wizardofodds.com' };
      }
      if (['3', '4', '5'].includes(pairRank)) {
        return { hold: [0,1,2,3,4], name: 'Five 3-5s', reason: 'EV: 40.00 • BDW Bonus!', payout: 40, source: 'wizardofodds.com' };
      }
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 20.00', payout: 20, source: 'wizardofodds.com' };
    }
    // BDW RULE: 3 Deuces + Ace = Hold the ace (draw for 4 deuces+A or 5 aces)
    if (hasAce) {
      return { hold: [...deuceIndices, ...aceIndices], name: '3 Deuces + Ace', reason: 'EV: ~15 • Drawing for 4 Deuces+A or 5 Aces', payout: 15, source: 'wizardofodds.com' };
    }
    return { hold: deuceIndices, name: '3 Deuces', reason: 'EV: 14.41 • Draw for Wild Royal/5K', payout: 14.41, source: 'wizardofodds.com' };
  }
  
  // === 2 DEUCES ===
  if (deuceCount === 2) {
    // Check for wild royal
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for 5 of a kind (2 deuces + trips)
    if (tripsArr.length > 0) {
      const tripRank = tripsArr[0][0];
      if (tripRank === 'A') {
        return { hold: [0,1,2,3,4], name: 'Five Aces', reason: 'EV: 80.00 • BDW Bonus!', payout: 80, source: 'wizardofodds.com' };
      }
      if (['3', '4', '5'].includes(tripRank)) {
        return { hold: [0,1,2,3,4], name: 'Five 3-5s', reason: 'EV: 40.00 • BDW Bonus!', payout: 40, source: 'wizardofodds.com' };
      }
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 20.00', payout: 20, source: 'wizardofodds.com' };
    }
    // Check for straight flush
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 13.00 • Keep it!', payout: 13, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // 4 of a kind (2 deuces + pair)
    if (pairsArr.length > 0) {
      const pairRank = pairsArr[0][0];
      const pairIndices = pairsArr[0][1];
      return { hold: [...deuceIndices, ...pairIndices], name: 'Four of a Kind', reason: 'EV: ~6 • Draw 1 for 5K', payout: 6, source: 'wizardofodds.com' };
    }
    // 4 to wild royal (2 deuces + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [...deuceIndices, ...royalInSuit.slice(0, 2)], name: '4 to Wild Royal', reason: 'EV: 14.89 • Draw 1', payout: 14.89, source: 'wizardofodds.com' };
      }
    }
    // 4 to SF with specific patterns (WoO: deuces + 45/56/57/67/68/78/79/89/8T/9T/9J)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 2) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 2) {
          const span = vals[vals.length - 1] - vals[0];
          // Good SF draws: span <= 2 means consecutive or 1 gap
          if (span <= 2 && vals[0] >= 4 && vals[1] <= 11) {
            return { hold: [...deuceIndices, ...indices.slice(0, 2)], name: '4 to SF', reason: 'EV: ~2.5 • Draw 1', payout: 2.5, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // BDW RULE: 2 Deuces + Ace = Hold the ace
    if (hasAce) {
      return { hold: [...deuceIndices, ...aceIndices], name: '2 Deuces + Ace', reason: 'EV: ~3.2 • Better than 2 deuces alone', payout: 3.2, source: 'wizardofodds.com' };
    }
    return { hold: deuceIndices, name: '2 Deuces', reason: 'EV: 3.07 • Draw for Quads+', payout: 3.07, source: 'wizardofodds.com' };
  }
  
  // === 1 DEUCE ===
  if (deuceCount === 1) {
    const deuceIdx = deuceIndices[0];
    
    // Check for wild royal (1 deuce + 4 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length === 4) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for 5 of a kind (deuce + quads)
    if (quadsArr.length > 0) {
      const quadRank = quadsArr[0][0];
      if (quadRank === 'A') {
        return { hold: [0,1,2,3,4], name: 'Five Aces', reason: 'EV: 80.00 • BDW Bonus!', payout: 80, source: 'wizardofodds.com' };
      }
      if (['3', '4', '5'].includes(quadRank)) {
        return { hold: [0,1,2,3,4], name: 'Five 3-5s', reason: 'EV: 40.00 • BDW Bonus!', payout: 40, source: 'wizardofodds.com' };
      }
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 20.00', payout: 20, source: 'wizardofodds.com' };
    }
    // Check for straight flush
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 4) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 4) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 13.00 • Keep it!', payout: 13, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // 4 of a kind (deuce + trips)
    if (tripsArr.length > 0) {
      const tripRank = tripsArr[0][0];
      const tripIndices = tripsArr[0][1];
      // Special ranking for 3-5s and Aces in BDW
      if (tripRank === 'A') {
        return { hold: [...deuceIndices, ...tripIndices], name: 'Four Aces', reason: 'EV: ~8 • Draw 1 for 5 Aces (80)!', payout: 8, source: 'wizardofodds.com' };
      }
      if (['3', '4', '5'].includes(tripRank)) {
        return { hold: [...deuceIndices, ...tripIndices], name: 'Four 3-5s', reason: 'EV: ~6 • Draw 1 for Five 3-5s (40)!', payout: 6, source: 'wizardofodds.com' };
      }
      return { hold: [...deuceIndices, ...tripIndices], name: 'Four of a Kind', reason: 'EV: ~5 • Draw 1 for 5K', payout: 5, source: 'wizardofodds.com' };
    }
    // 4 to wild royal
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [deuceIdx, ...royalInSuit.slice(0, 3)], name: '4 to Wild Royal', reason: 'EV: 3.40 • Draw 1', payout: 3.40, source: 'wizardofodds.com' };
      }
    }
    // Full house (deuce + 2 pairs)
    if (pairsArr.length >= 2) {
      return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 3.00 • Keep it!', payout: 3, source: 'wizardofodds.com' };
    }
    // Flush
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 4) {
        return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 3.00 • Keep it!', payout: 3, source: 'wizardofodds.com' };
      }
    }
    // 4 to SF (1 deuce + 3 suited)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [deuceIdx, ...indices.slice(0, 3)], name: '4 to Straight Flush', reason: 'EV: ~2 • Draw 1', payout: 2, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // BDW: Pair rankings - Aces > 3/4/5 > 6-K
    // Check for 3K (deuce + pair)
    if (pairsArr.length > 0) {
      // Find best pair: prioritize Aces, then 3-5s
      let bestPair = pairsArr[0];
      for (const pair of pairsArr) {
        if (pair[0] === 'A') { bestPair = pair; break; }
        if (['3', '4', '5'].includes(pair[0]) && bestPair[0] !== 'A') { bestPair = pair; }
      }
      const pairRank = bestPair[0];
      const pairIndices = bestPair[1];
      if (pairRank === 'A') {
        return { hold: [...deuceIndices, ...pairIndices], name: 'Three Aces', reason: 'EV: ~1.8 • BDW: Drawing for 5 Aces!', payout: 1.8, source: 'wizardofodds.com' };
      }
      if (['3', '4', '5'].includes(pairRank)) {
        return { hold: [...deuceIndices, ...pairIndices], name: 'Three 3-5s', reason: 'EV: ~1.6 • BDW: Drawing for Five 3-5s!', payout: 1.6, source: 'wizardofodds.com' };
      }
      return { hold: [...deuceIndices, ...pairIndices], name: 'Three of a Kind', reason: 'EV: ~1.5 • Draw 2', payout: 1.5, source: 'wizardofodds.com' };
    }
    // 3 to wild royal (1 deuce + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        const royalRanksHeld = royalInSuit.map(i => cards[i].rank);
        // Better draws: TJ, TQ rank higher than TA/JA/QA/KA
        if (royalRanksHeld.includes('10') && (royalRanksHeld.includes('J') || royalRanksHeld.includes('Q'))) {
          return { hold: [deuceIdx, ...royalInSuit.slice(0, 2)], name: '3 to Wild Royal', reason: 'EV: ~1.2 • Draw 2', payout: 1.2, source: 'wizardofodds.com' };
        }
        return { hold: [deuceIdx, ...royalInSuit.slice(0, 2)], name: '3 to Wild Royal', reason: 'EV: ~1.1 • Draw 2', payout: 1.1, source: 'wizardofodds.com' };
      }
    }
    // Straight check
    const nonDeuceVals = nonDeuceCards.map(c => WOO_RANK_VALUES_DW[c.rank]).filter(v => v);
    const uniqueVals = [...new Set(nonDeuceVals)].sort((a,b) => a-b);
    if (uniqueVals.length === 4 && uniqueVals[3] - uniqueVals[0] <= 4) {
      return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 1.00 • Keep it!', payout: 1, source: 'wizardofodds.com' };
    }
    // 3 to SF with good connectors
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 2) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 2) {
          const span = vals[vals.length - 1] - vals[0];
          // Good SF connectors: 67, 78, 89, 9T per WoO
          if (span <= 1 && vals[0] >= 6 && vals[1] <= 10) {
            return { hold: [deuceIdx, ...indices.slice(0, 2)], name: '3 to SF', reason: 'EV: ~0.9 • Draw 2', payout: 0.9, source: 'wizardofodds.com' };
          }
        }
      }
    }
    return { hold: deuceIndices, name: '1 Deuce', reason: 'EV: 1.01 • Draw 4', payout: 1.01, source: 'wizardofodds.com' };
  }
  
  // === 0 DEUCES ===
  const analysis = analyzeHandForWoO(cards);
  if (analysis.isRoyalFlush) return { hold: [0,1,2,3,4], name: 'Natural Royal', reason: 'EV: 800.00 • Jackpot!', payout: 800, source: 'wizardofodds.com' };
  if (analysis.fourToRoyal) return { hold: analysis.fourToRoyal.indices, name: '4 to Royal', reason: 'EV: 19.83 • WoO Optimal', payout: 19.83, source: 'wizardofodds.com' };
  if (analysis.isStraightFlush) return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 13.00 • Keep it!', payout: 13, source: 'wizardofodds.com' };
  if (analysis.is4K) return { hold: [0,1,2,3,4], name: 'Four of a Kind', reason: 'EV: 4.00', payout: 4, source: 'wizardofodds.com' };
  if (analysis.isFullHouse) return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 3.00', payout: 3, source: 'wizardofodds.com' };
  if (analysis.isFlush) return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 3.00', payout: 3, source: 'wizardofodds.com' };
  if (analysis.trips) {
    // BDW: Trips of Aces or 3-5s are more valuable
    const tripRank = tripsArr[0]?.[0];
    if (tripRank === 'A') {
      return { hold: analysis.trips.indices, name: 'Three Aces', reason: 'EV: ~1.5 • Drawing for 5 Aces!', payout: 1.5, source: 'wizardofodds.com' };
    }
    return { hold: analysis.trips.indices, name: 'Three of a Kind', reason: 'EV: ~1.0 • Draw 2', payout: 1.0, source: 'wizardofodds.com' };
  }
  if (analysis.fourToSF) return { hold: analysis.fourToSF.indices, name: '4 to SF', reason: 'EV: 1.22 • WoO Optimal', payout: 1.22, source: 'wizardofodds.com' };
  if (analysis.threeToRoyal) return { hold: analysis.threeToRoyal.indices, name: '3 to Royal', reason: 'EV: 1.30 • WoO Optimal', payout: 1.30, source: 'wizardofodds.com' };
  if (analysis.isStraight) return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 1.00', payout: 1, source: 'wizardofodds.com' };
  if (analysis.fourToFlush) return { hold: analysis.fourToFlush.indices, name: '4 to Flush', reason: 'EV: 0.51', payout: 0.51, source: 'wizardofodds.com' };
  
  // BDW: Pair of Aces ranks highest, then 3/4/5, then 6-K
  if (pairsArr.length > 0) {
    // Sort pairs by BDW value
    const sortedPairs = [...pairsArr].sort((a, b) => {
      if (a[0] === 'A') return -1;
      if (b[0] === 'A') return 1;
      if (['3', '4', '5'].includes(a[0]) && !['3', '4', '5'].includes(b[0])) return -1;
      if (['3', '4', '5'].includes(b[0]) && !['3', '4', '5'].includes(a[0])) return 1;
      return 0;
    });
    const bestPair = sortedPairs[0];
    const pairRank = bestPair[0];
    if (pairRank === 'A') {
      return { hold: bestPair[1], name: 'Pair of Aces', reason: 'EV: ~0.65 • BDW: Best pair!', payout: 0.65, source: 'wizardofodds.com' };
    }
    if (['3', '4', '5'].includes(pairRank)) {
      return { hold: bestPair[1], name: 'Pair of 3-5s', reason: 'EV: ~0.60 • BDW: Better than 6-K!', payout: 0.60, source: 'wizardofodds.com' };
    }
    return { hold: bestPair[1], name: 'Pair', reason: 'EV: ~0.55 • WoO Optimal', payout: 0.55, source: 'wizardofodds.com' };
  }
  
  // 3 to SF (with good connectors)
  if (analysis.threeToSF1 || analysis.threeToSF2) {
    const sf = analysis.threeToSF1 || analysis.threeToSF2;
    return { hold: sf.indices, name: '3 to SF', reason: 'EV: 0.45', payout: 0.45, source: 'wizardofodds.com' };
  }
  
  // 2 to Royal (TJ, TQ, JQ, TK, JK, QK)
  for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
    const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
    if (royalInSuit.length >= 2) {
      const royalRanksHeld = royalInSuit.map(i => cards[i].rank).sort();
      // TJ and TQ are best 2-royal draws
      if (royalRanksHeld.includes('10') && (royalRanksHeld.includes('J') || royalRanksHeld.includes('Q'))) {
        return { hold: royalInSuit.slice(0, 2), name: '2 to Royal', reason: 'EV: ~0.42 • Draw 3', payout: 0.42, source: 'wizardofodds.com' };
      }
      return { hold: royalInSuit.slice(0, 2), name: '2 to Royal', reason: 'EV: ~0.40 • Draw 3', payout: 0.40, source: 'wizardofodds.com' };
    }
  }
  
  return { hold: [], name: 'Discard All', reason: 'EV: 0.32 • Draw 5', payout: 0.32, source: 'wizardofodds.com' };
};

// ============================================
// LOOSE DEUCES WoO Strategy (17/10 Full Pay)
// Return: 101.60%
// Source: https://wizardofodds.com/games/video-poker/tables/loose-deuces/
// Key difference from regular DW: 4 Deuces pays 500!
// Strategy is nearly identical to Full-Pay Deuces Wild
// ============================================
const getLooseDeucesWoORecommendation = (cards, payTable) => {
  // Loose Deuces has VERY different strategy due to 4 deuces paying 500!
  // Key difference: With 3 deuces, ALWAYS hold just deuces (no exceptions!)
  // In regular DW you'd keep wild royal/5K, but in LD the 4D payout is too high
  
  const deuceIndices = cards.map((c, i) => c.rank === '2' ? i : -1).filter(i => i >= 0);
  const deuceCount = deuceIndices.length;
  
  // 4 deuces - keep all!
  if (deuceCount === 4) {
    return { hold: [0,1,2,3,4], name: 'Four Deuces', reason: 'EV: 500.00 • Loose Deuces Jackpot!', payout: 500, source: 'wizardofodds.com' };
  }
  
  // 3 deuces - ALWAYS hold just deuces, dump everything else!
  // This is the KEY difference from regular Deuces Wild
  // Wild Royal (25) and 5K (15) are sacrificed to chase 4D (500)
  if (deuceCount === 3) {
    return { hold: deuceIndices, name: '3 Deuces', reason: 'EV: ~21 • Draw for 4 Deuces (500)!', payout: 21, source: 'wizardofodds.com' };
  }
  
  // For 0-2 deuces, use regular DW strategy with adjusted payouts
  const result = getDeucesWildWoORecommendation(cards, payTable);
  
  // Adjust messaging for Loose Deuces specific payouts
  if (result.name === 'Four Deuces') {
    result.reason = 'EV: 500.00 • Loose Deuces Jackpot!';
    result.payout = 500;
  }
  if (result.name === 'Five of a Kind') {
    result.reason = 'EV: 15.00 • Keep it!';
    result.payout = 15;
  }
  if (result.name === 'Straight Flush') {
    result.reason = 'EV: 8.00 • Keep it!';
    result.payout = 8;
  }
  
  return result;
};

// ============================================
// JOKER POKER KINGS OR BETTER WoO Strategy
// Return: 100.64% (20/7/5 Full Pay)
// 53-card deck with 1 Joker wild
// Min paying hand: Kings or Better
// ============================================
const getJokerPokerKingsWoORecommendation = (cards, payTable) => {
  const hasJoker = cards.some(c => c.rank === 'JOKER' || c.isJoker);
  const jokerIndices = cards.map((c, i) => (c.rank === 'JOKER' || c.isJoker) ? i : -1).filter(i => i >= 0);
  const nonJokerCards = cards.filter(c => c.rank !== 'JOKER' && !c.isJoker);
  const nonJokerIndices = cards.map((c, i) => (c.rank !== 'JOKER' && !c.isJoker) ? i : -1).filter(i => i >= 0);
  
  // Rank counts for non-joker cards
  const rankCounts = {};
  cards.forEach((c, i) => { 
    if (c.rank !== 'JOKER' && !c.isJoker) {
      if (!rankCounts[c.rank]) rankCounts[c.rank] = []; 
      rankCounts[c.rank].push(i); 
    }
  });
  
  const pairsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 2);
  const tripsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 3);
  const quadsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 4);
  
  // Suit counts for non-joker cards
  const nonJokerSuitCounts = {};
  nonJokerCards.forEach(c => {
    const actualIdx = cards.indexOf(c);
    if (!nonJokerSuitCounts[c.suit]) nonJokerSuitCounts[c.suit] = [];
    nonJokerSuitCounts[c.suit].push(actualIdx);
  });
  
  const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
  const WOO_RANK_VALUES = { '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  
  // === WITH JOKER ===
  if (hasJoker) {
    const jokerIdx = jokerIndices[0];
    
    // Natural Royal is impossible with joker, check for Wild Royal
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length === 4) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 100.00 • Keep it!', payout: 100, source: 'wizardofodds.com' };
      }
    }
    // Five of a Kind (joker + quads)
    if (quadsArr.length > 0) {
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 200.00 • Keep it!', payout: 200, source: 'wizardofodds.com' };
    }
    // Straight Flush (joker + 4 SF cards)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 4) {
        const vals = indices.map(i => WOO_RANK_VALUES[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 4) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 50.00 • Keep it!', payout: 50, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Four of a Kind (joker + trips)
    if (tripsArr.length > 0) {
      const tripIndices = tripsArr[0][1];
      return { hold: [...jokerIndices, ...tripIndices], name: 'Four of a Kind', reason: 'EV: 20.00 • Draw 1 for 5K', payout: 20, source: 'wizardofodds.com' };
    }
    // 4 to Wild Royal (joker + 3 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [jokerIdx, ...royalInSuit.slice(0, 3)], name: '4 to Wild Royal', reason: 'EV: ~12 • Draw 1', payout: 12, source: 'wizardofodds.com' };
      }
    }
    // Full House (joker + 2 pairs)
    if (pairsArr.length >= 2) {
      return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 7.00 • Keep it!', payout: 7, source: 'wizardofodds.com' };
    }
    // Flush (joker + 4 suited)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 4) {
        return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 5.00 • Keep it!', payout: 5, source: 'wizardofodds.com' };
      }
    }
    // 4 to Straight Flush (joker + 3 SF cards)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [jokerIdx, ...indices.slice(0, 3)], name: '4 to SF', reason: 'EV: ~6 • Draw 1', payout: 6, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Straight (joker + 4 straight cards)
    const nonJokerVals = nonJokerCards.map(c => WOO_RANK_VALUES[c.rank]).filter(v => v);
    const uniqueVals = [...new Set(nonJokerVals)].sort((a,b) => a-b);
    if (uniqueVals.length === 4 && uniqueVals[3] - uniqueVals[0] <= 4) {
      return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 3.00 • Keep it!', payout: 3, source: 'wizardofodds.com' };
    }
    // Three of a Kind (joker + pair)
    if (pairsArr.length > 0) {
      const pairIndices = pairsArr[0][1];
      return { hold: [...jokerIndices, ...pairIndices], name: 'Three of a Kind', reason: 'EV: 2.00 • Draw 2', payout: 2, source: 'wizardofodds.com' };
    }
    // 3 to Wild Royal (joker + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [jokerIdx, ...royalInSuit.slice(0, 2)], name: '3 to Wild Royal', reason: 'EV: ~1.5 • Draw 2', payout: 1.5, source: 'wizardofodds.com' };
      }
    }
    // 4 to Flush (joker + 3 suited)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 3) {
        return { hold: [jokerIdx, ...indices.slice(0, 3)], name: '4 to Flush', reason: 'EV: ~1.0 • Draw 1', payout: 1.0, source: 'wizardofodds.com' };
      }
    }
    // Pair of Kings or Aces (joker + K or A)
    const kingsAces = nonJokerIndices.filter(i => cards[i].rank === 'K' || cards[i].rank === 'A');
    if (kingsAces.length > 0) {
      return { hold: [jokerIdx, kingsAces[0]], name: 'Pair K/A', reason: 'EV: 1.00 • Kings or Better', payout: 1, source: 'wizardofodds.com' };
    }
    // Just the joker
    return { hold: jokerIndices, name: 'Joker Only', reason: 'EV: ~0.8 • Draw 4', payout: 0.8, source: 'wizardofodds.com' };
  }
  
  // === NO JOKER ===
  const analysis = analyzeHandForWoO(cards);
  
  // Natural Royal
  if (analysis.isRoyalFlush) return { hold: [0,1,2,3,4], name: 'Natural Royal', reason: 'EV: 800.00 • Jackpot!', payout: 800, source: 'wizardofodds.com' };
  // 4 to Royal
  if (analysis.fourToRoyal) return { hold: analysis.fourToRoyal.indices, name: '4 to Royal', reason: 'EV: ~19 • Draw 1', payout: 19, source: 'wizardofodds.com' };
  // Straight Flush
  if (analysis.isStraightFlush) return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 50.00', payout: 50, source: 'wizardofodds.com' };
  // Four of a Kind
  if (analysis.is4K) return { hold: [0,1,2,3,4], name: 'Four of a Kind', reason: 'EV: 20.00', payout: 20, source: 'wizardofodds.com' };
  // 4 to SF
  if (analysis.fourToSF) return { hold: analysis.fourToSF.indices, name: '4 to SF', reason: 'EV: ~3.5 • Draw 1', payout: 3.5, source: 'wizardofodds.com' };
  // Full House
  if (analysis.isFullHouse) return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 7.00', payout: 7, source: 'wizardofodds.com' };
  // Flush
  if (analysis.isFlush) return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 5.00', payout: 5, source: 'wizardofodds.com' };
  // Straight
  if (analysis.isStraight) return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 3.00', payout: 3, source: 'wizardofodds.com' };
  // Three of a Kind
  if (analysis.trips) return { hold: analysis.trips.indices, name: 'Three of a Kind', reason: 'EV: 2.00 • Draw 2', payout: 2, source: 'wizardofodds.com' };
  // 3 to Royal
  if (analysis.threeToRoyal) return { hold: analysis.threeToRoyal.indices, name: '3 to Royal', reason: 'EV: ~1.4 • Draw 2', payout: 1.4, source: 'wizardofodds.com' };
  // Two Pair
  if (analysis.twoPair) return { hold: analysis.twoPair.indices, name: 'Two Pair', reason: 'EV: 1.00', payout: 1, source: 'wizardofodds.com' };
  // Pair of Kings or Aces
  if (rankCounts['K']?.length === 2) {
    return { hold: rankCounts['K'], name: 'Pair of Kings', reason: 'EV: 1.00 • Kings or Better', payout: 1, source: 'wizardofodds.com' };
  }
  if (rankCounts['A']?.length === 2) {
    return { hold: rankCounts['A'], name: 'Pair of Aces', reason: 'EV: 1.00 • Aces pay!', payout: 1, source: 'wizardofodds.com' };
  }
  // 3 to SF (good connectors)
  if (analysis.threeToSF1 || analysis.threeToSF2) {
    const sf = analysis.threeToSF1 || analysis.threeToSF2;
    return { hold: sf.indices, name: '3 to SF', reason: 'EV: ~0.7 • Draw 2', payout: 0.7, source: 'wizardofodds.com' };
  }
  // Low Pair (doesn't pay but has draw value)
  if (analysis.lowPair) return { hold: analysis.lowPair.indices, name: 'Low Pair', reason: 'EV: ~0.6 • Draw 3', payout: 0.6, source: 'wizardofodds.com' };
  // 4 to Flush
  if (analysis.fourToFlush) return { hold: analysis.fourToFlush.indices, name: '4 to Flush', reason: 'EV: ~0.77 • Draw 1', payout: 0.77, source: 'wizardofodds.com' };
  // 4 to Outside Straight
  if (analysis.fourToOutside) return { hold: analysis.fourToOutside.indices, name: '4 to Straight', reason: 'EV: ~0.6 • Draw 1', payout: 0.6, source: 'wizardofodds.com' };
  // Single K or A
  const singleK = nonJokerIndices.find(i => cards[i].rank === 'K');
  const singleA = nonJokerIndices.find(i => cards[i].rank === 'A');
  if (singleK !== undefined) return { hold: [singleK], name: 'Single King', reason: 'EV: ~0.45 • Draw 4', payout: 0.45, source: 'wizardofodds.com' };
  if (singleA !== undefined) return { hold: [singleA], name: 'Single Ace', reason: 'EV: ~0.45 • Draw 4', payout: 0.45, source: 'wizardofodds.com' };
  
  return { hold: [], name: 'Discard All', reason: 'EV: ~0.4 • Draw 5', payout: 0.4, source: 'wizardofodds.com' };
};

// ============================================
// JOKER POKER TWO PAIR OR BETTER WoO Strategy
// Return: 99.92% (20/8/5 Full Pay)
// 53-card deck with 1 Joker wild
// Min paying hand: Two Pair (NO PAIRS PAY!)
// ============================================
const getJokerPokerTwoPairWoORecommendation = (cards, payTable) => {
  const hasJoker = cards.some(c => c.rank === 'JOKER' || c.isJoker);
  const jokerIndices = cards.map((c, i) => (c.rank === 'JOKER' || c.isJoker) ? i : -1).filter(i => i >= 0);
  const nonJokerCards = cards.filter(c => c.rank !== 'JOKER' && !c.isJoker);
  const nonJokerIndices = cards.map((c, i) => (c.rank !== 'JOKER' && !c.isJoker) ? i : -1).filter(i => i >= 0);
  
  // Rank counts for non-joker cards
  const rankCounts = {};
  cards.forEach((c, i) => { 
    if (c.rank !== 'JOKER' && !c.isJoker) {
      if (!rankCounts[c.rank]) rankCounts[c.rank] = []; 
      rankCounts[c.rank].push(i); 
    }
  });
  
  const pairsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 2);
  const tripsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 3);
  const quadsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 4);
  
  // Suit counts for non-joker cards
  const nonJokerSuitCounts = {};
  nonJokerCards.forEach(c => {
    const actualIdx = cards.indexOf(c);
    if (!nonJokerSuitCounts[c.suit]) nonJokerSuitCounts[c.suit] = [];
    nonJokerSuitCounts[c.suit].push(actualIdx);
  });
  
  const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
  const WOO_RANK_VALUES = { '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  
  // === WITH JOKER ===
  if (hasJoker) {
    const jokerIdx = jokerIndices[0];
    
    // Wild Royal (joker + 4 royal cards)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length === 4) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 50.00 • Keep it!', payout: 50, source: 'wizardofodds.com' };
      }
    }
    // Five of a Kind (joker + quads)
    if (quadsArr.length > 0) {
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 100.00 • Keep it!', payout: 100, source: 'wizardofodds.com' };
    }
    // Straight Flush (joker + 4 SF cards)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 4) {
        const vals = indices.map(i => WOO_RANK_VALUES[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 4) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 50.00 • Keep it!', payout: 50, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Four of a Kind (joker + trips)
    if (tripsArr.length > 0) {
      const tripIndices = tripsArr[0][1];
      return { hold: [...jokerIndices, ...tripIndices], name: 'Four of a Kind', reason: 'EV: 20.00 • Draw 1 for 5K', payout: 20, source: 'wizardofodds.com' };
    }
    // 4 to Wild Royal (joker + 3 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [jokerIdx, ...royalInSuit.slice(0, 3)], name: '4 to Wild Royal', reason: 'EV: ~6.5 • Draw 1', payout: 6.5, source: 'wizardofodds.com' };
      }
    }
    // Full House (joker + 2 pairs)
    if (pairsArr.length >= 2) {
      return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 10.00 • Keep it!', payout: 10, source: 'wizardofodds.com' };
    }
    // Flush (joker + 4 suited)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 4) {
        return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 6.00 • Keep it!', payout: 6, source: 'wizardofodds.com' };
      }
    }
    // 4 to Straight Flush (joker + 3 SF cards)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [jokerIdx, ...indices.slice(0, 3)], name: '4 to SF', reason: 'EV: ~5 • Draw 1', payout: 5, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Straight (joker + 4 straight cards)
    const nonJokerVals = nonJokerCards.map(c => WOO_RANK_VALUES[c.rank]).filter(v => v);
    const uniqueVals = [...new Set(nonJokerVals)].sort((a,b) => a-b);
    if (uniqueVals.length === 4 && uniqueVals[3] - uniqueVals[0] <= 4) {
      return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 5.00 • Keep it!', payout: 5, source: 'wizardofodds.com' };
    }
    // Three of a Kind (joker + pair)
    if (pairsArr.length > 0) {
      const pairIndices = pairsArr[0][1];
      return { hold: [...jokerIndices, ...pairIndices], name: 'Three of a Kind', reason: 'EV: 2.00 • Draw 2', payout: 2, source: 'wizardofodds.com' };
    }
    // 4 to Flush (joker + 3 suited)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 3) {
        return { hold: [jokerIdx, ...indices.slice(0, 3)], name: '4 to Flush', reason: 'EV: ~1.5 • Draw 1', payout: 1.5, source: 'wizardofodds.com' };
      }
    }
    // 3 to Wild Royal (joker + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [jokerIdx, ...royalInSuit.slice(0, 2)], name: '3 to Wild Royal', reason: 'EV: ~1.3 • Draw 2', payout: 1.3, source: 'wizardofodds.com' };
      }
    }
    // 4 to Straight (joker + 3 straight cards)
    // Just the joker
    return { hold: jokerIndices, name: 'Joker Only', reason: 'EV: ~0.7 • Draw 4', payout: 0.7, source: 'wizardofodds.com' };
  }
  
  // === NO JOKER - TWO PAIR MINIMUM ===
  // Key difference: NO PAIRS PAY, only Two Pair or better!
  const analysis = analyzeHandForWoO(cards);
  
  // Natural Royal
  if (analysis.isRoyalFlush) return { hold: [0,1,2,3,4], name: 'Natural Royal', reason: 'EV: 1000.00 • Jackpot!', payout: 1000, source: 'wizardofodds.com' };
  // 4 to Royal
  if (analysis.fourToRoyal) return { hold: analysis.fourToRoyal.indices, name: '4 to Royal', reason: 'EV: ~23 • Draw 1', payout: 23, source: 'wizardofodds.com' };
  // Straight Flush
  if (analysis.isStraightFlush) return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 50.00', payout: 50, source: 'wizardofodds.com' };
  // Four of a Kind
  if (analysis.is4K) return { hold: [0,1,2,3,4], name: 'Four of a Kind', reason: 'EV: 20.00', payout: 20, source: 'wizardofodds.com' };
  // Full House
  if (analysis.isFullHouse) return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 10.00', payout: 10, source: 'wizardofodds.com' };
  // 4 to SF
  if (analysis.fourToSF) return { hold: analysis.fourToSF.indices, name: '4 to SF', reason: 'EV: ~5 • Draw 1', payout: 5, source: 'wizardofodds.com' };
  // Flush
  if (analysis.isFlush) return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 6.00', payout: 6, source: 'wizardofodds.com' };
  // Straight
  if (analysis.isStraight) return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 5.00', payout: 5, source: 'wizardofodds.com' };
  // Three of a Kind
  if (analysis.trips) return { hold: analysis.trips.indices, name: 'Three of a Kind', reason: 'EV: 2.00 • Draw 2', payout: 2, source: 'wizardofodds.com' };
  // 3 to Royal
  if (analysis.threeToRoyal) return { hold: analysis.threeToRoyal.indices, name: '3 to Royal', reason: 'EV: ~1.4 • Draw 2', payout: 1.4, source: 'wizardofodds.com' };
  // Two Pair - THIS IS THE MINIMUM PAYING HAND!
  if (analysis.twoPair) return { hold: analysis.twoPair.indices, name: 'Two Pair', reason: 'EV: 1.00 • Min paying hand!', payout: 1, source: 'wizardofodds.com' };
  // 4 to Flush - ranked higher since pairs don't pay
  if (analysis.fourToFlush) return { hold: analysis.fourToFlush.indices, name: '4 to Flush', reason: 'EV: ~0.95 • Draw 1', payout: 0.95, source: 'wizardofodds.com' };
  // 3 to SF
  if (analysis.threeToSF1 || analysis.threeToSF2) {
    const sf = analysis.threeToSF1 || analysis.threeToSF2;
    return { hold: sf.indices, name: '3 to SF', reason: 'EV: ~0.8 • Draw 2', payout: 0.8, source: 'wizardofodds.com' };
  }
  // 4 to Outside Straight
  if (analysis.fourToOutside) return { hold: analysis.fourToOutside.indices, name: '4 to Straight', reason: 'EV: ~0.7 • Draw 1', payout: 0.7, source: 'wizardofodds.com' };
  // Pair - does NOT pay! But still better than nothing for trips potential
  if (analysis.highPair || analysis.lowPair) {
    const pair = analysis.highPair || analysis.lowPair;
    return { hold: pair.indices, name: 'Pair (no pay)', reason: 'EV: ~0.5 • Draw 3 for 2P/Trips', payout: 0.5, source: 'wizardofodds.com' };
  }
  // 3 to SF type 3
  if (analysis.threeToSF3) {
    return { hold: analysis.threeToSF3.indices, name: '3 to SF', reason: 'EV: ~0.45 • Draw 2', payout: 0.45, source: 'wizardofodds.com' };
  }
  
  return { hold: [], name: 'Discard All', reason: 'EV: ~0.4 • Draw 5', payout: 0.4, source: 'wizardofodds.com' };
};

// ============================================
// END WoO STRATEGY ENGINE
// ============================================

// JoB Strategy engine based on optimal play (LEGACY - keeping for comparison)
// payTable parameter allows for future strategy adjustments based on pay table
// Strategy recommendation engine - works for JoB-family games
// Different bonus games have nuances, but core strategy is similar
const getStrategyRecommendation = (cards, payTable = null, gameType = 'jacks-or-better') => {
  if (!cards || cards.length !== 5 || cards.some(c => !c)) return null;
  
  const hand = evaluateHand(cards, gameType);
  const draws = analyzeDraws(cards);
  
  // Get pay table values (default to 9/6 if not provided)
  const flushPay = payTable?.fl || 6;
  const fullHousePay = payTable?.fh || 9;
  
  // Game-specific adjustments
  const isHighFlushGame = flushPay >= 7; // TDB, some DB variants
  const isBonusGame = ['bonus-poker', 'double-bonus', 'double-double-bonus', 'triple-double-bonus'].includes(gameType);
  // Check if this is a deuces wild variant (any game where 2s are wild)
  const deucesWildGames = ['deuces-wild', 'bonus-deuces-wild', 'double-bonus-deuces-wild', 'super-bonus-deuces-wild', 'loose-deuces', 'double-deuces', 'deuces-and-joker', 'faces-n-deuces', 'acey-deucey'];
  const isDeucesWild = deucesWildGames.includes(gameType);
  
  // Deuces Wild has completely different strategy
  if (isDeucesWild) {
    const deuceCount = cards.filter(c => c.rank === '2').length;
    const deuceIndices = cards.map((c, i) => c.rank === '2' ? i : -1).filter(i => i >= 0);
    
    if (deuceCount >= 3) {
      return {
        hold: deuceIndices,
        name: `${deuceCount} Deuces`,
        reason: 'Hold only the deuces, draw for 5 of a kind',
        payout: 'Drawing for wild royal or 5K'
      };
    }
    if (deuceCount === 2) {
      const ranks = cards.map(c => c.rank);
      const rankCounts = {};
      ranks.forEach((r, i) => { if (!rankCounts[r]) rankCounts[r] = []; rankCounts[r].push(i); });
      
      // Check for trips (2 deuces + trips = 5 of a kind) - KEEP
      const tripRank = Object.keys(rankCounts).find(r => r !== '2' && rankCounts[r].length === 3);
      if (tripRank) {
        return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'Keep your 5 of a kind!', payout: 15 };
      }
      
      // Check if we have a wild royal (2 deuces + 3 royals of same suit)
      const nonDeuceCards = cards.filter(c => c.rank !== '2');
      const suitCounts = {};
      nonDeuceCards.forEach(c => { suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1; });
      const flushSuit = Object.keys(suitCounts).find(s => suitCounts[s] === 3);
      if (flushSuit) {
        const royalRanks = ['A', 'K', 'Q', 'J', '10'];
        const suitedCards = nonDeuceCards.filter(c => c.suit === flushSuit);
        if (suitedCards.every(c => royalRanks.includes(c.rank))) {
          return { hold: [0,1,2,3,4], name: 'Wild Royal Flush', reason: 'Keep your Wild Royal!', payout: 25 };
        }
      }
      
      // Check for a pair (which becomes quads with 2 deuces) - DRAW 1 for 5K
      const pairRank = Object.keys(rankCounts).find(r => r !== '2' && rankCounts[r].length === 2);
      if (pairRank) {
        return { 
          hold: [...rankCounts[pairRank], ...deuceIndices], 
          name: 'Quads (draw for 5K)', 
          reason: 'Draw 1 for five of a kind!', 
          payout: 'Drawing for 5K' 
        };
      }
      
      // 4 to a Royal
      if (draws.fourToRoyal) {
        return { hold: [...draws.fourToRoyal.indices], name: '4 to Royal w/ deuces', reason: 'Go for the wild royal', payout: 'Drawing for 25x' };
      }
      
      // Just hold both deuces
      return { hold: deuceIndices, name: '2 Deuces', reason: 'Hold deuces, draw 3', payout: 'Drawing for quads+' };
    }
    if (deuceCount === 1) {
      const ranks = cards.map(c => c.rank);
      const rankCounts = {};
      ranks.forEach((r, i) => { if (!rankCounts[r]) rankCounts[r] = []; rankCounts[r].push(i); });
      
      // Check for made hands first (flush or better)
      if (hand.rank <= 5) { // Flush or better
        return { hold: [0,1,2,3,4], name: hand.name, reason: 'Keep it!', payout: hand.payout };
      }
      
      // 4 to a Royal with deuce
      if (draws.fourToRoyal) {
        return { hold: [...draws.fourToRoyal.indices], name: '4 to Royal w/ deuce', reason: 'Go for the wild royal', payout: 'Drawing for 25x' };
      }
      
      // Check for pair (which becomes trips with deuce)
      const pairRank = Object.keys(rankCounts).find(r => r !== '2' && rankCounts[r].length === 2);
      if (pairRank) {
        return { 
          hold: [...rankCounts[pairRank], ...deuceIndices], 
          name: 'Trips (pair + deuce)', 
          reason: 'Hold pair + deuce for 3 of a kind', 
          payout: 'Drawing for quads+' 
        };
      }
      
      // Check for 4 to a straight flush
      if (draws.fourToStraightFlush) {
        return { hold: draws.fourToStraightFlush.indices, name: '4 to Straight Flush', reason: 'Draw for SF', payout: 'Drawing for 50x' };
      }
      
      // Check for 4 to a flush
      if (draws.fourToFlush) {
        return { hold: draws.fourToFlush.indices, name: '4 to Flush w/ deuce', reason: 'Draw for flush', payout: 'Drawing for flush' };
      }
      
      // Check for 4 to an open-ended straight
      if (draws.fourToStraight?.open) {
        return { hold: draws.fourToStraight.indices, name: '4 to Straight w/ deuce', reason: 'Draw for straight', payout: 'Drawing for straight' };
      }
      
      // Just hold the deuce
      return { hold: deuceIndices, name: '1 Deuce', reason: 'Hold deuce, draw 4', payout: 'Drawing for trips+' };
    }
    // 0 deuces - fall through to normal strategy but adjust for DW pays
  }
  
  // 1. Royal Flush and Straight Flush - always keep
  if (hand.rank <= 2) { // Royal or Straight Flush only
    return {
      hold: [0, 1, 2, 3, 4],
      name: hand.name,
      reason: `Keep your ${hand.name}!`,
      payout: hand.payout
    };
  }
  
  // 2. Four to a Royal - beats flush, straight, and even quads (EV is higher)
  // This is BEFORE other pat hands because breaking a flush for royal draw is correct
  if (draws.fourToRoyal) {
    return {
      hold: draws.fourToRoyal.indices,
      name: '4 to Royal Flush',
      reason: 'Break anything for Royal draw!',
      payout: 'Drawing for 800x'
    };
  }
  
  // 3. Pat hands - Four of a Kind through Straight
  if (hand.rank <= 6) { // Quads, Full House, Flush, Straight
    return {
      hold: [0, 1, 2, 3, 4],
      name: hand.name,
      reason: `Keep your ${hand.name}!`,
      payout: hand.payout
    };
  }
  
  // 3.5 Four to a Straight Flush - BEFORE high pair! (EV 3.53 vs 1.54)
  // Check this before trips/two pair/high pair because 4-SF beats high pair
  const suits = cards.map(c => c.suit);
  const suitCounts = {};
  suits.forEach((s, i) => {
    if (!suitCounts[s]) suitCounts[s] = [];
    suitCounts[s].push(i);
  });
  
  for (const [suit, indices] of Object.entries(suitCounts)) {
    if (indices.length >= 4) {
      const suitedCards = indices.map(i => cards[i]);
      const suitedValues = suitedCards.map(c => RANK_VALUES[c.rank]).sort((a, b) => a - b);
      // Check if these 4 cards could make a straight flush (span of 4 or less)
      const gaps = suitedValues[suitedValues.length-1] - suitedValues[0];
      if (gaps <= 4 && indices.length === 4) {
        return {
          hold: indices,
          name: '4 to Straight Flush',
          reason: '4-SF (EV 3.53) beats high pair (EV 1.54)!',
          payout: 'Drawing for 50x'
        };
      }
    }
  }
  
  // 4. Made paying hands (trips, two pair, high pair)
  if (hand.rank <= 9) { // Three of kind through Jacks+
    const holdIndices = [];
    const ranks = cards.map(c => c.rank);
    const rankCounts = {};
    ranks.forEach((r, i) => {
      if (!rankCounts[r]) rankCounts[r] = [];
      rankCounts[r].push(i);
    });
    
    if (hand.rank === 7) { // Trips
      const tripRank = Object.keys(rankCounts).find(r => rankCounts[r].length === 3);
      return {
        hold: rankCounts[tripRank],
        name: 'Three of a Kind',
        reason: 'Hold the trips, draw 2',
        payout: hand.payout
      };
    }
    if (hand.rank === 8) { // Two pair
      Object.values(rankCounts).forEach(indices => {
        if (indices.length === 2) holdIndices.push(...indices);
      });
      return {
        hold: holdIndices,
        name: 'Two Pair',
        reason: 'Hold both pairs, draw 1',
        payout: hand.payout
      };
    }
    if (hand.rank === 9) { // High pair
      const pairRank = Object.keys(rankCounts).find(r => rankCounts[r].length === 2 && HIGH_CARDS.includes(r));
      return {
        hold: rankCounts[pairRank],
        name: `Pair of ${pairRank}s`,
        reason: 'Hold the high pair, draw 3',
        payout: hand.payout
      };
    }
  }
  
  // 5. Three to a Royal
  if (draws.threeToRoyal) {
    return {
      hold: draws.threeToRoyal.indices,
      name: '3 to Royal Flush',
      reason: 'Strong draw to Royal',
      payout: 'Drawing for 800x'
    };
  }
  
  // 6. Four to a Flush vs Low Pair
  // This decision is affected by pay table!
  // On standard JoB (flush=6): low pair is better
  // On high-flush games like TDB (flush=7): 4-flush is better
  if (draws.fourToFlush) {
    if (draws.lowPair) {
      // High flush pay (7+) makes 4-flush better than low pair
      if (isHighFlushGame) {
        return {
          hold: draws.fourToFlush.indices,
          name: '4 to Flush',
          reason: `4-flush beats low pair when flush pays ${flushPay}`,
          payout: `Drawing for ${flushPay}x`
        };
      }
      // Standard flush pay - low pair wins
      return {
        hold: draws.lowPair.indices,
        name: `Low Pair (${draws.lowPair.rank}s)`,
        reason: `Low pair beats 4-flush on ${fullHousePay}/${flushPay}`,
        payout: 'Drawing for trips or better'
      };
    }
    return {
      hold: draws.fourToFlush.indices,
      name: '4 to Flush',
      reason: `Draw to the Flush (pays ${flushPay}x)`,
      payout: `Drawing for ${flushPay}x`
    };
  }
  
  // 7. Low pair
  if (draws.lowPair) {
    return {
      hold: draws.lowPair.indices,
      name: `Low Pair (${draws.lowPair.rank}s)`,
      reason: 'Hold the pair, draw 3',
      payout: 'Drawing for trips or better'
    };
  }
  
  // 8. Four to a Straight (open-ended)
  // Simplified check - look for 4 consecutive values
  const values = cards.map(c => RANK_VALUES[c.rank]);
  const sortedUniqueValues = [...new Set(values)].sort((a, b) => a - b);
  if (sortedUniqueValues.length >= 4) {
    for (let i = 0; i <= sortedUniqueValues.length - 4; i++) {
      const span = sortedUniqueValues.slice(i, i + 4);
      if (span[3] - span[0] === 3) {
        const holdIndices = span.map(v => values.indexOf(v));
        return {
          hold: holdIndices,
          name: '4 to Straight',
          reason: 'Open-ended straight draw',
          payout: 'Drawing for 4x'
        };
      }
    }
  }
  
  // 9. Three to a Straight Flush
  for (const [suit, indices] of Object.entries(suitCounts)) {
    if (indices.length >= 3) {
      const suitedValues = indices.map(i => RANK_VALUES[cards[i].rank]).sort((a, b) => a - b);
      const gaps = suitedValues[suitedValues.length-1] - suitedValues[0];
      if (gaps <= 4) {
        return {
          hold: indices.slice(0, 3),
          name: '3 to Straight Flush',
          reason: 'Draw to Straight Flush',
          payout: 'Long shot for 50x'
        };
      }
    }
  }
  
  // 10. Two suited high cards
  for (const [suit, indices] of Object.entries(suitCounts)) {
    if (indices.length >= 2) {
      const highIndices = indices.filter(i => HIGH_CARDS.includes(cards[i].rank));
      if (highIndices.length >= 2) {
        return {
          hold: highIndices.slice(0, 2),
          name: '2 Suited High Cards',
          reason: 'Keep suited high cards',
          payout: 'Drawing for Royal/Flush/Pair'
        };
      }
    }
  }
  
  // 11. AKQJ unsuited (4 to broadway)
  const highCardIndices = cards.map((c, i) => ['A', 'K', 'Q', 'J'].includes(c.rank) ? i : -1).filter(i => i >= 0);
  if (highCardIndices.length === 4) {
    return {
      hold: highCardIndices,
      name: 'AKQJ (4 High Cards)',
      reason: 'Draw to Broadway straight',
      payout: 'Drawing for straight or pair'
    };
  }
  
  // 12. Any high cards
  if (draws.highCards && draws.highCards.indices.length > 0) {
    // Prefer fewer high cards (2 > 3)
    const keep = draws.highCards.indices.slice(0, Math.min(2, draws.highCards.indices.length));
    const cardNames = keep.map(i => cards[i].rank).join('-');
    return {
      hold: keep,
      name: `High Card${keep.length > 1 ? 's' : ''} (${cardNames})`,
      reason: keep.length === 1 ? 'Keep the high card, draw 4' : 'Keep high cards, draw 3',
      payout: 'Drawing for high pair'
    };
  }
  
  // 13. Nothing - draw all 5
  return {
    hold: [],
    name: 'No Hold',
    reason: 'Draw all 5 cards',
    payout: 'Starting fresh'
  };
};

// ============================================
// STRATEGY VALIDATOR - Test Suite
// ============================================
// Helper to create card objects from shorthand notation
const parseCard = (str) => {
  // Handle formats like "A♠", "As", "A-s", "10h", "10♥"
  const suitMap = {
    's': '♠', 'S': '♠', '♠': '♠',
    'h': '♥', 'H': '♥', '♥': '♥',
    'd': '♦', 'D': '♦', '♦': '♦',
    'c': '♣', 'C': '♣', '♣': '♣'
  };
  const colorMap = { '♠': 'text-black', '♣': 'text-black', '♥': 'text-red-500', '♦': 'text-red-500' };
  
  // Extract rank and suit
  let rank, suit;
  if (str.length === 2) {
    rank = str[0];
    suit = suitMap[str[1]];
  } else if (str.length === 3) {
    rank = str.slice(0, 2); // "10"
    suit = suitMap[str[2]];
  } else {
    // Handle unicode suits
    const suitChar = str.slice(-1);
    rank = str.slice(0, -1);
    suit = suitMap[suitChar] || suitChar;
  }
  
  return { rank, suit, color: colorMap[suit] || 'text-black' };
};

const parseHand = (handStr) => handStr.split(' ').map(parseCard);

// Strategy test cases - organized by game type
// Each test case: { hand: "As Ah Kd Qc Js", expectedHold: [0,1], name: "description", notes: "optional" }
// COMPREHENSIVE TEST SUITE - Based on Wizard of Odds optimal strategy charts

const strategyTestCases = {
  'jacks-or-better': [
    // ==========================================
    // PAT HANDS (Keep all 5)
    // ==========================================
    { hand: "As Ks Qs Js 10s", expectedHold: [0,1,2,3,4], name: "Royal Flush" },
    { hand: "9s 8s 7s 6s 5s", expectedHold: [0,1,2,3,4], name: "Straight Flush" },
    { hand: "5h 4h 3h 2h Ah", expectedHold: [0,1,2,3,4], name: "Straight Flush (wheel)" },
    { hand: "7s 7h 7d 7c 2s", expectedHold: [0,1,2,3,4], name: "Four of a Kind" },
    { hand: "As Ah Ad Ac Ks", expectedHold: [0,1,2,3,4], name: "Four Aces" },
    { hand: "Ks Kh Kd 5s 5h", expectedHold: [0,1,2,3,4], name: "Full House" },
    { hand: "As Ks 9s 5s 3s", expectedHold: [0,1,2,3,4], name: "Flush (no draw)" },
    { hand: "9h 8s 7d 6c 5h", expectedHold: [0,1,2,3,4], name: "Straight (9-high)" },
    { hand: "Ah Ks Qd Jc 10h", expectedHold: [0,1,2,3,4], name: "Straight (broadway)" },
    { hand: "5h 4s 3d 2c Ah", expectedHold: [0,1,2,3,4], name: "Straight (wheel)" },
    
    // ==========================================
    // FOUR TO ROYAL (breaks any pat hand except RF/SF)
    // Per WoO: 4 to Royal > Flush, Straight, Trips, Two Pair
    // ==========================================
    { hand: "As Ks Qs Js 3s", expectedHold: [0,1,2,3], name: "4 to Royal > made flush" },
    { hand: "As Ks Qs 10s 3s", expectedHold: [0,1,2,3], name: "4 to Royal (A-K-Q-10) > flush" },
    { hand: "Ks Qs Js 10s 3s", expectedHold: [0,1,2,3], name: "4 to Royal (K-Q-J-10) > flush" },
    
    // ==========================================
    // THREE OF A KIND
    // ==========================================
    { hand: "7s 7h 7d Kc 2s", expectedHold: [0,1,2], name: "Trips - hold 3, draw 2" },
    { hand: "As Ah Ad 7c 2s", expectedHold: [0,1,2], name: "Trip Aces" },
    { hand: "2s 2h 2d Kc 7s", expectedHold: [0,1,2], name: "Trip 2s" },
    
    // ==========================================
    // TWO PAIR
    // ==========================================
    { hand: "As Ah Kd Kc 2s", expectedHold: [0,1,2,3], name: "Two pair AA/KK" },
    { hand: "5s 5h 3d 3c As", expectedHold: [0,1,2,3], name: "Two pair low" },
    { hand: "Js Jh 10d 10c 2s", expectedHold: [0,1,2,3], name: "Two pair JJ/1010" },
    
    // ==========================================
    // HIGH PAIR (Jacks or Better) - Hold pair only
    // ==========================================
    { hand: "As Ah Kd Qc 5s", expectedHold: [0,1], name: "Pair of Aces" },
    { hand: "Ks Kh 9d 5c 2s", expectedHold: [0,1], name: "Pair of Kings" },
    { hand: "Qs Qh 7d 4c 2s", expectedHold: [0,1], name: "Pair of Queens" },
    { hand: "Js Jh 7d 4c 2s", expectedHold: [0,1], name: "Pair of Jacks" },
    { hand: "As Ah Kd Qc Jh", expectedHold: [0,1], name: "Pair of Aces + 3 high cards" },
    
    // ==========================================
    // FOUR TO STRAIGHT FLUSH
    // ==========================================
    { hand: "9s 8s 7s 6s 2h", expectedHold: [0,1,2,3], name: "4 to SF open-ended" },
    { hand: "Js 10s 9s 8s 2h", expectedHold: [0,1,2,3], name: "4 to SF J-high open" },
    { hand: "9s 8s 7s 5s 2h", expectedHold: [0,1,2,3], name: "4 to SF inside" },
    { hand: "6s 5s 4s 3s Ah", expectedHold: [0,1,2,3], name: "4 to SF low" },
    
    // ==========================================
    // LOW PAIR - Various scenarios
    // ==========================================
    { hand: "5s 5h Kd Qc 2s", expectedHold: [0,1], name: "Low pair (5s)" },
    { hand: "10s 10h Kd 7c 2s", expectedHold: [0,1], name: "Pair of 10s (not JoB)" },
    { hand: "3s 3h Ad Kc Qh", expectedHold: [0,1], name: "Low pair + 3 high cards" },
    { hand: "6s 6h 5d 4c 3h", expectedHold: [0,1], name: "Low pair + 3 to straight" },
    
    // ==========================================
    // LOW PAIR VS 4 TO FLUSH (9/6 JoB: pair wins)
    // ==========================================
    { hand: "5s 5h Ks 9s 2s", expectedHold: [0,1], name: "Low pair beats 4-flush (9/6)" },
    { hand: "3s 3h As Ks Qs", expectedHold: [0,1], name: "Low pair beats 4-flush w/ royals" },
    
    // ==========================================
    // FOUR TO FLUSH (no pair)
    // ==========================================
    { hand: "As Ks 9s 5s 2h", expectedHold: [0,1,2,3], name: "4 to Flush" },
    { hand: "Js 9s 7s 4s 2h", expectedHold: [0,1,2,3], name: "4 to Flush (J high)" },
    { hand: "9s 7s 5s 3s Ah", expectedHold: [0,1,2,3], name: "4 to Flush (9 high)" },
    
    // ==========================================
    // THREE TO ROYAL FLUSH
    // ==========================================
    { hand: "As Ks Qs 7h 2d", expectedHold: [0,1,2], name: "3 to Royal AKQ" },
    { hand: "Ks Qs Js 7h 2d", expectedHold: [0,1,2], name: "3 to Royal KQJ" },
    { hand: "As Ks 10s 7h 2d", expectedHold: [0,1,2], name: "3 to Royal AK10" },
    { hand: "Qs Js 10s 7h 2d", expectedHold: [0,1,2], name: "3 to Royal QJ10" },
    { hand: "As Qs 10s 7h 2d", expectedHold: [0,1,2], name: "3 to Royal AQ10" },
    
    // ==========================================
    // FOUR TO STRAIGHT (open-ended)
    // ==========================================
    { hand: "9h 8s 7d 6c 2s", expectedHold: [0,1,2,3], name: "4 to Straight open 9-high" },
    { hand: "Jh 10s 9d 8c 2s", expectedHold: [0,1,2,3], name: "4 to Straight open J-high" },
    { hand: "6h 5s 4d 3c As", expectedHold: [0,1,2,3], name: "4 to Straight open 6-high" },
    
    // ==========================================
    // HIGH CARDS ONLY
    // ==========================================
    { hand: "As 7d 5c 3h 2s", expectedHold: [0], name: "Ace only" },
    { hand: "Ks 7d 5c 3h 2s", expectedHold: [0], name: "King only" },
    { hand: "As Kd 7c 5h 2s", expectedHold: [0,1], name: "AK offsuit" },
    { hand: "As Qd 7c 5h 2s", expectedHold: [0,1], name: "AQ offsuit" },
    { hand: "Kd Qc 7s 5h 2d", expectedHold: [0,1], name: "KQ offsuit" },
    { hand: "Kd Jc 7s 5h 2d", expectedHold: [0,1], name: "KJ offsuit" },
    { hand: "Qd Jc 7s 5h 2d", expectedHold: [0,1], name: "QJ offsuit" },
    
    // ==========================================
    // SUITED HIGH CARDS (2 cards)
    // ==========================================
    { hand: "As Ks 7d 5c 2h", expectedHold: [0,1], name: "AK suited" },
    { hand: "Ks Qs 7d 5c 2h", expectedHold: [0,1], name: "KQ suited" },
    { hand: "Qs Js 7d 5c 2h", expectedHold: [0,1], name: "QJ suited" },
    { hand: "Js 10s 7d 5c 2h", expectedHold: [0,1], name: "JT suited" },
    { hand: "As Js 7d 5c 2h", expectedHold: [0,1], name: "AJ suited" },
    
    // ==========================================
    // INSIDE STRAIGHT DRAWS (4 to gutshot)
    // Usually not worth it except with high cards
    // ==========================================
    { hand: "As Ks Qd Jc 2h", expectedHold: [0,1,2,3], name: "4 to Broadway (AKQJ)" },
    { hand: "Kh Qd Jc 10s 2h", expectedHold: [0,1,2,3], name: "4 to Straight KQJT open" },
    
    // ==========================================
    // GARBAGE HANDS - Draw 5
    // ==========================================
    { hand: "9d 7c 5s 3h 2d", expectedHold: [], name: "No value - draw 5" },
    { hand: "10d 8c 5s 3h 2d", expectedHold: [], name: "10 high garbage" },
    { hand: "9d 7c 4s 3h 2d", expectedHold: [], name: "9 high garbage" },
    
    // ==========================================
    // EDGE CASES / TRICKY DECISIONS
    // ==========================================
    { hand: "Js 10s 9s Ah Kd", expectedHold: [0,1,2], name: "3 to SF > AK offsuit" },
    { hand: "Ah Kh Qh 10s 9s", expectedHold: [0,1,2], name: "3 to Royal > 2 suited non-royal" },
    { hand: "As Ah 10h 9h 8h", expectedHold: [0,1], name: "High pair > 3 to flush" },
    { hand: "5s 5h 4d 3c 2h", expectedHold: [0,1], name: "Low pair > 4 to straight" },
    { hand: "Js Jh Qs Ks As", expectedHold: [0,1], name: "High pair > 4 to flush with royals" },
  ],
  
  'deuces-wild': [
    // ==========================================
    // NATURAL HANDS (No Deuces) - Pat
    // ==========================================
    { hand: "As Ks Qs Js 10s", expectedHold: [0,1,2,3,4], name: "Natural Royal" },
    { hand: "9s 8s 7s 6s 5s", expectedHold: [0,1,2,3,4], name: "Straight Flush" },
    { hand: "7s 7h 7d 7c 3s", expectedHold: [0,1,2,3,4], name: "Four of a Kind (no wild)" },
    { hand: "As Ks 9s 6s 3s", expectedHold: [0,1,2,3,4], name: "Flush (no wild)" },
    { hand: "9h 8d 7c 6s 5h", expectedHold: [0,1,2,3,4], name: "Straight (no wild)" },
    
    // ==========================================
    // 4 DEUCES (Hold deuces, draw for wild royal)
    // ==========================================
    { hand: "2s 2h 2d 2c 7s", expectedHold: [0,1,2,3], name: "4 Deuces" },
    { hand: "2s 2h 2d 2c As", expectedHold: [0,1,2,3], name: "4 Deuces + Ace" },
    { hand: "2s 2h 2d 2c Ks", expectedHold: [0,1,2,3], name: "4 Deuces + King" },
    
    // ==========================================
    // 3 DEUCES (Hold deuces only, draw 2)
    // ==========================================
    { hand: "2s 2h 2d Kc 7s", expectedHold: [0,1,2], name: "3 Deuces + garbage" },
    { hand: "2s 2h 2d Ac Ah", expectedHold: [0,1,2], name: "3 Deuces + pair (still draw 2)" },
    { hand: "2s 2h 2d As Ks", expectedHold: [0,1,2], name: "3 Deuces + 2 royals" },
    { hand: "2s 2h 2d 7s 7h", expectedHold: [0,1,2], name: "3 Deuces + low pair" },
    
    // ==========================================
    // 2 DEUCES
    // ==========================================
    // 2 Deuces + trips = 5 of a kind - KEEP
    { hand: "2s 2h 7d 7c 7s", expectedHold: [0,1,2,3,4], name: "2 Deuces + trips = 5K keep" },
    { hand: "2s 2h As Ah Ad", expectedHold: [0,1,2,3,4], name: "2 Deuces + trip Aces = 5K" },
    
    // 2 Deuces + pair = quads - draw 1 for 5K (EV is close but drawing wins)
    { hand: "2s 2h As Ah 7d", expectedHold: [0,1,2,3], name: "2 Deuces + pair = quads, draw 1" },
    { hand: "2s 2h 5s 5h Kd", expectedHold: [0,1,2,3], name: "2 Deuces + low pair, draw 1" },
    
    // 2 Deuces + 4 to Royal
    { hand: "2s 2h Ks Qs Js", expectedHold: [0,1,2,3,4], name: "2 Deuces + 3 royals = wild royal" },
    { hand: "2s 2h As Ks Qs", expectedHold: [0,1,2,3,4], name: "2 Deuces + AKQ suited = wild royal" },
    
    // 2 Deuces alone
    { hand: "2s 2h Kd Qc 7s", expectedHold: [0,1], name: "2 Deuces + nothing" },
    { hand: "2s 2h Ad Kc Qs", expectedHold: [0,1], name: "2 Deuces + AKQ offsuit" },
    { hand: "2s 2h 9d 7c 4s", expectedHold: [0,1], name: "2 Deuces + low cards" },
    
    // ==========================================
    // 1 DEUCE
    // ==========================================
    // 1 Deuce + made hands
    { hand: "2s As Ks Qs Js", expectedHold: [0,1,2,3,4], name: "1 Deuce = wild royal" },
    { hand: "2s 9s 8s 7s 6s", expectedHold: [0,1,2,3,4], name: "1 Deuce = straight flush" },
    { hand: "2s 7d 7c 7s 7h", expectedHold: [0,1,2,3,4], name: "1 Deuce + quads = 5K" },
    { hand: "2s As Ks 9s 5s", expectedHold: [0,1,2,3,4], name: "1 Deuce = flush" },
    { hand: "2s 9h 8d 7c 6s", expectedHold: [0,1,2,3,4], name: "1 Deuce = straight" },
    
    // 1 Deuce + 4 to Royal
    { hand: "2s Ks Qs Js 10s", expectedHold: [0,1,2,3,4], name: "1 Deuce + KQJT suited = wild royal" },
    { hand: "2s As Ks Qs 7d", expectedHold: [0,1,2,3], name: "1 Deuce + 3 to Royal, draw 1" },
    
    // 1 Deuce + trips
    { hand: "2s 7d 7c 7s Kh", expectedHold: [0,1,2,3], name: "1 Deuce + trips = quads, draw 1" },
    { hand: "2s As Ah Ad Kc", expectedHold: [0,1,2,3], name: "1 Deuce + trip Aces" },
    
    // 1 Deuce + pair = trips (HOLD BOTH)
    { hand: "2s Ah Ad Kc 7s", expectedHold: [0,1,2], name: "1 Deuce + pair Aces" },
    { hand: "2s 5h 5d Kc 7s", expectedHold: [0,1,2], name: "1 Deuce + low pair" },
    { hand: "2s Kh Kd Qc 7s", expectedHold: [0,1,2], name: "1 Deuce + pair Kings" },
    { hand: "2s 9h 9d 8c 7s", expectedHold: [0,1,2], name: "1 Deuce + pair 9s" },
    
    // 1 Deuce + 4 to SF
    { hand: "2s 9s 8s 7s Kd", expectedHold: [0,1,2,3], name: "1 Deuce + 3 to SF" },
    { hand: "2s Js 10s 9s Kd", expectedHold: [0,1,2,3], name: "1 Deuce + JT9 suited" },
    
    // 1 Deuce + 4 to flush
    { hand: "2s Ks 9s 5s 7d", expectedHold: [0,1,2,3], name: "1 Deuce + 3 to flush" },
    
    // 1 Deuce + 4 to straight
    { hand: "2s 9h 8d 7c Ks", expectedHold: [0,1,2,3], name: "1 Deuce + 3 to straight open" },
    
    // 1 Deuce alone
    { hand: "2s Kd Qc 7h 4s", expectedHold: [0], name: "1 Deuce + nothing" },
    { hand: "2s Ad Kc 9h 4s", expectedHold: [0], name: "1 Deuce + AK offsuit = hold deuce only" },
    { hand: "2s 9d 7c 5h 3s", expectedHold: [0], name: "1 Deuce + low garbage" },
    
    // ==========================================
    // 0 DEUCES - Standard poker but no pair pays
    // ==========================================
    { hand: "As Ks Qs Js 10s", expectedHold: [0,1,2,3,4], name: "0 Deuces - natural royal" },
    { hand: "As Ks 9s 5s 3s", expectedHold: [0,1,2,3,4], name: "0 Deuces - flush" },
    { hand: "Ah Kd Qc Js 10h", expectedHold: [0,1,2,3,4], name: "0 Deuces - straight" },
    { hand: "As Ah Ad 7c 5s", expectedHold: [0,1,2], name: "0 Deuces - trips" },
    { hand: "As Ah Kd Kc 5s", expectedHold: [0,1,2,3], name: "0 Deuces - two pair" },
    
    // 0 Deuces - 4 to Royal
    { hand: "As Ks Qs Js 7d", expectedHold: [0,1,2,3], name: "0 Deuces - 4 to Royal" },
    { hand: "Ks Qs Js 10s 7d", expectedHold: [0,1,2,3], name: "0 Deuces - 4 to Royal KQJT" },
    
    // 0 Deuces - pair (still worth holding for trips in DW)
    { hand: "As Ah Kd 9c 5s", expectedHold: [0,1], name: "0 Deuces - pair Aces" },
    { hand: "5s 5h Kd 9c 3s", expectedHold: [0,1], name: "0 Deuces - low pair" },
    
    // 0 Deuces - 4 to flush
    { hand: "As Ks 9s 5s 7d", expectedHold: [0,1,2,3], name: "0 Deuces - 4 to flush" },
    
    // 0 Deuces - 4 to straight
    { hand: "9h 8d 7c 6s Ks", expectedHold: [0,1,2,3], name: "0 Deuces - 4 to straight" },
    
    // 0 Deuces - 3 to Royal
    { hand: "As Ks Qs 7d 4c", expectedHold: [0,1,2], name: "0 Deuces - 3 to Royal" },
  ],
  
  'double-bonus': [
    // Same as JoB for most, but quad bonuses affect marginal decisions
    { hand: "As Ah Ad Ac 7s", expectedHold: [0,1,2,3,4], name: "Quad Aces = 160x" },
    { hand: "3s 3h 3d 3c 7s", expectedHold: [0,1,2,3,4], name: "Quad 3s = 80x" },
    { hand: "7s 7h 7d 7c As", expectedHold: [0,1,2,3,4], name: "Quad 7s = 50x" },
    
    // Trips
    { hand: "As Ah Ad Kc 7s", expectedHold: [0,1,2], name: "Trip Aces" },
    { hand: "3s 3h 3d Kc 7s", expectedHold: [0,1,2], name: "Trip 3s" },
    
    // High pair
    { hand: "As Ah Kd Qc Js", expectedHold: [0,1], name: "Pair of Aces" },
    
    // Low pair beats 4-flush on 9/7 DB
    { hand: "5s 5h Ks 9s 3s", expectedHold: [0,1], name: "Low pair > 4-flush (9/7)" },
    
    // Standard draws
    { hand: "As Ks Qs Js 3s", expectedHold: [0,1,2,3], name: "4 to Royal > flush" },
    { hand: "As Ks Qs 7h 3d", expectedHold: [0,1,2], name: "3 to Royal" },
  ],
  
  'double-double-bonus': [
    // Kicker matters for Aces + 2-4
    { hand: "As Ah Ad Ac 3s", expectedHold: [0,1,2,3,4], name: "Quad Aces + 2-4 = 400x" },
    { hand: "As Ah Ad Ac 2s", expectedHold: [0,1,2,3,4], name: "Quad Aces + 2 = 400x" },
    { hand: "As Ah Ad Ac Ks", expectedHold: [0,1,2,3,4], name: "Quad Aces + high = 160x" },
    
    // Quad 2-4 with A-4 kicker
    { hand: "3s 3h 3d 3c As", expectedHold: [0,1,2,3,4], name: "Quad 3s + A = 160x" },
    { hand: "3s 3h 3d 3c 4s", expectedHold: [0,1,2,3,4], name: "Quad 3s + 4 = 160x" },
    { hand: "3s 3h 3d 3c Ks", expectedHold: [0,1,2,3,4], name: "Quad 3s + K = 80x" },
    
    // Other quads
    { hand: "7s 7h 7d 7c As", expectedHold: [0,1,2,3,4], name: "Quad 7s = 50x" },
  ],
  
  'bonus-poker': [
    { hand: "As Ah Ad Ac 7s", expectedHold: [0,1,2,3,4], name: "Quad Aces = 80x" },
    { hand: "3s 3h 3d 3c 7s", expectedHold: [0,1,2,3,4], name: "Quad 3s = 40x" },
    { hand: "7s 7h 7d 7c As", expectedHold: [0,1,2,3,4], name: "Quad 7s = 25x" },
    
    // Standard JoB strategy otherwise
    { hand: "As Ah Kd Qc 5s", expectedHold: [0,1], name: "Pair of Aces" },
    { hand: "5s 5h Kd Qc 2s", expectedHold: [0,1], name: "Low pair" },
    { hand: "As Ks Qs Js 3s", expectedHold: [0,1,2,3], name: "4 to Royal > flush" },
  ],
  
  'joker-poker': [
    // Would need Joker card support - placeholder
  ],
};

// Run a single test case
const runStrategyTest = (testCase, gameType) => {
  const cards = parseHand(testCase.hand);
  const recommendation = getStrategyRecommendation(cards, null, gameType);
  
  // Sort both arrays for comparison
  const actualHold = [...(recommendation?.hold || [])].sort((a,b) => a-b);
  const expectedHold = [...testCase.expectedHold].sort((a,b) => a-b);
  
  const passed = JSON.stringify(actualHold) === JSON.stringify(expectedHold);
  
  return {
    ...testCase,
    gameType,
    cards,
    actualHold: recommendation?.hold || [],
    actualName: recommendation?.name || 'Unknown',
    actualReason: recommendation?.reason || '',
    passed
  };
};

// Run all tests for a game type
const runGameTests = (gameType) => {
  const tests = strategyTestCases[gameType] || [];
  return tests.map(test => runStrategyTest(test, gameType));
};

// Run all tests
const runAllStrategyTests = () => {
  const results = {};
  let totalPassed = 0;
  let totalTests = 0;
  
  Object.keys(strategyTestCases).forEach(gameType => {
    const gameResults = runGameTests(gameType);
    results[gameType] = gameResults;
    totalPassed += gameResults.filter(r => r.passed).length;
    totalTests += gameResults.length;
  });
  
  return { results, totalPassed, totalTests };
};

// Strategy Validator Component
function StrategyValidator({ onClose }) {
  const [results, setResults] = useState(null);
  const [expandedGame, setExpandedGame] = useState(null);
  const [showOnlyFailed, setShowOnlyFailed] = useState(false);
  
  useEffect(() => {
    setResults(runAllStrategyTests());
  }, []);
  
  if (!results) return <div className="p-4 text-white">Running tests...</div>;
  
  const { totalPassed, totalTests } = results;
  const allPassed = totalPassed === totalTests;
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-auto">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Strategy Validator</h2>
            <p className="text-[#888] text-sm">Testing optimal play recommendations</p>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-white p-2">
            <X size={24} />
          </button>
        </div>
        
        {/* Summary */}
        <div className={`p-4 rounded mb-4 ${allPassed ? 'bg-emerald-900/30 border border-emerald-500/50' : 'bg-red-900/30 border border-red-500/50'}`}>
          <div className="flex items-center gap-3">
            {allPassed ? (
              <CheckCircle2 size={24} className="text-emerald-400" />
            ) : (
              <AlertTriangle size={24} className="text-red-400" />
            )}
            <div>
              <p className={`font-bold ${allPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                {totalPassed} / {totalTests} tests passed
              </p>
              <p className="text-[#888] text-sm">
                {allPassed ? 'All strategy recommendations are correct!' : `${totalTests - totalPassed} tests failing - review below`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Filter toggle */}
        {!allPassed && (
          <label className="flex items-center gap-2 mb-4 text-sm text-[#888]">
            <input 
              type="checkbox" 
              checked={showOnlyFailed} 
              onChange={(e) => setShowOnlyFailed(e.target.checked)}
              className="rounded"
            />
            Show only failed tests
          </label>
        )}
        
        {/* Results by game */}
        {Object.entries(results.results).map(([gameType, gameResults]) => {
          const gamePassed = gameResults.filter(r => r.passed).length;
          const gameTotal = gameResults.length;
          const gameAllPassed = gamePassed === gameTotal;
          const displayResults = showOnlyFailed ? gameResults.filter(r => !r.passed) : gameResults;
          
          if (showOnlyFailed && displayResults.length === 0) return null;
          
          return (
            <div key={gameType} className="mb-4">
              <button
                onClick={() => setExpandedGame(expandedGame === gameType ? null : gameType)}
                className={`w-full flex items-center justify-between p-3 rounded text-left ${
                  gameAllPassed ? 'bg-emerald-900/20 hover:bg-emerald-900/30' : 'bg-red-900/20 hover:bg-red-900/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  {gameAllPassed ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : (
                    <X size={16} className="text-red-400" />
                  )}
                  <span className="text-white font-medium">{gameType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${gameAllPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {gamePassed}/{gameTotal}
                  </span>
                  {expandedGame === gameType ? <ChevronUp size={16} className="text-[#888]" /> : <ChevronDown size={16} className="text-[#888]" />}
                </div>
              </button>
              
              {expandedGame === gameType && (
                <div className="mt-2 space-y-2">
                  {displayResults.map((result, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded border ${
                        result.passed 
                          ? 'bg-[#161616] border-[#333]' 
                          : 'bg-red-900/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {result.passed ? (
                              <Check size={14} className="text-emerald-400 shrink-0" />
                            ) : (
                              <X size={14} className="text-red-400 shrink-0" />
                            )}
                            <span className="text-white text-sm font-medium">{result.name}</span>
                          </div>
                          
                          {/* Hand display */}
                          <div className="flex gap-1 my-2">
                            {result.cards.map((card, i) => {
                              const isExpectedHold = result.expectedHold.includes(i);
                              const isActualHold = result.actualHold.includes(i);
                              return (
                                <div 
                                  key={i}
                                  className={`w-10 h-14 rounded border-2 flex flex-col items-center justify-center text-xs font-bold ${
                                    isExpectedHold && isActualHold ? 'bg-emerald-600 border-emerald-500 text-white' :
                                    isExpectedHold && !isActualHold ? 'bg-red-600 border-red-500 text-white' :
                                    !isExpectedHold && isActualHold ? 'bg-amber-600 border-amber-500 text-white' :
                                    'bg-[#1a1a1a] border-[#333]'
                                  }`}
                                >
                                  <span className={!isExpectedHold && !isActualHold ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white') : ''}>{card.rank}</span>
                                  <span className={!isExpectedHold && !isActualHold ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white') : ''}>{card.suit}</span>
                                </div>
                              );
                            })}
                          </div>
                          
                          {!result.passed && (
                            <div className="text-xs space-y-1">
                              <p className="text-red-400">
                                Expected hold: [{result.expectedHold.join(', ')}]
                              </p>
                              <p className="text-amber-400">
                                Actual hold: [{result.actualHold.join(', ')}] - "{result.actualName}"
                              </p>
                              <p className="text-[#666]">{result.actualReason}</p>
                            </div>
                          )}
                          
                          {result.passed && (
                            <p className="text-xs text-[#666]">
                              {result.actualName} - {result.actualReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Legend */}
        <div className="mt-6 p-3 bg-[#161616] rounded border border-[#333]">
          <p className="text-[#888] text-xs font-medium mb-2">Card Colors:</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-emerald-600 border border-emerald-500"></div>
              <span className="text-[#888]">Correct hold</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-red-600 border border-red-500"></div>
              <span className="text-[#888]">Should hold (missed)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-amber-600 border border-amber-500"></div>
              <span className="text-[#888]">Wrong hold</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-[#1a1a1a] border border-[#333]"></div>
              <span className="text-[#888]">Correct discard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Casino data
// Vegas Casinos organized by ownership/location
const vegasCasinos = [
  // ============================================
  // CAESARS ENTERTAINMENT (Strip)
  // ============================================
  { id: 'caesars-palace', name: 'Caesars Palace', owner: 'Caesars', area: 'Center Strip', size: 'XL', slots: '1,300+', lat: 36.1162, lng: -115.1745, apNotes: 'Large floor, high competition. Multiple tower areas.' },
  { id: 'paris', name: 'Paris Las Vegas', owner: 'Caesars', area: 'Center Strip', size: 'Large', slots: '1,000+', lat: 36.1125, lng: -115.1707, apNotes: 'Good variety. Connected to Ballys/Horseshoe.' },
  { id: 'horseshoe', name: 'Horseshoe', owner: 'Caesars', area: 'Center Strip', size: 'Large', slots: '1,100+', lat: 36.1119, lng: -115.1726, apNotes: 'Formerly Ballys. WSOP home. Big floor.' },
  { id: 'flamingo', name: 'Flamingo', owner: 'Caesars', area: 'Center Strip', size: 'Medium', slots: '1,000+', lat: 36.1161, lng: -115.1694, apNotes: 'Classic property. Decent variety.' },
  { id: 'linq', name: 'The LINQ', owner: 'Caesars', area: 'Center Strip', size: 'Small', slots: '750+', lat: 36.1175, lng: -115.1690, apNotes: 'Smaller floor = faster to scout. Newer machines.' },
  { id: 'harrahs', name: "Harrah's", owner: 'Caesars', area: 'Center Strip', size: 'Medium', slots: '1,100+', lat: 36.1191, lng: -115.1693, apNotes: 'Older property. Less crowded.' },
  { id: 'cromwell', name: 'The Cromwell', owner: 'Caesars', area: 'Center Strip', size: 'Small', slots: '400+', lat: 36.1150, lng: -115.1710, apNotes: 'Boutique casino. Very small = fast scout.' },
  { id: 'planet-hollywood', name: 'Planet Hollywood', owner: 'Caesars', area: 'Center Strip', size: 'Large', slots: '1,300+', lat: 36.1098, lng: -115.1711, apNotes: 'Large floor. Miracle Mile shops attached.' },
  
  // ============================================
  // MGM RESORTS (Strip)
  // ============================================
  { id: 'bellagio', name: 'Bellagio', owner: 'MGM', area: 'Center Strip', size: 'XL', slots: '2,300+', lat: 36.1129, lng: -115.1765, apNotes: 'Upscale. Higher denoms. Large floor spread out.' },
  { id: 'aria', name: 'ARIA', owner: 'MGM', area: 'Center Strip', size: 'XL', slots: '1,900+', lat: 36.1072, lng: -115.1767, apNotes: 'Modern property. Good high-limit area.' },
  { id: 'vdara', name: 'Vdara', owner: 'MGM', area: 'Center Strip', size: 'None', slots: '0', lat: 36.1080, lng: -115.1780, apNotes: 'No casino - hotel only.' },
  { id: 'cosmopolitan', name: 'The Cosmopolitan', owner: 'MGM', area: 'Center Strip', size: 'Large', slots: '1,300+', lat: 36.1098, lng: -115.1743, apNotes: 'Trendy crowd. Multiple floors.' },
  { id: 'mgm-grand', name: 'MGM Grand', owner: 'MGM', area: 'South Strip', size: 'XL', slots: '2,500+', lat: 36.1023, lng: -115.1696, apNotes: 'Massive floor. Multiple areas. Can take hours to scout.' },
  { id: 'signature-mgm', name: 'The Signature at MGM', owner: 'MGM', area: 'South Strip', size: 'None', slots: '0', lat: 36.1010, lng: -115.1650, apNotes: 'No casino - condo hotel.' },
  { id: 'new-york-new-york', name: 'New York-New York', owner: 'MGM', area: 'South Strip', size: 'Large', slots: '1,500+', lat: 36.1022, lng: -115.1745, apNotes: 'Connected to Park MGM. Winding layout.' },
  { id: 'park-mgm', name: 'Park MGM', owner: 'MGM', area: 'South Strip', size: 'Medium', slots: '900+', lat: 36.1018, lng: -115.1760, apNotes: 'Formerly Monte Carlo. Smaller, modern.' },
  { id: 'excalibur', name: 'Excalibur', owner: 'MGM', area: 'South Strip', size: 'Large', slots: '1,200+', lat: 36.0988, lng: -115.1753, apNotes: 'Budget friendly. Good variety.' },
  { id: 'luxor', name: 'Luxor', owner: 'MGM', area: 'South Strip', size: 'Large', slots: '1,200+', lat: 36.0955, lng: -115.1761, apNotes: 'Pyramid layout. Inclinator access.' },
  { id: 'mandalay-bay', name: 'Mandalay Bay', owner: 'MGM', area: 'South Strip', size: 'XL', slots: '1,700+', lat: 36.0906, lng: -115.1763, apNotes: 'Far south. Less foot traffic = less competition.' },
  { id: 'delano', name: 'Delano', owner: 'MGM', area: 'South Strip', size: 'None', slots: '0', lat: 36.0890, lng: -115.1770, apNotes: 'No casino - boutique hotel at Mandalay.' },
  { id: 'mirage', name: 'The Mirage', owner: 'MGM', area: 'Center Strip', size: 'Large', slots: '1,200+', lat: 36.1212, lng: -115.1742, apNotes: 'Being converted to Hard Rock 2025. Check status.' },
  { id: 'treasure-island', name: 'Treasure Island (TI)', owner: 'Independent', area: 'North Strip', size: 'Medium', slots: '900+', lat: 36.1247, lng: -115.1712, apNotes: 'Independent. Less corporate.' },
  
  // ============================================
  // WYNN RESORTS (North Strip)
  // ============================================
  { id: 'wynn', name: 'Wynn Las Vegas', owner: 'Wynn', area: 'North Strip', size: 'XL', slots: '1,900+', lat: 36.1263, lng: -115.1620, apNotes: 'Upscale. Higher denoms. Excellent VP pay tables.' },
  { id: 'encore', name: 'Encore', owner: 'Wynn', area: 'North Strip', size: 'Large', slots: '900+', lat: 36.1290, lng: -115.1630, apNotes: 'Connected to Wynn. Similar upscale vibe.' },
  
  // ============================================
  // VENETIAN/PALAZZO (North Strip)
  // ============================================
  { id: 'venetian', name: 'The Venetian', owner: 'Apollo', area: 'North Strip', size: 'XL', slots: '2,100+', lat: 36.1215, lng: -115.1692, apNotes: 'Massive. Multiple areas. Good VP selection.' },
  { id: 'palazzo', name: 'The Palazzo', owner: 'Apollo', area: 'North Strip', size: 'Large', slots: '1,200+', lat: 36.1250, lng: -115.1680, apNotes: 'Connected to Venetian. Slightly quieter.' },
  
  // ============================================
  // RESORTS WORLD (North Strip)
  // ============================================
  { id: 'resorts-world', name: 'Resorts World', owner: 'Genting', area: 'North Strip', size: 'XL', slots: '3,000+', lat: 36.1370, lng: -115.1680, apNotes: 'Newest megaresort (2021). Modern machines. Multiple brands.' },
  
  // ============================================
  // SAHARA/CIRCUS (North Strip)
  // ============================================
  { id: 'sahara', name: 'SAHARA Las Vegas', owner: 'Meruelo', area: 'North Strip', size: 'Medium', slots: '600+', lat: 36.1413, lng: -115.1567, apNotes: 'Renovated 2019. Less crowded.' },
  { id: 'circus-circus', name: 'Circus Circus', owner: 'Ruffin', area: 'North Strip', size: 'Large', slots: '1,100+', lat: 36.1364, lng: -115.1628, apNotes: 'Older property. Budget crowd. Sprawling layout.' },
  
  // ============================================
  // DOWNTOWN (Fremont Street)
  // ============================================
  { id: 'golden-nugget', name: 'Golden Nugget', owner: 'Landry\'s', area: 'Downtown', size: 'Large', slots: '1,200+', lat: 36.1707, lng: -115.1446, apNotes: 'Best downtown property. Good variety.' },
  { id: 'circa', name: 'Circa', owner: 'Stevens', area: 'Downtown', size: 'Medium', slots: '800+', lat: 36.1720, lng: -115.1430, apNotes: 'Newest downtown (2020). Adults only. Modern machines.' },
  { id: 'fremont', name: 'Fremont', owner: 'Boyd', area: 'Downtown', size: 'Medium', slots: '800+', lat: 36.1700, lng: -115.1420, apNotes: 'Classic downtown. Hawaiian theme.' },
  { id: 'four-queens', name: 'Four Queens', owner: 'TLC', area: 'Downtown', size: 'Small', slots: '600+', lat: 36.1698, lng: -115.1432, apNotes: 'Smaller. Less crowded.' },
  { id: 'binions', name: "Binion's", owner: 'TLC', area: 'Downtown', size: 'Small', slots: '400+', lat: 36.1702, lng: -115.1438, apNotes: 'Historic. Original WSOP home.' },
  { id: 'golden-gate', name: 'Golden Gate', owner: 'Stevens', area: 'Downtown', size: 'Small', slots: '300+', lat: 36.1706, lng: -115.1446, apNotes: 'Oldest casino in Vegas. Tiny but historic.' },
  { id: 'downtown-grand', name: 'Downtown Grand', owner: 'Fifth Street', area: 'Downtown', size: 'Medium', slots: '600+', lat: 36.1720, lng: -115.1410, apNotes: 'Off Fremont St. Quieter.' },
  { id: 'california', name: 'California', owner: 'Boyd', area: 'Downtown', size: 'Medium', slots: '700+', lat: 36.1695, lng: -115.1418, apNotes: 'Hawaiian theme. Loyal locals crowd.' },
  { id: 'main-street-station', name: 'Main Street Station', owner: 'Boyd', area: 'Downtown', size: 'Medium', slots: '600+', lat: 36.1710, lng: -115.1405, apNotes: 'Victorian theme. Good VP.' },
  { id: 'plaza', name: 'Plaza', owner: 'Tamares', area: 'Downtown', size: 'Medium', slots: '700+', lat: 36.1710, lng: -115.1480, apNotes: 'West end of Fremont. Pool deck.' },
  { id: 'el-cortez', name: 'El Cortez', owner: 'Family', area: 'Downtown', size: 'Medium', slots: '600+', lat: 36.1690, lng: -115.1365, apNotes: 'Off Fremont. Old Vegas vibe. Good low-limit.' },
  
  // ============================================
  // LOCALS CASINOS (Off Strip - Boyd)
  // ============================================
  { id: 'orleans', name: 'Orleans', owner: 'Boyd', area: 'West', size: 'Large', slots: '2,200+', lat: 36.1023, lng: -115.2032, apNotes: 'Huge locals casino. Good variety. Bowling alley.' },
  { id: 'gold-coast', name: 'Gold Coast', owner: 'Boyd', area: 'West', size: 'Medium', slots: '1,200+', lat: 36.1170, lng: -115.1930, apNotes: 'Across from Palms. Locals spot.' },
  { id: 'palms', name: 'Palms', owner: 'San Manuel', area: 'West', size: 'Large', slots: '1,300+', lat: 36.1145, lng: -115.1950, apNotes: 'Renovated. Tribal owned now.' },
  { id: 'suncoast', name: 'Suncoast', owner: 'Boyd', area: 'Summerlin', size: 'Large', slots: '1,800+', lat: 36.1920, lng: -115.2880, apNotes: 'Far west. Locals. Good VP.' },
  { id: 'red-rock', name: 'Red Rock Casino', owner: 'Station', area: 'Summerlin', size: 'XL', slots: '2,500+', lat: 36.1710, lng: -115.2960, apNotes: 'Upscale locals. Beautiful property.' },
  { id: 'sams-town', name: 'Sam\'s Town', owner: 'Boyd', area: 'Boulder', size: 'Large', slots: '1,800+', lat: 36.1108, lng: -115.0525, apNotes: 'East side. Western theme.' },
  
  // ============================================
  // LOCALS CASINOS (Off Strip - Station)
  // ============================================
  { id: 'green-valley-ranch', name: 'Green Valley Ranch', owner: 'Station', area: 'Henderson', size: 'Large', slots: '2,200+', lat: 36.0270, lng: -115.0810, apNotes: 'Upscale Henderson locals.' },
  { id: 'palace-station', name: 'Palace Station', owner: 'Station', area: 'West', size: 'Large', slots: '2,000+', lat: 36.1320, lng: -115.1980, apNotes: 'Near Strip. Recently renovated.' },
  { id: 'boulder-station', name: 'Boulder Station', owner: 'Station', area: 'Boulder', size: 'Large', slots: '2,200+', lat: 36.1520, lng: -115.0640, apNotes: 'East side locals.' },
  { id: 'sunset-station', name: 'Sunset Station', owner: 'Station', area: 'Henderson', size: 'Large', slots: '2,400+', lat: 36.0540, lng: -115.0370, apNotes: 'Southeast. Big locals casino.' },
  { id: 'texas-station', name: 'Texas Station', owner: 'Station', area: 'North LV', size: 'Large', slots: '2,000+', lat: 36.2150, lng: -115.1820, apNotes: 'North Las Vegas.' },
  { id: 'santa-fe-station', name: 'Santa Fe Station', owner: 'Station', area: 'Rancho', size: 'Medium', slots: '1,600+', lat: 36.2280, lng: -115.2650, apNotes: 'Northwest. Bowling alley.' },
  { id: 'fiesta-henderson', name: 'Fiesta Henderson', owner: 'Station', area: 'Henderson', size: 'Medium', slots: '1,100+', lat: 36.0320, lng: -115.0250, apNotes: 'Henderson locals. Mexican theme.' },
  { id: 'fiesta-rancho', name: 'Fiesta Rancho', owner: 'Station', area: 'North LV', size: 'Medium', slots: '1,100+', lat: 36.2180, lng: -115.1510, apNotes: 'North LV. Ice skating rink.' },
  
  // ============================================
  // OTHER STRIP PROPERTIES
  // ============================================
  { id: 'strat', name: 'The STRAT', owner: 'Golden', area: 'North Strip', size: 'Large', slots: '900+', lat: 36.1473, lng: -115.1558, apNotes: 'Tower observation deck. Far north.' },
  { id: 'fontainebleau', name: 'Fontainebleau', owner: 'Fontainebleau', area: 'North Strip', size: 'XL', slots: '1,500+', lat: 36.1380, lng: -115.1650, apNotes: 'Opened Dec 2023. Brand new. High-end.' },
  { id: 'tropicana', name: 'Tropicana', owner: 'Bally\'s Corp', area: 'South Strip', size: 'Large', slots: '800+', lat: 36.0995, lng: -115.1720, apNotes: 'CLOSING 2024 for A\'s stadium. Check status.' },
  { id: 'hooters', name: 'OYO (Hooters)', owner: 'OYO', area: 'South Strip', size: 'Small', slots: '300+', lat: 36.0980, lng: -115.1700, apNotes: 'Budget property. Small.' },
  
  // ============================================
  // AIRPORT/SOUTH
  // ============================================
  { id: 'south-point', name: 'South Point', owner: 'Gaughan', area: 'South LV', size: 'XL', slots: '2,400+', lat: 36.0140, lng: -115.1720, apNotes: 'Far south. Huge locals. Equestrian center.' },
  { id: 'silverton', name: 'Silverton', owner: 'Silverton', area: 'South LV', size: 'Large', slots: '1,600+', lat: 36.0620, lng: -115.2000, apNotes: 'Bass Pro shop attached. Aquarium.' },
  { id: 'm-resort', name: 'M Resort', owner: 'Penn', area: 'Henderson', size: 'Large', slots: '1,400+', lat: 36.0100, lng: -115.0820, apNotes: 'Upscale south Henderson.' },
  
  // ============================================
  // HENDERSON
  // ============================================
  { id: 'jokers-wild', name: 'Jokers Wild', owner: 'Affinity', area: 'Henderson', size: 'Small', slots: '400+', lat: 36.0310, lng: -115.0420, apNotes: 'Small locals spot.' },
  { id: 'club-fortune', name: 'Club Fortune', owner: 'Fortune', area: 'Henderson', size: 'Small', slots: '300+', lat: 36.0290, lng: -115.0530, apNotes: 'Tiny Henderson casino.' },
  { id: 'eldorado-henderson', name: 'Eldorado Casino', owner: 'Boyd', area: 'Henderson', size: 'Small', slots: '300+', lat: 36.0300, lng: -115.0500, apNotes: 'Small Henderson locals.' },
];

// Legacy reference (keep for backward compatibility)
const caesarsProperties = vegasCasinos.filter(c => c.owner === 'Caesars');

// ============================================
// CONFIRM DIALOG
// ============================================
function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161616] rounded p-6 max-w-sm w-full border border-[#333]">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-[#bbbbbb] mb-6">{message}</p>
        <div className="space-y-2">
          <button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold">Delete</button>
          <button onClick={onCancel} className="w-full bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-3 rounded font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SPOTTER FORM - Unified for Slots and VP
// ============================================
function SpotterForm({ onSubmit, onCancel, spotType: initialSpotType, prefillData, currentCasino }) {
  // spotType: 'slot' or 'vp'
  // prefillData: { machine } for slots, { game, payTable, return } for VP
  
  // Allow switching type if not prefilled
  const isTypeLocked = prefillData?.machine || prefillData?.game;
  const [activeType, setActiveType] = useState(initialSpotType || 'slot');
  
  const [casino, setCasino] = useState(currentCasino || '');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [denomination, setDenomination] = useState('');
  const [playable, setPlayable] = useState(false);
  const [machine, setMachine] = useState(prefillData?.machine || '');
  
  // VP-specific state
  const [selectedVPGame, setSelectedVPGame] = useState(prefillData?.game || '');
  const [selectedVPPayTable, setSelectedVPPayTable] = useState(null);
  
  // vpGames is an object, not array - get the game by key or find by id
  const vpGame = vpGames[selectedVPGame] || Object.values(vpGames).find(g => g.id === selectedVPGame);

  const handleSubmit = () => {
    if (activeType === 'slot' && !machine.trim()) return;
    if (activeType === 'vp' && !selectedVPGame) return;
    
    const noteData = {
      type: activeType,
      casino: casino.trim(),
      location: location.trim(),
      playable,
      created_at: new Date().toISOString(),
    };
    
    if (activeType === 'slot') {
      noteData.machine = machine.trim();
      noteData.state = state.trim();
    } else {
      noteData.vpGame = selectedVPGame;
      noteData.vpGameName = vpGame?.name || prefillData?.gameName;
      noteData.vpPayTable = selectedVPPayTable?.label || prefillData?.payTable;
      noteData.vpReturn = selectedVPPayTable?.return || prefillData?.return;
      noteData.denomination = denomination.trim();
      noteData.state = state.trim();
    }
    
    onSubmit(noteData);
  };

  const isVP = activeType === 'vp';

  return (
    <div className="bg-[#161616] border border-[#333] rounded p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Gem size={24} className="text-[#d4a855]" />
        <h3 className="font-bold text-white text-lg">Spot Find</h3>
      </div>
      
      {/* Type Toggle - only show if not locked */}
      {!isTypeLocked && (
        <div className="flex gap-2 p-1 bg-[#0d0d0d] rounded">
          <button
            onClick={() => setActiveType('slot')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              activeType === 'slot' 
                ? 'bg-[#d4a855] text-black' 
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            Slot Machine
          </button>
          <button
            onClick={() => setActiveType('vp')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              activeType === 'vp' 
                ? 'bg-[#d4a855] text-black' 
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            Video Poker
          </button>
        </div>
      )}
      
      {/* What we're spotting */}
      {isVP ? (
        // VP Selection
        <div className="space-y-3">
          {prefillData?.game ? (
            // Pre-filled VP - show read-only
            <div className="bg-[#0d0d0d] border border-[#d4a855]/30 rounded p-3">
              <p className="text-white font-semibold">{prefillData.gameName}</p>
              <p className="text-[#d4a855] text-sm">{prefillData.payTable} • {prefillData.return}% return</p>
            </div>
          ) : (
            // VP selection dropdowns
            <>
              <div>
                <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Game</label>
                <select 
                  value={selectedVPGame} 
                  onChange={(e) => { setSelectedVPGame(e.target.value); setSelectedVPPayTable(null); }}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#d4a855] appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  <option value="">Select game...</option>
                  {(() => {
                    const FEATURED = ['jacks-or-better','bonus-poker','bonus-poker-deluxe','double-bonus','double-double-bonus','triple-double-bonus','deuces-wild','bonus-deuces-wild','loose-deuces','joker-poker-kings','joker-poker-twopair','ultimate-x-jacks','ultimate-x-bonus','ultimate-x-ddb','ultimate-x-double-bonus','ultimate-x-joker'];
                    return Object.values(vpGames)
                      .filter(g => g.category)
                      .sort((a, b) => {
                        const aF = FEATURED.includes(a.id), bF = FEATURED.includes(b.id);
                        if (aF && !bF) return -1;
                        if (!aF && bF) return 1;
                        if (aF && bF) return FEATURED.indexOf(a.id) - FEATURED.indexOf(b.id);
                        return (b.popularity || 50) - (a.popularity || 50);
                      })
                      .map(g => <option key={g.id} value={g.id}>{g.name}</option>);
                  })()}
                </select>
              </div>
              
              {vpGame && (
                <div>
                  <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Pay Table</label>
                  <div className="flex flex-wrap gap-2">
                    {vpGame.payTables.map(pt => (
                      <button
                        key={pt.id}
                        onClick={() => setSelectedVPPayTable(pt)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          selectedVPPayTable?.id === pt.id 
                            ? 'bg-[#d4a855] text-black' 
                            : 'bg-[#0d0d0d] text-[#aaa] hover:text-white border border-[#333]'
                        }`}
                      >
                        {pt.label} ({pt.return}%)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // Slot Selection
        <div className="bg-[#0d0d0d] border border-[#d4a855]/30 rounded p-3">
          {prefillData?.machine ? (
            <p className="text-white font-semibold">{prefillData.machine}</p>
          ) : (
            <select 
              value={machine} 
              onChange={(e) => setMachine(e.target.value)} 
              className="w-full bg-transparent text-white focus:outline-none appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d4a855' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0px center' }}
            >
              <option value="">Select machine...</option>
              {machines.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              <option value="Other">Other</option>
            </select>
          )}
        </div>
      )}
      
      {/* Casino */}
      <div>
        <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Casino</label>
        <select 
          value={casino} 
          onChange={(e) => setCasino(e.target.value)} 
          className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#d4a855] appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option value="">Select casino...</option>
          {vegasCasinos.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      
      {/* Location within casino */}
      <div>
        <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Location in Casino</label>
        <input 
          type="text" 
          placeholder={isVP ? "e.g., Bar top, High limit room" : "e.g., Near entrance, High limit"} 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-[#555]" 
        />
      </div>
      
      {/* VP-specific: Denomination */}
      {isVP && (
        <div>
          <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Denomination</label>
          <div className="flex gap-2 flex-wrap">
            {['$0.25', '$0.50', '$1.00', '$2.00', '$5.00'].map(denom => (
              <button
                key={denom}
                onClick={() => setDenomination(denomination === denom ? '' : denom)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  denomination === denom 
                    ? 'bg-[#d4a855] text-black' 
                    : 'bg-[#0d0d0d] text-[#aaa] hover:text-white border border-[#333]'
                }`}
              >
                {denom}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* State/Notes */}
      <div>
        <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">
          {isVP ? 'Notes' : 'Machine State'}
        </label>
        <textarea 
          placeholder={isVP ? "e.g., Multiple machines, good location" : "e.g., Meter at 85%, 3 coins on reel 2"} 
          value={state} 
          onChange={(e) => setState(e.target.value)} 
          className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-[#555] min-h-[70px]" 
        />
      </div>
      
      {/* Playable toggle */}
      <button 
        onClick={() => setPlayable(!playable)} 
        className={`w-full py-3 rounded font-semibold flex items-center justify-center gap-2 transition-colors ${
          playable ? 'bg-emerald-600 text-white' : 'bg-[#1a1a1a] text-[#888] border border-[#333]'
        }`}
      >
        {playable ? <CheckCircle2 size={18} /> : <div className="w-5 h-5 border-2 border-[#555] rounded-full" />}
        {playable ? 'Marked as Playable!' : 'Mark as Playable?'}
      </button>
      
      {/* Actions */}
      <div className="space-y-2">
        <button 
          onClick={handleSubmit} 
          disabled={isVP ? !(selectedVPGame && (selectedVPPayTable || prefillData?.payTable)) : !machine} 
          className="w-full bg-[#d4a855] hover:bg-[#c49745] disabled:opacity-50 text-black py-3 rounded font-semibold"
        >
          Save Spot
        </button>
        <button 
          onClick={onCancel} 
          className="w-full bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-3 rounded font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Legacy NoteForm wrapper for backwards compatibility
function NoteForm({ onSubmit, onCancel, prefillMachine, currentCasino }) {
  return (
    <SpotterForm 
      spotType="slot"
      prefillData={{ machine: prefillMachine }}
      currentCasino={currentCasino}
      onSubmit={(data) => {
        // Convert to legacy format
        onSubmit({
          machine: data.machine,
          casino: data.casino,
          location: data.location,
          state: data.state,
          playable: data.playable
        });
      }}
      onCancel={onCancel}
    />
  );
}

// ============================================
// NOTE CARD - Handles both Slots and VP
// ============================================
function NoteCard({ note, onEdit, onDelete, isOwn }) {
  const [expanded, setExpanded] = useState(false);
  const isVP = note.type === 'vp';
  const title = isVP ? (note.vpGameName || note.vpGame) : note.machine;
  const subtitle = isVP ? `${note.vpPayTable} • ${note.vpReturn}%` : null;
  
  return (
    <div className={`bg-[#161616] border rounded overflow-hidden ${note.playable ? 'border-emerald-500/50' : 'border-[#333]'}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-[#d4a855] text-black'}`}>
                {isVP ? 'VP' : 'SLOT'}
              </span>
              {note.playable && <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/20 px-2 py-0.5 rounded-full">PLAYABLE</span>}
              <span className="text-white font-semibold truncate">{title}</span>
            </div>
            {subtitle && <p className="text-[#d4a855] text-sm mb-1">{subtitle}</p>}
            <p className="text-[#bbb] text-sm">{note.casino || 'Unknown casino'}</p>
            {note.denomination && <p className="text-[#888] text-xs">{note.denomination} denomination</p>}
            {note.profiles?.display_name && (
              <p className="text-[#888] text-xs mt-1">by {note.profiles.display_name}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[#888] text-xs">{formatRelativeTime(note.created_at)}</p>
            <ChevronDown size={16} className={`text-[#888] mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#333] pt-3">
          {note.location && <p className="text-sm text-[#ccc] mb-2"><span className="text-[#888]">Location:</span> {note.location}</p>}
          {note.state && <p className="text-sm text-[#ccc] mb-3"><span className="text-[#888]">{isVP ? 'Notes:' : 'State:'}</span> {note.state}</p>}
          {isOwn && (
            <div className="flex gap-2">
              <button onClick={() => onEdit(note)} className="flex-1 bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-2 rounded text-sm flex items-center justify-center gap-1">
                <Edit3 size={14} /> Edit
              </button>
              <button onClick={() => onDelete(note.id)} className="bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-4 rounded text-sm flex items-center gap-1">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// PHOTO VIEWER
// ============================================
function PhotoViewer({ photo, photoUrl, machineName, onClose, onDelete, allPhotos, onNavigate, getPhotoUrl }) {
  const currentIndex = allPhotos.findIndex(p => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPhotos.length - 1;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black/80">
        <div>
          <h3 className="text-white font-semibold">{machineName}</h3>
          {photo.casino && <p className="text-[#bbbbbb] text-sm">{photo.casino}</p>}
        </div>
        <button onClick={onClose} className="text-white p-2"><X size={24} /></button>
      </div>
      
      <div className="flex-1 flex items-center justify-center relative">
        {hasPrev && (
          <button onClick={() => onNavigate(allPhotos[currentIndex - 1])} className="absolute left-2 bg-black/50 p-2 rounded-full text-white">
            <ChevronLeft size={24} />
          </button>
        )}
        <img src={photoUrl} alt={machineName} className="max-h-full max-w-full object-contain" />
        {hasNext && (
          <button onClick={() => onNavigate(allPhotos[currentIndex + 1])} className="absolute right-2 bg-black/50 p-2 rounded-full text-white">
            <ChevronRight size={24} />
          </button>
        )}
      </div>
      
      <div className="p-4 bg-black/80 flex items-center justify-between">
        <div>
          <p className="text-[#bbbbbb] text-sm">{currentIndex + 1} of {allPhotos.length}</p>
          <p className="text-[#aaaaaa] text-xs">{new Date(photo.created_at).toLocaleDateString()}</p>
        </div>
        <button onClick={() => onDelete(photo.id)} className="bg-red-600/20 text-red-400 px-4 py-2 rounded text-sm flex items-center gap-2">
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

// ============================================
// MACHINE CAROUSEL
// ============================================
function MachineCarousel({ machines, tierColors, onSelect, tier, getLatestPhoto, getPhotoUrl }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const safeTier = tier || 1;
  const tierMachines = machines.filter(m => m.tier === safeTier);
  const colors = tierColors[safeTier] || tierColors[1];

  const goTo = (index) => {
    if (index < 0) index = tierMachines.length - 1;
    if (index >= tierMachines.length) index = 0;
    setCurrentIndex(index);
  };

  if (tierMachines.length === 0) return null;
  const machine = tierMachines[currentIndex];
  const latestPhoto = getLatestPhoto(machine.id);
  const photoUrl = latestPhoto ? getPhotoUrl(latestPhoto) : null;

  return (
    <div className="relative">
      <div className={`${colors.bg} border ${colors.border} rounded p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {photoUrl ? (
              <img src={photoUrl} alt="" className="w-8 h-8 rounded object-cover" />
            ) : (
              <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center">
                <Camera size={14} className="text-[#aaaaaa]" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-white">{machine.shortName}</h3>
              <p className="text-xs text-[#bbbbbb]">{machine.manufacturer}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => goTo(currentIndex - 1)} className="p-1 text-[#bbbbbb] hover:text-white"><ChevronLeft size={20} /></button>
            <span className="text-xs text-[#aaaaaa]">{currentIndex + 1}/{tierMachines.length}</span>
            <button onClick={() => goTo(currentIndex + 1)} className="p-1 text-[#bbbbbb] hover:text-white"><ChevronRight size={20} /></button>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-3">{machine.quickId}</p>
        
        <div className={`${colors.bg} rounded p-3 mb-3`}>
          <p className="text-xs text-[#bbbbbb] mb-1">Play When:</p>
          <p className={`text-sm font-semibold ${colors.text}`}>{machine.thresholdSummary}</p>
        </div>
        
        <button onClick={() => onSelect(machine)} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
}

// ============================================
// MACHINE DETAIL
// ============================================
function MachineDetail({ machine, onBack, onAddNote, photos, onAddPhoto, onDeletePhoto, onViewPhoto, getPhotoUrl }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const existingPhoto = photos.length > 0 ? photos[0] : null;

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
              <button onClick={handleReplaceConfirm} className="w-full bg-[#d4a855] hover:bg-[#c49745] text-black py-3 rounded font-semibold">Replace</button>
              <button onClick={handleReplaceCancel} className="w-full bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-3 rounded font-medium">Cancel</button>
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
          <button onClick={handlePhotoClick} className="text-[#d4a855] text-sm flex items-center gap-1 mb-3" disabled={uploading}>
            <Camera size={14} /> {uploading ? 'Uploading...' : 'Replace Photo'}
          </button>
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

      <button onClick={() => onAddNote(machine.name)} className="w-full bg-[#d4a855] hover:bg-[#a67c3d] text-white font-semibold py-4 rounded flex items-center justify-center gap-2">
        <StickyNote size={18} /> Add Note for {machine.shortName}
      </button>
    </div>
  );
}

// ============================================
// VIDEO POKER TAB COMPONENT
// ============================================
function VideoPokerTab({ onSpot }) {
  const [selectedGame, setSelectedGame] = useState('jacks-or-better');
  const [selectedPayTable, setSelectedPayTable] = useState(null);
  const [selectedHand, setSelectedHand] = useState([null, null, null, null, null]);
  const [showCardPicker, setShowCardPicker] = useState(null);
  const [gameSearch, setGameSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectorExpanded, setSelectorExpanded] = useState(true);
  
  // List of games with full WoO strategy support (show these first)
  const FEATURED_GAMES = [
    'jacks-or-better',
    'bonus-poker', 
    'bonus-poker-deluxe',
    'double-bonus',
    'double-double-bonus',
    'triple-double-bonus',
    'deuces-wild',
    'bonus-deuces-wild',
    'loose-deuces',
    'joker-poker-kings',
    'joker-poker-twopair',
    'ultimate-x-jacks',
    'ultimate-x-bonus',
    'ultimate-x-ddb',
    'ultimate-x-double-bonus',
    'ultimate-x-joker',
  ];
  
  // Filter games by search and category
  const filteredGames = Object.values(vpGames).filter(g => {
    if (!g.category) return false; // Skip non-VP games
    const matchesSearch = gameSearch === '' || 
      g.name.toLowerCase().includes(gameSearch.toLowerCase()) ||
      g.shortName.toLowerCase().includes(gameSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Featured games first, then by popularity
    const aFeatured = FEATURED_GAMES.includes(a.id);
    const bFeatured = FEATURED_GAMES.includes(b.id);
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    // Within featured, sort by featured list order
    if (aFeatured && bFeatured) {
      return FEATURED_GAMES.indexOf(a.id) - FEATURED_GAMES.indexOf(b.id);
    }
    // Non-featured: sort by popularity
    return (b.popularity || 50) - (a.popularity || 50);
  });
  
  // Get game counts per category
  const categoryCounts = Object.keys(vpCategories).reduce((acc, cat) => {
    acc[cat] = Object.values(vpGames).filter(g => g.category === cat).length;
    return acc;
  }, {});
  
  const game = vpGames[selectedGame];
  
  // Auto-collapse when pay table is selected
  React.useEffect(() => {
    if (selectedPayTable) {
      setSelectorExpanded(false);
    }
  }, [selectedPayTable]);
  
  // Auto-select first filtered game if current selection is not in filtered list
  React.useEffect(() => {
    if (filteredGames.length > 0 && !filteredGames.find(g => g.id === selectedGame)) {
      setSelectedGame(filteredGames[0].id);
      setSelectedPayTable(null);
      setSelectedHand([null, null, null, null, null]);
    }
  }, [filteredGames, selectedGame]);
  
  // Reset pay table when game changes
  React.useEffect(() => {
    setSelectedPayTable(null);
    setSelectorExpanded(true);
  }, [selectedGame]);
  
  // Get rating color
  const getRatingColor = (rating) => {
    switch(rating) {
      case 'HUNT': return 'text-emerald-400 bg-emerald-900/30 border-emerald-500/30';
      case 'OK': return 'text-amber-400 bg-amber-900/30 border-amber-500/30';
      case 'AVOID': return 'text-red-400 bg-red-900/30 border-red-500/30';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/30';
    }
  };
  
  // Rating badge colors (outlined style like tier badges)
  const getRatingBadge = (rating) => {
    switch(rating) {
      case 'HUNT': return 'border-emerald-500 text-emerald-400 bg-[#0d0d0d]';
      case 'OK': return 'border-amber-500 text-amber-400 bg-[#0d0d0d]';
      case 'AVOID': return 'border-red-500 text-red-400 bg-[#0d0d0d]';
      default: return 'border-gray-500 text-gray-400 bg-[#0d0d0d]';
    }
  };
  
  const getRatingText = (rating) => {
    switch(rating) {
      case 'HUNT': return 'text-emerald-400';
      case 'OK': return 'text-amber-400';
      case 'AVOID': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Card picker component
  const CardPicker = ({ onSelect, onClose, excludeCards }) => {
    const excludeSet = new Set(excludeCards.filter(Boolean).map(c => c.rank === 'JOKER' ? 'JOKER' : `${c.rank}${c.suit}`));
    
    // Check if this is a Joker Poker game (53-card deck with 1 Joker)
    const isJokerGame = selectedGame?.startsWith('joker-poker');
    const jokerExcluded = excludeSet.has('JOKER');
    
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-end justify-center" onClick={onClose}>
        <div className="bg-[#161616] border-t border-[#333] rounded-t-2xl w-full max-w-md p-4 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-lg">Select Card</h3>
            <button onClick={onClose} className="text-[#aaa] hover:text-white p-1">
              <X size={24} />
            </button>
          </div>
          
          {/* Joker option for Joker Poker games */}
          {isJokerGame && (
            <div className="mb-4">
              <button
                disabled={jokerExcluded}
                onClick={() => onSelect({ rank: 'JOKER', suit: '★', color: 'text-purple-500', isJoker: true })}
                className={`w-full h-16 rounded border-2 flex items-center justify-center font-bold transition-colors ${
                  jokerExcluded 
                    ? 'bg-[#0d0d0d] border-[#1a1a1a] text-[#333] cursor-not-allowed'
                    : 'bg-[#2a1a2a] border-purple-500/50 hover:border-purple-400 hover:bg-[#3a2a3a] text-purple-400'
                }`}
              >
                <span className="text-xl font-bold">★</span>
                <span className="text-lg mx-1">JOKER</span>
                <span className="text-xl font-bold">★</span>
              </button>
            </div>
          )}
          
          {SUITS.map(suit => (
            <div key={suit.name} className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {RANKS.map(rank => {
                  const cardKey = `${rank}${suit.symbol}`;
                  const isExcluded = excludeSet.has(cardKey);
                  return (
                    <button
                      key={cardKey}
                      disabled={isExcluded}
                      onClick={() => onSelect({ rank, suit: suit.symbol, color: suit.color })}
                      className={`w-14 h-[72px] rounded border-2 flex flex-col items-center justify-center font-bold transition-colors ${
                        isExcluded 
                          ? 'bg-[#0d0d0d] border-[#1a1a1a] text-[#333] cursor-not-allowed'
                          : 'bg-[#1a1a1a] border-[#333] hover:border-[#d4a855] hover:bg-[#222] ' + suit.pickerColor
                      }`}
                    >
                      <span className="text-xl">{rank}</span>
                      <span className="text-lg">{suit.symbol}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Game & Pay Table Selector - Collapsible */}
      {selectedPayTable && !selectorExpanded ? (
        /* Collapsed Summary Bar - resembles slot machine list item */
        <button
          onClick={() => setSelectorExpanded(true)}
          className={`w-full bg-[#161616] border rounded p-3 text-left transition-colors ${
            selectedPayTable.rating === 'HUNT' ? 'border-emerald-500/40 hover:border-emerald-500' :
            selectedPayTable.rating === 'OK' ? 'border-amber-500/40 hover:border-amber-500' :
            'border-red-500/40 hover:border-red-500'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Rating Badge - outlined style */}
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${getRatingBadge(selectedPayTable.rating)}`}>
              {selectedPayTable.rating}
            </span>
            
            {/* Game Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{game?.name}</h3>
              <p className="text-xs text-[#888]">{selectedPayTable.label}</p>
            </div>
            
            {/* Return % */}
            <div className="text-right flex items-center gap-2">
              <span className={`text-sm font-medium ${getRatingText(selectedPayTable.rating)}`}>
                {selectedPayTable.return}% return
              </span>
              <ChevronDown size={18} className="text-[#666]" />
            </div>
          </div>
        </button>
      ) : (
        /* Expanded Selector */
        <div className="bg-[#161616] border border-[#333] rounded p-4 space-y-4">
          {/* Header with collapse button */}
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold">Select Game & Pay Table</p>
            {selectedPayTable && (
              <button 
                onClick={() => setSelectorExpanded(false)}
                className="text-[#aaa] hover:text-white p-1"
              >
                <ChevronUp size={18} />
              </button>
            )}
          </div>
          
          {/* Search input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              type="text"
              placeholder="Search games..."
              value={gameSearch}
              onChange={(e) => setGameSearch(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#333] rounded pl-9 pr-9 py-2 text-white text-sm focus:border-[#d4a855] focus:outline-none"
            />
            {gameSearch && (
              <button 
                onClick={() => setGameSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Category filter - horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                selectedCategory === 'all' ? 'bg-[#d4a855] text-black' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
              }`}
            >
              All ({Object.values(vpGames).filter(g => g.category).length})
            </button>
            {Object.entries(vpCategories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedCategory === key ? 'bg-[#d4a855] text-black' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                }`}
              >
                {cat.name.replace(' Games', '').replace(' Family', '').replace(' Bonus', '')} ({categoryCounts[key] || 0})
              </button>
            ))}
          </div>
          
          {/* Game dropdown */}
          {filteredGames.length > 0 ? (
            <select
              value={selectedGame}
              onChange={(e) => {
                setSelectedGame(e.target.value);
                setSelectedPayTable(null);
                setSelectedHand([null, null, null, null, null]);
              }}
              className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white font-medium focus:outline-none focus:border-[#d4a855] appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {filteredGames.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          ) : (
            <div className="bg-[#0d0d0d] border border-dashed border-[#333] rounded p-4 text-center">
              <p className="text-[#aaa] mb-2">No games match your filters</p>
              <button 
                onClick={() => { setGameSearch(''); setSelectedCategory('all'); }}
                className="text-[#d4a855] text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
          
          {/* Pay Table Selection */}
          {game && filteredGames.length > 0 && (
            <div className="pt-2 border-t border-[#333]">
              <p className="text-[#aaa] text-xs mb-2">{game.keyLookup || 'Select pay table'}</p>
              <div className="flex flex-wrap gap-2">
                {game.payTables?.map(pt => (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedPayTable(pt)}
                    className={`px-4 py-2.5 rounded text-sm font-medium transition-colors flex flex-col items-center min-w-[70px] ${
                      selectedPayTable?.id === pt.id
                        ? 'bg-[#d4a855] text-black'
                        : 'bg-[#0d0d0d] border border-[#333] text-white hover:border-[#444]'
                    }`}
                  >
                    <span className="font-bold text-base">{pt.fh}/{pt.fl}</span>
                    <span className={`text-sm ${
                      selectedPayTable?.id === pt.id ? 'text-black/70' :
                      pt.rating === 'HUNT' ? 'text-emerald-400' : 
                      pt.rating === 'OK' ? 'text-amber-400' : 'text-red-400'
                    }`}>{pt.return}%</span>
                  </button>
                )) || <p className="text-red-400 text-sm">No pay tables found</p>}
              </div>
              
              {selectedPayTable && (
                <div className={`mt-3 p-3 rounded text-sm border ${getRatingColor(selectedPayTable.rating)}`}>
                  {selectedPayTable.rating === 'HUNT' ? 'Good table - play this' : 
                   selectedPayTable.rating === 'OK' ? 'Acceptable if nothing better' : 
                   'Poor return - find a better machine'}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Spot Button - when pay table selected */}
      {selectedPayTable && onSpot && (
        <button
          onClick={() => onSpot(game, selectedPayTable)}
          className="w-full bg-[#d4a855] hover:bg-[#c49745] text-black py-3 rounded font-semibold flex items-center justify-center gap-2"
        >
          <MapPin size={18} />
          Spot This Pay Table
        </button>
      )}

      {/* Hand Entry */}
      {selectedPayTable && (() => {
        const isComplete = selectedHand.filter(Boolean).length === 5;
        // Using WoO-verified strategy engine for perfect play advice
        const recommendation = isComplete ? getWoOStrategyRecommendation(selectedHand, selectedPayTable, selectedGame) : null;
        const currentHand = isComplete ? evaluateHand(selectedHand, selectedGame) : null;
        
        return (
          <div className="bg-[#161616] border border-[#333] rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-semibold text-lg">Hand Checker</p>
                {!isComplete && <p className="text-[#aaa] text-xs">Tap each card to select</p>}
              </div>
              {isComplete && currentHand && (
                <div className={`text-right ${currentHand.payout > 0 ? 'text-emerald-400' : 'text-[#aaa]'}`}>
                  <p className="font-bold">{currentHand.name}</p>
                  {currentHand.payout > 0 && <p className="text-xs">Pays {currentHand.payout}x</p>}
                </div>
              )}
            </div>
            
            {/* Card Display */}
            <div className="flex gap-2 justify-center mb-3">
              {selectedHand.map((card, index) => {
                const shouldHold = recommendation?.hold?.includes(index);
                const isJoker = card?.rank === 'JOKER' || card?.isJoker;
                return (
                  <div key={index} className="text-center">
                    <button
                      onClick={() => setShowCardPicker(index)}
                      className={`w-24 h-32 rounded-lg border-2 flex flex-col items-center justify-center transition-colors ${
                        card 
                          ? isComplete
                            ? shouldHold
                              ? 'bg-emerald-600 border-emerald-500'
                              : 'bg-[#2a2a2a] border-[#444]'
                            : isJoker
                              ? 'bg-purple-900 border-purple-500'
                              : 'bg-white border-white'
                          : 'bg-[#1a1a1a] border-[#444] border-dashed hover:border-[#d4a855]'
                      }`}
                    >
                      {card ? (
                        isJoker ? (
                          <>
                            <span className={`text-3xl font-bold ${isComplete ? 'text-purple-300' : 'text-purple-400'}`}>★</span>
                            <span className={`text-xs font-bold ${isComplete ? 'text-purple-300' : 'text-purple-400'}`}>JOKER</span>
                          </>
                        ) : (
                          <>
                            <span className={`text-4xl font-bold ${
                              isComplete 
                                ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white')
                                : card.color
                            }`}>{card.rank}</span>
                            <span className={`text-3xl ${
                              isComplete 
                                ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white')
                                : card.color
                            }`}>{card.suit}</span>
                          </>
                        )
                      ) : (
                        <span className="text-[#666] text-4xl">?</span>
                      )}
                    </button>
                    {isComplete && (
                      <p className={`text-sm mt-1.5 font-bold ${shouldHold ? 'text-emerald-400' : 'text-[#666]'}`}>
                        {shouldHold ? 'HOLD' : 'DRAW'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Recommendation text */}
            {isComplete && recommendation && (
              <div className="text-center mt-4 pt-4 border-t border-[#333]">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <p className="text-[#d4a855] font-semibold text-lg">{recommendation.name}</p>
                  {recommendation.source && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 font-medium">
                      WoO ✓
                    </span>
                  )}
                </div>
                <p className="text-[#bbb] text-sm">{recommendation.reason}</p>
              </div>
            )}

            {/* Clear Button */}
            {selectedHand.some(c => c !== null) && (
              <button
                onClick={() => setSelectedHand([null, null, null, null, null])}
                className="w-full text-[#aaa] text-sm py-3 mt-2 hover:text-white transition-colors"
              >
                Clear hand
              </button>
            )}
          </div>
        );
      })()}

      {/* Prompt to select pay table first */}
      {!selectedPayTable && (
        <div className="bg-[#0d0d0d] border border-dashed border-[#333] rounded p-6 text-center">
          <p className="text-[#aaa]">Select a pay table above to check hands</p>
        </div>
      )}

      {/* Strategy Quick Reference - Collapsible */}
      {game && (
        <details className="bg-[#161616] border border-[#333] rounded overflow-hidden group">
          <summary className="p-4 cursor-pointer flex items-center justify-between list-none">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-[#d4a855]" />
              <span className="text-white font-semibold">Strategy Tips</span>
            </div>
            <ChevronDown size={20} className="text-[#aaa] group-open:rotate-180 transition-transform" />
          </summary>
          <div className="px-4 pb-4 space-y-4">
            {/* Key Strategy Rules */}
            {game.strategyTips && game.strategyTips.length > 0 && (
              <div className="space-y-3">
                {game.strategyTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 py-1">
                    <span className="w-6 h-6 rounded-full bg-[#d4a855]/20 text-[#d4a855] text-sm font-bold flex items-center justify-center shrink-0">
                      {tip.priority}
                    </span>
                    <p className="text-[#ddd] text-sm leading-relaxed">{tip.rule}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Pay Tables Quick View */}
            {game.payTables && game.payTables.length > 0 && (
              <div className="pt-4 border-t border-[#333]">
                <p className="text-[#bbb] text-sm mb-2">Pay Tables ({game.keyLookup})</p>
                <div className="flex flex-wrap gap-2">
                  {game.payTables.map((pt, i) => (
                    <div key={i} className={`px-3 py-1.5 rounded text-sm ${
                      pt.rating === 'HUNT' ? 'bg-emerald-900/30 text-emerald-400' :
                      pt.rating === 'OK' ? 'bg-amber-900/30 text-amber-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {pt.label}: {pt.return}%
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Mistakes */}
            {game.commonMistakes && game.commonMistakes.length > 0 && (
              <div className="pt-4 border-t border-[#333]">
                <p className="text-red-400 text-sm font-medium mb-3">Common Mistakes</p>
                <div className="space-y-3">
                  {game.commonMistakes.map((m, i) => (
                    <div key={i} className="text-sm leading-relaxed">
                      <p className="text-red-300">Wrong: {m.mistake}</p>
                      <p className="text-emerald-400">Correct: {m.correct}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </details>
      )}

      {/* Card Picker Modal */}
      {showCardPicker !== null && (
        <CardPicker
          onSelect={(card) => {
            const newHand = [...selectedHand];
            newHand[showCardPicker] = card;
            setSelectedHand(newHand);
            setShowCardPicker(null);
          }}
          onClose={() => setShowCardPicker(null)}
          excludeCards={selectedHand}
        />
      )}
    </div>
  );
}

// ============================================
// BLOODIES TAB - Bloody Mary Tracker
// ============================================

// Badge definitions with criteria
const BLOODY_BADGES = [
  // Milestones
  { id: 'first-blood', name: 'First Blood', description: 'Log your first bloody', category: 'milestone', icon: '🩸', color: 'red', effect: 'confetti' },
  { id: 'getting-started', name: 'Getting Started', description: 'Log 5 bloodies', category: 'milestone', icon: '🚀', color: 'blue', effect: 'confetti' },
  { id: 'double-digits', name: 'Double Digits', description: 'Log 10 bloodies', category: 'milestone', icon: '🔟', color: 'purple', effect: 'explode' },
  // Daily Frequency
  { id: 'back-to-back', name: 'Back to Back', description: '2 bloodies within 30 minutes', category: 'frequency', icon: '⚡', color: 'yellow', effect: 'confetti' },
  { id: 'triple-threat', name: 'Triple Threat', description: '3 bloodies in one day', category: 'frequency', icon: '3️⃣', color: 'orange', effect: 'confetti' },
  { id: 'high-five', name: 'High Five', description: '5 bloodies in one day', category: 'frequency', icon: '🖐️', color: 'pink', effect: 'explode' },
  // Location
  { id: 'regular', name: 'Regular', description: 'Same location 3+ times', category: 'location', icon: '🏠', color: 'teal', effect: 'confetti' },
  { id: 'explorer', name: 'Explorer', description: '5 different locations', category: 'location', icon: '🧭', color: 'green', effect: 'confetti' },
  { id: 'wanderer', name: 'Wanderer', description: '10 different locations', category: 'location', icon: '🗺️', color: 'emerald', effect: 'explode' },
  { id: 'strip-crawler', name: 'Strip Crawler', description: '5 different Strip casinos', category: 'location', icon: '🎰', color: 'gold', effect: 'explode' },
  // Rating
  { id: 'five-star-find', name: 'Five Star Find', description: 'Log a 5-star bloody', category: 'rating', icon: '⭐', color: 'yellow', effect: 'confetti' },
  { id: 'tough-crowd', name: 'Tough Crowd', description: 'Log a 1-star bloody', category: 'rating', icon: '👎', color: 'gray', effect: 'none' },
  // Spice - these get fire effects!
  { id: 'cough-cough', name: 'Cough, Cough', description: 'Log a 5-fire spice rating', category: 'spice', icon: '🔥', color: 'red', effect: 'fire' },
  { id: 'heat-seeker', name: 'Heat Seeker', description: 'Log five 5-fire bloodies', category: 'spice', icon: '🌶️', color: 'orange', effect: 'explode' },
  { id: 'mild-mannered', name: 'Mild Mannered', description: 'Log a 1-fire bloody', category: 'spice', icon: '🥛', color: 'blue', effect: 'none' },
  { id: 'spice-spectrum', name: 'Spice Spectrum', description: 'Log all 5 spice levels', category: 'spice', icon: '🌈', color: 'purple', effect: 'explode' },
  { id: 'playing-it-safe', name: 'Playing It Safe', description: '5 in a row at 1-2 spice', category: 'spice', icon: '🛡️', color: 'teal', effect: 'fire' },
  // Time
  { id: 'hair-of-the-dog', name: 'Hair of the Dog', description: 'First bloody before 9am', category: 'time', icon: '🌅', color: 'amber', effect: 'confetti' },
  { id: 'night-owl', name: 'Night Owl', description: 'Bloody after midnight', category: 'time', icon: '🦉', color: 'indigo', effect: 'confetti' },
  { id: 'happy-hour', name: 'Happy Hour', description: 'Bloody between 4-6pm', category: 'time', icon: '🍻', color: 'yellow', effect: 'confetti' },
  { id: 'weekend-warrior', name: 'Weekend Warrior', description: 'Log on both Sat & Sun', category: 'time', icon: '🗓️', color: 'green', effect: 'explode' },
];

// Strip casino IDs for Strip Crawler badge
const STRIP_CASINO_IDS = [
  'bellagio', 'aria', 'cosmopolitan', 'venetian', 'palazzo', 'wynn', 'encore',
  'mgm-grand', 'mandalay-bay', 'luxor', 'excalibur', 'new-york-new-york', 'park-mgm',
  'caesars-palace', 'paris', 'ballys', 'flamingo', 'linq', 'harrahs',
  'treasure-island', 'mirage', 'circus-circus', 'sahara', 'resorts-world',
  'tropicana', 'planet-hollywood'
];

// Badge color mapping
const BADGE_COLORS = {
  red: { outline: 'from-red-500 to-red-700', fill: 'from-red-900/50 to-red-950/50' },
  orange: { outline: 'from-orange-500 to-orange-700', fill: 'from-orange-900/50 to-orange-950/50' },
  yellow: { outline: 'from-yellow-500 to-yellow-700', fill: 'from-yellow-900/50 to-yellow-950/50' },
  amber: { outline: 'from-amber-500 to-amber-700', fill: 'from-amber-900/50 to-amber-950/50' },
  gold: { outline: 'from-yellow-400 to-amber-600', fill: 'from-yellow-900/50 to-amber-950/50' },
  green: { outline: 'from-green-500 to-green-700', fill: 'from-green-900/50 to-green-950/50' },
  emerald: { outline: 'from-emerald-500 to-emerald-700', fill: 'from-emerald-900/50 to-emerald-950/50' },
  teal: { outline: 'from-teal-500 to-teal-700', fill: 'from-teal-900/50 to-teal-950/50' },
  blue: { outline: 'from-blue-500 to-blue-700', fill: 'from-blue-900/50 to-blue-950/50' },
  indigo: { outline: 'from-indigo-500 to-indigo-700', fill: 'from-indigo-900/50 to-indigo-950/50' },
  purple: { outline: 'from-purple-500 to-purple-700', fill: 'from-purple-900/50 to-purple-950/50' },
  pink: { outline: 'from-pink-500 to-pink-700', fill: 'from-pink-900/50 to-pink-950/50' },
  gray: { outline: 'from-gray-500 to-gray-700', fill: 'from-gray-800/50 to-gray-900/50' },
};

// Check which badges are earned based on bloodies history
function checkBadges(bloodies) {
  const earned = new Set();
  
  if (bloodies.length === 0) return earned;
  
  // Milestone badges
  if (bloodies.length >= 1) earned.add('first-blood');
  if (bloodies.length >= 5) earned.add('getting-started');
  if (bloodies.length >= 10) earned.add('double-digits');
  
  // Location-based badges
  const locationCounts = {};
  const uniqueLocations = new Set();
  const stripLocations = new Set();
  
  bloodies.forEach(b => {
    if (b.location) {
      const locKey = b.location.toLowerCase().trim();
      locationCounts[locKey] = (locationCounts[locKey] || 0) + 1;
      uniqueLocations.add(locKey);
      
      // Check if it's a strip casino
      if (STRIP_CASINO_IDS.some(id => locKey.includes(id) || id.includes(locKey))) {
        stripLocations.add(locKey);
      }
    }
  });
  
  if (Object.values(locationCounts).some(count => count >= 3)) earned.add('regular');
  if (uniqueLocations.size >= 5) earned.add('explorer');
  if (uniqueLocations.size >= 10) earned.add('wanderer');
  if (stripLocations.size >= 5) earned.add('strip-crawler');
  
  // Rating badges
  if (bloodies.some(b => b.rating === 5)) earned.add('five-star-find');
  if (bloodies.some(b => b.rating === 1)) earned.add('tough-crowd');
  
  // Spice badges
  const spiceLevels = new Set(bloodies.map(b => b.spice).filter(s => s));
  const fiveFireCount = bloodies.filter(b => b.spice === 5).length;
  
  if (bloodies.some(b => b.spice === 5)) earned.add('cough-cough');
  if (fiveFireCount >= 5) earned.add('heat-seeker');
  if (bloodies.some(b => b.spice === 1)) earned.add('mild-mannered');
  if (spiceLevels.size === 5) earned.add('spice-spectrum');
  
  // Playing it safe - 5 in a row at 1-2 spice
  let safeStreak = 0;
  for (const b of bloodies) {
    if (b.spice && b.spice <= 2) {
      safeStreak++;
      if (safeStreak >= 5) {
        earned.add('playing-it-safe');
        break;
      }
    } else {
      safeStreak = 0;
    }
  }
  
  // Time-based badges
  bloodies.forEach(b => {
    const date = new Date(b.timestamp);
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    if (hour < 9) earned.add('hair-of-the-dog');
    if (hour >= 0 && hour < 5) earned.add('night-owl'); // After midnight, before 5am
    if (hour >= 16 && hour < 18) earned.add('happy-hour');
  });
  
  // Weekend Warrior - need both Sat and Sun
  const hasSaturday = bloodies.some(b => new Date(b.timestamp).getDay() === 6);
  const hasSunday = bloodies.some(b => new Date(b.timestamp).getDay() === 0);
  if (hasSaturday && hasSunday) earned.add('weekend-warrior');
  
  // Frequency badges - group by day
  const byDay = {};
  bloodies.forEach(b => {
    const dayKey = new Date(b.timestamp).toDateString();
    if (!byDay[dayKey]) byDay[dayKey] = [];
    byDay[dayKey].push(b);
  });
  
  Object.values(byDay).forEach(dayBloodies => {
    if (dayBloodies.length >= 3) earned.add('triple-threat');
    if (dayBloodies.length >= 5) earned.add('high-five');
    
    // Back to back - 2 within 30 minutes
    const sorted = [...dayBloodies].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    for (let i = 1; i < sorted.length; i++) {
      const diff = new Date(sorted[i].timestamp) - new Date(sorted[i-1].timestamp);
      if (diff <= 30 * 60 * 1000) { // 30 minutes in ms
        earned.add('back-to-back');
        break;
      }
    }
  });
  
  return earned;
}

// Hexagon Badge Component
function HexBadge({ badge, earned, size = 'medium', onClick }) {
  const sizes = {
    small: { outer: 'w-16 h-[70px]', inner: 'w-12 h-[53px]', icon: 'text-xl' },
    medium: { outer: 'w-20 h-[88px]', inner: 'w-16 h-[70px]', icon: 'text-2xl' },
    large: { outer: 'w-28 h-[123px]', inner: 'w-24 h-[105px]', icon: 'text-4xl' },
  };
  
  const s = sizes[size];
  const colors = earned ? BADGE_COLORS[badge.color] : { outline: 'from-gray-600 to-gray-800', fill: 'from-gray-800/50 to-gray-900/50' };
  
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      {/* Outer hexagon (border) */}
      <div 
        className={`${s.outer} bg-gradient-to-b ${colors.outline} flex items-center justify-center transition-all ${earned ? 'opacity-100' : 'opacity-40'}`}
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      >
        {/* Inner hexagon (fill) */}
        <div 
          className={`${s.inner} bg-gradient-to-b ${colors.fill} flex items-center justify-center`}
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          {earned ? (
            <span className={s.icon}>{badge.icon}</span>
          ) : (
            <span className="text-gray-600 text-lg">🔒</span>
          )}
        </div>
      </div>
      <span className={`text-xs mt-2 text-center ${earned ? 'text-white' : 'text-gray-500'} max-w-[80px]`}>
        {badge.name}
      </span>
    </div>
  );
}

// Toast notification component
function BloodyToast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-in-right`}>
      <div className={`rounded-lg px-4 py-3 shadow-lg flex items-center gap-3 ${
        type === 'success' ? 'bg-emerald-900/90 border border-emerald-700' :
        type === 'badge' ? 'bg-purple-900/90 border border-purple-700' :
        'bg-[#242424] border border-[#444]'
      }`}>
        <span className="text-2xl">{type === 'badge' ? '🏆' : '🍅'}</span>
        <div>
          <p className="text-white font-semibold">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Log Bloody Modal
function LogBloodyModal({ isOpen, onClose, onSubmit, casinos }) {
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [rating, setRating] = useState(0);
  const [spice, setSpice] = useState(0);
  const [notes, setNotes] = useState('');
  
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
        className="bg-[#1a1a1a] border-t border-[#333] rounded-t-2xl w-full max-w-md p-5 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white font-bold text-xl">Log a Bloody 🍅</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        {/* Location */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Location *</label>
          <select 
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full bg-[#242424] border border-[#444] rounded-lg px-4 py-3 text-white"
          >
            <option value="">Select location...</option>
            {casinos.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
            <option value="custom">Other (type below)</option>
          </select>
          {location === 'custom' && (
            <input
              type="text"
              value={customLocation}
              onChange={e => setCustomLocation(e.target.value)}
              placeholder="Enter location name..."
              className="w-full mt-2 bg-[#242424] border border-[#444] rounded-lg px-4 py-3 text-white placeholder-gray-600"
            />
          )}
        </div>
        
        {/* Rating */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(rating === star ? 0 : star)}
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
                onClick={() => setSpice(spice === fire ? 0 : fire)}
                className={`text-3xl transition-all hover:scale-110 ${
                  fire <= spice ? 'grayscale-0' : 'grayscale opacity-40'
                }`}
              >
                🔥
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
            className="w-full bg-[#242424] border border-[#444] rounded-lg px-4 py-3 text-white placeholder-gray-600"
          />
        </div>
        
        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!location || (location === 'custom' && !customLocation)}
          className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-white font-bold text-lg transition-colors"
        >
          Log It! 🍅
        </button>
      </div>
    </div>
  );
}

// Badge Detail Modal
function BadgeDetailModal({ badge, earned, onClose }) {
  if (!badge) return null;
  
  const colors = earned ? BADGE_COLORS[badge.color] : { outline: 'from-gray-600 to-gray-800', fill: 'from-gray-800/50 to-gray-900/50' };
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="text-center" onClick={e => e.stopPropagation()}>
        {/* Large hexagon badge */}
        <div 
          className={`w-32 h-[140px] bg-gradient-to-b ${colors.outline} flex items-center justify-center mx-auto mb-4 ${earned ? '' : 'opacity-40'}`}
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          <div 
            className={`w-28 h-[123px] bg-gradient-to-b ${colors.fill} flex items-center justify-center`}
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
          >
            {earned ? (
              <span className="text-5xl">{badge.icon}</span>
            ) : (
              <span className="text-gray-600 text-3xl">🔒</span>
            )}
          </div>
        </div>
        
        <h2 className={`text-2xl font-bold mb-2 ${earned ? 'text-white' : 'text-gray-500'}`}>
          {badge.name}
        </h2>
        <p className={`${earned ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
          {badge.description}
        </p>
        <span className={`inline-block px-3 py-1 rounded-full text-xs ${
          earned ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' : 'bg-gray-800 text-gray-500 border border-gray-700'
        }`}>
          {earned ? '✓ Unlocked' : 'Locked'}
        </span>
        
        <button
          onClick={onClose}
          className="block mx-auto mt-6 px-6 py-2 bg-[#333] hover:bg-[#444] rounded-lg text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Main Bloodies Tab Component
function BloodiesTab() {
  // Load bloodies from localStorage
  const [bloodies, setBloodies] = useState(() => {
    const saved = localStorage.getItem('hitseeker_bloodies');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [newBadges, setNewBadges] = useState([]);
  
  // Save bloodies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hitseeker_bloodies', JSON.stringify(bloodies));
  }, [bloodies]);
  
  // Calculate earned badges
  const earnedBadges = checkBadges(bloodies);
  
  // Get today's count
  const today = new Date().toDateString();
  const todayCount = bloodies.filter(b => new Date(b.timestamp).toDateString() === today).length;
  
  // Handle new bloody submission
  const handleLogBloody = (bloodyData) => {
    const newBloody = {
      id: Date.now().toString(),
      ...bloodyData
    };
    
    // Check for new badges before adding
    const oldEarned = checkBadges(bloodies);
    const newBloodies = [...bloodies, newBloody];
    const newEarned = checkBadges(newBloodies);
    
    // Find newly earned badges
    const justEarned = [];
    newEarned.forEach(badgeId => {
      if (!oldEarned.has(badgeId)) {
        justEarned.push(BLOODY_BADGES.find(b => b.id === badgeId));
      }
    });
    
    setBloodies(newBloodies);
    setToast({ message: 'Bloody logged!', type: 'success' });
    
    // Show badge unlock after a short delay
    if (justEarned.length > 0) {
      setTimeout(() => {
        setNewBadges(justEarned);
      }, 1500);
    }
  };
  
  // Badge unlock celebration modal with Lottie effects
  const BadgeUnlockModal = () => {
    if (newBadges.length === 0) return null;
    
    const badge = newBadges[0];
    const colors = BADGE_COLORS[badge.color];
    const effectType = badge.effect || 'confetti';
    
    // Refs for Lottie containers
    const fireContainerRef = useRef(null);
    const explosionContainerRef = useRef(null);
    const [showBadge, setShowBadge] = useState(false);
    const [explosions, setExplosions] = useState([]);
    
    // Explosion positions for major badges
    const explosionPositions = [
      { top: '15%', left: '20%', delay: 0, scale: 1.0 },
      { top: '10%', left: '80%', delay: 100, scale: 1.1 },
      { top: '45%', left: '10%', delay: 200, scale: 0.9 },
      { top: '50%', left: '50%', delay: 350, scale: 1.4 },
      { top: '40%', left: '90%', delay: 450, scale: 1.0 },
      { top: '80%', left: '25%', delay: 550, scale: 1.1 },
      { top: '75%', left: '75%', delay: 650, scale: 0.95 },
    ];
    
    useEffect(() => {
      // Show badge quickly
      const badgeTimer = setTimeout(() => setShowBadge(true), 100);
      
      // For explosion effect, trigger multiple explosions
      if (effectType === 'explode') {
        const newExplosions = explosionPositions.map((pos, i) => ({
          id: i,
          ...pos,
          visible: false,
          fading: false
        }));
        setExplosions(newExplosions);
        
        // Stagger the explosions
        explosionPositions.forEach((pos, i) => {
          setTimeout(() => {
            setExplosions(prev => prev.map(exp => 
              exp.id === i ? { ...exp, visible: true } : exp
            ));
          }, pos.delay);
          
          // Fade out each explosion
          setTimeout(() => {
            setExplosions(prev => prev.map(exp => 
              exp.id === i ? { ...exp, fading: true } : exp
            ));
          }, pos.delay + 1200);
          
          // Remove explosion
          setTimeout(() => {
            setExplosions(prev => prev.map(exp => 
              exp.id === i ? { ...exp, visible: false } : exp
            ));
          }, pos.delay + 1450);
        });
      }
      
      return () => clearTimeout(badgeTimer);
    }, [badge.id, effectType]);
    
    const handleDismiss = () => {
      setShowBadge(false);
      setExplosions([]);
      setTimeout(() => setNewBadges(prev => prev.slice(1)), 100);
    };
    
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        {/* Screen glow for fire/explode effects */}
        {(effectType === 'fire' || effectType === 'explode') && (
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 100, 0, 0.25) 0%, transparent 50%)',
              opacity: showBadge ? 1 : 0
            }}
          />
        )}
        
        {/* Explosion effects - renders 7 lottie players at different positions */}
        {effectType === 'explode' && explosions.map(exp => exp.visible && (
          <div
            key={exp.id}
            className="absolute pointer-events-none"
            style={{
              top: exp.top,
              left: exp.left,
              transform: `translate(-50%, -50%) scale(${exp.scale})`,
              width: '300px',
              height: '300px',
              opacity: exp.fading ? 0 : 1,
              transition: 'opacity 0.25s ease-out',
              zIndex: 51
            }}
          >
            <lottie-player
              src="/assets/explode.json"
              background="transparent"
              speed="1"
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ))}
        
        {/* Main content */}
        <div 
          className="text-center relative z-[100]"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: showBadge ? 'scale(1)' : 'scale(0.5)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div className="mb-2 text-yellow-400 text-sm font-semibold uppercase tracking-wider">
            🎉 Badge Unlocked! 🎉
          </div>
          
          {/* Badge with fire effect behind it */}
          <div className="relative mx-auto mb-4" style={{ width: '200px', height: '220px' }}>
            {/* Fire effect - positioned behind badge */}
            {effectType === 'fire' && (
              <div 
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ 
                  bottom: '25px', 
                  width: '240px', 
                  height: '260px',
                  zIndex: 1 
                }}
              >
                <lottie-player
                  src="/assets/fire-2.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            )}
            
            {/* Hexagon badge */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 bottom-0"
              style={{ zIndex: 10 }}
            >
              <div 
                className={`w-32 h-[140px] bg-gradient-to-b ${colors.outline} flex items-center justify-center shadow-lg`}
                style={{ 
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  boxShadow: effectType === 'fire' ? '0 0 40px rgba(255, 100, 0, 0.5)' : 
                             effectType === 'explode' ? '0 0 40px rgba(255, 200, 0, 0.5)' : 
                             'none'
                }}
              >
                <div 
                  className={`w-28 h-[123px] bg-gradient-to-b ${colors.fill} flex items-center justify-center`}
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <span className="text-5xl">{badge.icon}</span>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-2">{badge.name}</h2>
          <p className="text-gray-400 mb-6">{badge.description}</p>
          
          <button
            onClick={handleDismiss}
            className="px-8 py-3 bg-[#d4a855] hover:bg-[#c49745] rounded-lg text-black font-bold transition-colors"
          >
            {newBadges.length > 1 ? 'Next Badge →' : 'Awesome! 🍅'}
          </button>
        </div>
        
        {/* Confetti effect using canvas-confetti (simple CSS fallback) */}
        {effectType === 'confetti' && showBadge && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  backgroundColor: ['#d4a855', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][i % 7],
                  animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="p-4 border-b border-[#333]">
        <h1 className="text-2xl font-bold text-white mb-1">Bloodies 🍅</h1>
        <p className="text-gray-500 text-sm">Track your Bloody Mary adventures</p>
      </div>
      
      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-[#1a1a1a] rounded-xl p-4 text-center border border-[#333]">
          <div className="text-4xl font-bold text-white">{bloodies.length}</div>
          <div className="text-gray-500 text-sm">Lifetime</div>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 text-center border border-[#333]">
          <div className="text-4xl font-bold text-[#d4a855]">{todayCount}</div>
          <div className="text-gray-500 text-sm">Today</div>
        </div>
      </div>
      
      {/* Log Button */}
      <div className="px-4 mb-6">
        <button
          onClick={() => setShowLogModal(true)}
          className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl text-white font-bold text-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-2xl">🍅</span>
          Log a Bloody
        </button>
      </div>
      
      {/* Badges Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Badges</h2>
          <span className="text-sm text-gray-500">{earnedBadges.size} / {BLOODY_BADGES.length}</span>
        </div>
        
        {/* Badge Grid */}
        <div className="grid grid-cols-4 gap-4">
          {BLOODY_BADGES.map(badge => (
            <HexBadge
              key={badge.id}
              badge={badge}
              earned={earnedBadges.has(badge.id)}
              size="small"
              onClick={() => setSelectedBadge(badge)}
            />
          ))}
        </div>
      </div>
      
      {/* Recent Bloodies */}
      {bloodies.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-lg font-bold text-white mb-3">Recent</h2>
          <div className="space-y-2">
            {bloodies.slice(-5).reverse().map(bloody => (
              <div key={bloody.id} className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white font-medium">{bloody.location}</div>
                    <div className="text-gray-500 text-xs">
                      {new Date(bloody.timestamp).toLocaleDateString()} at {new Date(bloody.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {bloody.rating > 0 && (
                      <span className="text-yellow-400 text-sm">{'★'.repeat(bloody.rating)}</span>
                    )}
                    {bloody.spice > 0 && (
                      <span className="text-sm">{'🔥'.repeat(bloody.spice)}</span>
                    )}
                  </div>
                </div>
                {bloody.notes && (
                  <div className="text-gray-400 text-sm mt-1 italic">"{bloody.notes}"</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Log Modal */}
      <LogBloodyModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSubmit={handleLogBloody}
        casinos={vegasCasinos}
      />
      
      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        earned={selectedBadge && earnedBadges.has(selectedBadge.id)}
        onClose={() => setSelectedBadge(null)}
      />
      
      {/* Toast */}
      {toast && (
        <BloodyToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Badge Unlock Modal */}
      <BadgeUnlockModal />
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function MainApp() {
  const { user, profile, signOut } = useAuth();
  const { currentTrip, tripMembers } = useTrip();
  const { notes, loading: notesLoading, addNote, updateNote, deleteNote, refresh: refreshNotes } = useNotes();
  const { photos, addPhoto, deletePhoto, getPhotoUrl, getMachinePhotos, getLatestPhoto } = usePhotos();
  const { myCheckIn, checkIn, checkOut, getMembersAtCasino } = useCheckIns();

  const [activeTab, setActiveTab] = useState('hunt');
  const [tripSubTab, setTripSubTab] = useState('overview'); // 'overview', 'casinos', 'notes', 'team'
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [recentMachines, setRecentMachines] = useState([]); // Track recently viewed machines
  const [recentActivity, setRecentActivity] = useState([]); // Unified activity tracking
  const [previousTab, setPreviousTab] = useState(null); // Track where we came from
  const [selectedCasino, setSelectedCasino] = useState(null);
  const [casinoAreaFilter, setCasinoAreaFilter] = useState('all'); // Casino area filter
  const [casinoSearch, setCasinoSearch] = useState(''); // Casino search
  const [currentTier, setCurrentTier] = useState(1);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showSpotter, setShowSpotter] = useState(false); // Unified spotter form
  const [spotterData, setSpotterData] = useState(null); // { type: 'slot'|'vp', ...prefillData }
  const [prefillMachine, setPrefillMachine] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [calcCurrent, setCalcCurrent] = useState('');
  const [calcCeiling, setCalcCeiling] = useState('');
  const [showTripSettings, setShowTripSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if user has seen onboarding
    return !localStorage.getItem('hitseeker_onboarded');
  });
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showTierHelp, setShowTierHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [geoStatus, setGeoStatus] = useState('idle');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [machineViewMode, setMachineViewMode] = useState('cards'); // 'list' or 'cards'
  const [apOnly, setApOnly] = useState(false); // AP machines only toggle
  const [releaseYearFilter, setReleaseYearFilter] = useState('all'); // 'all', '2024', '2023', etc.

  // Track recently viewed machines
  const selectMachine = (machine) => {
    setSelectedMachine(machine);
    if (machine) {
      setRecentMachines(prev => {
        const filtered = prev.filter(m => m.id !== machine.id);
        return [machine, ...filtered].slice(0, 5); // Keep last 5
      });
    }
  };

  const tierColors = {
    1: { bg: 'bg-emerald-900/40', border: 'border-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-600', badgeOutline: 'border-emerald-500 text-emerald-400 bg-[#0d0d0d]' },
    2: { bg: 'bg-amber-900/40', border: 'border-amber-500', text: 'text-amber-400', badge: 'bg-amber-600', badgeOutline: 'border-amber-500 text-amber-400 bg-[#0d0d0d]' },
    3: { bg: 'bg-red-900/40', border: 'border-red-500', text: 'text-red-400', badge: 'bg-red-600', badgeOutline: 'border-red-500 text-red-400 bg-[#0d0d0d]' }
  };

  const currentCasinoInfo = myCheckIn ? vegasCasinos.find(c => c.id === myCheckIn.casino_id) : null;

  // Debug mode for testing check-in flows (set to null to use real geolocation)
  // Options: 'near-casino' | 'not-near' | 'error' | null
  const [debugGeoMode, setDebugGeoMode] = useState(null);
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [showStrategyValidator, setShowStrategyValidator] = useState(false);

  const handleCheckIn = (casino) => {
    checkIn(casino.id, casino.name);
  };

  const detectCasino = () => {
    setGeoStatus('loading');
    if (!navigator.geolocation) { setGeoStatus('error'); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let closest = null, minDist = Infinity;
        vegasCasinos.forEach(casino => {
          const dist = Math.sqrt(Math.pow(latitude - casino.lat, 2) + Math.pow(longitude - casino.lng, 2));
          if (dist < minDist) { minDist = dist; closest = casino; }
        });
        if (closest && minDist < 0.005) {
          handleCheckIn(closest);
          setGeoStatus('success');
        } else {
          setGeoStatus('not-found');
        }
      },
      () => setGeoStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // State for check-in confirmation
  const [pendingCheckIn, setPendingCheckIn] = useState(null);

  // Simulated geolocation for testing
  const simulateGeolocation = (mode) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mode === 'near-casino') {
          // Simulate being at Bellagio
          resolve({ coords: { latitude: 36.1129, longitude: -115.1765 } });
        } else if (mode === 'not-near') {
          // Simulate being far from any casino
          resolve({ coords: { latitude: 40.7128, longitude: -74.0060 } }); // NYC
        } else if (mode === 'error') {
          reject(new Error('Geolocation error'));
        }
      }, 800); // Simulate network delay
    });
  };

  // Header check-in: try to detect location, ask to confirm, or fall back to casino list
  const handleHeaderCheckIn = () => {
    setGeoStatus('loading');
    
    // Use simulated geolocation if debug mode is set
    const geoPromise = debugGeoMode 
      ? simulateGeolocation(debugGeoMode)
      : new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('No geolocation'));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
        });
    
    geoPromise
      .then((position) => {
        const { latitude, longitude } = position.coords;
        let closest = null, minDist = Infinity;
        vegasCasinos.forEach(casino => {
          const dist = Math.sqrt(Math.pow(latitude - casino.lat, 2) + Math.pow(longitude - casino.lng, 2));
          if (dist < minDist) { minDist = dist; closest = casino; }
        });
        if (closest && minDist < 0.005) {
          // Found nearby casino - ask user to confirm (even if already checked in elsewhere)
          setPendingCheckIn(closest);
          setGeoStatus('idle');
        } else {
          // Not near a casino - go to casino list
          setActiveTab('trip');
          setTripSubTab('casinos');
          setGeoStatus('idle');
        }
      })
      .catch(() => {
        // Geolocation error - go to casino list
        setActiveTab('trip');
        setTripSubTab('casinos');
        setGeoStatus('idle');
      });
  };

  const confirmCheckIn = () => {
    if (pendingCheckIn) {
      handleCheckIn(pendingCheckIn);
      setPendingCheckIn(null);
    }
  };

  const cancelCheckIn = () => {
    setPendingCheckIn(null);
    setActiveTab('trip');
    setTripSubTab('casinos');
  };

  const getWalkTime = (casinoId) => {
    if (!myCheckIn) return '?';
    const fromCasino = vegasCasinos.find(c => c.id === myCheckIn.casino_id);
    return fromCasino?.walkTimes[casinoId] || '?';
  };

  const handleAddNote = async (noteData) => {
    await addNote(noteData);
    setShowNoteForm(false);
    setPrefillMachine(null);
  };

  const handleQuickNote = (machineName) => {
    setPrefillMachine(machineName);
    setShowNoteForm(true);
    setActiveTab('trip');
    setSelectedMachine(null);
  };

  const [photoUploading, setPhotoUploading] = useState(false);
  
  const handleAddPhoto = async (machineId, file) => {
    setPhotoUploading(true);
    try {
      await addPhoto(machineId, file, currentCasinoInfo?.name);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleDeletePhoto = async (machineId, photoId) => {
    await deletePhoto(machineId, photoId);
    setViewingPhoto(null);
  };

  // Handle spot submission - creates note AND adds to recent activity
  const handleSpotSubmit = async (spotData) => {
    // Add to recent activity (in-memory, session-based)
    const activityItem = {
      ...spotData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setRecentActivity(prev => [activityItem, ...prev].slice(0, 20)); // Keep last 20
    
    // Also add as a note (persisted)
    const noteContent = spotData.type === 'vp' 
      ? `${spotData.vpGameName} ${spotData.vpPayTable} (${spotData.vpReturn}%)${spotData.denomination ? ` - ${spotData.denomination}` : ''}`
      : spotData.state || 'Spotted';
    
    await addNote({
      machine: spotData.type === 'vp' ? `VP: ${spotData.vpGameName}` : spotData.machine,
      casino: spotData.casino,
      location: spotData.location,
      state: spotData.type === 'vp' ? `${spotData.vpPayTable} @ ${spotData.vpReturn}%${spotData.denomination ? ` | ${spotData.denomination}` : ''}${spotData.state ? ` | ${spotData.state}` : ''}` : spotData.state,
      playable: spotData.playable,
      // Extended fields for VP
      type: spotData.type,
      vpGame: spotData.vpGame,
      vpGameName: spotData.vpGameName,
      vpPayTable: spotData.vpPayTable,
      vpReturn: spotData.vpReturn,
      denomination: spotData.denomination,
    });
    
    setShowSpotter(false);
    setSpotterData(null);
  };

  // Open spotter for a slot machine
  const openSlotSpotter = (machineName) => {
    setSpotterData({ type: 'slot', machine: machineName });
    setShowSpotter(true);
  };

  // Open spotter for VP
  const openVPSpotter = (game, payTable) => {
    setSpotterData({
      type: 'vp',
      game: game.id,
      gameName: game.name,
      payTable: payTable.label,
      return: payTable.return,
    });
    setShowSpotter(true);
  };

  const calcResult = (() => {
    const c = parseFloat(calcCurrent), ceil = parseFloat(calcCeiling);
    return (!isNaN(c) && !isNaN(ceil) && ceil > 0) ? ((c / ceil) * 100).toFixed(1) : null;
  })();

  // Get unique release years for filter dropdown
  const releaseYears = [...new Set(machines.filter(m => m.releaseYear).map(m => m.releaseYear))].sort((a, b) => b - a);

  const filteredMachines = machines.filter(m => {
    // Safeguard: ensure this is a valid machine entry with required fields
    if (!m.id || !m.tier || !m.name) return false;
    
    const matchesSearch = !debouncedSearch || 
      m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      m.shortName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.manufacturer?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesAP = !apOnly || m.category !== 'entertainment';
    const matchesYear = releaseYearFilter === 'all' || m.releaseYear === parseInt(releaseYearFilter);
    return matchesSearch && matchesCategory && matchesAP && matchesYear;
  });

  // Count AP vs Entertainment for toggle label
  const apCount = machines.filter(m => m.id && m.category !== 'entertainment').length;
  const entertainmentCount = machines.filter(m => m.id && m.category === 'entertainment').length;

  const filteredNotes = debouncedSearch
    ? notes.filter(n => n.machine.toLowerCase().includes(debouncedSearch.toLowerCase()) || n.casino?.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : notes;

  // Trip Settings Modal
  if (showTripSettings) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] p-6">
        <div className="max-w-md mx-auto">
          <button onClick={() => setShowTripSettings(false)} className="flex items-center gap-2 text-[#d4a855] mb-6">
            <ChevronLeft size={20} /> Back
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6">{currentTrip.name}</h2>
          
          <div className="bg-[#161616] rounded p-4 mb-4 border border-[#333]">
            <h3 className="font-semibold text-white mb-3">Share Code</h3>
            <code className="block bg-[#0d0d0d] px-4 py-3 rounded text-white font-mono text-xl tracking-widerr text-center">
              {currentTrip.share_code.toUpperCase()}
            </code>
            <p className="text-[#bbbbbb] text-sm text-center mt-2">Share this with friends to invite them</p>
          </div>

          <div className="bg-[#161616] rounded p-4 mb-4 border border-[#333]">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Users size={18} /> Members ({tripMembers.length})
            </h3>
            <div className="space-y-2">
              {tripMembers.map((member, idx) => (
                <div key={member.user_id || `member-${idx}`} className="flex items-center gap-3 p-2 bg-[#0d0d0d]/50 rounded">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-[#bbbbbb] text-sm">
                      {member.display_name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm">{member.display_name || member.email}</p>
                    <p className="text-[#aaaaaa] text-xs">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={signOut} className="w-full bg-[#161616] hover:bg-gray-700 text-gray-300 py-3 rounded border border-[#333] flex items-center justify-center gap-2">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Photo Viewer
  if (viewingPhoto) {
    const machineId = Object.keys(photos).find(id => 
      photos[id].some(p => p.id === viewingPhoto.id)
    );
    const allMachinePhotos = machineId ? getMachinePhotos(machineId) : [];
    const machine = machines.find(m => m.id === machineId);
    
    return (
      <PhotoViewer
        photo={viewingPhoto}
        photoUrl={getPhotoUrl(viewingPhoto)}
        machineName={machine?.name || 'Unknown'}
        onClose={() => setViewingPhoto(null)}
        onDelete={(photoId) => handleDeletePhoto(machineId, photoId)}
        allPhotos={allMachinePhotos}
        onNavigate={setViewingPhoto}
        getPhotoUrl={getPhotoUrl}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-20">
      <TripHeader 
        onOpenSettings={() => setShowTripSettings(true)} 
        onLocationClick={handleHeaderCheckIn}
        myCheckIn={myCheckIn}
      />

      {/* Onboarding Modal - 5 Step Walkthrough */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#333] rounded max-w-sm w-full p-6 max-h-[90vh] overflow-y-auto">
            
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6].map(step => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step === onboardingStep ? 'bg-[#d4a855]' : 
                    step < onboardingStep ? 'bg-[#d4a855]/50' : 'bg-[#333]'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Welcome + Tiers */}
            {onboardingStep === 1 && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    <span className="text-white">Welcome to </span>
                    <span className="text-[#d4a855]">HitSeeker</span>
                  </h1>
                  <p className="text-[#aaa] text-sm">Your advantage play companion</p>
                </div>

                <p className="text-white text-center mb-4 font-medium">Machines are organized into 3 tiers:</p>

                <div className="space-y-3 mb-6">
                  <div className="bg-emerald-900/20 border border-emerald-500/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">T1</span>
                      <span className="text-emerald-400 font-semibold text-sm">Must-Hit-By</span>
                    </div>
                    <p className="text-[#bbb] text-xs">Jackpots that MUST hit by a ceiling amount.</p>
                  </div>

                  <div className="bg-amber-900/20 border border-amber-500/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">T2</span>
                      <span className="text-amber-400 font-semibold text-sm">Persistent State</span>
                    </div>
                    <p className="text-[#bbb] text-xs">Machines that save progress between players.</p>
                  </div>

                  <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">T3</span>
                      <span className="text-red-400 font-semibold text-sm">Entertainment</span>
                    </div>
                    <p className="text-[#bbb] text-xs">No advantage play. Fun only!</p>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Hunt Tab */}
            {onboardingStep === 2 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                    <Diamond size={32} className="text-[#d4a855]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Hunt Tab</h2>
                  <p className="text-[#aaa] text-sm">Find your next play</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Search size={16} className="text-[#d4a855]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Search 777 machines</p>
                      <p className="text-[#aaa] text-xs">By name, manufacturer, or type</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Target size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Filter by AP Only</p>
                      <p className="text-[#aaa] text-xs">Show only advantage play machines (T1 & T2)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Grid size={16} className="text-[#d4a855]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Browse by category</p>
                      <p className="text-[#aaa] text-xs">Must-Hit-By, Persistent State, and more</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Machine Details */}
            {onboardingStep === 3 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                    <Calculator size={32} className="text-[#d4a855]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Machine Details</h2>
                  <p className="text-[#aaa] text-sm">Everything you need to decide</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-emerald-900/20 border border-emerald-500/30 rounded p-3">
                    <p className="text-emerald-400 font-medium text-sm mb-1">T1: MHB Calculator</p>
                    <p className="text-[#aaa] text-xs">Enter current value and ceiling to see if it's worth playing</p>
                  </div>

                  <div className="bg-amber-900/20 border border-amber-500/30 rounded p-3">
                    <p className="text-amber-400 font-medium text-sm mb-1">T2: Visual Cues</p>
                    <p className="text-[#aaa] text-xs">See exactly what to look for on the machine</p>
                  </div>

                  <div className="flex items-start gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Camera size={16} className="text-[#d4a855]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Add photos & notes</p>
                      <p className="text-[#aaa] text-xs">Remember where you found good machines</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Trip Coordination */}
            {onboardingStep === 4 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-[#d4a855]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Trip Tab</h2>
                  <p className="text-[#aaa] text-sm">Coordinate with your team</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Check in to casinos</p>
                      <p className="text-[#aaa] text-xs">Let teammates know where you are</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <StickyNote size={16} className="text-[#d4a855]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Share scouting notes</p>
                      <p className="text-[#aaa] text-xs">Team sees notes in real-time</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Target size={16} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Hot Opportunities</p>
                      <p className="text-[#aaa] text-xs">See today's best finds from the team</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 5: Video Poker */}
            {onboardingStep === 5 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                    <Spade size={32} className="text-[#d4a855]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Video Poker</h2>
                  <p className="text-[#aaa] text-sm">Find the best pay tables</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Search size={16} className="text-[#d4a855]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">88 Game Variants</p>
                      <p className="text-[#aaa] text-xs">Jacks or Better, Deuces Wild, Ultimate X, and more</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Calculator size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Pay Table Analyzer</p>
                      <p className="text-[#aaa] text-xs">See return % and find HUNT-worthy machines</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Hand Checker</p>
                      <p className="text-[#aaa] text-xs">Enter your hand, get the optimal play</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 6: Get Started */}
            {onboardingStep === 6 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#d4a855]/20 rounded-full flex items-center justify-center">
                    <Gem size={32} className="text-[#d4a855]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">You're Ready!</h2>
                  <p className="text-[#aaa] text-sm">Time to hit the floor</p>
                </div>

                <div className="bg-[#1a1a1a] rounded p-4 mb-6">
                  <p className="text-white font-medium text-sm mb-3">Quick start tips:</p>
                  <ul className="space-y-2 text-[#aaa] text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[#d4a855]">1.</span>
                      <span>Tap <strong className="text-white">Check In</strong> in the top-right</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#d4a855]">2.</span>
                      <span>Turn on <strong className="text-white">AP Only</strong> to focus on plays</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#d4a855]">3.</span>
                      <span>Search for machines you see on the floor</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {onboardingStep > 1 && (
                <button
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-white font-semibold py-3 rounded transition-colors"
                >
                  Back
                </button>
              )}
              
              {onboardingStep < 6 ? (
                <button
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  className="flex-1 bg-[#d4a855] hover:bg-[#c49745] text-black font-bold py-3 rounded transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    localStorage.setItem('hitseeker_onboarded', 'true');
                    setShowOnboarding(false);
                    setOnboardingStep(1);
                  }}
                  className="flex-1 bg-[#d4a855] hover:bg-[#c49745] text-black font-bold py-3 rounded transition-colors"
                >
                  Start Hunting
                </button>
              )}
            </div>

            {/* Skip button */}
            {onboardingStep < 6 && (
              <button
                onClick={() => {
                  localStorage.setItem('hitseeker_onboarded', 'true');
                  setShowOnboarding(false);
                  setOnboardingStep(1);
                }}
                className="w-full mt-3 text-[#aaa] hover:text-[#aaa] text-sm transition-colors"
              >
                Skip intro
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tier Help Modal - Can be reopened anytime */}
      {showTierHelp && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowTierHelp(false)}>
          <div className="bg-[#161616] border border-[#333] rounded max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Understanding Tiers</h2>
              <button onClick={() => setShowTierHelp(false)} className="text-[#aaa] hover:text-white">
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
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Note?"
        message="This action cannot be undone."
        onConfirm={() => { deleteNote(confirmDelete); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Check-in Confirmation Modal */}
      {pendingCheckIn && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#333] rounded p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-3 bg-emerald-600/20 rounded-full flex items-center justify-center">
                <MapPin size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {myCheckIn ? 'Switch Location?' : 'Check In?'}
              </h3>
              <p className="text-[#aaa] text-sm">
                {myCheckIn 
                  ? `You're currently at ${myCheckIn.casino_name}` 
                  : 'We detected you\'re near'}
              </p>
            </div>
            
            {myCheckIn && (
              <div className="flex items-center justify-center gap-2 mb-3 text-[#888] text-sm">
                <span>{myCheckIn.casino_name}</span>
                <ChevronRight size={16} />
                <span className="text-emerald-400">{pendingCheckIn.name}</span>
              </div>
            )}
            
            <div className="bg-[#0d0d0d] border border-emerald-500/30 rounded p-4 mb-4">
              <p className="text-white font-bold text-lg">{pendingCheckIn.name}</p>
              <p className="text-[#aaa] text-sm">{pendingCheckIn.area} • {pendingCheckIn.slots} slots</p>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={confirmCheckIn}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded font-semibold"
              >
                {myCheckIn ? `Switch to ${pendingCheckIn.name}` : 'Check In'}
              </button>
              <button 
                onClick={cancelCheckIn}
                className="w-full bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-3 rounded font-medium"
              >
                Choose Different Casino
              </button>
              <button 
                onClick={() => setPendingCheckIn(null)}
                className="w-full text-[#666] hover:text-[#aaa] py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug Menu for Testing Geolocation Flows */}
      <button
        onClick={() => setShowDebugMenu(!showDebugMenu)}
        className="fixed bottom-24 right-4 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-xs font-bold z-40 shadow-lg"
      >
        DEV
      </button>
      
      {showDebugMenu && (
        <div className="fixed bottom-36 right-4 bg-[#161616] border border-purple-500/50 rounded p-4 z-40 shadow-xl w-64">
          <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">Developer Tools</p>
          
          {/* Strategy Validator */}
          <button
            onClick={() => { setShowStrategyValidator(true); setShowDebugMenu(false); }}
            className="w-full text-left px-3 py-2 rounded text-sm bg-[#0d0d0d] text-[#aaa] hover:text-white hover:bg-emerald-900/30 mb-3"
          >
            Run Strategy Validator
          </button>
          
          <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">Geolocation Simulator</p>
          <div className="space-y-2">
            <button
              onClick={() => { setDebugGeoMode('near-casino'); setShowDebugMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${debugGeoMode === 'near-casino' ? 'bg-purple-600 text-white' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'}`}
            >
              Near Casino (Bellagio)
            </button>
            <button
              onClick={() => { setDebugGeoMode('not-near'); setShowDebugMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${debugGeoMode === 'not-near' ? 'bg-purple-600 text-white' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'}`}
            >
              Not Near Any Casino
            </button>
            <button
              onClick={() => { setDebugGeoMode('error'); setShowDebugMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${debugGeoMode === 'error' ? 'bg-purple-600 text-white' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'}`}
            >
              Geolocation Error
            </button>
            <button
              onClick={() => { setDebugGeoMode(null); setShowDebugMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${debugGeoMode === null ? 'bg-purple-600 text-white' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'}`}
            >
              Use Real Location
            </button>
          </div>
          <p className="text-[#666] text-xs mt-3">
            Current: <span className="text-purple-400">{debugGeoMode || 'Real'}</span>
          </p>
          <p className="text-[#555] text-xs mt-1">
            Tap "Check In" button to test
          </p>
        </div>
      )}
      
      {/* Strategy Validator Modal */}
      {showStrategyValidator && (
        <StrategyValidator onClose={() => setShowStrategyValidator(false)} />
      )}

      {/* Spotter Modal */}
      {showSpotter && spotterData && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <SpotterForm
              spotType={spotterData.type}
              prefillData={spotterData}
              currentCasino={currentCasinoInfo?.name || ''}
              onSubmit={handleSpotSubmit}
              onCancel={() => { setShowSpotter(false); setSpotterData(null); }}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        {/* HUNT TAB - Merged with Catalog */}
        {activeTab === 'hunt' && !selectedMachine && (
          <div className="space-y-4">
            {/* Search and View Toggle Row */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aaaaaa]" size={18} />
                <input
                  type="text"
                  placeholder="Search 777 machines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#161616] border border-[#333] rounded pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#d4a855] focus:outline-none"
                />
              </div>
              {/* View Toggle */}
              <div className="flex bg-[#161616] border border-[#333] rounded overflow-hidden">
                <button
                  onClick={() => setMachineViewMode('list')}
                  className={`p-3 transition-colors ${machineViewMode === 'list' ? 'bg-[#d4a855] text-black' : 'text-[#aaaaaa] hover:text-white'}`}
                  title="List view"
                >
                  <LayoutList size={20} />
                </button>
                <button
                  onClick={() => setMachineViewMode('cards')}
                  className={`p-3 transition-colors ${machineViewMode === 'cards' ? 'bg-[#d4a855] text-black' : 'text-[#aaaaaa] hover:text-white'}`}
                  title="Card view"
                >
                  <Grid size={20} />
                </button>
              </div>
            </div>

            {/* AP Toggle and Year Filter Row */}
            <div className="flex items-center gap-3">
              {/* AP Only Toggle */}
              <button
                onClick={() => setApOnly(!apOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  apOnly 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#161616] text-[#bbbbbb] border border-[#333]'
                }`}
              >
                <Target size={16} />
                AP Only ({apCount})
              </button>
              
              {/* Release Year Filter */}
              {releaseYears.length > 0 && (
                <select
                  value={releaseYearFilter}
                  onChange={(e) => setReleaseYearFilter(e.target.value)}
                  className="bg-[#161616] border border-[#333] rounded px-3 py-2 text-sm text-[#bbbbbb] focus:outline-none focus:border-[#d4a855]"
                >
                  <option value="all">All Years</option>
                  {releaseYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}

              {/* Help Button */}
              <button
                onClick={() => setShowTierHelp(true)}
                className="ml-auto p-2 text-[#aaa] hover:text-[#d4a855] transition-colors"
                title="What do tiers mean?"
              >
                <Info size={18} />
              </button>
            </div>

            {/* Category Filter - horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-[#d4a855] text-black' 
                    : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                }`}
              >
                All ({apOnly ? apCount : filteredMachines.length})
              </button>
              {Object.entries(machineCategories)
                .filter(([key]) => !apOnly || key !== 'entertainment')
                .map(([key, cat]) => {
                const count = filteredMachines.filter(m => m.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedCategory === key 
                        ? 'bg-[#d4a855] text-black' 
                        : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                    }`}
                  >
                    {cat.name.split(' ')[0]} ({count})
                  </button>
                );
              })}
            </div>

            {/* Recently Viewed (if any) */}
            {recentMachines.length > 0 && (
              <div>
                <p className="text-[#aaa] text-xs uppercase tracking-wider mb-2">Recently Viewed</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {recentMachines.map(machine => (
                    <button
                      key={machine.id}
                      onClick={() => selectMachine(machine)}
                      className="shrink-0 bg-[#161616] border border-[#333] rounded px-3 py-2 flex items-center gap-2 hover:border-[#d4a855] transition-colors"
                    >
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${tierColors[machine.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                        Tier {machine.tier}
                      </span>
                      <span className="text-white text-sm whitespace-nowrap">{machine.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#aaa]">
                {filteredMachines.length} machine{filteredMachines.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* No Results State */}
            {filteredMachines.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-[#444]" />
                </div>
                <p className="text-white font-medium mb-2">No machines found</p>
                <p className="text-[#aaa] text-sm mb-4">
                  {debouncedSearch 
                    ? `No results for "${debouncedSearch}"`
                    : 'Try adjusting your filters'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setApOnly(false);
                    setSelectedCategory('all');
                    setReleaseYearFilter('all');
                  }}
                  className="text-[#d4a855] text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Machine Grid (Card View) */}
            {machineViewMode === 'cards' && filteredMachines.length > 0 && (
              <div className="grid grid-cols-2 gap-3 -mx-4 px-4">
                {filteredMachines.map(machine => {
                  const latestPhoto = getLatestPhoto(machine.id);
                  return (
                    <button
                      key={machine.id}
                      onClick={() => selectMachine(machine)}
                      className={`bg-[#161616] border rounded overflow-hidden text-left transition-all active:scale-[0.98] ${
                        machine.tier === 1 ? 'border-emerald-500/40 hover:border-emerald-500' :
                        machine.tier === 2 ? 'border-amber-500/40 hover:border-amber-500' :
                        'border-red-500/40 hover:border-red-500'
                      }`}
                    >
                      {/* Image or Placeholder */}
                      <div className="aspect-[4/3] bg-[#0d0d0d] relative overflow-hidden">
                        {latestPhoto ? (
                          <img 
                            src={getPhotoUrl(latestPhoto)} 
                            alt={machine.shortName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#161616]">
                            <Gem size={28} className="text-[#333] mb-1" />
                            <span className="text-[#333] text-xs">No photo</span>
                          </div>
                        )}
                        {/* Gradient overlay - tall and gradual blend into card bg */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#161616] from-10% via-[#161616]/60 via-40% to-transparent" />
                        {/* Tier Badge - bottom left */}
                        <span className={`absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${tierColors[machine.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                          Tier {machine.tier}
                        </span>
                      </div>
                      {/* Card Content */}
                      <div className="px-3 pb-3 -mt-1">
                        <h3 className="font-semibold text-white text-base mb-1 line-clamp-1">{machine.shortName}</h3>
                        <p className="text-xs text-[#888] mb-1">{machine.manufacturer}</p>
                        <p className={`text-xs line-clamp-2 ${
                          machine.tier === 1 ? 'text-emerald-400' :
                          machine.tier === 2 ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {machine.thresholdSummary}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Machine List (List View) */}
            {machineViewMode === 'list' && filteredMachines.length > 0 && (
              <div className="space-y-2">
                {filteredMachines.map(machine => (
                  <button
                    key={machine.id}
                    onClick={() => selectMachine(machine)}
                    className={`w-full bg-[#161616] border rounded p-3 text-left transition-colors ${
                      machine.tier === 1 ? 'border-emerald-500/30 hover:border-emerald-500' :
                      machine.tier === 2 ? 'border-amber-500/30 hover:border-amber-500' :
                      'border-red-500/30 hover:border-red-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{machine.shortName}</h3>
                          <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${tierColors[machine.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                            Tier {machine.tier}
                          </span>
                        </div>
                        <p className="text-xs text-[#aaa] mb-1">{machine.manufacturer} • {machine.category?.replace(/-/g, ' ')}</p>
                        <p className={`text-xs truncate ${
                          machine.tier === 1 ? 'text-emerald-400' :
                          machine.tier === 2 ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {machine.thresholdSummary}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-[#aaa] shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Machine Detail (Hunt) - with context-aware calculator */}
        {activeTab === 'hunt' && selectedMachine && (
          <div className="space-y-4">
            {/* Back Button */}
            <button 
              onClick={() => {
                setSelectedMachine(null);
                setSearchQuery('');
                if (previousTab) {
                  setActiveTab(previousTab);
                  setPreviousTab(null);
                }
              }} 
              className="flex items-center gap-2 text-[#d4a855]"
            >
              <ChevronLeft size={20} /> Back
            </button>

            {/* Machine Header - More prominent */}
            <div className={`rounded p-4 ${
              selectedMachine.tier === 1 ? 'bg-gradient-to-br from-emerald-900/40 to-[#161616] border border-emerald-500/50' :
              selectedMachine.tier === 2 ? 'bg-gradient-to-br from-amber-900/40 to-[#161616] border border-amber-500/50' :
              'bg-gradient-to-br from-red-900/40 to-[#161616] border border-red-500/50'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-3 py-1 rounded border font-semibold ${tierColors[selectedMachine.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                  {selectedMachine.tier === 1 ? 'Tier 1 - Must Hit By' : 
                   selectedMachine.tier === 2 ? 'Tier 2 - Persistent State' : 
                   'Tier 3 - Entertainment'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{selectedMachine.shortName}</h2>
              <p className="text-[#aaa] text-sm mb-3">{selectedMachine.manufacturer} • {selectedMachine.releaseYear}</p>
              
              {/* Threshold - THE KEY INFO - Big and prominent */}
              <div className={`rounded p-3 ${
                selectedMachine.tier === 1 ? 'bg-emerald-950/50' :
                selectedMachine.tier === 2 ? 'bg-amber-950/50' :
                'bg-red-950/50'
              }`}>
                <p className="text-xs text-[#aaa] uppercase tracking-wider mb-1">Play When</p>
                <p className={`text-lg font-bold ${
                  selectedMachine.tier === 1 ? 'text-emerald-400' :
                  selectedMachine.tier === 2 ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {selectedMachine.thresholdSummary}
                </p>
              </div>
            </div>

            {/* Quick ID - How to spot it */}
            <div className="bg-[#161616] border border-[#333] rounded p-4">
              <p className="text-xs text-[#aaa] uppercase tracking-wider mb-2">Quick ID</p>
              <p className="text-white">{selectedMachine.quickId}</p>
            </div>

            {/* CONTEXT-AWARE: MHB Calculator (Only for Tier 1) */}
            {selectedMachine.tier === 1 && selectedMachine.category === 'must-hit-by' && (
              <div className="bg-[#161616] border border-emerald-500/30 rounded p-4">
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

            {/* CONTEXT-AWARE: Visual Tips (For Tier 2 with visual data) */}
            {selectedMachine.tier === 2 && selectedMachine.visual && (
              <div className="bg-[#161616] border border-amber-500/30 rounded p-4">
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
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold">No Advantage Play</p>
                    <p className="text-[#bbb] text-sm mt-1">This machine has no exploitable features. Play for entertainment only with money you can afford to lose.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Thresholds (if available) */}
            {selectedMachine.threshold && (selectedMachine.tier === 1 || selectedMachine.tier === 2) && (
              <div className="bg-[#161616] border border-[#333] rounded p-4">
                <p className="text-xs text-[#aaa] uppercase tracking-wider mb-3">Strategy Guide</p>
                <div className="space-y-2">
                  {selectedMachine.threshold.conservative && (
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <div>
                        <p className="text-emerald-400 text-sm font-medium">Conservative</p>
                        <p className="text-[#bbb] text-sm">{selectedMachine.threshold.conservative}</p>
                      </div>
                    </div>
                  )}
                  {selectedMachine.threshold.aggressive && (
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <div>
                        <p className="text-amber-400 text-sm font-medium">Aggressive</p>
                        <p className="text-[#bbb] text-sm">{selectedMachine.threshold.aggressive}</p>
                      </div>
                    </div>
                  )}
                  {selectedMachine.threshold.skip && (
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
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
              <button
                onClick={() => openSlotSpotter(selectedMachine.name)}
                className="bg-[#d4a855] hover:bg-[#c49745] text-black rounded p-3 flex items-center justify-center gap-2 font-semibold"
              >
                <MapPin size={18} />
                Spot It
              </button>
              <button
                onClick={() => document.getElementById('photo-input-hunt')?.click()}
                disabled={photoUploading}
                className={`rounded p-3 flex items-center justify-center gap-2 transition-colors ${
                  photoUploading 
                    ? 'bg-[#d4a855] text-black' 
                    : 'bg-[#161616] border border-[#333] hover:border-[#d4a855] text-white'
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
                id="photo-input-hunt"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddPhoto(selectedMachine.id, file);
                  e.target.value = ''; // Reset so same file can be selected again
                }}
              />
            </div>

            {/* Photos */}
            <div className="bg-[#161616] border border-[#333] rounded p-4">
              <p className="text-xs text-[#aaa] uppercase tracking-wider mb-3">Your Photos</p>
              {getMachinePhotos(selectedMachine.id).length === 0 ? (
                <div className="text-center py-4">
                  <Camera size={24} className="mx-auto text-[#444] mb-2" />
                  <p className="text-[#aaa] text-sm">No photos yet</p>
                  <p className="text-[#555] text-xs mt-1">Tap "Add Photo" to capture this machine</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {getMachinePhotos(selectedMachine.id).map(photo => (
                    <button
                      key={photo.id}
                      onClick={() => setViewingPhoto(photo)}
                      className="aspect-square rounded overflow-hidden bg-[#0d0d0d]"
                    >
                      <img src={getPhotoUrl(photo)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes tab removed - consolidated into Trip tab */}

        {/* TRIP TAB */}
        {activeTab === 'trip' && !selectedCasino && (
          <div className="space-y-4">
            {/* Sub-tab navigation */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'casinos', label: 'Casinos', icon: Building2 },
                { id: 'notes', label: 'Notes', icon: StickyNote }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setTripSubTab(sub.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all whitespace-nowrap ${
                    tripSubTab === sub.id
                      ? 'bg-[#d4a855] text-black'
                      : 'bg-[#1a1a1a] text-[#aaa] border border-[#333]'
                  }`}
                >
                  <sub.icon size={16} />
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Overview Sub-tab */}
            {tripSubTab === 'overview' && (
              <>
                {/* DEMO DATA - Remove after testing */}
                {(() => {
                  // Fake data for demo purposes - shows when no real notes exist
                  const demoNotes = notes.length === 0 ? [
                    { id: 'demo1', machine: 'Ocean Magic Grand', content: '4 bubbles in rows 1-2, near high limit', casino: 'Flamingo', created_at: new Date().toISOString() },
                    { id: 'demo2', machine: 'Piggy Bankin\'', content: 'Both pigs fat by sports book', casino: 'LINQ', created_at: new Date().toISOString() },
                    { id: 'demo3', machine: 'Wheel of Fortune MHB', content: 'Major at $485/$500 (97%)', casino: 'Caesars Palace', created_at: new Date(Date.now() - 3600000).toISOString() },
                    { id: 'demo4', machine: 'Lucky Wealth Cat', content: '6 orbs stacked low', casino: 'Paris', created_at: new Date(Date.now() - 86400000).toISOString() },
                    { id: 'demo5', machine: 'Buffalo Gold', content: 'Just for fun, hit bonus', casino: 'Harrahs', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
                  ] : notes;
                  const demoMembers = tripMembers.length <= 1 ? [
                    { user_id: 'demo1', display_name: 'You', role: 'owner' },
                    { user_id: 'demo2', display_name: 'Mike', role: 'member' },
                    { user_id: 'demo3', display_name: 'Sarah', role: 'member' },
                  ] : tripMembers;
                  const isDemo = notes.length === 0;
                  
                  return (
                    <>
                      {isDemo && (
                        <div className="bg-amber-900/20 border border-amber-500/30 rounded p-3 text-center">
                          <p className="text-amber-400 text-sm">Demo Mode - Showing sample data</p>
                        </div>
                      )}
                      
                      {/* Current Trip Info */}
                      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#161616] border border-[#333] rounded p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[#aaa] text-xs uppercase tracking-wider mb-1">Current Trip</p>
                            <h2 className="text-xl font-bold text-white">{currentTrip?.name || 'Vegas January 2025'}</h2>
                          </div>
                          {(currentTrip?.share_code || isDemo) && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(currentTrip?.share_code || 'DEMO123');
                              }}
                              className="flex items-center gap-1.5 bg-[#2a2a2a] px-3 py-1.5 rounded text-[#d4a855] text-sm hover:bg-[#333] transition-colors"
                              title="Copy share code"
                            >
                              <Copy size={14} />
                              {currentTrip?.share_code || 'DEMO123'}
                            </button>
                          )}
                        </div>
                        
                        {/* Trip Stats */}
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#333]">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{demoMembers.length}</p>
                            <p className="text-[#aaa] text-xs">Members</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-[#d4a855]">{demoNotes.length}</p>
                            <p className="text-[#aaa] text-xs">Notes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">
                              {demoNotes.filter(n => {
                                const noteDate = new Date(n.created_at).toDateString();
                                const today = new Date().toDateString();
                                return noteDate === today;
                              }).length}
                            </p>
                            <p className="text-[#aaa] text-xs">Today</p>
                          </div>
                        </div>
                      </div>

                      {/* Hot Opportunities - AP notes from today (slots & VP) */}
                      {(() => {
                        // Get today's slot notes for T1/T2 machines
                        const todaySlotNotes = demoNotes.filter(n => {
                          const noteDate = new Date(n.created_at).toDateString();
                          const today = new Date().toDateString();
                          if (noteDate !== today) return false;
                          if (n.type === 'vp' || n.machine?.startsWith('VP:')) return false;
                          const noteMachine = machines.find(m => m?.name === n.machine || m?.shortName === n.machine);
                          return noteMachine && (noteMachine.tier === 1 || noteMachine.tier === 2);
                        });
                        
                        // Get today's VP notes with good returns (>99%)
                        const todayVPNotes = demoNotes.filter(n => {
                          const noteDate = new Date(n.created_at).toDateString();
                          const today = new Date().toDateString();
                          if (noteDate !== today) return false;
                          return (n.type === 'vp' || n.machine?.startsWith('VP:')) && n.vpReturn >= 99;
                        });
                        
                        // Also check recent activity for today's VP spots
                        const todayVPActivity = recentActivity.filter(a => {
                          const actDate = new Date(a.timestamp).toDateString();
                          const today = new Date().toDateString();
                          return actDate === today && a.type === 'vp' && a.vpReturn >= 99;
                        });
                        
                        const allHotItems = [
                          ...todaySlotNotes.map(n => ({ ...n, itemType: 'slot' })),
                          ...todayVPNotes.map(n => ({ ...n, itemType: 'vp' })),
                          ...todayVPActivity.map(a => ({ ...a, itemType: 'vp-activity' })),
                        ];
                        
                        if (allHotItems.length === 0) return null;
                        
                        return (
                          <div className="bg-gradient-to-br from-amber-900/20 to-[#161616] border border-amber-500/30 rounded p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Target size={16} className="text-amber-400" />
                              <p className="text-amber-400 text-sm font-semibold">Hot Opportunities Today</p>
                            </div>
                            <div className="space-y-2">
                              {allHotItems.slice(0, 4).map((item, idx) => {
                                const isVP = item.itemType === 'vp' || item.itemType === 'vp-activity';
                                const noteMachine = !isVP ? machines.find(m => m?.name === item.machine || m?.shortName === item.machine) : null;
                                const title = isVP ? (item.vpGameName || item.machine?.replace('VP: ', '')) : item.machine;
                                const subtitle = isVP ? `${item.vpPayTable} • ${item.vpReturn}%` : null;
                                
                                return (
                                  <button
                                    key={`hot-${item.itemType}-${item.id || idx}`}
                                    onClick={() => {
                                      if (!isVP && noteMachine) {
                                        selectMachine(noteMachine);
                                        setActiveTab('hunt');
                                      } else if (isVP) {
                                        setActiveTab('vp');
                                      }
                                    }}
                                    className="w-full bg-[#0d0d0d] rounded p-3 text-left hover:bg-[#1a1a1a] transition-colors"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-[#d4a855] text-black'}`}>
                                          {isVP ? 'VP' : 'SLOT'}
                                        </span>
                                        {!isVP && noteMachine && (
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${tierColors[noteMachine?.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                                            Tier {noteMachine?.tier}
                                          </span>
                                        )}
                                        {isVP && (
                                          <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                                            {item.vpReturn}%
                                          </span>
                                        )}
                                        <span className="text-white text-sm font-medium">{title}</span>
                                      </div>
                                      <ChevronRight size={14} className="text-[#aaa]" />
                                    </div>
                                    {subtitle && <p className="text-[#d4a855] text-xs">{subtitle}</p>}
                                    {!isVP && item.content && <p className="text-[#aaa] text-xs truncate">{item.content}</p>}
                                    {item.casino && (
                                      <p className="text-amber-400/70 text-xs mt-1">@ {item.casino}</p>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Team Locations - Show where everyone is */}
                      {demoMembers.length > 1 && (
                        <div className="bg-[#161616] border border-[#333] rounded p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-[#aaa] text-xs uppercase tracking-wider">Team Locations</p>
                            <span className="text-[#aaa] text-xs">{demoMembers.length} members</span>
                          </div>
                          <div className="space-y-2">
                            {demoMembers.map((member, idx) => {
                              const memberCasino = isDemo 
                                ? (idx === 1 ? vegasCasinos.find(c => c.name === 'Flamingo') : idx === 2 ? vegasCasinos.find(c => c.name === 'LINQ') : null)
                                : vegasCasinos.find(c => getMembersAtCasino(c.id).some(m => m.user_id === member.user_id));
                              const isYou = isDemo ? idx === 0 : member.user_id === user?.id;
                              return (
                                <div key={member.user_id || `demo-member-${idx}`} className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                    isYou ? 'bg-[#d4a855]' : 'bg-[#333]'
                                  }`}>
                                    {member.display_name?.[0]?.toUpperCase() || '?'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">
                                      {member.display_name || 'Unknown'}
                                      {isYou && <span className="text-[#aaa] font-normal"> (you)</span>}
                                    </p>
                                  </div>
                                  {memberCasino ? (
                                    <span className="text-emerald-400 text-xs bg-emerald-400/10 px-2 py-1 rounded-full">
                                      {memberCasino.name}
                                    </span>
                                  ) : (
                                    <span className="text-[#aaa] text-xs">Not checked in</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Recent Activity - Notes with more context */}
                      <div className="bg-[#161616] border border-[#333] rounded p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[#aaa] text-xs uppercase tracking-wider">Recent Activity</p>
                          <button onClick={() => setTripSubTab('notes')} className="text-[#d4a855] text-xs">View All</button>
                        </div>
                        {demoNotes.length === 0 && recentActivity.length === 0 ? (
                          <div className="text-center py-4">
                            <StickyNote size={24} className="mx-auto text-[#444] mb-2" />
                            <p className="text-[#aaa] text-sm">No activity yet</p>
                            <p className="text-[#555] text-xs mt-1">Spot machines or VP pay tables to track them</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Show recent activity first (session-based), then notes */}
                            {recentActivity.slice(0, 3).map(activity => {
                              const isVP = activity.type === 'vp';
                              const title = isVP ? activity.vpGameName : activity.machine;
                              const subtitle = isVP ? `${activity.vpPayTable} • ${activity.vpReturn}%` : activity.state;
                              
                              return (
                                <div key={`activity-${activity.id}`} className="bg-[#0d0d0d] rounded p-3">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-[#d4a855] text-black'}`}>
                                        {isVP ? 'VP' : 'SLOT'}
                                      </span>
                                      <div>
                                        <p className="text-white text-sm font-medium">{title}</p>
                                        {subtitle && <p className="text-[#d4a855] text-xs">{subtitle}</p>}
                                      </div>
                                    </div>
                                    <span className="text-[#aaa] text-xs whitespace-nowrap">
                                      {formatRelativeTime(activity.timestamp)}
                                    </span>
                                  </div>
                                  {activity.casino && (
                                    <p className="text-[#aaa] text-xs mt-1 flex items-center gap-1">
                                      <MapPin size={10} /> {activity.casino}
                                      {activity.location && ` • ${activity.location}`}
                                    </p>
                                  )}
                                  {activity.playable && (
                                    <span className="inline-block mt-2 text-emerald-400 text-xs font-semibold bg-emerald-400/20 px-2 py-0.5 rounded-full">
                                      PLAYABLE
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                            {/* If no recent activity, show notes */}
                            {recentActivity.length === 0 && demoNotes.slice(0, 3).map(note => {
                              const isVP = note.type === 'vp' || note.machine?.startsWith('VP:');
                              const noteMachine = !isVP ? machines.find(m => m?.name === note.machine || m?.shortName === note.machine) : null;
                              
                              return (
                                <div key={`note-${note.id}`} className="bg-[#0d0d0d] rounded p-3">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-[#d4a855] text-black'}`}>
                                        {isVP ? 'VP' : 'SLOT'}
                                      </span>
                                      {!isVP && noteMachine && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${tierColors[noteMachine.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                                          Tier {noteMachine.tier}
                                        </span>
                                      )}
                                      <p className="text-white text-sm font-medium">{note.machine}</p>
                                    </div>
                                    <span className="text-[#aaa] text-xs whitespace-nowrap">
                                      {new Date(note.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-[#bbb] text-sm">{note.content || note.state}</p>
                                  {note.casino && (
                                    <p className="text-[#aaa] text-xs mt-1 flex items-center gap-1">
                                      <MapPin size={10} /> {note.casino}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </>
            )}

            {/* Casinos Sub-tab */}
            {tripSubTab === 'casinos' && (
              <>
                {/* Quick Check-in */}
                {!myCheckIn && (
                  <button
                    onClick={detectCasino}
                    disabled={geoStatus === 'loading'}
                    className="w-full bg-[#d4a855]/20 border border-[#d4a855] text-[#d4a855] py-3 rounded flex items-center justify-center gap-2"
                  >
                    {geoStatus === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <Navigation size={18} />}
                    {geoStatus === 'loading' ? 'Detecting...' : 'Detect My Location'}
                  </button>
                )}
                
                {/* Search */}
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                  <input
                    type="text"
                    placeholder="Search casinos..."
                    value={casinoSearch}
                    onChange={(e) => setCasinoSearch(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded pl-10 pr-10 py-3 text-white placeholder-[#666] focus:border-[#d4a855] focus:outline-none"
                  />
                  {casinoSearch && (
                    <button 
                      onClick={() => setCasinoSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                
                {/* Area Filter - horizontal scroll */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  <button
                    onClick={() => setCasinoAreaFilter('all')}
                    className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      casinoAreaFilter === 'all' ? 'bg-[#d4a855] text-black' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {[...new Set(vegasCasinos.map(c => c.area))].map(area => (
                    <button
                      key={area}
                      onClick={() => setCasinoAreaFilter(area)}
                      className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        casinoAreaFilter === area ? 'bg-[#d4a855] text-black' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>

                {(() => {
                  const filteredCasinos = vegasCasinos.filter(casino => {
                    const matchesSearch = !casinoSearch || 
                      casino.name.toLowerCase().includes(casinoSearch.toLowerCase()) ||
                      casino.owner.toLowerCase().includes(casinoSearch.toLowerCase());
                    const matchesArea = casinoAreaFilter === 'all' || casino.area === casinoAreaFilter;
                    return matchesSearch && matchesArea;
                  });
                  
                  return (
                    <>
                      <p className="text-[#888] text-sm">{filteredCasinos.length} casinos</p>
                      <div className="space-y-2">
                        {filteredCasinos.map(casino => {
                          const membersHere = getMembersAtCasino(casino.id);
                          const isMyLocation = myCheckIn?.casino_id === casino.id;
                          return (
                            <button
                              key={casino.id}
                              onClick={() => setSelectedCasino(casino)}
                              className={`w-full bg-[#161616] border rounded p-4 text-left ${isMyLocation ? 'border-emerald-500' : 'border-[#333]'}`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white">{casino.name}</h3>
                                    {isMyLocation && <span className="text-emerald-400 text-xs bg-emerald-400/20 px-2 py-0.5 rounded-full">You're here</span>}
                                  </div>
                                  <p className="text-sm text-[#aaa]">{casino.owner} • {casino.size} • {casino.slots} slots</p>
                                </div>
                                <div className="text-right">
                                  {membersHere.length > 0 && (
                                    <div className="flex items-center gap-1 text-[#d4a855] text-sm">
                                      <Users size={14} /> {membersHere.length}
                                    </div>
                                  )}
                                  <p className="text-[#888] text-xs">{casino.area}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                        {filteredCasinos.length === 0 && (
                          <div className="bg-[#0d0d0d] border border-dashed border-[#333] rounded p-6 text-center">
                            <p className="text-[#888]">No casinos match your search</p>
                            <button 
                              onClick={() => { setCasinoSearch(''); setCasinoAreaFilter('all'); }}
                              className="text-[#d4a855] text-sm mt-2 hover:underline"
                            >
                              Clear filters
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </>
            )}

            {/* Notes Sub-tab */}
            {tripSubTab === 'notes' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Scouting Notes</h2>
                  <div className="flex items-center gap-2">
                    <button onClick={refreshNotes} className="p-2 text-[#bbbbbb] hover:text-white">
                      <RefreshCw size={18} />
                    </button>
                    <button onClick={() => setShowNoteForm(true)} className="bg-[#d4a855] hover:bg-[#a67c3d] text-white px-4 py-2 rounded text-sm font-semibold">
                      + Add
                    </button>
                  </div>
                </div>

                {showNoteForm && (
                  <NoteForm
                    onSubmit={handleAddNote}
                    onCancel={() => { setShowNoteForm(false); setPrefillMachine(null); }}
                    prefillMachine={prefillMachine}
                    currentCasino={currentCasinoInfo?.name}
                  />
                )}

                {notesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#d4a855] animate-spin" />
                  </div>
                ) : filteredNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                      <StickyNote size={28} className="text-[#444]" />
                    </div>
                    <p className="text-white font-medium mb-2">No scouting notes yet</p>
                    <p className="text-[#aaa] text-sm mb-4 max-w-xs mx-auto">
                      Spot a good machine? Add a note to remember it or share with your team.
                    </p>
                    <button
                      onClick={() => setShowNoteForm(true)}
                      className="bg-[#d4a855] hover:bg-[#c49745] text-black font-semibold px-4 py-2 rounded text-sm inline-flex items-center gap-2"
                    >
                      <StickyNote size={16} />
                      Add Your First Note
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotes.map(note => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={setEditingNote}
                        onDelete={setConfirmDelete}
                        isOwn={note.user_id === user?.id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Casino Detail */}
        {activeTab === 'trip' && selectedCasino && (
          <div className="space-y-4">
            <button onClick={() => setSelectedCasino(null)} className="flex items-center gap-2 text-[#d4a855]">
              <ChevronLeft size={20} /> Back
            </button>
            
            <div className="bg-[#161616] border border-[#333] rounded p-4">
              <h2 className="text-xl font-bold text-white mb-1">{selectedCasino.name}</h2>
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
                <button
                  onClick={() => handleCheckIn(selectedCasino)}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded font-semibold"
                >
                  Check In Here
                </button>
              )}
            </div>

            {selectedCasino.apNotes && (
              <div className="bg-amber-900/30 border border-amber-500/30 rounded p-4">
                <p className="text-amber-200 text-sm">{selectedCasino.apNotes}</p>
              </div>
            )}

            {/* Members at this casino */}
            {(() => {
              const membersHere = getMembersAtCasino(selectedCasino.id);
              if (membersHere.length === 0) return null;
              return (
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
              );
            })()}

            {/* Notes for this casino */}
            {(() => {
              const casinoNotes = notes.filter(n => n.casino === selectedCasino.name);
              if (casinoNotes.length === 0) return null;
              return (
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
              );
            })()}
          </div>
        )}

        {/* VIDEO POKER TAB */}
        {activeTab === 'vp' && (
          <VideoPokerTab onSpot={openVPSpotter} />
        )}

        {/* BLOODIES TAB */}
        {activeTab === 'bloodies' && (
          <BloodiesTab />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-[#333] px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          {[
            { id: 'hunt', icon: Gem, label: 'Slots' },
            { id: 'vp', icon: Spade, label: 'Video Poker' },
            { id: 'bloodies', icon: null, label: 'Bloodies', emoji: '🍅' },
            { id: 'trip', icon: Map, label: 'Trip' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedMachine(null); setSelectedCasino(null); }}
              className={`flex flex-col items-center py-2 px-3 ${activeTab === tab.id ? 'text-[#d4a855]' : 'text-[#aaaaaa]'}`}
            >
              {tab.emoji ? (
                <span className="text-xl">{tab.emoji}</span>
              ) : (
                <tab.icon size={22} />
              )}
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ============================================
// ROOT APP WITH PROVIDERS
// ============================================
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="text-white">Hit</span>
            <span style={{ color: '#d4a855' }}>Seeker</span>
          </h1>
          <Loader2 className="w-8 h-8 text-[#d4a855] animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <TripProvider>
      <TripContent />
    </TripProvider>
  );
}

function TripContent() {
  const { currentTrip, loading: tripLoading } = useTrip();

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#d4a855] animate-spin" />
      </div>
    );
  }

  if (!currentTrip) {
    return <TripSelectionScreen />;
  }

  return <MainApp />;
}
