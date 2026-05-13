import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const data = await api.post('/api/auth/login', form);
      login(data.token, data.player);
      navigate('/dashboard');
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '3rem auto' }}>
      <h1 className="page-title">Player Login</h1>
      <div className="form-box">
        {err && <div className="alert alert-err">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Email</label><input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div className="form-group"><label>Password</label><input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
        </form>
        <p className="muted mt-2">No account? <Link to="/register">Register</Link> · <Link to="/forgot-password">Forgot password?</Link></p>
      </div>
    </div>
  );
}
