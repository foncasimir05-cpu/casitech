const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const ctrl = require('../controllers/upload.controller');

router.post('/image', protect, requireRole('admin','seller'), upload.single('image'), ctrl.uploadImage);

module.exports = router;
router.post('/analyze', protect, requireRole('admin','seller'), ctrl.analyzeImage);