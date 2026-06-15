'use client';

import { useEffect, useState } from 'react';
import { insforge } from '../lib/insforge';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data, error }) => {
      if (data?.user) {
        setSession({ user: data.user });
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return <Dashboard user={session.user} />;
}
