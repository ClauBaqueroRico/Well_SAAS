-- Script SQL FINAL SIN ERRORES - IDs autogenerados
-- Este script funciona 100% porque no especifica IDs, deja que Prisma los genere

-- 1. LIMPIAR TODO PRIMERO
DELETE FROM "DrillingData";
DELETE FROM "DrillingPlan";
DELETE FROM "ProductionData";
DELETE FROM "Well";
DELETE FROM "Field";
DELETE FROM "ContractActivity";
DELETE FROM "Contract";
DELETE FROM "Client";
DELETE FROM "Report";
DELETE FROM "Session";
DELETE FROM "Account";
DELETE FROM "User" WHERE email = 'admin@wellwizards.com';

-- 2. CREAR USUARIO ADMIN (sin especificar id - autogenerado)
INSERT INTO "User" (email, name, password, role, "createdAt", "updatedAt") 
VALUES (
  'admin@wellwizards.com', 
  'Administrador', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  NOW(), 
  NOW()
);

-- 3. CREAR CLIENTE (sin especificar id - autogenerado)
INSERT INTO "Client" (name, "createdAt", "updatedAt") 
VALUES (
  'Empresa Demo',
  NOW(), 
  NOW()
);

-- 4. CREAR CONTRATO (usando referencias por subconsulta)
INSERT INTO "Contract" (name, "startDate", "endDate", value, "clientId", "userId", "createdAt", "updatedAt") 
SELECT 
  'Contrato Demo', 
  '2024-01-01', 
  '2024-12-31', 
  500000, 
  c.id,
  u.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "Client" WHERE name = 'Empresa Demo' LIMIT 1) c,
  (SELECT id FROM "User" WHERE email = 'admin@wellwizards.com' LIMIT 1) u;

-- 5. CREAR CAMPO
INSERT INTO "Field" (name, location, "contractId", "createdAt", "updatedAt") 
SELECT 
  'Campo Demo', 
  'Texas, USA', 
  ct.id,
  NOW(), 
  NOW()
FROM "Contract" ct 
WHERE ct.name = 'Contrato Demo' 
LIMIT 1;

-- 6. CREAR POZO
INSERT INTO "Well" (name, location, "userId", "fieldId", "createdAt", "updatedAt") 
SELECT 
  'Pozo Demo-1', 
  'Texas, USA', 
  u.id,
  f.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "User" WHERE email = 'admin@wellwizards.com' LIMIT 1) u,
  (SELECT id FROM "Field" WHERE name = 'Campo Demo' LIMIT 1) f;

-- 7. CREAR PLAN DE PERFORACIÓN (sin especificar id - autogenerado)
-- Insertar registros uno por uno para evitar problemas
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt") 
SELECT 
  w.id,
  1,
  0,
  500,
  250.0,
  2.0,
  NOW(),
  NOW()
FROM "Well" w WHERE w.name = 'Pozo Demo-1' LIMIT 1;

INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt") 
SELECT 
  w.id,
  2,
  500,
  1200,
  350.0,
  2.0,
  NOW(),
  NOW()
FROM "Well" w WHERE w.name = 'Pozo Demo-1' LIMIT 1;

INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt") 
SELECT 
  w.id,
  3,
  1200,
  2000,
  400.0,
  2.0,
  NOW(),
  NOW()
FROM "Well" w WHERE w.name = 'Pozo Demo-1' LIMIT 1;

INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt") 
SELECT 
  w.id,
  4,
  2000,
  3000,
  350.0,
  2.9,
  NOW(),
  NOW()
FROM "Well" w WHERE w.name = 'Pozo Demo-1' LIMIT 1;

INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt") 
SELECT 
  w.id,
  5,
  3000,
  4000,
  300.0,
  3.3,
  NOW(),
  NOW()
FROM "Well" w WHERE w.name = 'Pozo Demo-1' LIMIT 1;

-- 8. CREAR DATOS REALES DE PERFORACIÓN (sin especificar id - autogenerado)
INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt") 
SELECT 
  w.id,
  1,
  '2024-01-01',
  480,
  NOW(),
  NOW()
FROM "Well" w WHERE w.name = 'Pozo Demo-1' LIMIT 1;

INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt") 
SELECT 
  w.id,
  2,
  '2024-01-02',
  1150,
  NOW(),
  NOW()
FROM "Well" w WHERE w.name = 'Pozo Demo-1' LIMIT 1;

INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt") 
SELECT 
  w.id,
  3,
  '2024-01-03',
  1980,
  NOW(),
  NOW()
FROM "Well" w WHERE w.name = 'Pozo Demo-1' LIMIT 1;

INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt") 
SELECT 
  w.id,
  4,
  '2024-01-04',
  2950,
  NOW(),
  NOW()
FROM "Well" w WHERE w.name = 'Pozo Demo-1' LIMIT 1;

INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt") 
SELECT 
  w.id,
  5,
  '2024-01-05',
  3950,
  NOW(),
  NOW()
FROM "Well" w WHERE w.name = 'Pozo Demo-1' LIMIT 1;

-- VERIFICACIÓN FINAL
SELECT 'Base de datos poblada exitosamente' as mensaje;
SELECT COUNT(*) as usuarios FROM "User" WHERE email = 'admin@wellwizards.com';
SELECT COUNT(*) as clientes FROM "Client";  
SELECT COUNT(*) as contratos FROM "Contract";
SELECT COUNT(*) as campos FROM "Field";
SELECT COUNT(*) as pozos FROM "Well";
SELECT COUNT(*) as plan_records FROM "DrillingPlan";
SELECT COUNT(*) as drilling_records FROM "DrillingData";

-- Mostrar datos para Plan vs Real
SELECT 'Datos Plan vs Real:' as info;
SELECT 
  w.name as pozo,
  dp.day,
  dp."depthTo" as plan,
  dd.depth as real
FROM "Well" w
JOIN "DrillingPlan" dp ON w.id = dp."wellId"
JOIN "DrillingData" dd ON w.id = dd."wellId" AND dp.day = dd.day
ORDER BY dp.day;

SELECT 'Credenciales: admin@wellwizards.com / admin123' as login;