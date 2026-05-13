const router = require('express').Router();
const { query } = require('../db/pool');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /api/players — public roster (no sensitive fields)
router.get('/', async (_req, res) => {
  const { rows } = await query(
    'SELECT id, name, ntrp, created_at FROM players ORDER BY name ASC'
  );
  res.json(rows);
});

// GET /api/players/stats — counts for homepage
router.get('/stats', async (_req, res) => {
  const total = await query('SELECT COUNT(*) FROM players');
  const ntrp  = await query('SELECT ntrp, COUNT(*) as cnt FROM players GROUP BY ntrp ORDER BY ntrp DESC');
  res.json({ total: parseInt(total.rows[0].count), ntrp_breakdown: ntrp.rows });
});

// GET /api/players/me — current player profile
router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await query(
    'SELECT id,name,email,ntrp,phone,is_admin,created_at FROM players WHERE id=$1',
    [req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// PATCH /api/players/me — update profile
router.patch('/me', requireAuth, async (req, res) => {
  const { name, ntrp, phone } = req.body;
  const { rows } = await query(
    'UPDATE players SET name=COALESCE($1,name), ntrp=COALESCE($2,ntrp), phone=COALESCE($3,phone) WHERE id=$4 RETURNING id,name,email,ntrp,phone',
    [name, ntrp, phone, req.user.id]
  );
  res.json(rows[0]);
});

// GET /api/players/:id — admin: full player detail
router.get('/:id', requireAdmin, async (req, res) => {
  const { rows } = await query('SELECT id,name,email,ntrp,phone,is_admin,created_at FROM players WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

module.exports = router;
