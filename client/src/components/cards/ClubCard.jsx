import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiCheckCircle, FiUserPlus, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function ClubCard({ club }) {
  const { user, getMembershipStatus, requestJoinClub, leaveClub } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const status = getMembershipStatus(club.id);

  const handleAction = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }
    if (status === 'none') {
      await requestJoinClub(club.id);
    } else if (status === 'member' || status === 'pending') {
      await leaveClub(club.id);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft transition-shadow duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-100 mb-5">
          {!imgError && club.logo ? (
            <img
              src={club.logo}
              alt={club.name}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center p-4 text-white text-center">
              <span className="text-2xl font-bold">{club.name}</span>
            </div>
          )}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white">
            <FiUsers className="text-sky-400" /> {club.membersCount || 1} Members
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-950 group-hover:text-primary transition-colors">
            {club.name}
          </h3>
          <p className="text-xs font-semibold text-primary">{club.college}</p>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {club.description || 'Official student organization fostering campus community, activities, and events.'}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/clubs/${club.id}`)}
          className="rounded-full bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
        >
          View Club
        </button>

        {status === 'admin' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-4 py-2 text-xs font-extrabold text-amber-900">
            <FiCheckCircle /> Club Admin
          </span>
        ) : status === 'member' ? (
          <button
            onClick={handleAction}
            title="Click to Leave Club"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-rose-100 hover:text-rose-700 transition"
          >
            <FiCheckCircle className="text-emerald-600" /> Active Member
          </button>
        ) : status === 'pending' ? (
          <span
            onClick={handleAction}
            title="Click to Cancel Request"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-bold text-amber-800 cursor-pointer hover:bg-amber-100 transition"
          >
            Request Pending
          </span>
        ) : (
          <button
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-blue-600"
          >
            <FiUserPlus /> Request to Join
          </button>
        )}
      </div>
    </motion.article>
  );
}
