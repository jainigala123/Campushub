import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../../components/cards/EventCard';
import { supabase } from '../../lib/supabase';
import {
  FiUsers,
  FiUserPlus,
  FiCheckCircle,
  FiCalendar,
  FiPlus,
  FiUserCheck,
  FiTrash2,
  FiBell,
  FiSmartphone,
  FiShield,
  FiClock,
  FiUser,
  FiLogOut,
  FiAward,
  FiMail,
} from 'react-icons/fi';

export default function ClubDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    clubs,
    events,
    participants,
    getMembershipStatus,
    requestJoinClub,
    approveClubMember,
    rejectClubMember,
    promoteToClubAdmin,
    leaveClub,
    myMemberships,
    createManagerEvent,
    deleteManagerEvent,
    updateRegistrationStatus,
    checkInParticipant,
    announcements,
    addClubAnnouncement,
  } = useAuth();

  // Find target club
  const club = clubs.find((c) => String(c.id) === String(id)) || {
    id: id || 'club-1',
    name: 'Campus Technology Collective',
    college: 'School of Engineering & Computer Science',
    description: 'Official student organization building innovative projects, hosting hackathons, and fostering technology skills.',
    category: 'Technology',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    membersCount: 42,
    ownerId: user?.id,
  };

  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'members' | 'announcements' | 'management'
  const [mgmtSubTab, setMgmtSubTab] = useState('create-event'); // 'create-event' | 'attendees' | 'member-requests' | 'manage-events' | 'post-announcement'
  const [imgError, setImgError] = useState(false);

  // Membership & Role Status
  const status = getMembershipStatus(club.id);
  const isClubAdmin = status === 'admin';
  const isClubMember = status === 'admin' || status === 'member';

  // Club Events & Participants
  const clubEvents = events.filter(
    (e) => String(e.clubId) === String(club.id) || e.clubName === club.name
  );
  const clubEventIds = clubEvents.map((e) => e.id);
  const clubParticipants = participants.filter((p) => clubEventIds.includes(p.eventId));

  // Pending Join Requests & Members list for this club
  const pendingRequests = myMemberships.filter(
    (m) => String(m.club_id) === String(club.id) && m.role === 'pending'
  );

  // Fetch full profiles for active club members from Supabase
  const [dbMembers, setDbMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    const fetchClubMembers = async () => {
      if (!club?.id) return;
      setLoadingMembers(true);
      try {
        const { data, error } = await supabase
          .from('club_members')
          .select('id, club_id, user_id, role, joined_at, profiles(full_name, email, avatar_url, role)')
          .eq('club_id', club.id);

        if (!error && data && data.length > 0) {
          setDbMembers(data);
        } else {
          setDbMembers([]);
        }
      } catch (e) {
        console.warn('Error fetching club members:', e);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchClubMembers();
  }, [club.id, myMemberships]);

  // Form States for Management Console
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState(club.category || 'Hackathons');
  const [eventDate, setEventDate] = useState('Sep 30, 2026');
  const [eventLocation, setEventLocation] = useState('Campus Hall A');
  const [eventCapacity, setEventCapacity] = useState(100);
  const [eventDescription, setEventDescription] = useState('');
  const [eventPoster, setEventPoster] = useState('');
  const [posterMode, setPosterMode] = useState('url'); // 'url' | 'file'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePosterFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventPoster(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  const handleAction = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }
    if (status === 'none') {
      await requestJoinClub(club.id);
      setSuccessMsg('Membership request submitted! Waiting for Club Admin approval.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else if (status === 'member' || status === 'pending') {
      await leaveClub(club.id);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createManagerEvent({
        title: eventTitle || `${club.name} Special Event`,
        category: eventCategory,
        date: eventDate,
        location: eventLocation,
        capacity: eventCapacity,
        description: eventDescription,
        poster: eventPoster,
        clubId: club.id,
        clubName: club.name,
      });
      setSuccessMsg('Event published successfully under this club!');
      setEventTitle('');
      setEventDescription('');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      console.warn('Error creating event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    addClubAnnouncement(annTitle, annContent);
    setAnnTitle('');
    setAnnContent('');
    setSuccessMsg('Announcement broadcasted to members!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Combine database members with local session if needed
  const displayMembers = dbMembers.length > 0 ? dbMembers : [
    {
      id: 'owner-default',
      user_id: club.ownerId || user?.id,
      role: 'admin',
      joined_at: new Date().toISOString(),
      profiles: {
        full_name: user?.name || 'Club Lead',
        email: user?.email || 'lead@campushub.edu',
        role: 'club_admin',
      },
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 space-y-10">
      {/* Club Hero Card Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-10 shadow-soft relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 rounded-[2rem] overflow-hidden bg-slate-100 border-2 border-slate-200/80 shadow-md">
              {!imgError && club.logo ? (
                <img
                  src={club.logo}
                  alt={club.name}
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center p-3 text-white text-center font-bold text-xl">
                  {club.name[0]}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  {club.category || 'Student Club'}
                </span>
                <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FiUsers className="text-sky-500" /> {displayMembers.length} Active Members
                </span>
                {isClubAdmin && (
                  <span className="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-extrabold text-amber-800 flex items-center gap-1">
                    <FiShield /> Club Admin
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">{club.name}</h1>
              <p className="text-sm font-semibold text-slate-500">{club.college}</p>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{club.description}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 self-stretch md:self-auto">
            {status === 'admin' ? (
              <span className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-7 py-3.5 text-xs font-extrabold text-amber-900 shadow-sm">
                <FiShield /> Club Admin
              </span>
            ) : status === 'member' ? (
              <button
                onClick={handleAction}
                title="Click to Leave Club"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-100 px-7 py-3.5 text-xs font-bold text-emerald-800 hover:bg-rose-100 hover:text-rose-700 transition"
              >
                <FiCheckCircle className="text-emerald-600" /> Active Member (Joined)
              </button>
            ) : status === 'pending' ? (
              <button
                onClick={handleAction}
                title="Click to Cancel Request"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-7 py-3.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
              >
                <FiClock /> Request Pending (Waiting Approval)
              </button>
            ) : (
              <button
                onClick={handleAction}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-bold text-white shadow-soft transition hover:bg-blue-600"
              >
                <FiUserPlus /> Request to Join Club
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold transition ${
            activeTab === 'events'
              ? 'bg-slate-950 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FiCalendar /> Club Events ({clubEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold transition ${
            activeTab === 'members'
              ? 'bg-slate-950 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FiUsers /> Members & Roster ({displayMembers.length})
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold transition ${
            activeTab === 'announcements'
              ? 'bg-slate-950 text-white shadow-soft'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FiBell /> Announcements ({announcements.length})
        </button>

        {isClubMember && (
          <button
            onClick={() => setActiveTab('management')}
            className={`flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold transition ${
              activeTab === 'management'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-extrabold'
            }`}
          >
            <FiShield className="text-amber-300" /> ⚡ Club Management Console
          </button>
        )}
      </div>

      {/* TAB 1: CLUB EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">Events Hosted by {club.name}</h2>
          </div>

          {clubEvents.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {clubEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-12 text-center shadow-soft space-y-4">
              <p className="text-lg font-bold text-slate-900">No events hosted by this club yet</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isClubMember
                  ? 'As a club admin or approved member, use the Management Console to create and host your first club event!'
                  : 'Check back soon for upcoming workshops, hackathons, and activities from this club.'}
              </p>
              {isClubMember && (
                <button
                  onClick={() => {
                    setActiveTab('management');
                    setMgmtSubTab('create-event');
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-soft transition hover:bg-blue-600"
                >
                  <FiPlus /> Host New Event
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PUBLIC MEMBERS & LEADERSHIP ROSTER */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Official Members & Leadership Roster</h2>
            <p className="text-xs text-slate-600 mt-1">
              Meet the students and leaders who make up {club.name}.
            </p>
          </div>

          {displayMembers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayMembers.map((m, idx) => {
                const profile = m.profiles || {};
                const name = profile.full_name || 'Verified Student';
                const email = profile.email || 'student@campushub.edu';
                const isAdmin = m.role === 'admin' || profile.role === 'club_admin';

                return (
                  <div
                    key={m.id || idx}
                    className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft flex items-center gap-4 transition hover:shadow-md"
                  >
                    <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-sm uppercase">
                      {name[0]}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-950 truncate">{name}</h4>
                        {isAdmin ? (
                          <span className="rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-900">
                            Admin
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            Member
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                        <FiMail className="flex-shrink-0" /> {email}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Joined: {m.joined_at ? new Date(m.joined_at).toLocaleDateString() : 'Active Member'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
              <p className="text-sm text-slate-500">No active members listed for this club yet.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-950">Broadcast Announcements</h2>
          {announcements.length > 0 ? (
            <div className="space-y-4 max-w-3xl">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-soft space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{ann.author || club.name}</span>
                    <span className="text-[11px] text-slate-400">{ann.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">{ann.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
              <p className="text-sm text-slate-500">No announcements posted for this club yet.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: IN-CLUB MANAGEMENT CONSOLE (MEMBERS & ADMINS ONLY) */}
      {activeTab === 'management' && isClubMember && (
        <div className="space-y-8 rounded-[2.5rem] border border-indigo-100 bg-slate-50/50 p-8 border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">In-Club Command Center</span>
              <h2 className="text-3xl font-extrabold text-slate-950 mt-1">{club.name} Console</h2>
              <p className="text-xs text-slate-600">
                Organize events, approve member requests, review student registrations, and manage gate entry.
              </p>
            </div>

            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 self-start sm:self-auto"
            >
              <FiSmartphone /> Open Gate Scanner
            </Link>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <FiCheckCircle className="text-emerald-600 h-5 w-5" /> {successMsg}
            </div>
          )}

          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap gap-2">
            {isClubAdmin && (
              <button
                onClick={() => setMgmtSubTab('create-event')}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  mgmtSubTab === 'create-event'
                    ? 'bg-slate-950 text-white shadow-soft'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <FiPlus className="inline mr-1" /> Create Event
              </button>
            )}

            {isClubAdmin && (
              <button
                onClick={() => setMgmtSubTab('member-requests')}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  mgmtSubTab === 'member-requests'
                    ? 'bg-slate-950 text-white shadow-soft'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <FiUser className="inline mr-1" /> Member Requests ({pendingRequests.length})
              </button>
            )}

            <button
              onClick={() => setMgmtSubTab('attendees')}
              className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                mgmtSubTab === 'attendees'
                  ? 'bg-slate-950 text-white shadow-soft'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FiUserCheck className="inline mr-1" /> Event Attendees ({clubParticipants.length})
            </button>

            {isClubAdmin && (
              <button
                onClick={() => setMgmtSubTab('manage-events')}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                  mgmtSubTab === 'manage-events'
                    ? 'bg-slate-950 text-white shadow-soft'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <FiCalendar className="inline mr-1" /> Hosted Events ({clubEvents.length})
              </button>
            )}

            <button
              onClick={() => setMgmtSubTab('post-announcement')}
              className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
                mgmtSubTab === 'post-announcement'
                  ? 'bg-slate-950 text-white shadow-soft'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FiBell className="inline mr-1" /> Post Announcement
            </button>
          </div>

          {/* SUB-TAB 1: CREATE EVENT */}
          {mgmtSubTab === 'create-event' && isClubAdmin && (
            <form onSubmit={handleCreateEvent} className="max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Annual Tech Symposium 2026"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                  >
                    <option value="Hackathons">Hackathons</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Seminars">Seminars</option>
                    <option value="Competitions">Competitions</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="Sep 30, 2026"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Main Campus Auditorium"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={eventCapacity}
                    onChange={(e) => setEventCapacity(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Poster Image</label>
                  <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setPosterMode('url')}
                      className={`rounded-md px-2.5 py-1 transition ${posterMode === 'url' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setPosterMode('file')}
                      className={`rounded-md px-2.5 py-1 transition ${posterMode === 'file' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {posterMode === 'url' ? (
                  <input
                    type="text"
                    value={eventPoster}
                    onChange={(e) => setEventPoster(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-... or paste image link"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterFileChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-bold file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                )}

                {eventPoster && (
                  <div className="mt-2 relative h-32 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <img src={eventPoster} alt="Event Poster Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEventPoster('')}
                      className="absolute top-2 right-2 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-bold text-white hover:bg-rose-600 transition"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Description & Guidelines</label>
                <textarea
                  rows={3}
                  required
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Event schedule, rules, and entry guidelines..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-primary py-3.5 text-xs font-bold text-white shadow-soft transition hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing Event...' : `Publish Event under ${club.name}`}
              </button>
            </form>
          )}

          {/* SUB-TAB 2: MEMBER REQUESTS & ADMIN PROMOTION (CLUB ADMIN ONLY) */}
          {mgmtSubTab === 'member-requests' && isClubAdmin && (
            <div className="space-y-6 max-w-3xl">
              <div className="rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-soft space-y-4">
                <h3 className="text-lg font-bold text-slate-950">Pending Student Join Requests ({pendingRequests.length})</h3>
                {pendingRequests.length > 0 ? (
                  <div className="space-y-3">
                    {pendingRequests.map((req) => (
                      <div
                        key={req.user_id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">Student ID: {req.user_id}</p>
                          <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Status: Membership Approval Pending</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approveClubMember(club.id, req.user_id)}
                            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                          >
                            Approve Member
                          </button>
                          <button
                            onClick={() => rejectClubMember(club.id, req.user_id)}
                            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition"
                          >
                            Reject Request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No pending member join requests at this time.</p>
                )}
              </div>

              {/* Active Members Roster & Admin Transfer */}
              <div className="rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-soft space-y-4">
                <h3 className="text-lg font-bold text-slate-950">Active Club Roster & Admin Management</h3>
                <div className="space-y-2">
                  {displayMembers.map((mem) => {
                    const profile = mem.profiles || {};
                    const isMemAdmin = mem.role === 'admin' || profile.role === 'club_admin';
                    const isSelf = mem.user_id === user?.id;

                    return (
                      <div
                        key={mem.id || mem.user_id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">
                            {profile.full_name || 'Verified Student'} {isSelf && '(You)'}
                          </p>
                          <p className="text-[11px] text-slate-500">{profile.email || mem.user_id}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isMemAdmin ? (
                            <span className="font-extrabold text-amber-900 uppercase text-[10px] bg-amber-200 px-3 py-1 rounded-full">
                              Club Admin
                            </span>
                          ) : (
                            <>
                              <span className="font-semibold text-emerald-800 uppercase text-[10px] bg-emerald-100 px-3 py-1 rounded-full">
                                Active Member
                              </span>
                              <button
                                onClick={() => promoteToClubAdmin(club.id, mem.user_id)}
                                className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-[10px] font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition"
                              >
                                Promote to Admin
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: ATTENDEES & GATE ENTRY */}
          {mgmtSubTab === 'attendees' && (
            <div className="rounded-[2rem] border border-slate-200/90 bg-white shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
                      <th className="p-4 sm:p-5">Registration ID</th>
                      <th className="p-4 sm:p-5">Student Name</th>
                      <th className="p-4 sm:p-5">Event Title</th>
                      <th className="p-4 sm:p-5">Gate Status</th>
                      <th className="p-4 sm:p-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {clubParticipants.length > 0 ? (
                      clubParticipants.map((p) => (
                        <tr key={p.ticketId} className="hover:bg-slate-50/70 transition">
                          <td className="p-4 sm:p-5 font-mono font-bold text-primary">{p.ticketId}</td>
                          <td className="p-4 sm:p-5">
                            <p className="font-bold text-slate-900">{p.studentName}</p>
                            <p className="text-[11px] text-slate-500">{p.email}</p>
                          </td>
                          <td className="p-4 sm:p-5 font-semibold text-slate-800">{p.eventTitle}</td>
                          <td className="p-4 sm:p-5">
                            {p.status === 'Checked-In' ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                                <FiCheckCircle /> Checked In ({p.checkInTime || 'Gate Entry'})
                              </span>
                            ) : p.status === 'Registration Rejected' ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold text-rose-800">
                                Rejected by Club
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold text-sky-800">
                                Approved · Allowed Entry
                              </span>
                            )}
                          </td>
                          <td className="p-4 sm:p-5 text-right flex items-center justify-end gap-2">
                            {p.status !== 'Checked-In' && (
                              <>
                                {p.status !== 'Allowed to Attend' && (
                                  <button
                                    onClick={() => updateRegistrationStatus(p.ticketId, 'Allowed to Attend')}
                                    className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                                  >
                                    Approve
                                  </button>
                                )}
                                {p.status !== 'Registration Rejected' && (
                                  <button
                                    onClick={() => updateRegistrationStatus(p.ticketId, 'Registration Rejected')}
                                    className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition"
                                  >
                                    Reject
                                  </button>
                                )}
                                <button
                                  onClick={() => checkInParticipant(p.ticketId)}
                                  className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-600 transition"
                                >
                                  <FiUserCheck /> Let In
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500 font-medium text-xs">
                          No student registrations for {club.name} events yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-TAB 4: MANAGE HOSTED EVENTS */}
          {mgmtSubTab === 'manage-events' && isClubAdmin && (
            <div className="space-y-4">
              {clubEvents.length > 0 ? (
                clubEvents.map((ev) => (
                  <div key={ev.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={ev.poster} alt={ev.title} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-950">{ev.title}</h4>
                        <p className="text-xs text-slate-500">{ev.date} · {ev.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteManagerEvent(ev.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition"
                    >
                      <FiTrash2 /> Delete Event
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No hosted events published.</p>
              )}
            </div>
          )}

          {/* SUB-TAB 5: POST ANNOUNCEMENT */}
          {mgmtSubTab === 'post-announcement' && (
            <form onSubmit={handlePostAnnouncement} className="max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Meeting Postponed to Friday"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Write message to club members..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-primary py-3 text-xs font-bold text-white shadow-soft transition hover:bg-blue-600"
              >
                Broadcast Announcement
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
