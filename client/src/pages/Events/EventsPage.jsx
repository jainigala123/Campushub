import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCheckCircle, FiMapPin, FiFilter } from 'react-icons/fi';
import EventCard from '../../components/cards/EventCard';
import { featuredEvents, categories } from '../../data/dummyData';

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedLocation, setSelectedLocation] = useState('Campus wide');

  // Filter events based on search, category, and location
  const filteredEvents = featuredEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All categories' ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLocation =
      selectedLocation === 'Campus wide' ||
      (selectedLocation === 'Near me' && event.location.toLowerCase().includes('campus'));

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      {/* Header & Search Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[2.5rem] border border-slate-200/80 bg-white p-8 md:p-10 shadow-soft"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Campus Events
            </span>
            <h1 className="mt-4 text-4xl font-bold text-slate-950 sm:text-5xl">Explore upcoming campus experiences</h1>
          </div>
          <div className="relative w-full max-w-md">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, clubs, venues..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Category Pills Header */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5 pt-6 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('All categories')}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
              selectedCategory === 'All categories'
                ? 'bg-primary text-white shadow-soft'
                : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-soft'
                  : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Grid: Filters Sidebar + Event Cards */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters */}
        <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-soft h-fit">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <FiFilter className="text-primary h-5 w-5" />
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-800">Filter Events</p>
          </div>

          {/* Category Filter Dropdown */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="All categories">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter Pills */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Location</label>
            <div className="space-y-2.5">
              <button
                onClick={() => setSelectedLocation('Campus wide')}
                className={`w-full flex items-center justify-between rounded-2xl border px-5 py-3.5 text-sm font-medium text-left transition ${
                  selectedLocation === 'Campus wide'
                    ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FiMapPin className={selectedLocation === 'Campus wide' ? 'text-primary' : 'text-slate-400'} />
                  Campus wide
                </span>
                {selectedLocation === 'Campus wide' && <FiCheckCircle className="text-primary h-4 w-4" />}
              </button>

              <button
                onClick={() => setSelectedLocation('Near me')}
                className={`w-full flex items-center justify-between rounded-2xl border px-5 py-3.5 text-sm font-medium text-left transition ${
                  selectedLocation === 'Near me'
                    ? 'border-primary bg-primary/10 text-primary font-semibold shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FiMapPin className={selectedLocation === 'Near me' ? 'text-primary' : 'text-slate-400'} />
                  Near me
                </span>
                {selectedLocation === 'Near me' && <FiCheckCircle className="text-primary h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Reset Filters Option */}
          {(selectedCategory !== 'All categories' || selectedLocation !== 'Campus wide' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All categories');
                setSelectedLocation('Campus wide');
                setSearchQuery('');
              }}
              className="w-full mt-4 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Reset Filters
            </button>
          )}
        </aside>

        {/* Events Content Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-[2rem] bg-slate-100/80 px-6 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
              Upcoming Events ({filteredEvents.length})
            </p>
            {selectedCategory !== 'All categories' && (
              <span className="text-xs bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-600 font-medium">
                Active Filter: {selectedCategory}
              </span>
            )}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-soft">
              <p className="text-lg font-semibold text-slate-800">No events found matching your criteria.</p>
              <p className="mt-2 text-sm text-slate-500">Try clearing filters or searching for something else.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All categories');
                  setSelectedLocation('Campus wide');
                  setSearchQuery('');
                }}
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Footer Bar */}
          <div className="flex items-center justify-between rounded-[2rem] bg-white p-6 shadow-soft border border-slate-200/80">
            <p className="text-sm text-slate-600">Showing {filteredEvents.length} of {featuredEvents.length} events</p>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50">
                Prev
              </button>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
