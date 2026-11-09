const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Please provide feedback comments'],
      trim: true,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars']
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Enforce single cumulative review per attendee per event
feedbackSchema.index({ event: 1, author: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
