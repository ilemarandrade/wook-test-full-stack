# Decisiones de diseño y técnicas

## 1. ¿Por qué elegí esas librerías?

Elegí **Express con TypeScript** porque me da una base estable y tipado en toda la API. Para la base de datos usé **Prisma**: el modelo queda en código, las migraciones están versionadas y evito SQL manual, lo que reduce el riesgo de inyección. Para autenticación usé **JWT y bcrypt**, para un manejo seguro de la session de usuario. En el backend usé **express-validator** para validar en la capa HTTP, tener mensajes claros y poder mapear fácil a DTOs.

En el frontend usé **React con React Query** para manejar cache, loading y errores sin tanto estado manual. Para formularios elegí **React Hook Form con Joi** para tener validación alineada con esquemas. Para estilos usé **Tailwind** para iterar rápido sin salir del HTML. En conjunto seguí el stack indicado en la prueba porque es el que usaría en un proyecto real de este tamaño.

---

## 2. ¿Qué desafíos enfrenté?

No tuve dificultades técnicas fuertes porque me siento cómodo con el stack; lo que sí hice fueron **decisiones de diseño**. Opté por una **estructura por módulos** (`modules/auth` y `modules/users`) en lugar de carpetas planas (`controllers/`, `services/` globales) para tener mejor cohesión por dominio y que sea más fácil escalar.. Decidí **versionar la API** desde el inicio (`/api/v1`) para poder evolucionar sin romper clientes. El **seed del admin** lo dejé dependiente de variables de entorno para no hardcodear credenciales y que funcione igual en Docker y en local.

---

## 3. ¿Qué mejoraría con más tiempo?

Con más tiempo priorizaría lo siguiente:

- **Husky + ESLint** en pre-commit para no subir código que rompa reglas o tests y tener una capa extra de consistencia y seguridad.
- **CI/CD** (por ejemplo GitHub Actions o GitLab CI) para que los tests validen cada cambio y los despliegues sean controlados.
- **Cypress** (u otra herramienta similar) para pruebas E2E de los flujos críticos: login, registro, edición de perfil y listado de admin.
- **Swagger/OpenAPI** para documentar los endpoints con ejemplos y poder probar la API desde el navegador.
- **Refresh tokens** para alargar la sesión sin depender solo de un JWT corto en localStorage.

---

## 4. ¿Cómo escalaría esta solución?

Seguiría el mismo patrón por dominio: **controller → service → repository** para cada módulo nuevo (auth, users, y en el futuro otros como orders, etc.). La API ya está versionada con `/api/v1`; cuando hiciera cambios incompatibles expondría `/api/v2` sin romper a los clientes actuales. Si creciera el tráfico, añadiría **caché** (por ejemplo Redis) para sesiones o respuestas pesadas, y **colas** para trabajos pesados.