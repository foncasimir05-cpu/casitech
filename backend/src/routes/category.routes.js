const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/category.controller');

router.get('/',         ctrl.getAll);
router.post('/',        protect, requireRole('admin'), ctrl.create);
router.put('/:id',      protect, requireRole('admin'), ctrl.update);
router.delete('/:id',   protect, requireRole('admin'), ctrl.remove);

module.exports = router;
