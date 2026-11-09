import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent, clearSuccess, clearEventsError } from '../redux/eventsSlice';
import EventForm from '../components/EventForm';
import { CalendarPlus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CreateEvent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: isSubmitting, error, success, currentEvent } = useSelector(
    (state) => state.events
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset status on mount
  useEffect(() => {
    dispatch(clearSuccess());
    dispatch(clearEventsError());
  }, [dispatch]);

  // Redirect on success
  useEffect(() => {
    if (success && currentEvent) {
      setSuccessMessage('Event published successfully! Redirecting...');
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        navigate(`/events/${currentEvent._id}`);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [success, currentEvent, navigate, dispatch]);

  // Show error from Redux
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      dispatch(clearEventsError());
    }
  }, [error, dispatch]);

  const handleCreateEvent = (eventData) => {
    setErrorMessage('');
    dispatch(createEvent(eventData));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-2">
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>Publish an Event</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight">
          Create a New Event
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Share your conference, meetup, festival, or workshop with the EventHub community
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-2xl animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold rounded-2xl animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Card with Form */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10">
        <EventForm
          onSubmit={handleCreateEvent}
          isSubmitting={isSubmitting}
          submitLabel="Publish Event Now"
        />
      </div>
    </div>
  );
}
