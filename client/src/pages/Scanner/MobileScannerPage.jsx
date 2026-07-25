import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FiCamera,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
  FiZap,
  FiUserCheck,
  FiRefreshCw,
  FiSmartphone,
  FiSearch,
} from 'react-icons/fi';

export default function MobileScannerPage() {
  const { participants, checkInParticipant, tickets } = useAuth();
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [recentScans, setRecentScans] = useState([]);

  // Default demo ID to prepopulate for instant 1-click test
  const demoTicketId = tickets[0]?.ticketId || 'CH-2026-94821';

  const handleScanSubmit = (e) => {
    e?.preventDefault();
    if (!scanInput.trim()) return;

    const res = checkInParticipant(scanInput.trim());
    setScanResult(res);

    if (res.participant) {
      setRecentScans((prev) => [res.participant, ...prev.filter((p) => p.ticketId !== res.participant.ticketId)]);
    }

    setScanInput('');
  };

  const handleQuickDemoScan = (id) => {
    const res = checkInParticipant(id);
    setScanResult(res);
    if (res.participant) {
      setRecentScans((prev) => [res.participant, ...prev.filter((p) => p.ticketId !== res.participant.ticketId)]);
    }
  };

  const totalCheckedIn = participants.filter((p) => p.status === 'Checked-In').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-4 sm:p-6 font-sans select-none">
      {/* Mobile Web-App Top Bar */}
      <div className="w-full max-w-md flex items-center justify-between py-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
        <Link to="/manager/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition">
          <FiArrowLeft size={16} /> Exit Scanner
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> Mobile QR Scanner
          </span>
        </div>
      </div>

      {/* Main Scanner Container */}
      <div className="w-full max-w-md my-auto space-y-6">
        {/* Animated Scanner Viewfinder Box */}
        <div className="relative w-full aspect-square max-w-[320px] mx-auto rounded-[2.5rem] border-2 border-primary/50 bg-slate-900/80 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center">
          {/* Laser Scanner Animation */}
          {isScanning && (
            <motion.div
              animate={{ y: [-130, 130, -130] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8]"
            />
          )}

          {/* Corner Framing Brackets */}
          <div className="absolute top-4 left-4 h-8 w-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl" />
          <div className="absolute top-4 right-4 h-8 w-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 h-8 w-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 h-8 w-8 border-b-4 border-r-4 border-cyan-400 rounded-br-xl" />

          {/* Viewfinder Center Icon */}
          <div className="p-4 rounded-full bg-slate-800/80 text-cyan-400 mb-3 border border-slate-700 shadow-inner">
            <FiCamera size={36} />
          </div>
          <p className="text-xs font-semibold text-slate-300">Align QR Code inside frame</p>
          <p className="text-[10px] text-slate-500 mt-1">Live Camera & Registration ID Scanner</p>

          {/* Quick Demo Scan Button */}
          <button
            onClick={() => handleQuickDemoScan(demoTicketId)}
            className="mt-4 px-4 py-2 rounded-full bg-primary/20 border border-primary/40 text-cyan-300 text-xs font-bold transition hover:bg-primary/40 flex items-center gap-1.5"
          >
            <FiZap className="text-amber-400" /> Tap to Scan Demo Ticket
          </button>
        </div>

        {/* Manual ID Input Form */}
        <form onSubmit={handleScanSubmit} className="space-y-3">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Or enter Registration ID (e.g. CH-2026-94821)"
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-3.5 pl-11 pr-24 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 font-mono"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 shadow-md"
            >
              Verify
            </button>
          </div>
        </form>

        {/* Scan Result Feedback Banner */}
        <AnimatePresence mode="wait">
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-5 rounded-2xl border shadow-2xl text-left ${
                scanResult.success
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100'
                  : 'bg-rose-950/80 border-rose-500/50 text-rose-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {scanResult.success ? (
                  <FiCheckCircle className="h-8 w-8 text-emerald-400 flex-shrink-0" />
                ) : (
                  <FiXCircle className="h-8 w-8 text-rose-400 flex-shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">
                    {scanResult.success ? 'ENTRY ALLOWED ✅' : 'CHECK-IN DENIED ❌'}
                  </h4>
                  <p className="text-xs mt-0.5 opacity-90">{scanResult.message}</p>
                </div>
              </div>

              {scanResult.participant && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Student Name</span>
                    <p className="font-semibold text-white truncate">{scanResult.participant.studentName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Ticket ID</span>
                    <p className="font-mono font-bold text-cyan-300">{scanResult.participant.ticketId}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Check-in Counter */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FiUserCheck className="text-cyan-400 h-5 w-5" />
            <div>
              <p className="font-bold text-white">Event Entry Tracker</p>
              <p className="text-[11px] text-slate-400">Total Checked-In: <span className="text-emerald-400 font-bold">{totalCheckedIn} Students</span></p>
            </div>
          </div>
          <Link
            to="/manager/dashboard"
            className="rounded-full border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white transition"
          >
            Manage List
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md text-center text-[10px] text-slate-600 py-2">
        Campus Hub Mobile Gate Access System · Encrypted Verification
      </div>
    </div>
  );
}
