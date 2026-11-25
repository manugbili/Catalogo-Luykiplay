-- Para una instalación existente: agrega la opción sin modificar productos ni configuración.
alter table public.store_settings
  add column if not exists font_family text not null default 'Montserrat';
