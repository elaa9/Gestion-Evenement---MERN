const Event = require('../models/Event');
const Feedback = require('../models/Feedback');

/**
 * @desc    Get all events with search, filtering, and sorting
 * @route   GET /api/events
 * @access  Public (Visitors, Organizers, Admins)
 */
const getEvents = async (req, res, next) => {
  try {
    const { keyword, category, location, sortBy } = req.query;

    const query = {};

    // 1. Text search by title or description
    if (keyword && keyword.trim() !== '') {
      query.$or = [
        { title: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } }
      ];
    }

    // 2. Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // 3. Filter by location
    if (location && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Sorting configuration
    let sortOption = { date: 1 }; // Default: upcoming date ascending
    if (sortBy === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sortBy === 'date-desc') {
      sortOption = { date: -1 };
    } else if (sortBy === 'title') {
      sortOption = { title: 1 };
    }

    const events = await Event.find(query)
      .populate('author', 'name email role')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single event by ID with creator and feedbacks
 * @route   GET /api/events/:id
 * @access  Public (Visitors, Organizers, Admins)
 */
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('author', 'name email role');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Retrieve feedbacks for this event with author details
    const feedbacks = await Feedback.find({ event: event._id })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating =
      feedbacks.length > 0
        ? Number(
            (
              feedbacks.reduce((acc, item) => acc + item.rating, 0) /
              feedbacks.length
            ).toFixed(1)
          )
        : 0;

    res.status(200).json({
      success: true,
      data: {
        ...event.toObject(),
        feedbacks,
        feedbacksCount: feedbacks.length,
        averageRating
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    next(error);
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Event Organizers and Admins)
 */
const createEvent = async (req, res, next) => {
  try {
    const { title, description, category, date, location, imageUrl } = req.body;

    if (!title || !description || !category || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required event details'
      });
    }

    // Validation: prevent past event dates
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    const now = new Date();
    if (eventDate < new Date(now.setHours(0, 0, 0, 0))) {
      return res.status(400).json({
        success: false,
        message: 'Event date cannot be in the past'
      });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      category,
      date: eventDate,
      location: location.trim(),
      imageUrl: imageUrl && imageUrl.trim() !== '' ? imageUrl.trim() : undefined,
      author: req.user._id
    });

    const populatedEvent = await event.populate('author', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (Owner Event Organizer or Platform Admin)
 */
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Role-Based Authorization: Event Owner OR Admin can update
    const isOwner = event.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to edit this event'
      });
    }

    const { title, description, category, date, location, imageUrl } = req.body;

    if (date) {
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid date format' });
      }
      event.date = eventDate;
    }

    if (title) event.title = title.trim();
    if (description) event.description = description.trim();
    if (category) event.category = category;
    if (location) event.location = location.trim();
    if (imageUrl !== undefined) event.imageUrl = imageUrl.trim();

    const updatedEvent = await event.save();
    const populated = await updatedEvent.populate('author', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: populated
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    next(error);
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (Owner Event Organizer or Platform Admin)
 */
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Role-Based Authorization: Event Owner OR Admin can delete
    const isOwner = event.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this event'
      });
    }

    // Cascade delete associated feedbacks
    await Feedback.deleteMany({ event: event._id });

    // Delete event
    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event and associated feedback deleted successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    next(error);
  }
};

/**
 * @desc    Get all events published by the authenticated user
 * @route   GET /api/events/user/my-events
 * @access  Private (Event Organizers and Admins)
 */
const getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ author: req.user._id })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
};
