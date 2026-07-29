import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { featuredEvents, categories } from '../../data/dummyData';
import EventDetailModal from '../../components/modals/EventDetailModal';
import TicketPassModal from '../../components/tickets/TicketPassModal';
import {
  FiFileText,
  FiCalendar,
  FiCheckCircle,
  FiSearch,
  FiMapPin,
  FiTag,
  FiUser,
  FiAward,
  FiTrash2,
  FiInfo,
  FiPlusCircle,
  FiPlus,
} from 'react-icons/fi';

export default function StudentDashboard() {
  const { user, tickets, cancelTicket, isRegistered, registerForEvent, events } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' or 'events'
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [activePassTicket, setActivePassTicket] = useState(null);

  const activeEvents = events && events.length > 0 ? events : featuredEvents;

  // Filter events for the Explore tab
  const filteredEvents = activeEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All categories' ||
      (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.2),transparent_70%)] pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-300 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Verified Student Dashboard
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Welcome back, {user?.name || 'Alex Rivera'}</h1>
              <p className="text-sm text-slate-300 max-w-xl">
                Manage your event registrations, access digital entry passes with unique Registration IDs, and explore campus activities.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div className="flex gap-4 sm:gap-6 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 self-start md:self-auto">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Passes</p>
                <p className="text-2xl font-bold text-white mt-1">{tickets.length}</p>
              </div>
              <div className="border-l border-white/20 pl-4 sm:pl-6">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Status</p>
                <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                  Allowed to Attend
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Tabs & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold transition ${
                activeTab === 'tickets'
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              My Event Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold transition ${
                activeTab === 'events'
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Explore All Events ({featuredEvents.length})
            </button>
          </div>

          {activeTab === 'events' && (
            <div className="relative max-w-xs w-full">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
        </div>

        {/* TAB 1: MY REGISTERED TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">My Event Tickets & Entry Passes</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Each ticket features a unique Registration ID for gate entry. Click any ticket to open your printable digital pass.
                </p>
              </div>
            </div>

            {tickets.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {tickets.map((t) => (
                  <motion.div
                    key={t.ticketId}
                    whileHover={{ y: -4 }}
                    className="rounded-[2.25rem] border border-slate-200/90 bg-white p-6 shadow-soft transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Ticket Header Badge */}
                      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                          Allowed to Attend
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          ID: <span className="text-primary font-extrabold">{t.ticketId}</span>
                        </span>
                      </div>

                      {/* Event Main Info */}
                      <div className="mt-4 flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                          {t.poster ? (
                            <img src={t.poster} alt={t.eventTitle} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-primary flex items-center justify-center text-white font-bold">
                              CH
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {t.category}
                          </span>
                          <h3 className="text-lg font-bold text-slate-950 leading-snug">{t.eventTitle}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            {t.date} · {t.location}
                          </p>
                        </div>
                      </div>

                      {/* Gate Entry details */}
                      <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Gate Access</p>
                          <p className="font-semibold text-slate-800 mt-0.5">{t.gateAccess || 'Gate 2 Entrance'}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Registration Time</p>
                          <p className="font-semibold text-slate-800 mt-0.5">
                            {new Date(t.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Actions */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setActivePassTicket(t)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-soft transition hover:bg-blue-600"
                      >
                        View Digital Pass & QR
                      </button>
                      <button
                        onClick={() => cancelTicket(t.ticketId)}
                        title="Cancel Registration"
                        className="rounded-full border border-slate-200 p-2.5 text-slate-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                      >
                        Cancel Pass
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center shadow-soft space-y-4">
                <p className="text-lg font-bold text-slate-800">No active event tickets yet</p>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Browse available campus events and register to generate your unique registration ticket.
                </p>
                <button
                  onClick={() => setActiveTab('events')}
                  className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Explore Events Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EXPLORE ALL EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Campus Events Directory</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Click any event card to view full event details in modal or register for instant ticket generation.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('All categories')}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    selectedCategory === 'All categories'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      selectedCategory === c
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => {
                const registered = isRegistered(event.id);
                return (
                  <motion.div
                    key={event.id}
                    whileHover={{ y: -6 }}
                    className="rounded-[2.25rem] border border-slate-200 bg-white shadow-soft overflow-hidden transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Event Card Poster Image */}
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                        <img src={event.poster} alt={event.title} className="h-full w-full object-cover" />
                        <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                          {event.category}
                        </span>

                        {registered && (
                          <span className="absolute right-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                            Registered
                          </span>
                        )}
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span>{event.date}</span>
                          <span>{event.location}</span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-950 leading-snug">{event.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {event.description || 'A premium campus experience designed for students to learn, compete, and connect.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setActiveModalEvent(event)}
                        className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-200"
                      >
                        View Modal Details
                      </button>

                      {registered ? (
                        <button
                          onClick={() => setActivePassTicket(isRegistered(event.id))}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm"
                        >
                          View Pass
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const newTicket = registerForEvent(event);
                            setActivePassTicket(newTicket);
                          }}
                          className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-600"
                        >
                          Register Ticket
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      <EventDetailModal
        event={activeModalEvent}
        isOpen={!!activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
        onViewTicket={(t) => {
          setActiveModalEvent(null);
          setActivePassTicket(t);
        }}
      />

      {/* Ticket Pass Modal */}
      <TicketPassModal
        ticket={activePassTicket}
        isOpen={!!activePassTicket}
        onClose={() => setActivePassTicket(null)}
      />
    </div>
  );
}
