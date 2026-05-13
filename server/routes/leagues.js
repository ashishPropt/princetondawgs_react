const router = require('express').Router();
const { query } = require('../db/pool');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /api/leagues — all usta_league events with their match days
router.get('/', async (_req, res) => {
  const { rows: leagues } = await query(
    "SELECT * FROM events WHERE type='usta_league' ORDER BY starts_on DESC"
  );
  res.json(leagues);
});

// GET /api/leagues/:id/schedule — match days for a league
router.get('/:id/schedule', async (req, res) => {
  const { rows } = await query(
    `SELECT lmd.*, ot.name AS opposition_name
     FROM league_match_days lmd
     JOIN opposition_teams ot ON ot.id = lmd.opposition_team_id
     WHERE lmd.event_id=$1 ORDER BY lmd.match_date ASC`,
    [req.params.id]
  );
  res.json(rows);
});

// GET /api/leagues/:id/scores — all scores for a league
router.get('/:id/scores', requireAuth, async (req, res) => {
  const { rows } = await query(
    `SELECT ls.*, p.name AS player_name, lmd.match_date, ot.name AS opposition_name
     FROM league_scores ls
     JOIN league_match_days lmd ON lmd.id = ls.league_match_day_id
     JOIN opposition_teams ot ON ot.id = lmd.opposition_team_id
     JOIN players p ON p.id = ls.player_id
     WHERE lmd.event_id=$1 ORDER BY lmd.match_date DESC`,
    [req.params.id]
  );
  res.json(rows);
});

// POST /api/leagues/:matchDayId/scores — enter a score (auth required)
router.post('/:matchDayId/scores', requireAuth, async (req, res) => {
  const { match_type, partner_name, opponent1_name, opponent2_name, score, result, notes } = req.body;
  const { rows } = await query(
    `INSERT INTO league_scores
       (league_match_day_id, player_id, match_type, partner_name, opponent1_name, opponent2_name, score, result, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [req.params.matchDayId, req.user.id, match_type, partner_name, opponent1_name, opponent2_name, score, result, notes]
  );
  res.status(201).json(rows[0]);
});

// GET /api/leagues/usta-register — check eligibility
router.get('/eligible/:playerId/:leagueId', requireAuth, async (req, res) => {
  const { rows: player } = await query('SELECT ntrp FROM players WHERE id=$1', [req.params.playerId]);
  const { rows: league } = await query('SELECT ntrp_level FROM events WHERE id=$1', [req.params.leagueId]);
  if (!player[0] || !league[0]) return res.status(404).json({ error: 'Not found' });
  const ntrp = parseFloat(player[0].ntrp);
  const level = parseFloat(league[0].ntrp_level);
  // 3.0 league: 2.5 and 3.0 eligible; 3.5 league: 3.0 and 3.5 eligible
  const eligible = level === 3.0 ? ntrp <= 3.0 : (level === 3.5 ? ntrp >= 3.0 && ntrp <= 3.5 : true);
  res.json({ eligible, ntrp, level });
});

module.exports = router;
