'use client';

import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
}

// Check of gebruiker is ingelogd als admin
export async function getAdminSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return null;
  }

  // Check of gebruiker admin rechten heeft (je kunt dit later uitbreiden met een role check)
  return {
    user: {
      id: session.user.id,
      email: session.user.email || '',
    } as AdminUser,
    session,
  };
}

// Login functie voor admin
export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

// Logout functie
export async function adminLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

// Check of gebruiker admin is (server-side)
export async function isAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}
