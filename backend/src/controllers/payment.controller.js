const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { query } = require('../config/db');

// Combined: creates the order in DB + a Stripe PaymentIntent in one round-trip
exports.createCheckout = async (req, res) => {
  try {
    const { items, shipping_address, notes } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'Cart is empty' });

    const subtotal = items.reduce((s, i) => s + parseFloat(i.price) * parseInt(i.quantity), 0);

    const { rows: [order] } = await query(
      `INSERT INTO orders(user_id,user_email,user_contact,items,subtotal,total_price,shipping_address,payment_method,notes)
       VALUES($1,$2,$3,$4,$5,$6,$7,'stripe',$8) RETURNING *`,
      [req.user.id, req.user.email, shipping_address?.phone || '',
       JSON.stringify(items), subtotal, subtotal,
       JSON.stringify(shipping_address), notes || '']
    );

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(subtotal * 100),
      currency: 'usd',
      metadata: { orderId: order.id, userId: req.user.id },
    });

    res.json({ orderId: order.id, clientSecret: intent.client_secret, amount: subtotal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
      metadata: { orderId, userId: req.user.id },
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.confirm = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    await query(
      `UPDATE orders SET payment_status='paid', order_status='confirmed', stripe_payment_id=$1, updated_at=NOW() WHERE id=$2`,
      [paymentIntentId, orderId]
    );
    res.json({ message: 'Payment confirmed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'payment_intent.succeeded') {
      const { orderId } = event.data.object.metadata;
      await query(`UPDATE orders SET payment_status='paid',order_status='confirmed' WHERE id=$1`, [orderId]);
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
