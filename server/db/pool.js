const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Run a parameterised query.
 * @param {string} text  — SQL text with $1, $2 … placeholders
 * @param {any[]}  params — parameter array
 */
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
