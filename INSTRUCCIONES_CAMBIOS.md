# Cambios para el catálogo Luki Play

## Estilos de letra

1. En el proyecto correcto de Supabase, abre SQL Editor.
2. Ejecuta únicamente `supabase/migration_5_font_family.sql`. Agrega un campo con Montserrat como valor inicial y no borra productos, fotos ni ajustes.
3. Sube el código actualizado del catálogo y espera a que termine la publicación en Netlify.
4. Entra al panel, abre Configurar y elige Estilo de letra. Guarda la configuración.

## Agregar otro administrador

La autorización se configura en Supabase, no se activa simplemente subiendo la carpeta. Primero crea el usuario en Authentication > Users. Luego, en SQL Editor, revisa la definición actual de `public.is_catalog_admin()` y conserva todos los correos autorizados. Para revisar la definición sin cambiarla, ejecuta:

```sql
select pg_get_functiondef('public.is_catalog_admin()'::regprocedure);
```

La función puede tener condiciones adicionales que no sean solo correos. No la reemplaces sin revisarlas. Si solo contiene una lista de correos, puedes adaptarla incluyendo TODOS los correos actuales y el nuevo, manteniendo las comillas. Antes de ejecutar, reemplaza ambos ejemplos:

```sql
create or replace function public.is_catalog_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in (
    lower('CORREO_ADMIN_ACTUAL@EJEMPLO.COM'),
    lower('CORREO_ADMIN_NUEVO@EJEMPLO.COM')
  );
$$;
```

Si ya hay más administradores, inclúyelos a todos. El código reemplaza la función anterior y los correos omitidos perderán sus permisos. No incluyas contraseñas. Todos los administradores autorizados tendrán los mismos permisos. Prueba el ingreso y un cambio controlado con cada cuenta después de ejecutarlo.

No ejecutes de nuevo el schema.sql completo para actualizar una instalación en funcionamiento: contiene una definición inicial de administrador y puede reemplazar la autorización existente.
