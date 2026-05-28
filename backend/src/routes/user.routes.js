const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/user.controller');

router.get('/profile',          protect, ctrl.getProfile);
router.put('/profile',          protect, ctrl.updateProfile);
router.get('/wishlist',         protect, ctrl.getWishlist);
router.post('/wishlist/:id',    protect, ctrl.toggleWishlist);
router.get('/all',              protect, requireRole('admin'), ctrl.getAll);
router.patch('/:id/role',       protect, requireRole('admin'), ctrl.updateRole);

module.exports = router;
