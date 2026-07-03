# Campus Hub

A community website for your college group: an admin-curated announcement board
(with photos and linked documents) plus an open discussion forum. Built to run
entirely on free tiers.

**Stack:** Next.js (React + TypeScript) · Supabase (auth, database, file storage) · Tailwind CSS
**Hosting:** Vercel (frontend) + Supabase (backend) — $0/month at community scale.

---

## 1. Prerequisites

- [Node.js 18+](https://nodejs.org) installed
- A free [Supabase](https://supabase.com) account
- A free [Vercel](https://vercel.com) account (for deployment later)
- VS Code (you've got this covered)

---

## 2. Set up Supabase (your backend)

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick any name/region, set a database password (save it somewhere).
2. Once the project is ready, go to **SQL Editor → New query**, paste in the entire contents of `supabase/schema.sql` from this repo, and click **Run**.
   - This creates the `profiles`, `posts`, `threads`, and `replies` tables, sets up row-level security so guests can read but only admins can post announcements, and creates two storage buckets (`photos`, `documents`).
3. Go to **Project Settings → API**. You'll need two values in the next step:
   - **Project URL**
   - **anon public** key

### Turn on email sign-in

Go to **Authentication → Providers → Email** and make sure it's enabled (it is by default). That's it — no password needed, we use magic links (a one-click email link).

> Optional, recommended: Under **Authentication → URL Configuration**, once you know your real domain (e.g. `https://your-site.vercel.app`), add it to **Site URL** and **Redirect URLs** so login links work in production.

---

## 3. Run it locally in VS Code

1. Open the `campus-hub` folder in VS Code.
2. Open a terminal (`` Ctrl+` ``) and install dependencies:
   ```bash
   npm install
   ```
3. Copy the env file and fill it in with your Supabase values from step 2:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).

---

## 4. Make yourself an admin

1. On the running site, click **Sign in**, enter your email, and check your inbox for the magic link.
2. Back in Supabase, go to **SQL Editor** and run (swap in your email):
   ```sql
   update profiles set is_admin = true
   where id = (select id from auth.users where email = 'you@college.edu');
   ```
3. Refresh the site — you'll now see a **Post** button in the nav bar, which takes you to `/admin` to pin announcements, photos, and documents.

Repeat this for any other trusted admins/maintainers.

---

## 5. How the site works

| Page | Who can view | Who can post |
|---|---|---|
| `/` — The Board | Everyone, no login needed | Admins only (announcements, photos, linked docs) |
| `/discussion` | Everyone, no login needed | Anyone signed in (start threads, reply) |
| `/login` | — | Magic-link email sign-in, no password |
| `/admin` | Admins only | — |

- **Photos** are uploaded to the `photos` storage bucket and shown as polaroid-style images on announcement cards.
- **Documents** (PDFs, slides, spreadsheets — any file type) are uploaded to the `documents` bucket and linked as a small tag on the card.
- Both buckets are public-read, so anyone with the link can view/download — good for spreading info widely, just don't upload anything sensitive.

---

## 6. Deploy for free (so people can actually visit it)

1. Push this project to a GitHub repo (VS Code has built-in Git support — Source Control panel → Publish to GitHub).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo.
3. In the **Environment Variables** section, add the same two values from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. In a couple minutes you'll get a live URL like `https://campus-hub-yourname.vercel.app`.
5. Go back to Supabase → **Authentication → URL Configuration** and add that Vercel URL as your **Site URL**, so magic-link emails redirect correctly in production.

You can later attach a custom domain for free too, in Vercel's project settings.

---

## 7. Ideas for growing it later

- Add reactions/likes on posts
- Weekly digest email of new posts (Supabase Edge Functions + Resend, both free tier)
- Tags/categories for discussion threads
- A simple events calendar page
- Direct messages between members

If you want help with any of these down the line, just ask — the codebase is small and organized by feature (`app/`, `components/`, `lib/`, `supabase/`), so it's easy to extend.
