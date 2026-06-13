# TP Programación 3 - API Clínica 🏥

API REST completa para gestionar una clínica, incluyendo especialidades, médicos, pacientes, turnos y obras sociales.

---

## 📑 Índice de Contenidos

1. [Que hace este código?](#que-hace-este-codigo)
2. [Cómo instalar esto](#cómo-instalar-esto)
3. [Autenticación y Sistema de Contraseñas 🔐](#autenticación-y-sistema-de-contraseñas-)
4. [Roles y Permisos 👥](#roles-y-permisos-)
5. [Flujo de Autenticación paso a paso 🔄](#flujo-de-autenticación-paso-a-paso-)
6. [Todos los Endpoints Disponibles 📍](#todos-los-endpoints-disponibles-)
7. [Stored Procedures de la BD 🗂️](#stored-procedures-sp-de-la-base-de-datos-)
8. [Módulos y Estructura de Carpetas 📂](#módulos-y-estructura-de-carpetas-)
9. [Soft Delete](#soft-delete)
10. [Estructura del proyecto](#estructura-del-proyecto)
11. [Tecnologías que usé](#tecnologías-que-usé)
12. [Dependencias del Proyecto 📦](#dependencias-del-proyecto-)
13. [Validaciones y Reglas de Negocio 🔒](#validaciones-y-reglas-de-negocio-)
14. [Transacciones en la Base de Datos 💾](#transacciones-en-la-base-de-datos-)
15. [Problemas que tuve (y capaz vos también)](#problemas-que-tuve-y-capaz-vos-también)

---

## Que hace este codigo?

Es un servidor que te permite:
- Gestionar **especialidades** médicas (CRUD completo)
- Administrar **médicos** con sus especialidades y obras sociales asociadas
- Manejar **pacientes** y sus datos
- Registrar **turnos médicos** con validaciones y transacciones
- Gestionar **obras sociales** y sus relaciones con médicos
- Generar **reportes en PDF** de atenciones
- Obtener **estadísticas** de atenciones mediante stored procedures
- Autenticación con **JWT** y validación de **roles** (Médico, Paciente, Admin)

Está hecho con **Express** (framework de Node.js), **MySQL** para la base de datos, **bcrypt** para seguridad de contraseñas, y otras librerías útiles.



## Cómo instalar esto

Primero necesitas tener **Node.js** instalado (si no lo tenes, te lo bajas de nodejs.org, es re facil).

### Pasos:

1. **Clona el repositorio**
   ```bash
   git clone <URL del repo>
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   npm install express-validator
   ```
   (Si no funciona a la primera, intenta d nuevo, a veces pasa q falla)

3. **Crea el archivo `.env` e instalr DB** en la carpeta principal (la raíz) con esto:
   ```
      PORT=3000

      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=
      DB_NAME=prog3_turnos

      JWT_SECRET=clinica_secret_key

   ```
   > Nota: Cambia la contraseña si tu MySQL tiene contraseña (la mia no tiene por eso esta vacio)

   **Explicación de las variables de `.env`:**
   - **PORT** - Puerto en el qe corre el servidor (3000 es el default)
   - **DB_HOST** - Host/IP del servidor MySQL (localhost = tu máquina)
   - **DB_USER** - Usuario de MySQL (normalmente "root")
   - **DB_PASSWORD** - Contraseña de MySQL (vacío si no tenes contraseña)
   - **DB_NAME** - Nombre de la base de datos (en este caso "prog3_turnos")
   - **JWT_SECRET** - Clave secreta para firmar los tokens JWT. Cambiar a algo más seguro en producción

   # Base de datos

   La base de datos fue creada con el script SQL provisto por el docente.
   Para ejecutarla se utilizó APPserv.
   Asegurarse de tener MySQL corriendo y configurar el .env con los datos de conexión correspondientes.

4. **Corre el servidor**
   ```bash
   npm run dev
   ```
   Te va a decir "Servidor corriendo en http://localhost:3000" si todo anduvo bien.

> **Consejo:** Abre 2 terminales en VS Code - una para que corra el servidor y otra para ir testeando los endpoints. Así ves los logs mientras mandas requests.

## Autenticación y Sistema de Contraseñas 🔐

### Función de Login (src/services/auth.service.js)

La función de login implementa un sistema **dual de validación** para garantizar compatibilidad con contraseñas antiguas y nuevas seguridad:

```javascript
const login = async (email, contrasenia) => {
    // 1. Busca el usuario por email
    const usuario = // ... búsqueda en BD
    
    // 2. Valida con BCRYPT (nuevos usuarios)
    let passwordValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    
    // 3. Si bcrypt falla, valida con SHA256 (usuarios existentes)
    if (!passwordValida) {
        const contraseniaHash = hashPassword(contrasenia);
        passwordValida = contraseniaHash === usuario.contrasenia;
    }
    
    // 4. Si coincide, genera token JWT
    return { token, rol };
}
```

### ¿Cómo funciona?

**1️⃣ Nuevos usuarios (creación/edición):**
- Se usan **bcrypt** con salt rounds = 10 (más seguro)
- Se aplica en: crear médicos, crear pacientes, crear admin

**2️⃣ Usuarios existentes (login):**
- Se intenta primero con **bcrypt**
- Si falla, se valida con **SHA256** (compatibilidad con contraseñas antiguas del `db.sql`)
- Esto permite transición gradual sin perder acceso a usuarios existentes

**3️⃣ Generación de token JWT:**
- Si la contraseña es válida, se genera un token que dura 8 horas
- El token contiene: `id_usuario`, `email` y `rol`

### Endpoints de Autenticación

| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/v1/auth/login` | Inicia sesión y devuelve token JWT |

**Ejemplo de uso:**
```json
{
  "email": "lopmar@correo.com",
  "contrasenia": "miContraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "rol": 1
  }
}
```

**Error (401):**
```json
{
  "ok": false,
  "message": "Email o contraseña incorrectos"
}
```

## Roles y Permisos 👥

El sistema cuenta con 3 roles definidos. Cada rol tiene acceso diferente a los endpoints:

| Rol | ID | Descripción | Permisos |
|-----|----|-----------|---------| 
| **Médico** | 1 | Personal médico qe atiende turnos | Ver especialidades, ver pacientes, atender turnos, consultar sus propios turnos, ver obras sociales |
| **Paciente** | 2 | Usuarios qe solicitan turnos | Ver médicos, ver especialidades, ver obras sociales, reservar turnos, ver sus turnos |
| **Administrador** | 3 | Gestiona todo el sistema | Acceso total: crear/editar/eliminar usuarios, turnos, especialidades, ver estadísticas, generar reportes PDF |

### Qué puede hacer cada rol:

**Médico (Rol 1):**
- ✅ Listar y ver especialidades
- ✅ Listar y ver pacientes
- ✅ Marcar turnos como atendidos (`PATCH /turnos/:id/atender`)
- ✅ Ver sus propios turnos
- ❌ Crear/editar/eliminar especialidades
- ❌ Crear/editar/eliminar pacientes
- ❌ Acceso a estadísticas

**Paciente (Rol 2):**
- ✅ Ver médicos
- ✅ Ver especialidades
- ✅ Ver obras sociales
- ✅ Crear y ver turnos propios
- ❌ Crear/editar/eliminar otros usuarios
- ❌ Acceso a estadísticas
- ❌ Marcar turnos como atendidos

**Administrador (Rol 3):**
- ✅ **ACCESO TOTAL** a todos los endpoints
- ✅ Crear/editar/eliminar especialidades
- ✅ Crear/editar/eliminar médicos
- ✅ Crear/editar/eliminar pacientes
- ✅ Crear/editar/eliminar obras sociales
- ✅ Ver estadísticas del sistema
- ✅ Generar reportes en PDF
- ✅ Crear otros administradores

## Flujo de Autenticación paso a paso 🔄

Este es el flujo qe debe seguir un usuario para acceder a endpoints protegidos:

### Paso 1: Login
El usuario envía sus credenciales al endpoint `/api/v1/auth/login`:

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "lopmar@correo.com",
  "contrasenia": "miContraseña123"
}
```

### Paso 2: Validación de Contraseña
El servidor:
1. Busca el usuario por email
2. Intenta validar con **bcrypt** (si el usuario fue creado recientemente)
3. Si falla, intenta con **SHA256** (usuarios antiguos del `db.sql`)
4. Si ninguno funciona, devuelve error 401

### Paso 3: Generación de Token JWT
Si la contraseña es válida, se genera un token con:
- `id_usuario` - ID del usuario
- `email` - Email del usuario  
- `rol` - Rol del usuario (1, 2 o 3)
- `exp` - Fecha de expiración (8 horas desde ahora)

**Respuesta del servidor:**
```json
{
  "ok": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sIjoxLCJpYXQiOjE2MjMwNDAwMDB9.FIRMA",
    "rol": 1
  }
}
```

### Paso 4: Usar el Token
El cliente debe guardar el token y usarlo en TODOS los requests posteriores a endpoints protegidos. Se envía en el header `Authorization`:

```bash
GET /api/v1/especialidades
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sIjoxLCJpYXQiOjE2MjMwNDAwMDB9.FIRMA
```

**Nota:** El token dura **8 horas**. Después debe hacer login de nuevo.

### Paso 5: Validación del Token en cada Request
El middleware `auth.middleware.js` verifica:
1. ¿El header `Authorization` existe?
2. ¿El token es válido y no está expirado?
3. ¿El rol del usuario tiene permiso para este endpoint?

Si algo falla, devuelve error 401 o 403.



### � Leyenda de Símbolos
- **❌** = No requiere autenticación (endpoint público)
- **✅** = Requiere autenticación con token JWT (bearer token en header `Authorization`)
- **Rol** = Si aparece, solo ciertos roles pueden acceder (1=Médico, 2=Paciente, 3=Admin)

### �🔐 Autenticación
| Método | URL | Descripción | Auth |
|--------|-----|-------------|------|
| POST | `/api/v1/auth/login` | Login y obtener token JWT | ❌ |

### 📚 Especialidades (CRUD Completo)
| Método | URL | Descripción | Auth |
|--------|-----|-------------|------|
| GET | `/api/v1/especialidades` | Lista todas las especialidades | ❌ |
| GET | `/api/v1/especialidades/:id` | Obtiene una especialidad por ID | ❌ |
| POST | `/api/v1/especialidades` | Crea nueva especialidad | ✅ |
| PUT | `/api/v1/especialidades/:id` | Edita una especialidad | ✅ |
| DELETE | `/api/v1/especialidades/:id` | Elimina (soft delete) especialidad | ✅ |

### 👨‍⚕️ Médicos (CRUD + Relaciones)
| Método | URL | Descripción | Auth |
|--------|-----|-------------|------|
| GET | `/api/v1/medicos` | Lista todos los médicos | ❌ |
| GET | `/api/v1/medicos/:id` | Obtiene un médico por ID | ❌ |
| POST | `/api/v1/medicos` | Crea nuevo médico (usuario + médico) | ✅ |
| PUT | `/api/v1/medicos/:id` | Edita un médico | ✅ |
| DELETE | `/api/v1/medicos/:id` | Elimina (soft delete) médico | ✅ |
| PUT | `/api/v1/medicos/:id/especialidad` | Asocia una especialidad al médico | ✅ |
| GET | `/api/v1/medicos/:id/obras-sociales` | Lista obras sociales del médico | ❌ |
| POST | `/api/v1/medicos/:id/obras-sociales` | Asocia obra social al médico | ✅ |
| DELETE | `/api/v1/medicos/:id/obras-sociales/:id_os` | Desasocia obra social del médico | ✅ |

### 🏥 Obras Sociales (CRUD Completo)
| Método | URL | Descripción | Auth |
|--------|-----|-------------|------|
| GET | `/api/v1/obras-sociales` | Lista todas las obras sociales | ❌ |
| GET | `/api/v1/obras-sociales/:id` | Obtiene obra social por ID | ❌ |
| POST | `/api/v1/obras-sociales` | Crea nueva obra social | ✅ |
| PUT | `/api/v1/obras-sociales/:id` | Edita una obra social | ✅ |
| DELETE | `/api/v1/obras-sociales/:id` | Elimina (soft delete) obra social | ✅ |

### 👥 Pacientes (CRUD - Solo Admin)
| Método | URL | Descripción | Auth | Rol |
|--------|-----|-------------|------|-----|
| GET | `/api/v1/pacientes` | Lista todos los pacientes | ✅ | Cualquiera |
| GET | `/api/v1/pacientes/:id` | Obtiene paciente por ID | ✅ | Cualquiera |
| POST | `/api/v1/pacientes` | Crea nuevo paciente | ✅ | Admin (3) |
| PUT | `/api/v1/pacientes/:id` | Edita un paciente | ✅ | Admin (3) |
| DELETE | `/api/v1/pacientes/:id` | Elimina (soft delete) paciente | ✅ | Admin (3) |

### 📅 Turnos (CRUD + Validaciones)
| Método | URL | Descripción | Auth | Rol |
|--------|-----|-------------|------|-----|
| GET | `/api/v1/turnos` | Lista todos los turnos | ✅ | Cualquiera |
| GET | `/api/v1/turnos/:id` | Obtiene turno por ID | ✅ | Cualquiera |
| GET | `/api/v1/turnos/medico/:id_medico` | Lista turnos de un médico | ✅ | Cualquiera |
| GET | `/api/v1/turnos/paciente/:id_paciente` | Lista turnos de un paciente | ✅ | Cualquiera |
| POST | `/api/v1/turnos` | Crea nuevo turno (con transacciones) | ✅ | Cualquiera |
| PATCH | `/api/v1/turnos/:id/atender` | Marca turno como atendido | ✅ | Médico (1) / Admin (3) |
| DELETE | `/api/v1/turnos/:id` | Cancela (soft delete) turno | ✅ | Admin (3) |

### 👤 Administrador (Solo Admin)
| Método | URL | Descripción | Auth | Rol |
|--------|-----|-------------|------|-----|
| POST | `/api/v1/admin/registro` | Crea nuevo administrador | ✅ | Admin (3) |
| GET | `/api/v1/admin/estadisticas` | Obtiene estadísticas (stored procedures) | ✅ | Admin (3) |

### 📄 Reportes (PDF)
| Método | URL | Descripción | Auth | Rol |
|--------|-----|-------------|------|-----|
| GET | `/api/v1/reportes/turnos` | Descarga informe de turnos en PDF | ✅ | Admin (3) |

## Stored Procedures (SP) de la Base de Datos 🗂️

La base de datos contiene 3 stored procedures para estadísticas:

### 1️⃣ `sp_estadisticas_generales()`
**Propósito:** Obtiene resumen general de turnos

**Retorna:**
- `total_turnos` - Cantidad total de turnos
- `turnos_atendidos` - Cuántos turnos fueron atendidos
- `turnos_pendientes` - Cuántos turnos están pendientes
- `total_recaudado` - Dinero total recaudado (solo turnos atendidos)

**Ejemplo:**
```sql
CALL sp_estadisticas_generales();
```

### 2️⃣ `sp_estadisticas_por_obra_social()`
**Propósito:** Estadísticas agrupadas por obra social

**Retorna:**
- `id_obra_social` - ID de la obra social
- `obra_social` - Nombre de la obra social
- `cantidad_turnos` - Total de turnos de esa obra social
- `turnos_atendidos` - Cuántos fueron atendidos
- `total_recaudado` - Dinero recaudado por esa obra social

**Ejemplo:**
```sql
CALL sp_estadisticas_por_obra_social();
```

### 3️⃣ `sp_estadisticas_por_medico()`
**Propósito:** Estadísticas de atenciones por médico

**Retorna:**
- `id_medico` - ID del médico
- `apellido` - Apellido del médico
- `nombres` - Nombres del médico
- `especialidad` - Especialidad que atiende
- `cantidad_turnos` - Total de turnos del médico
- `turnos_atendidos` - Cuántos turnos atendió
- `pacientes_atendidos` - Cantidad de pacientes diferentes atendidos

**Ejemplo:**
```sql
CALL sp_estadisticas_por_medico();
```

## Módulos y Estructura de Carpetas 📂

El proyecto está organizado en capas:

### Controllers (`src/controllers/`)
Manejan la lógica de negocio y responden a las requests:
- **auth.controller.js** - Maneja login y autenticación
- **especialidades.controller.js** - CRUD de especialidades
- **medicos.controller.js** - CRUD de médicos + relaciones
- **obras_sociales.controller.js** - CRUD de obras sociales
- **pacientes.controller.js** - CRUD de pacientes (solo admin)
- **turnos.controller.js** - CRUD de turnos + atender
- **admin.controller.js** - Registro de admin + estadísticas
- **pdf.controller.js** - Generación de reportes PDF

### Models (`src/models/`)
Acceden directamente a la base de datos:
- **auth.model.js** - Consultas de autenticación
- **especialidades.model.js** - Queries de especialidades
- **medicos.model.js** - Queries de médicos (con JOINs complejos)
- **obras_sociales.model.js** - Queries de obras sociales
- **pacientes.model.js** - Queries de pacientes
- **turnos.model.js** - Queries de turnos
- **estadisticas.model.js** - Llamadas a Stored Procedures

### Services (`src/services/`)
Contienen lógica reutilizable entre controllers:
- **auth.service.js** - Validación de contraseñas (SHA256 + bcrypt dual)
- **especialidades.service.js** - Operaciones con especialidades
- **medicos.service.js** - Operaciones con médicos (hashing de contraseñas con bcrypt)
- **obras_sociales.service.js** - Operaciones con obras sociales
- **pacientes.service.js** - Operaciones con pacientes
- **turnos.service.js** - Operaciones con turnos
- **estadisticas.service.js** - Llamadas a procedimientos almacenados

### Middlewares (`src/middlewares/`)
Validan datos y autenticación:
- **auth.middleware.js** - Verifica token JWT y roles (1=Médico, 2=Paciente, 3=Admin)
- **validation.middleware.js** - Valida datos de entrada con express-validator

### Routes (`src/routes/`)
Definen los endpoints de la API:
- **auth.routes.js** - Endpoints de autenticación
- **especialidades.routes.js** - Endpoints de especialidades
- **medicos.routes.js** - Endpoints de médicos
- **obras_sociales.routes.js** - Endpoints de obras sociales
- **pacientes.routes.js** - Endpoints de pacientes
- **turnos.routes.js** - Endpoints de turnos
- **admin.routes.js** - Endpoints administrativos
- **pdf.routes.js** - Endpoints de reportes

### Otros archivos
- **app.js** - Configuración principal del servidor Express
- **db.js** - Conexión a MySQL

## Soft Delete

IMPORTANTE: cuando "eliminas" cualquier registro (especialidad, médico, paciente, etc), en realidad no se borra de la base de datos. Se marca como inactivo (soft delete). Esto está bien porque así no pierdes datos si alguien accidentalmente borra algo importante. Está en el código pero la BD se encarga de eso internamente.

## Estructura del proyecto

```
├── src/
│   ├── app.js (configuración del servidor Express)
│   ├── db.js (conexión a MySQL)
│   ├── controllers/ (lógica de negocio para cada entidad)
│   │   ├── auth.controller.js
│   │   ├── especialidades.controller.js
│   │   ├── medicos.controller.js
│   │   ├── obras_sociales.controller.js
│   │   ├── pacientes.controller.js
│   │   ├── turnos.controller.js
│   │   ├── admin.controller.js
│   │   └── pdf.controller.js
│   ├── models/ (consultas a base de datos)
│   │   ├── especialidades.model.js
│   │   ├── medicos.model.js
│   │   ├── obras_sociales.model.js
│   │   ├── pacientes.model.js
│   │   ├── turnos.model.js
│   │   ├── estadisticas.model.js
│   │   └── auth.model.js
│   ├── services/ (lógica reutilizable)
│   │   ├── auth.service.js
│   │   ├── especialidades.service.js
│   │   ├── medicos.service.js
│   │   ├── obras_sociales.service.js
│   │   ├── pacientes.service.js
│   │   ├── turnos.service.js
│   │   └── estadisticas.service.js
│   ├── routes/ (definición de endpoints)
│   │   ├── auth.routes.js
│   │   ├── especialidades.routes.js
│   │   ├── medicos.routes.js
│   │   ├── obras_sociales.routes.js
│   │   ├── pacientes.routes.js
│   │   ├── turnos.routes.js
│   │   ├── admin.routes.js
│   │   └── pdf.routes.js
│   └── middlewares/ (validación y autenticación)
│       ├── auth.middleware.js
│       └── validation.middleware.js
├── BRUNO/ (colecciones de prueba API)
├── db.sql (script de base de datos)
├── package.json (dependencias)
├── .env (configuración local)
└── README.md (este archivo)
```

## Tecnologías que usé

- **Node.js** - runtime de JavaScript
- **Express** - framework para hacer servidores
- **MySQL** - base de datos
- **Nodemon** - para qe reinicie solo cuando cambio código
- **Express-validator** - para validar que la data sea correcta
- **Cors** - para que otras aplicaciones puedan usar la API
- **Morgan** - para ver los logs bonitos en la terminal

## Dependencias del Proyecto 📦

Aca está todo lo qe se instala con `npm install`:

### Dependencias Principales (`dependencies`)

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| **bcryptjs** | 3.0.3 | Encriptación de contraseñas. Se usa para hashear contraseñas de nuevos usuarios de forma segura (bcrypt con salt rounds = 10) |
| **cors** | 2.8.6 | Middleware para permitir solicitudes desde otros dominios. Sin esto, otros clientes (frontend) no podrían consumir la API |
| **dotenv** | 17.4.2 | Carga variables de entorno del archivo `.env`. Necesario para configurar DB_HOST, DB_USER, JWT_SECRET, etc |
| **express** | 5.2.1 | Framework web. Es el corazón de toda la aplicación, maneja las rutas y requests |
| **express-validator** | 7.3.2 | Valida y sanitiza datos qe vienen en las requests. Verifica qe el email sea válido, qe los números sean números, etc |
| **jsonwebtoken** | 9.0.3 | Genera y verifica tokens JWT. Se usa para autenticar usuarios después del login |
| **morgan** | 1.10.1 | Logger de requests HTTP. Muestra en la terminal quién hizo qué request y cuándo |
| **mysql2** | 3.22.3 | Driver para conectarse a MySQL desde Node.js. Sin esto, no podríamos acceder a la base de datos |
| **pdfkit** | 0.19.1 | Librería para generar PDFs. Se usa en el endpoint `/reportes/turnos` para descargar informes |
| **swagger-jsdoc** | 6.3.0 | Genera documentación Swagger/OpenAPI de los endpoints a partir de comentarios en el código |
| **swagger-ui-express** | 5.0.1 | Interfaz gráfica para ver la documentación de la API (en `/api-docs`) |

### Dependencias de Desarrollo (`devDependencies`)

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| **nodemon** | 3.1.14 | Monitorea cambios en el código y reinicia el servidor automáticamente. Muy útil para desarrollo, así no tenés qe reiniciar manualmente cada vez |

### Cómo usar las dependencias

**Para instalar todo:**
```bash
npm install
```

**Para correr en desarrollo (con nodemon):**
```bash
npm run dev
```

**Para correr en producción (sin nodemon):**
```bash
npm start
```

## Validaciones y Reglas de Negocio 🔒

Cada endpoint tiene validaciones específicas para mantener la integridad de los datos:

### Especialidades
- ✅ El **nombre** es obligatorio, máximo 120 caracteres
- ✅ El **nombre** debe ser único (no se permiten duplicados)
- ✅ No se puede crear/editar sin autenticación
- ⚠️ Al eliminar, se marca como inactiva (soft delete), no se borra

### Médicos
- ✅ El **documento** es único
- ✅ El **email** es único
- ✅ La **matrícula** es única
- ✅ El **ID de especialidad** debe existir
- ✅ El **valor_consulta** debe ser un número positivo
- ✅ La **contraseña** mínimo 6 caracteres (se hashea con bcrypt)
- ⚠️ Crear un médico crea automáticamente un usuario (rol 1)

### Pacientes
- ✅ El **documento** es único
- ✅ El **email** es único
- ✅ El **ID de obra social** debe existir
- ✅ Solo **Admin** puede crear/editar/eliminar pacientes
- ⚠️ Crear un paciente crea automáticamente un usuario (rol 2)

### Turnos
- ✅ El **id_medico** y **id_paciente** deben existir
- ✅ La **fecha_hora** debe estar en formato ISO 8601 (2026-04-15T10:30:00)
- ✅ No se puede crear un turno en el pasado
- ✅ No se puede reservar turno para un médico qe no tiene especialidad asignada
- ⚠️ Al crear un turno, se usa **transacción** para garantizar consistencia

### Obras Sociales
- ✅ El **nombre** es único
- ✅ El **porcentaje_descuento** debe ser un número entre 0 y 100
- ✅ El campo **es_particular** es booleano

### Autenticación
- ✅ El **email** debe ser válido
- ✅ La **contraseña** se valida contra SHA256 (usuarios antiguos) o bcrypt (nuevos)
- ✅ El **token JWT** expira en 8 horas
- ✅ Sin token válido no se puede acceder a endpoints protegidos

## Transacciones en la Base de Datos 💾

Las transacciones garantizan qe múltiples operaciones se ejecuten de forma atómica (todo o nada). Se usan en:

### 1️⃣ Creación de Médicos
**Archivo:** `src/models/medicos.model.js`

```sql
START TRANSACTION;
  INSERT INTO usuarios (...) VALUES (...);
  INSERT INTO medicos (...) VALUES (...);
COMMIT;
```

**Por qué:** Si la inserción del usuario falla, el médico también debe fallar. No queremos usuarios sin médicos o médicos sin usuarios.

### 2️⃣ Creación de Pacientes
**Archivo:** `src/models/pacientes.model.js`

```sql
START TRANSACTION;
  INSERT INTO usuarios (...) VALUES (...);
  INSERT INTO pacientes (...) VALUES (...);
COMMIT;
```

**Por qué:** Mismo caso: si falla el usuario, debe fallar el paciente.

### 3️⃣ Creación de Turnos
**Archivo:** `src/models/turnos.model.js`

```sql
START TRANSACTION;
  INSERT INTO turnos_reservas (...) VALUES (...);
  UPDATE medicos SET ... (si es necesario);
  UPDATE pacientes SET ... (si es necesario);
COMMIT;
```

**Por qué:** La creación de un turno puede afectar múltiples tablas. Si algo falla a mitad de camino, toda la operación se revierte.

### Cómo funciona en el código:

Si ocurre un error durante una transacción, el middleware captura la excepción y ejecuta `ROLLBACK` automáticamente:

```javascript
try {
    await pool.query('START TRANSACTION');
    // Múltiples inserts/updates
    await pool.query('COMMIT');
} catch (error) {
    await pool.query('ROLLBACK');
    // Retorna error al cliente
}
```

## Problemas que tuve (y capaz vos también)

- **"Cannot find module"**: Instala las dependencias con `npm install`
- **"Connection refused"**: Asegurate de q MySQL este corriendo
- **Puerto 3000 en uso**: Cambia el PORT en el `.env` a otro número (3001, 3002, etc)
- **Errores de la BD**: Crea la base de datos manualmente si no se crea sola



---


**Grupo Z**

Andrés Agustín García

Daniel Esteban Clementín

Darío Gabriel Arias

Nicolás Ibarra

Valentín Suárez

PD: Tambien tiene la documentacion en c/ endpoint de la extension BRUNO
**Fecha:** 2026 