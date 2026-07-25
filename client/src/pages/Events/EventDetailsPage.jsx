import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EventCard from '../../components/cards/EventCard';
import { featuredEvents } from '../../data/dummyData';

export default function EventDetailsPage() {
  const { id } = useParams();
  const event = featuredEvents.find((item) => item.id === id) || featuredEvents[0];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="grid gap-10 xl:grid-cols-[1.6fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <img src={event.poster} alt={event.title} className="h-[420px] w-full rounded-[2rem] object-cover" />
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="rounded-full border border-slate-200 px-3 py-2">{event.category}</span>
              <span>{event.date}</span>
            </div>
            <h1 className="text-4xl font-semibold text-slate-950">{event.title}</h1>
            <p className="text-lg leading-8 text-slate-600">A premium campus event experience featuring workshops, networking, and community collaboration.</p>
          </div>

          <div className="grid gap-6 rounded-[2rem] bg-slate-50 p-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Event details</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Venue: {event.location}</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">Organizer: Campus Hub Collective</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">Prize: Exciting campus rewards</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Description</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Dive into an immersive campus event designed for students who want to explore new ideas, build projects, and meet peers from across colleges.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Rules</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-slate-600">
                <li>Register with your college email.</li>
                <li>Arrive 15 minutes before the start time.</li>
                <li>Follow event guidelines shared by the organizers.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Schedule timeline</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-950">10:00 AM</p>
                  <p className="text-sm text-slate-600">Welcome and introductions</p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-950">11:30 AM</p>
                  <p className="text-sm text-slate-600">Breakout sessions</p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-950">02:00 PM</p>
                  <p className="text-sm text-slate-600">Networking and closing</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">FAQs</h2>
              <div className="mt-4 space-y-3 rounded-[2rem] bg-slate-50 p-6">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Can I bring a guest?</p>
                  <p className="mt-2 text-sm text-slate-600">Yes, guests are welcome if they register before the event.</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Is this event free?</p>
                  <p className="mt-2 text-sm text-slate-600">Entry is free for registered students.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <aside className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="sticky top-24 space-y-5 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-950">Register now</h2>
            <p className="text-sm leading-7 text-slate-600">Reserve your spot quickly and keep event updates in one place.</p>
            <button className="w-full rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600">Register</button>
          </motion.div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-950">Related events</h3>
            {featuredEvents.filter((item) => item.id !== event.id).map((item) => (
              <Link key={item.id} to={`/events/${item.id}`} className="block rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 transition hover:border-primary hover:bg-white">
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-xs text-slate-500">{item.date} · {item.location}</p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
