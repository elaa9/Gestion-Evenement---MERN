import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../redux/adminSlice';
import { deleteEvent } from '../redux/eventsSlice';
import feedbackService from '../services/feedbackService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Star,
  PlusCircle,
  Trash2,
  Edit3,
  ExternalLink,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Search,
  Layers
} from 'lucide-react';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };
  const [eventSearch, setEventSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteEventTarget, setDeleteEventTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const handleRefresh = () => dispatch(fetchAdminStats());

  const handleDeleteEvent = async () => {
    if (!deleteEventTarget) return;
    try {
      setDeleting(true);
      await dispatch(deleteEvent(deleteEventTarget._id)).unwrap();
      setDeleteEventTarget(null);
      dispatch(fetchAdminStats()); // refresh stats after delete
    } catch (err) {
      alert('Could not delete event');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Remove this review?')) return;
    try {
      await feedbackService.delete(feedbackId);
      dispatch(fetchAdminStats());
    } catch (err) {
      alert('Could not delete review');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Generating platform analytics & statistics..." />;
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#172033]">Failed to Load Statistics</h2>
          <p className="text-sm text-slate-500">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-brand-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, categoryStats, topRatedEvents, recentFeedbacks, allEvents } = stats;

  // Filtered events
  const filteredEvents = allEvents.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
      ev.location.toLowerCase().includes(eventSearch.toLowerCase()) ||
      (ev.author?.name && ev.author.name.toLowerCase().includes(eventSearch.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || ev.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-[#F8FAFC] min-h-screen text-[#172033]">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Platform Administration
          </div>
          <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight">Admin Statistics Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time insights across events, categories, users, and community reviews
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Refresh</span>
          </button>
          <Link
            to="/events/create"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Event
          </Link>
        </div>
      </div>

      {/* ── Tab Switcher ──────────────────────────────────────────── */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'reviews', label: 'Reviews', icon: MessageSquare },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === id
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ─────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Events */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Events</p>
                <h3 className="text-2xl font-extrabold text-[#172033] mt-0.5">{summary.totalEvents}</h3>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> Live & Published
                </p>
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Registered Users</p>
                <h3 className="text-2xl font-extrabold text-[#172033] mt-0.5">{summary.totalUsers}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                  <span className="bg-brand-100 text-brand-800 font-bold px-1.5 py-0.5 rounded">
                    {summary.usersByRole?.admin || 1} Admin
                  </span>
                  <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                    {summary.usersByRole?.organizer || 0} Organizers
                  </span>
                </div>
              </div>
            </div>

            {/* Total Reviews */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reviews</p>
                <h3 className="text-2xl font-extrabold text-[#172033] mt-0.5">{summary.totalFeedbacks}</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">1 Review / User (cumulative)</p>
              </div>
            </div>

            {/* Overall Rating */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Star className="w-7 h-7 fill-brand-500 text-brand-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overall Rating</p>
                <h3 className="text-2xl font-extrabold text-[#172033] mt-0.5">
                  {summary.overallAvgRating > 0 ? `${summary.overallAvgRating} / 5` : 'No reviews'}
                </h3>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= Math.round(summary.overallAvgRating)
                          ? 'fill-brand-500 text-brand-500'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution + Top Rated */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Progress */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#172033]">Category Distribution</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Event volume per interest domain</p>
                </div>
                <Layers className="w-5 h-5 text-brand-600" />
              </div>
              <div className="space-y-4">
                {categoryStats.map((item) => {
                  const pct = summary.totalEvents > 0
                    ? Math.round((item.count / summary.totalEvents) * 100)
                    : 0;
                  return (
                    <div key={item._id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{item._id}</span>
                        <span className="text-slate-400 font-medium">
                          {item.count} event{item.count !== 1 && 's'} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Rated Events */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#172033]">Highest Rated Events</h2>
                  <p className="text-xs text-slate-400 mt-0.5">By attendee community ratings</p>
                </div>
                <Sparkles className="w-5 h-5 text-brand-600" />
              </div>
              <div className="space-y-3">
                {topRatedEvents.length > 0 ? (
                  topRatedEvents.map((ev, i) => (
                    <div
                      key={ev._id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-brand-50/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-black flex items-center justify-center flex-shrink-0">
                          #{i + 1}
                        </span>
                        <div className="truncate">
                          <Link to={`/events/${ev._id}`} className="text-xs font-bold text-[#172033] hover:text-brand-600 truncate block">
                            {ev.title}
                          </Link>
                          <span className="text-[10px] text-slate-400">{ev.category} • {ev.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-brand-600 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-brand-500 text-brand-500" />
                        {ev.averageRating}
                        <span className="text-[10px] text-slate-400 font-normal">({ev.feedbackCount})</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No rated events yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: EVENTS ───────────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#172033]">Platform Events Management</h2>
              <p className="text-xs text-slate-400 mt-0.5">Edit or delete any event across the entire platform</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events, organizers..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600 bg-slate-50 w-44 sm:w-56"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-600 bg-slate-50 text-slate-700"
              >
                <option value="all">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Art & Culture">Art & Culture</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Event Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Venue</th>
                  <th className="py-3 px-3">Organizer</th>
                  <th className="py-3 px-3 text-center">Reviews</th>
                  <th className="py-3 px-3 text-center">Rating</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((ev) => (
                    <tr key={ev._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-[#172033] max-w-[220px] truncate">
                        <Link to={`/events/${ev._id}`} className="hover:text-brand-600">{ev.title}</Link>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold text-[11px]">
                          {ev.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(ev.date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 max-w-[150px] truncate">{ev.location}</td>
                      <td className="py-3.5 px-3 text-slate-700 font-medium">{ev.author?.name || 'Organizer'}</td>
                      <td className="py-3.5 px-3 text-center font-semibold text-slate-600">{ev.feedbackCount}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-brand-600">
                          <Star className="w-3 h-3 fill-brand-500 text-brand-500" />
                          {ev.averageRating > 0 ? ev.averageRating : '—'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link to={`/events/${ev._id}`} className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors" title="View">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link to={`/events/edit/${ev._id}`} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors" title="Edit">
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeleteEventTarget(ev)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-slate-400">
                      No events match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: REVIEWS ──────────────────────────────────────────── */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#172033]">Attendee Reviews — Moderation Feed</h2>
              <p className="text-xs text-slate-400 mt-0.5">Remove spam, abusive, or inappropriate feedback</p>
            </div>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              {recentFeedbacks.length} Monitored
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentFeedbacks.map((fb) => (
              <div
                key={fb._id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between gap-2 hover:bg-brand-50/30 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="truncate">
                      <span className="text-xs font-bold text-[#172033] mr-1.5">{fb.author?.name || 'Attendee'}</span>
                      <span className="text-[10px] text-slate-400">
                        reviewed <strong className="text-slate-600">{fb.event?.title || 'an event'}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= fb.rating ? 'fill-brand-500 text-brand-500' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic line-clamp-2">"{fb.message}"</p>
                </div>

                <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDeleteFeedback(fb._id)}
                    className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Delete Event Modal ─────────────────────────────────────── */}
      {deleteEventTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[#172033]">Admin Moderation: Delete Event?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Delete <strong className="text-slate-800">"{deleteEventTarget.title}"</strong>?
                This permanently removes it and all associated attendee feedback.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteEventTarget(null)}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
