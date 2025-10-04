# 📚 Documentación de Arquitectura de Base de Datos

Esta carpeta contiene toda la documentación y herramientas para mantener la arquitectura de la base de datos Well Wizards SaaS ordenada y libre de errores.

## 📁 Archivos Incluidos

### 📖 Documentación
- **`DATABASE_ARCHITECTURE.md`** - Documentación completa de todas las tablas, campos, relaciones y constraints

### 🛠️ Herramientas de Validación
- **`../lib/database-validator.js`** - Validador de datos en JavaScript para usar antes de INSERTs
- **`../scripts/verify-database.sql`** - Script SQL para verificar la estructura actual
- **`../scripts/migrate-database.sql`** - Script para corregir problemas de estructura

### 🚀 Scripts de Población
- **`../scripts/final-seed.sql`** - Script definitivo para poblar datos demo
- **`../scripts/clean-seed.sql`** - Script para limpiar datos antes de poblar

## 🔄 Flujo de Trabajo Recomendado

### 1. Antes de Modificar la Base de Datos
```bash
# Verificar estructura actual
psql $DATABASE_URL -f scripts/verify-database.sql
```

### 2. Para Poblar Datos Demo
```bash
# Limpiar (opcional)
psql $DATABASE_URL -f scripts/clean-seed.sql

# Poblar datos
psql $DATABASE_URL -f scripts/final-seed.sql
```

### 3. Para Validar Datos en Código
```javascript
const DatabaseValidator = require('./lib/database-validator');

try {
  const userData = {
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword'
  };
  
  DatabaseValidator.validateUser(userData);
  // Si no hay errores, proceder con INSERT
} catch (error) {
  console.error('Validation error:', error.message);
}
```

### 4. Para Corregir Problemas de Estructura
```bash
# Aplicar migraciones y correcciones
psql $DATABASE_URL -f scripts/migrate-database.sql
```

## 🎯 Reglas de Oro

### ✅ Siempre Validar Antes de INSERT
1. **Campos obligatorios** - Verificar que todos los campos requeridos estén presentes
2. **Foreign keys** - Asegurar que las referencias existan
3. **Tipos de datos** - Validar que los tipos sean correctos
4. **Constraints** - Verificar valores únicos y rangos válidos

### 📋 Orden de Inserción (Respetar Foreign Keys)
1. `User` (sin dependencias)
2. `Client` (sin dependencias)
3. `Contract` (requiere User + Client)
4. `Field` (requiere Contract)
5. `Well` (requiere User + Field)
6. `DrillingPlan` (requiere Well)
7. `DrillingData` (requiere Well)

### 🗑️ Orden de Eliminación (Inverso)
1. `DrillingData`
2. `DrillingPlan`
3. `ProductionData`
4. `Well`
5. `Field`
6. `Contract`
7. `Client`
8. `User` (solo datos de prueba)

## 🚨 Errores Comunes y Soluciones

### Error: "duplicate key value violates unique constraint"
**Causa**: Intentar insertar un registro con un ID o email que ya existe
**Solución**: Usar IDs únicos o limpiar datos existentes primero

### Error: "violates foreign key constraint"
**Causa**: Intentar referenciar un registro que no existe
**Solución**: Insertar en el orden correcto o verificar que las referencias existan

### Error: "null value in column violates not-null constraint"
**Causa**: Faltar campos obligatorios
**Solución**: Verificar campos requeridos según `DATABASE_ARCHITECTURE.md`

### Error: "insert or update on table violates not-null constraint"
**Causa**: Enviar valores NULL para campos obligatorios
**Solución**: Usar el validador antes de INSERT

## 🔍 Comandos Útiles de Verificación

### Ver estructura de una tabla
```sql
\d "Well"
```

### Contar registros por tabla
```sql
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "DrillingPlan";
SELECT COUNT(*) FROM "DrillingData";
```

### Verificar foreign keys
```sql
SELECT dp."wellId", w.id as well_exists 
FROM "DrillingPlan" dp 
LEFT JOIN "Well" w ON dp."wellId" = w.id 
WHERE w.id IS NULL;
```

### Ver datos para Plan vs Real
```sql
SELECT 
  w.name,
  dp.day,
  dp."depthTo" as planned,
  dd.depth as actual
FROM "Well" w
JOIN "DrillingPlan" dp ON w.id = dp."wellId"
JOIN "DrillingData" dd ON w.id = dd."wellId" AND dp.day = dd.day
ORDER BY w.name, dp.day;
```

## 📊 Casos de Uso Específicos

### Para Gráficas Plan vs Real
**Datos necesarios**:
- Al menos 1 registro en `Well`
- Registros en `DrillingPlan` con días 1-N
- Registros en `DrillingData` con los mismos días
- Mismos `wellId` en ambas tablas

**Verificación**:
```sql
SELECT 
  'Plan vs Real Ready' as status,
  COUNT(DISTINCT dp."wellId") as wells_with_both
FROM "DrillingPlan" dp
JOIN "DrillingData" dd ON dp."wellId" = dd."wellId" AND dp.day = dd.day;
```

### Para Login de Admin
**Datos necesarios**:
- Usuario en `User` con `email = 'admin@wellwizards.com'`
- Password hasheado correctamente
- Role = 'admin'

**Verificación**:
```sql
SELECT email, role, 'Login Ready' as status 
FROM "User" 
WHERE email = 'admin@wellwizards.com';
```

---

## 🔄 Mantenimiento Regular

1. **Semanal**: Ejecutar `verify-database.sql` para verificar integridad
2. **Mensual**: Revisar y actualizar esta documentación si hay cambios
3. **Por Release**: Validar que todos los scripts funcionen correctamente

---

*Documentación creada el 4 de octubre de 2025*  
*Mantener actualizada con cada cambio de esquema*