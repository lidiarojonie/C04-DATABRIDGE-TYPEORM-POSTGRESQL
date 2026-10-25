## Mejora: destinos favoritos

Cada destino incluye `favorito` (`boolean`), que por defecto es `false`.
El campo se guarda en PostgreSQL y forma parte de las respuestas del CRUD.

- `POST /destinos` admite `favorito` opcional.
- `PATCH /destinos/:id` permite cambiarlo, por ejemplo con `{"favorito": true}`.
- La app permite marcar o desmarcar destinos y filtrar la lista para ver solo
  los favoritos.

La sincronización de TypeORM añade la columna a la tabla existente al iniciar
el backend (`synchronize: true` está configurado para este ejercicio).