import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const links = [
  { title: 'Home', to: '/' },
  { title: 'Events', to: '/events' },
  { title: 'Clubs', to: '/clubs' },
  { title: 'About', to: '/about' },
  { title: 'Contact', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-gradient-to-r from-primary to-secondary py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 md:px-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-lg space-y-4">
          <div className="inline-flex items-center gap-3 rounded-3xl bg-white/10 px-5 py-4 text-white shadow-soft">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">CH</span>
            <div>
              <p className="text-sm font-semibold text-white">Campus Hub</p>
              <p className="text-sm text-white/90">Explore campus events with premium design and smooth interactions.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Quick Links</p>
            {links.slice(0, 3).map((link) => (
              <Link key={link.to} to={link.to} className="block text-sm text-white/90 transition hover:text-white">
                {link.title}
              </Link>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Resources</p>
            <Link to="/privacy" className="block text-sm text-white/90 transition hover:text-white">Privacy</Link>
            <Link to="/terms" className="block text-sm text-white/90 transition hover:text-white">Terms</Link>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Contact</p>
            <p className="text-sm text-white/90">hello@campushub.com</p>
            <p className="text-sm text-white/90">+1 (555) 123-4567</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Follow</p>
            <div className="flex items-center gap-3 text-white/90">
              <FaInstagram size={18} />
              <FaLinkedin size={18} />
              <FaTwitter size={18} />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl px-6 text-center text-sm text-white/80 md:px-10">
        © 2026 Campus Hub. All rights reserved.
      </div>
    </footer>
  );
}
