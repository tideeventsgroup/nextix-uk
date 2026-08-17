# Crowdloop

A UK event-discovery and ticketing platform, built with Next.js (App Router),
Supabase Postgres and Better Auth, deployed on Vercel.

## Prerequisites

- Node.js `>=20.9.0`
- A Supabase project (Postgres database)

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run dev
```

## Environment variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Supabase Postgres connection string. Use the transaction pooler (port `6543`, host `aws-0-<region>.pooler.supabase.com`, username `<role>.<project-ref>`) for serverless deployments. |
| `BETTER_AUTH_SECRET` | Random 32+ byte secret used to sign sessions. Generate with `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | The deployment's own base URL (used server-side for callbacks). |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same base URL, exposed to the browser for the auth client. |

See `.env.example` for a template.

## Architecture

- `app/` — Next.js App Router routes and components.
- `app/events-data.ts` — shared event catalogue used across the homepage, Find Events, and event detail pages.
- `app/use-local-list.ts` / `app/use-saved-events.ts` — shared client-side saved-events state (localStorage-backed).
- `lib/auth.ts` — Better Auth server configuration (Drizzle Postgres adapter).
- `lib/auth-client.ts` — Better Auth React client (`useSession`, `signIn`, `signUp`, `signOut`, `requestPasswordReset`).
- `app/api/auth/[...all]/route.ts` — Better Auth's Next.js route handler.
- `db/schema.ts` — Drizzle schema for Better Auth's core tables (`user`, `session`, `account`, `verification`).
- `drizzle.config.ts` — points `drizzle-kit` at the Postgres database via `DATABASE_URL`.

## Database

Schema changes are applied as SQL migrations directly against the Supabase
project. `db:generate`/`db:push` (drizzle-kit) are available for local
development once `DATABASE_URL` is set, but the current schema was applied via
Supabase migrations and Row Level Security is enabled with no policies on the
`user`/`session`/`account`/`verification` tables — they're only ever read by
the server-side Better Auth connection, never by the browser.

## Useful commands

- `npm run dev` — start the local dev server
- `npm run build` — production build
- `npm start` — run a production build locally
- `npm run lint` — ESLint
- `npm run db:generate` / `npm run db:push` — Drizzle migrations

## Deployment

Deployed on Vercel, linked to this repository. Set the environment variables
above in the Vercel project settings before the first deploy.

## Not yet wired to the database

Events, venues, tickets, orders and the checkout flow currently use static
demo data and browser `localStorage` — only authentication (sign up, sign in,
sign out, password reset requests) is backed by the real Postgres database.
Persisting bookings, tickets and saved events per signed-in user is a natural
next step but is out of scope for the current pass.
