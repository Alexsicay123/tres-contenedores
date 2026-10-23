# Proyecto: Tres Contenedores Interconectados
Sistemas Operativos I · UMG — Gestor de Contactos (3 capas)

## Diagrama
```
Navegador ──► web (nginx :80 → host 8080) ──► api (Node :3000) ──► db (PostgreSQL :5432)
              redes: frontend + backend        red: backend          red: backend
                                                                     volumen: pgdata
```
- `web` hace proxy de `/api/` hacia `http://api:3000/` (por nombre de servicio).
- `api` se conecta a la BD con `DB_HOST=db`.
- Solo `web` está en `frontend`; `api` y `db` viven en `backend`.

## Pasos
```bash
cp .env.example .env        # credenciales fuera del código
docker compose up -d --build
docker compose ps
```
Abrir http://localhost:8080

## Comandos de evidencia
```bash
docker ps
docker network ls
docker network inspect tres-contenedores_backend
docker compose logs api
# Conectividad por nombre entre contenedores
docker exec proyecto_web wget -qO- http://api:3000/contactos
docker exec proyecto_api wget -qO- http://localhost:3000/health
docker exec proyecto_db psql -U app -d mi_app -c "SELECT * FROM contactos;"
# API directa desde el host
curl -X POST localhost:3000/contactos -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","telefono":"5555-1234"}'
curl localhost:3000/contactos
```

## Prueba de persistencia
```bash
docker compose down        # borra contenedores, NO el volumen
docker compose up -d
curl localhost:3000/contactos   # los datos siguen ahí
docker volume ls
# docker compose down -v  -> borra también el volumen
```
