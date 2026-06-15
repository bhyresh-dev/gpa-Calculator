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
    insforge.auth.getSession().then(({ data, error }) => {
      if (data && data.session) {
        setSession(data.session);
      }
      setLoading(false);
    }).catch((err) => {
      console.error("Auth session error:", err);
      setLoading(false);
    });

    // 2. Listen for auth changes (login/logout events)
    const { data } = insforge.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      if (data && data.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <LoadingMiniGame />;
  }

  if (!session) {
    return <Login />;
  }

  return <Dashboard user={session.user} />;
}
