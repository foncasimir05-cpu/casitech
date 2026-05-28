const { query } = require('../config/db');

// MoMo payment confirmation — called after order is placed and payment verified manually
exports.confirmMomo = async (req, res) => {
  try {
    const { orderId } = req.params;
    await query(
      `UPDATE orders SET payment_status='paid', order_status='confirmed', updated_at=NOW() WHERE id=$1`,
      [orderId]
    );
    res.json({ message: 'Payment confirmed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
