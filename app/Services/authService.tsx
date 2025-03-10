
import { supabase } from '@/lib/supbase';
import { Session, User } from '@supabase/supabase-js';

export const getSession = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? session.user : null;
};

export const subscribeToAuthStateChanges = (callback: (session: Session | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  
  return { subscription };
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

// Login via email/password
export const loginWithEmail = async (email: string, password: string): Promise<string | null> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return null; // Successful login
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message || 'An unexpected error occurred.';
    } else {
      return 'An unexpected error occurred.';
    }
  }
};

// Login via Google OAuth
export const loginWithGoogle = async (): Promise<string | null> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw new Error(error.message);
    return null; // Successful login
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message || 'An unexpected error occurred.';
    } else {
      return 'An unexpected error occurred.';
    }
  }
};

// Reset password
export const resetPassword = async (resetEmail: string): Promise<string | null> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `http://localhost:3000/reset-password`,
    });
    if (error) throw new Error(error.message);
    return 'Password reset link sent! Check your email.'; // Success message
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message || 'An unexpected error occurred.';
    } else {
      return 'An unexpected error occurred.';
    }
  }
};
