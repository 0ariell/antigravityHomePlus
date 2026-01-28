# HomePlus — Especificación Técnica (MVP)

## 1. Visión general del proyecto

### 1.1 Descripción
HomePlus es una plataforma web que conecta **clientes** con **oficiantes** (plomería, electricidad, pintura, etc.) para solicitar servicios, coordinar presupuestos y ejecutar trabajos con seguimiento. La prioridad es **calidad, transparencia y confianza**.

### 1.2 Objetivos
- Permitir a un cliente **encontrar** oficiantes relevantes rápidamente.
- Facilitar **reserva/solicitud**, **chat**, y **seguimiento** del trabajo.
- Implementar un sistema de **reputación** basado en calidad/actividad (no pago).
- Sentar bases para **escrow/pagos** sin bloquear el MVP.

### 1.3 Alcance
Incluido en MVP:
- Autenticación y perfiles (cliente/oficiante).
- Catálogo de servicios (publicación y edición por oficiantes).
- Búsqueda y ranking imparcial (calidad + actividad).
- Solicitud/reserva (booking) con estados.
- Chat por reserva (conversación + mensajes).
- Reviews post-servicio (vinculado a booking).
- Notificaciones básicas (in-app).
- Moderación mínima (bloqueo lógico, denuncias básicas).

Fuera de alcance inicial:
- Escrow completo con retención/liberación automática.
- KYC/validación oficial de matrícula vía API.
- Seguros/garantías integradas.
- Multi-región avanzada / multi-tenant.
- Recomendador ML / matching inteligente.

---

## 2. Requerimientos funcionales

### 2.1 Autenticación y usuarios
**RF-001: Registro**
- Registro con email y contraseña.
- Selección de rol: `CLIENT` / `PROVIDER`.
- Validaciones: email válido, contraseña fuerte.
- Creación de perfil y datos mínimos.

**RF-002: Login / JWT**
- Login por email/contraseña.
- Retorno de JWT + refresh si aplica.
- Sesión persistente (según cliente).

**RF-003: Logout**
- Logout global.
- Invalidación de sesión (client-side) y revocación si aplica.

**RF-004: Perfil**
- Cliente: datos básicos, dirección aproximada (no exacta obligatoria), preferencias.
- Oficiante: datos básicos, bio, zona de trabajo, oficios, certificaciones (si aplica), fotos/portfolio (opcional).
- Edición de perfil con validaciones.

**RF-005: Protección de rutas**
- Rutas privadas requieren JWT.
- Rutas restringidas por rol (ej: crear servicio solo provider).

---

### 2.2 Servicios (publicación por oficiante)
**RF-006: Crear servicio**
- Provider crea un “Service” con: título, descripción, categoría/oficio, zona, precio base (opcional), fotos.
- Estado `isActive` y soft delete.

**RF-007: Editar / Pausar servicio**
- Solo el owner puede editar.
- Pausar = `isActive=false`.

**RF-008: Listado público**
- Listado por categoría, zona, y filtros básicos.
- Detalle de service con rating promedio + contador de reviews.

---

### 2.3 Búsqueda y ranking (imparcial)
**RF-009: Búsqueda**
- Endpoint `GET /search` con filtros: categoría, zona, fecha/urgencia (opcional), rating mínimo, etc.

**RF-010: Ranking**
- Ordenamiento basado en:
  - **Calidad**: rating + reviews válidas (post-booking).
  - **Actividad**: consistencia de respuesta, completitud de perfil, tasa de cumplimiento.
- Prohibido ranking por pago (“boost” no afecta orden orgánico).

> Nota: si existiera “boost” en el futuro, debe ser **sección separada** (“Patrocinados”) y claramente etiquetada.

---

### 2.4 Reservas/Solicitudes (Booking)
**RF-011: Crear booking**
- Cliente crea un booking sobre un service:
  - descripción del problema, fotos, fecha preferida, dirección aproximada, notas.
- Estado inicial: `PENDING`.

**RF-012: Gestión de estados**
- Estados mínimos:
  - `PENDING` (creado por cliente)
  - `ACCEPTED` (aceptado por provider)
  - `REJECTED` (rechazado por provider)
  - `IN_PROGRESS`
  - `COMPLETED`
  - `CANCELLED`
- Reglas:
  - Cliente puede cancelar en `PENDING/ACCEPTED` con confirmación.
  - Provider puede marcar `IN_PROGRESS` y `COMPLETED`.
  - Ningún usuario puede editar bookings ajenos.

**RF-013: Listados**
- Cliente: ver sus bookings.
- Provider: ver bookings que le corresponden.

---

### 2.5 Chat y mensajería (por booking)
**RF-014: Conversación**
- Una conversación por booking.
- Participantes: cliente y provider del booking.

**RF-015: Mensajes**
- Texto + adjuntos básicos (imagen).
- Indicadores: enviado/recibido/fecha.
- Seguridad: solo participantes pueden leer.

**RF-016: Realtime**
- WebSocket (Socket.IO) con eventos: `newMessage`, `typing` (opcional), `readReceipts` (fase 2).

---

### 2.6 Reviews (reputación)
**RF-017: Crear review**
- Solo cliente puede dejar review.
- Solo si booking está `COMPLETED`.
- Review: rating 1–5, comentario opcional.

**RF-018: Integración con ranking**
- Reviews se agregan al perfil del provider y al service.

---

### 2.7 Pagos / Escrow (MVP “thin slice”)
**RF-019: Payment Intent (base)**
- Endpoint `POST /payments/create-intent` (Stripe/MercadoPago según implementación).
- Permite crear intención de pago asociada a booking.

**RF-020: Webhooks (base)**
- Endpoint para eventos del proveedor de pago.
- En MVP: registrar evento y actualizar estado de payment en DB.

> Escrow completo (retención/liberación) queda para fase posterior; acá solo el “esqueleto” estable.

---

### 2.8 Notificaciones
**RF-021: Notificaciones in-app**
- Crear notificaciones por eventos clave: booking aceptado, nuevo mensaje, booking completado.
- Listado y marcar como leído.

---

## 3. Requerimientos no funcionales

### 3.1 Usabilidad
- Mobile-first, responsive.
- Feedback inmediato (loading/error/success).
- Flujos simples: buscar → solicitar → chatear → completar → review.

### 3.2 Rendimiento
- Búsqueda paginada y cacheada.
- Indexación DB (category, location, providerId, rating).
- WebSocket eficiente (rooms por conversación).

### 3.3 Seguridad y confianza
- JWT + guards por rol.
- Validación server-side (DTOs).
- Rate limiting básico.
- Soft delete y auditoría mínima (timestamps).
- Logs de eventos críticos (payments, cambios de estado).

### 3.4 Escalabilidad
- Diseño modular por dominio.
- Wrappers para dependencias externas (payments, storage, notifications).

---

## 4. Arquitectura técnica (alineada a stack HomePlus)

### 4.1 Stack
- Backend: NestJS + TypeScript
- ORM: Prisma
- DB: PostgreSQL
- Auth: JWT + Guards
- Realtime: Socket.IO (Gateway Nest)
- Deploy: Docker + CI/CD

### 4.2 Módulos (dominio)
`/auth`, `/users`, `/services`, `/booking`, `/conversation`, `/message`, `/review`, `/payment`, `/notification`.

### 4.3 Modelo de datos (alto nivel)
- User (roles)
- Service (providerId, category, isActive)
- Booking (clientId, providerId, serviceId, status)
- Conversation (bookingId)
- Message (conversationId, senderId)
- Review (bookingId, providerId)
- Payment (bookingId, providerId, status, providerRef)
- Notification (userId, type, readAt)

---

## 5. Criterios de aceptación MVP
- Cliente puede registrarse, buscar, ver servicios y crear booking.
- Provider puede aceptar booking y chatear.
- Chat funciona en tiempo real.
- Provider puede completar booking.
- Cliente puede dejar review; ranking se actualiza.
- Seguridad: nadie accede datos ajenos.
- Logs/errores no se silencian.

---

## 6. Guía de implementación (orden sugerido)
1) Auth + Users (roles + “me”).
2) Services (CRUD provider + list público).
3) Service Requests (General vs Direct) + Quotes logic.
4) Booking (Resulting from Accepted Quote).
5) Conversation/Message (REST + WebSocket).
6) Review (post-completed).
7) Notifications.
8) Payment “thin slice” (intent + webhook).

---

## 2. Requerimientos funcionales (ACTUALIZADO - Request & Quote Flow)

### 2.4 Solicitudes (Service Requests)
**RF-011: Crear Solicitud (Unified Request)**
- El cliente puede crear una solicitud ("Request") describiendo:
  - Título, Descripción, Fotos, Categoría.
  - Zona y Preferencia de Fecha.
- **Tipos de Solicitud**:
  - **General (Open)**: No tiene destinatario específico. Se visible para todos los providers de la zona/categoría.
  - **Directa**: Se crea desde el perfil de un provider específico (`targetProviderId`). Solo visible para ese provider.
- Estado inicial: `OPEN`.

**RF-012: Visualización para Providers**
- Dashboard Provider tiene dos pestañas/secciones:
  1. **Solicitudes Directas**: Peticiones enviadas específicamente a él.
  2. **Solicitudes Generales**: Peticiones abiertas en su zona/categoría ("Oportunidades").
- El detalle de la solicitud muestra la misma información en ambos casos.

### 2.5 Presupuestos (Quotes)
**RF-013: Enviar Presupuesto**
- Provider visualiza una Solicitud (Directa o General) y puede:
  - **Cotizar (Quote)**: Envia precio estimado y tiempo/comentarios.
  - **Rechazar**: (Solo aplica a Directas, para limpiar el inbox).
- Al cotizar, se crea un objeto `Quote`.

**RF-014: Selección por Cliente**
- Cliente ve su solicitud y lista de `Quotes` recibidas.
- Cada Quote muestra: Precio, Comentario, Perfil del Provider (Rating, Reviews).
- Cliente **ACEPTA** una Quote.
  - Esto dispara la creación del **Booking** confirmado (`ACCEPTED`).
  - La Solicitud pasa a estado `CLOSED`.

### 2.6 Reservas Finales (Bookings)
**RF-015: Gestión de Trabajo**
- Una vez aceptada la Quote, se crea el Booking.
- Estados del Booking: `ACCEPTED` -> `IN_PROGRESS` -> `COMPLETED`.
- Chat habilitado solo para Booking activo (o fase de negociación previa si se decide, MVP: post-booking).

---
