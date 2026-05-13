import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Dashboard() {
  const { player } = useAuth();
  const [regs, setRegs]   = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/events'),
    ]).then(([evts]) => {
      setEvents(evts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/api/events/${eventId}/register`);
      setRegs(r => [...r, eventId]);
      alert('Registered successfully!');
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="page-title">Welcome back, {player?.name?.split(' ')[0]}! 🐾</h1>

      <div className="card-grid">
        <div className="card">
          <h3>Your Profile</h3>
          <p><strong>Name:</strong> {player?.name}</p>
          <p><strong>Email:</strong> {player?.email}</p>
          <p><strong>NTRP:</strong> {player?.ntrp || 'Not set'}</p>
          {player?.is_admin && <span className="badge badge-active">Admin</span>}
        </div>
        <div className="card">
          <h3>Quick Links</h3>
          <p style={{ marginBottom: '.75rem' }}>Navigate to key areas:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            <Link to="/tournament" className="btn btn-primary btn-sm">View Tournament</Link>
            <Link to="/leagues"    className="btn btn-navy   btn-sm">USTA Leagues</Link>
            <Link to="/standings"  className="btn btn-navy   btn-sm">Standings</Link>
            <Link to="/usta-register" className="btn btn-navy btn-sm">Register for USTA</Link>
          </div>
        </div>
      </div>

      <h2 className="section-title">Available Events</h2>
      <table className="tbl">
        <thead><tr><th>Event</th><th>Type</th><th>Date</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id}>
              <td><strong>{ev.name}</strong></td>
              <td><span className={`badge badge-${ev.type === 'tournament' ? 'tournament' : 'league'}`}>{ev.type === 'tournament' ? 'Tournament' : 'USTA League'}</span></td>
              <td>{ev.starts_on || '—'}</td>
              <td><span className={`badge badge-${ev.status}`}>{ev.status}</span></td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => handleRegister(ev.id)} disabled={regs.includes(ev.id)}>
                  {regs.includes(ev.id) ? '✓ Registered' : 'Register'}
                </button>
              </td>
            </tr>
          ))}
          {events.length === 0 && <tr><td colSpan="5" className="muted" style={{ textAlign: 'center' }}>No events available.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
