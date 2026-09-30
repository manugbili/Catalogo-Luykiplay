-- Ejecutar una sola vez en Supabase > SQL Editor.
create table if not exists public.price_lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.price_list_items (
  list_id uuid not null references public.price_lists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  price integer not null check (price >= 0),
  primary key (list_id, product_id)
);

alter table public.price_lists enable row level security;
alter table public.price_list_items enable row level security;

drop policy if exists "admin all price_lists" on public.price_lists;
create policy "admin all price_lists" on public.price_lists
  for all using (public.is_catalog_admin()) with check (public.is_catalog_admin());

drop policy if exists "admin all price_list_items" on public.price_list_items;
create policy "admin all price_list_items" on public.price_list_items
  for all using (public.is_catalog_admin()) with check (public.is_catalog_admin());

create index if not exists price_list_items_list_idx on public.price_list_items(list_id);
