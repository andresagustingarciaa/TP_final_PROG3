# TP_final_PROG3
Clinica- Programación 3 2026

Como correr el proyecto

1. Clonar el repo
2. Instalar dependencias con "npm install"
3. Crear un archivo ".env" en la raíz con esto:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=clinica_db

4. Correr con npm run dev   (tengan 2 terminales abiertas aca en vs code asi con una ven que corra bien y la otra para ir poniendo los comandos)

//Endpoints de especialidades

GET /api/v1/especialidades - lista todas
GET /api/v1/especialidades/:id - trae una
POST /api/v1/especialidades - crea una
PUT /api/v1/especialidades/:id - edita una
DELETE /api/v1/especialidades/:id - elimina (soft delete)