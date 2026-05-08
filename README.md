# TP Programación 3 - API Clínica 🏥

Bueno, este es mi proyecto final para la materia. Es una API para manejar las especialidades de una clínica. Nada tan complicado pero les enseña lo básico de un CRUD.

## Que hace este codigo?

Básicamente es un servidor que te deja:
- Ver todas las especialidades que hay
- Ver una especialidad específica por su ID
- Crear nuevas especialidades (tipo Cardiología, Dermatología, etc)
- Modificar una especialidad que ya existe
- Borrar una especialidad (aunque mejor no lo hagas sin querer)

Está hecho con **Express** (que es un framework de Node.js), **MySQL** para la base de datos, y librerias

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

3. **Crea el archivo `.env`** en la carpeta principal (la raíz) con esto:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=clinica_db
   ```
   > Nota: Cambia la contraseña si tu MySQL tiene contraseña (la mia no tiene por eso esta vacio)

4. **Corre el servidor**
   ```bash
   npm run dev
   ```
   Te va a decir "Servidor corriendo en http://localhost:3000" si todo anduvo bien.

> **Consejo:** Abre 2 terminales en VS Code - una para que corra el servidor y otra para ir testeando los endpoints. Así ves los logs mientras mandas requests.

## Los endpoints (las URLs)

Básicamente son todas estas:

| Método | URL | Qué hace |
|--------|-----|----------|
| GET | `/api/v1/especialidades` | Trae todas las especialidades |
| GET | `/api/v1/especialidades/:id` | Trae una especialidad específica (reemplazá :id con un número) |
| POST | `/api/v1/especialidades` | Crea una nueva especialidad |
| PUT | `/api/v1/especialidades/:id` | Modifica una especialidad existente |
| DELETE | `/api/v1/especialidades/:id` | Borra una especialidad |

### Validaciones que tiene

Ahora el código está validando las cosas:
- **El nombre**: Tiene que estar, ser texto, y no puede tener mas de 120 caracteres
- **El nombre** no puede repetirse: no se permiten especialidades con el mismo nombre
- **El ID**: Tiene que ser un número positivo (no puede ser 0 o negativo)

Si mandas algo incorrecto, te va a devolver un error 400 con los detalles de qué está mal. Si intentas crear o cambiar una especialidad con un nombre que ya existe, te va a devolver 409.

### Códigos de respuesta HTTP


| Código | Significa |
|--------|-----------|
| **200** | Está todo bien |
| **201** | Se creó algo nuevo exitosamente |
| **400** | Mandaste datos inválidos o malformados |
| **404** | No existe (ej: ID q no existe) |
| **500** | Error del servidor (algo roto) |

### Ejemplos de uso

Si usas **Postman** (que es lo más fácil):

- **GET** todas: `http://localhost:3000/api/v1/especialidades`
- **GET** una: `http://localhost:3000/api/v1/especialidades/1`
- **POST** nueva: 
  ```json
  {
    "nombre": "Cardiología"
  }
  ```

### Soft Delete (???

IMPORTANTE: cuando "eliminas" una especialidad, en realidad no se borra de la base de datos. Se marca como inactiva (soft delete). Esto está bien porque así no pierdes datos si alguien accidentalmente borra algo importante. Está en el código pero la BD se encarga de eso internamente.

## Estructura del proyecto

```
├── src/
│   ├── app.js (el servidor principal)
│   ├── db.js (la conexión a la BD)
│   ├── controllers/ (la lógica de cada cosa)
│   ├── models/ (cómo se estructura la data)
│   └── routes/ (los endpoints)
├── package.json
└── README.md (este archivo)
```

## Tecnologías que usé

- **Node.js** - runtime de JavaScript
- **Express** - framework para hacer servidores
- **MySQL** - base de datos
- **Nodemon** - para que reinicie solo cuando cambio código
- **Express-validator** - para validar que la data sea correcta
- **Cors** - para que otras aplicaciones puedan usar la API
- **Morgan** - para ver los logs bonitos en la terminal

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