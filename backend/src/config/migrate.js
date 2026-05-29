require('dotenv').config();
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set — cannot run migrations');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const migrate = async () => {
  console.log('Running migrations...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`CREATE TABLE IF NOT EXISTS users (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name          VARCHAR(255) NOT NULL,
      email         VARCHAR(255) UNIQUE NOT NULL,
      phone         VARCHAR(20),
      password_hash VARCHAR(255),
      oauth_provider VARCHAR(50),
      oauth_id      VARCHAR(255),
      role          VARCHAR(20) DEFAULT 'buyer' CHECK (role IN ('buyer','seller','admin')),
      avatar_url    TEXT,
      preferences   JSONB DEFAULT '{}',
      is_active     BOOLEAN DEFAULT true,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    );`);

    await client.query(`CREATE TABLE IF NOT EXISTS categories (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      icon       VARCHAR(10),
      slug       VARCHAR(100) UNIQUE NOT NULL,
      parent_id  INTEGER REFERENCES categories(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );`);

    await client.query(`CREATE TABLE IF NOT EXISTS products (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      seller_id    UUID REFERENCES users(id) ON DELETE CASCADE,
      name         VARCHAR(255) NOT NULL,
      description  TEXT,
      price        DECIMAL(10,2) NOT NULL,
      discount     INTEGER DEFAULT 0 CHECK (discount BETWEEN 0 AND 80),
      category_id  INTEGER REFERENCES categories(id),
      images       TEXT[] DEFAULT '{}',
      stock        INTEGER DEFAULT 0,
      tags         TEXT[] DEFAULT '{}',
      is_hot       BOOLEAN DEFAULT false,
      is_new       BOOLEAN DEFAULT false,
      status       VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','draft','hidden')),
      rating       DECIMAL(3,2) DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    );`);

    await client.query(`CREATE TABLE IF NOT EXISTS orders (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id          UUID REFERENCES users(id),
      user_email       VARCHAR(255) NOT NULL,
      user_contact     VARCHAR(20),
      items            JSONB NOT NULL,
      subtotal         DECIMAL(10,2) NOT NULL,
      total_price      DECIMAL(10,2) NOT NULL,
      shipping_address JSONB NOT NULL,
      payment_method   VARCHAR(50),
      payment_status   VARCHAR(20) DEFAULT 'pending',
      order_status     VARCHAR(20) DEFAULT 'pending',
      stripe_payment_id TEXT,
      notes            TEXT,
      created_at       TIMESTAMPTZ DEFAULT NOW(),
      updated_at       TIMESTAMPTZ DEFAULT NOW()
    );`);

    await client.query(`CREATE TABLE IF NOT EXISTS reviews (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
      rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment    TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(product_id, user_id)
    );`);

    await client.query(`CREATE TABLE IF NOT EXISTS cart_items (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      quantity   INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );`);

    await client.query(`CREATE TABLE IF NOT EXISTS notifications (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
      title      VARCHAR(255) NOT NULL,
      message    TEXT NOT NULL,
      type       VARCHAR(50) DEFAULT 'info',
      is_read    BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );`);

    await client.query(`CREATE TABLE IF NOT EXISTS support_tickets (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID REFERENCES users(id),
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) NOT NULL,
      subject    VARCHAR(255) NOT NULL,
      message    TEXT NOT NULL,
      status     VARCHAR(20) DEFAULT 'open',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );`);

    await client.query(`CREATE TABLE IF NOT EXISTS wishlists (
      user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, product_id)
    );`);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_status    ON products(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_user        ON orders(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);`);

    await client.query('COMMIT');
    console.log('Migrations complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err.message);
  } finally {
    client.release();
    pool.end();
  }
};
migrate();
