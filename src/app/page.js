'use client';

import { useEffect, useState } from 'react';
import { insforge } from '../lib/insforge';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import LoadingMiniGame from '../components/LoadingMiniGame';

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session from local storage (Instantly)
    insforge.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // Add a slight artificial delay ONLY if there's no session to avoid flashing
      // or to let the user play the game for a second if they want, but here we just
      // clear loading immediately so it's blazing fast.
      setLoading(false);
    });

    // 2. Listen for auth changes (login/logout events)
    const { data: { subscription } } = insforge.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <LoadingMiniGame />;
  }

  if (!session) {
    return <Login />;
  }

  return <Dashboard user={session.user} />;
}
