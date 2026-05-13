const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { query } = require('../db/pool');

const makeTokens = (player) => {
  const payload = { id: player.id, email: player.email, is_admin: player.is_admin };
  const access  = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { access, refresh };
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, ntrp, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await query(
      'INSERT INTO players (name, email, password_hash, ntrp, phone) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,is_admin',
      [name, email, hash, ntrp || null, phone || null]
    );
    const { access, refresh } = makeTokens(rows[0]);
    res.cookie('refresh_token', refresh, { httpOnly: true, sameSite: 'lax', maxAge: 7*24*3600*1000 });
    res.json({ token: access, player: rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await query('SELECT * FROM players WHERE email=$1', [email]);
  const player = rows[0];
  if (!player) return res.status(401).json({ error: 'Invalid email or password' });
  const ok = await bcrypt.compare(password, player.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });
  const { access, refresh } = makeTokens(player);
  res.cookie('refresh_token', refresh, { httpOnly: true, sameSite: 'lax', maxAge: 7*24*3600*1000 });
  res.json({ token: access, player: { id: player.id, name: player.name, email: player.email, is_admin: player.is_admin, ntrp: player.ntrp } });
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ error: 'No refresh token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const access = jwt.sign({ id: payload.id, email: payload.email, is_admin: payload.is_admin }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ token: access });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie('refresh_token');
  res.json({ ok: true });
});

module.exports = router;
