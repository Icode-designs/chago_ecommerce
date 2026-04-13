-- ==========================================
-- CHAGO E-COM SUPABASE SCHEMA & RLS SETUP
-- ==========================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type user_role as enum ('customer', 'vendor', 'admin');
create type product_status as enum ('draft', 'active', 'archived');
create type order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
create type dispute_status as enum ('open', 'in_review', 'resolved', 'closed');

-- 3. TABLES

-- Profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  role user_role default 'customer'::user_role not null,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  parent_id uuid references public.categories(id) on delete set null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  category_id uuid references public.categories(id) on delete set null,
  images text[] default '{}'::text[],
  stock integer default 0 not null,
  status product_status default 'draft'::product_status not null,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.profiles(id) on delete restrict not null,
  status order_status default 'pending'::order_status not null,
  total numeric(10, 2) not null,
  shipping_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  vendor_id uuid references public.profiles(id) on delete restrict not null,
  quantity integer not null,
  price numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wishlist Items
create table public.wishlist_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Reviews
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Disputes
create table public.disputes (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  customer_id uuid references public.profiles(id) on delete restrict not null,
  vendor_id uuid references public.profiles(id) on delete restrict not null,
  reason text not null,
  status dispute_status default 'open'::dispute_status not null,
  resolution text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.reviews enable row level security;
alter table public.disputes enable row level security;

-- 5. RLS POLICIES

-- Profiles
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Categories
create policy "Categories are viewable by everyone" on public.categories
  for select using (true);

create policy "Only Admins can insert/update/delete categories" on public.categories
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Products
create policy "Products are viewable by everyone" on public.products
  for select using (true);

create policy "Vendors can insert their own products" on public.products
  for insert with check (
    auth.uid() = vendor_id 
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and (profiles.role = 'vendor' or profiles.role = 'admin')
    )
  );

create policy "Vendors can update their own products" on public.products
  for update using (
    auth.uid() = vendor_id 
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Vendors can delete their own products" on public.products
  for delete using (
    auth.uid() = vendor_id 
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Orders
create policy "Customers can view their own orders" on public.orders
  for select using (auth.uid() = customer_id);

create policy "Customers can insert their own orders" on public.orders
  for insert with check (auth.uid() = customer_id);

-- Order Items
create policy "Customers can view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.customer_id = auth.uid()
    )
  );

create policy "Vendors can view their sold order items" on public.order_items
  for select using (auth.uid() = vendor_id);

create policy "Customers can insert order items" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.customer_id = auth.uid()
    )
  );

-- Wishlist Items
create policy "Users can view their own wishlist" on public.wishlist_items
  for select using (auth.uid() = user_id);

create policy "Users can add to their wishlist" on public.wishlist_items
  for insert with check (auth.uid() = user_id);

create policy "Users can remove from their wishlist" on public.wishlist_items
  for delete using (auth.uid() = user_id);

-- Reviews
create policy "Reviews are viewable by everyone" on public.reviews
  for select using (true);

create policy "Users can leave a review" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "Users can update their review" on public.reviews
  for update using (auth.uid() = user_id);

create policy "Users can delete their review" on public.reviews
  for delete using (auth.uid() = user_id);

-- Disputes
create policy "Customers and vendors view own disputes" on public.disputes
  for select using (
    auth.uid() = customer_id or 
    auth.uid() = vendor_id or
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Customers can create a dispute" on public.disputes
  for insert with check (auth.uid() = customer_id);

-- 6. FUNCTIONS & TRIGGERS
create or replace function public.handle_updated_at()
returns trigger as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_products_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

create trigger set_disputes_updated_at
  before update on public.disputes
  for each row execute procedure public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger as $function$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
  );
  return new;
end;
$function$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. STORAGE SETUP
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;

create policy "Public Access to Product Images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Vendors can upload product images"
  on storage.objects for insert
  with check ( 
    bucket_id = 'product-images' 
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and (profiles.role = 'vendor' or profiles.role = 'admin')
    )
  );

create policy "Vendors can update own product images"
  on storage.objects for update
  using ( 
    bucket_id = 'product-images' 
    and auth.uid() = owner
  );

create policy "Vendors can delete own product images"
  on storage.objects for delete
  using ( 
    bucket_id = 'product-images' 
    and auth.uid() = owner
  );

create policy "Public Access to Avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.uid() = owner );

create policy "Users can update their avatar"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.uid() = owner );

create policy "Users can delete their avatar"
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.uid() = owner );
