import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { featuredEvents as initialFeaturedEvents } from '../data/dummyData';

const AuthContext = createContext(null);

const INITIAL_TICKETS = [
  {
    ticketId: 'CH-2026-94821',
    eventId: '1',
    eventTitle: 'Intercollege Hackathon',
    category: 'Hackathons',
    date: 'Aug 28, 2026',
    time: '10:00 AM - 04:00 PM',
    location: 'North Campus, Hall B',
    poster: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80',
    status: 'Allowed to Attend',
    registeredAt: '2026-07-20T14:30:00Z',
    gateAccess: 'Gate 4 - Priority Entry',
  },
  {
    ticketId: 'CH-2026-38194',
    eventId: '2',
    eventTitle: 'Cultural Fusion Fest',
    category: 'Cultural',
    date: 'Sep 04, 2026',
    time: '05:00 PM - 10:00 PM',
    location: 'Main Quad Amphitheater',
    poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
    status: 'Allowed to Attend',
    registeredAt: '2026-07-22T09:15:00Z',
    gateAccess: 'Gate 1 - Main Entrance',
  },
];

const INITIAL_PARTICIPANTS = [
  {
    ticketId: 'CH-2026-94821',
    eventId: '1',
    eventTitle: 'Intercollege Hackathon',
    studentName: 'Medhansh Naresh Khedekar',
    email: 'imperialion45@gmail.com',
    status: 'Checked-In',
    checkInTime: '2026-07-25T20:15:00Z',
    passType: 'VIP Student Pass',
  },
  {
    ticketId: 'CH-2026-38194',
    eventId: '2',
    eventTitle: 'Cultural Fusion Fest',
    studentName: 'Alex Rivera',
    email: 'alex.student@campushub.edu',
    status: 'Registered',
    checkInTime: null,
    passType: 'Standard Student Pass',
  },
  {
    ticketId: 'CH-2026-41029',
    eventId: '1',
    eventTitle: 'Intercollege Hackathon',
    studentName: 'Sarah Jenkins',
    email: 'sarah.j@mit.edu',
    status: 'Registered',
    checkInTime: null,
    passType: 'General Pass',
  },
  {
    ticketId: 'CH-2026-88219',
    eventId: '1',
    eventTitle: 'Intercollege Hackathon',
    studentName: 'David Zhang',
    email: 'david.z@stanford.edu',
    status: 'Checked-In',
    checkInTime: '2026-07-25T20:45:00Z',
    passType: 'VIP Student Pass',
  },
];

const INITIAL_CLUB = {
  id: 'c1',
  name: 'Code Collective',
  college: 'Tech University',
  description: 'The premier student organization for coders, hackathons, and product builders across campuses.',
  logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  membersCount: 142,
  eventsCount: 18,
};

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Hackathon Briefing & Room Assignment',
    content: 'All registered participants please assemble at North Campus Hall B 15 minutes before 10 AM.',
    date: '2 hours ago',
    author: 'Code Collective Board',
  },
  {
    id: 'ann-2',
    title: 'Free Sponsor Swag & Mentorship Slots',
    content: 'GitHub and Supabase tech leads will host 1-on-1 office hours during the sprint!',
    date: '1 day ago',
    author: 'Code Collective Board',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [clubProfile, setClubProfile] = useState(INITIAL_CLUB);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [events, setEvents] = useState(initialFeaturedEvents);

  // Load state from localStorage
  useEffect(() => {
    const savedTickets = localStorage.getItem('campushub_user_tickets');
    if (savedTickets) {
      try { setTickets(JSON.parse(savedTickets)); } catch (e) { setTickets(INITIAL_TICKETS); }
    } else {
      setTickets(INITIAL_TICKETS);
      localStorage.setItem('campushub_user_tickets', JSON.stringify(INITIAL_TICKETS));
    }

    const savedParticipants = localStorage.getItem('campushub_participants');
    if (savedParticipants) {
      try { setParticipants(JSON.parse(savedParticipants)); } catch (e) { setParticipants(INITIAL_PARTICIPANTS); }
    } else {
      setParticipants(INITIAL_PARTICIPANTS);
      localStorage.setItem('campushub_participants', JSON.stringify(INITIAL_PARTICIPANTS));
    }
  }, []);

  const saveTickets = (updated) => {
    setTickets(updated);
    localStorage.setItem('campushub_user_tickets', JSON.stringify(updated));
  };

  const saveParticipants = (updated) => {
    setParticipants(updated);
    localStorage.setItem('campushub_participants', JSON.stringify(updated));
  };

  useEffect(() => {
    const localUser = localStorage.getItem('campushub_demo_user');
    if (localUser) {
      try { setUser(JSON.parse(localUser)); } catch (e) { localStorage.removeItem('campushub_demo_user'); }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          role: session.user.user_metadata?.role || 'student',
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          role: session.user.user_metadata?.role || 'student',
        });
        localStorage.removeItem('campushub_demo_user');
      } else if (!localStorage.getItem('campushub_demo_user')) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const registerForEvent = (event) => {
    const existing = tickets.find((t) => t.eventId === event.id);
    if (existing) return existing;

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newTicketId = `CH-2026-${randomDigits}`;
    const newTicket = {
      ticketId: newTicketId,
      eventId: event.id,
      eventTitle: event.title,
      category: event.category || 'General',
      date: event.date,
      time: '10:00 AM - 04:00 PM',
      location: event.location,
      poster: event.poster,
      status: 'Allowed to Attend',
      registeredAt: new Date().toISOString(),
      gateAccess: 'Gate 2 - Student Pass',
    };

    const updatedTickets = [newTicket, ...tickets];
    saveTickets(updatedTickets);

    // Add to participants list for manager check-in tracker
    const newParticipant = {
      ticketId: newTicketId,
      eventId: event.id,
      eventTitle: event.title,
      studentName: user?.name || 'Medhansh Naresh Khedekar',
      email: user?.email || 'imperialion45@gmail.com',
      status: 'Registered',
      checkInTime: null,
      passType: 'Standard Student Pass',
    };
    saveParticipants([newParticipant, ...participants]);

    return newTicket;
  };

  const cancelTicket = (ticketId) => {
    saveTickets(tickets.filter((t) => t.ticketId !== ticketId));
    saveParticipants(participants.filter((p) => p.ticketId !== ticketId));
  };

  // QR Scanner Check-in Verification
  const checkInParticipant = (ticketId) => {
    const trimmedId = ticketId.trim().toUpperCase();
    const index = participants.findIndex((p) => p.ticketId.toUpperCase() === trimmedId);

    if (index === -1) {
      // Check if ticket exists in user tickets
      const foundInTickets = tickets.find((t) => t.ticketId.toUpperCase() === trimmedId);
      if (foundInTickets) {
        const newP = {
          ticketId: foundInTickets.ticketId,
          eventId: foundInTickets.eventId,
          eventTitle: foundInTickets.eventTitle,
          studentName: user?.name || 'Verified Student',
          email: user?.email || 'student@campushub.edu',
          status: 'Checked-In',
          checkInTime: new Date().toLocaleTimeString(),
          passType: 'Allowed to Attend',
        };
        const updated = [newP, ...participants];
        saveParticipants(updated);
        return { success: true, participant: newP, message: 'ENTRY ALLOWED! Valid Ticket Verified.' };
      }
      return { success: false, message: 'INVALID TICKET ID. No registration record found.' };
    }

    const p = participants[index];
    if (p.status === 'Checked-In') {
      return { success: false, message: `ALREADY CHECKED IN at ${p.checkInTime || 'earlier'}.`, participant: p };
    }

    const updatedParticipant = {
      ...p,
      status: 'Checked-In',
      checkInTime: new Date().toLocaleTimeString(),
    };

    const updatedList = [...participants];
    updatedList[index] = updatedParticipant;
    saveParticipants(updatedList);

    return { success: true, participant: updatedParticipant, message: 'ENTRY ALLOWED! Student verified.' };
  };

  // Create Manager Event with Limited Passes & Sponsors
  const createManagerEvent = (newEventData) => {
    const newId = String(events.length + 1);
    const createdEvent = {
      id: newId,
      title: newEventData.title,
      date: newEventData.date,
      location: newEventData.location,
      category: newEventData.category,
      poster: newEventData.poster || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
      description: newEventData.description,
      capacity: Number(newEventData.capacity) || 50,
      availablePasses: Number(newEventData.capacity) || 50,
      sponsors: newEventData.sponsors || [],
    };
    setEvents([createdEvent, ...events]);
    return createdEvent;
  };

  // Update Club Page
  const updateClubPage = (clubData) => {
    setClubProfile((prev) => ({ ...prev, ...clubData }));
  };

  // Add Club Announcement
  const addClubAnnouncement = (title, content) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      title,
      content,
      date: 'Just now',
      author: clubProfile.name || 'Club Lead',
    };
    setAnnouncements([newAnn, ...announcements]);
  };

  const isRegistered = (eventId) => tickets.some((t) => t.eventId === eventId);
  const getTicketForEvent = (eventId) => tickets.find((t) => t.eventId === eventId);

  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
    return data;
  };

  const signup = async (email, password, name = '', role = 'student') => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role } },
    });
    setLoading(false);
    if (error) throw error;
    if (data?.user && !data.session) {
      const demoUser = { id: data.user.id, email, name: name || email.split('@')[0], role };
      setUser(demoUser);
      localStorage.setItem('campushub_demo_user', JSON.stringify(demoUser));
    }
    return data;
  };

  const demoLogin = (role = 'student') => {
    const demoUser = {
      id: 'demo-123',
      email: role === 'organizer' ? 'organizer@campushub.edu' : 'alex.student@campushub.edu',
      name: role === 'organizer' ? 'Alex Campus (Club Lead)' : 'Alex Rivera',
      role,
    };
    setUser(demoUser);
    localStorage.setItem('campushub_demo_user', JSON.stringify(demoUser));
  };

  const logout = async () => {
    setLoading(true);
    try { await supabase.auth.signOut(); } catch (e) { console.warn('Signout warning', e); }
    localStorage.removeItem('campushub_demo_user');
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        tickets,
        participants,
        clubProfile,
        announcements,
        events,
        registerForEvent,
        cancelTicket,
        checkInParticipant,
        createManagerEvent,
        updateClubPage,
        addClubAnnouncement,
        isRegistered,
        getTicketForEvent,
        login,
        signup,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
