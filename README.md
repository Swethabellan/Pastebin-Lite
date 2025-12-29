## PastePin Lite

A small Pastebin-like application built with Next.js (App Router) and Prisma.  
Users can create text pastes, optionally configure a time-to-live (TTL) and/or max view count, and share a URL to view the paste.

### How to run locally

1. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure the database URL**

   Create a `.env` file in the `frontend` folder (if it does not already exist) and set your PostgreSQL connection string, for example:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/pastepin?schema=public"
   ```

3. **Run database migrations**

   ```bash
   cd frontend
   npx prisma migrate dev --name init
   ```

4. **Start the development server**

   ```bash
   cd frontend
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.

### Persistence layer

The app uses **Prisma** with a **PostgreSQL** database as the persistence layer.  
All pastes (including their TTL and view-limit metadata) are stored in this database, so they survive across requests and server restarts in local development (as long as your Postgres instance is running).

### Important design decisions

- **Single Next.js app for frontend and backend**:  
  The `frontend` project is a fullstack Next.js application. API routes under `src/app/api` implement the backend endpoints (`/api/healthz`, `/api/pastes`, `/api/pastes/[id]`), and the UI pages under `src/app` implement the paste creation form and paste viewing page.

- **TTL and view-limit enforcement**:  
  Each paste stores optional `ttlSeconds`, `maxViews`, and `remainingViews`. Every successful fetch (API or HTML) decrements `remainingViews` when a view limit is set. A paste becomes unavailable (HTTP 404) as soon as either its TTL has expired or its view limit is exhausted.

- **Deterministic time for tests**:  
  When `TEST_MODE=1` is set in the environment, the backend treats the `x-test-now-ms` request header as the current time for expiry checks. If the header is missing or invalid, real system time is used.


