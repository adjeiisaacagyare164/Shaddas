# Shaddas Supabase setup

Supabase provides the PostgreSQL database, owner authentication, Storage, and REST APIs. The Angular 17 site remains a static frontend and should be deployed to a static host such as Vercel, Netlify, or Cloudflare Pages. Django is not part of the production request path.

## Create the Supabase project

1. Create a Supabase project and open its SQL Editor.
2. Run `supabase/schema.sql`. It creates the Shaddas tables, starter shop/homepage rows, RLS policies, and the public `shaddas-media` bucket.
3. In Authentication settings, enable Email/password sign-in, disable public sign-ups, set the site URL, and add the owner portal redirect URLs (for example `http://localhost:4200/owner/login` and `https://YOUR_SITE/owner/login`).
4. In Authentication > Users, create the shop owner's user. Do not add a public sign-up flow to the storefront.
5. Copy the new user's UUID and bind that account to the seeded shop row in the SQL Editor:

```sql
update public.shops
set owner_id = 'OWNER_AUTH_USER_UUID'
where id = (select id from public.shops order by created_at limit 1);
```

The owner portal verifies this UUID against the shop record. RLS then restricts management writes to that authenticated owner. The anon key is intentionally public; never put a service-role key in Angular or `runtime-config.js`.

## Configure and deploy Angular on Vercel

Create a Vercel project for the repository and set its **Root Directory** to `frontend`. The checked-in `frontend/vercel.json` selects the hosting build command, Angular output directory, and SPA route rewrite.

Add these Project Environment Variables in Vercel for **Production**, **Preview**, and **Development** as needed:

- `SUPABASE_URL`: the project URL, for example `https://YOUR_PROJECT_REF.supabase.co`
- `SUPABASE_ANON_KEY`: the project's anon key, or use `SUPABASE_PUBLISHABLE_KEY` with the publishable key instead

The build generates `public/runtime-config.js` from those variables before Angular bundles the app. The generated config contains only the public project URL and browser key. Never set a Supabase service-role or secret key in a frontend build environment.

For a local production-style deployment build, set the same variables in the shell and run:

```sh
npm ci
npm run build:hosting
```

The normal `npm run build` does not generate or overwrite runtime config and remains suitable for local development. The deployable artifact is `dist/frontend/browser` when Vercel's project root is `frontend`.

Set the Supabase Auth **Site URL** to the production domain and add the owner portal URL (`https://YOUR_SITE/owner/login`) to the redirect allow list. Add the corresponding preview domain or local URL only when needed. Keep public sign-ups disabled.

## Storage and product images

The schema provisions a public `shaddas-media` bucket for JPEG, PNG, WebP, and AVIF images up to 10 MB. Public users can read images. Authenticated uploads, updates, and deletes are restricted by RLS to the configured owner and their UUID-prefixed folder. Product management supports both Storage uploads and manually pasted external image URLs.

## WhatsApp ordering MVP

Checkout remains a browser-to-WhatsApp handoff: customers enter contact and delivery details, review the cart, and open a prefilled `wa.me` message to the shop's configured WhatsApp number. There is no online payment, order API, or requirement to save customer/order data in Supabase. Keep this flow client-side. Add an Edge Function only if a future integration needs a private WhatsApp Business API credential or other server-side secret; never expose such credentials in the Angular app.

## Existing Django data

Running the schema creates a fresh Supabase database; it does not automatically copy rows from `backend/db.sqlite3`. Export/import existing categories, products, shop settings, and homepage content before switching a live storefront. Keep original product image URLs during import or upload the files to `shaddas-media` and replace them with public URLs.
