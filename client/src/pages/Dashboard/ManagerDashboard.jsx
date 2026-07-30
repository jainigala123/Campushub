import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiUserCheck,
  FiSmartphone,
  FiCheckCircle,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiAward,
  FiBell,
  FiEdit,
  FiTrash2,
  FiTag,
  FiDollarSign,
  FiShare2,
  FiShield,
  FiGlobe,
} from 'react-icons/fi';

export default function ManagerDashboard() {
  const {
    user,
    events,
    participants,
    checkInParticipant,
    createManagerEvent,
    deleteManagerEvent,
    updateRegistrationStatus,
    clubs,
    myMemberships,
    clubProfile,
    updateClubPage,
    announcements,
    addClubAnnouncement,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('participants'); // 'participants' | 'create-event' | 'club-page' | 'sponsors'

  // Event Creation Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('Hackathons');
  const [eventDate, setEventDate] = useState('Sep 30, 2026');
  const [eventLocation, setEventLocation] = useState('Main Campus Auditorium');
  const [eventCapacity, setEventCapacity] = useState(100);
  const [eventDescription, setEventDescription] = useState('');
  const [eventPoster, setEventPoster] = useState('');
  const [eventCreatedSuccess, setEventCreatedSuccess] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState('');

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [selectedAnnouncementEventId, setSelectedAnnouncementEventId] = useState('');

  // Sponsor Form State
  const [sponsorsList, setSponsorsList] = useState([]);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorTier, setSponsorTier] = useState('Gold Sponsor');

  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  // Handle Event Submit
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmittingEvent(true);
    const chosenClub = clubs.find((c) => String(c.id) === String(selectedClubId)) || clubs[0];
    try {
      await createManagerEvent({
        title: eventTitle || 'New Campus Hackathon',
        category: eventCategory,
        date: eventDate,
        location: eventLocation,
        capacity: eventCapacity,
        description: eventDescription,
        poster: eventPoster,
        clubId: chosenClub ? chosenClub.id : null,
        clubName: chosenClub ? chosenClub.name : 'Campus Hub Collective',
      });
      setEventCreatedSuccess(true);
      setEventTitle('');
      setEventDescription('');
      setTimeout(() => setEventCreatedSuccess(false), 3000);
    } catch (err) {
      console.warn('Event creation warning:', err);
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  // Handle Announcement Submit
  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    addClubAnnouncement(annTitle, annContent, selectedClubId || null, selectedAnnouncementEventId || null);
    setAnnTitle('');
    setAnnContent('');
    setSelectedAnnouncementEventId('');
  };

  // Handle Sponsor Submit
  const handleAddSponsor = (e) => {
    e.preventDefault();
    if (!sponsorName.trim()) return;
    setSponsorsList([
      ...sponsorsList,
      {
        name: sponsorName,
        tier: sponsorTier,
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80',
      },
    ]);
    setSponsorName('');
  };

  const totalCheckedIn = participants.filter((p) => p.status === 'Checked-In').length;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 space-y-8">
        {/* Manager Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,_rgba(124,58,237,0.25),transparent_70%)] pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 border border-secondary/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-300 backdrop-blur-md">
                <FiShield className="text-secondary" /> Club Manager & Event Organizer Portal
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                {clubProfile.name} · {user?.name || 'Club Lead'}
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                Manage your club page, create events with limited passes, scan student QR passes, and track live attendee check-ins.
              </p>
            </div>

            {/* Quick Action Button to Mobile Scanner */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/scanner"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-cyan-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
              >
                <FiSmartphone size={18} /> Open Mobile QR Scanner
              </Link>
            </div>
          </div>

          {/* Manager Key Stats */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Checked-In Students</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">{totalCheckedIn} / {participants.length}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Hosted Events</p>
              <p className="text-2xl font-extrabold text-white mt-1">{events.length}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Club Members</p>
              <p className="text-2xl font-extrabold text-violet-300 mt-1">{clubProfile.membersCount}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Active Sponsors</p>
              <p className="text-2xl font-extrabold text-amber-300 mt-1">{sponsorsList.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Nav Tabs */}
        <div className="flex flex-wrap gap-2.5 border-b border-slate-200/80 pb-4">
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition ${
              activeTab === 'participants'
                ? 'bg-slate-950 text-white shadow-soft'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FiUserCheck /> Attendees & Gate Entry ({participants.length})
          </button>

          <button
            onClick={() => setActiveTab('create-event')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition ${
              activeTab === 'create-event'
                ? 'bg-slate-950 text-white shadow-soft'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FiPlus /> Create Event & Limited Passes
          </button>

          <button
            onClick={() => setActiveTab('club-page')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition ${
              activeTab === 'club-page'
                ? 'bg-slate-950 text-white shadow-soft'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FiBell /> Manage Club Page & Posts ({announcements.length})
          </button>

          <button
            onClick={() => setActiveTab('sponsors')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition ${
              activeTab === 'sponsors'
                ? 'bg-slate-950 text-white shadow-soft'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FiAward /> Add Event Sponsors ({sponsorsList.length})
          </button>
        </div>

        {/* TAB 1: PARTICIPANTS & LIVE CHECK-IN TRACKER */}
        {activeTab === 'participants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Live Participant Check-In Tracker</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Keep track of all students who registered for your events. Verify Registration IDs or use 1-click Gate Entry.
                </p>
              </div>

              <Link
                to="/scanner"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
              >
                <FiSmartphone /> Open Mobile Scanner Web-App
              </Link>
            </div>

            {/* Participants Table */}
            <div className="rounded-[2.25rem] border border-slate-200/90 bg-white shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-100">
                      <th className="p-4 sm:p-5">Registration ID</th>
                      <th className="p-4 sm:p-5">Student Name</th>
                      <th className="p-4 sm:p-5">Event Title</th>
                      <th className="p-4 sm:p-5">Pass Type</th>
                      <th className="p-4 sm:p-5">Gate Status</th>
                      <th className="p-4 sm:p-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {participants.length > 0 ? (
                      participants.map((p) => (
                        <tr key={p.ticketId} className="hover:bg-slate-50/70 transition">
                          <td className="p-4 sm:p-5 font-mono font-bold text-primary">{p.ticketId}</td>
                          <td className="p-4 sm:p-5">
                            <p className="font-bold text-slate-900">{p.studentName}</p>
                            <p className="text-[11px] text-slate-500">{p.email}</p>
                          </td>
                          <td className="p-4 sm:p-5 font-semibold text-slate-800">{p.eventTitle}</td>
                          <td className="p-4 sm:p-5">
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                              {p.passType || 'Standard Pass'}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5">
                            {p.status === 'Checked-In' ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                                <FiCheckCircle /> Checked In ({p.checkInTime || 'Gate Entry'})
                              </span>
                            ) : p.status === 'Registration Rejected' ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold text-rose-800">
                                Rejected by Club
                              </span>
                            ) : p.status === 'Allowed to Attend' ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold text-sky-800">
                                Approved · Allowed Entry
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800">
                                Registered · Pending Gate
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
                        <td colSpan="6" className="p-8 text-center text-slate-500 font-medium text-xs">
                          No student registrations recorded yet. Students who register for your events will appear here for live gate check-in.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE EVENT & LIMITED PASSES */}
        {activeTab === 'create-event' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Create New Campus Event</h2>
              <p className="text-sm text-slate-600 mt-1">
                Publish an event with limited pass capacity. Generated passes will issue unique Registration IDs.
              </p>
            </div>

            {eventCreatedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <FiCheckCircle className="text-emerald-600 h-5 w-5" /> Event published successfully to Campus Hub directory!
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-soft space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Host Organization / Club</label>
                <select
                  value={selectedClubId}
                  onChange={(e) => setSelectedClubId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                >
                  {clubs && clubs.length > 0 ? (
                    clubs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.college || 'Campus Hub'})
                      </option>
                    ))
                  ) : (
                    <option value="">Campus Hub Collective</option>
                  )}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. AI & Robotics Hackathon 2026"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Location / Venue</label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="North Campus Hall B"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Pass Capacity Limit</label>
                  <input
                    type="number"
                    required
                    value={eventCapacity}
                    onChange={(e) => setEventCapacity(e.target.value)}
                    placeholder="50"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Event Poster Image URL</label>
                <input
                  type="url"
                  value={eventPoster}
                  onChange={(e) => setEventPoster(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Event Description & Rules</label>
                <textarea
                  rows={4}
                  required
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Describe key schedule, rules, and student expectations..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingEvent}
                className="w-full rounded-full bg-secondary py-3.5 text-xs font-bold text-white shadow-soft transition hover:bg-violet-600 disabled:opacity-50"
              >
                {isSubmittingEvent ? 'Publishing to Supabase DB...' : 'Publish Event & Issue Limited Passes'}
              </button>
            </form>

            {/* Hosted Events Management & Deletion */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-slate-950">Active Hosted Events ({events.length})</h3>
              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img src={ev.poster} alt={ev.title} className="h-14 w-14 rounded-xl object-cover border border-slate-100" />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{ev.category}</span>
                          <h4 className="text-sm font-bold text-slate-950">{ev.title}</h4>
                          <p className="text-xs text-slate-500">{ev.date} · {ev.location}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteManagerEvent(ev.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white"
                      >
                        <FiTrash2 /> Delete Event
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No events published yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE CLUB PAGE & ANNOUNCEMENTS */}
        {activeTab === 'club-page' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Club Profile Editor */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Manage Club Page Profile</h2>
                <p className="text-xs text-slate-600 mt-0.5">Customize your official club page details shown across campus.</p>
              </div>

              <div className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Club Name</label>
                  <input
                    type="text"
                    value={clubProfile.name}
                    onChange={(e) => updateClubPage({ name: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Associated College</label>
                  <input
                    type="text"
                    value={clubProfile.college}
                    onChange={(e) => updateClubPage({ college: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={clubProfile.description}
                    onChange={(e) => updateClubPage({ description: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Right: Post Announcements */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Post Announcements & Notifications</h2>
                <p className="text-xs text-slate-600 mt-0.5">Broadcast live updates to registered event attendees.</p>
              </div>

              <form onSubmit={handlePostAnnouncement} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Title</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Venue Update: Lab 3 Assigned"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
                  <textarea
                    rows={3}
                    required
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="Write announcement details for students..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Link to Event (optional)</label>
                  <select
                    value={selectedAnnouncementEventId}
                    onChange={(e) => setSelectedAnnouncementEventId(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="">General club announcement</option>
                    {events
                      .filter((event) => String(event.clubId) === String(selectedClubId))
                      .map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-primary py-2.5 text-xs font-bold text-white shadow-soft transition hover:bg-blue-600"
                >
                  Publish Announcement Feed
                </button>
              </form>

              {/* Feed List */}
              <div className="space-y-3 pt-2">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 font-medium text-[10px]">
                      <span>{ann.author}</span>
                      <span>{ann.date}</span>
                    </div>
                    <p className="font-bold text-slate-900">{ann.title}</p>
                    <p className="text-slate-600">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SPONSORS MANAGER */}
        {activeTab === 'sponsors' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Add & Showcase Event Sponsors</h2>
              <p className="text-sm text-slate-600 mt-1">
                Attach official brand sponsors to your campus events and display partner badges.
              </p>
            </div>

            {/* Add Sponsor Form */}
            <form onSubmit={handleAddSponsor} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Sponsor Brand Name</label>
                <input
                  type="text"
                  required
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="e.g. Red Bull / GitHub / Google"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="w-full sm:w-48">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Sponsor Tier</label>
                <select
                  value={sponsorTier}
                  onChange={(e) => setSponsorTier(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs outline-none focus:border-primary"
                >
                  <option value="Title Sponsor">Title Sponsor</option>
                  <option value="Platinum Sponsor">Platinum Sponsor</option>
                  <option value="Gold Sponsor">Gold Sponsor</option>
                  <option value="Tech Partner">Tech Partner</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto rounded-full bg-slate-950 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                Add Sponsor
              </button>
            </form>

            {/* Active Sponsors Grid */}
            {sponsorsList.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-4">
                {sponsorsList.map((s, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-center gap-4">
                    <img src={s.logo} alt={s.name} className="h-12 w-12 rounded-xl object-cover border border-slate-100" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{s.tier}</span>
                      <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-soft text-center text-slate-500 text-xs font-medium">
                No event sponsors added yet. Use the form above to add official brand sponsors to your campus events.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
