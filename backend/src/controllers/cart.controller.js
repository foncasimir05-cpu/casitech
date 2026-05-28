const { query } = require('../config/db');

exports.getCart = async (req, res) => {
  const { rows } = await query(
    `SELECT ci.*, p.name, p.price, p.discount, p.images, p.stock FROM cart_items ci JOIN products p ON ci.product_id=p.id WHERE ci.user_id=$1`,
    [req.user.id]
  );
  res.json({ cart: rows });
};
exports.addItem = async (req, res) => {
  const { product_id, quantity=1 } = req.body;
  const { rows } = await query(
    `INSERT INTO cart_items(user_id,product_id,quantity) VALUES($1,$2,$3) ON CONFLICT(user_id,product_id) DO UPDATE SET quantity=cart_items.quantity+$3 RETURNING *`,
    [req.user.id, product_id, quantity]
  );
  res.json({ item: rows[0] });
};
exports.updateQty = async (req, res) => {
  const { rows } = await query(`UPDATE cart_items SET quantity=$1 WHERE id=$2 AND user_id=$3 RETURNING *`, [req.body.quantity, req.params.id, req.user.id]);
  res.json({ item: rows[0] });
};
exports.removeItem = async (req, res) => {
  await query(`DELETE FROM cart_items WHERE id=$1 AND user_id=$2`, [req.params.id, req.user.id]);
  res.json({ message: 'Item removed' });
};
exports.clearCart = async (req, res) => {
  await query(`DELETE FROM cart_items WHERE user_id=$1`, [req.user.id]);
  res.json({ message: 'Cart cleared' });
};
