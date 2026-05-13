const router = require('express').Router();
const { query } = require('../db/pool');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /api/events — list all events
router.get('/', async (_req, res) => {
  const { rows } = await query('SELECT * FROM events ORDER BY starts_on DESC');
  res.json(rows);
});

// GET /api/events/:id — single event with registrations count
router.get('/:id', async (req, res) => {
  const ev = await query('SELECT * FROM events WHERE id=$1', [req.params.id]);
  if (!ev.rows[0]) return res.status(404).json({ error: 'Not found' });
  const cnt = await query('SELECT COUNT(*) FROM event_registrations WHERE event_id=$1', [req.params.id]);
  res.json({ ...ev.rows[0], registered_count: parseInt(cnt.rows[0].count) });
});

// POST /api/events/:id/register — register current player
router.post('/:id/register', requireAuth, async (req, res) => {
  try {
    await query('INSERT INTO event_registrations (event_id, player_id) VALUES ($1,$2)', [req.params.id, req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Already registered' });
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/events/:id/registrations
router.get('/:id/registrations', requireAuth, async (req, res) => {
  const { rows } = await query(
    `SELECT er.*, p.name, p.ntrp FROM event_registrations er
     JOIN players p ON p.id = er.player_id
     WHERE er.event_id=$1 ORDER BY er.joined_at DESC`,
    [req.params.id]
  );
  res.json(rows);
});

// POST /api/events — create (admin)
router.post('/', requireAdmin, async (req, res) => {
  const { name, type, ntrp_level, starts_on, description, status } = req.body;
  const { rows } = await query(
    'INSERT INTO events (name,type,ntrp_level,starts_on,description,status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [name, type, ntrp_level || null, starts_on || null, description, status || 'active']
  );
  res.status(201).json(rows[0]);
});

module.exports = router;
