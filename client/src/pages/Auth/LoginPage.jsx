import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiUserCheck, FiShield } from 'react-icons/fi';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      if (data.email.toLowerCase().includes('organizer') || data.email.toLowerCase().includes('club')) {
        navigate('/manager/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role = 'student') => {
    demoLogin(role);
    if (role === 'organizer') {
      navigate('/manager/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <section className="min-h-[85vh] flex items-center justify-center mx-auto max-w-7xl px-6 py-24 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-[2.5rem] border border-slate-200 bg-white/90 p-8 md:p-10 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-soft text-xl font-bold">
            CH
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-950">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to your account</p>
        </div>

        {/* Role Demo Shortcuts */}
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center mb-2.5">
            Select Account Role for Demo Access
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="flex-1 inline-flex flex-col items-center justify-center gap-1 rounded-xl bg-white p-3 text-xs font-bold text-slate-800 shadow-sm border border-slate-200 transition hover:border-primary hover:bg-slate-50"
            >
              <FiUserCheck className="text-primary text-base" />
              <span>Student Account</span>
              <span className="text-[10px] text-slate-400 font-normal">Events & Tickets</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('organizer')}
              className="flex-1 inline-flex flex-col items-center justify-center gap-1 rounded-xl bg-white p-3 text-xs font-bold text-slate-800 shadow-sm border border-slate-200 transition hover:border-secondary hover:bg-slate-50"
            >
              <FiShield className="text-secondary text-base" />
              <span>Manager Account</span>
              <span className="text-[10px] text-slate-400 font-normal">Passes & QR Scanner</span>
            </button>
          </div>
        </div>

        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-white px-3 text-xs text-slate-500 uppercase tracking-widest">or email sign in</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register('email')}
                type="email"
                required
                placeholder="student@university.edu or manager@campushub.edu"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register('password')}
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 p-3 border border-rose-200 text-xs text-rose-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-blue-600 disabled:opacity-50"
          >
            <FiLogIn />
            {loading ? 'Signing in...' : 'Sign in to Campus Hub'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </motion.div>
    </section>
  );
}
