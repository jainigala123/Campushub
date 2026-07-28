import profilesRouter from './../routes/profiles/index.js';
import eventsRouter from './../routes/events/index.js';
import eventRegistrationsRouter from './../routes/event_registrations/index.js';
import clubsRouter from './../routes/clubs/index.js';
import announcementsRouter from './../routes/announcements/index.js';

export default function registerRoutes(app) {
  app.use('/api/profiles', profilesRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/event_registrations', eventRegistrationsRouter);
  app.use('/api/clubs', clubsRouter);
  app.use('/api/announcements', announcementsRouter);
}
