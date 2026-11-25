# Estadísticas de origen

1. En el proyecto correcto de Supabase, ejecuta `supabase/migration_6_traffic_source.sql` en SQL Editor. No elimina registros.
2. Actualiza el código en GitHub y espera que Netlify termine la publicación. Conserva las variables de entorno.
3. En Estadísticas, copia el enlace para cada canal y úsalo en ese canal. Los enlaces abren el mismo catálogo con un identificador de origen.
4. Comprueba cada enlace y un clic real de WhatsApp. Revisa el panel con tu usuario administrador.

Las visitas son aperturas de la página, no personas únicas. No se identifican nombres ni teléfonos. Los datos anteriores no indican origen y se muestran sin clasificar. Antes de esta actualización el contador de WhatsApp podía incrementarse al mostrar productos; por ello el panel muestra como clics nuevos solo los eventos registrados después del cambio. Los antiguos siguen en la base sin borrarse y no se pueden corregir de forma fiable. Las cifras abarcan los últimos 90 días.

Una visita con enlace etiquetado se atribuye a esa etiqueta, incluso si el enlace se reenvía por otro canal. Sin etiqueta, se usa el dominio de referencia cuando el navegador lo proporciona; de lo contrario se muestra como directo o desconocido. Por eso el origen no siempre es exacto.

No vuelvas a ejecutar schema.sql completo sobre tu base existente: puede cambiar autorizaciones de administrador. El SQL de esta actualización solo añade una columna.
