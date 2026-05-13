const router = require('express').Router();
const { query } = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

// GET /api/ties?event_id=
router.get('/', async (req, res) => {
  const { event_id } = req.query;
  const { rows } = await query(
    `SELECT ti.*, ta.name AS team_a_name, tb.name AS team_b_name
     FROM ties ti
     JOIN teams ta ON ta.id = ti.team_a_id
     JOIN teams tb ON tb.id = ti.team_b_id
     WHERE ti.event_id=$1 ORDER BY ti.scheduled_at`,
    [event_id]
  );
  res.json(rows);
});

// GET /api/ties/:id — tie detail with matches
router.get('/:id', async (req, res) => {
  const tie = await query(
    `SELECT ti.*, ta.name AS team_a_name, tb.name AS team_b_name
     FROM ties ti
     JOIN teams ta ON ta.id = ti.team_a_id
     JOIN teams tb ON tb.id = ti.team_b_id
     WHERE ti.id=$1`, [req.params.id]
  );
  if (!tie.rows[0]) return res.status(404).json({ error: 'Not found' });
  const matches = await query('SELECT * FROM matches WHERE tie_id=$1 ORDER BY id', [req.params.id]);
  res.json({ ...tie.rows[0], matches: matches.rows });
});

// PATCH /api/ties/:id/matches/:matchId — enter score
router.patch('/:id/matches/:matchId', requireAuth, async (req, res) => {
  const { score, games_a, games_b, winner_team } = req.body;
  const { rows } = await query(
    `UPDATE matches SET score=$1, games_a=$2, games_b=$3, winner_team=$4, entered_by=$5, entered_at=NOW()
     WHERE id=$6 RETURNING *`,
    [score, games_a, games_b, winner_team, req.user.id, req.params.matchId]
  );
  res.json(rows[0]);
});

module.exports = router;
