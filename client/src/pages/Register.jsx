import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Register() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', ntrp: '', phone: '' });
  const [err, setErr]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const data = await api.post('/api/auth/register', form);
      login(data.token, data.player);
      navigate('/dashboard');
    } catch (e) {
      setErr(e.message);
    }
  };

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div style={{ maxWidth: 480, margin: '3rem auto' }}>
      <h1 className="page-title">Create Account</h1>
      <div className="form-box">
        {err && <div className="alert alert-err">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Full Name *</label><input required value={form.name} onChange={set('name')} placeholder="John Dawg" /></div>
          <div className="form-group"><label>Email *</label><input type="email" required value={form.email} onChange={set('email')} /></div>
          <div className="form-group"><label>Password *</label><input type="password" required minLength={8} value={form.password} onChange={set('password')} /></div>
          <div className="form-grid">
            <div className="form-group">
              <label>NTRP Rating</label>
              <select value={form.ntrp} onChange={set('ntrp')}>
                <option value="">Select...</option>
                <option value="2.5">2.5</option><option value="3.0">3.0</option>
                <option value="3.5">3.5</option><option value="4.0">4.0</option><option value="4.5">4.5</option>
              </select>
            </div>
            <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={set('phone')} /></div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
        </form>
        <p className="muted mt-2">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
