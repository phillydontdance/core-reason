'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await apiFetch<{ token: string; user: { id: string; role: 'creator' | 'fan'; name: string; email: string } }>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('fanhaven_token', result.token);
      localStorage.setItem('fanhaven_user', JSON.stringify(result.user));

      if (result.user.role === 'creator') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/feed';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h1>Sign in</h1>
        <p className="auth-subtitle">Manage your creator page or your memberships.</p>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {error && <div style={{ color: '#b11a1a', fontWeight: 600 }}>{error}</div>}

          <div className="form-actions">
            <Link className="linkish" href="/signup">Create account</Link>
            <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
