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

## Configure and deploy Angular

Set the project URL and anon/publishable key in `frontend/public/runtime-config.js`:

```js
window.__SHADDAS_CONFIG__ = {
  supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

The config file is loaded before Angular starts. Use the same values for local development and your deployment, or inject the file through your static host's deployment process. Do not commit service-role credentials.

From `frontend`, install and build with:

```sh
npm ci
npm run build
```

The production output is `frontend/dist/frontend/browser`. Configure the static host to serve `index.html` for application routes. `frontend/vercel.json` includes the Vercel SPA rewrite.

## Storage and product images

The schema provisions a public `shaddas-media` bucket for JPEG, PNG, WebP, and AVIF images up to 10 MB. Public users can read images. Authenticated uploads, updates, and deletes are restricted by RLS to the configured owner and their UUID-prefixed folder. Product management supports both Storage uploads and manually pasted external image URLs.

## WhatsApp ordering MVP

Checkout remains a browser-to-WhatsApp handoff: customers enter contact and delivery details, review the cart, and open a prefilled `wa.me` message to the shop's configured WhatsApp number. There is no online payment, order API, or requirement to save customer/order data in Supabase. Keep this flow client-side. Add an Edge Function only if a future integration needs a private WhatsApp Business API credential or other server-side secret; never expose such credentials in the Angular app.

## Existing Django data

Running the schema creates a fresh Supabase database; it does not automatically copy rows from `backend/db.sqlite3`. Export/import existing categories, products, shop settings, and homepage content before switching a live storefront. Keep original product image URLs during import or upload the files to `shaddas-media` and replace them with public URLs.
