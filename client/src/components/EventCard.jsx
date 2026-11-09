import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowRight } from 'lucide-react';

const categoryColorMap = {
  Technology: 'bg-blue-50 text-blue-700 border-blue-200',
  Music: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Business: 'bg-amber-50 text-amber-700 border-amber-200',
  Education: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Art & Culture': 'bg-rose-50 text-rose-700 border-rose-200',
  Other: 'bg-slate-50 text-slate-700 border-slate-200'
};

export default function EventCard({ event }) {
  const eventDate = new Date(event.date);

  const formattedDate = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleDateString('en-US', {
        month: 'short',
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

  const categoryStyle =
    categoryColorMap[event.category] || categoryColorMap.Other;

  return (
    <article className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Event Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
          }}
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-sm backdrop-blur-sm bg-white/90 ${categoryStyle}`}
          >
            {event.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Date and Time */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {formattedDate} {formattedTime && `• ${formattedTime}`}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#172033] line-clamp-2 group-hover:text-brand-600 transition-colors">
          <Link to={`/events/${event._id}`}>{event.title}</Link>
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Meta: Location and Author */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium text-slate-600">
              By {event.author?.name || 'Organizer'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-3">
          <Link
            to={`/events/${event._id}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-brand-600 text-slate-700 hover:text-white font-semibold text-sm py-2.5 px-4 rounded-xl border border-slate-200/80 hover:border-brand-600 transition-all duration-200 group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
