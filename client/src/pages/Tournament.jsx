import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Tournament() {
  const [events, setEvents]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [ties, setTies]       = useState([]);
  const [teams, setTeams]     = useState([]);

  useEffect(() => {
    api.get('/api/events').then(evts => {
      const tourn = evts.filter(e => e.type === 'tournament');
      setEvents(tourn);
      if (tourn.length) setSelected(tourn[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    Promise.all([
      api.get(`/api/ties?event_id=${selected}`),
      api.get(`/api/teams?event_id=${selected}`),
    ]).then(([t, tm]) => { setTies(t); setTeams(tm); });
  }, [selected]);

  return (
    <div>
      <h1 className="page-title">🏆 Tournament</h1>
      <div className="tab-bar">
        {events.map(e => <button key={e.id} className={`tab-btn ${selected === e.id ? 'active' : ''}`} onClick={() => setSelected(e.id)}>{e.name}</button>)}
      </div>

      {teams.length > 0 && (
        <>
          <h2 className="section-title">Teams</h2>
          <div className="card-grid">
            {teams.map(t => (
              <div className="card" key={t.id}>
                <h3>🐾 {t.name}</h3>
                <p>{t.member_count} member{t.member_count !== '1' ? 's' : ''}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {ties.length > 0 && (
        <>
          <h2 className="section-title">Ties</h2>
          <table className="tbl">
            <thead><tr><th>Team A</th><th>vs</th><th>Team B</th><th>Date</th><th>Final?</th><th></th></tr></thead>
            <tbody>
              {ties.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.team_a_name}</strong></td>
                  <td style={{ textAlign: 'center', color: 'var(--muted)' }}>vs</td>
                  <td><strong>{t.team_b_name}</strong></td>
                  <td>{t.scheduled_at ? new Date(t.scheduled_at).toLocaleDateString() : '—'}</td>
                  <td>{t.is_final ? '🏆 Final' : '—'}</td>
                  <td><Link to={`/tie/${t.id}`} className="btn btn-navy btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {ties.length === 0 && teams.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <span style={{ fontSize: '3rem' }}>🎾</span>
          <h3 style={{ marginTop: '1rem' }}>Tournament bracket coming soon</h3>
          <p>Check back once teams are confirmed.</p>
          <Link to="/register" className="btn btn-primary" style={{ marginTop: '1rem' }}>Register Now</Link>
        </div>
      )}
    </div>
  );
}
