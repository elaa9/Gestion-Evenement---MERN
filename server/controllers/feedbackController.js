const Feedback = require('../models/Feedback');
const Event = require('../models/Event');

/**
 * @desc    Get all feedback for an event
 * @route   GET /api/feedback/event/:eventId
 * @access  Public
 */
const getEventFeedback = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const feedbacks = await Feedback.find({ event: eventId })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Invalid event ID' });
    }
    next(error);
  }
};

/**
 * @desc    Publish or update feedback for an event (One cumulative review per attendee)
 * @route   POST /api/feedback/event/:eventId
 * @access  Private
 */
const createFeedback = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { message, rating } = req.body;

    if (!message || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both a message and a star rating'
      });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if the attendee has already reviewed this event
    const existingFeedback = await Feedback.findOne({
      event: event._id,
      author: req.user._id
    });

    if (existingFeedback) {
      // Cumulative Update: modify the user's existing rating and feedback message
      existingFeedback.rating = numericRating;
      existingFeedback.message = message.trim();
      await existingFeedback.save();

      const populatedFeedback = await existingFeedback.populate('author', 'name email role');

      return res.status(200).json({
        success: true,
        message: 'Your review and rating have been updated successfully',
        data: populatedFeedback,
        isUpdate: true
      });
    }

    // Otherwise, create a new feedback entry
    const feedback = await Feedback.create({
      message: message.trim(),
      rating: numericRating,
      event: event._id,
      author: req.user._id
    });

    const populatedFeedback = await feedback.populate('author', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: populatedFeedback,
      isUpdate: false
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete feedback (Author or Admin)
 * @route   DELETE /api/feedback/:id
 * @access  Private
 */
const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    const isAuthor = feedback.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own feedback or require admin privileges'
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Feedback removed successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Invalid feedback ID' });
    }
    next(error);
  }
};

module.exports = {
  getEventFeedback,
  createFeedback,
  deleteFeedback
};
