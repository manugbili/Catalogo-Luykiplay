# Actualización de estadísticas

1. En el proyecto correcto de Supabase, ejecuta `supabase/migration_6_traffic_source.sql` si todavía no lo has hecho.
2. Ejecuta `supabase/migration_7_estadisticas_rapidas.sql`. Agrega una función de lectura para resumir los últimos 90 días; no elimina productos ni eventos. Solo permite consultar el resumen al usuario autenticado que esté autorizado como administrador.
3. Actualiza el código en GitHub y espera que Netlify publique. No cambies tus variables de entorno.
4. En el panel, pulsa Estadísticas. Verás un mensaje mientras carga. Copia el enlace de TikTok y colócalo en TikTok. Los enlaces previos y las visitas web antiguas se conservan y siguen apareciendo si existen.

La velocidad depende de la conexión y de cuántos registros haya. Las cifras de WhatsApp previas a la actualización de origen no se mezclan con los nuevos clics reales, porque el contador anterior podía incrementarse al dibujar productos.

Esta carpeta parte del archivo Luki Play compartido el 23 de noviembre. Si tu catálogo publicado tiene cambios posteriores, compáralos y consérvalos antes de sustituir archivos. No vuelvas a ejecutar schema.sql completo: podría cambiar la autorización de administradores.
