-- ============================================
-- Embroidera Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- Workshops table
-- ============================================
create table workshops (
  id uuid default uuid_generate_v4() primary key,
  title_en text not null,
  title_nl text not null,
  title_tr text not null,
  description_en text,
  description_nl text,
  description_tr text,
  date timestamptz,
  location text,
  capacity integer default 0,
  price numeric(10, 2) default 0,
  currency text default 'EUR',
  image_url text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- Products table
-- ============================================
create table products (
  id uuid default uuid_generate_v4() primary key,
  title_en text not null,
  title_nl text not null,
  title_tr text not null,
  description_en text,
  description_nl text,
  description_tr text,
  category text,
  images jsonb default '[]'::jsonb,
  featured boolean default false,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- Contact messages table
-- ============================================
create table contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- Site settings (key-value store)
-- ============================================
create table site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb,
  updated_at timestamptz default now()
);

-- ============================================
-- Updated_at trigger function
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger workshops_updated_at
  before update on workshops
  for each row execute function update_updated_at();

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS
alter table workshops enable row level security;
alter table products enable row level security;
alter table contact_messages enable row level security;
alter table site_settings enable row level security;

-- Public read access for published content
create policy "Public can view published workshops"
  on workshops for select
  using (status = 'published');

create policy "Public can view published products"
  on products for select
  using (status = 'published');

create policy "Public can view site settings"
  on site_settings for select
  using (true);

-- Authenticated users (admin) full access
create policy "Admin full access to workshops"
  on workshops for all
  using (auth.role() = 'authenticated');

create policy "Admin full access to products"
  on products for all
  using (auth.role() = 'authenticated');

create policy "Admin full access to contact messages"
  on contact_messages for all
  using (auth.role() = 'authenticated');

create policy "Admin full access to site settings"
  on site_settings for all
  using (auth.role() = 'authenticated');

-- Anyone can insert contact messages
create policy "Anyone can send contact messages"
  on contact_messages for insert
  with check (true);

-- ============================================
-- Storage bucket for images
-- ============================================
-- Run these in the Supabase Dashboard > Storage:
-- 1. Create a bucket called "media" with public access
-- 2. Set max file size to 5MB
-- 3. Allow image/* mime types

-- ============================================
-- Seed initial settings
-- ============================================
insert into site_settings (key, value) values
  ('contact_email', '"hello@embroidera.com"'),
  ('social_instagram', '"https://instagram.com/embroidera"'),
  ('social_pinterest', '"https://pinterest.com/embroidera"')
on conflict (key) do nothing;
