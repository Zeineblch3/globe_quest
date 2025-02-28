// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supbase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (!session) {
        router.replace('/login');
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          router.replace('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  if (!session) {
    return <p>Loading...</p>; // Or a loading spinner
  }

  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>You are logged in as {session.user.email}.</p>
      {/* Your main application content here */}
    </div>
  );
}