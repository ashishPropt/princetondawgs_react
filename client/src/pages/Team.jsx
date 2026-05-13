import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Team() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/players').then(setPlayers).finally(() => setLoading(false));
  }, []);

  const grouped = players.reduce((acc, p) => {
    const k = p.ntrp || 'Unrated';
    if (!acc[k]) acc[k] = [];
    acc[k].push(p);
    return acc;
  }, {});
  const levels = Object.keys(grouped).sort((a, b) => parseFloat(b) - parseFloat(a));

  return (
    <div>
      <h1 className="page-title">🐾 The Pack</h1>
      <p className="muted" style={{ marginBottom: '2rem' }}>{players.length} active members · Princeton, NJ · USTA Mid-Atlantic</p>
      {loading ? <p>Loading…</p> : levels.map(level => (
        <div key={level}>
          <h2 className="section-title">NTRP {level}</h2>
          <div className="card-grid">
            {grouped[level].map(p => (
              <div className="card" key={p.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.9rem', flexShrink: 0 }}>
                    {p.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{p.name}</h3>
                    <span className="badge badge-active">NTRP {p.ntrp || '?'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
