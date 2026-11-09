import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { fetchEventById, updateEvent, clearSuccess, clearEventsError } from '../redux/eventsSlice';
import EventForm from '../components/EventForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { Edit3, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { currentEvent: event, loading, error, success } = useSelector(
    (state) => state.events
  );

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearEventsError());
    dispatch(fetchEventById(id));
  }, [id, dispatch]);

  // Ownership check after event loads
  useEffect(() => {
    if (event && user) {
      const creatorId = event.author?._id || event.author;
      // Admin can edit any event; organizer only their own
      if (user.role !== 'admin' && creatorId && user._id !== creatorId) {
        alert('You are not authorized to edit this event.');
        navigate('/events');
      }
    }
  }, [event, user, navigate]);

  // Handle Redux success
  useEffect(() => {
    if (success) {
      setSuccessMessage('Event updated successfully! Redirecting...');
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        navigate(`/events/${id}`);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [success, id, navigate, dispatch]);

  // Handle Redux error
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      dispatch(clearEventsError());
    }
  }, [error, dispatch]);

  const handleUpdateEvent = (updatedData) => {
    setErrorMessage('');
    dispatch(updateEvent({ id, data: updatedData }));
  };

  if (loading) {
    return <LoadingSpinner text="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center text-slate-500">
        Event not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-2">
          <Edit3 className="w-3.5 h-3.5" />
          <span>Update Event</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight">
          Edit Event Details
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Modify the schedule, description, or location of your event
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-2xl">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold rounded-2xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10">
        <EventForm
          initialData={event}
          onSubmit={handleUpdateEvent}
          isSubmitting={loading}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
