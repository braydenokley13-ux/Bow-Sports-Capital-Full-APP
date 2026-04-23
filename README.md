# Bow Sports Capital — Unified Web App

The official home of Bow Sports Capital — a sports-business education brand
for students. Slides, podcasts, and interactive front-office simulations,
all wrapped in one beautiful gamified web app.

Vibe: **ESPN + Bloomberg + front-office war room + next-gen learning brand.**

## Stack

| Layer             | Tool                                                  |
| ----------------- | ----------------------------------------------------- |
| Framework         | Next.js 15 (App Router) + TypeScript                  |
| Styling           | Tailwind CSS + custom brand system + Framer Motion    |
| UI primitives     | shadcn-style components over Radix UI + lucide icons  |
| Auth + DB         | Supabase (Postgres + Auth + Storage + Realtime)       |
| ORM               | Drizzle                                               |
| Validation        | Zod                                                   |
| Data fetching     | TanStack Query (client) · server actions (mutations)  |
| Hosting           | Vercel                                                |

## Features

- Marketing landing page (parents + public)
- Sign in / sign up (Supabase — magic link + Google)
- Student dashboard — XP, level, streak, BFC wallet, on-deck lesson, quests
- Tracks 101 / 201 / 301 with modules + lessons
- **Lesson page** — slide deck + Spotify podcast + iframe activity + claim submit
- Auto-claim via `postMessage` from activity iframes (`bsc-shim.js`)
- XP engine: ledger + level titles + confetti level-up modal
- Credentials (Scout → Director ladders) with public `/verify/[passId]` page
- Badges + achievements gallery
- Leaderboards (All / 101 / 201 / 301 / Season)
- BFC store with rarity tiers
- Pods (team rooms, pod leaderboard)
- Daily + weekly quests
- Live events + seasons + Gauntlet tiers (Bronze / Silver / Gold)
- Calendar
- Admin dashboard — students roster, content library, scheduled announcements

## Getting started

```bash
# 1. install
pnpm install

# 2. copy env
cp .env.example .env.local

# 3. run in mock mode (no Supabase needed)
#    .env.local already has BSC_USE_MOCK_DATA=1 by default
pnpm dev
```

Open http://localhost:3000 — the app runs with a rich demo dataset so every
page has realistic content.

## Going live (wire up Supabase)

1. Create a free Supabase project at https://supabase.com.
2. Copy these values from **Project Settings**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service role key → `SUPABASE_SERVICE_ROLE_KEY`
   - Database connection string (pooler) → `DATABASE_URL`
3. Flip `BSC_USE_MOCK_DATA=0` in `.env.local`.
4. Push the schema:
   ```bash
   pnpm db:push
   ```
5. (Optional) seed the content catalog:
   ```bash
   pnpm seed
   ```

Enable auth providers (Google, magic link) in **Authentication → Providers**
in the Supabase dashboard.

## The activity shim

Any Bow Sports Capital GitHub Pages activity that wants to auto-submit claim
codes just needs one line:

```html
<script src="https://bowsportscapital.com/shim/bsc-shim.js"></script>
```

Then, when the activity ends and generates a claim code:

```js
BSC.claim("T201-M1-L2-GMN", { score: 125, tier: "GOLD" });
```

The parent unified app picks up the `postMessage`, auto-submits to
`/api/claim`, and fires the XP animation + level-up modal. Students never
have to copy-paste a code again.

Source: `scripts/bsc-shim.js` — also published at `/shim/bsc-shim.js`.

## Scripts

| Command              | What it does                                        |
| -------------------- | --------------------------------------------------- |
| `pnpm dev`           | Run dev server                                      |
| `pnpm build`         | Production build                                    |
| `pnpm start`         | Start production server                             |
| `pnpm lint`          | Lint                                                |
| `pnpm typecheck`     | Strict TypeScript check                             |
| `pnpm db:generate`   | Generate SQL migrations from schema                 |
| `pnpm db:push`       | Push schema directly to DB (dev)                    |
| `pnpm db:studio`     | Open Drizzle Studio                                 |
| `pnpm seed`          | Seed tracks, lessons, badges                        |

## Project structure

```
app/
  (public)/              marketing, verify
  (auth)/                sign-in, sign-up
  (app)/                 authenticated student portal
    dashboard, tracks, lesson, leaderboard,
    credentials, store, pods, quests, events,
    gauntlet, calendar, settings
  (admin)/admin/         coach dashboard
  api/claim/             POST claim code endpoint
components/
  brand/                 Logo, GradientOrbs
  ui/                    shadcn primitives
  app/                   AppNav
  xp/                    XPBar, LevelUpModal, streak, BFC
  lesson/                SlideDeck, SpotifyPlayer, ActivityFrame, ClaimSubmit
  passes/                PassCard
lib/
  data/                  mock dataset + unified data API
  db/                    Drizzle schema + pg client
  supabase/              SSR + browser clients + middleware
  xp.ts                  level ladder, tier rules, pass logic
scripts/
  bsc-shim.js            drop-in for activity repos
```

## Roadmap

- Interactive MDX lesson format (replace PDF slides lesson by lesson)
- Rich pod chat + live co-op events
- Mobile app (React Native + Expo) reusing the same API
- AI coaching overlay on the Gauntlet

---

Built with love by Bow Sports Capital. Welcome to the front office.
