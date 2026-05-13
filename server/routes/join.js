const router = require('express').Router();
const { query } = require('../db/pool');

// POST /api/join — interest form
router.post('/', async (req, res) => {
  const { name, email, phone, ntrp, message } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  await query(
    'INSERT INTO interest_submissions (name,email,phone,ntrp,message) VALUES ($1,$2,$3,$4,$5)',
    [name, email, phone || null, ntrp || null, message || null]
  );
  res.json({ ok: true });
});

module.exports = router;
