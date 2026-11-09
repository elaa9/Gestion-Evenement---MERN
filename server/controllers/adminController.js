const Event = require('../models/Event');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

/**
 * @desc    Get comprehensive analytics and platform statistics for Admin Dashboard
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
const getAdminStats = async (req, res, next) => {
  try {
    // 1. High-level totals
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();

    // 2. Users grouped by role (strictly admin & organizer)
    const usersByRoleRaw = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    const usersByRole = {
      admin: 0,
      organizer: 0
    };
    usersByRoleRaw.forEach((item) => {
      if (item._id) usersByRole[item._id] = item.count;
    });

    // 3. Category distribution
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 4. Overall average rating across all feedbacks
    const ratingAggregate = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' }
        }
      }
    ]);
    const overallAvgRating =
      ratingAggregate.length > 0
        ? Number(ratingAggregate[0].avgRating.toFixed(1))
        : 0;

    // 5. All events with their feedbacks and authors for the management table
    const allEventsRaw = await Event.find()
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });

    const allEvents = await Promise.all(
      allEventsRaw.map(async (ev) => {
        const feedbacks = await Feedback.find({ event: ev._id }).select('rating');
        const avg =
          feedbacks.length > 0
            ? Number(
                (
                  feedbacks.reduce((acc, f) => acc + f.rating, 0) /
                  feedbacks.length
                ).toFixed(1)
              )
            : 0;
        return {
          ...ev.toObject(),
          feedbackCount: feedbacks.length,
          averageRating: avg
        };
      })
    );

    // 6. Top 5 highest rated events (minimum 1 review)
    const topRatedEvents = [...allEvents]
      .filter((ev) => ev.feedbackCount > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    // 7. Recent feedback activity for moderation
    const recentFeedbacks = await Feedback.find()
      .populate('author', 'name email role')
      .populate('event', 'title')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalEvents,
          totalUsers,
          totalFeedbacks,
          overallAvgRating,
          usersByRole
        },
        categoryStats,
        topRatedEvents,
        recentFeedbacks,
        allEvents
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats
};
