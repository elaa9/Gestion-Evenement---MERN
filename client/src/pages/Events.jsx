import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { fetchEvents } from '../redux/eventsSlice';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Compass, CalendarX, Eye } from 'lucide-react';

export default function Events() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filter state from URL params
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'date-asc');

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (keyword.trim()) params.keyword = keyword.trim();
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    if (location.trim()) params.location = location.trim();
    if (sortBy && sortBy !== 'date-asc') params.sortBy = sortBy;
    setSearchParams(params, { replace: true });
  }, [keyword, selectedCategory, location, sortBy, setSearchParams]);

  // Fetch events when filters change (debounced)
  useEffect(() => {
    const queryParams = {
      keyword: keyword.trim() || undefined,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      location: location.trim() || undefined,
      sortBy,
    };

    const timeoutId = setTimeout(() => {
      dispatch(fetchEvents(queryParams));
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [keyword, selectedCategory, location, sortBy, dispatch]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setLocation('');
    setSortBy('date-asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover & Browse</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#172033] tracking-tight">
            Explore Upcoming Events
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover community meetups, technical conferences, concerts, and gatherings
          </p>
        </div>

        {/* Total Count pill */}
        <div className="self-start md:self-auto">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            {events.length} {events.length === 1 ? 'Event found' : 'Events found'}
          </span>
        </div>
      </div>

      {/* Visitor Mode Banner (Lecture Seule) */}
      {!user && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-200/80 text-slate-700 flex items-center justify-center flex-shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-[#172033] block">Mode Visiteur (Lecture Seule)</strong>
              <span>Vous consultez librement le catalogue d'événements. Connectez-vous pour publier un événement ou donner votre avis.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/login" className="px-3 py-1.5 bg-white border border-slate-300 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
              Connexion
            </Link>
            <Link to="/register" className="px-3 py-1.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors">
              Rejoindre (Organisateur)
            </Link>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <SearchBar
        keyword={keyword}
        setKeyword={setKeyword}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        location={location}
        setLocation={setLocation}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Events Grid or Status State */}
      {loading ? (
        <LoadingSpinner text="Searching for events..." />
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center">
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={handleResetFilters}
            className="mt-3 text-xs font-bold underline hover:text-rose-900"
          >
            Reset all filters
          </button>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
            <CalendarX className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#172033]">
              No events found matching your criteria
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search terms, changing the category, or clearing the location filter.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
