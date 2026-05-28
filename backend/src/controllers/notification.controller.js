const { query } = require('../config/db');
exports.getAll      = async (req, res) => { const { rows } = await query('SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC',[req.user.id]); res.json({ notifications: rows }); };
exports.markRead    = async (req, res) => { await query('UPDATE notifications SET is_read=true WHERE id=$1 AND user_id=$2',[req.params.id,req.user.id]); res.json({ message: 'Marked read' }); };
exports.markAllRead = async (req, res) => { await query('UPDATE notifications SET is_read=true WHERE user_id=$1',[req.user.id]); res.json({ message: 'All read' }); };
