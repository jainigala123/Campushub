import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClubCard from '../../components/cards/ClubCard';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiX, FiCheckCircle, FiUsers, FiGlobe } from 'react-icons/fi';

export default function ClubsPage() {
  const { clubs, createClub, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [logo, setLogo] = useState('');
  const [logoMode, setLogoMode] = useState('url'); // 'url' | 'file'
  const [submitting, setSubmitting] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await createClub({
      name,
      college: college || 'Campus University',
      description,
      category,
      logo: logo || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    });
    setSubmitting(false);
    setCreatedSuccess(true);
    setName('');
    setCollege('');
    setDescription('');
    setLogo('');
    setTimeout(() => {
      setCreatedSuccess(false);
      setShowModal(false);
    }, 2000);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 space-y-10">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-10 shadow-soft"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Campus Communities
            </span>
            <h1 className="mt-4 text-4xl font-bold text-slate-950 sm:text-5xl">Explore & launch campus clubs</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Connect with fellow students, build innovative projects, host events, and lead official campus organizations.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-blue-600 self-start md:self-auto"
          >
            <FiPlus size={18} /> Create New Club
          </button>
        </div>
      </motion.div>

      {/* Clubs Grid */}
      {clubs.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center shadow-soft space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <FiUsers size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">No campus clubs created yet</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Be the pioneer on campus! Start your own student organization to recruit members and host official events.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-600 shadow-soft"
          >
            <FiPlus /> Start the First Club
          </button>
        </div>
      )}

      {/* Create Club Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-[2.5rem] bg-white p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-6 top-6 rounded-full border border-slate-200 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <FiX size={18} />
              </button>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Official Campus Registry</span>
                <h2 className="text-2xl font-bold text-slate-950 mt-1">Create Student Organization</h2>
                <p className="text-xs text-slate-500">
                  Fill out your club information. Once registered, you will become the Club Admin.
                </p>
              </div>

              {createdSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                  <FiCheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
                  <p className="font-bold text-base">Club Created Successfully!</p>
                  <p className="text-xs">Your club is now live in the campus directory.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateClub} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Club Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. AI & Tech Collective"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 outline-none focus:border-primary focus:bg-white"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        College / Department
                      </label>
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. School of Engineering"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 outline-none focus:border-primary focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 outline-none focus:border-primary focus:bg-white"
                      >
                        <option value="Technology">Technology & Coding</option>
                        <option value="Cultural">Arts & Culture</option>
                        <option value="Business">Entrepreneurship & Business</option>
                        <option value="Sports">Athletics & Sports</option>
                        <option value="Academic">Academic & Research</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Logo / Banner Image
                      </label>
                      <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setLogoMode('url')}
                          className={`rounded-md px-2.5 py-1 transition ${logoMode === 'url' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Image URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogoMode('file')}
                          className={`rounded-md px-2.5 py-1 transition ${logoMode === 'file' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Upload File
                        </button>
                      </div>
                    </div>

                    {logoMode === 'url' ? (
                      <input
                        type="text"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-... or paste image link"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 outline-none focus:border-primary focus:bg-white"
                      />
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-bold file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                    )}

                    {logo && (
                      <div className="mt-2 relative h-24 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        <img src={logo} alt="Club Banner Preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setLogo('')}
                          className="absolute top-2 right-2 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-bold text-white hover:bg-rose-600 transition"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Club Description & Mission
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your club's goals, activities, and student benefits..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 outline-none focus:border-primary focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-primary py-3.5 text-xs font-bold text-white shadow-soft transition hover:bg-blue-600 disabled:opacity-50"
                  >
                    {submitting ? 'Registering Club to Supabase...' : 'Register Club & Become Admin'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
