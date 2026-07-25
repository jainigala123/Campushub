import { motion } from 'framer-motion';

export default function StatCard({ value, label }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-soft">
      <p className="text-4xl font-semibold text-slate-950">{value}</p>
      <p className="mt-3 text-sm uppercase tracking-[0.24em] text-slate-500">{label}</p>
    </motion.div>
  );
}
