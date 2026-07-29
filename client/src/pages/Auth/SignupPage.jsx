import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiUser, FiUserCheck, FiCheckCircle, FiShield } from 'react-icons/fi';

export default function SignupPage() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const { user, signup, demoLogin } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await signup(data.email, data.password, data.name, role);
      if (role === 'organizer') {
        navigate('/manager/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignup = (selectedRole) => {
    demoLogin(selectedRole);
    if (selectedRole === 'organizer') {
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
          <h1 className="mt-4 text-3xl font-bold text-slate-950">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">Join Campus Hub as a student or club manager</p>
        </div>

        {/* Demo Quick Registration */}
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center mb-2.5">
            Instant Demo Account Creation
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoSignup('student')}
              className="flex-1 inline-flex flex-col items-center justify-center gap-1 rounded-xl bg-white p-3 text-xs font-bold text-slate-800 shadow-sm border border-slate-200 transition hover:border-primary hover:bg-slate-50"
            >
              <FiUserCheck className="text-primary text-base" />
              <span>Student Account</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignup('organizer')}
              className="flex-1 inline-flex flex-col items-center justify-center gap-1 rounded-xl bg-white p-3 text-xs font-bold text-slate-800 shadow-sm border border-slate-200 transition hover:border-secondary hover:bg-slate-50"
            >
              <FiShield className="text-secondary text-base" />
              <span>Club Manager</span>
            </button>
          </div>
        </div>

        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-white px-3 text-xs text-slate-500 uppercase tracking-widest">or register below</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register('name')}
                type="text"
                required
                placeholder="Alex Rivera"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register('email')}
                type="email"
                required
                placeholder="student@university.edu"
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
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex items-center justify-center gap-2 rounded-2xl p-3 text-xs font-bold border transition ${
                  role === 'student'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {role === 'student' && <FiCheckCircle />} Student
              </button>
              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`flex items-center justify-center gap-2 rounded-2xl p-3 text-xs font-bold border transition ${
                  role === 'organizer'
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {role === 'organizer' && <FiCheckCircle />} Club Manager
              </button>
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
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-violet-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-secondary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </section>
  );
}
