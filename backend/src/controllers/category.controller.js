const { query } = require('../config/db');
exports.getAll    = async (req, res) => { const { rows } = await query('SELECT * FROM categories ORDER BY id'); res.json({ categories: rows }); };
exports.create    = async (req, res) => { const { name,icon,slug,parent_id } = req.body; const { rows } = await query('INSERT INTO categories(name,icon,slug,parent_id) VALUES($1,$2,$3,$4) RETURNING *',[name,icon,slug,parent_id]); res.status(201).json({ category: rows[0] }); };
exports.update    = async (req, res) => { const { name,icon } = req.body; const { rows } = await query('UPDATE categories SET name=$1,icon=$2 WHERE id=$3 RETURNING *',[name,icon,req.params.id]); res.json({ category: rows[0] }); };
exports.remove    = async (req, res) => { await query('DELETE FROM categories WHERE id=$1',[req.params.id]); res.json({ message: 'Deleted' }); };
