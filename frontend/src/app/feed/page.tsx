'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type FeedItem = {
	id: string;
	creatorId: string;
	title: string;
	kind: 'image' | 'video';
	visibility: 'public' | 'paid';
	url: string;
	previewUrl?: string;
	description?: string;
	createdAt: string;
};

export default function FeedPage() {
	const [items, setItems] = useState<FeedItem[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadFeed = async () => {
			try {
				const response = await apiFetch<{ items: FeedItem[] }>('/content/public');
				setItems(response.items);
				if (response.items[0]) setSelected(response.items[0].id);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadFeed();
	}, []);

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

				{loading ? <div style={{ padding: '20px 0' }}>Loading feed...</div> : null}

				<div className="feed-list">
					{items.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setSelected(item.id)}
							style={{
								border: selected === item.id ? '1px solid rgba(17,17,17,0.32)' : '1px solid rgba(23,23,23,0.08)',
								background: selected === item.id ? 'rgba(17,17,17,0.04)' : 'rgba(255,255,255,0.8)',
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
										<div style={{ color: '#6f6a67', fontWeight: 700, marginBottom: 6 }}>{item.creatorId}</div>
										<div style={{ fontSize: 20, fontWeight: 700 }}>{item.title}</div>
										<div style={{ color: '#6f6a67', marginTop: 6 }}>{item.kind} · {item.visibility === 'paid' ? 'Members only' : 'Public preview'}</div>
									</div>
								</div>
								<span className={item.visibility === 'paid' ? 'pill' : 'ghost-button'} style={{ display: 'inline-flex', minWidth: 112, justifyContent: 'center' }}>
									{item.visibility === 'paid' ? 'Paid' : 'Free'}
								</span>
							</div>
						</button>
					))}
				</div>

				{selected && (
					<div style={{ marginTop: 24, color: '#4a4543', fontWeight: 600 }}>
						Paid content stays behind access checks; public content is visible without login.
					</div>
				)}
			</div>
		</main>
	);
}
