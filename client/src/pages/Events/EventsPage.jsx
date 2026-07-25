import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import EventCard from '../../components/cards/EventCard';
import { featuredEvents, categories } from '../../data/dummyData';

export default function EventsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Events</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950">Explore upcoming campus experiences</h1>
          </div>
          <div className="relative max-w-md">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="search" placeholder="Search events, clubs, venues" className="w-full rounded-full border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button key={category} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary">
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="mt-12 grid gap-8 xl:grid-cols-[280px_1fr]">
        <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Filters</p>
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none">
                <option>All categories</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Location</p>
            <button className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 text-left text-sm text-slate-700 transition hover:border-primary">Campus wide</button>
            <button className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 text-left text-sm text-slate-700 transition hover:border-primary">Near me</button>
          </div>
        </aside>

        <div className="space-y-8">
          <div className="rounded-[2rem] bg-slate-100 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Upcoming events</p>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="flex items-center justify-between rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm text-slate-600">Showing 6 events</p>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Prev</button>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Next</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
