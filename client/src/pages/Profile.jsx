import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { fetchMyEvents } from '../redux/eventsSlice';
import authService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Mail,
  Calendar,
  FolderHeart,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, updateUser } = useAuth();
  const { myEvents: events, loading: loadingEvents } = useSelector((state) => state.events);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg('Name cannot be blank');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');
      const res = await authService.updateProfile({ name: nameInput.trim() });
      if (res.success && res.data) {
        updateUser(res.data);
        setEditingName(false);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Update profile error', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'Member';

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const renderRoleBadge = () => {
    if (user?.role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1 rounded-full bg-brand-100 text-brand-900 border border-brand-300 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          Platform Administrator
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1 rounded-full bg-brand-100 text-brand-900 border border-brand-300 shadow-2xs">
        <Sparkles className="w-4 h-4 text-brand-600" />
        Event Organizer
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-2xl animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold rounded-2xl animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            {userInitial}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {editingName ? (
                <form onSubmit={handleUpdateName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-lg font-bold focus:outline-none focus:border-brand-600"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-brand-600 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-brand-700 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingName(false);
                      setNameInput(user?.name || '');
                    }}
                    className="text-slate-500 text-xs px-2 py-1 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-[#172033] tracking-tight">
                    {user?.name}
                  </h1>
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-1 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Edit Name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {renderRoleBadge()}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-600" />
                <span>{user?.email}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>Joined in {memberDate}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <FolderHeart className="w-3.5 h-3.5 text-brand-600" />
                <span>{events.length} Events Organized</span>
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="mt-3 p-3 bg-brand-50 rounded-xl border border-brand-200 text-brand-900 text-xs">
                <strong>Administrator Privileges:</strong> You have moderation authority to edit or delete any event and remove inappropriate attendee reviews across the entire platform.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User's Published Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#172033]">Your Published Events</h2>
          <Link
            to="/events/create"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 underline"
          >
            + Create New Event
          </Link>
        </div>

        {loadingEvents ? (
          <LoadingSpinner text="Loading published events..." />
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
                    {ev.category}
                  </span>
                  <h3 className="font-bold text-[#172033] text-base mt-2 line-clamp-1">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {new Date(ev.date).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/events/${ev._id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
            You haven't published any events yet.
          </div>
        )}
      </div>
    </div>
  );
}
