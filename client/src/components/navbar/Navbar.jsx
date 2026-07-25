import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const baseMenuItems = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Clubs', to: '/clubs' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOrganizer = user?.role === 'organizer' || user?.name?.includes('Club Lead');

  // Strict role-based menu items
  const menuItems = user
    ? isOrganizer
      ? [
          { label: 'Manager Portal', to: '/manager/dashboard' },
          { label: '📱 Mobile Scanner', to: '/scanner' },
          { label: 'Events', to: '/events' },
          { label: 'Clubs', to: '/clubs' },
        ]
      : [
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Events', to: '/events' },
          { label: 'Clubs', to: '/clubs' },
        ]
    : baseMenuItems;

  const userDashboardPath = isOrganizer ? '/manager/dashboard' : '/dashboard';

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-white/85 shadow-xl' : 'bg-white/50 backdrop-blur-md'}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to={user ? userDashboardPath : '/'} className="inline-flex items-center gap-3 text-lg font-semibold text-slate-950">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-soft font-bold">
            CH
          </span>
          <span>Campus Hub</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary font-bold' : 'text-slate-600 hover:text-slate-950'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={userDashboardPath}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary hover:bg-slate-100"
              >
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white uppercase ${isOrganizer ? 'bg-secondary' : 'bg-primary'}`}>
                  {user.name ? user.name[0] : 'U'}
                </span>
                <span className="max-w-[140px] truncate font-semibold">{user.name || user.email}</span>
                {isOrganizer && <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold">Manager</span>}
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
              >
                <FiLogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                Login
              </Link>
              <Link to="/signup" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 shadow-sm">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-200 bg-white/95 px-6 py-5 shadow-xl backdrop-blur-xl md:hidden"
        >
          <div className="space-y-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
              {user ? (
                <>
                  <Link
                    to={userDashboardPath}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {user.name ? user.name[0] : 'U'}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="w-full rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-center text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-600">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
