# CampusHub

## Product Requirements Document (PRD)

### Version
v1.0 (MVP)

## 1. Problem Statement
Universities often rely on multiple disconnected platforms for student activities. Events are shared through WhatsApp groups, club registrations are handled through Google Forms, announcements are scattered across emails and social media, and students struggle to discover opportunities. Club organizers also lack a centralized system to manage members and events.

This fragmented experience leads to poor communication, missed events, duplicate work, and low student engagement. CampusHub aims to solve this by providing a single platform where students and clubs can interact.

## 2. Vision
CampusHub will become a modern digital campus community where students can discover communities, participate in events, and stay connected through one platform.

CampusHub is not an LMS. It is the community layer of a college.

## 3. Objectives
### Students should be able to
- Create an account
- Join clubs
- Browse upcoming events
- Register for events
- Receive announcements
- Manage their own profile

### Club Administrators should be able to
- Create clubs
- Publish events
- Manage members
- Publish announcements
- View participation analytics

### Super Admin should be able to
- Approve clubs
- Manage users
- Moderate content
- View platform statistics

## 4. Target Users
### Primary
- College Students
- Age: 18–25
- Needs: Find clubs, register for events, network, stay updated

### Secondary
- Club Coordinators
- Needs: Organize events, manage registrations, publish notices

### Tertiary
- College Administration
- Needs: Platform oversight, user moderation, analytics

## 5. MVP Scope
CampusHub v1 focuses on solving four core problems.

### Module 1: Authentication
Features:
- Login
- Signup
- Logout
- Forgot Password

### Module 2: Club Directory
Features:
- Browse Clubs
- View Club Details
- Join Club
- Leave Club

### Module 3: Events
Features:
- Browse Events
- Event Details
- Register
- Cancel Registration

### Module 4: Announcements
Features:
- View Announcements
- Filter by Club

### Module 5: Profile
Features:
- Edit Profile
- Joined Clubs
- Registered Events

## 6. Out of Scope (v1)
The MVP will not include:
- Chat
- Payments
- Attendance
- QR Check-in
- Certificates
- Notifications
- Mobile App
- AI Features
- Calendar Sync

## 7. Functional Requirements
### Authentication
Users can:
- Register
- Login
- Logout

Validation:
- Email must be unique
- Password minimum 8 characters

### Clubs
Users can:
- Browse clubs
- Search clubs
- View club information

Club Admins can:
- Create club
- Edit club
- Delete club

### Events
Students can:
- Browse events
- Register
- Cancel registration

Club Admins can:
- Create event
- Edit event
- Delete event

### Announcements
Club Admins can:
- Publish announcements

Students can:
- Read announcements

### Profiles
Students can:
- Upload avatar
- Update bio
- View joined clubs
- View event history

## 8. Non-Functional Requirements
### Performance
- Pages should load within 2 seconds under normal conditions.

### Usability
- New users should be able to register for an event without guidance.

### Security
- Passwords must be securely hashed.
- Protected routes should require authentication.
- Role-based access should prevent unauthorized actions.

### Scalability
- Support at least 10,000 users and 500 concurrent sessions without architectural changes.

### Accessibility
- Keyboard navigation for all interactive elements.
- Sufficient color contrast.
- Semantic HTML where applicable.

## 9. User Stories
### Student
- As a student, I want to browse clubs so that I can find communities that match my interests.
- As a student, I want to register for events so that I can participate without contacting organizers.
- As a student, I want to manage my profile so others can recognize me.

### Club Admin
- As a club coordinator, I want to publish events so students can register online.
- As a club coordinator, I want to view registrations so I know how many attendees to expect.

### Super Admin
- As an administrator, I want to manage clubs so inappropriate content can be removed.

## 10. Success Metrics
Within the first semester of deployment:
- 80% of students create an account.
- At least 60% of active clubs create a CampusHub page.
- Average event registration time is under one minute.
- More than 70% of event registrations occur through the platform.

## 11. Suggested Sprint Plan for MVP Development
This roadmap assumes a React frontend, an Express/Node.js backend, and Supabase for authentication, database, and storage.

### Recommended Tech Stack
- Frontend: React, Vite, React Router, Tailwind CSS, Axios or Fetch
- Backend: Node.js, Express.js, JWT authentication
- Database & Auth: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- Hosting: Vercel for frontend, Render or Railway for backend, Supabase for database

### Sprint 1 — Project Foundation
Goals:
- Set up frontend and backend repositories
- Configure Supabase project and environment variables
- Create database schema for users, clubs, events, announcements, and memberships
- Implement basic auth routes and protected routing

Deliverables:
- Working signup/login/logout flow
- Basic app shell and navigation
- Database tables and seed data

### Sprint 2 — User Profiles and Club Directory
Goals:
- Build student profile management
- Create club listing and club detail pages
- Implement club join/leave functionality
- Add search and filter by category

Deliverables:
- Profile page with bio and avatar upload
- Club directory with join/leave actions
- Basic club admin role support

### Sprint 3 — Event Management
Goals:
- Build event browsing and event detail pages
- Implement event registration and cancellation
- Allow club admins to create/edit/delete events
- Add event status and capacity handling

Deliverables:
- Event list and detail views
- Registration workflow for students
- Admin event management tools

### Sprint 4 — Announcements and Content Publishing
Goals:
- Implement announcement creation for club admins
- Add announcement listing and filtering by club
- Add moderation support for super admins

Deliverables:
- Announcement feed
- Club-specific announcement filters
- Admin moderation controls

### Sprint 5 — Role-Based Access and Admin Dashboards
Goals:
- Add role-based permissions for student, club admin, and super admin
- Build admin dashboards for club approval and user management
- Add analytics views for participation counts and club activity

Deliverables:
- Protected admin and club-admin routes
- Basic analytics dashboard
- Club approval workflow

### Sprint 6 — Testing, Polish, and Deployment
Goals:
- Perform end-to-end testing for major user flows
- Improve UI responsiveness and accessibility
- Prepare deployment for production
- Write basic documentation and onboarding steps

Deliverables:
- Deployed MVP
- Bug fixes and UX refinements
- README and setup instructions

## 12. Suggested Development Order
1. Authentication
2. Clubs
3. Events
4. Announcements
5. Profiles
6. Admin features
7. Testing and deployment

## 13. Definition of Done for MVP
A feature is considered complete when:
- It works end-to-end in the browser
- It is accessible and responsive
- It is protected by the correct role-based rules
- It is tested for the main happy path
- It is documented in the project README
