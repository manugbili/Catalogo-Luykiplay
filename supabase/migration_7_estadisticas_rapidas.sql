-- Ejecutar después de migration_6. Conserva productos, eventos y permisos existentes.
create or replace function public.catalog_statistics_90_days()
returns jsonb
language plpgsql stable security invoker set search_path = public
as $$
declare result jsonb;
begin
  if auth.uid() is null or not coalesce(public.is_catalog_admin(), false) then
    raise exception 'No autorizado' using errcode = '42501';
  end if;
  with events as materialized (
    select event_type, product_name, traffic_source
    from public.analytics_events
    where created_at >= now() - interval '90 days'
  ), totals as (
    select count(*) filter (where event_type = 'view') as views,
      count(*) filter (where event_type = 'whatsapp' and traffic_source is not null) as whatsapp,
      count(*) filter (where event_type = 'share') as shares
    from events
  ), grouped_sources as (
    select coalesce(traffic_source, 'historico') as source, count(*) as total
    from events where event_type = 'view'
    group by coalesce(traffic_source, 'historico')
  ), grouped_products as (
    select product_name, count(*) as total from events
    where event_type = 'product' and product_name is not null
    group by product_name order by total desc, product_name asc limit 5
  )
  select jsonb_build_object(
    'views', totals.views, 'whatsapp', totals.whatsapp, 'shares', totals.shares,
    'sources', coalesce((select jsonb_object_agg(source, total) from grouped_sources), '{}'::jsonb),
    'top', coalesce((select jsonb_agg(jsonb_build_array(product_name, total) order by total desc, product_name asc) from grouped_products), '[]'::jsonb)
  ) into result from totals;
  return result;
end;
$$;
revoke all on function public.catalog_statistics_90_days() from public, anon;
grant execute on function public.catalog_statistics_90_days() to authenticated;
