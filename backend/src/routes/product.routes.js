const router = require('express').Router();
const { protect, requireRole, optionalAuth } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const ctrl = require('../controllers/product.controller');

router.get('/',           optionalAuth, ctrl.getAll);
router.get('/:id',        optionalAuth, ctrl.getOne);
router.post('/',          protect, requireRole('admin','seller'), upload.array('images', 5), ctrl.create);
router.put('/:id',        protect, requireRole('admin','seller'), ctrl.update);
router.delete('/:id',     protect, requireRole('admin'),          ctrl.remove);
router.get('/:id/reviews',                                         ctrl.getReviews);
router.post('/:id/reviews', protect,                               ctrl.addReview);

module.exports = router;
