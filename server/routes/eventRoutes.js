const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Public route: browse events with search and filters (Visitors have read-only access)
router.get('/', getEvents);

// Protected route: get events of authenticated user (must be before /:id)
router.get('/user/my-events', protect, getMyEvents);

// Public route: get single event details with creator and feedbacks
router.get('/:id', getEventById);

// Protected route: create event (Available to logged-in Event Organizers and Admins)
router.post('/', protect, createEvent);

// Protected routes: update & delete (Owner Event Organizer or Platform Admin)
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
