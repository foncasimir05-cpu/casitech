const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/cart.controller');

router.get('/',          protect, ctrl.getCart);
router.post('/add',      protect, ctrl.addItem);
router.put('/:id',       protect, ctrl.updateQty);
router.delete('/:id',    protect, ctrl.removeItem);
router.delete('/',       protect, ctrl.clearCart);

module.exports = router;
