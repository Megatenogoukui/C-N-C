# C "N" C

Premium cake commerce scaffold for `C "N" C (Cakes "N" Chocolates)`, now split the right way:

- `Next.js` for the customer-facing frontend
- `Go` kept in-repo as backend groundwork for future APIs and services
- `PostgreSQL` as the primary database target

## Included

- Luxury homepage aligned to the editorial bakery aesthetic
- Shop, product detail, custom cakes, cart, checkout, order tracking, account, about, FAQ, blog, and admin preview pages
- Seeded catalog and cookie-backed cart flow in the Next app
- SEO-friendly App Router page structure with route-level metadata
- Existing Go application skeleton preserved for future backend evolution

## Frontend Run

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Then open `http://localhost:3000`.

## Frontend Verify

```bash
npm run build
```

## Go Verify

```bash
GOCACHE=/tmp/gocache go test ./...
```

## Current Architecture

- `app/`: Next.js routes and page composition
- `components/`: shared UI building blocks
- `lib/`: auth, Prisma data access, seeded storefront helpers, and admin actions
- `internal/` and `cmd/`: Go backend groundwork
- `prisma/`: PostgreSQL schema and seed script

## Database

The project is now configured for PostgreSQL, not SQLite.

Example local URL:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cnc_store"
```

For production, use a managed Postgres provider such as Neon, Supabase, Render Postgres, or RDS.

## Remaining Live Integrations

- Go API contract and real data fetches from Next
- S3/Cloudinary media storage
- Razorpay or other payment gateway
- WhatsApp number and provider/API integration
- Email/SMS notifications
- Real serviceability and slot capacity rules
- Auth and customer account persistence
