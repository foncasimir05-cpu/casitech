const { query } = require('../config/db');

exports.getProfile = async (req, res) => {
  const { rows } = await query('SELECT id,name,email,phone,role,avatar_url,preferences,created_at FROM users WHERE id=$1', [req.user.id]);
  res.json({ user: rows[0] });
};
exports.updateProfile = async (req, res) => {
  const { name, phone, preferences } = req.body;
  const { rows } = await query(`UPDATE users SET name=COALESCE($1,name),phone=COALESCE($2,phone),preferences=COALESCE($3,preferences),updated_at=NOW() WHERE id=$4 RETURNING id,name,email,phone,role`, [name,phone,preferences,req.user.id]);
  res.json({ user: rows[0] });
};
exports.getWishlist = async (req, res) => {
  const { rows } = await query(`SELECT p.* FROM wishlists w JOIN products p ON w.product_id=p.id WHERE w.user_id=$1`, [req.user.id]);
  res.json({ wishlist: rows });
};
exports.toggleWishlist = async (req, res) => {
  const exists = await query('SELECT 1 FROM wishlists WHERE user_id=$1 AND product_id=$2', [req.user.id, req.params.id]);
  if (exists.rows[0]) {
    await query('DELETE FROM wishlists WHERE user_id=$1 AND product_id=$2', [req.user.id, req.params.id]);
    res.json({ action: 'removed' });
  } else {
    await query('INSERT INTO wishlists(user_id,product_id) VALUES($1,$2)', [req.user.id, req.params.id]);
    res.json({ action: 'added' });
  }
};
exports.getAll = async (req, res) => {
  const { rows } = await query('SELECT id,name,email,role,is_active,created_at FROM users ORDER BY created_at DESC');
  res.json({ users: rows });
};
exports.updateRole = async (req, res) => {
  const { rows } = await query('UPDATE users SET role=$1 WHERE id=$2 RETURNING id,name,email,role', [req.body.role, req.params.id]);
  res.json({ user: rows[0] });
};
