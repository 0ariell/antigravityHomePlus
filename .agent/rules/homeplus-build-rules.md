---
trigger: always_on
---

# PRIME DIRECTIVE — Vibe + Solidez (Multi-Agent)

Objetivo: maximizar velocidad de desarrollo sin degradar arquitectura. Cambios atómicos, explicables y no destructivos.

## 1) Arquitectura (Backbone)
### 1.1 Separación estricta de responsabilidades (SoC)
- **UI**: solo render y eventos. No contiene lógica de negocio ni acceso a datos.
- **Aplicación (UseCases / Services)**: lógica de negocio. No conoce UI.
- **Infra (Adapters / Repos / Clients)**: I/O (HTTP, DB, storage, APIs). No contiene reglas de negocio.

**Regla práctica**: si un archivo mezcla UI + llamadas HTTP + reglas, está mal.

### 1.2 Contratos y tipos
- Los **DTOs/Contracts** viven en `src/contracts/` (o `domain/contracts/`).
- La UI consume **ViewModels** definidos por la capa de aplicación (`src/app/view-models/`), no DTOs crudos.

### 1.3 Inmutabilidad por defecto
- Tratar datos como inmutables. Prohibido mutar arrays/objetos recibidos como input.
- Preferir `map/filter/reduce`, spreads y estructuras nuevas.

## 2) Dependencias (Agnosticismo)
### 2.1 Wrappers obligatorios (para evitar lock-in)
Toda integración con estas áreas va detrás de una interfaz:
- HTTP / Networking (`src/infra/http/`)
- Storage / Cache (`src/infra/storage/`)
- Auth (`src/infra/auth/`)
- Analytics / Logging (`src/infra/telemetry/`)
- Payments (`src/infra/payments/`)
- Dates & Timezones (`src/infra/datetime/`)
- Realtime/WebSockets (`src/infra/realtime/`)

Wrappers opcionales:
- Librerías de UI si quedan aisladas dentro de componentes reutilizables.

## 3) Protocolo Multi-Agente (Context Conservation)
### 3.1 Chesterton’s Fence
Antes de eliminar o refactorizar código existente:
1) Explicar por qué existe.
2) Identificar dependencias (imports/usos/side effects).
3) Recién ahí modificar.

### 3.2 Cambios atómicos
- Cada entrega debe **compilar** y ser **ejecutable**.
- Prohibido dejar TODOs críticos o funciones incompletas.
- Si falta info, implementar fallback seguro + error explícito.

### 3.3 Early Return
Evitar anidamiento. Validar condiciones negativas primero y retornar.

### 3.4 Errores
- Nunca silenciar errores.
- Si no se maneja localmente, propagar a la capa que muestra feedback al usuario.

## 4) UI/UX (Atomic Vibe)
### 4.1 Tokens obligatorios
- Prohibido hardcodear colores/spacing/tamaños.
- Usar tokens semánticos: `Colors.*`, `Spacing.*`, `Typography.*`, etc.
- Tokens viven en `src/ui/tokens/`.

### 4.2 Componentización
- Si un bloque visual se repite o supera ~20 líneas: extraer componente.
- Componentes deben soportar: Loading, Error, Empty, Overflow.

## 5) Entrega (Output Contract)
- Entregar cambios como:
  - **Diff (+/−)** o **archivos completos** según se pida.
  - Checklist final: `lint`, `test`, `build` (o justificar si no aplica).
- No cambios destructivos (migraciones masivas) salvo pedido explícito.


----------------------

# Project Reference
El agente debe usar como fuente de verdad:
- docs/specs/homeplus-mvp.md
Si hay conflicto, prevalece la spec de HomePlus.