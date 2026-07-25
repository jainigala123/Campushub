import { motion } from 'framer-motion';

export default function ClubCard({ club }) {
  return (
    <motion.article whileHover={{ y: -8 }} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft transition-shadow duration-300">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{club.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{club.college}</p>
        </div>
        <span className="rounded-2xl bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{club.events} events</span>
      </div>
      <p className="text-sm leading-6 text-slate-600">{club.description}</p>
      <button className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600">
        Follow
      </button>
    </motion.article>
  );
}
