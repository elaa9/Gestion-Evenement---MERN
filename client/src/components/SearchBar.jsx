import { Search, Filter, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology',
  'Music',
  'Sports',
  'Business',
  'Education',
  'Art & Culture',
  'Other'
];

export default function SearchBar({
  keyword,
  setKeyword,
  selectedCategory,
  setSelectedCategory,
  location,
  setLocation,
  sortBy,
  setSortBy,
  onReset
}) {
  const hasActiveFilters =
    keyword !== '' ||
    selectedCategory !== 'All' ||
    location !== '' ||
    sortBy !== 'date-asc';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
      {/* Search Input and Location */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Title / Keyword Search */}
        <div className="md:col-span-7 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search events by title or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all text-[#172033] placeholder:text-slate-400"
          />
        </div>

        {/* Location Search */}
        <div className="md:col-span-3 relative">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Filter by city/location..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all text-[#172033] placeholder:text-slate-400"
          />
        </div>

        {/* Sort selector */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all text-slate-700 font-medium"
          >
            <option value="date-asc">Upcoming First</option>
            <option value="newest">Recently Published</option>
            <option value="date-desc">Latest Date</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills and Reset Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-[#172033]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 px-3 py-1.5 rounded-lg transition-colors ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
