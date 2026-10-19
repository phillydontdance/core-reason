'use client';

const stats = [
	{ label: 'Subscribers', value: '2,480' },
	{ label: 'Monthly earnings', value: 'KES 248,000' },
	{ label: 'Active memberships', value: '1,326' },
];

export default function CreatorDashboardPage() {
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
