-- Ejecutar una sola vez en Supabase > SQL Editor para habilitar hasta 3 imágenes.
alter table public.products
add column if not exists image_urls text[] not null default '{}';

update public.products
set image_urls = array[image_url]
where image_url <> '' and cardinality(image_urls) = 0;

alter table public.products
drop constraint if exists products_max_3_images;

alter table public.products
add constraint products_max_3_images check (cardinality(image_urls) <= 3);
