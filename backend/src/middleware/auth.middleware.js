const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// Verify JWT token
exports.protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer '))
      return res.status(401).json({ error: 'Not authorized — no token' });

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await query('SELECT id, name, email, role FROM users WHERE id=$1 AND is_active=true', [decoded.id]);

    if (!rows[0]) return res.status(401).json({ error: 'User not found' });
    req.user = rows[0];
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Optional auth — attaches user if token present, but doesn't block if missing
exports.optionalAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { rows } = await query('SELECT id, name, email, role FROM users WHERE id=$1', [decoded.id]);
      if (rows[0]) req.user = rows[0];
    }
  } catch {}
  next();
};

// Role guard — use after protect
exports.requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ error: 'Access denied — insufficient role' });
  next();
};
