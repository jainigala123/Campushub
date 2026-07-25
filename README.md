# 🎓 Campus Hub — Complete Technical Documentation & Beginner's Guide

Welcome to **Campus Hub**, a modern, full-featured campus community platform designed to connect students with intercollegiate events, workshops, hackathons, and student clubs.

This document serves as an exhaustive, beginner-friendly guide to the architecture, codebase structure, individual files, and code logic of Campus Hub.

---

## 📚 Table of Contents
1. [Overview & Key Features](#-overview--key-features)
2. [Tech Stack](#-tech-stack)
3. [Full Project Directory Structure](#-full-project-directory-structure)
4. [File-by-File Breakdown & Code Logic](#-file-by-file-breakdown--code-logic)
5. [Core Concepts Explained for Beginners](#-core-concepts-explained-for-beginners)
6. [Getting Started & Local Setup](#-getting-started--local-setup)

---

## 🌟 Overview & Key Features

Campus Hub is divided into two primary role-isolated experiences:

### 🎓 1. Student Experience
- **Event Discovery**: Filter campus experiences by Category (*Hackathons, Cultural, Workshops, Sports, Seminars, Competitions*) and Location (*Campus Wide, Near Me*).
- **Interactive Event Detail Modal**: Modal popup with detailed event descriptions, rules, timelines, and 1-click registration.
- **Student Dashboard (`/dashboard`)**: Central hub for viewing active passes, upcoming events, and ticket statuses (*Allowed to Attend*).
- **Digital Ticket Pass & Unique Registration ID**: Every registration issues a unique Registration ID (e.g. `CH-2026-94821`) alongside a digital pass complete with a QR code for gate check-in.

### 🛡️ 2. Club Manager / Organizer Experience
- **Manager Portal (`/manager/dashboard`)**: Dashboard for club leads to manage club profiles, events, and live gate attendance.
- **Create Event with Limited Passes**: Publish events with custom seat capacities (*e.g., 50 or 100 max passes*).
- **Live Participant Check-In Tracker**: View registered students, email addresses, pass types, and gate check-in timestamps with a 1-click manual "Let In" action.
- **📱 Mobile QR Scanner Web-App (`/scanner`)**: Mobile-optimized scanner view featuring a laser viewfinder animation, live registration ID verification, audio/visual check-in feedback ("ENTRY ALLOWED ✅"), and real-time gate entry counters.
- **Announcements & Sponsor Manager**: Publish announcements to attendee feeds and showcase event brand sponsors (*Gold, Platinum, Tech Partner*).

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Styling**: [TailwindCSS 3](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons (Feather Icons - `fi`)](https://react-icons.github.io/react-icons/)
- **State & Storage**: React Context API (`AuthContext`) + `localStorage` persistence
- **Backend & Database**: [Supabase JS Client](https://supabase.com/)

---

## 📁 Full Project Directory Structure

```text
Campushub/
├── client/                           # Main React Single Page Application (SPA)
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── components/               # Reusable UI Components
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx   # Role-based route protection guard
│   │   │   ├── buttons/
│   │   │   │   ├── PrimaryButton.jsx    # Styled primary button
│   │   │   │   └── SecondaryButton.jsx  # Styled secondary button
│   │   │   ├── cards/
│   │   │   │   ├── CategoryCard.jsx     # Category preview card
│   │   │   │   ├── ClubCard.jsx         # Club directory preview card
│   │   │   │   └── EventCard.jsx        # Event card with fallback poster handling
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx            # Status badge pill
│   │   │   │   ├── SectionHeading.jsx   # Reusable section title & description
│   │   │   │   ├── StatCard.jsx         # Metric display card
│   │   │   │   └── TestimonialCard.jsx  # Student review card
│   │   │   ├── footer/
│   │   │   │   └── Footer.jsx           # App footer navigation & copyright
│   │   │   ├── modals/
│   │   │   │   └── EventDetailModal.jsx # Popup modal for event schedule & rules
│   │   │   ├── navbar/
│   │   │   │   └── Navbar.jsx           # Dynamic header with role-based menu items
│   │   │   └── tickets/
│   │   │       └── TicketPassModal.jsx  # Digital pass modal with QR code & Print PDF
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global Auth, Tickets, & Manager state
│   │   ├── data/
│   │   │   └── dummyData.js          # Default seed dataset for events, clubs, stats
│   │   ├── layouts/
│   │   │   └── Layout.jsx            # Main app page shell (Navbar + Outlet + Footer)
│   │   ├── lib/
│   │   │   └── supabase.js           # Supabase client initialization
│   │   ├── pages/
│   │   │   ├── About/AboutPage.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── LoginPage.jsx     # Login form with role & demo shortcuts
│   │   │   │   └── SignupPage.jsx    # Registration form with role selector
│   │   │   ├── Clubs/
│   │   │   │   ├── ClubDetailsPage.jsx
│   │   │   │   └── ClubsPage.jsx
│   │   │   ├── Contact/
│   │   │   │   ├── ContactPage.jsx
│   │   │   │   ├── PrivacyPage.jsx
│   │   │   │   └── TermsPage.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── ManagerDashboard.jsx  # Club Manager portal & participant check-in
│   │   │   │   └── StudentDashboard.jsx  # Student ticket passes & events overview
│   │   │   ├── Events/
│   │   │   │   ├── EventDetailsPage.jsx  # Dedicated event landing page
│   │   │   │   └── EventsPage.jsx        # Searchable event directory with filters
│   │   │   ├── Landing/
│   │   │   │   └── LandingPage.jsx       # Public landing page (redirects if logged in)
│   │   │   ├── NotFound/
│   │   │   │   └── NotFoundPage.jsx      # 404 fallback page
│   │   │   └── Scanner/
│   │   │       └── MobileScannerPage.jsx # Mobile web-app QR & ID scanner
│   │   ├── services/
│   │   │   └── api.js                # Optional API helper service
│   │   ├── styles/
│   │   │   └── index.css             # TailwindCSS import directives & custom styles
│   │   ├── App.jsx                   # Central application routing configuration
│   │   └── main.jsx                  # Application entry point (DOM render)
│   ├── .env                          # Client environment variables (Supabase keys)
│   ├── index.html                    # Root HTML document template
│   ├── package.json                  # Dependencies & npm scripts
│   ├── tailwind.config.js            # Tailwind styling tokens & theme colors
│   └── vite.config.js                # Vite build configuration
├── backend/                          # Backend Node.js server (optional API layer)
└── README.md                         # Project documentation
```

---

## 📖 File-by-File Breakdown & Code Logic

Below is a detailed walkthrough of how each file functions:

### 1. `client/src/App.jsx`
- **Purpose**: Defines the primary application routing table using `react-router-dom`.
- **Key Logic**:
  - Sets up routes inside `<AuthProvider>` so state is available everywhere.
  - Places standard pages (`/events`, `/clubs`, `/dashboard`, `/manager/dashboard`) inside `<Layout />`.
  - Configures `<ProtectedRoute allowedRole="student">` for `/dashboard` to ensure Managers are redirected to `/manager/dashboard`.
  - Configures `<ProtectedRoute allowedRole="organizer">` for `/manager/dashboard` and `/scanner` to block unauthorized student access.

### 2. `client/src/context/AuthContext.jsx`
- **Purpose**: Central state manager for authentication, user roles, tickets, participant check-ins, events, announcements, and sponsors.
- **Key Logic**:
  - `user`: Holds current user object (`id`, `name`, `email`, `role`).
  - `tickets`: List of event tickets registered by the student.
  - `participants`: Master participant list for event organizers.
  - `registerForEvent(event)`: Generates a new ticket with a unique Registration ID (e.g. `CH-2026-94821`), saves it to `tickets`, and adds the student to `participants`.
  - `checkInParticipant(ticketId)`: Searches for a ticket by ID, updates its status to `'Checked-In'`, records timestamp, and returns validation status.
  - `createManagerEvent(data)`: Adds a new event with limited pass capacity to the event directory.

### 3. `client/src/components/auth/ProtectedRoute.jsx`
- **Purpose**: High-order guard component that enforces role-based access control.
- **Key Logic**:
  - If user is not logged in $\rightarrow$ redirects to `/login`.
  - If `allowedRole === 'organizer'` and user is a Student $\rightarrow$ redirects to `/dashboard`.
  - If `allowedRole === 'student'` and user is an Organizer $\rightarrow$ redirects to `/manager/dashboard`.

### 4. `client/src/components/navbar/Navbar.jsx`
- **Purpose**: Sticky navigation bar present across all pages.
- **Key Logic**:
  - Inspects `user.role` from `useAuth()`.
  - **Student View**: Shows *Dashboard*, *Events*, *Clubs*, User Avatar Badge, and *Logout*.
  - **Manager View**: Shows *Manager Portal*, *📱 Mobile Scanner*, *Events*, *Clubs*, Manager Badge, and *Logout*.
  - **Public View**: Shows *Home*, *Events*, *Clubs*, *About*, *Contact*, *Login*, and *Register*.

### 5. `client/src/components/modals/EventDetailModal.jsx`
- **Purpose**: Pop-up window for viewing full event details without navigating away.
- **Key Logic**:
  - Renders event poster image (with automatic fallback gradient if image URL fails).
  - Displays event schedule timeline, venue, rules, and entry guidelines.
  - Shows instant registration status or a **"Register & Get Ticket"** button.

### 6. `client/src/components/tickets/TicketPassModal.jsx`
- **Purpose**: Digital ticket pass modal formatted like a physical event ticket.
- **Key Logic**:
  - Prominently displays the **Unique Registration ID** (e.g. `CH-2026-94821`).
  - Displays attendee name, email, gate access instructions, and date/time.
  - Generates a visual QR code for gate scanning.
  - Features a **"Print / Save PDF"** button (`window.print()`).

### 7. `client/src/pages/Dashboard/StudentDashboard.jsx`
- **Purpose**: Post-login home page for students.
- **Key Logic**:
  - **Tab 1 ("My Event Tickets")**: Displays digital ticket pass cards with unique IDs, gate status (*Allowed to Attend*), and quick button to open `TicketPassModal`.
  - **Tab 2 ("Explore All Events")**: Grid of campus events with search bar and category filters.

### 8. `client/src/pages/Dashboard/ManagerDashboard.jsx`
- **Purpose**: Post-login portal for Club Managers & Event Organizers.
- **Key Logic**:
  - **Tab 1 ("Attendees & Gate Entry")**: Live participant table showing registration IDs, names, emails, check-in status, and 1-click "Let In" action button.
  - **Tab 2 ("Create Event & Limited Passes")**: Form to publish new events with seat capacity limits.
  - **Tab 3 ("Manage Club Page & Posts")**: Edit club profile and post announcement feeds.
  - **Tab 4 ("Add Event Sponsors")**: Add sponsor brand logos and assign sponsor tiers (*Platinum, Gold, Tech Partner*).

### 9. `client/src/pages/Scanner/MobileScannerPage.jsx`
- **Purpose**: Standalone mobile web-app for scanning QR codes and checking in attendees.
- **Key Logic**:
  - Fullscreen dark interface optimized for smartphone screens (`/scanner`).
  - Features an animated laser viewfinder overlay.
  - Form to enter or scan Registration IDs.
  - Triggers instant **"ENTRY ALLOWED ✅"** or **"DENIED ❌"** verification feedback cards.

### 10. `client/src/pages/Events/EventsPage.jsx`
- **Purpose**: Public searchable events directory.
- **Key Logic**:
  - Sidebar filters for Category and Location (*Campus Wide, Near Me*) with aligned padding (`px-5 py-3.5`).
  - Real-time search query filtering over event titles and locations.

---

## 🔍 Core Concepts Explained for Beginners

### 1. What is React Context (`AuthContext`)?
Instead of passing user data down through every component using props (known as *prop drilling*), React Context creates a global store. Any component in Campus Hub can simply call `useAuth()` to get the current user, active tickets, or trigger a check-in.

### 2. How are Unique Registration IDs Generated?
When a student clicks "Register", `registerForEvent()` runs in `AuthContext.jsx`:
```javascript
const randomDigits = Math.floor(10000 + Math.random() * 90000);
const newTicketId = `CH-2026-${randomDigits}`;
```
This guarantees every issued ticket gets a unique code like `CH-2026-94821`.

### 3. How Does Role-Based Protection Work?
When a user attempts to open `/manager/dashboard`:
1. `App.jsx` evaluates the `<ProtectedRoute allowedRole="organizer">` wrapper.
2. `ProtectedRoute.jsx` inspects `user.role`.
3. If `user.role !== 'organizer'`, it returns `<Navigate to="/dashboard" replace />`, automatically redirecting student accounts away from administrative portals.

---

## 🚀 Getting Started & Local Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jainigala123/Campushub.git
   cd Campushub
   ```

2. **Navigate to the Client Directory & Install Dependencies**:
   ```bash
   cd client
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and visit: `http://localhost:5173`

4. **Testing User Roles**:
   - **Student Demo**: Click "Login" $\rightarrow$ "Student Demo" $\rightarrow$ Navigates to `/dashboard`.
   - **Manager Demo**: Click "Login" $\rightarrow$ "Organizer Demo" $\rightarrow$ Navigates to `/manager/dashboard`.
   - **Mobile QR Scanner**: Log in as Manager $\rightarrow$ Click "📱 Mobile Scanner" or navigate to `http://localhost:5173/scanner`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License
This project is open-source and available under the MIT License.
