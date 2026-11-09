import { useState, useEffect } from 'react';
import { Star, Send, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function FeedbackForm({ onSubmit, isSubmitting, existingFeedback }) {
  const [rating, setRating] = useState(existingFeedback ? existingFeedback.rating : 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState(existingFeedback ? existingFeedback.message : '');
  const [error, setError] = useState('');

  // Sync if existingFeedback loads or changes
  useEffect(() => {
    if (existingFeedback) {
      setRating(existingFeedback.rating);
      setMessage(existingFeedback.message);
    }
  }, [existingFeedback]);

  const isUpdateMode = Boolean(existingFeedback);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please share a few words about your experience');
      return;
    }
    setError('');
    onSubmit({ rating, message: message.trim() }, () => {
      if (!isUpdateMode) {
        setMessage('');
        setRating(5);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-base font-bold text-[#172033]">
          {isUpdateMode ? 'Update Your Cumulative Rating & Review' : 'Leave a Review & Rating'}
        </h3>
        {isUpdateMode && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            1 Rating Per Attendee (Cumulative)
          </span>
        )}
      </div>

      {isUpdateMode && (
        <p className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
          ℹ️ You have previously reviewed this event. Modifying your stars or feedback here will update your cumulative review and recalculate the overall event score.
        </p>
      )}

      {/* Star Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Your Rating
        </label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const activeStar = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transition-transform hover:scale-110"
                aria-label={`Rate ${star} star`}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    activeStar
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300 hover:text-amber-300'
                  }`}
                />
              </button>
            );
          })}
          <span className="ml-2 text-sm font-semibold text-slate-700">
            {rating} of 5 {rating === 1 ? 'star' : 'stars'}
          </span>
        </div>
      </div>

      {/* Review Comment */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Your Feedback
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError('');
          }}
          placeholder="Share your experience, highlights, or tips for future attendees..."
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all leading-relaxed ${
            error
              ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-200 bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
          }`}
        ></textarea>
        {error && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Saving...</span>
            </>
          ) : isUpdateMode ? (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Update My Review</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Post Feedback</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
