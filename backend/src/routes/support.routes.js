const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/support.controller');

router.post('/',        ctrl.create);
router.get('/',         protect, requireRole('admin'), ctrl.getAll);
router.patch('/:id',    protect, requireRole('admin'), ctrl.updateStatus);

module.exports = router;
