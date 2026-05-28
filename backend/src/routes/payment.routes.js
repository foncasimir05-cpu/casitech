const router = require('express').Router();
const { protect } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/payment.controller');

router.post('/create-checkout', protect, ctrl.createCheckout); // order + intent in one shot
router.post('/create-intent',   protect, ctrl.createIntent);   // intent only (existing)
router.post('/confirm',         protect, ctrl.confirm);
// /webhook is registered directly in index.js with express.raw() before express.json()

module.exports = router;
