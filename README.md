# Woow Technology — Prueba Full Stack

Aplicación full stack desarrollada como **prueba técnica** para **Woow Technology**. Incluye API REST con autenticación JWT, gestión de usuarios y cliente web con rutas protegidas y roles (USER/ADMIN).

---

## Descripción

Monorepo con **backend** (Node.js + Express + Prisma + PostgreSQL) y **frontend** (React 18 + Vite + TypeScript + Tailwind CSS). El backend expone una API versionada (`/api/v1`) con registro, login, perfil de usuario y listado de usuarios (solo ADMIN). El frontend consume la API mediante React Query y un contexto de autenticación, con formularios validados y rutas públicas/protegidas.

---

## Stack tecnológico


| Capa         | Tecnologías                                                                          |
| ------------ | ------------------------------------------------------------------------------------ |
| **Backend**  | Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, bcrypt, express-validator     |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, React Router, React Query, React Hook Form |
| **Testing**  | Backend: Jest + Supertest — Frontend: Vitest + React Testing Library                 |
| **Infra**    | Docker, Docker Compose                                                               |


---

## Requisitos previos

- **Node.js** 18+ (recomendado LTS)
- **Docker** y **Docker Compose** (para ejecutar con base de datos y servicios en contenedores)
- **PostgreSQL** 17 (si se ejecuta sin Docker)

---

## Configuración y ejecución

### 1. Variables de entorno

**Todas las variables indicadas abajo son obligatorias** para que la aplicación arranque y funcione correctamente (incluido el seed del usuario admin). Si falta alguna, el backend no iniciará o fallará al crear el usuario inicial.

Al arrancar, el backend ejecuta un **validador de variables de entorno** que comprueba que las requeridas estén definidas y sean válidas. Si falta alguna o no cumple el formato, en la **consola** se mostrará el error indicando la falla; la API **nunca llega a iniciar** (no abre el puerto) hasta que todas las variables estén correctas. Revisa la salida del terminal para corregir la configuración.

En la **raíz del proyecto** crea un archivo `.env.docker` (usado por Docker Compose) con:

```env
# Base de datos
POSTGRES_DB=woow_db
POSTGRES_USER=woow_user
POSTGRES_PASSWORD=tu_password_seguro

# Backend (DATABASE_URL para Prisma; el host debe ser "db" dentro de Docker)
DATABASE_URL=postgresql://woow_user:tu_password_seguro@db:5432/woow_db?schema=public
JWT_SECRET=tu_jwt_secret_largo_y_seguro
PORT=4000
NODE_ENV=development

# Datos del Usuario Admin inicial (obligatorios)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Admin
ADMIN_LASTNAME=User
ADMIN_DOCUMENT=12345678
ADMIN_PHONE=1234567890
ADMIN_LANG=es
```

Si no se define `PORT`, el backend usa por defecto el puerto **8081** (en los ejemplos se usa 4000).

Para desarrollo **local sin Docker**, en `backend/` copia `.env.example` a `.env` y **rellena todas las variables** (por ejemplo `DATABASE_URL` con `localhost:5432`). Con esto queda explícito que las variables de entorno son obligatorias para que todo funcione al levantar la aplicación.

### 2. Ejecución con Docker (recomendado)

Desde la raíz del repositorio:

- **Desarrollo (hot reload):** `docker compose up --build`
- **Producción:** `docker compose -f docker-compose.prod.yml up --build`

```bash
docker compose up --build
```

- **API:** [http://localhost:4000](http://localhost:4000)  
- **Frontend:** [http://localhost:5173](http://localhost:5173)  
- **PostgreSQL:** puerto 5432 (acceso solo desde red Docker por defecto)

Al levantar, el backend aplica migraciones de Prisma y ejecuta el seed del usuario admin; para que el seed funcione deben estar definidas en `.env.docker` todas las variables de admin (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `ADMIN_LASTNAME`, `ADMIN_DOCUMENT`, `ADMIN_PHONE`, `ADMIN_LANG`).

### 3. Ejecución local (sin Docker)

**Backend**

```bash
cd backend
cp .env.example .env
# Rellena todas las variables obligatorias (DATABASE_URL, JWT_SECRET, admin, etc.)
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

**Frontend** (en otra terminal)

```bash
cd frontend
cp .env.example .env
# Opcional: VITE_API_URL si la API no está en localhost:4000
npm install
npm run dev
```

---

## Scripts principales

### Backend (`backend/`)


| Script                   | Descripción                             |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Servidor en modo desarrollo con recarga |
| `npm run build`          | Compila TypeScript a `dist/`            |
| `npm start`              | Ejecuta la app compilada                |
| `npm test`               | Tests con Jest                          |
| `npm run test:coverage`  | Tests con reporte de cobertura          |
| `npx prisma migrate dev` | Crea/aplica migraciones                 |


### Frontend (`frontend/`)


| Script                  | Descripción                 |
| ----------------------- | --------------------------- |
| `npm run dev`           | Servidor de desarrollo Vite |
| `npm run build`         | Build de producción         |
| `npm run preview`       | Vista previa del build      |
| `npm test`              | Tests con Vitest            |
| `npm run test:coverage` | Tests con cobertura         |


---

## Estructura del proyecto

```
woow-test/
├── backend/                 # API Express + Prisma
│   ├── prisma/
│   │   └── schema.prisma    # Modelo de datos y migraciones
│   ├── src/
│   │   ├── index.ts         # Entrada y montaje de rutas
│   │   ├── config/          # Validación de variables de entorno
│   │   ├── v1/routes/       # Definición de rutas /api/v1
│   │   ├── midlewares/      # Validación de body/query, manejo de errores, auth JWT, roles
│   │   ├── modules/         # Lógica por dominio (cada módulo contiene):
│   │   │   ├── auth/        # Controller (HTTP), service (lógica login/registro), dtos (validación)
│   │   │   └── users/       # Controller, service, repository (acceso a BD), dtos, seed inicial
│   │   ├── models/          # Interfaces y tipos compartidos (p. ej. request extendido)
│   │   ├── utils/           # Helpers (contraseñas, JWT, idioma, traducciones)
│   │   ├── constants/       # Textos traducidos y plantillas (mails, mensajes)
│   │   └── prisma/          # Cliente Prisma
│   └── package.json
├── frontend/                # Cliente React
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── Routes.tsx
│   │   ├── context/         # Estado global de autenticación
│   │   ├── pages/           # Vistas (login, registro, perfil, listado usuarios)
│   │   ├── components/      # Rutas protegidas/públicas, layout, formularios, tabla usuarios, UI
│   │   ├── hooks/           # Llamadas API (mutations, queries) y lógica de UI (filtros, tabla)
│   │   ├── services/        # Cliente HTTP y llamadas a la API
│   │   ├── config/          # Instancia de axios y configuración base
│   │   ├── i18n/            # Configuración de idiomas y traducciones
│   │   ├── schemas/         # Esquemas de validación de formularios
│   │   ├── utils/           # Utilidades (filtros, etc.)
│   │   └── icons/           # Iconos reutilizables
│   └── package.json
├── docker-compose.yml       # Desarrollo (db + backend + frontend)
├── docker-compose.prod.yml  # Producción (si aplica)
└── README.md
```

---

## API (resumen)

- **POST** `/api/v1/auth/register` — Registro (name, lastname, email, password, document, phone, lang opcional). Respuesta: `{ message }`.
- **POST** `/api/v1/auth/login` — Login; devuelve `{ jwt: token }`.
- **GET** `/api/v1/users/me` — Perfil del usuario autenticado.
- **PUT** `/api/v1/users/me` — Actualizar perfil.
- **GET** `/api/v1/users` — Listado de usuarios (solo rol **ADMIN**).

### Endpoints disponibles con ejemplos

Ejemplos con **axios** (como en el frontend). Base URL: `http://localhost:4000` (o el `PORT` configurado).

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1';
```

**Registro**

```javascript
const { data } = await axios.post(`${API_URL}/auth/register`, {
  user: {
    name: 'Juan',
    lastname: 'Pérez',
    email: 'juan@example.com',
    password: 'MiClave123',
    document: '12345678',
    phone: '9876543210',
    lang: 'es',
  },
});
// Devuelve (200): { message: string }
```

**Login**

```javascript
const { data } = await axios.post(`${API_URL}/auth/login`, {
  user: {
    email: 'juan@example.com',
    password: 'MiClave123',
  },
});
// Devuelve (200): { jwt: string }
// Usa data.jwt en el header Authorization: `Bearer ${data.jwt}` para las rutas protegidas.
```

**Perfil (GET)** — requiere token

```javascript
const token = 'TU_JWT_AQUI';
const { data } = await axios.get(`${API_URL}/users/me`, {
  headers: { Authorization: `Bearer ${token}` },
});
// Devuelve (200): { user: { id, name, lastname, email, document, phone, lang, role, createdAt, updatedAt } }
```

**Actualizar perfil (PUT)** — requiere token

```javascript
const token = 'TU_JWT_AQUI';
const { data } = await axios.put(
  `${API_URL}/users/me`,
  {
    user: {
      name: 'Juan',
      lastname: 'García',
      document: '87654321',
      phone: '1234567890',
      lang: 'en',
    },
  },
  { headers: { Authorization: `Bearer ${token}` } }
);
// Devuelve (200): { message: string }
```

**Listado de usuarios** — requiere token y rol **ADMIN**. Query opcionales: `page`, `pageSize`, `name`, `document`, `phone`.

```javascript
const token = 'TU_JWT_ADMIN';
const { data } = await axios.get(`${API_URL}/users`, {
  params: { page: 1, pageSize: 10 },
  headers: { Authorization: `Bearer ${token}` },
});
// Devuelve (200): { users: User[], itemsTotal: number, page: number, totalPage: number, prevPage?: number, nextPage?: number }
// Cada User: { id, name, lastname, email, document, phone, lang, role, createdAt, updatedAt }
```

---

## Testing

- **Backend:** Jest + Supertest; tests de repositorios, servicios, controladores y validadores.
- **Frontend:** Vitest + React Testing Library; tests de contexto de autenticación, páginas, componentes y utilidades.

Ejecutar tests con cobertura:

```bash
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```

---

## Licencia

ISC (según `package.json` del backend). Prueba técnica para Woow Technology.