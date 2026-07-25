import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiMapPin, FiCheckCircle, FiClock, FiShield, FiTag, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function EventDetailModal({ event, isOpen, onClose, onViewTicket }) {
  const { user, isRegistered, registerForEvent, getTicketForEvent } = useAuth();
  const [imgError, setImgError] = useState(false);

  if (!isOpen || !event) return null;

  const registered = isRegistered(event.id);
  const ticket = getTicketForEvent(event.id);

  const handleRegister = () => {
    const newTicket = registerForEvent(event);
    if (onViewTicket) {
      onViewTicket(newTicket);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window - Perfectly Aligned and Constrained */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl my-auto flex flex-col max-h-[88vh] overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-2xl z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/50 text-white backdrop-blur-md transition hover:bg-slate-900"
          >
            <FiX size={18} />
          </button>

          {/* Banner Header - Fixed Top */}
          <div className="flex-shrink-0 relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
            {!imgError && event.poster ? (
              <img
                src={event.poster}
                alt={event.title}
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary via-indigo-600 to-secondary flex flex-col items-center justify-center p-6 text-white text-center">
                <span className="text-2xl font-extrabold tracking-wider uppercase">{event.category}</span>
                <p className="mt-1 text-sm font-medium text-sky-100">{event.title}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4 text-white">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
                  <FiTag /> {event.category}
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold">{event.title}</h2>
              </div>
            </div>
          </div>

          {/* Body Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Ticket Registration Badge Banner */}
            {registered && ticket && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg shadow-md flex-shrink-0">
                    <FiCheckCircle />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Pass Confirmed</span>
                      <span className="rounded-md bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Allowed to Attend</span>
                    </div>
                    <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                      Registration ID: <span className="text-primary">{ticket.ticketId}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onViewTicket) onViewTicket(ticket);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 shadow-sm"
                >
                  <FiFileText /> View Pass & QR
                </button>
              </div>
            )}

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-primary h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</p>
                  <p className="font-semibold text-slate-900">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-secondary h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Venue</p>
                  <p className="font-semibold text-slate-900 truncate">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <FiShield className="text-emerald-600 h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Access</p>
                  <p className="font-semibold text-slate-900">Verified Student</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base font-bold text-slate-950">About the Event</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                {event.description ||
                  'Join us for an exciting campus session packed with collaborative projects, workshops, and networking with top student leaders.'}
              </p>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-base font-bold text-slate-950">Event Schedule</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700">
                  <FiClock className="text-primary flex-shrink-0" />
                  <span className="font-semibold text-slate-900">10:00 AM</span> — Welcome & Check-in
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700">
                  <FiClock className="text-primary flex-shrink-0" />
                  <span className="font-semibold text-slate-900">11:30 AM</span> — Keynote Workshop Session
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700">
                  <FiClock className="text-primary flex-shrink-0" />
                  <span className="font-semibold text-slate-900">02:00 PM</span> — Q&A and Networking Lounge
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action - Fixed Bottom */}
          <div className="flex-shrink-0 border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Close
            </button>

            {registered ? (
              <button
                onClick={() => {
                  onClose();
                  if (onViewTicket) onViewTicket(ticket);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-emerald-700"
              >
                <FiFileText /> View Pass ({ticket?.ticketId})
              </button>
            ) : (
              <button
                onClick={handleRegister}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-5 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-violet-600"
              >
                <FiCheckCircle /> Register & Get Ticket
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
