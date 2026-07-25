import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiCalendar, FiMapPin, FiClock, FiDownload, FiUser, FiShield, FiPrinter } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function TicketPassModal({ ticket, isOpen, onClose }) {
  const { user } = useAuth();

  if (!isOpen || !ticket) return null;

  const handlePrint = () => {
    window.print();
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

        {/* Modal Ticket Window - Perfectly Aligned and Constrained */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md my-auto flex flex-col max-h-[88vh] overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-2xl z-10 print:shadow-none print:border-none"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/40 text-white backdrop-blur-md transition hover:bg-slate-900 print:hidden"
          >
            <FiX size={18} />
          </button>

          {/* Ticket Top Header - Fixed Top */}
          <div className="flex-shrink-0 bg-gradient-to-r from-primary via-indigo-600 to-secondary p-5 sm:p-6 text-white relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-white/10 blur-xl" />
            <div className="flex items-center justify-between pr-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                Campus Hub Pass
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                <FiCheckCircle /> Allowed to Attend
              </span>
            </div>

            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-sky-200 font-semibold">{ticket.category}</p>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold leading-snug">{ticket.eventTitle}</h2>
            </div>
          </div>

          {/* Cut-out Ticket Separator Line with Circle Notches */}
          <div className="flex-shrink-0 relative h-5 bg-slate-50 flex items-center justify-between border-y border-dashed border-slate-300 px-4">
            <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-950/70" />
            <div className="w-full border-t border-dashed border-slate-300" />
            <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-950/70" />
          </div>

          {/* Ticket Details Body - Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-white">
            {/* Registration ID Banner */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 text-center shadow-inner">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Unique Registration ID</p>
              <p className="mt-1 text-xl font-mono font-extrabold tracking-wider text-primary">{ticket.ticketId}</p>
              <p className="mt-0.5 text-[10px] text-emerald-600 font-semibold">Verified Entry Authorization</p>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Attendee Name</p>
                <p className="font-bold text-slate-900 text-xs truncate">{user?.name || 'Alex Rivera'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'student@university.edu'}</p>
              </div>
              <div className="space-y-0.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Gate / Access</p>
                <p className="font-bold text-slate-900 text-xs truncate">{ticket.gateAccess || 'Gate 2 Entrance'}</p>
                <p className="text-[10px] text-slate-500">Bring Student ID</p>
              </div>

              <div className="space-y-0.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Date & Time</p>
                <p className="font-semibold text-slate-900 text-xs">{ticket.date}</p>
                <p className="text-[10px] text-slate-500">{ticket.time || '10:00 AM - 04:00 PM'}</p>
              </div>
              <div className="space-y-0.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Venue</p>
                <p className="font-semibold text-slate-900 text-xs truncate">{ticket.location}</p>
                <p className="text-[10px] text-slate-500">Main Campus</p>
              </div>
            </div>

            {/* QR Code & Barcode Visual */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center flex flex-col items-center justify-center">
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200">
                <svg className="w-24 h-24 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="0" y="0" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="8" y="8" width="14" height="14" rx="2" />
                  <rect x="70" y="0" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="78" y="8" width="14" height="14" rx="2" />
                  <rect x="0" y="70" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="8" y="78" width="14" height="14" rx="2" />
                  <rect x="40" y="10" width="10" height="10" />
                  <rect x="40" y="30" width="20" height="10" />
                  <rect x="10" y="40" width="10" height="20" />
                  <rect x="30" y="50" width="20" height="20" />
                  <rect x="60" y="40" width="30" height="10" />
                  <rect x="70" y="60" width="20" height="20" />
                  <rect x="50" y="80" width="10" height="10" />
                </svg>
              </div>
              <p className="mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Scan QR at Venue Gate for Check-in
              </p>
            </div>
          </div>

          {/* Footer Actions - Fixed Bottom */}
          <div className="flex-shrink-0 border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between gap-3 print:hidden">
            <button
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-slate-800"
            >
              <FiPrinter /> Print / Save PDF
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
