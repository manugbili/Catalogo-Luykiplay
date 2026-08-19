# Catálogo Lukiplay — Supabase + GitHub + Netlify

Aplicación independiente con catálogo público y panel administrador privado.

## Actualización: 3 imágenes por producto

Para una instalación que ya está funcionando, ejecuta una sola vez en **Supabase > SQL Editor** el archivo `supabase/migration_3_product_images.sql`. Después sube esta versión a GitHub; Netlify la publicará automáticamente. La primera imagen seleccionada será la portada y las otras dos aparecerán en la galería del producto.

## 1. Crear Supabase

1. Crea un proyecto gratuito en Supabase.
2. Abre **SQL Editor**, pega `supabase/schema.sql` y presiona **Run**.
3. Ve a **Authentication > Users** y crea el usuario `arqmanuelmora240@gmail.com` con una contraseña segura.
4. En **Project Settings > API**, copia la URL del proyecto y la clave pública `anon`.

## 2. Configurar localmente

1. Copia `.env.example` como `.env`.
2. Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Ejecuta `npm install` y `npm run dev`.

## 3. Subir a GitHub

Sube toda esta carpeta a un repositorio privado. No subas el archivo `.env`.

## 4. Publicar en Netlify

1. Selecciona **Add new project > Import from Git**.
2. Conecta el repositorio de GitHub.
3. Agrega en Netlify las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Publica. El catálogo estará en `/` y la administración en `/admin`.

## Seguridad

- Los clientes pueden leer productos visibles e insertar eventos estadísticos.
- Solo `arqmanuelmora240@gmail.com` puede modificar el catálogo o subir imágenes.
- La clave `anon` es pública por diseño; la seguridad depende de las políticas RLS incluidas.
- Nunca publiques la clave `service_role`.
