import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clubs, featuredEvents } from '../../data/dummyData';

export default function ClubDetailsPage() {
  const { id } = useParams();
  const club = clubs.find((item) => item.id === id) || clubs[0];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Club</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950">{club.name}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">{club.description}</p>
          </div>
          <div className="rounded-[2rem] bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Members</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">320</p>
            <p className="mt-2 text-sm text-slate-600">Active student members</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-950">Upcoming events</h2>
            <div className="mt-6 space-y-4">
              {featuredEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="rounded-[1.75rem] bg-slate-50 p-5">
                  <p className="font-semibold text-slate-950">{event.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{event.date} · {event.location}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-950">Gallery</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="h-40 rounded-3xl bg-slate-100" />
              <div className="h-40 rounded-3xl bg-slate-100" />
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-950">Socials</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">Follow the club for the latest announcements and event updates.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Instagram</button>
              <button className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">LinkedIn</button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-950">Contact</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">club@campushub.com</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">+1 (555) 987-6543</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
