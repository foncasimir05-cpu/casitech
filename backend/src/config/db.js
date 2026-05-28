const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => console.log('✅ PostgreSQL connected'));
pool.on('error', (err) => console.error('❌ DB error:', err.message));

// Test connection immediately on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
  } else {
    console.log('✅ PostgreSQL connected at:', res.rows[0].now);
  }
});

module.exports = { pool, query: (text, params) => pool.query(text, params) };