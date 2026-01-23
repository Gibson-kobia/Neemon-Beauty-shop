-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  brand text default 'Neemon',
  description text,
  price numeric not null,
  category text not null,
  image_url text,
  stock integer default 0,
  rating numeric default 0,
  reviews_count integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  customer_name text,
  customer_phone text,
  customer_email text,
  items jsonb not null,
  total numeric not null,
  delivery_method text,
  status text default 'NEW', -- NEW, PREPARING, WITH_RIDER, DELIVERED, CANCELLED
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_status_logs table
create table public.order_status_logs (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders not null,
  old_status text,
  new_status text,
  changed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_status_logs enable row level security;

-- Policies for products
-- Allow read access to everyone for active products (public shop)
create policy "Public products are viewable by everyone"
  on public.products for select
  using ( is_active = true );

-- Allow full access to authenticated users (admins) for now
create policy "Admins can manage all products"
  on public.products for all
  using ( auth.role() = 'authenticated' );

-- Policies for orders
-- Users can see their own orders
create policy "Users can view their own orders"
  on public.orders for select
  using ( auth.uid() = user_id );

-- Admins can see all orders
create policy "Admins can view all orders"
  on public.orders for select
  using ( auth.role() = 'authenticated' );

-- Admins can update orders
create policy "Admins can update orders"
  on public.orders for update
  using ( auth.role() = 'authenticated' );
