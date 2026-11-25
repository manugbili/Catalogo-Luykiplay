-- Ejecutar una sola vez ANTES de actualizar el sitio. No elimina eventos existentes.
alter table public.analytics_events add column if not exists traffic_source text;
