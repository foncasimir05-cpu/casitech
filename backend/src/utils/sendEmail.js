const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};

const orderConfirmationEmail = (order) => `
  <div style="font-family:Arial;max-width:600px;margin:auto;background:#0d0d0d;color:#fff;padding:30px;border-radius:10px">
    <h1 style="color:#00c853">✅ Order Confirmed!</h1>
    <p>Hi <strong>${order.user_name}</strong>, your order has been placed successfully.</p>
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Total:</strong> $${order.total_price}</p>
    <p><strong>Shipping to:</strong> ${order.shipping_address.address}, ${order.shipping_address.city}</p>
    <p style="color:#aaa;font-size:12px">Thank you for shopping with Casitech!</p>
  </div>
`;

module.exports = { sendEmail, orderConfirmationEmail };
