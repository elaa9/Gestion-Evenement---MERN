const express = require('express');
const router = express.Router();
const {
  getEventFeedback,
  createFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// Public route: get feedback list for an event
router.get('/event/:eventId', getEventFeedback);

// Protected route: publish feedback for an event
router.post('/event/:eventId', protect, createFeedback);

// Protected route: delete feedback (author only)
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
