const router = require('express').Router();
const { query } = require('../db/pool');

// GET /api/standings?event_id=
router.get('/', async (req, res) => {
  const { event_id } = req.query;
  // Compute wins/losses per team from completed ties
  const { rows } = await query(
    `WITH tie_results AS (
       SELECT
         ti.event_id,
         CASE
           WHEN SUM(CASE WHEN m.winner_team='A' THEN 1 ELSE 0 END) >
                SUM(CASE WHEN m.winner_team='B' THEN 1 ELSE 0 END)
           THEN ti.team_a_id ELSE ti.team_b_id END AS winner_id,
         CASE
           WHEN SUM(CASE WHEN m.winner_team='A' THEN 1 ELSE 0 END) >
                SUM(CASE WHEN m.winner_team='B' THEN 1 ELSE 0 END)
           THEN ti.team_b_id ELSE ti.team_a_id END AS loser_id
       FROM ties ti
       JOIN matches m ON m.tie_id = ti.id
       WHERE ti.event_id=$1 AND m.winner_team IS NOT NULL
       GROUP BY ti.id
     )
     SELECT t.id, t.name,
       COUNT(CASE WHEN tr.winner_id = t.id THEN 1 END) AS wins,
       COUNT(CASE WHEN tr.loser_id  = t.id THEN 1 END) AS losses
     FROM teams t
     LEFT JOIN tie_results tr ON tr.winner_id = t.id OR tr.loser_id = t.id
     WHERE t.event_id=$1
     GROUP BY t.id, t.name
     ORDER BY wins DESC, losses ASC`,
    [event_id]
  );
  res.json(rows);
});

module.exports = router;
