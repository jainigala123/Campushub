import { motion } from 'framer-motion';
import ClubCard from '../../components/cards/ClubCard';
import { clubs } from '../../data/dummyData';

export default function ClubsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Clubs</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950">Discover your next community</h1>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-700">Search clubs, filter by interest, and connect.</div>
        </div>
      </motion.div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </section>
  );
}
