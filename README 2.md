# Shivam Computer (React + TypeScript demo)

This repo is a Vite + React + TypeScript rewrite of the automated storefront and admin experience. The UI is composed of reusable components so the hero, featured grid, automation highlights, and auth screens can be maintained easily.

## Running the demo

1. Install dependencies with `npm install`.
2. Start the dev server with `npm run dev` and open `http://localhost:5173/`.
3. Browse the landing page, click “Login” in the header, or visit `/login` and enter one of the sample credentials:
   - Username: `admin`, Password: `shivam2026`
   - Username: `support`, Password: `support@123`
4. After authentication you are redirected to `/admin`, where mock orders, automation logs, and stats read from `localStorage`.

## Supabase (optional database)

Products can be stored in **Supabase** (free PostgreSQL) for persistence across devices and browsers.

### Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, go to **SQL Editor** and run the contents of `supabase/schema.sql`.
3. Copy `.env.example` to `.env` and add your project URL and anon key.
4. Restart the dev server. Products will load from Supabase; if the table is empty, the default catalog is seeded automatically.

Without Supabase, products use **localStorage** and persist only in the current browser.

## Architecture notes

- The `src/data/` folder contains the mocked `products` catalog and `users` fixtures typed via `src/types/index.ts`.
- Automation state lives in `src/hooks/useMockAutomation.ts`, which persists mock orders (`summitMockOrders`), automation logs (`summitAutomationLog`), and run counters (`summitAutomationRuns`) in `localStorage`.
- Headline rotation is handled by `src/hooks/useHeadlineRotation.ts`, emitting a new restock message every seven seconds.
- Routing is provided by `react-router-dom` with `_Storefront`, `LoginPage`, and `AdminPage` under `/`, `/login`, and `/admin`.
- Styles are centralized in `src/styles/global.css`, matching the responsive layout from the original static mockup.

## Build

- `npm run build` compiles the TypeScript code and bundles assets for production.
- `npm run preview` runs the production build locally so you can inspect the final output.
