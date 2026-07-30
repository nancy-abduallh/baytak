# بيتك (Baytak) — Home Maintenance & Services Platform

A desktop web application (from Balady) that lets customers book verified technicians
(plumbing, electrical, AC, carpentry, painting, cleaning) and track the request from
booking to completion.

This document is the single source of truth for the project: stack, architecture,
folder layout, database design, environment variables, and setup commands.

---

## 1. Tech Stack

| Layer          | Technology                                                            |
|----------------|------------------------------------------------------------------------|
| Frontend       | Next.js 15 (App Router) + TypeScript + Tailwind CSS                   |
| Backend        | NestJS + TypeScript (built in a follow-up session)                     |
| Database       | MySQL 8 (via XAMPP)                                                     |
| ORM            | TypeORM (planned for the NestJS backend)                               |
| Auth           | JWT (access + rotating refresh tokens), bcrypt password hashing        |
| Realtime       | Socket.io (order status / "technician on the way") — backend session   |
| State (client) | Zustand (light global state: auth/session)                             |
| Forms          | react-hook-form + zod                                                  |
| Icons          | lucide-react                                                            |

**Why this split:** Next.js gives the marketing/home page SSR (SEO + fast first paint),
file-based routing that matches the three page types in the design (home / booking /
dashboard), and can add its own API routes later as a thin BFF if ever needed. NestJS
gives a modular, DI-based backend that scales cleanly as technician-matching, payments,
and admin reporting are added, with first-class WebSocket support for live order
tracking. A single TypeScript codebase means DTOs/API contracts can eventually be
shared between the two apps.

---

## 2. Monorepo Structure

```
baytak-platform/
├── frontend/                # Next.js 15 app (this session)
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # UI building blocks, grouped by page/domain
│   │   ├── lib/               # api client, types, constants
│   │   └── hooks/
│   ├── public/
│   ├── .env.local
│   └── package.json
│
├── backend/                 # NestJS API (next session)
│   └── src/
│       ├── modules/           # auth, users, technicians, orders, reviews...
│       └── main.ts
│
├── database/                 # MySQL schema + seed data (this session)
│   ├── schema.sql
│   └── seed.sql
│
└── docs/
    └── PROJECT.md            # this file
```

---

## 3. Design System (extracted from the approved mockups)

### Colors
| Token        | Hex        | Usage                          |
|--------------|------------|---------------------------------|
| `ink`        | `#12302E`  | body text, footer background   |
| `teal-900`   | `#123B37`  | nav bar, hero gradient top      |
| `teal-800`   | `#175249`  | dashboard active nav item text  |
| `teal-700`   | `#1E6B5C`  | primary buttons (book, links)   |
| `green-500`  | `#4C9A6A`  | accent, active nav tab, brand   |
| `green-100`  | `#E6F2E9`  | soft badges / icon backgrounds  |
| `gold-500`   | `#BF8A34`  | CTA button, ratings, avatars    |
| `gold-100`   | `#F6E9D2`  | rating pill background          |
| `sand-50`    | `#F6F3EC`  | page background                 |
| `sand-100`   | `#EFEAE0`  | filter chips, subtle surfaces   |
| `line`       | `#E2DDD0`  | borders                         |
| `danger`     | `#B24B3C`  | errors / cancelled state        |

### Typography
- Headings: **Tajawal** (700/800/900)
- Body: **IBM Plex Sans Arabic** (400/500/600)
- Direction: **RTL**, `lang="ar" dir="rtl"` on `<html>`

### Radii & Shadows
- `radius-lg: 22px` (cards, hero panels) · `radius-md: 14px` (list cards) · `radius-sm: 9px`
- `shadow-card: 0 10px 30px rgba(18,48,46,.08)` · `shadow-lift: 0 18px 44px rgba(18,48,46,.16)`

---

## 4. Pages & Features (this session covers the Frontend)

### 4.1 Home (`/`)
- Hero with headline, CTA buttons, live stats (technicians, rating, 24/7), and a
  radial "service hub" diagram (6 service nodes orbiting a house icon).
- Services grid (6 categories) pulled from `service_categories`.
- "From request to done in 4 steps" process section.
- Trust bar (verified technicians, guarantee, transparent pricing, 24/7 support).
- Footer with site map + contact details.

### 4.2 Services & Booking (`/services/[category]`)
- Breadcrumb + category header with live technician count.
- Sticky filter sidebar: category chips, price range, minimum rating, availability.
- Sortable technician list: avatar, verified badge, rating, distance, years of
  experience, starting price, "Book now" CTA.

### 4.3 Dashboard — My Orders (`/dashboard/orders`)
- Sticky account sidebar (profile, orders, favorites, payment methods, settings, logout).
- Status tabs (All / In progress / Completed) with live counts.
- Order list rows (icon, title, technician, status pill, amount).
- Selected-order detail panel (order #, status, technician, address, description,
  "Contact technician" action).

### 4.4 Auth (`/login`, `/register`)
- Phone/email + password, Google/Apple SSO buttons (wired once the backend OAuth
  endpoints exist).

---

## 5. Database Design

See [`database/schema.sql`](./database/schema.sql) for the full DDL and
[`database/seed.sql`](./database/seed.sql) for sample data matching the mockups.

**Core tables:** `users`, `addresses`, `service_categories`, `technicians`,
`technician_categories`, `technician_availability`, `orders`, `order_images`,
`order_status_history`, `reviews`, `favorites`, `payment_methods`, `notifications`,
`admins`, `auth_tokens`.

**Design notes**
- `utf8mb4` everywhere for correct Arabic (and emoji) storage.
- InnoDB for foreign keys + transactional integrity.
- Soft delete (`deleted_at`) on `users` so historical orders/reviews stay intact.
- `orders.id` starts at `1000` (`AUTO_INCREMENT = 1000`) so the first order reads as
  `#1000`, matching the design.
- `order_status_history` is an append-only timeline — this is what will power the
  "Technician is on the way" live tracking once the backend adds WebSocket events.
- `auth_tokens` stores only a **hash** of the refresh token, one row per session
  (user, technician, or admin), enabling rotation and per-device revocation.
- Ratings on `technicians` (`average_rating`, `review_count`) are denormalized for
  fast list rendering and recalculated by the backend whenever a review is written.

---

## 6. Environment Variables

`frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_NAME=بيتك
```

`backend/.env` (created in the next session, listed here for reference)
```
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=baytak_db
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
```

**Security note:** never commit real secrets. `.env*` files are git-ignored; only
`.env.example` (with placeholder values) is committed.

---

## 7. Setup — Quick Reference

Full command-by-command instructions are in the chat response that generated this
project (Command Prompt / Windows), summarized here:

1. Scaffold the monorepo folders (`frontend/`, `backend/`, `database/`, `docs/`).
2. `npx create-next-app@latest frontend` with TypeScript + Tailwind + App Router.
3. Install frontend dependencies (`axios`, `zustand`, `react-hook-form`, `zod`,
   `lucide-react`, `clsx`).
4. Start XAMPP → Apache + MySQL.
5. Create the `baytak_db` database and import `database/schema.sql`, then
   `database/seed.sql`, via phpMyAdmin or the `mysql` CLI.
6. `npm run dev` inside `frontend/` → http://localhost:3000

---

## 8. Roadmap

- [x] Design tokens, folder structure, MySQL schema + seed data
- [x] Next.js frontend: Home, Services/Booking, Dashboard pages (static/mock-data ready)
- [ ] NestJS backend: auth module (JWT + refresh rotation), users, technicians,
      service categories, orders, reviews, notifications modules — **next session**
- [ ] Wire the frontend `lib/api.ts` client to the live backend, remove mock fallbacks
- [ ] Socket.io live order tracking
- [ ] Payments integration (mada / Apple Pay / STC Pay)
- [ ] Admin back-office
- [ ] Deployment (Nginx reverse proxy, PM2/Docker, production MySQL)

---

## 9. Conventions

- **TypeScript everywhere**, `strict: true`.
- **RTL-first**: no hard-coded `margin-left`/`right` — use Tailwind's logical
  utilities (`ms-`, `me-`, `ps-`, `pe-`) so the UI stays correct if an LTR locale is
  ever added.
- **Component boundaries**: presentational components stay dumb (props in, JSX out);
  data fetching happens in `app/**/page.tsx` (Server Components) or dedicated hooks.
- **Naming**: PascalCase components, camelCase functions/vars, kebab-case routes.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`...).
