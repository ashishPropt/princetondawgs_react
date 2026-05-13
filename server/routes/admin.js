const router = require('express').Router();
const { query } = require('../db/pool');
const { requireAdmin } = require('../middleware/auth');

// GET /api/admin/players
router.get('/players', requireAdmin, async (_req, res) => {
  const { rows } = await query('SELECT id,name,email,ntrp,phone,is_admin,created_at FROM players ORDER BY name');
  res.json(rows);
});

// PATCH /api/admin/players/:id
router.patch('/players/:id', requireAdmin, async (req, res) => {
  const { name, ntrp, phone, is_admin } = req.body;
  const { rows } = await query(
    'UPDATE players SET name=COALESCE($1,name), ntrp=COALESCE($2,ntrp), phone=COALESCE($3,phone), is_admin=COALESCE($4,is_admin) WHERE id=$5 RETURNING id,name,email,ntrp,phone,is_admin',
    [name, ntrp, phone, is_admin, req.params.id]
  );
  res.json(rows[0]);
});

// DELETE /api/admin/players/:id
router.delete('/players/:id', requireAdmin, async (req, res) => {
  await query('DELETE FROM players WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// GET /api/admin/submissions
router.get('/submissions', requireAdmin, async (_req, res) => {
  const { rows } = await query('SELECT * FROM interest_submissions ORDER BY created_at DESC');
  res.json(rows);
});

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (_req, res) => {
  const [players, events, registrations, submissions] = await Promise.all([
    query('SELECT COUNT(*) FROM players'),
    query('SELECT COUNT(*) FROM events WHERE status=$1', ['active']),
    query('SELECT COUNT(*) FROM event_registrations'),
    query('SELECT COUNT(*) FROM interest_submissions'),
  ]);
  res.json({
    total_players:       parseInt(players.rows[0].count),
    active_events:       parseInt(events.rows[0].count),
    total_registrations: parseInt(registrations.rows[0].count),
    interest_forms:      parseInt(submissions.rows[0].count),
  });
});

module.exports = router;
