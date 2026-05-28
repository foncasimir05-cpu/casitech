require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// ─── Security Middleware ───────────────────────────────
app.use(helmet());
// CLIENT_URL supports comma-separated origins for Vercel preview deployments
const ALLOWED_ORIGINS = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',').map(s => s.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('CORS: origin not allowed'));
  },
  credentials: true,
}));

// ─── Rate Limiting ─────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Stripe Webhook — raw body MUST come before express.json() ────────────────
const paymentCtrl = require('./controllers/payment.controller');
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), paymentCtrl.webhook);

// ─── Body Parsing ──────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── API Routes ────────────────────────────────────────
app.use('/api/v1/auth',          require('./routes/auth.routes'));
app.use('/api/v1/products',      require('./routes/product.routes'));
app.use('/api/v1/categories',    require('./routes/category.routes'));
app.use('/api/v1/orders',        require('./routes/order.routes'));
app.use('/api/v1/cart',          require('./routes/cart.routes'));
app.use('/api/v1/payments',      require('./routes/payment.routes'));
app.use('/api/v1/users',         require('./routes/user.routes'));
app.use('/api/v1/notifications', require('./routes/notification.routes'));
app.use('/api/v1/support',       require('./routes/support.routes'));
app.use('/api/v1/uploads',       require('./routes/upload.routes'));

// ─── Health Check ──────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'OK', env: process.env.NODE_ENV }));

// ─── 404 ───────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Global Error Handler ──────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🟢 CASITECH API → http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});
