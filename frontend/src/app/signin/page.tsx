'use client';

import { FormEvent, useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log({ email, password });
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

          <div className="form-actions">
            <a className="linkish" href="/signup">Create account</a>
            <button className="primary-button" type="submit">Sign in</button>
          </div>
        </form>
      </div>
    </main>
  );
}
