import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  return (
    <motion.article
      layout
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft transition-shadow duration-300"
    >
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={event.poster}
          alt={event.title}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/900x520?text=Event+image';
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-primary/95 px-3 py-1 text-sm font-semibold text-white shadow-xl">
          <span className="hidden sm:inline-block">{event.category}</span>
          <span className="sm:hidden text-xs">{event.category?.slice(0,3)}</span>
        </span>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
          <span>{event.date}</span>
          <span>{event.location}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{event.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{event.description || 'A premium campus experience designed for students who want to learn, compete, and connect.'}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Link to={`/events/${event.id}`} className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-600">
            View details
          </Link>
          <button className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            Register
          </button>
        </div>
      </div>
    </motion.article>
  );
}
