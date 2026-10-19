'use client';

import { FormEvent, useState } from 'react';

export default function UploadPage() {
  const [title, setTitle] = useState('Exclusive behind-the-scenes reel');
  const [kind, setKind] = useState<'image' | 'video'>('video');
  const [visibility, setVisibility] = useState<'public' | 'paid'>('paid');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log({ title, kind, visibility });
  };

  return (
    <main className="page-shell" style={{ padding: '48px 0 80px' }}>
      <div className="page-panel">
        <div style={{ marginBottom: 24 }}>
          <span className="eyebrow">Content</span>
          <h1 style={{ margin: '12px 0 0', fontSize: 'clamp(2rem, 3vw, 3rem)', letterSpacing: '-0.06em' }}>Upload media</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="kind">Content type</label>
            <select id="kind" className="select" value={kind} onChange={(e) => setKind(e.target.value as 'image' | 'video')}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="visibility">Visibility</label>
            <select id="visibility" className="select" value={visibility} onChange={(e) => setVisibility(e.target.value as 'public' | 'paid')}>
              <option value="public">Public preview</option>
              <option value="paid">Members only</option>
            </select>
          </div>

          <div className="form-actions">
            <span style={{ color: '#6f6a67' }}>Signed URLs keep paid media from being guessable.</span>
            <button className="primary-button" type="submit">Generate upload link</button>
          </div>
        </form>
      </div>
    </main>
  );
}
