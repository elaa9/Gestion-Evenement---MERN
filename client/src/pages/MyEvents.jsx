import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchMyEvents, deleteEvent } from '../redux/eventsSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FolderHeart,
  Calendar,
  MapPin,
  PlusCircle,
  Edit3,
  Trash2,
  ExternalLink,
  CalendarX,
  AlertTriangle
} from 'lucide-react';

export default function MyEvents() {
  const dispatch = useDispatch();
  const { myEvents: events, loading, error } = useSelector((state) => state.events);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await dispatch(deleteEvent(deleteTarget._id)).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      alert(err || 'Could not delete event');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-2">
            <FolderHeart className="w-3.5 h-3.5" />
            <span>Personal Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight">
            Manage My Events
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track, update, or remove events you have published on EventHub
          </p>
        </div>

        <Link
          to="/events/create"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Event
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading your events..." />
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center text-sm font-semibold">
          {error}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const formattedDate = !isNaN(eventDate.getTime())
              ? eventDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Date TBD';

            return (
              <div
                key={event._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Event Image */}
                <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                  <img
                    src={
                      event.imageUrl ||
                      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-brand-700 shadow-sm">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Event Meta */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#172033] line-clamp-1">
                    {event.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/events/${event._id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                      title="View public page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/events/edit/${event._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#172033] bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(event)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto text-brand-600">
            <CalendarX className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#172033]">
              You haven't created any events yet
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Publish your first event to start connecting with attendees and collecting reviews.
            </p>
          </div>
          <Link
            to="/events/create"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create Your First Event
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#172033]">Delete this event?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-800">"{deleteTarget.title}"</strong>? This will permanently remove the event and all associated attendee feedback.
              </p>
            </div>
            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
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
