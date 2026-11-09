import { useState } from 'react';
import { Calendar, Clock, MapPin, Tag, Image as ImageIcon, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Technology',
  'Music',
  'Sports',
  'Business',
  'Education',
  'Art & Culture',
  'Other'
];

export default function EventForm({ initialData = {}, onSubmit, isSubmitting, submitLabel = 'Save Event' }) {
  // Parse initial date & time if editing
  const getInitialDateStr = () => {
    if (!initialData.date) return '';
    const d = new Date(initialData.date);
    return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
  };

  const getInitialTimeStr = () => {
    if (!initialData.date) return '10:00';
    const d = new Date(initialData.date);
    return !isNaN(d.getTime()) ? d.toTimeString().slice(0, 5) : '10:00';
  };

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'Technology',
    date: getInitialDateStr(),
    time: getInitialTimeStr(),
    location: initialData.location || '',
    imageUrl: initialData.imageUrl || ''
  });

  const [errors, setErrors] = useState({});

  // Minimum allowable date is today
  const todayStr = new Date().toISOString().split('T')[0];

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    } else if (formData.title.length > 120) {
      newErrors.title = 'Title cannot exceed 120 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters long';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else if (formData.date < todayStr) {
      newErrors.date = 'Event date cannot be in the past';
    }

    if (!formData.time) {
      newErrors.time = 'Event start time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location or venue is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Combine date and time into single ISO Date
    const combinedDateTime = new Date(`${formData.date}T${formData.time || '00:00'}`);

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      date: combinedDateTime.toISOString(),
      location: formData.location.trim(),
      imageUrl: formData.imageUrl.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-[#172033] mb-1.5">
          Event Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. NextGen Web & AI Developer Summit 2026"
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
            errors.title
              ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-200 bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
          }`}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
          </p>
        )}
      </div>

      {/* Category & Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-[#172033] mb-1.5">
            Category <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#172033] mb-1.5">
            Location / Venue <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Convention Center, San Francisco or Online"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                errors.location
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
              }`}
            />
          </div>
          {errors.location && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.location}
            </p>
          )}
        </div>
      </div>

      {/* Date & Time Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-[#172033] mb-1.5">
            Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              name="date"
              min={todayStr}
              value={formData.date}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                errors.date
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
              }`}
            />
          </div>
          {errors.date && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.date}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#172033] mb-1.5">
            Start Time <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                errors.time
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
              }`}
            />
          </div>
          {errors.time && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.time}
            </p>
          )}
        </div>
      </div>

      {/* Image URL with live preview */}
      <div>
        <label className="block text-sm font-semibold text-[#172033] mb-1.5">
          Event Banner Image URL (Optional)
        </label>
        <div className="relative">
          <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all"
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Leave blank to use a default curated event background banner.
        </p>

        {formData.imageUrl && (
          <div className="mt-3 relative rounded-xl overflow-hidden aspect-[21/9] max-h-48 bg-slate-100 border border-slate-200">
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-[#172033] mb-1.5">
          Full Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="description"
          rows={5}
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your event agenda, special guests, key highlights, and what attendees should expect..."
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all leading-relaxed ${
            errors.description
              ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-200 bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
          }`}
        ></textarea>
        {errors.description && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
          </p>
        )}
      </div>

      {/* Submit button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-md shadow-brand-500/20 hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Processing...</span>
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
