'use client';

import { FormEvent, useState } from 'react';

export default function CreatorProfilePage() {
  const [username, setUsername] = useState('niabcreative');
  const [monthlyPrice, setMonthlyPrice] = useState('1500');
  const [bio, setBio] = useState('Lifestyle, behind-the-scenes content, and rituals from my everyday creative life in Nairobi.');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log({ username, monthlyPrice, bio });
  };

  return (
    <main className="page-shell" style={{ padding: '48px 0 80px' }}>
      <div className="page-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <span className="eyebrow">Creator profile</span>
            <h1 style={{ margin: '12px 0 0', fontSize: 'clamp(2rem, 3vw, 3rem)', letterSpacing: '-0.06em' }}>Build your page</h1>
          </div>
          <button className="primary-button" type="button">Publish changes</button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="price">Monthly subscription price (KES)</label>
            <input id="price" className="input" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" className="textarea" rows={5} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div className="form-actions">
            <span style={{ color: '#6f6a67' }}>Fans will see public previews and your membership plan.</span>
            <button className="primary-button" type="submit">Save profile</button>
          </div>
        </form>
      </div>
    </main>
  );
}
