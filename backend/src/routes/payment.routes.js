const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/payment.controller');

// Admin confirms a MoMo payment manually
router.post('/:orderId/confirm-momo', protect, requireRole('admin'), ctrl.confirmMomo);

module.exports = router;
