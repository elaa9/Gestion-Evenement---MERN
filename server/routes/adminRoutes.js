const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protected: Only Admin can access the stats dashboard
router.get('/stats', protect, authorize('admin'), getAdminStats);

module.exports = router;
