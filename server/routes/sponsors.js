const router = require('express').Router();
const { query } = require('../db/pool');

// GET /api/sponsors
router.get('/', async (_req, res) => {
  const { rows } = await query('SELECT * FROM sponsors WHERE is_active=true ORDER BY tier,name');
  res.json(rows);
});

// GET /api/shop
module.exports = router;
