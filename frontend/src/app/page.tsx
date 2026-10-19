export default function HomePage() {
  const features = [
    {
      icon: '01',
      title: 'Monetize your community',
      text: 'Creators set one clear monthly subscription and deliver exclusive access that fans can unlock instantly.',
    },
    {
      icon: '02',
      title: 'M-Pesa friendly',
      text: 'Built for Kenya and East Africa with smooth local payments and simple subscription flows.',
    },
    {
      icon: '03',
      title: 'Private content access',
      text: 'Public previews stay visible, while gated media is protected behind signed URLs and active membership.',
    },
  ];

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Built for creators</span>
            <h1>Turn your audience into a paying community.</h1>
            <p>
              Fanhaven helps creators in Kenya and East Africa grow memberships, sell premium media,
              and deepen their fan relationships with a simple, creator-first platform.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="/signup">Start as creator</a>
              <a className="secondary-button" href="/feed">Explore creators</a>
            </div>
          </div>

          <div className="hero-card creator-preview">
            <div className="preview-top" />
            <div className="preview-body">
              <div className="avatar-row">
                <div className="avatar-stack">
                  <div className="avatar">N</div>
                  <div className="name-tag">
                    <strong>Nia B.</strong>
                    <span>@niabcreative</span>
                  </div>
                </div>
                <span className="pill">Live now</span>
              </div>

              <div className="preview-stats">
                <div className="stat-box">
                  <small>Members</small>
                  <strong>2.4k</strong>
                </div>
                <div className="stat-box">
                  <small>Revenue</small>
                  <strong>KES 248k</strong>
                </div>
                <div className="stat-box">
                  <small>Response</small>
                  <strong>96%</strong>
                </div>
              </div>

              <div className="preview-footer">
                <div>
                  <div style={{ color: '#726b67', fontSize: 12, fontWeight: 700 }}>Monthly plan</div>
                  <div className="price">KES 1,500</div>
                </div>
                <a className="primary-button" href="/feed">Join now</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Everything creators need to grow.</h2>
          <p>Simple tools, premium experiences, and local payments.</p>
        </div>

        <div className="cards-grid">
          {features.map((feature) => (
            <article key={feature.icon} className="feature-card">
              <div className="icon-badge">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
