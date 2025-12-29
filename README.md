# PastePin Lite

A minimal Pastebin-like application built with Next.js (App Router) and Prisma. Users can create text pastes, optionally configure a time-to-live (TTL) and/or maximum view count, and share a URL for others to view the paste. Pastes are automatically deleted when they expire or reach their view limit.

## Project Description

PastePin Lite is a full-stack web application that allows users to:
- Create text pastes with optional expiration times (TTL in seconds)
- Set maximum view limits for pastes
- Share pastes via unique URLs
- View pastes with real-time expiration and view count information

The application features a clean, modern UI built with React, TypeScript, and Tailwind CSS, with comprehensive error handling for expired or deleted pastes.

## Running the Project Locally

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (running locally or remotely)
- npm or yarn package manager

### Setup Instructions

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure the database connection**

   Create a `.env` file in the `frontend` folder and add your PostgreSQL connection string:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/pastepin?schema=public"
   ```

   Replace `user`, `password`, `localhost`, `5432`, and `pastepin` with your actual PostgreSQL credentials and database name.

3. **Run database migrations**

   ```bash
   cd frontend
   npx prisma migrate dev
   ```

   This will create the necessary database tables and apply all migrations.

4. **Start the development server**

   ```bash
   cd frontend
   npm run dev
   ```

5. **Open the application**

   Navigate to `http://localhost:3000` in your browser to start using the application.

### Additional Commands

- **Build for production**: `npm run build`
- **Start production server**: `npm run start`
- **Run linting**: `npm run lint`

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

### Important design decisions

- **Single Next.js app for frontend and backend**:  
  The `frontend` project is a fullstack Next.js application. API routes under `src/app/api` implement the backend endpoints (`/api/healthz`, `/api/pastes`, `/api/pastes/[id]`), and the UI pages under `src/app` implement the paste creation form and paste viewing page.

- **TTL and view-limit enforcement**:  
  Each paste stores optional `ttlSeconds`, `maxViews`, and `remainingViews`. Every successful fetch (API or HTML) decrements `remainingViews` when a view limit is set. A paste becomes unavailable (HTTP 404) as soon as either its TTL has expired or its view limit is exhausted.

- **Deterministic time for tests**:  
  When `TEST_MODE=1` is set in the environment, the backend treats the `x-test-now-ms` request header as the current time for expiry checks. If the header is missing or invalid, real system time is used.


