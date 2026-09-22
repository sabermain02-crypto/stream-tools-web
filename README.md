# Stream Tools Web

Website starter for Stream Tools using Next.js + Vercel + Supabase.

## Includes

- Email/password Register + Login
- Cookie-based Supabase SSR auth
- User profile + FREE/PREMIUM plan
- Premium activation codes
- Secure database RLS
- Mobile API endpoint: `GET /api/mobile/me`
- APK download page
- Dark neon Stream Tools UI

## 1. Create Supabase project

Create a Supabase project, then open **SQL Editor** and run `supabase/schema.sql`.

Supabase's current Next.js guidance uses `@supabase/ssr` for cookie-based SSR sessions. See the official docs linked below.

## 2. Environment variables

Copy `.env.example` to `.env.local` locally, or add the same variables in Vercel Project Settings > Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL`

`SUPABASE_SERVICE_ROLE_KEY` is not required by the basic site. Keep it server-only if you later add an admin code generator.

## 3. Supabase Auth settings

For email/password auth, configure the Site URL and Redirect URLs for your Vercel deployment, e.g. `https://YOUR-PROJECT.vercel.app/**` as appropriate for your Auth settings.

If email confirmation is enabled, users must confirm their email before logging in.

## 4. Create a premium code

In Supabase SQL Editor:

```sql
insert into public.premium_codes(code,duration_days,max_uses)
values ('ST-PREMIUM-30-ABC123', 30, 1);
```

Then a logged-in user can redeem it at `/premium`.

## 5. Run locally

```bash
npm install
npm run dev
```

## 6. Deploy to Vercel

Push this folder to GitHub, import the repository into Vercel, add the environment variables, and deploy.

The Android app can authenticate with the same Supabase project. It can also call `/api/mobile/me` with a Supabase access token to retrieve the user's profile and effective premium status.
