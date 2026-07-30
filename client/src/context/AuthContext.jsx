import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { featuredEvents as initialFeaturedEvents } from '../data/dummyData';

const AuthContext = createContext(null);

const INITIAL_TICKETS = [];
const INITIAL_PARTICIPANTS = [];
const INITIAL_CLUB = {
  id: 'c1',
  name: 'Campus Club',
  college: 'University',
  description: 'Official student organization',
  logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  membersCount: 0,
  eventsCount: 0,
};
const INITIAL_ANNOUNCEMENTS = [];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [clubProfile, setClubProfile] = useState(INITIAL_CLUB);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  // Purge legacy demo data and load localStorage state
  useEffect(() => {
    const savedTickets = localStorage.getItem('campushub_user_tickets');
    if (savedTickets) {
      try {
        const parsed = JSON.parse(savedTickets);
        const cleaned = parsed.filter(
          (t) =>
            !t.ticketId.includes('CH-2026-94821') &&
            !t.ticketId.includes('CH-2026-38194')
        );
        setTickets(cleaned);
        localStorage.setItem('campushub_user_tickets', JSON.stringify(cleaned));
      } catch (e) {
        setTickets([]);
      }
    } else {
      setTickets([]);
    }

    const savedParticipants = localStorage.getItem('campushub_participants');
    if (savedParticipants) {
      try {
        const parsed = JSON.parse(savedParticipants);
        const cleaned = parsed.filter(
          (p) =>
            !p.ticketId.includes('94821') &&
            !p.ticketId.includes('38194') &&
            !p.ticketId.includes('41029') &&
            !p.ticketId.includes('88219') &&
            p.email !== 'alex.student@campushub.edu' &&
            p.email !== 'sarah.j@mit.edu' &&
            p.email !== 'david.z@stanford.edu'
        );
        setParticipants(cleaned);
        localStorage.setItem('campushub_participants', JSON.stringify(cleaned));
      } catch (e) {
        setParticipants([]);
      }
    } else {
      setParticipants([]);
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

  // Fetch live events from Supabase
  const loadSupabaseEvents = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*');
      if (!error && data && data.length > 0) {
        const mappedEvents = data.map((ev) => {
          let poster = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80';
          let category = 'Hackathons';
          let clubName = 'Campus Hub Collective';
          let cleanDescription = ev.description || '';

          if (ev.description && ev.description.includes('<!--METADATA:')) {
            try {
              const match = ev.description.match(/<!--METADATA:(.*?)-->/);
              if (match && match[1]) {
                const meta = JSON.parse(match[1]);
                if (meta.poster && typeof meta.poster === 'string' && meta.poster.trim().length > 0) {
                  poster = meta.poster.trim();
                }
                if (meta.category && typeof meta.category === 'string') {
                  category = meta.category.trim();
                }
                if (meta.clubName && typeof meta.clubName === 'string') {
                  clubName = meta.clubName.trim();
                }
                cleanDescription = ev.description.replace(/<!--METADATA:.*?-->\n?/, '');
              }
            } catch (err) {
              console.warn('Error parsing metadata comment:', err);
            }
          }

          return {
            id: ev.id,
            title: ev.title,
            date: ev.event_date ? new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
            location: ev.location || 'Campus Wide',
            category,
            poster,
            clubName,
            clubId: ev.club_id,
            description: cleanDescription,
            capacity: ev.capacity || 50,
            availablePasses: ev.capacity || 50,
            sponsors: [],
          };
        });
        setEvents(mappedEvents);
      } else {
        setEvents([]);
      }
    } catch (e) {
      console.warn('Could not load events from Supabase:', e);
    }
  };

  // Fetch or create user profile from Supabase
  const syncProfile = async (currentSession) => {
    if (!currentSession?.user) return;
    const u = currentSession.user;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .maybeSingle();

      if (data) {
        setUserProfile(data);
        setUser({
          id: u.id,
          email: u.email,
          name: data.full_name || u.user_metadata?.full_name || u.email.split('@')[0],
          role: data.role || u.user_metadata?.role || 'student',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        });
      } else {
        // Create initial profile in Supabase
        const initialProf = {
          id: u.id,
          email: u.email,
          full_name: u.user_metadata?.full_name || u.email.split('@')[0],
          role: u.user_metadata?.role || 'student',
          bio: 'CampusHub Student / Community Member',
        };
        const { data: createdProf } = await supabase.from('profiles').upsert(initialProf).select().single();
        const activeProf = createdProf || initialProf;
        setUserProfile(activeProf);
        setUser({
          id: u.id,
          email: u.email,
          name: activeProf.full_name,
          role: activeProf.role,
          bio: activeProf.bio,
          avatar_url: activeProf.avatar_url,
        });
      }
    } catch (e) {
      console.warn('Error syncing profile:', e);
    }
  };

  const updateUserProfile = async (updates) => {
    const updated = { ...(userProfile || {}), ...updates };
    setUserProfile(updated);

    if (session?.user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            full_name: updates.full_name || user?.name,
            bio: updates.bio || '',
            avatar_url: updates.avatar_url || '',
            role: user?.role || 'student',
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!error && data) {
          setUserProfile(data);
        }
      } catch (e) {
        console.warn('Failed to persist profile update to Supabase:', e);
      }
    }

    setUser((prev) => ({
      ...prev,
      name: updates.full_name || prev?.name,
      bio: updates.bio ?? prev?.bio,
      avatar_url: updates.avatar_url ?? prev?.avatar_url,
    }));

    return updated;
  };

  // Fetch live clubs from Supabase
  const loadSupabaseClubs = async () => {
    try {
      const { data, error } = await supabase.from('clubs').select('*');
      if (!error && data) {
        const mappedClubs = data.map((c) => {
          let college = 'Campus University';
          let logo = c.logo_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
          let cleanDescription = c.description || '';

          if (c.description && c.description.includes('<!--METADATA:')) {
            try {
              const match = c.description.match(/<!--METADATA:(.*?)-->/);
              if (match && match[1]) {
                const meta = JSON.parse(match[1]);
                if (meta.college) college = meta.college;
                if (meta.logo) logo = meta.logo;
                cleanDescription = c.description.replace(/<!--METADATA:.*?-->\n?/, '');
              }
            } catch (err) {
              console.warn('Error parsing club metadata:', err);
            }
          }

          return {
            id: c.id,
            name: c.name,
            college,
            description: cleanDescription,
            category: c.category || 'General',
            logo,
            membersCount: c.members_count || 1,
            ownerId: c.owner_id,
          };
        });

        setClubs(mappedClubs);

        if (mappedClubs.length > 0) {
          const userClub = user?.id
            ? mappedClubs.find((c) => c.ownerId === user.id) || mappedClubs[0]
            : mappedClubs[0];
          setClubProfile(userClub);
        }
      }
    } catch (e) {
      console.warn('Could not load clubs from Supabase:', e);
    }
  };

  // Fetch user club memberships
  const loadUserMemberships = async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('club_members')
        .select('*')
        .eq('user_id', userId);
      if (!error && data) {
        setMyMemberships(data);
      }
    } catch (e) {
      console.warn('Could not load memberships from Supabase:', e);
    }
  };

  const isValidUUID = (str) =>
    typeof str === 'string' &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

  // Create a new Club (available to any student)
  const createClub = async (clubData) => {
    let newClubId = `club-${Date.now()}`;
    let createdRecord = null;

    let validOwnerId = session?.user?.id || user?.id;
    if (!isValidUUID(validOwnerId)) {
      const { data: prof } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
      if (prof?.id) validOwnerId = prof.id;
    }

    const logo = clubData.logo || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
    const college = clubData.college || 'Campus University';
    const rawDescription = clubData.description || '';
    const fullDescription = `<!--METADATA:${JSON.stringify({ college, logo })}-->\n${rawDescription}`;

    if (validOwnerId && isValidUUID(validOwnerId)) {
      try {
        const { data, error } = await supabase
          .from('clubs')
          .insert({
            name: clubData.name,
            description: fullDescription,
            category: clubData.category || 'General',
            logo_url: logo,
            owner_id: validOwnerId,
            is_approved: true,
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase createClub error:', error.message || error);
        } else if (data) {
          createdRecord = data;
          newClubId = data.id;

          // Insert into club_members as admin
          await supabase.from('club_members').insert({
            club_id: data.id,
            user_id: validOwnerId,
            role: 'admin',
          });

          await updateUserProfile({ role: 'club_admin' });
        }
      } catch (e) {
        console.warn('Error persisting club to Supabase:', e);
      }
    }

    const newClubObj = {
      id: newClubId,
      name: clubData.name,
      college,
      description: rawDescription,
      category: clubData.category || 'General',
      logo,
      membersCount: 1,
      ownerId: validOwnerId,
    };

    setClubs((prev) => [newClubObj, ...prev]);
    setClubProfile(newClubObj);
    setMyMemberships((prev) => [...prev, { club_id: newClubId, user_id: validOwnerId, role: 'admin' }]);
    return newClubObj;
  };

  // Request to Join a Club (sets role to 'pending' waiting for admin approval)
  const requestJoinClub = async (clubId) => {
    if (!user?.id) return;
    try {
      await supabase.from('club_members').upsert({
        club_id: clubId,
        user_id: user.id,
        role: 'pending',
      });
      setMyMemberships((prev) => [
        ...prev.filter((m) => m.club_id !== clubId),
        { club_id: clubId, user_id: user.id, role: 'pending' },
      ]);
    } catch (e) {
      console.warn('Error requesting club join:', e);
    }
  };

  const joinClub = requestJoinClub; // Alias for backwards compatibility

  // Approve pending club member request (Club Admin action)
  const approveClubMember = async (clubId, userId) => {
    try {
      await supabase
        .from('club_members')
        .update({ role: 'member' })
        .eq('club_id', clubId)
        .eq('user_id', userId);

      setMyMemberships((prev) =>
        prev.map((m) =>
          m.club_id === clubId && m.user_id === userId ? { ...m, role: 'member' } : m
        )
      );
    } catch (e) {
      console.warn('Error approving club member:', e);
    }
  };

  // Promote a member to Admin role
  const promoteToClubAdmin = async (clubId, userId) => {
    try {
      await supabase
        .from('club_members')
        .update({ role: 'admin' })
        .eq('club_id', clubId)
        .eq('user_id', userId);

      setMyMemberships((prev) =>
        prev.map((m) =>
          m.club_id === clubId && m.user_id === userId ? { ...m, role: 'admin' } : m
        )
      );
    } catch (e) {
      console.warn('Error promoting member to admin:', e);
    }
  };

  // Reject / Remove club member request
  const rejectClubMember = async (clubId, userId) => {
    try {
      await supabase
        .from('club_members')
        .delete()
        .eq('club_id', clubId)
        .eq('user_id', userId);

      setMyMemberships((prev) =>
        prev.filter((m) => !(m.club_id === clubId && m.user_id === userId))
      );
    } catch (e) {
      console.warn('Error rejecting club member:', e);
    }
  };

  // Leave a Club
  const leaveClub = async (clubId) => {
    if (!user?.id) return;
    try {
      await supabase.from('club_members').delete().eq('club_id', clubId).eq('user_id', user.id);
      setMyMemberships((prev) => prev.filter((m) => m.club_id !== clubId));
    } catch (e) {
      console.warn('Error leaving club:', e);
    }
  };

  const getMembershipStatus = (clubId) => {
    const clubObj = clubs.find((c) => String(c.id) === String(clubId));
    if (user && clubObj && (clubObj.ownerId === user.id || user.role === 'club_admin' || user.role === 'super_admin')) {
      return 'admin';
    }
    const m = myMemberships.find((mem) => String(mem.club_id) === String(clubId));
    if (!m) return 'none';
    if (m.role === 'admin') return 'admin';
    if (m.role === 'member') return 'member';
    if (m.role === 'pending') return 'pending';
    return 'none';
  };

  const isMember = (clubId) => {
    const status = getMembershipStatus(clubId);
    return status === 'member' || status === 'admin';
  };

  useEffect(() => {
    loadSupabaseEvents();
    loadSupabaseClubs();
    loadSupabaseAnnouncements();

    const localUser = localStorage.getItem('campushub_demo_user');
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        setUser(parsed);
        setUserProfile({
          id: parsed.id,
          full_name: parsed.name,
          email: parsed.email,
          role: parsed.role,
          bio: 'Demo Account User',
        });
      } catch (e) {
        localStorage.removeItem('campushub_demo_user');
      }
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await syncProfile(session);
        await loadUserMemberships(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await syncProfile(session);
        await loadUserMemberships(session.user.id);
        localStorage.removeItem('campushub_demo_user');
      } else if (!localStorage.getItem('campushub_demo_user')) {
        setUser(null);
        setUserProfile(null);
        setMyMemberships([]);
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

  const checkInParticipant = (ticketId) => {
    const trimmedId = ticketId.trim().toUpperCase();
    const index = participants.findIndex((p) => p.ticketId.toUpperCase() === trimmedId);

    if (index === -1) {
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

  // Create Manager Event with Persistent Supabase DB Insert
  const createManagerEvent = async (newEventData) => {
    let createdId = `ev-${Date.now()}`;
    let clubId = newEventData.clubId || null;

    const poster =
      newEventData.poster && newEventData.poster.trim().length > 0
        ? newEventData.poster.trim()
        : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80';
    const category = newEventData.category || 'Hackathons';
    const clubName = newEventData.clubName || clubProfile.name || 'Campus Code Collective';
    const rawDescription = newEventData.description || 'Join us for this high-energy campus experience!';

    const fullDescription = `<!--METADATA:${JSON.stringify({ poster, category, clubName })}-->\n${rawDescription}`;

    try {
      if (!isValidUUID(clubId)) {
        // 1. Get or create a club in Supabase
        const { data: existingClubs } = await supabase.from('clubs').select('id').limit(1);

        if (existingClubs && existingClubs.length > 0) {
          clubId = existingClubs[0].id;
        } else {
          // Create default club
          const { data: userProf } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
          let ownerId = session?.user?.id || userProf?.id;
          if (!isValidUUID(ownerId) && userProf?.id) ownerId = userProf.id;

          if (ownerId && isValidUUID(ownerId)) {
            const { data: newClub } = await supabase
              .from('clubs')
              .insert({
                name: clubName,
                description: 'Official campus club',
                owner_id: ownerId,
                is_approved: true,
              })
              .select('id')
              .single();

            if (newClub) {
              clubId = newClub.id;
            }
          }
        }
      }

      if (clubId && isValidUUID(clubId)) {
        const { data: insertedEvent, error: eventErr } = await supabase
          .from('events')
          .insert({
            club_id: clubId,
            title: newEventData.title || 'New Campus Event',
            description: fullDescription,
            location: newEventData.location || 'Campus Auditorium',
            event_date: new Date().toISOString(),
            capacity: Number(newEventData.capacity) || 50,
            is_published: true,
          })
          .select()
          .single();

        if (!eventErr && insertedEvent) {
          createdId = insertedEvent.id;
        } else if (eventErr) {
          console.error('Supabase event insertion error:', eventErr.message || eventErr);
        }
      }
    } catch (e) {
      console.warn('Error during Supabase event creation:', e);
    }

    const createdEvent = {
      id: createdId,
      title: newEventData.title,
      date: newEventData.date || 'Sep 30, 2026',
      location: newEventData.location || 'Campus Auditorium',
      category,
      poster,
      clubName,
      clubId,
      description: rawDescription,
      capacity: Number(newEventData.capacity) || 50,
      availablePasses: Number(newEventData.capacity) || 50,
      sponsors: newEventData.sponsors || [],
    };

    setEvents((prev) => [createdEvent, ...prev]);
    return createdEvent;
  };

  // Delete Manager Event
  const deleteManagerEvent = async (eventId) => {
    try {
      await supabase.from('events').delete().eq('id', eventId);
    } catch (e) {
      console.warn('Error deleting event from Supabase:', e);
    }
    setEvents((prev) => prev.filter((e) => String(e.id) !== String(eventId)));
  };

  // Approve / Reject / Check-In Registration Status
  const updateRegistrationStatus = (ticketId, newStatus) => {
    const updatedP = participants.map((p) =>
      p.ticketId === ticketId
        ? { ...p, status: newStatus, checkInTime: newStatus === 'Checked-In' ? new Date().toLocaleTimeString() : p.checkInTime }
        : p
    );
    saveParticipants(updatedP);

    const updatedT = tickets.map((t) =>
      t.ticketId === ticketId ? { ...t, status: newStatus } : t
    );
    saveTickets(updatedT);
  };

  // Load Announcements from Supabase DB
  const loadSupabaseAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((a) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          date: a.created_at
            ? new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Just now',
          clubId: a.club_id,
          eventId: a.event_id || null,
        }));
        setAnnouncements(mapped);
      }
    } catch (e) {
      console.warn('Could not load announcements from Supabase:', e);
    }
  };

  const updateClubPage = async (updates, targetClubId) => {
    const updatedProfile = { ...clubProfile, ...updates };
    setClubProfile(updatedProfile);

    let clubId = targetClubId || myMemberships[0]?.club_id || clubs[0]?.id;
    if (!isValidUUID(clubId)) {
      const { data: cData } = await supabase.from('clubs').select('id').limit(1).maybeSingle();
      if (cData?.id) clubId = cData.id;
    }

    if (clubId && isValidUUID(clubId)) {
      try {
        const logo = updates.logo || updates.logo_url || clubProfile.logo;
        const college = updates.college || clubProfile.college || 'Campus University';
        const rawDescription = updates.description !== undefined ? updates.description : clubProfile.description || '';
        const fullDescription = `<!--METADATA:${JSON.stringify({ college, logo })}-->\n${rawDescription}`;

        const payload = {
          updated_at: new Date().toISOString(),
        };
        if (updates.name) payload.name = updates.name;
        if (updates.category) payload.category = updates.category;
        if (logo) payload.logo_url = logo;
        if (updates.description !== undefined || updates.college !== undefined) {
          payload.description = fullDescription;
        }

        const { error } = await supabase
          .from('clubs')
          .update(payload)
          .eq('id', clubId);

        if (error) {
          console.error('Supabase updateClubPage error:', error.message || error);
        }
      } catch (e) {
        console.warn('Error updating club page in Supabase:', e);
      }
    }

    setClubs((prev) =>
      prev.map((c) => (String(c.id) === String(clubId) ? { ...c, ...updates } : c))
    );
  };

  const addClubAnnouncement = async (title, content, targetClubId, eventId = null) => {
    let clubId = targetClubId || myMemberships[0]?.club_id || clubs[0]?.id;
    if (!isValidUUID(clubId)) {
      const { data: cData } = await supabase.from('clubs').select('id').limit(1).maybeSingle();
      if (cData?.id) clubId = cData.id;
    }

    const newAnn = {
      id: `ann-${Date.now()}`,
      title,
      content,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: clubProfile.name || 'Club Lead',
      clubId,
      eventId,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);

    if (clubId && isValidUUID(clubId)) {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .insert({
            club_id: clubId,
            title,
            content,
            event_id: eventId || null,
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase announcement insertion error:', error.message || error);
        }
      } catch (e) {
        console.warn('Error inserting announcement in Supabase:', e);
      }
    }
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
    setUserProfile(null);
    setSession(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        updateUserProfile,
        session,
        loading,
        tickets,
        participants,
        clubs,
        myMemberships,
        createClub,
        joinClub,
        requestJoinClub,
        approveClubMember,
        rejectClubMember,
        promoteToClubAdmin,
        getMembershipStatus,
        leaveClub,
        isMember,
        clubProfile,
        announcements,
        events,
        registerForEvent,
        cancelTicket,
        checkInParticipant,
        createManagerEvent,
        deleteManagerEvent,
        updateRegistrationStatus,
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
