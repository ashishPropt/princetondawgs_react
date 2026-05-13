import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function TieDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [tie, setTie] = useState(null);

  useEffect(() => {
    api.get(`/api/ties/${id}`).then(setTie).catch(() => setTie(null));
  }, [id]);

  if (!tie) return <p>Loading…</p>;

  const { matches = [], team_a_name, team_b_name } = tie;
  const winsA = matches.filter(m => m.winner_team === 'A').length;
  const winsB = matches.filter(m => m.winner_team === 'B').length;

  return (
    <div>
      <h1 className="page-title">{team_a_name} vs {team_b_name}</h1>
      {tie.is_final && <span className="badge badge-tournament" style={{ marginBottom: '1rem', display: 'inline-block' }}>🏆 Final</span>}
      {tie.scheduled_at && <p className="muted">Scheduled: {new Date(tie.scheduled_at).toLocaleString()}</p>}

      <div style={{ display: 'flex', gap: '2rem', margin: '1.5rem 0', padding: '1.5rem', background: 'var(--navy)', borderRadius: 'var(--radius)', color: '#fff' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--orange)' }}>{winsA}</div>
          <div>{team_a_name}</div>
        </div>
        <div style={{ textAlign: 'center', alignSelf: 'center', color: 'rgba(255,255,255,.5)' }}>WINS</div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--orange)' }}>{winsB}</div>
          <div>{team_b_name}</div>
        </div>
      </div>

      <h2 className="section-title">Matches</h2>
      <table className="tbl">
        <thead><tr><th>Type</th><th>Pts</th><th>Score</th><th>Winner</th></tr></thead>
        <tbody>
          {matches.map(m => (
            <tr key={m.id}>
              <td><span className="badge badge-league">{m.match_type}</span></td>
              <td>{m.points_value}</td>
              <td>{m.score || '—'}</td>
              <td>{m.winner_team === 'A' ? <span className="pill pill-win">{team_a_name}</span> : m.winner_team === 'B' ? <span className="pill pill-win">{team_b_name}</span> : '—'}</td>
            </tr>
          ))}
          {matches.length === 0 && <tr><td colSpan="4" className="muted" style={{ textAlign: 'center' }}>No matches yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
