-- Script SQL DEFINITIVO - Simple y sin errores
-- Limpia y crea datos nuevos garantizado

-- 1. LIMPIAR TODO PRIMERO
DELETE FROM "DrillingData";
DELETE FROM "DrillingPlan";
DELETE FROM "Well";
DELETE FROM "Field";
DELETE FROM "Contract";
DELETE FROM "Client";
DELETE FROM "User" WHERE email = 'admin@wellwizards.com';

-- 2. CREAR USUARIO ADMIN
INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt") 
VALUES (
  'admin123', 
  'admin@wellwizards.com', 
  'Administrador', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW(), 
  NOW()
);

-- 3. CREAR CLIENTE
INSERT INTO "Client" (id, name, "createdAt", "updatedAt") 
VALUES (
  'client123',
  'Empresa Demo',
  NOW(), 
  NOW()
);

-- 4. CREAR CONTRATO
INSERT INTO "Contract" (id, name, "startDate", "endDate", value, "clientId", "userId", "createdAt", "updatedAt") 
VALUES (
  'contract123', 
  'Contrato Demo', 
  '2024-01-01', 
  '2024-12-31', 
  500000, 
  'client123', 
  'admin123', 
  NOW(), 
  NOW()
);

-- 5. CREAR CAMPO
INSERT INTO "Field" (id, name, location, "contractId", "createdAt", "updatedAt") 
VALUES (
  'field123', 
  'Campo Demo', 
  'Texas, USA', 
  'contract123', 
  NOW(), 
  NOW()
);

-- 6. CREAR POZO
INSERT INTO "Well" (id, name, location, "userId", "fieldId", "createdAt", "updatedAt") 
VALUES (
  'well123', 
  'Pozo Demo-1', 
  'Texas, USA', 
  'admin123', 
  'field123', 
  NOW(), 
  NOW()
);

-- 7. PLAN DE PERFORACIÓN (5 días)
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt") VALUES
('well123', 1, 0, 500, 250, 2.0, NOW(), NOW()),
('well123', 2, 500, 1200, 350, 2.0, NOW(), NOW()),
('well123', 3, 1200, 2000, 400, 2.0, NOW(), NOW()),
('well123', 4, 2000, 3000, 350, 2.9, NOW(), NOW()),
('well123', 5, 3000, 4000, 300, 3.3, NOW(), NOW());

-- 8. DATOS REALES DE PERFORACIÓN (5 días)
INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt") VALUES
('well123', 1, '2024-01-01', 480, NOW(), NOW()),
('well123', 2, '2024-01-02', 1150, NOW(), NOW()),
('well123', 3, '2024-01-03', 1980, NOW(), NOW()),
('well123', 4, '2024-01-04', 2950, NOW(), NOW()),
('well123', 5, '2024-01-05', 3950, NOW(), NOW());

-- VERIFICACIÓN
SELECT 'Base de datos poblada exitosamente' as mensaje;
SELECT COUNT(*) as usuarios FROM "User";
SELECT COUNT(*) as clientes FROM "Client";  
SELECT COUNT(*) as contratos FROM "Contract";
SELECT COUNT(*) as campos FROM "Field";
SELECT COUNT(*) as pozos FROM "Well";
SELECT COUNT(*) as plan_records FROM "DrillingPlan";
SELECT COUNT(*) as drilling_records FROM "DrillingData";

SELECT 'Login: admin@wellwizards.com / admin123' as credenciales;