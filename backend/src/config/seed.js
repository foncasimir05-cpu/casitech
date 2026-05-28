require('dotenv').config();
const { pool } = require('./db');

const CATEGORIES = [
  { id: 1,  name: 'Smartphones',      icon: '📱', slug: 'smartphones'   },
  { id: 2,  name: 'Laptops & PCs',    icon: '💻', slug: 'laptops-pcs'   },
  { id: 3,  name: 'Audio',            icon: '🎧', slug: 'audio'          },
  { id: 4,  name: 'Gaming',           icon: '🎮', slug: 'gaming'         },
  { id: 5,  name: 'Cameras',          icon: '📸', slug: 'cameras'        },
  { id: 6,  name: 'Smart Home',       icon: '🏠', slug: 'smart-home'     },
  { id: 7,  name: 'Wearables',        icon: '⌚', slug: 'wearables'      },
  { id: 8,  name: 'Drones',           icon: '🚁', slug: 'drones'         },
  { id: 9,  name: 'Networking',       icon: '📡', slug: 'networking'     },
  { id: 10, name: 'Power & Storage',  icon: '🔋', slug: 'power-storage'  },
];

const PRODUCTS = [
  { name: 'ProMax Laptop 16 Ultra',        category_id: 2,  price: 1299, discount: 15, stock: 12,  is_hot: true,  is_new: false, description: 'Intel Core i9, 32GB DDR5, 1TB NVMe SSD, RTX 4070. 4K OLED. Thunderbolt 4.' },
  { name: 'Noise-Cancel Headphones X9',    category_id: 3,  price: 249,  discount: 30, stock: 45,  is_hot: true,  is_new: false, description: '40h battery, 40mm drivers, active noise cancellation, foldable.' },
  { name: 'SmartWatch Series 5 Pro',       category_id: 7,  price: 399,  discount: 0,  stock: 8,   is_hot: false, is_new: true,  description: 'ECG tracking, GPS, 2-day battery. AMOLED. Water resistant 50m.' },
  { name: '4K Drone Camera Pro',           category_id: 8,  price: 599,  discount: 20, stock: 3,   is_hot: true,  is_new: false, description: '30-min flight, 3-axis gimbal, 4K/60fps HDR, obstacle sensing, 10km range.' },
  { name: 'Galaxy Ultra S25',              category_id: 1,  price: 1099, discount: 10, stock: 20,  is_hot: true,  is_new: true,  description: '6.8" Dynamic AMOLED, 200MP camera, Snapdragon 8 Gen 4, 5000mAh, 45W fast charge.' },
  { name: 'Portable Bluetooth Speaker',    category_id: 3,  price: 69,   discount: 22, stock: 80,  is_hot: false, is_new: true,  description: '360° sound, 20h battery, IPX7 waterproof. Party mode links 100 speakers.' },
  { name: 'Gaming Console X Pro',          category_id: 4,  price: 499,  discount: 0,  stock: 7,   is_hot: true,  is_new: false, description: '8K gaming, 2TB SSD, ray tracing, 120fps, backward compatible.' },
  { name: 'Mirrorless Camera 45MP',        category_id: 5,  price: 1899, discount: 8,  stock: 5,   is_hot: false, is_new: true,  description: '45MP full-frame, 4K/120fps, 10-stop IBIS, dual card slots, weather sealed.' },
  { name: 'Wi-Fi 7 Mesh Router Pro',       category_id: 9,  price: 349,  discount: 12, stock: 30,  is_hot: false, is_new: true,  description: 'Wi-Fi 7 BE19000, tri-band, 10Gbps WAN, covers 6000 sq ft, 200+ devices.' },
  { name: '2TB NVMe SSD Gen5',             category_id: 10, price: 189,  discount: 18, stock: 60,  is_hot: false, is_new: false, description: '14,000MB/s read, PCIe 5.0, M.2 2280, heatsink included. 5-year warranty.' },
  { name: 'True Wireless Earbuds Pro',     category_id: 3,  price: 129,  discount: 15, stock: 150, is_hot: false, is_new: false, description: 'ANC + transparency, 36h total, spatial audio, IPX4, wireless charging case.' },
  { name: 'VR Headset Infinity 3',         category_id: 7,  price: 599,  discount: 25, stock: 15,  is_hot: true,  is_new: false, description: '4K per eye, 120Hz, eye tracking, hand tracking, 3h battery. Standalone + PC VR.' },
  { name: 'Mechanical Gaming Keyboard',    category_id: 4,  price: 149,  discount: 0,  stock: 45,  is_hot: false, is_new: true,  description: 'Hall effect switches, per-key RGB, 8000Hz polling, gasket mount, aluminium.' },
  { name: 'Smart Home Security Hub',       category_id: 6,  price: 89,   discount: 0,  stock: 50,  is_hot: false, is_new: true,  description: 'Controls 200+ devices, Matter & Thread ready, local processing, works offline.' },
];

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Categories ─────────────────────────────────────────
    console.log('Seeding categories...');
    for (const cat of CATEGORIES) {
      await client.query(
        `INSERT INTO categories(id, name, icon, slug)
         VALUES($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, icon=EXCLUDED.icon`,
        [cat.id, cat.name, cat.icon, cat.slug]
      );
    }
    // Keep the sequence ahead of manual inserts
    await client.query(`SELECT setval('categories_id_seq', 10, true)`);

    // ── Products ───────────────────────────────────────────
    const { rows: existing } = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(existing[0].count) > 0) {
      console.log(`Products already seeded (${existing[0].count} found) — skipping. Run with --force to re-seed.`);
    } else {
      console.log('Seeding products...');
      for (const p of PRODUCTS) {
        await client.query(
          `INSERT INTO products(name, description, price, discount, category_id, images, stock, is_hot, is_new, status)
           VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active')`,
          [p.name, p.description, p.price, p.discount, p.category_id, '{}', p.stock, p.is_hot, p.is_new]
        );
      }
      console.log(`✅ Inserted ${PRODUCTS.length} products.`);
    }

    await client.query('COMMIT');
    console.log('✅ Seed complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
};

seed();
