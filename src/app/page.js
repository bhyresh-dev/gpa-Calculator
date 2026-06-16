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
    insforge.auth.getCurrentUser().then(({ data, error }) => {
      if (data && data.user) {
        setSession({ user: data.user });
      }
      setLoading(false);
    }).catch((err) => {
      console.error("Auth session error:", err);
      setLoading(false);
    });

  }, []);

  if (loading) {
    return <LoadingMiniGame />;
  }

  if (!session || !session.user) {
    return <Login />;
  }

  return <Dashboard user={session.user} />;
}
