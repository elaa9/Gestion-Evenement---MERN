import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { fetchEvents } from '../redux/eventsSlice';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Compass,
  Search,
  Sparkles,
  Laptop,
  Music,
  Trophy,
  Briefcase,
  GraduationCap,
  Palette,
  Layers,
  ArrowRight,
  CalendarCheck,
  PlusCircle
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Technology', icon: Laptop, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'Music', icon: Music, color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200' },
  { name: 'Sports', icon: Trophy, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'Business', icon: Briefcase, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'Education', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { name: 'Art & Culture', icon: Palette, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { name: 'Other', icon: Layers, color: 'text-slate-600 bg-slate-50 border-slate-200' }
];

export default function Home() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchEvents({ sortBy: 'date-asc' }));
  }, [dispatch]);

  const featuredEvents = events.slice(0, 6);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/events?keyword=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-brand-50/60 via-[#F8FAFC] to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/70 text-brand-700 text-xs font-semibold tracking-wide border border-brand-200 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Premier Event Discovery Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172033] tracking-tight leading-[1.15]">
              Discover Events. <br />
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 bg-clip-text text-transparent">
                Create Memories.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find upcoming tech summits, music festivals, business conferences, sports matches, and creative workshops near you or share your own with the world.
            </p>

            {/* Hero Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 max-w-xl mx-auto flex items-center bg-white p-2 rounded-2xl shadow-xl shadow-brand-500/5 border border-slate-200/80 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/20 transition-all"
            >
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search by event title, artist, or topic..."
                className="w-full px-3 py-2 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm flex-shrink-0"
              >
                Search
              </button>
            </form>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all text-sm"
              >
                <Compass className="w-4 h-4" />
                Explore All Events
              </Link>
              {user ? (
                <Link
                  to="/events/create"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#172033] font-semibold px-6 py-3 rounded-xl border border-slate-200 shadow-sm transition-all text-sm"
                >
                  <PlusCircle className="w-4 h-4 text-brand-600" />
                  Create Event
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#172033] font-semibold px-6 py-3 rounded-xl border border-slate-200 shadow-sm transition-all text-sm"
                >
                  Join as Organizer
                </Link>
              )}
            </div>

            {/* Platform Highlights / Stats */}
            <div className="pt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center border-t border-slate-200/60">
              <div>
                <p className="text-2xl font-extrabold text-[#172033]">100%</p>
                <p className="text-xs text-slate-500 font-medium">Free Discovery</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#172033]">7+</p>
                <p className="text-xs text-slate-500 font-medium">Event Categories</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#172033]">Verified</p>
                <p className="text-xs text-slate-500 font-medium">Ratings & Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse popular event domains curated for every passion
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 group"
          >
            <span>View all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all flex flex-col items-center text-center space-y-3"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 ${cat.color}`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
              Featured & Upcoming Events
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Hand-picked events happening in the coming weeks
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 group"
          >
            <span>Explore all events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading upcoming events..." />
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8">
            <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-700">No events found yet</h3>
            <p className="text-sm text-slate-400 mt-1">
              Be the first organizer to publish an event on EventHub!
            </p>
            <Link
              to="/events/create"
              className="mt-4 inline-block bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-brand-700 transition-colors"
            >
              Create an Event
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
