import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiCalendar, FiMapPin, FiCheckCircle, FiUsers } from 'react-icons/fi';

export default function EventCard({ event }) {
  const [imgError, setImgError] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const { user, registerForEvent, isRegistered } = useAuth();
  const navigate = useNavigate();

  const registered = isRegistered(event.id);

  const getPosterSrc = () => {
    let p = event.poster;
    if (imgError && !fallbackAttempted) {
      p = null; // trigger default fallback below
    }
    if (p && typeof p === 'string' && p.trim().length > 0) {
      p = p.trim();
      if (!p.startsWith('http://') && !p.startsWith('https://') && !p.startsWith('data:') && !p.startsWith('blob:')) {
        return `https://${p}`;
      }
      return p;
    }
    const cat = (event.category || '').toLowerCase();
    if (cat.includes('hackathon') || cat.includes('code') || cat.includes('tech')) {
      return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80';
    }
    if (cat.includes('workshop') || cat.includes('seminar')) {
      return 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80';
    }
    if (cat.includes('cultural') || cat.includes('art') || cat.includes('fest')) {
      return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80';
    }
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80';
  };

  const posterSrc = getPosterSrc();

  const handleImgError = () => {
    if (!fallbackAttempted) {
      setFallbackAttempted(true);
    } else {
      setImgError(true);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/signup');
    } else {
      await registerForEvent(event);
    }
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft transition-shadow duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="relative h-64 overflow-hidden bg-slate-100">
          {!imgError ? (
            <img
              src={posterSrc}
              alt={event.title}
              onError={handleImgError}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex flex-col items-center justify-center p-6 text-white text-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),transparent)]" />
              <span className="text-3xl font-extrabold tracking-wider uppercase opacity-90">{event.category}</span>
              <p className="mt-2 text-sm font-medium text-blue-100 max-w-xs">{event.title}</p>
            </div>
          )}
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-primary/95 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white shadow-xl">
            {event.category}
          </span>
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white">
            <FiUsers className="text-sky-400" /> {event.clubName || 'Campus Club'}
          </span>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><FiCalendar className="text-primary" /> {event.date}</span>
            <span className="flex items-center gap-1.5"><FiMapPin className="text-secondary" /> {event.location}</span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Organized by: {event.clubName || 'Campus Club'}
            </span>
            <h3 className="text-xl font-semibold text-slate-950 group-hover:text-primary transition-colors mt-0.5">{event.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">
              {event.description || 'A premium campus experience designed for students who want to learn, compete, and connect.'}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 flex items-center justify-between gap-4">
        <Link to={`/events/${event.id}`} className="rounded-full bg-secondary/10 px-5 py-2.5 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-white">
          View details
        </Link>
        <button
          onClick={handleRegister}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            registered
              ? 'bg-emerald-600 text-white flex items-center gap-1.5'
              : 'border border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary'
          }`}
        >
          {registered ? (
            <>
              <FiCheckCircle /> Registered
            </>
          ) : (
            'Register'
          )}
        </button>
      </div>
    </motion.article>
  );
}
