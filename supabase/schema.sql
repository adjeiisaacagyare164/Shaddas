create extension if not exists pgcrypto;

create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid null references auth.users(id) on delete set null,
  name text not null default 'Shaddas',
  logo text default '',
  description text default 'Discover premium quality products with direct WhatsApp ordering.',
  whatsapp_number text not null default '+233 53 558 9099',
  phone text not null default '+233 53 558 9099',
  email text not null default 'contact@shadas.com',
  location text not null default 'Accra, Ghana',
  instagram text default '@shadas_official',
  facebook text default 'shadas.store',
  currency text default 'GH₵',
  currency_code text default 'GHS',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  image text default '',
  description text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text default '',
  price numeric(12,2) not null default 0,
  images jsonb not null default '[]'::jsonb,
  availability boolean not null default true,
  status text not null default 'published' check (status in ('published', 'draft', 'hidden')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists homepage_content (
  id uuid primary key default gen_random_uuid(),
  hero_badge text default 'New Arrivals & Trending',
  hero_title text default 'Discover Authentic Quality & Modern Elegance',
  hero_description text default 'Explore our curated collections of premium fashion, accessories, and essentials. Order directly with the shop owner via WhatsApp.',
  hero_image text default '',
  hero_button_text text default 'Shop Now',
  about_title text default 'About Shaddas',
  about_description text default 'Welcome to Shaddas. We are dedicated to bringing you top-tier quality products and a seamless, personalized shopping journey.',
  about_image text default '',
  about_points jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'shops_owner_id_fkey'
      and conrelid = 'public.shops'::regclass
  ) then
    alter table public.shops
      add constraint shops_owner_id_fkey foreign key (owner_id)
      references auth.users(id) on delete set null;
  end if;
end;
$$;

alter table categories alter column slug set default '';
alter table products alter column slug set default '';

create or replace function set_slug_from_name()
returns trigger as $$
declare
  slug_base text;
begin
  if new.slug is null or btrim(new.slug) = '' then
    slug_base := trim(both '-' from regexp_replace(lower(new.name), '[^a-z0-9]+', '-', 'g'));
    new.slug := coalesce(nullif(slug_base, ''), 'item') || '-' || left(new.id::text, 8);
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists categories_set_slug on categories;
create trigger categories_set_slug
before insert or update of name on categories
for each row execute function set_slug_from_name();

drop trigger if exists products_set_slug on products;
create trigger products_set_slug
before insert or update of name on products
for each row execute function set_slug_from_name();

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists shops_updated_at on shops;
create trigger shops_updated_at
before update on shops
for each row execute function update_updated_at_column();

drop trigger if exists categories_updated_at on categories;
create trigger categories_updated_at
before update on categories
for each row execute function update_updated_at_column();

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
before update on products
for each row execute function update_updated_at_column();

drop trigger if exists homepage_content_updated_at on homepage_content;
create trigger homepage_content_updated_at
before update on homepage_content
for each row execute function update_updated_at_column();

create or replace function is_shaddas_owner()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.shops where owner_id = (select auth.uid())
  );
$$;

revoke all on function is_shaddas_owner() from public;
grant execute on function is_shaddas_owner() to anon, authenticated;

alter table shops enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table homepage_content enable row level security;

grant select on shops, categories, products, homepage_content to anon, authenticated;
grant update on shops to authenticated;
grant insert, update, delete on categories, products, homepage_content to authenticated;

drop policy if exists "Public can read shop information" on shops;
create policy "Public can read shop information" on shops
for select to anon, authenticated using (true);
drop policy if exists "Owner can update shop information" on shops;
create policy "Owner can update shop information" on shops
for update to authenticated
using (is_shaddas_owner())
with check (is_shaddas_owner() and owner_id = (select auth.uid()));

drop policy if exists "Public can read categories" on categories;
create policy "Public can read categories" on categories
for select to anon, authenticated using (true);
drop policy if exists "Owner can manage categories" on categories;
create policy "Owner can manage categories" on categories
for all to authenticated using (is_shaddas_owner()) with check (is_shaddas_owner());

drop policy if exists "Public can read published products" on products;
create policy "Public can read published products" on products
for select to anon, authenticated using (status = 'published');
drop policy if exists "Owner can manage products" on products;
create policy "Owner can manage products" on products
for all to authenticated using (is_shaddas_owner()) with check (is_shaddas_owner());

drop policy if exists "Public can read homepage content" on homepage_content;
create policy "Public can read homepage content" on homepage_content
for select to anon, authenticated using (true);
drop policy if exists "Owner can manage homepage content" on homepage_content;
create policy "Owner can manage homepage content" on homepage_content
for all to authenticated using (is_shaddas_owner()) with check (is_shaddas_owner());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'shaddas-media',
  'shaddas-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view Shaddas media" on storage.objects;
create policy "Public can view Shaddas media" on storage.objects
for select to anon, authenticated using (bucket_id = 'shaddas-media');
drop policy if exists "Owner can upload Shaddas media" on storage.objects;
create policy "Owner can upload Shaddas media" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'shaddas-media'
  and is_shaddas_owner()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "Owner can update Shaddas media" on storage.objects;
create policy "Owner can update Shaddas media" on storage.objects
for update to authenticated
using (
  bucket_id = 'shaddas-media'
  and is_shaddas_owner()
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'shaddas-media'
  and is_shaddas_owner()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "Owner can delete Shaddas media" on storage.objects;
create policy "Owner can delete Shaddas media" on storage.objects
for delete to authenticated
using (
  bucket_id = 'shaddas-media'
  and is_shaddas_owner()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

insert into shops (name, description, whatsapp_number, phone, email, location, instagram, facebook, currency, currency_code)
select 'Shaddas', 'Discover luxury and everyday essentials curated for Ghana. Place orders directly via WhatsApp.', '+233 53 558 9099', '+233 53 558 9099', 'contact@shadas.com', 'East Legon, Accra - Ghana', '@shadas_official', 'shadas.store', 'GH₵', 'GHS'
where not exists (select 1 from shops);

insert into homepage_content (
  hero_badge,
  hero_title,
  hero_description,
  hero_image,
  hero_button_text,
  about_title,
  about_description,
  about_image,
  about_points
)
select
  'New Season Collection 2026',
  'Luxury & Everyday Essentials Curated for Ghana',
  'Experience effortless direct shopping. Browse our curated fashion, luxury bags, and footwear — send your order straight to our WhatsApp in one click.',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  'Shop New Arrivals',
  'Welcome to Shaddas',
  'At Shaddas, we believe shopping should be personal, transparent, and seamless. We hand-select premium items and bring them to your doorstep across Accra and throughout Ghana.',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
  '["Direct WhatsApp ordering with the shop owner","Fast and reliable dispatch across all regions of Ghana","100% verified quality and authentic craftsmanship","Flexible customer care and tailored recommendations"]'::jsonb
where not exists (select 1 from homepage_content);
