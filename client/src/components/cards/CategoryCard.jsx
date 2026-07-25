import { motion } from 'framer-motion';

export default function CategoryCard({ title }) {
  return (
    <motion.article whileHover={{ scale: 1.03 }} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft transition-shadow duration-300">
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-[0_18px_60px_-40px_rgba(37,99,235,0.8)] transition duration-300 group-hover:bg-primary/15">
        <span className="text-xl font-semibold">{title.charAt(0)}</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">Explore curated events for {title.toLowerCase()} across colleges.</p>
    </motion.article>
  );
}
