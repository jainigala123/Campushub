import { motion } from 'framer-motion';

export default function TestimonialCard({ testimonial }) {
  return (
    <motion.article whileHover={{ y: -8 }} className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft backdrop-blur-xl">
      <p className="text-base leading-8 text-slate-700">“{testimonial.quote}”</p>
      <div className="mt-6 space-y-1">
        <p className="text-lg font-semibold text-slate-950">{testimonial.name}</p>
        <p className="text-sm text-slate-500">{testimonial.role}</p>
      </div>
    </motion.article>
  );
}
