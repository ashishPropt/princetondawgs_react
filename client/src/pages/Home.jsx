import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const USTA_LEAGUES = [
  { id: 2, name: 'USTA 3.0 Spring League', level: '3.0', season: 'Spring 2026', format: 'Mixed Doubles / Singles', min_ntrp: 2.5, max_ntrp: 3.0, description: 'Open to all players rated 3.0 and below. Perfect for 2.5 and 3.0 NTRP players.', day: 'Sundays', location: 'Princeton, NJ' },
  { id: 3, name: 'USTA 3.5 Spring League', level: '3.5', season: 'Spring 2026', format: 'Mixed Doubles / Singles', min_ntrp: 3.0, max_ntrp: 3.5, description: 'For players rated 3.0–3.5. Both 3.0 and 3.5 players are eligible.', day: 'Sundays', location: 'Princeton, NJ' },
];

export default function Home() {
  const [stats, setStats] = useState({ total: 25, ntrp_breakdown: [] });
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    api.get('/api/players/stats').then(setStats).catch(() => {});
    api.get('/api/events').then(evts => {
      const t = evts.find(e => e.type === 'tournament' && e.status === 'active');
      setTournament(t || evts.find(e => e.type === 'tournament') || null);
    }).catch(() => {});
  }, []);

  const maxNtrp = stats.ntrp_breakdown.length ? Math.max(...stats.ntrp_breakdown.map(r => parseInt(r.cnt))) : 1;

  return (
    <>
      {/* HERO */}
      <section className="pd-hero" style={{ margin: '-2rem -1.5rem -4rem' }}>
        <div className="pd-hero-bg"><div className="pd-court-grid" /></div>
        <div className="pd-hero-content">
          <p className="pd-eyebrow">Princeton, NJ · USTA Mid-Atlantic · Est. 2018</p>
          <h1 className="pd-headline">
            <span className="pd-h1-line1">Dawg Days</span>
            <em className="pd-h1-line2">of Summer</em>
          </h1>
          <p className="pd-hero-sub">Princeton's most competitive recreational tennis community. We run USTA leagues, internal tournaments, and year-round weekly play. All skill levels welcome.</p>
          <div className="pd-hero-ctas">
            <Link to="/register" className="btn btn-primary">Register for Tournament</Link>
            <Link to="/leagues"  className="btn btn-outline">Join a USTA League</Link>
          </div>
          <div className="pd-hero-stats">
            <div className="pd-stat"><span className="pd-stat-num">{stats.total}</span><span className="pd-stat-label">Members</span></div>
            <div className="pd-stat-div" />
            <div className="pd-stat"><span className="pd-stat-num">2</span><span className="pd-stat-label">USTA Leagues</span></div>
            <div className="pd-stat-div" />
            <div className="pd-stat"><span className="pd-stat-num">Free</span><span className="pd-stat-label">Membership</span></div>
          </div>
        </div>
        <div className="pd-scroll-hint">scroll ↓</div>
      </section>

      {/* ABOUT */}
      <section className="pd-section pd-about" id="about">
        <div className="pd-container">
          <div className="pd-about-grid">
            <div className="pd-about-text">
              <span className="pd-tag">Who We Are</span>
              <h2 className="pd-section-title">More than a tennis team.<br />We're a pack.</h2>
              <p>The Princeton Dawgs started as a group of friends who wanted more than casual hitting. Today we're one of Princeton's most active USTA-registered tennis groups — running year-round leagues, internal tournaments, and a community that shows up for each other on and off the court.</p>
              <p>Membership is always <strong>free</strong>. If you've got the heart of a Dawg, you've got a place here.</p>
              <Link to="/join" className="btn btn-navy" style={{ marginTop: '1rem' }}>Join the Pack →</Link>
            </div>
            <div className="pd-about-cards">
              <div className="pd-acard pd-acard-orange"><span className="pd-acard-icon">🎾</span><h3>Compete</h3><p>USTA 3.0 and 3.5 Spring leagues, plus internal round-robins.</p></div>
              <div className="pd-acard pd-acard-dark"><span className="pd-acard-icon">🏆</span><h3>Tournament</h3><p>Dawg Days of Summer — our flagship annual event, open to all members.</p></div>
              <div className="pd-acard pd-acard-green"><span className="pd-acard-icon">🐾</span><h3>Connect</h3><p>A tight-knit community of {stats.total} players in Princeton, NJ.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* USTA LEAGUES */}
      <section className="pd-section pd-leagues-section" id="leagues">
        <div className="pd-container">
          <span className="pd-tag">Active Leagues</span>
          <h2 className="pd-section-title">USTA Leagues We Play In</h2>
          <p className="pd-section-sub">We currently compete in two USTA Mid-Atlantic Spring leagues. Each member can register based on their NTRP rating.</p>
          <div className="pd-leagues-grid">
            {USTA_LEAGUES.map(league => (
              <div className="pd-league-card" key={league.id}>
                <div className="pd-league-header">
                  <div>
                    <div className="pd-league-level">NTRP {league.level}</div>
                    <h3 className="pd-league-name">{league.name}</h3>
                    <p className="pd-league-season">{league.season} · {league.day} · {league.location}</p>
                  </div>
                  <span className="pd-league-badge pd-badge-open">Registration Open</span>
                </div>
                <div className="pd-league-body">
                  <p>{league.description}</p>
                  <div className="pd-league-meta">
                    <div className="pd-lm-item"><label>Format</label><span>{league.format}</span></div>
                    <div className="pd-lm-item"><label>Eligibility</label><span>NTRP {league.min_ntrp}–{league.max_ntrp}</span></div>
                    <div className="pd-lm-item"><label>Fee</label><span style={{ color: 'var(--ok)', fontWeight: 600 }}>🎉 Free for members</span></div>
                  </div>
                  <div className="pd-league-actions">
                    <Link to={`/usta-register?league=${league.id}`} className="btn btn-primary btn-sm">Register</Link>
                    <Link to="/leagues" className="btn btn-navy btn-sm">View Standings</Link>
                  </div>
                  <div className="pd-eligibility-note">
                    <span>ℹ️</span>
                    {league.level === '3.0'
                      ? <span><strong>2.5 and 3.0 players</strong> are eligible for this league.</span>
                      : <span><strong>3.0 and 3.5 players</strong> are eligible. 3.0 players can register for both leagues.</span>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Eligibility Matrix */}
          <div className="pd-elig-matrix">
            <h3>Who can register for which leagues?</h3>
            <table className="pd-elig-table">
              <thead><tr><th>Your NTRP</th><th>USTA 3.0 Spring</th><th>USTA 3.5 Spring</th><th>Dawg Days Tournament</th></tr></thead>
              <tbody>
                <tr><td><strong>2.5</strong></td><td className="pd-yes">✓ Eligible</td><td className="pd-no">– Not eligible</td><td className="pd-yes">✓ Eligible</td></tr>
                <tr><td><strong>3.0</strong></td><td className="pd-yes">✓ Eligible</td><td className="pd-yes">✓ Eligible</td><td className="pd-yes">✓ Eligible</td></tr>
                <tr><td><strong>3.5</strong></td><td className="pd-no">– Not eligible</td><td className="pd-yes">✓ Eligible</td><td className="pd-yes">✓ Eligible</td></tr>
                <tr><td><strong>4.0+</strong></td><td className="pd-no">– Not eligible</td><td className="pd-no">– Not eligible</td><td className="pd-yes">✓ Eligible</td></tr>
              </tbody>
            </table>
            <p className="pd-elig-note">All Dawgs members can play in the Dawg Days of Summer tournament regardless of NTRP rating.</p>
          </div>
        </div>
      </section>

      {/* TOURNAMENT */}
      <section className="pd-section pd-tournament-section" id="tournament">
        <div className="pd-container">
          <div className="pd-tourn-grid">
            <div className="pd-tourn-text">
              <span className="pd-tag pd-tag-light">Flagship Event</span>
              <h2 className="pd-section-title pd-white">Dawg Days of Summer</h2>
              {tournament ? (
                <>
                  <div className="pd-tourn-meta">
                    <div className="pd-tm-item"><label>Date</label><span>{tournament.starts_on}</span></div>
                    <div className="pd-tm-item"><label>Format</label><span>Teams of 4, Round-Robin</span></div>
                    <div className="pd-tm-item"><label>Entry</label><span style={{ color: 'var(--orange)', fontWeight: 700 }}>🎉 Free</span></div>
                  </div>
                  <p className="pd-tourn-desc">Our flagship annual tournament — open to all Dawgs members regardless of NTRP. Teams of 4 compete in a round-robin format, with 2 singles matches and 1 doubles match per tie.</p>
                  <div className="pd-tourn-ctas">
                    <Link to="/register" className="btn btn-primary">Register Now →</Link>
                    <Link to="/tournament" className="btn btn-ghost">Learn More</Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="pd-tourn-desc">Stay tuned for the next Dawg Days of Summer — our flagship annual tournament, open to all members.</p>
                  <Link to="/join" className="btn btn-primary">Join to Get Notified</Link>
                </>
              )}
            </div>
            <div className="pd-tourn-visual">
              <div className="pd-trophy-rings">
                <div className="pd-ring pd-r1" /><div className="pd-ring pd-r2" /><div className="pd-ring pd-r3" />
                <div className="pd-trophy-center"><span>🏆</span><p>Dawg Cup</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM / NTRP */}
      <section className="pd-section" id="team" style={{ background: 'var(--cream)' }}>
        <div className="pd-container">
          <span className="pd-tag">The Pack</span>
          <h2 className="pd-section-title">Current Members</h2>
          <p className="pd-section-sub">{stats.total} active Dawgs. All levels. One mission.</p>
          {stats.ntrp_breakdown.length > 0 && (
            <div className="pd-ntrp-breakdown">
              {stats.ntrp_breakdown.map(row => {
                const pct = Math.round((parseInt(row.cnt) / maxNtrp) * 100);
                const labels = { '2.5': 'Beginner+', '3.0': 'Intermediate', '3.5': 'Intermediate+', '4.0': 'Advanced', '4.5': 'Advanced+' };
                return (
                  <div className="pd-ntrp-bar-card" key={row.ntrp}>
                    <div className="pd-ntrp-num">{row.ntrp}</div>
                    <div className="pd-ntrp-desc">{labels[row.ntrp] || 'Player'}</div>
                    <div className="pd-ntrp-track"><div className="pd-ntrp-fill" style={{ width: `${pct}%` }} /></div>
                    <div className="pd-ntrp-count">{row.cnt} player{row.cnt !== '1' ? 's' : ''}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* JOIN FORM */}
      <JoinSection />
    </>
  );
}

function JoinSection() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', ntrp: '', interests: [] });
  const [status, setStatus] = useState('');

  const toggle = (v) => setForm(f => ({
    ...f,
    interests: f.interests.includes(v) ? f.interests.filter(i => i !== v) : [...f.interests, v]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/api/join', { name: `${form.first_name} ${form.last_name}`, email: form.email, ntrp: form.ntrp, message: form.interests.join(', ') });
      setStatus('ok');
    } catch {
      setStatus('err');
    }
  };

  return (
    <section className="pd-section pd-join-section" id="join">
      <div className="pd-container">
        <div className="pd-join-inner">
          <div className="pd-join-text">
            <span className="pd-tag pd-tag-light">Get Involved</span>
            <h2 className="pd-section-title pd-white">Don't just watch.<br />Play with us.</h2>
            <p style={{ color: 'rgba(255,255,255,.75)' }}>Drop your info and a captain will reach out about leagues, weekly play, and events.</p>
            <div className="pd-join-perks">
              <div className="pd-perk">🎾 USTA league placement</div>
              <div className="pd-perk">🏆 Free tournament entry</div>
              <div className="pd-perk">📅 Weekly scheduled play</div>
              <div className="pd-perk">🎉 Social events year-round</div>
            </div>
          </div>
          <div className="pd-join-form-wrap">
            {status === 'ok' ? (
              <div className="alert alert-ok">🐾 Thanks! A captain will be in touch soon.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="pd-form-row">
                  <div className="form-group"><label>First Name *</label><input required value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="John" /></div>
                  <div className="form-group"><label>Last Name *</label><input required value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Dawg" /></div>
                </div>
                <div className="form-group"><label>Email *</label><input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" /></div>
                <div className="form-group">
                  <label>Your NTRP Rating</label>
                  <select value={form.ntrp} onChange={e => setForm(f => ({ ...f, ntrp: e.target.value }))}>
                    <option value="">Select your level...</option>
                    <option value="2.5">2.5 – Beginner+</option>
                    <option value="3.0">3.0 – Intermediate</option>
                    <option value="3.5">3.5 – Intermediate+</option>
                    <option value="4.0">4.0 – Advanced</option>
                    <option value="4.5">4.5 – Advanced+</option>
                    <option value="unsure">Not sure – need assessment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Interested in</label>
                  <div className="pd-checkboxes">
                    {[['usta_30','USTA 3.0 Spring League'],['usta_35','USTA 3.5 Spring League'],['tournament','Dawg Days Tournament'],['general','General membership / weekly play']].map(([v, label]) => (
                      <label key={v} className="pd-check"><input type="checkbox" checked={form.interests.includes(v)} onChange={() => toggle(v)} /> {label}</label>
                    ))}
                  </div>
                </div>
                {status === 'err' && <div className="alert alert-err">Something went wrong. Please try again.</div>}
                <button type="submit" className="pd-form-submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Express Interest — Free 🐾'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
