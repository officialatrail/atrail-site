import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);
const ADMIN_EMAIL = 'officialatrail@gmail.com';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signUp = async (email, password, metadata = {}) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
    return error ? error.message : null;
  };

  const sendPasswordReset = async (email) => {
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return error ? error.message : null;
  };

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return error ? error.message : null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isAuthenticated = !!session;
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, loading, login, signUp, sendPasswordReset, updatePassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
