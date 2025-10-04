# 📊 Documentación de Base de Datos - Well Wizards SaaS

## 🏗️ Arquitectura General

Este documento describe la estructura completa de la base de datos PostgreSQL para el sistema Well Wizards SaaS, incluyendo todas las tablas, campos obligatorios, relaciones y constraints.

## 📋 Índice de Tablas

1. [User](#user) - Usuarios del sistema
2. [Account](#account) - Cuentas de autenticación (NextAuth)
3. [Session](#session) - Sesiones de usuario (NextAuth)
4. [VerificationToken](#verificationtoken) - Tokens de verificación (NextAuth)
5. [Client](#client) - Clientes/Empresas
6. [Contract](#contract) - Contratos de perforación
7. [Field](#field) - Campos petrolíferos
8. [Well](#well) - Pozos de petróleo/gas
9. [DrillingPlan](#drillingplan) - Plan de perforación
10. [DrillingData](#drillingdata) - Datos reales de perforación
11. [ProductionData](#productiondata) - Datos de producción
12. [ContractActivity](#contractactivity) - Actividades del contrato
13. [Report](#report) - Reportes generados

---

## 📝 Detalle de Tablas

### User
**Propósito**: Gestión de usuarios del sistema con autenticación y roles.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único del usuario |
| `name` | String | ❌ | null | Nombre completo del usuario |
| `email` | String | ✅ | - | Email único para login |
| `password` | String | ✅ | - | Password hasheado |
| `emailVerified` | DateTime | ❌ | null | Fecha de verificación de email |
| `image` | String | ❌ | null | URL de avatar/foto |
| `role` | String | ❌ | "user" | Rol: admin, user, viewer |
| `createdAt` | DateTime | ✅ | now() | Fecha de creación |
| `updatedAt` | DateTime | ✅ | auto | Fecha de actualización |

**Constraints**:
- `email` debe ser único
- `role` valores permitidos: admin, user, viewer

**Relaciones**:
- `accounts[]` → Account (1:N)
- `sessions[]` → Session (1:N)
- `wells[]` → Well (1:N)
- `contracts[]` → Contract (1:N)
- `reports[]` → Report (1:N)

---

### Account
**Propósito**: Cuentas de autenticación externa (NextAuth.js - OAuth providers).

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único de la cuenta |
| `userId` | String | ✅ | - | FK hacia User |
| `type` | String | ✅ | - | Tipo de cuenta (oauth, email) |
| `provider` | String | ✅ | - | Proveedor (google, github, etc.) |
| `providerAccountId` | String | ✅ | - | ID en el proveedor |
| `refresh_token` | String | ❌ | null | Token de refresco |
| `access_token` | String | ❌ | null | Token de acceso |
| `expires_at` | Int | ❌ | null | Timestamp de expiración |
| `token_type` | String | ❌ | null | Tipo de token |
| `scope` | String | ❌ | null | Alcance del token |
| `id_token` | String | ❌ | null | ID token |
| `session_state` | String | ❌ | null | Estado de sesión |

**Constraints**:
- `[provider, providerAccountId]` debe ser único
- FK: `userId` → User.id (CASCADE)

---

### Session
**Propósito**: Sesiones activas de usuarios (NextAuth.js).

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único de sesión |
| `sessionToken` | String | ✅ | - | Token único de sesión |
| `userId` | String | ✅ | - | FK hacia User |
| `expires` | DateTime | ✅ | - | Fecha de expiración |

**Constraints**:
- `sessionToken` debe ser único
- FK: `userId` → User.id (CASCADE)

---

### VerificationToken
**Propósito**: Tokens para verificación de email y reset de password.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `identifier` | String | ✅ | - | Identificador (email) |
| `token` | String | ✅ | - | Token único |
| `expires` | DateTime | ✅ | - | Fecha de expiración |

**Constraints**:
- `token` debe ser único
- `[identifier, token]` debe ser único

---

### Client
**Propósito**: Empresas clientes que contratan servicios de perforación.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único del cliente |
| `name` | String | ✅ | - | Nombre de la empresa |
| `email` | String | ❌ | null | Email de contacto |
| `phone` | String | ❌ | null | Teléfono de contacto |
| `address` | String | ❌ | null | Dirección física |
| `logo` | String | ❌ | null | URL del logo |
| `contactName` | String | ❌ | null | Nombre del contacto |
| `contactEmail` | String | ❌ | null | Email del contacto |
| `contactPhone` | String | ❌ | null | Teléfono del contacto |
| `createdAt` | DateTime | ✅ | now() | Fecha de creación |
| `updatedAt` | DateTime | ✅ | auto | Fecha de actualización |

**Relaciones**:
- `contracts[]` → Contract (1:N)

---

### Contract
**Propósito**: Contratos de perforación entre cliente y empresa.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único del contrato |
| `name` | String | ✅ | - | Nombre del contrato |
| `description` | String | ❌ | null | Descripción detallada |
| `startDate` | DateTime | ✅ | - | Fecha de inicio |
| `endDate` | DateTime | ✅ | - | Fecha de finalización |
| `value` | Float | ✅ | - | Valor monetario del contrato |
| `currency` | String | ❌ | "USD" | Moneda del contrato |
| `status` | String | ❌ | "active" | Estado del contrato |
| `conditions` | String | ❌ | null | Condiciones especiales |
| `terms` | String | ❌ | null | Términos y condiciones |
| `logo` | String | ❌ | null | Logo específico |
| `contractType` | String | ❌ | "drilling" | Tipo de contrato |
| `drillingConfig` | String | ❌ | null | Configuración JSON |
| `targetDepth` | Float | ❌ | null | Profundidad objetivo (m) |
| `expectedDays` | Int | ❌ | null | Días esperados |
| `dailyRate` | Float | ❌ | null | Tarifa diaria |
| `bonusStructure` | String | ❌ | null | Estructura de bonos |
| `clientId` | String | ✅ | - | FK hacia Client |
| `userId` | String | ✅ | - | FK hacia User responsable |
| `createdAt` | DateTime | ✅ | now() | Fecha de creación |
| `updatedAt` | DateTime | ✅ | auto | Fecha de actualización |

**Constraints**:
- `status` valores: active, completed, cancelled, suspended
- `contractType` valores: drilling, completion, workover
- FK: `clientId` → Client.id (CASCADE)
- FK: `userId` → User.id (CASCADE)

**Relaciones**:
- `client` → Client (N:1)
- `user` → User (N:1)
- `fields[]` → Field (1:N)
- `activities[]` → ContractActivity (1:N)

---

### Field
**Propósito**: Campos petrolíferos donde se ubican los pozos.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único del campo |
| `name` | String | ✅ | - | Nombre del campo |
| `location` | String | ✅ | - | Ubicación geográfica |
| `description` | String | ❌ | null | Descripción del campo |
| `latitude` | Float | ❌ | null | Coordenada latitud |
| `longitude` | Float | ❌ | null | Coordenada longitud |
| `contractId` | String | ✅ | - | FK hacia Contract |
| `createdAt` | DateTime | ✅ | now() | Fecha de creación |
| `updatedAt` | DateTime | ✅ | auto | Fecha de actualización |

**Constraints**:
- FK: `contractId` → Contract.id (CASCADE)

**Relaciones**:
- `contract` → Contract (N:1)
- `wells[]` → Well (1:N)

---

### Well
**Propósito**: Pozos de petróleo/gas con información técnica completa.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único del pozo |
| `name` | String | ✅ | - | Nombre del pozo |
| `location` | String | ✅ | - | Ubicación del pozo |
| `status` | String | ❌ | "active" | Estado del pozo |
| `production` | Float | ❌ | 0 | Producción actual |
| `pressure` | Float | ❌ | 0 | Presión actual (psi) |
| `temperature` | Float | ❌ | 0 | Temperatura actual (°F) |
| `lastMaintenance` | DateTime | ❌ | null | Último mantenimiento |
| `depth` | Float | ❌ | null | Profundidad total (m) |
| `diameter` | Float | ❌ | null | Diámetro (pulgadas) |
| `wellType` | String | ❌ | null | Tipo: vertical, horizontal, direccional |
| `latitude` | Float | ❌ | null | Coordenada latitud |
| `longitude` | Float | ❌ | null | Coordenada longitud |

**Campos Técnicos Avanzados**:
| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `formation` | String | ❌ | null | Formación geológica |
| `holeSection` | String | ❌ | null | Sección: surface, intermediate, production |
| `operation` | String | ❌ | null | Operación: drilling, completion, testing, production |
| `mudType` | String | ❌ | null | Tipo de lodo |
| `mudDensity` | Float | ❌ | null | Densidad del lodo (ppg) |
| `casingSize` | String | ❌ | null | Tamaño de casing |
| `drillPipeSize` | String | ❌ | null | Tamaño de drill pipe |
| `bitType` | String | ❌ | null | Tipo de broca |
| `bitSize` | Float | ❌ | null | Tamaño de broca (pulgadas) |
| `flowRate` | Float | ❌ | null | Caudal de bomba (gpm) |
| `rotarySpeed` | Float | ❌ | null | Velocidad de rotación (rpm) |
| `weightOnBit` | Float | ❌ | null | Peso sobre la broca (klbs) |
| `torque` | Float | ❌ | null | Torque (ft-lbs) |
| `standpipePressure` | Float | ❌ | null | Presión en standpipe (psi) |

**Campos Adicionales**:
| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `userId` | String | ✅ | - | FK hacia User responsable |
| `fieldId` | String | ❌ | null | FK hacia Field |
| `createdAt` | DateTime | ✅ | now() | Fecha de creación |
| `updatedAt` | DateTime | ✅ | auto | Fecha de actualización |

**Constraints**:
- `wellType` valores: vertical, horizontal, direccional
- `operation` valores: drilling, completion, testing, production
- FK: `userId` → User.id (CASCADE)
- FK: `fieldId` → Field.id (SET NULL)

**Relaciones**:
- `user` → User (N:1)
- `field` → Field (N:1)
- `productionData[]` → ProductionData (1:N)
- `drillingData[]` → DrillingData (1:N)
- `drillingPlan[]` → DrillingPlan (1:N)

---

### DrillingPlan
**Propósito**: Plan detallado de perforación por días con objetivos y parámetros.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único del plan |
| `wellId` | String | ✅ | - | FK hacia Well |
| `day` | Int | ✅ | - | Día planificado (1, 2, 3...) |
| `depthFrom` | Float | ✅ | - | Profundidad inicial (m) |
| `depthTo` | Float | ✅ | - | Profundidad objetivo (m) |
| `plannedROP` | Float | ✅ | - | ROP planificado (m/hr) |
| `plannedHours` | Float | ✅ | - | Horas planificadas |
| `formation` | String | ❌ | null | Formación esperada |
| `holeSection` | String | ❌ | null | Sección del hoyo |
| `operation` | String | ❌ | null | Operación planificada |
| `mudType` | String | ❌ | null | Tipo de lodo planificado |
| `mudDensity` | Float | ❌ | null | Densidad planificada |
| `bitType` | String | ❌ | null | Tipo de broca planificada |
| `bitSize` | Float | ❌ | null | Tamaño de broca |
| `flowRate` | Float | ❌ | null | Caudal planificado (gpm) |
| `rotarySpeed` | Float | ❌ | null | RPM planificado |
| `weightOnBit` | Float | ❌ | null | WOB planificado (klbs) |
| `createdAt` | DateTime | ✅ | now() | Fecha de creación |
| `updatedAt` | DateTime | ✅ | auto | Fecha de actualización |

**Constraints**:
- FK: `wellId` → Well.id (CASCADE)
- `day` debe ser > 0
- `depthTo` debe ser > `depthFrom`

**Relaciones**:
- `well` → Well (N:1)

---

### DrillingData
**Propósito**: Datos reales de perforación registrados diariamente.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único del registro |
| `wellId` | String | ✅ | - | FK hacia Well |
| `date` | DateTime | ✅ | now() | Fecha del registro |
| `day` | Int | ✅ | - | Día de perforación |
| `depth` | Float | ✅ | - | Profundidad alcanzada (m) |
| `plan` | Float | ❌ | null | Profundidad planeada (m) |
| `progressM` | Float | ❌ | null | Progreso en metros |
| `rop` | Float | ❌ | null | Rate of Penetration real |
| `mud` | String | ❌ | null | Tipo de lodo usado |
| `pressure` | Float | ❌ | null | Presión (psi) |
| `temperature` | Float | ❌ | null | Temperatura (°F) |
| `status` | String | ❌ | "drilling" | Estado de la operación |
| `shift` | String | ❌ | "day" | Turno: day, night |
| `crew` | String | ❌ | null | Equipo de trabajo |
| `contractor` | String | ❌ | null | Contratista |
| `formation` | String | ❌ | null | Formación actual |
| `holeSection` | String | ❌ | null | Sección del hoyo |
| `operation` | String | ❌ | null | Operación específica |
| `createdAt` | DateTime | ✅ | now() | Fecha de creación |
| `updatedAt` | DateTime | ✅ | auto | Fecha de actualización |

**Constraints**:
- FK: `wellId` → Well.id (CASCADE)
- `status` valores: drilling, tripping, maintenance, waiting
- `shift` valores: day, night

**Relaciones**:
- `well` → Well (N:1)

---

### ProductionData
**Propósito**: Datos de producción del pozo.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único del registro |
| `wellId` | String | ✅ | - | FK hacia Well |
| `production` | Float | ✅ | - | Producción registrada |
| `pressure` | Float | ✅ | - | Presión registrada |
| `temperature` | Float | ✅ | - | Temperatura registrada |
| `recordDate` | DateTime | ✅ | now() | Fecha del registro |

**Constraints**:
- FK: `wellId` → Well.id (CASCADE)

**Relaciones**:
- `well` → Well (N:1)

---

### ContractActivity
**Propósito**: Actividades específicas definidas en cada contrato.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único de la actividad |
| `contractId` | String | ✅ | - | FK hacia Contract |
| `name` | String | ✅ | - | Nombre de la actividad |
| `description` | String | ❌ | null | Descripción detallada |
| `category` | String | ✅ | - | Categoría de actividad |
| `unit` | String | ✅ | - | Unidad de medida |
| `targetValue` | Float | ✅ | - | Valor objetivo |
| `priority` | Int | ❌ | 1 | Prioridad (1-5) |
| `isActive` | Boolean | ❌ | true | Estado activo |
| `createdAt` | DateTime | ✅ | now() | Fecha de creación |
| `updatedAt` | DateTime | ✅ | auto | Fecha de actualización |

**Constraints**:
- FK: `contractId` → Contract.id (CASCADE)
- `category` valores: drilling, completion, testing, maintenance
- `unit` valores: meters, hours, days, pieces
- `priority` rango: 1-5

**Relaciones**:
- `contract` → Contract (N:1)

---

### Report
**Propósito**: Reportes generados por el sistema.

| Campo | Tipo | Obligatorio | Default | Descripción |
|-------|------|-------------|---------|-------------|
| `id` | String | ✅ | cuid() | ID único del reporte |
| `title` | String | ✅ | - | Título del reporte |
| `description` | String | ❌ | null | Descripción del reporte |
| `reportType` | String | ✅ | - | Tipo de reporte |
| `format` | String | ✅ | - | Formato del archivo |
| `status` | String | ❌ | "generated" | Estado del reporte |
| `generatedBy` | String | ✅ | - | FK hacia User que generó |
| `generatedAt` | DateTime | ✅ | now() | Fecha de generación |
| `createdAt` | DateTime | ✅ | now() | Fecha de creación |
| `updatedAt` | DateTime | ✅ | auto | Fecha de actualización |

**Constraints**:
- FK: `generatedBy` → User.id (CASCADE)
- `reportType` valores: daily, weekly, monthly, custom, comparative
- `format` valores: pdf, excel, csv
- `status` valores: generated, sent, archived

**Relaciones**:
- `user` → User (N:1)

---

## 🔗 Diagrama de Relaciones

```
User (1) ──────── (N) Contract ──────── (1) Client
  │                     │
  │                     └── (1:N) Field ──────── (1:N) Well
  │                                                 │
  │                                                 ├── (1:N) DrillingPlan
  │                                                 ├── (1:N) DrillingData  
  │                                                 └── (1:N) ProductionData
  │
  ├── (1:N) Session
  ├── (1:N) Account
  └── (1:N) Report
```

## 📋 Campos Obligatorios por Tabla (Para INSERT)

### Mínimos requeridos para cada tabla:

**User**: `id`, `email`, `name`, `password`  
**Client**: `id`, `name`  
**Contract**: `id`, `name`, `startDate`, `endDate`, `value`, `clientId`, `userId`  
**Field**: `id`, `name`, `location`, `contractId`  
**Well**: `id`, `name`, `location`, `userId`  
**DrillingPlan**: `wellId`, `day`, `depthFrom`, `depthTo`, `plannedROP`, `plannedHours`  
**DrillingData**: `wellId`, `day`, `date`, `depth`

---

## 🚀 Scripts de Ejemplo

### Orden correcto para INSERT (respetar foreign keys):
1. User
2. Client  
3. Contract (requiere User + Client)
4. Field (requiere Contract)
5. Well (requiere User + Field)
6. DrillingPlan (requiere Well)
7. DrillingData (requiere Well)

### Orden correcto para DELETE (inverso):
1. DrillingData
2. DrillingPlan
3. ProductionData
4. Well
5. Field
6. Contract
7. Client
8. User (solo los que no son del sistema)

---

*Documentación generada el 4 de octubre de 2025*
*Versión: 1.0*