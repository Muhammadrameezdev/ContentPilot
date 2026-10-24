# ContentPilot

AI-powered Facebook content management SaaS platform. Create, schedule, and automate your entire Facebook strategy with AI-driven content management.

## Features

- **AI Content Assistant** — Generate posts, captions, hashtags powered by GPT-4o
- **Smart Calendar** — Drag-and-drop content calendar with month/week/day views
- **Auto Queue** — Set-and-forget publishing queue with smart retry logic
- **Multi-Page Management** — Manage unlimited Facebook Pages from one dashboard
- **Analytics** — Deep insights into reach, engagement, and posting performance
- **Team Collaboration** — Role-based access (Owner, Admin, Editor, Viewer), approval workflows
- **Stripe Billing** — 3 pricing tiers (Starter $19/mo, Pro $49/mo, Agency $129/mo)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5 (Email + Google OAuth)
- **State:** Zustand + React Query
- **UI:** Tailwind CSS, shadcn/ui, Framer Motion, Recharts
- **AI:** OpenAI GPT-4o
- **Payments:** Stripe
- **Media:** Cloudinary
- **Email:** Resend
- **Queue:** Bull (Redis)

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/muhammadrameez14437-ux/ContentPilot.git
cd ContentPilot
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in your API keys in `.env`. Required:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — [Google Console](https://console.cloud.google.com/)
- `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` — [Meta Developers](https://developers.facebook.com/)
- `OPENAI_API_KEY` — [OpenAI Platform](https://platform.openai.com/)
- `STRIPE_SECRET_KEY` — [Stripe Dashboard](https://dashboard.stripe.com/)

### 3. Setup Database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Demo Accounts

> These demo accounts are for local development only. Change the seeded passwords before any public deployment.

| Email | Password | Role |
|---|---|---|
| admin@contentpilot.com | admin123456 | Admin |
| demo@contentpilot.com | demo123456 | User |

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/muhammadrameez14437-ux/ContentPilot)

1. Connect your GitHub repo
2. Add all environment variables from `.env.example`
3. Set `DATABASE_URL` to your production PostgreSQL (Supabase / Railway / Neon)
4. Deploy!

Cron jobs are configured in `vercel.json` and will run automatically on Vercel.

## Project Structure

```
├── app/
│   ├── (marketing)/     # Landing page
│   ├── (auth)/          # Auth pages (login, signup, etc.)
│   ├── (dashboard)/     # Dashboard pages
│   │   ├── dashboard/   # Home dashboard
│   │   ├── pages/       # Facebook page management
│   │   ├── library/     # Content library
│   │   ├── calendar/    # Content calendar
│   │   ├── queue/       # Publishing queue
│   │   ├── scheduler/   # Post scheduler
│   │   ├── ai/          # AI content assistant
│   │   ├── analytics/   # Analytics & insights
│   │   ├── team/        # Team management
│   │   ├── notifications/ # Notification center
│   │   ├── settings/    # Settings (6 pages)
│   │   └── admin/       # Admin panel
│   └── api/             # API routes
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Sidebar, topbar
│   └── shared/          # Shared components
├── lib/                 # Server utilities
├── store/               # Zustand stores
├── prisma/              # Schema + seed
└── types/               # TypeScript types
```

## License

MIT
