import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6 rounded-[2rem] bg-white p-10 shadow-soft">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Contact</span>
          <h1 className="text-4xl font-semibold text-slate-950">Let’s build your next campus event together</h1>
          <p className="max-w-xl text-base leading-7 text-slate-600">Send us a note and we’ll connect you with the tools to plan, share, and grow your campus experience.</p>
          <div className="grid gap-4 rounded-[2rem] bg-slate-50 p-8">
            <p className="text-sm font-semibold text-slate-950">Have a question?</p>
            <p className="text-sm leading-7 text-slate-600">Reach out to hello@campushub.com or call +1 (555) 123-4567.</p>
          </div>
        </motion.div>

        <motion.form onSubmit={handleSubmit(onSubmit)} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
          <div className="space-y-6">
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input {...register('name')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-6">
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input {...register('email')} type="email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-6">
            <label className="block text-sm font-medium text-slate-700">Message</label>
            <textarea {...register('message')} rows="5" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <button type="submit" className="mt-6 inline-flex rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-600">
            Send message
          </button>
        </motion.form>
      </div>
    </section>
  );
}
