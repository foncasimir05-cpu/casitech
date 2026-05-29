const { query } = require('../config/db');
const { uploadBuffer } = require('../utils/cloudinary');

exports.getAll = async (req, res) => {
  try {
    const { category, search, sort='created_at', order='DESC', limit=20, offset=0, hot, isNew } = req.query;
    let sql = `SELECT p.*, c.name AS category_name, u.name AS seller_name FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN users u ON p.seller_id=u.id WHERE p.status='active'`;
    const params = [];

    if (category) { params.push(category); sql += ` AND p.category_id=$${params.length}`; }
    if (search)   { params.push(`%${search}%`); sql += ` AND p.name ILIKE $${params.length}`; }
    if (hot)      { sql += ` AND p.is_hot=true`; }
    if (isNew)    { sql += ` AND p.is_new=true`; }

    const allowed = ['created_at','price','rating','review_count'];
    const col = allowed.includes(sort) ? sort : 'created_at';
    sql += ` ORDER BY p.${col} ${order === 'ASC' ? 'ASC' : 'DESC'} LIMIT $${params.length+1} OFFSET $${params.length+2}`;
    params.push(limit, offset);

    const { rows } = await query(sql, params);
    res.json({ products: rows, count: rows.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT p.*, c.name AS category_name, u.name AS seller_name FROM products p LEFT JOIN categories c ON p.category_id=c.id LEFT JOIN users u ON p.seller_id=u.id WHERE p.id=$1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, price, discount, category_id, stock, tags, is_hot, is_new, imageUrls, imageUrl } = req.body;
    let images = [];

    // Primary path: pre-uploaded Cloudinary URLs sent as JSON array
    if (imageUrls) {
      images = (Array.isArray(imageUrls) ? imageUrls : [imageUrls]).filter(u => u && u.startsWith('http'));
    }

    // Single URL fallback (CORS-blocked URL input)
    if (images.length === 0 && imageUrl && imageUrl.startsWith('http')) {
      images = [imageUrl];
    }

    // Legacy path: files sent directly in the multipart request
    if (images.length === 0 && req.files?.length) {
      const results = await Promise.allSettled(
        req.files.map(f => uploadBuffer(f.buffer, f.mimetype).then(r => r.url))
      );
      images = results.filter(r => r.status === 'fulfilled').map(r => r.value);
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length) {
        console.error('Cloudinary upload errors:', failed.map(r => r.reason?.message || 'unknown').join('; '));
      }
    }

    const { rows } = await query(
      `INSERT INTO products(seller_id,name,description,price,discount,category_id,images,stock,tags,is_hot,is_new)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [req.user.id, name, description, price, discount||0, category_id, images, stock, tags||[], is_hot||false, is_new||false]
    );
    res.status(201).json({ product: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const fields = ['name','description','price','discount','category_id','stock','tags','is_hot','is_new','status'];
    const updates = []; const params = [];
    fields.forEach(f => { if (req.body[f] !== undefined) { params.push(req.body[f]); updates.push(`${f}=$${params.length}`); } });
    if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    const { rows } = await query(`UPDATE products SET ${updates.join(',')} WHERE id=$${params.length} RETURNING *`, params);
    res.json({ product: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT r.*, u.name AS user_name, u.avatar_url FROM reviews r JOIN users u ON r.user_id=u.id WHERE r.product_id=$1 ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    res.json({ reviews: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { rows } = await query(
      `INSERT INTO reviews(product_id,user_id,rating,comment) VALUES($1,$2,$3,$4) ON CONFLICT(product_id,user_id) DO UPDATE SET rating=$3,comment=$4 RETURNING *`,
      [req.params.id, req.user.id, rating, comment]
    );
    // Update product avg rating
    await query(
      `UPDATE products SET rating=(SELECT AVG(rating) FROM reviews WHERE product_id=$1), review_count=(SELECT COUNT(*) FROM reviews WHERE product_id=$1) WHERE id=$1`,
      [req.params.id]
    );
    res.status(201).json({ review: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
