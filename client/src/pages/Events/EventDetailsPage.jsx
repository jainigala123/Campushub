import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { featuredEvents } from '../../data/dummyData';
import { FiCalendar, FiMapPin, FiCheckCircle, FiShare2, FiClock } from 'react-icons/fi';

export default function EventDetailsPage() {
  const { id } = useParams();
  const event = featuredEvents.find((item) => item.id === id) || featuredEvents[0];
  const [imgError, setImgError] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!user) {
      navigate('/signup');
    } else {
      setRegistered(true);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-soft"
        >
          {/* Header Poster Image with Fallback */}
          <div className="relative h-[380px] sm:h-[440px] w-full overflow-hidden rounded-[2rem] bg-slate-100 shadow-inner">
            {!imgError && event.poster ? (
              <img
                src={event.poster}
                alt={event.title}
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex flex-col items-center justify-center p-8 text-white text-center">
                <span className="text-4xl font-extrabold uppercase tracking-wider">{event.category}</span>
                <p className="mt-3 text-lg font-medium text-blue-100">{event.title}</p>
              </div>
            )}
            <span className="absolute left-6 top-6 rounded-full bg-primary/95 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
              {event.category}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-slate-700">
                <FiCalendar className="text-primary" /> {event.date}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-slate-700">
                <FiMapPin className="text-secondary" /> {event.location}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-950">{event.title}</h1>
            <p className="text-lg leading-8 text-slate-600">
              {event.description || 'A premium campus event experience featuring workshops, networking, and community collaboration.'}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid gap-6 sm:grid-cols-3 rounded-[2rem] bg-slate-50 p-6 border border-slate-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Venue</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{event.location}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Organizer</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Campus Hub Collective</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Entry</p>
              <p className="mt-1 text-sm font-semibold text-emerald-600">Free for Students</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">About This Event</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Dive into an immersive campus event designed for students who want to explore new ideas, build projects, and meet peers from across colleges. You'll gain hands-on insights, interact with club leaders, and build lasting network connections.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">Guidelines & Rules</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-slate-600">
                <li>Register with your college email address.</li>
                <li>Arrive 15 minutes before the scheduled start time.</li>
                <li>Follow safety and code of conduct guidelines shared by organizers.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">Schedule Timeline</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <FiClock className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-950">10:00 AM - Opening Ceremony</p>
                    <p className="text-xs text-slate-500">Keynote address & welcome remarks</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <FiClock className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-950">11:30 AM - Main Activity / Workshop</p>
                    <p className="text-xs text-slate-500">Collaborative team sessions & mentoring</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <FiClock className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-950">02:00 PM - Showcase & Closing</p>
                    <p className="text-xs text-slate-500">Awards presentation and campus networking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Registration Box */}
        <aside className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="sticky top-28 space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-soft"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Registration Open</span>
              <h2 className="text-2xl font-bold text-slate-950">Reserve Your Spot</h2>
              <p className="text-sm leading-6 text-slate-600">
                Join {event.title} and get instant confirmation and schedule updates.
              </p>
            </div>

            <button
              onClick={handleRegister}
              className={`w-full rounded-full py-4 text-sm font-semibold shadow-soft transition ${
                registered
                  ? 'bg-emerald-600 text-white flex items-center justify-center gap-2'
                  : 'bg-secondary text-white hover:bg-violet-600'
              }`}
            >
              {registered ? (
                <>
                  <FiCheckCircle size={18} /> Spot Reserved!
                </>
              ) : (
                'Register Now'
              )}
            </button>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Free Admission</span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-slate-900">
                <FiShare2 /> Share Event
              </span>
            </div>
          </motion.div>
        </aside>
      </div>
    </section>
  );
}
