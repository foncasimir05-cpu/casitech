const { query } = require('../config/db');
exports.create       = async (req, res) => { const { name,email,subject,message } = req.body; const { rows } = await query('INSERT INTO support_tickets(user_id,name,email,subject,message) VALUES($1,$2,$3,$4,$5) RETURNING *',[req.user?.id||null,name,email,subject,message]); res.status(201).json({ ticket: rows[0] }); };
exports.getAll       = async (req, res) => { const { rows } = await query('SELECT * FROM support_tickets ORDER BY created_at DESC'); res.json({ tickets: rows }); };
exports.updateStatus = async (req, res) => { const { rows } = await query('UPDATE support_tickets SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING *',[req.body.status,req.params.id]); res.json({ ticket: rows[0] }); };
