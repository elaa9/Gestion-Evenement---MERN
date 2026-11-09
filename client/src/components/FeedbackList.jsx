import { Star, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FeedbackList({ feedbacks = [], onDeleteFeedback }) {
  const { user } = useAuth();

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-600">No feedback yet</h4>
        <p className="text-xs text-slate-400 mt-1">
          Be the first to share your thoughts and rate this event!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((item) => {
        const isAuthor = user && item.author && (user._id === item.author._id || user._id === item.author);
        const isAdmin = user && user.role === 'admin';
        const canDelete = isAuthor || isAdmin;

        const itemDate = new Date(item.createdAt);
        const formattedDate = !isNaN(itemDate.getTime())
          ? itemDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
          : '';

        const authorName = item.author?.name || 'Attendee';
        const initial = authorName.charAt(0).toUpperCase();
        const authorRole = item.author?.role;

        return (
          <div
            key={item._id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm border border-brand-100">
                  {initial}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#172033]">{authorName}</h4>
                    {authorRole === 'admin' ? (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5 text-brand-600" />
                        Admin
                      </span>
                    ) : authorRole === 'organizer' ? (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-brand-600" />
                        Organizer
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-400">{formattedDate}</p>
                </div>
              </div>

              {/* Star Rating and Delete button if author or admin */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= item.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>

                {canDelete && (
                  <button
                    onClick={() => onDeleteFeedback(item._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={isAdmin && !isAuthor ? 'Admin Moderation: Delete review' : 'Delete your review'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pl-12">
              {item.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}
