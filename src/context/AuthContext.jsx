// Auth Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Check if running in Capacitor (native app)
const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

// Handle deep link auth callback for native apps
async function handleDeepLink(url) {
  if (!url || !url.includes('auth/callback')) return;

  // Extract tokens from URL hash or query params
  const urlObj = new URL(url);
  const hashParams = new URLSearchParams(urlObj.hash.substring(1));
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    if (error) console.error('Error setting session from deep link:', error);
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    // Timeout after 10 seconds to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth check timed out');
        setAuthTimeout(true);
        setLoading(false);
      }
    }, 10000);

    // Set up deep link listener for native apps
    let appUrlListener = null;
    if (isNative) {
      import('@capacitor/app').then(({ App }) => {
        App.addListener('appUrlOpen', ({ url }) => {
          handleDeepLink(url);
        });
        appUrlListener = App;
      });
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Auth session error:', err);
      setLoading(false);
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

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
      if (appUrlListener) {
        appUrlListener.removeAllListeners();
      }
    };
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
    // For native apps, use deep link redirect and open in system browser
    // For web, use the current origin
    const redirectTo = isNative
      ? 'hitseeker://auth/callback'
      : window.location.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: isNative
      }
    });

    if (error) {
      console.error('Error signing in:', error);
      return;
    }

    // For native apps, open the OAuth URL in the system browser
    if (isNative && data?.url) {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url: data.url });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, authTimeout, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
