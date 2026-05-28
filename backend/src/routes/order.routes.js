const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/order.controller');

router.post('/',                    protect, ctrl.create);
router.get('/',                     protect, ctrl.getUserOrders);
router.get('/all',                  protect, requireRole('admin'), ctrl.getAll);
router.get('/:id',                  protect, ctrl.getOne);
router.patch('/:id/status',         protect, requireRole('admin'), ctrl.updateStatus);

module.exports = router;
