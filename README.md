# Reto técnico — Gestión de Pedidos de Combustible

**Posición:** Desarrollador Senior Full Stack (.NET o Node.js + React) — Refidomsa
**Tiempo estimado:** ~2 días de trabajo (16 horas aprox.)

**Entrega:** 

 - Fork  este repositorio a tu cuenta personal
 - Pull Request a este repositorio desde el fork: [creating-a-pull-request-from-a-fork](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request-from-a-fork)
 

Gracias por participar. Este reto es intencionalmente simple en requerimientos para que tengas espacio de mostrar **cómo piensas, cómo organizas el código y qué prácticas aplicas**. No buscamos la solución más grande, sino la mejor pensada.

---

## 1. Contexto

Refidomsa vende combustible a distribuidores (estaciones de servicio). Hoy los pedidos llegan por teléfono y correo. Queremos un sistema sencillo donde:

- Los **distribuidores** registran sus pedidos de combustible.
- Los **operadores** de Refidomsa los revisan, los aprueban o rechazan y marcan cuándo se despacharon.

---

## 2. Requerimientos funcionales

### 2.1 Entidades mínimas

| Entidad | Datos mínimos |
| --- | --- |
| Distribuidor | Nombre, RNC, límite de crédito (RD$) |
| Producto | Nombre (Gasolina Premium, Gasolina Regular, Gasoil Óptimo, Gasoil Regular), precio por galón (RD$) |
| Pedido | Distribuidor, fecha de entrega solicitada, líneas (producto + galones), total, estado, fechas de creación y cambio de estado |
| Usuario | Nombre, rol (`Distribuidor` u `Operador`) y, si es distribuidor, a cuál pertenece |

Incluye **datos semilla** (seed): al menos 3 distribuidores, los 4 productos, 2 usuarios distribuidores (de distintos distribuidores) y 1 operador.

### 2.2 Reglas de negocio

1. Un pedido tiene entre 1 y 4 líneas, sin productos repetidos.
2. Cada línea debe tener **mínimo 500 galones**. El pedido completo no puede superar **9,000 galones** (capacidad de un camión).
3. La fecha de entrega debe ser **al menos 24 horas después** de la creación y **no puede ser domingo**.
4. El total del pedido **no puede superar el crédito disponible** del distribuidor.
   Crédito disponible = límite de crédito − total de sus pedidos en estado `Pendiente` o `Aprobado`.
5. Flujo de estados:

   ```
   Pendiente ──► Aprobado ──► Despachado
       │            
       ├──► Rechazado (requiere motivo)
       └──► Cancelado (solo el distribuidor, solo en Pendiente)
   ```

   Cualquier otra transición debe ser rechazada.
6. El precio de cada línea se fija al momento de crear el pedido (si luego cambia el precio del producto, el pedido no cambia).

### 2.3 Permisos

| Acción | Distribuidor | Operador |
| --- | --- | --- |
| Crear pedido | Sí (solo para su distribuidor) | No |
| Ver pedidos | Solo los suyos | Todos |
| Cancelar | Solo los suyos, en `Pendiente` | No |
| Aprobar / Rechazar / Despachar | No | Sí |

La autenticación puede ser simple (por ejemplo, JWT con los usuarios semilla y una contraseña de prueba documentada). **No necesitas** registro de usuarios ni recuperación de contraseña.

### 2.4 Backend (.NET o Node.js)

Elige **una** de las dos opciones:

- **.NET:** .NET 8 o superior (preferible .NET 10 LTS), ASP.NET Core Web API, Entity Framework Core.
- **Node.js:** Node.js 22 LTS o superior, **TypeScript**, con un framework HTTP (Express, Fastify o NestJS) y un ORM o query builder (Prisma o TypeORM).

Para ambas opciones:

- Base de datos relacional: SQL Server o PostgreSQL, contenerizada en Docker o Podman.
- Endpoints mínimos:
  - Iniciar sesión.
  - Listar pedidos con **paginación** y filtros por estado, distribuidor y rango de fechas.
  - Ver detalle de un pedido.
  - Crear pedido.
  - Cambiar estado (aprobar, rechazar, despachar, cancelar).
  - Consultar el crédito disponible de un distribuidor.
  - Listar productos.
- Errores con respuestas consistentes (por ejemplo, `ProblemDetails` / [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457)) y códigos HTTP correctos.
- **Pruebas unitarias obligatorias** sobre las reglas de negocio.

### 2.5 Frontend (React o Next.js)

- Pantalla de inicio de sesión.
- Lista de pedidos con filtros y paginación.
- Formulario para crear pedido: agregar/quitar líneas, ver total y crédito disponible, validaciones con mensajes claros.
- Detalle del pedido con las acciones permitidas según el rol y el estado.
- Mostrar al usuario los errores que devuelve el backend.

No evaluamos diseño gráfico. Una interfaz limpia y usable es suficiente.

---

## 3. Qué debes entregar

Abre un **Pull Request** con:

1. **El código** del backend y del frontend.
2. **`README` de la solución** (puedes reemplazar este o crear `SOLUTION.md`) con:
   - Requisitos y cómo ejecutar todo localmente (idealmente con un solo comando).
   - Cómo correr las pruebas.
   - Usuarios y contraseñas de prueba.
3. **`docs/DECISIONES.md`**: tus principales decisiones de arquitectura y diseño, las alternativas que consideraste y por qué elegiste cada una. Incluye los supuestos que hiciste ante cualquier ambigüedad.
4. **`docs/USO_DE_IA.md`**: cómo usaste herramientas de IA (ver sección 5).
5. **Pendientes y mejoras**: qué harías con más tiempo y qué dejaste fuera a propósito.

---

## 4. Áreas de evaluación

Te compartimos exactamente qué vamos a mirar:

| Área | Peso | Qué valoramos |
| --- | --- | --- |
| Arquitectura y organización | 20% | Separación clara de responsabilidades, dependencias bien dirigidas, estructura fácil de entender. Que la arquitectura sea **proporcional** al problema (sin sobreingeniería ni código desordenado). |
| Reglas de negocio y calidad del backend | 20% | Reglas correctamente implementadas y ubicadas, validaciones, manejo de errores, uso correcto del ORM (EF Core, Prisma, etc.), async, inyección de dependencias o composición equivalente. |
| Pruebas | 15% | Pruebas significativas de las reglas de negocio, casos límite, nombres claros. Valoramos más la calidad que la cantidad. |
| Seguridad | 10% | Autenticación, autorización por recurso (un distribuidor no puede ver ni tocar pedidos de otro), validación de entradas, manejo de secretos. |
| Frontend | 10% | Componentes organizados, manejo de estado y formularios, consumo de API, manejo de errores y estados de carga. |
| Documentación y decisiones | 10% | README útil, decisiones justificadas, supuestos explícitos. |
| Prácticas de ingeniería | 10% | Historial de commits claro y progresivo, código limpio y consistente, facilidad para ejecutar el proyecto. |
| Uso responsable de IA | 5% | Uso transparente y crítico de la IA (ver sección 5). |

Después de la entrega habrá una **sesión de revisión de 45 minutos** donde nos explicarás tu solución y haremos un pequeño cambio en vivo sobre tu código.

---

## 5. Uso de IA

**Puedes usar IA** (Copilot, ChatGPT, Claude, Cursor, etc.). Es una herramienta normal de trabajo. Lo que nos interesa es que **entiendas y puedas defender** todo lo que entregas.

En `docs/USO_DE_IA.md` incluye:

- Qué herramientas usaste y para qué partes.
- Los **prompts más relevantes** (no necesitas todos).
- Al menos **un ejemplo en que la IA se equivocó** o propuso algo que no aceptaste, y qué hiciste.
- Qué decisiones tomaste tú, independientemente de lo que sugirió la IA.

En la sesión de revisión te pediremos explicar cualquier parte del código. Código que no puedas explicar cuenta en contra, sin importar quién lo escribió.

---

## 6. Espacio para destacar (opcional)

Nada de esto es obligatorio. Si te sobra tiempo, elige **lo que mejor muestre tus fortalezas**; preferimos pocas cosas bien hechas que muchas a medias.

- Docker Compose para levantar todo (API, frontend, base de datos).
- Pipeline de CI con GitHub Actions (build + pruebas).
- Pruebas de integración (por ejemplo, `WebApplicationFactory` en .NET, Supertest en Node.js, Testcontainers).
- Pruebas e2e (playwright, TestCafe, etc).
- Control de concurrencia (dos operadores aprobando el mismo pedido, dos pedidos consumiendo el mismo crédito a la vez).
- Historial/auditoría de cambios de estado.
- Logging estructurado, health checks, documentación OpenAPI.
- Idempotencia en la creación de pedidos.
- Una funcionalidad con IA dentro del producto. Si requiere una API key, haz que sea opcional y que el sistema funcione sin ella.

---

## 7. Reglas y recomendaciones

- **Tiempo:** dedica alrededor de 2 días. Si no terminas todo, prioriza y documenta qué quedó pendiente y por qué. Una solución incompleta pero bien razonada vale más que una completa sin criterio.
- **Ambigüedades:** si algo no está claro, toma una decisión razonable y documéntala en `DECISIONES.md`. También puedes escribirnos.
- **Commits:** haz commits pequeños y descriptivos durante el desarrollo. Un único commit con todo el código dificulta entender tu proceso.
- **Secretos:** no subas contraseñas reales, llaves ni cadenas de conexión de producción.
- **Fecha de entrega:** _[completar]_
- **Contacto para dudas:** 
   - Juan Mordan - juan.mordan@refidomsa.com.do
   - Jose Ferreras - jose.ferreras@refidomsa.com.do

¡Éxito, y disfrútalo!
