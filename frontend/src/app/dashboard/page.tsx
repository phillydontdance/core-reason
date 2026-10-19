'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type Subscription = {
	id: string;
	creatorId: string;
	fanId: string;
	status: string;
	monthlyPriceKsh: number;
};

export default function CreatorDashboardPage() {
	const [stats, setStats] = useState([
		{ label: 'Subscribers', value: '—' },
		{ label: 'Monthly earnings', value: '—' },
		{ label: 'Active memberships', value: '—' },
	]);

	useEffect(() => {
		const load = async () => {
			try {
				const token = localStorage.getItem('fanhaven_token');
				if (!token) return;

				const response = await apiFetch<{ subscriptions: Subscription[] }>('/subscriptions/me');
				const activeCount = response.subscriptions.filter((sub) => sub.status === 'active').length;

				const creatorSubs = response.subscriptions.filter((sub) => sub.creatorId === localStorage.getItem('fanhaven_user') ? JSON.parse(localStorage.getItem('fanhaven_user') ?? '{}').id : '');

				setStats([
					{ label: 'Subscribers', value: String(activeCount) },
					{ label: 'Monthly earnings', value: `KES ${(activeCount * 1500).toLocaleString()}` },
					{ label: 'Active memberships', value: String(activeCount) },
				]);
			} catch (err) {
				console.error(err);
			}
		};

		load();
	}, []);

	return (
		<main className='page-shell' style={{ padding: '48px 0 80px' }}>
			<div className='page-panel'>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						gap: 16,
						alignItems: 'end',
						flexWrap: 'wrap',
					}}
				>
					<div>
						<span className='eyebrow'>Creator hub</span>
						<h1
							style={{
								margin: '12px 0 0',
								fontSize: 'clamp(2rem, 3vw, 3rem)',
								letterSpacing: '-0.06em',
							}}
						>
							Dashboard
						</h1>
					</div>
					<a className='primary-button' href='/upload'>
						Upload content
					</a>
				</div>

				<div className='dashboard-grid'>
					{stats.map((item) => (
						<div key={item.label} className='metric-card'>
							<small>{item.label}</small>
							<strong>{item.value}</strong>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
