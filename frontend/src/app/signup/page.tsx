'use client';

import { FormEvent, useState } from 'react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'creator' | 'fan'>('fan');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log({ name, email, password, role });
  };

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <span className="eyebrow">Join Fanhaven</span>
        <h1>Create account</h1>
        <p className="auth-subtitle">Start building your community or support the creators you love.</p>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div className="field">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div className="field">
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a strong password" />
          </div>

          <div className="field">
            <label htmlFor="role">I am joining as</label>
            <select id="role" className="select" value={role} onChange={(e) => setRole(e.target.value as 'creator' | 'fan')}>
              <option value="fan">Fan</option>
              <option value="creator">Creator</option>
            </select>
          </div>

          <div className="form-actions">
            <a className="linkish" href="/signin">Already have an account?</a>
            <button className="primary-button" type="submit">Create account</button>
          </div>
        </form>
      </div>
    </main>
  );
}
