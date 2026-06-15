'use client';

import { useState } from 'react';
import { insforge } from '../lib/insforge';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        const { data, error } = await insforge.auth.signUp({
          email,
          password,
          name: name || undefined,
        });
        if (error) throw error;
        setSuccess('Account created! Please check your email for the 6-digit verification code.');
        setMode('verify');
      } else {
        const { data, error } = await insforge.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          // If the error indicates email verification is required, switch to verify mode
          if (error.message.toLowerCase().includes('verification required') || error.message.toLowerCase().includes('verify')) {
            setSuccess('Please enter the 6-digit verification code sent to your email.');
            setMode('verify');
            return;
          }
          throw error;
        }
        // On success, page.js will detect the session and show Dashboard
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    try {
      const { error } = await insforge.auth.resendVerificationEmail({ email });
      if (error) throw error;
      setSuccess('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await insforge.auth.verifyEmail({
        email,
        otp
      });
      if (error) throw error;
      
      // After verification, we should sign them in automatically or reload.
      setSuccess('Email verified successfully! Logging you in...');
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setOauthLoading(true);
    setError('');
    try {
      const { error } = await insforge.auth.signInWithOAuth('google', {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      setOauthLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '480px', width: '100%' }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 1rem', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
            🎓
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>CGPA Calculator</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Premium University GPA Management
          </p>
        </div>

        {/* Tabs - Only show if not verifying */}
        {mode !== 'verify' && (
          <div className="auth-tabs" style={{ display: 'flex', marginBottom: '2rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
              className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
              style={{
                flex: 1, padding: '0.75rem', border: 'none', cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                background: mode === 'signin' ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'transparent',
                color: mode === 'signin' ? 'white' : 'var(--text-secondary)',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              style={{
                flex: 1, padding: '0.75rem', border: 'none', cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                background: mode === 'signup' ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'transparent',
                color: mode === 'signup' ? 'white' : 'var(--text-secondary)',
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '0.875rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            {success}
          </div>
        )}

        {/* Form Container */}
        {mode === 'verify' ? (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.5rem', textAlign: 'center' }}>
              We've sent a 6-digit code to <strong>{email}</strong>. Please enter it below to verify your account.
            </p>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <KeyRound size={14} /> Verification Code
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem', fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || otp.length < 6}
              style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Verify Email'}
            </button>
            
            <button
              type="button"
              className="btn"
              onClick={handleResendOtp}
              disabled={loading}
              style={{ width: '100%', padding: '0.875rem', fontSize: '0.9rem', background: 'transparent', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }}
            >
              Resend Code
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
              style={{ width: '100%', padding: '0.875rem', fontSize: '0.9rem', background: 'transparent', color: 'var(--text-secondary)' }}
            >
              <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'signup' && (
              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} /> Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={14} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? (
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
              ) : mode === 'signin' ? (
                <><LogIn size={18} /> Sign In</>
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        {mode !== 'verify' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            </div>

            {/* Google OAuth */}
            <button
              className="btn btn-secondary"
              onClick={handleGoogleSignIn}
              disabled={oauthLoading}
              style={{ width: '100%', padding: '0.875rem', fontSize: '0.95rem' }}
            >
              {oauthLoading ? (
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </>
              )}
            </button>
          </>
        )}

        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
          Your data is securely stored and encrypted in the cloud.
        </p>
      </div>
    </div>
  );
}
