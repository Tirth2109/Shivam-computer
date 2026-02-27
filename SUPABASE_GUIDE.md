# Supabase – Complete Guide for Shivam Computer

This guide walks you through using Supabase as a free database for your Shivam Computer e-commerce site.

---

## 1. What is Supabase?

**Supabase** is a free, open-source alternative to Firebase. It gives you:

- **PostgreSQL database** – Store products, orders, users, etc.
- **REST API** – Automatically generated from your tables
- **Real-time subscriptions** – Optional live updates
- **Authentication** – Optional user login (you can add this later)
- **Storage** – Optional file uploads (e.g. product images)

**Free tier includes:**
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- No credit card required

---

## 2. Create a Supabase Account

1. Go to **[supabase.com](https://supabase.com)**
2. Click **"Start your project"**
3. Sign up with:
   - **GitHub** (easiest), or
   - **Google**, or
   - **Email + password**
4. Verify your email if prompted.

---

## 3. Create a New Project

1. After login, click **"New Project"**
2. Choose your **Organization** (your personal org is fine)
3. Fill in:
   - **Project name:** `shivam-computer` (or any name)
   - **Database password:** Choose a strong password and **save it somewhere safe** (you’ll need it for direct DB access)
   - **Region:** Pick the one closest to you (e.g. `Mumbai` or `Singapore` for India)
4. Click **"Create new project"**
5. Wait 1–2 minutes for the project to be created.

---

## 4. Get Your API Keys

1. In the left sidebar, click **"Project Settings"** (gear icon at the bottom)
2. Click **"API"** in the left menu
3. You’ll see:
   - **Project URL** – e.g. `https://abcdefgh.supabase.co`
   - **Project API keys:**
     - **anon (public)** – Safe to use in the browser
     - **service_role** – Keep secret, never use in frontend

4. Copy:
   - **Project URL**
   - **anon public** key (the long string under "Project API keys")

You’ll put these in your `.env` file next.

---

## 5. Create the Products Table

1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"**
3. Copy the entire contents of the file `supabase/schema.sql` from your project
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see: **"Success. No rows returned"** – that means the table was created

---

## 6. Connect Your Shivam Computer Project

1. In your project folder, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in an editor
3. Add your Supabase values:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   Replace with your real **Project URL** and **anon public** key.
4. Save the file
5. Restart your dev server:
   ```bash
   npm run dev
   ```

Your app will now load products from Supabase. If the table is empty, the default product catalog will be seeded automatically.

---

## 7. View and Edit Data in Supabase

### Table Editor

1. Click **"Table Editor"** in the left sidebar
2. Select the **"products"** table
3. You can:
   - **View rows** – All products in a table
   - **Add row** – Add a product manually
   - **Edit** – Click a cell to edit
   - **Delete** – Select a row and click Delete

### SQL Editor

1. Click **"SQL Editor"**
2. Example queries:

   ```sql
   -- See all products
   SELECT * FROM products;

   -- Count products
   SELECT COUNT(*) FROM products;

   -- Products under ₹10,000
   SELECT name, price FROM products WHERE price < 10000;
   ```

---

## 8. How It Works in Your Project

| Action                    | Without Supabase   | With Supabase                  |
|---------------------------|--------------------|---------------------------------|
| **Where data is stored**  | Browser localStorage | Supabase (cloud PostgreSQL)    |
| **Add product in Admin**  | Saved in browser   | Saved in Supabase               |
| **Open site in another browser** | Old data gone      | Same products everywhere        |
| **Reset browser data**    | Products reset     | Products still in Supabase      |

- If `.env` is **not** set: app uses **localStorage**
- If `.env` **is** set: app uses **Supabase**

---

## 9. Security and RLS (Row Level Security)

The schema includes **Row Level Security (RLS)** policies that allow:

- **Read (SELECT):** Anyone can view products
- **Write (INSERT/UPDATE/DELETE):** Currently allowed for demo

For production, you should restrict writes to logged-in admin users (using Supabase Auth).

---

## 10. Common Questions

### Where is my data stored?

In Supabase’s hosted PostgreSQL database. Data lives in the cloud and persists until you delete the project or data.

### Is it really free?

Yes, for the free tier. See [Supabase Pricing](https://supabase.com/pricing) for limits.

### Can I backup my data?

Yes. In Project Settings → Database, you can use database backups (availability depends on your plan).

### What if I forget my database password?

You can reset it in Project Settings → Database.

### How do I delete my project?

Project Settings → General → Delete project (this cannot be undone).

---

## 11. Troubleshooting

| Problem                     | Solution                                                      |
|----------------------------|----------------------------------------------------------------|
| "Failed to load products"  | Check `.env` values and that the products table exists       |
| "relation 'products' does not exist" | Run `supabase/schema.sql` in SQL Editor                |
| Changes not appearing      | Refresh the page; check browser console for errors           |
| CORS errors                | Usually means wrong Project URL or key                       |

---

## 12. Next Steps (Optional)

- **Supabase Auth** – Replace localStorage admin login with Supabase Auth
- **Storage** – Upload product images to Supabase Storage instead of URLs
- **Real-time** – Use Supabase Realtime to sync product updates across tabs/devices

---

**Need more help?** [Supabase Documentation](https://supabase.com/docs)
