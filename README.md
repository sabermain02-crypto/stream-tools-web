# Stream Tools Web

Website Stream Tools berbasis Next.js + Supabase, siap untuk deploy ke Netlify.

## Tampilan baru
- UI dark futuristic profesional dengan glassmorphism.
- Logo Stream Tools menggunakan image asset di `public/images/logo.png`.
- Icon/logo mark menggunakan `public/images/logo-mark.png`.
- Background visual menggunakan image asset `public/images/background.png`.
- Hero memakai `public/images/hero-scene.jpg`.
- Responsive untuk desktop dan mobile.
- Dashboard dan Admin memakai layout sidebar modern.

## Supabase
Environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL` (opsional)

## Admin owner
Akun owner yang digunakan:
`firlykarya@gmail.com`

Role admin tetap ditentukan di database Supabase. Jalankan SQL berikut jika perlu:

```sql
UPDATE public.profiles
SET role = 'admin', updated_at = now()
WHERE lower(email) = lower('firlykarya@gmail.com');
```

Setelah itu logout/login kembali.

## Deploy
Push/upload project ini ke repository/deployment Netlify seperti project sebelumnya. Asset image berada di `public/images` dan otomatis tersedia sebagai `/images/...`.
