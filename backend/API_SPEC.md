# CampusHub — Backend API Specification

This document lists module-wise Node API endpoints mapped to the existing Postgres tables
(`profiles`, `events`, `event_registrations`, `clubs`, `club_members`, `announcements`).
All endpoints expect Supabase JWT Bearer auth unless noted otherwise.

## Conventions
- Auth: requests require `Authorization: Bearer <access_token>`
- `auth.uid()` = Supabase JWT subject (user id)
- Responses use JSON and standard HTTP codes (200, 201, 204, 400, 401, 403, 404, 409, 500)

---

## 1. Profiles (table: `profiles`)

- GET /api/profiles/:id
  - Auth: optional
  - Description: return public profile fields
  - Response: `{ id, full_name, email, avatar_url, bio, role, created_at, updated_at }`

- GET /api/profiles/me
  - Auth: required
  - Description: profile for current user

- POST /api/profiles
  - Auth: required
  - Body: `{ full_name?, avatar_url?, bio? }` — server uses JWT `sub` for `id`
  - 201 Created: returns created profile

- PATCH /api/profiles/me
  - Auth: required
  - Body: partial `{ full_name?, avatar_url?, bio? }`
  - 200 OK: returns updated profile

---

## 2. Events (table: `events`)

- GET /api/events
  - Auth: optional
  - Query: `?club_id=&?upcoming=true&?search=&?limit=&?offset=`
  - Notes: only `is_published=true` shown to public

- GET /api/events/:id
  - Auth: optional
  - Notes: draft visibility restricted to club admins/owners and `super_admin`

- POST /api/events
  - Auth: required
  - Body: `{ club_id, title, description?, location?, event_date, capacity?, is_published? }`
  - Permissions: caller must be club owner/admin for `club_id` or `super_admin`

- PATCH /api/events/:id
  - Auth: required
  - Permissions: club admin/owner or `super_admin`

- DELETE /api/events/:id
  - Auth: required
  - Permissions: club admin/owner or `super_admin`

---

## 3. Event Registrations (table: `event_registrations`)

- POST /api/events/:id/register
  - Auth: required
  - Behavior: atomically check `capacity` and insert registration; return 409 if full
  - Response: 201 with registration row

- DELETE /api/events/:id/register
  - Auth: required
  - Behavior: remove the calling user's registration

- GET /api/events/:id/attendees
  - Auth: optional
  - Notes: for unpublished events restrict to event owners/club admins/super_admin

---

## 4. Clubs (table: `clubs`)

- GET /api/clubs
  - Query: `?category=&?search=&?limit=&?offset=`
  - Public shows only `is_approved=true` clubs

- GET /api/clubs/:id

- POST /api/clubs
  - Auth: required
  - Body: `{ name, description?, category?, website?, logo_url? }`
  - Server sets `owner_id = auth.uid()` and `is_approved=false` by default

- PATCH /api/clubs/:id
  - Auth: required
  - Permissions: owner or `super_admin`

- DELETE /api/clubs/:id
  - Auth: required
  - Permissions: owner or `super_admin`

- POST /api/clubs/:id/approve
  - Auth: required
  - Permissions: `super_admin` or admin panel only

---

## 5. Club Members (table: `club_members`)

- GET /api/clubs/:id/members

- POST /api/clubs/:id/members
  - Auth: required
  - Body: `{}` — default join: insert member with `role='member'`
  - Alternative flow: support join-requests table (optional)

- POST /api/clubs/:id/members/:member_id/role
  - Auth: required
  - Body: `{ role: 'member'|'admin' }`
  - Permissions: only club admins/owner or `super_admin`

- DELETE /api/clubs/:id/members/:member_id
  - Auth: required
  - Permissions: member (self) or club admins for removal

---

## 6. Announcements (table: `announcements`)

- GET /api/clubs/:id/announcements
  - Paginated list

- POST /api/clubs/:id/announcements
  - Auth: required
  - Body: `{ title, content }`
  - Permissions: club admins/owners

- PATCH /api/announcements/:id
  - Auth: required
  - Permissions: club admins/owners

- DELETE /api/announcements/:id
  - Auth: required
  - Permissions: club admins/owners

---

## 7. Auth & Security

- All protected endpoints verify Supabase JWT and set `req.user.id = auth.uid()`.
- Recommended middleware: fetch `profiles` row for `req.user.id` to obtain `role`.
- Use Supabase RLS policies for defense-in-depth; server-side checks enforce business rules.

## 8. RLS / Policy Recommendations (high-level)
- `profiles`:
  - Allow SELECT for public fields
  - Allow UPDATE/DELETE only where `id = auth.uid()`
- `events`:
  - SELECT: `is_published = true` OR club member admin
  - INSERT/UPDATE/DELETE: club admin/owner OR `super_admin`
- `event_registrations`:
  - INSERT: authenticated users
  - DELETE: `user_id = auth.uid()` OR club admin/owner
- `clubs` and `club_members` and `announcements` follow similar owner/admin policies

---

## 9. Transactional examples
- Event registration (pseudocode):

```sql
BEGIN;
SELECT capacity FROM events WHERE id = $1 FOR UPDATE;
SELECT COUNT(*) FROM event_registrations WHERE event_id = $1;
-- if capacity OK, INSERT INTO event_registrations(...);
COMMIT;
```

Or implement as a Postgres function to enforce capacity atomically.

---

## 10. Next actions
- I can generate Express route stubs wired to `@supabase/supabase-js` and example RLS SQL policies.
- Tell me which module to scaffold first (recommended: `event_registrations` to enable join flow).
