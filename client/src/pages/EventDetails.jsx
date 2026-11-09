import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { fetchEventById, deleteEvent } from '../redux/eventsSlice';
import { submitFeedback, removeFeedback } from '../redux/feedbackSlice';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import LoadingSpinner from '../components/LoadingSpinner';
import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Star,
  Edit3,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  Lock,
  Share2,
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();

  const { currentEvent: event, loading, error } = useSelector((state) => state.events);
  const { loading: feedbackLoading } = useSelector((state) => state.feedback);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [id, dispatch]);

  const feedbacks = event?.feedbacks || [];

  const handleFeedbackSubmit = async (feedbackData, resetForm) => {
    try {
      await dispatch(submitFeedback({ eventId: id, data: feedbackData })).unwrap();
      resetForm();
    } catch (err) {
      alert(err || 'Failed to submit feedback');
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await dispatch(removeFeedback(feedbackId)).unwrap();
      // Refresh event to update feedbacks list + averageRating
      dispatch(fetchEventById(id));
    } catch (err) {
      alert('Could not delete feedback');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      setDeleting(true);
      await dispatch(deleteEvent(id)).unwrap();
      navigate('/events');
    } catch (err) {
      alert(err || 'Could not delete event');
      setDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return <LoadingSpinner text="Loading event details..." />;
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-[#172033]">Event Not Found</h2>
          <p className="text-sm text-slate-500">
            {error || "The event you are looking for does not exist or may have been deleted."}
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-brand-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Events
          </Link>
        </div>
      </div>
    );
  }

  // Check if current user is owner OR admin
  const isOwner =
    user &&
    event.author &&
    (user._id === event.author._id || user._id === event.author);

  const isAdmin = user && user.role === 'admin';
  const canModify = isOwner || isAdmin;

  const eventDate = new Date(event.date);
  const formattedDate = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Date TBD';

  const formattedTime = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  const pubDate = new Date(event.createdAt);
  const formattedPubDate = !isNaN(pubDate.getTime())
    ? pubDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back link and Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Owner or Admin Actions: Edit and Delete */}
          {canModify && (
            <div className="flex items-center gap-2">
              {isAdmin && !isOwner && (
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-brand-100 text-brand-800 border border-brand-300">
                  Admin Moderate
                </span>
              )}
              <Link
                to={`/events/edit/${event._id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Event Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Banner image */}
        <div className="relative aspect-[21/9] max-h-96 w-full bg-slate-100 overflow-hidden">
          <img
            src={
              event.imageUrl ||
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
            }
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/95 text-brand-700 border border-brand-200 shadow-sm">
              {event.category}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight leading-snug">
              {event.title}
            </h1>

            {/* Author, Role and Published Date */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-600" />
                <span>
                  Organized by{' '}
                  <strong className="text-slate-700">{event.author?.name || 'Organizer'}</strong>
                </span>
                {event.author?.role === 'admin' ? (
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-100 text-brand-800">
                    Admin
                  </span>
                ) : event.author?.role === 'organizer' ? (
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-100 text-brand-800">
                    Organizer
                  </span>
                ) : null}
              </div>
              <span>•</span>
              <div>Published on {formattedPubDate}</div>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>
                  {event.averageRating > 0 ? `${event.averageRating} / 5` : 'New Event'}{' '}
                  ({feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Grid (Date, Time, Location) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Date & Time
                </p>
                <p className="text-sm font-bold text-[#172033] mt-0.5">{formattedDate}</p>
                {formattedTime && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" /> Starts at {formattedTime}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Location & Venue
                </p>
                <p className="text-sm font-bold text-[#172033] mt-0.5">{event.location}</p>
                <p className="text-xs text-slate-500 mt-0.5">Verified Venue</p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <h2 className="text-lg font-bold text-[#172033]">About This Event</h2>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {event.description}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Feedback Section */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172033]">
              Attendee Feedback & Reviews
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Read genuine ratings from community participants
            </p>
          </div>

          {/* Average Rating Scorecard */}
          <div className="flex items-center gap-3 bg-brand-50/60 border border-brand-100 px-4 py-2.5 rounded-2xl self-start sm:self-auto">
            <div className="text-3xl font-extrabold text-brand-700">
              {event.averageRating > 0 ? event.averageRating : '—'}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(event.averageRating)
                        ? 'fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Based on {feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Review Form (Authenticated) or Prompt to Login (Visiteur) */}
        {isAuthenticated ? (
          <FeedbackForm
            onSubmit={handleFeedbackSubmit}
            isSubmitting={feedbackLoading}
            existingFeedback={feedbacks.find(
              (f) =>
                user &&
                f.author &&
                (f.author._id === user._id || f.author === user._id)
            )}
          />
        ) : (
          <div className="bg-slate-50/80 rounded-2xl p-6 text-center border border-slate-200/90 space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-200/70 text-slate-500 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full mb-1">
                Mode Visiteur (Lecture Seule)
              </span>
              <h3 className="text-sm font-bold text-slate-800">
                Vous consultez cet événement en mode visiteur
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              La consultation des détails et avis est libre. Pour publier un avis ou gérer des événements, connectez-vous ou rejoignez EventHub en tant qu'Organisateur.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/login"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Devenir Organisateur
              </Link>
            </div>
          </div>
        )}

        {/* List of Feedbacks */}
        <div>
          <FeedbackList
            feedbacks={feedbacks}
            onDeleteFeedback={handleDeleteFeedback}
          />
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#172033]">
                {isAdmin && !isOwner ? 'Admin Moderation: Delete Event' : 'Delete this event?'}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-800">"{event.title}"</strong>? This will permanently remove the event and all associated attendee feedback. This action cannot be undone.
              </p>
            </div>
            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteEvent}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
