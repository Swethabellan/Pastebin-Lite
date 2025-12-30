# PastePin Lite

A minimal Pastebin-like application built with Next.js (App Router) and Prisma. Users can create text pastes, optionally configure a time-to-live (TTL) and/or maximum view count, and share a URL for others to view the paste. Pastes are automatically deleted when they expire or reach their view limit.

## Project Description

PastePin Lite is a full-stack web application that allows users to:
- Create text pastes with optional expiration times (TTL in seconds)
- Set maximum view limits for pastes
- Share pastes via unique URLs
- View pastes with real-time expiration and view count information

The application features a clean, modern UI built with React, TypeScript, and Tailwind CSS, with comprehensive error handling for expired or deleted pastes.

## Tech Stack

- **Next.js** (App Router) - Full-stack React framework
- **TypeScript** - Type-safe development
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (running locally or remotely)
- npm or yarn package manager

## Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Database Connection

Create a `.env` file in the `frontend` folder and add your PostgreSQL connection string:

# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.wkvrozhypxjqkfrilxbk:SwethaBellan@123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.wkvrozhypxjqkfrilxbk:SwethaBellan@123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"



For remote databases (like  Supabase), use the connection string provided by your database service.

### 3. Run Database Migrations

```bash
npx prisma migrate dev
```

This will create the necessary database tables and apply all migrations.

### 4. Start Development Server

```bash
npm run dev
```

### 5. Open the Application

Navigate to [http://localhost:3000](http://localhost:3000) in your browser to start using the application.

The page auto-updates as you edit files in the project.

## Available Scripts

All scripts should be run from the `frontend` directory:

- **`npm run dev`** - Start the development server
- **`npm run build`** - Build for production
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes (backend endpoints)
│   │   ├── p/[id]/       # Dynamic paste viewing page
│   │   └── page.tsx      # Home page (paste creation form)
│   ├── components/       # React components
│   │   └── ui/           # UI components (shadcn/ui)
│   └── lib/              # Utility functions and configurations
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## Persistence Layer

This application uses **Prisma ORM** with a **PostgreSQL** database as its persistence layer.

- **Prisma** provides type-safe database access and schema management
- **PostgreSQL** stores all paste data, including:
  - Paste content
  - Unique identifiers (CUID)
  - Time-to-live (TTL) settings
  - Maximum view limits
  - Remaining view counts
  - Creation timestamps

All data persists across server restarts and requests, ensuring that pastes remain available until they expire or reach their view limit. The database schema is managed through Prisma migrations, which are version-controlled and can be applied to any environment.

## Architecture & Design Decisions

### Single Next.js App for Frontend and Backend

The `frontend` project is a fullstack Next.js application:
- API routes under `src/app/api` implement the backend endpoints:
  - `/api/healthz` - Health check endpoint
  - `/api/pastes` - Create new paste (POST)
  - `/api/pastes/[id]` - Get paste by ID (GET)
- UI pages under `src/app` implement:
  - `/` - Paste creation form
  - `/p/[id]` - Paste viewing page

### TTL and View-Limit Enforcement

Each paste stores optional `ttlSeconds`, `maxViews`, and `remainingViews`. Every successful fetch (API or HTML) decrements `remainingViews` when a view limit is set. A paste becomes unavailable (HTTP 404) as soon as either its TTL has expired or its view limit is exhausted.

### Deterministic Time for Tests

When `TEST_MODE=1` is set in the environment, the backend treats the `x-test-now-ms` request header as the current time for expiry checks. If the header is missing or invalid, real system time is used.

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important for Vercel Deployment:**

1. **Set Environment Variables:**
   - Add your `DATABASE_URL` in Vercel's environment variables settings
   - For Vercel Postgres, the connection string is automatically provided

2. **Database Migrations:**
   - Run migrations during build or use Vercel's post-deploy hooks
   - Alternatively, run `npx prisma migrate deploy` manually after deployment

3. **Build Settings:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


