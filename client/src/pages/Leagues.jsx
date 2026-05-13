import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Leagues() {
  const [leagues, setLeagues]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    api.get('/api/leagues').then(data => { setLeagues(data); if (data.length) setSelected(data[0].id); });
  }, []);

  useEffect(() => {
    if (selected) api.get(`/api/leagues/${selected}/schedule`).then(setSchedule).catch(() => setSchedule([]));
  }, [selected]);

  return (
    <div>
      <h1 className="page-title">USTA Leagues</h1>
      <div className="tab-bar">
        {leagues.map(l => <button key={l.id} className={`tab-btn ${selected === l.id ? 'active' : ''}`} onClick={() => setSelected(l.id)}>{l.name}</button>)}
      </div>
      {leagues.filter(l => l.id === selected).map(l => (
        <div key={l.id}>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge-league">NTRP {l.ntrp_level}</span>
            <h2 style={{ margin: '.5rem 0' }}>{l.name}</h2>
            <p>{l.description}</p>
          </div>
          <h2 className="section-title">Match Schedule</h2>
          <table className="tbl">
            <thead><tr><th>Date</th><th>Opponent</th><th>Location</th><th>Status</th></tr></thead>
            <tbody>
              {schedule.map(md => (
                <tr key={md.id}>
                  <td>{md.match_date}</td>
                  <td><strong>{md.opposition_name}</strong></td>
                  <td>{md.location || '—'}</td>
                  <td><span className={`badge badge-${md.status === 'completed' ? 'completed' : md.status === 'cancelled' ? 'draft' : 'active'}`}>{md.status}</span></td>
                </tr>
              ))}
              {schedule.length === 0 && <tr><td colSpan="4" className="muted" style={{ textAlign: 'center' }}>No matches scheduled yet.</td></tr>}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
