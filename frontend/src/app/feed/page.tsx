'use client';

import { useState } from 'react';

const demoFeed = [
	{ id: '1', creator: 'Nia B.', title: 'Studio Day: live behind-the-scenes', kind: 'video', isPaid: true },
	{ id: '2', creator: 'Mali K.', title: 'Travel reel preview', kind: 'image', isPaid: false },
	{ id: '3', creator: 'Kairo', title: 'Subscriber Q&A', kind: 'video', isPaid: true },
];

export default function FeedPage() {
	const [selected, setSelected] = useState<string | null>('1');

	return (
		<main className="page-shell" style={{ padding: '48px 0 80px' }}>
			<div className="page-panel">
				<div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'end', flexWrap: 'wrap' }}>
					<div>
						<span className="eyebrow">Explore</span>
						<h1 style={{ margin: '12px 0 0', fontSize: 'clamp(2rem, 3vw, 3rem)', letterSpacing: '-0.06em' }}>Fan feed</h1>
					</div>
					<a className="secondary-button" href="/signup">Become a member</a>
				</div>

				<div className="feed-list">
					{demoFeed.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setSelected(item.id)}
							style={{
								border: selected === item.id ? '1px solid rgba(247,103,21,0.32)' : '1px solid rgba(23,23,23,0.08)',
								background: selected === item.id ? 'rgba(247,103,21,0.04)' : 'rgba(255,255,255,0.8)',
								borderRadius: 20,
								padding: 18,
								textAlign: 'left',
								cursor: 'pointer',
							}}
						>
							<div className="feed-item">
								<div className="feed-item-main">
									<div className="feed-thumb">{item.kind === 'video' ? '▶' : 'IMG'}</div>
									<div>
										<div style={{ color: '#6f6a67', fontWeight: 700, marginBottom: 6 }}>{item.creator}</div>
										<div style={{ fontSize: 20, fontWeight: 700 }}>{item.title}</div>
										<div style={{ color: '#6f6a67', marginTop: 6 }}>{item.kind} · {item.isPaid ? 'Members only' : 'Public preview'}</div>
									</div>
								</div>
								<span className={item.isPaid ? 'pill' : 'ghost-button'} style={{ display: 'inline-flex', minWidth: 112, justifyContent: 'center' }}>
									{item.isPaid ? 'Paid' : 'Free'}
								</span>
							</div>
						</button>
					))}
				</div>

				{selected && (
					<div style={{ marginTop: 24, color: '#4a4543', fontWeight: 600 }}>
						Demo: this would resolve a signed media URL if the user has an active subscription.
					</div>
				)}
			</div>
		</main>
	);
}
