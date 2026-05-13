const router = require('express').Router();
const { query } = require('../db/pool');
const { requireAdmin } = require('../middleware/auth');

// GET /api/teams?event_id=
router.get('/', async (req, res) => {
  const { event_id } = req.query;
  const { rows } = await query(
    'SELECT t.*, COUNT(pt.player_id) AS member_count FROM teams t LEFT JOIN player_teams pt ON pt.team_id=t.id WHERE t.event_id=$1 GROUP BY t.id ORDER BY t.name',
    [event_id]
  );
  res.json(rows);
});

// GET /api/teams/:id/players
router.get('/:id/players', async (req, res) => {
  const { rows } = await query(
    'SELECT p.id, p.name, p.ntrp FROM player_teams pt JOIN players p ON p.id=pt.player_id WHERE pt.team_id=$1 ORDER BY p.name',
    [req.params.id]
  );
  res.json(rows);
});

// POST /api/teams — admin
router.post('/', requireAdmin, async (req, res) => {
  const { event_id, name } = req.body;
  const { rows } = await query('INSERT INTO teams (event_id, name) VALUES ($1,$2) RETURNING *', [event_id, name]);
  res.status(201).json(rows[0]);
});

module.exports = router;
