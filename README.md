# BigTechJournals — Full Stack Platform

A production-ready storytelling platform for Big Tech careers. Built with Next.js 16, React 19, PostgreSQL, Prisma, Clerk, Supabase Storage, and Resend.

## Quick Start

### 1. Install dependencies

```bash
cd client
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your credentials.

Required services:
- **PostgreSQL** — Neon, Supabase, or Vercel Postgres
- **Clerk** — Authentication
- **Supabase** — Storage buckets: `covers`, `avatars`, `resumes`
- **Resend** — Transactional email

### 3. Set up database

```bash
npm run db:push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

## Admin Access

Set your email in `ADMIN_EMAIL` env var. On first sign-in, you'll be promoted to ADMIN role.
