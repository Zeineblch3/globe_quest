
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
