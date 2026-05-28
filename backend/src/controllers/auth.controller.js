const bcrypt = require('bcryptjs');
const passport = require('passport');
const { query } = require('../config/db');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows[0]) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await query(
      'INSERT INTO users(name,email,phone,password_hash) VALUES($1,$2,$3,$4) RETURNING id,name,email,role',
      [name, email, phone, hash]
    );
    res.status(201).json({ token: generateToken(rows[0].id), user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await query('SELECT * FROM users WHERE email=$1 AND is_active=true', [email]);
    if (!rows[0] || !rows[0].password_hash)
      return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const { password_hash, ...user } = rows[0];
    res.json({ token: generateToken(user.id), user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = (req, res) => {
  // JWT is stateless; client just discards the token
  res.json({ message: 'Logged out successfully' });
};

exports.googleAuth     = passport.authenticate('google', { scope: ['profile', 'email'] });
exports.googleCallback = passport.authenticate('google', { session: false, failureRedirect: '/login' });
