# AutoVault — Whitelabel Car Dealership SaaS

> **!!! DEMO ADMIN ACCOUNT — FOR REVIEW !!!**
>
> - **Email:** `admin@pdigs.test`
> - **Password:** `AdminPass123!`
> - **Dealership storefront:** `/d/riverside`
> - **Admin dashboard:** `/d/riverside/admin`
>
> Sign in at `/login` to access the admin dashboard with pre-seeded cars, bookings, and analytics.

A multi-tenant SaaS platform that lets independent car dealerships launch branded online storefronts without any coding. Built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Supabase.

## Features

### For shoppers

- Inventory browsing with search, brand/fuel/price filters
- Side-by-side vehicle comparison
- Financing calculator (down payment, term, interest rate)
- Trade-in value estimator
- Test-drive booking form
- Animated page transitions

### For dealership owners

- Branded storefront — custom colors, logo, hero text
- Full inventory management (add, edit, delete, bulk import via Excel/JSON)
- Image upload and optimisation
- Analytics dashboard — impressions, test drives, deposit intents (Recharts)
- Booking management — view all submitted test-drive requests
- Printable sales contract

### Platform

- Supabase Auth (email/password)
- Row-Level Security on all tables — only owners access their own data
- Light / dark mode
- 500 error page with auto-redirect on Supabase free-tier outages
- Responsive, mobile-first UI

## Routes

| Path                        | Page                                              | Access           |
| --------------------------- | ------------------------------------------------- | ---------------- |
| `/`                         | Landing — SaaS homepage + dealership registration | Public           |
| `/discover`                 | Browse all public dealerships                     | Public           |
| `/login`                    | Sign in / sign up                                 | Public           |
| `/account`                  | User account settings                             | Auth required    |
| `/500`                      | Server error fallback                             | Public           |
| `/d/:slug`                  | Dealership inventory                              | Public           |
| `/d/:slug/car/:id`          | Car detail + booking form                         | Public           |
| `/d/:slug/compare`          | Vehicle comparison                                | Public           |
| `/d/:slug/calculator`       | Financing calculator                              | Public           |
| `/d/:slug/estimate`         | Trade-in estimator                                | Public           |
| `/d/:slug/about`            | Dealership info                                   | Public           |
| `/d/:slug/car/:id/contract` | Sales contract                                    | Auth required    |
| `/d/:slug/admin`            | Owner dashboard                                   | Dealership owner |

## Database schema

| Table                  | Purpose                               |
| ---------------------- | ------------------------------------- |
| `dealerships`          | Branding, contact info, owner email   |
| `cars`                 | Vehicle inventory per dealership      |
| `car_bookings`         | Test-drive requests                   |
| `car_analytics_events` | Impression / booking / deposit events |

Migrations live in `supabase/migrations/`.

## Prerequisites

- [Node.js](https://nodejs.org/) v22.x (see `.nvmrc`)
- [Bun](https://bun.sh/)

## Environment variables

```sh
cp .env.example .env
```

| Variable                 | Description                        |
| ------------------------ | ---------------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL          |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/publishable key |

## Getting started

```sh
bun install
bun run dev       # http://localhost:8080
```

## Supabase

```sh
bunx supabase link                    # link to your project
bunx supabase db push                 # apply migrations
bunx supabase gen types typescript --linked --schema public > src/lib/database.types.ts
```

## Build

```sh
nvm use           # ensure correct Node version
bun run build     # production build
bun run preview   # preview production build locally
```

## Testing

```sh
bun run test            # Vitest unit tests
bun run test:watch      # watch mode

bunx playwright install # first time only
bunx playwright test    # E2E tests (Playwright)
```

## Linting

```sh
bun run lint
```

## Tech stack

| Layer          | Library                               |
| -------------- | ------------------------------------- |
| Framework      | React 18 + TypeScript                 |
| Build          | Vite 5                                |
| Routing        | React Router 6                        |
| Data fetching  | TanStack React Query 5                |
| Forms          | React Hook Form + Zod                 |
| Styling        | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Animations     | Framer Motion                         |
| Charts         | Recharts                              |
| Icons          | Lucide React                          |
| Notifications  | Sonner                                |
| Backend / Auth | Supabase (PostgreSQL + Auth)          |
| Excel import   | xlsx                                  |
| Testing        | Vitest + Testing Library, Playwright  |
