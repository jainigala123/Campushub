import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    const { data: res, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // After signup, redirect to home or a welcome page
    navigate('/');
  };

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.25rem] border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-950">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">Sign up to create events and manage registrations.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input {...register('email')} type="email" required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input {...register('password')} type="password" required minLength={6} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-between gap-4">
            <button type="submit" disabled={loading} className="inline-flex items-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-600">
              {loading ? 'Creating...' : 'Create account'}
            </button>
            <Link to="/auth/login" className="text-sm text-slate-600 hover:underline">Have an account?</Link>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
