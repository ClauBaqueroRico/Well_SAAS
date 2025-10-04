-- Script SQL COMPLETAMENTE CORREGIDO para poblar datos básicos
-- Ejecutar: psql $DATABASE_URL -f fixed-seed.sql

-- 1. Usuario admin
INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt") 
VALUES (
  'admin-001', 
  'admin@wellwizards.com', 
  'Administrador', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW(), 
  NOW()
);

-- 2. Cliente
INSERT INTO "Client" (id, name, "createdAt", "updatedAt") 
VALUES (
  'client-001', 
  'Empresa Demo',
  NOW(), 
  NOW()
);

-- 3. Contrato
INSERT INTO "Contract" (id, name, "startDate", "endDate", value, "clientId", "userId", "createdAt", "updatedAt") 
VALUES (
  'contract-001', 
  'Contrato Demo', 
  '2024-01-01', 
  '2024-12-31', 
  500000, 
  'client-001', 
  'admin-001', 
  NOW(), 
  NOW()
);

-- 4. Campo
INSERT INTO "Field" (id, name, location, "contractId", "createdAt", "updatedAt") 
VALUES (
  'field-001', 
  'Campo Demo', 
  'Texas, USA', 
  'contract-001', 
  NOW(), 
  NOW()
);

-- 5. Pozo
INSERT INTO "Well" (id, name, location, "userId", "fieldId", "createdAt", "updatedAt") 
VALUES (
  'well-001', 
  'Pozo Demo-1', 
  'Texas, USA', 
  'admin-001', 
  'field-001', 
  NOW(), 
  NOW()
);

-- 6. Plan de perforación
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt") VALUES
('well-001', 1, 0, 500, 250, 2.0, NOW(), NOW()),
('well-001', 2, 500, 1200, 350, 2.0, NOW(), NOW()),
('well-001', 3, 1200, 2000, 400, 2.0, NOW(), NOW()),
('well-001', 4, 2000, 3000, 350, 2.9, NOW(), NOW()),
('well-001', 5, 3000, 4000, 300, 3.3, NOW(), NOW());

-- 7. Datos reales de perforación  
INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt") VALUES
('well-001', 1, '2024-01-01', 480, NOW(), NOW()),
('well-001', 2, '2024-01-02', 1150, NOW(), NOW()),
('well-001', 3, '2024-01-03', 1980, NOW(), NOW()),
('well-001', 4, '2024-01-04', 2950, NOW(), NOW()),
('well-001', 5, '2024-01-05', 3950, NOW(), NOW());

-- Verificación
SELECT 'Datos creados exitosamente' as mensaje;
SELECT COUNT(*) as usuarios FROM "User";
SELECT COUNT(*) as clientes FROM "Client";  
SELECT COUNT(*) as contratos FROM "Contract";
SELECT COUNT(*) as campos FROM "Field";
SELECT COUNT(*) as pozos FROM "Well";
SELECT COUNT(*) as plan_records FROM "DrillingPlan";
SELECT COUNT(*) as drilling_records FROM "DrillingData";