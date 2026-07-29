import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiCheckCircle, FiEdit3, FiSave, FiAward, FiShield } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [bio, setBio] = useState(userProfile?.bio || user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || user?.avatar_url || '');
  const [college, setCollege] = useState(userProfile?.college || 'Technology & Engineering Institute');
  const [major, setMajor] = useState(userProfile?.major || 'Computer Science');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.name) setFullName(user.name);
    if (userProfile?.bio) setBio(userProfile.bio);
    if (userProfile?.avatar_url) setAvatarUrl(userProfile.avatar_url);
    if (userProfile?.college) setCollege(userProfile.college);
    if (userProfile?.major) setMajor(userProfile.major);
  }, [user, userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateUserProfile({
      full_name: fullName,
      bio,
      avatar_url: avatarUrl,
      college,
      major,
    });
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const isOrganizer = user?.role === 'organizer' || user?.name?.includes('Club Lead');

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-6 md:px-10 space-y-8">
        {/* Profile Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.25),transparent_70%)] pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 shadow-lg">
                <img
                  src={
                    avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={fullName}
                  className="h-full w-full rounded-full object-cover bg-slate-800"
                />
              </div>
              <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 backdrop-blur-md">
                {isOrganizer ? <FiShield className="text-secondary" /> : <FiAward className="text-amber-400" />}
                <span>{isOrganizer ? 'Club Lead / Organizer' : 'Campus Student Member'}</span>
              </div>
              <h1 className="text-3xl font-bold">{fullName || 'Campus Member'}</h1>
              <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
                <FiMail className="text-slate-400" /> {user?.email}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Alert */}
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-sm"
          >
            <FiCheckCircle className="text-emerald-600 h-5 w-5" /> Your profile has been updated and saved to Supabase!
          </motion.div>
        )}

        {/* Main Edit Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-soft space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                <FiEdit3 className="text-primary" /> Profile Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your user details displayed on ticket registrations and club rosters.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              ID: {user?.id ? `${user.id.slice(0, 8)}...` : 'Demo'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  University / College
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Tech University"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Major / Field of Study
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Bio & Interests
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a short intro about yourself, interests, and campus activities..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-xs text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs font-bold text-white shadow-soft transition hover:bg-blue-600 disabled:opacity-50"
            >
              <FiSave size={16} />
              {saving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
