const { query } = require('../config/db');
const { sendEmail, orderConfirmationEmail } = require('../utils/sendEmail');

exports.create = async (req, res) => {
  try {
    const { items, shipping_address, payment_method, notes, momo_phone, momo_reference } = req.body;
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const total_price = subtotal;
    let orderNotes = notes || '';
    if (payment_method === 'momo' && momo_reference) {
      const momoInfo = `MTN MoMo: ${momo_phone || shipping_address.phone} | Ref: ${momo_reference}`;
      orderNotes = orderNotes ? `${momoInfo} | ${orderNotes}` : momoInfo;
    }
    const { rows } = await query(
      `INSERT INTO orders(user_id,user_email,user_contact,items,subtotal,total_price,shipping_address,payment_method,notes)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.id, req.user.email, shipping_address.phone, JSON.stringify(items), subtotal, total_price, JSON.stringify(shipping_address), payment_method, orderNotes]
    );
    // Send confirmation email (non-blocking)
    sendEmail({ to: req.user.email, subject: 'Order Confirmed — Casitech', html: orderConfirmationEmail({ ...rows[0], user_name: req.user.name }) }).catch(console.error);
    res.status(201).json({ order: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
    res.json({ orders: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { rows } = await query('SELECT o.*, u.name AS user_name FROM orders o LEFT JOIN users u ON o.user_id=u.id ORDER BY o.created_at DESC');
    res.json({ orders: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM orders WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Order not found' });
    res.json({ order: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { order_status, payment_status } = req.body;
    const { rows } = await query(
      `UPDATE orders SET order_status=COALESCE($1,order_status), payment_status=COALESCE($2,payment_status), updated_at=NOW() WHERE id=$3 RETURNING *`,
      [order_status, payment_status, req.params.id]
    );
    res.json({ order: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
