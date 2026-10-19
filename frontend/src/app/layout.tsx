import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Fanhaven',
  description: 'Creator monetization platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">
              <div className="brand-mark">F</div>
              <span>Fanhaven</span>
            </div>
            <nav className="nav">
              <a href="/">Home</a>
              <a href="/feed">Explore</a>
              <a href="/creator-profile">Creator</a>
              <a href="/dashboard">Dashboard</a>
            </nav>
            <div style={{ display: 'flex', gap: 10 }}>
              <a className="ghost-button" href="/signin">Sign in</a>
              <a className="primary-button" href="/signup">Create account</a>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
