const router = require('express').Router();
const { query } = require('../db/pool');

router.get('/', async (_req, res) => {
  const { rows } = await query('SELECT * FROM shop_items WHERE in_stock=true ORDER BY category,name');
  res.json(rows);
});

module.exports = router;
