import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const menuItems = [
  { label: 'Home', to: '/' },
  { label: 'Events', to: '/events' },
  { label: 'Clubs', to: '/clubs' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-white/70 shadow-xl' : 'bg-transparent'}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="inline-flex items-center gap-3 text-lg font-semibold text-slate-950">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-soft">
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
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-slate-950' : 'text-slate-600 hover:text-slate-950'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/events" className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
            Login
          </Link>
          <Link to="/events" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
            Register
          </Link>
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
            <div className="flex flex-col gap-3 pt-3">
              <Link to="/events" className="rounded-full border border-slate-200 px-5 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Login
              </Link>
              <Link to="/events" className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-600">
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
