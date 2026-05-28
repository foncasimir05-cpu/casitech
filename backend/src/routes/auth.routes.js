const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/auth.controller');

router.post('/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  validate, ctrl.register
);
router.post('/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate, ctrl.login
);
router.get('/me',         protect, ctrl.getMe);
router.post('/logout',    protect, ctrl.logout);
router.get('/google',               ctrl.googleAuth);
router.get('/google/callback',      ctrl.googleCallback);

module.exports = router;
