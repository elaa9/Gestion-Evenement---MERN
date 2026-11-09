const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select an event category'],
      enum: {
        values: [
          'Technology',
          'Music',
          'Sports',
          'Business',
          'Education',
          'Art & Culture',
          'Other'
        ],
        message: '{VALUE} is not a valid category'
      }
    },
    date: {
      type: Date,
      required: [true, 'Please provide the event date and time']
    },
    location: {
      type: String,
      required: [true, 'Please provide the event location or venue'],
      trim: true
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      trim: true
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

// Index for search queries on title and description
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
