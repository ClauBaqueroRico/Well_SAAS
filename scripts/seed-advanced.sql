-- Script SQL COMPLETO - 3 Clientes, 5 Contratos, 5 Pozos con datos Plan vs Real
-- Dataset realista para testing completo del sistema

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
DELETE FROM "User" WHERE email IN ('admin@wellwizards.com', 'supervisor@wellwizards.com', 'operator@wellwizards.com');

-- 2. CREAR USUARIOS
INSERT INTO "User" (email, name, password, role, "createdAt", "updatedAt") VALUES
('admin@wellwizards.com', 'Administrador General', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW()),
('supervisor@wellwizards.com', 'Supervisor de Campo', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', NOW(), NOW()),
('operator@wellwizards.com', 'Operador Senior', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', NOW(), NOW());

-- 3. CREAR 3 CLIENTES
INSERT INTO "Client" (name, email, phone, address, "contactName", "contactEmail", "contactPhone", "createdAt", "updatedAt") VALUES
('Ecopetrol S.A.', 'contratos@ecopetrol.com.co', '+57-1-234-5678', 'Carrera 13 No. 36-24, Bogotá', 'Carlos Rodríguez', 'carlos.rodriguez@ecopetrol.com.co', '+57-1-234-5679', NOW(), NOW()),
('Pacific Rubiales Energy', 'operations@pacificrubiales.com', '+57-1-345-6789', 'Calle 113 No. 7-21, Bogotá', 'María González', 'maria.gonzalez@pacificrubiales.com', '+57-1-345-6790', NOW(), NOW()),
('Frontera Energy Corp', 'drilling@fronteraenergy.ca', '+1-403-777-4800', '1200, 645 - 7th Ave SW, Calgary', 'John Mitchell', 'john.mitchell@fronteraenergy.ca', '+1-403-777-4801', NOW(), NOW());

-- 4. CREAR 5 CONTRATOS (distribuidos entre los 3 clientes)
-- Contrato 1 - Ecopetrol
INSERT INTO "Contract" (name, description, "startDate", "endDate", value, currency, status, "contractType", "targetDepth", "expectedDays", "dailyRate", "clientId", "userId", "createdAt", "updatedAt") 
SELECT 
  'Contrato Ecopetrol - Campo Rubiales Norte', 
  'Perforación de pozos direccionales en Campo Rubiales Norte',
  '2024-01-15', 
  '2024-06-30', 
  1200000, 
  'USD',
  'active',
  'drilling',
  3500,
  45,
  18000,
  c.id,
  u.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "Client" WHERE name = 'Ecopetrol S.A.' LIMIT 1) c,
  (SELECT id FROM "User" WHERE email = 'admin@wellwizards.com' LIMIT 1) u;

-- Contrato 2 - Ecopetrol
INSERT INTO "Contract" (name, description, "startDate", "endDate", value, currency, status, "contractType", "targetDepth", "expectedDays", "dailyRate", "clientId", "userId", "createdAt", "updatedAt") 
SELECT 
  'Contrato Ecopetrol - Campo Casanare Sur', 
  'Perforación horizontal en formación Eagle Ford',
  '2024-02-01', 
  '2024-08-15', 
  950000, 
  'USD',
  'active',
  'drilling',
  4200,
  52,
  15500,
  c.id,
  u.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "Client" WHERE name = 'Ecopetrol S.A.' LIMIT 1) c,
  (SELECT id FROM "User" WHERE email = 'supervisor@wellwizards.com' LIMIT 1) u;

-- Contrato 3 - Pacific Rubiales
INSERT INTO "Contract" (name, description, "startDate", "endDate", value, currency, status, "contractType", "targetDepth", "expectedDays", "dailyRate", "clientId", "userId", "createdAt", "updatedAt") 
SELECT 
  'Contrato Pacific - Campo La Cira Infantas', 
  'Perforación vertical y completación en Campo La Cira',
  '2024-01-20', 
  '2024-07-20', 
  850000, 
  'USD',
  'active',
  'drilling',
  2800,
  38,
  16200,
  c.id,
  u.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "Client" WHERE name = 'Pacific Rubiales Energy' LIMIT 1) c,
  (SELECT id FROM "User" WHERE email = 'operator@wellwizards.com' LIMIT 1) u;

-- Contrato 4 - Pacific Rubiales
INSERT INTO "Contract" (name, description, "startDate", "endDate", value, currency, status, "contractType", "targetDepth", "expectedDays", "dailyRate", "clientId", "userId", "createdAt", "updatedAt") 
SELECT 
  'Contrato Pacific - Campo Quifa Norte', 
  'Programa de perforación direccional avanzado',
  '2024-03-01', 
  '2024-09-30', 
  1450000, 
  'USD',
  'active',
  'drilling',
  4800,
  65,
  19500,
  c.id,
  u.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "Client" WHERE name = 'Pacific Rubiales Energy' LIMIT 1) c,
  (SELECT id FROM "User" WHERE email = 'admin@wellwizards.com' LIMIT 1) u;

-- Contrato 5 - Frontera Energy
INSERT INTO "Contract" (name, description, "startDate", "endDate", value, currency, status, "contractType", "targetDepth", "expectedDays", "dailyRate", "clientId", "userId", "createdAt", "updatedAt") 
SELECT 
  'Contrato Frontera - Campo Aguila Norte', 
  'Perforación exploratoria en nuevo prospecto',
  '2024-02-15', 
  '2024-08-31', 
  1100000, 
  'USD',
  'active',
  'drilling',
  3800,
  48,
  17800,
  c.id,
  u.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "Client" WHERE name = 'Frontera Energy Corp' LIMIT 1) c,
  (SELECT id FROM "User" WHERE email = 'supervisor@wellwizards.com' LIMIT 1) u;

-- 5. CREAR 5 CAMPOS (uno por contrato)
INSERT INTO "Field" (name, location, description, latitude, longitude, "contractId", "createdAt", "updatedAt") 
SELECT 
  'Campo Rubiales Norte', 
  'Meta, Colombia', 
  'Campo de petróleo pesado con producción de 180,000 bpd',
  4.1234,
  -73.2567,
  ct.id,
  NOW(), 
  NOW()
FROM "Contract" ct WHERE ct.name = 'Contrato Ecopetrol - Campo Rubiales Norte' LIMIT 1;

INSERT INTO "Field" (name, location, description, latitude, longitude, "contractId", "createdAt", "updatedAt") 
SELECT 
  'Campo Casanare Sur', 
  'Casanare, Colombia', 
  'Campo con formación Eagle Ford, producción de gas y condensado',
  5.7890,
  -72.4567,
  ct.id,
  NOW(), 
  NOW()
FROM "Contract" ct WHERE ct.name = 'Contrato Ecopetrol - Campo Casanare Sur' LIMIT 1;

INSERT INTO "Field" (name, location, description, latitude, longitude, "contractId", "createdAt", "updatedAt") 
SELECT 
  'Campo La Cira Infantas', 
  'Santander, Colombia', 
  'Campo maduro con programa de optimización',
  7.1234,
  -73.8901,
  ct.id,
  NOW(), 
  NOW()
FROM "Contract" ct WHERE ct.name = 'Contrato Pacific - Campo La Cira Infantas' LIMIT 1;

INSERT INTO "Field" (name, location, description, latitude, longitude, "contractId", "createdAt", "updatedAt") 
SELECT 
  'Campo Quifa Norte', 
  'Meta, Colombia', 
  'Campo con reservas probadas de 450 millones de barriles',
  4.5678,
  -72.1234,
  ct.id,
  NOW(), 
  NOW()
FROM "Contract" ct WHERE ct.name = 'Contrato Pacific - Campo Quifa Norte' LIMIT 1;

INSERT INTO "Field" (name, location, description, latitude, longitude, "contractId", "createdAt", "updatedAt") 
SELECT 
  'Campo Aguila Norte', 
  'Casanare, Colombia', 
  'Prospecto exploratorio con potencial de 200 MMBOE',
  5.2345,
  -71.6789,
  ct.id,
  NOW(), 
  NOW()
FROM "Contract" ct WHERE ct.name = 'Contrato Frontera - Campo Aguila Norte' LIMIT 1;

-- 6. CREAR 5 POZOS (uno por campo)
INSERT INTO "Well" (name, location, status, depth, "wellType", formation, operation, latitude, longitude, "userId", "fieldId", "createdAt", "updatedAt") 
SELECT 
  'RBN-H-001', 
  'Meta, Colombia', 
  'drilling',
  0,
  'horizontal',
  'Mirador Formation',
  'drilling',
  4.1234,
  -73.2567,
  u.id,
  f.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "User" WHERE email = 'admin@wellwizards.com' LIMIT 1) u,
  (SELECT id FROM "Field" WHERE name = 'Campo Rubiales Norte' LIMIT 1) f;

INSERT INTO "Well" (name, location, status, depth, "wellType", formation, operation, latitude, longitude, "userId", "fieldId", "createdAt", "updatedAt") 
SELECT 
  'CAS-D-002', 
  'Casanare, Colombia', 
  'drilling',
  0,
  'direccional',
  'Eagle Ford Shale',
  'drilling',
  5.7890,
  -72.4567,
  u.id,
  f.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "User" WHERE email = 'supervisor@wellwizards.com' LIMIT 1) u,
  (SELECT id FROM "Field" WHERE name = 'Campo Casanare Sur' LIMIT 1) f;

INSERT INTO "Well" (name, location, status, depth, "wellType", formation, operation, latitude, longitude, "userId", "fieldId", "createdAt", "updatedAt") 
SELECT 
  'LCI-V-003', 
  'Santander, Colombia', 
  'drilling',
  0,
  'vertical',
  'La Luna Formation',
  'drilling',
  7.1234,
  -73.8901,
  u.id,
  f.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "User" WHERE email = 'operator@wellwizards.com' LIMIT 1) u,
  (SELECT id FROM "Field" WHERE name = 'Campo La Cira Infantas' LIMIT 1) f;

INSERT INTO "Well" (name, location, status, depth, "wellType", formation, operation, latitude, longitude, "userId", "fieldId", "createdAt", "updatedAt") 
SELECT 
  'QFN-H-004', 
  'Meta, Colombia', 
  'drilling',
  0,
  'horizontal',
  'Gacheta Formation',
  'drilling',
  4.5678,
  -72.1234,
  u.id,
  f.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "User" WHERE email = 'admin@wellwizards.com' LIMIT 1) u,
  (SELECT id FROM "Field" WHERE name = 'Campo Quifa Norte' LIMIT 1) f;

INSERT INTO "Well" (name, location, status, depth, "wellType", formation, operation, latitude, longitude, "userId", "fieldId", "createdAt", "updatedAt") 
SELECT 
  'AGN-E-005', 
  'Casanare, Colombia', 
  'drilling',
  0,
  'direccional',
  'Carbonera Formation',
  'drilling',
  5.2345,
  -71.6789,
  u.id,
  f.id,
  NOW(), 
  NOW()
FROM 
  (SELECT id FROM "User" WHERE email = 'supervisor@wellwizards.com' LIMIT 1) u,
  (SELECT id FROM "Field" WHERE name = 'Campo Aguila Norte' LIMIT 1) f;

-- 7. CREAR PLANES DE PERFORACIÓN PARA LOS 5 POZOS

-- Plan para RBN-H-001 (Pozo Horizontal - 7 días)
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 1, 0, 400, 200, 2.0, 'Surface', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 2, 400, 900, 250, 2.0, 'Surface', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 3, 900, 1500, 300, 2.0, 'Intermediate', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 4, 1500, 2200, 350, 2.0, 'Intermediate', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 5, 2200, 2800, 300, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 6, 2800, 3200, 200, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 7, 3200, 3500, 150, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';

-- Plan para CAS-D-002 (Pozo Direccional - 8 días)
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 1, 0, 350, 175, 2.0, 'Surface', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 2, 350, 800, 225, 2.0, 'Surface', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 3, 800, 1400, 300, 2.0, 'Intermediate', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 4, 1400, 2100, 350, 2.0, 'Intermediate', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 5, 2100, 2800, 350, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 6, 2800, 3400, 300, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 7, 3400, 3900, 250, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 8, 3900, 4200, 150, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';

-- Plan para LCI-V-003 (Pozo Vertical - 5 días)
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 1, 0, 500, 250, 2.0, 'Surface', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'LCI-V-003';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 2, 500, 1100, 300, 2.0, 'Intermediate', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'LCI-V-003';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 3, 1100, 1800, 350, 2.0, 'Intermediate', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'LCI-V-003';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 4, 1800, 2400, 300, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'LCI-V-003';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 5, 2400, 2800, 200, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'LCI-V-003';

-- Plan para QFN-H-004 (Pozo Horizontal - 9 días)
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 1, 0, 300, 150, 2.0, 'Surface', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 2, 300, 700, 200, 2.0, 'Surface', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 3, 700, 1200, 250, 2.0, 'Intermediate', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 4, 1200, 1800, 300, 2.0, 'Intermediate', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 5, 1800, 2500, 350, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 6, 2500, 3200, 350, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 7, 3200, 3900, 350, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 8, 3900, 4500, 300, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 9, 4500, 4800, 150, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';

-- Plan para AGN-E-005 (Pozo Exploratorio - 6 días)
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 1, 0, 400, 200, 2.0, 'Surface', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 2, 400, 950, 275, 2.0, 'Surface', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 3, 950, 1600, 325, 2.0, 'Intermediate', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 4, 1600, 2400, 400, 2.0, 'Intermediate', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 5, 2400, 3200, 400, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") 
SELECT w.id, 6, 3200, 3800, 300, 2.0, 'Production', 'drilling', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';

-- 8. CREAR DATOS REALES DE PERFORACIÓN (con variaciones realistas vs plan)

-- Datos reales RBN-H-001 (7 días - rendimiento ligeramente bajo)
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 1, '2024-01-15', 380, 190, 800, 85, 'drilling', 'Surface', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 2, '2024-01-16', 850, 235, 1200, 92, 'drilling', 'Surface', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 3, '2024-01-17', 1450, 290, 1500, 98, 'drilling', 'Intermediate', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 4, '2024-01-18', 2150, 330, 1800, 105, 'drilling', 'Intermediate', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 5, '2024-01-19', 2750, 285, 2100, 110, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 6, '2024-01-20', 3180, 185, 2300, 115, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 7, '2024-01-21', 3500, 140, 2500, 118, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'RBN-H-001';

-- Datos reales CAS-D-002 (8 días - rendimiento superior al plan)
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 1, '2024-02-01', 370, 185, 750, 82, 'drilling', 'Surface', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 2, '2024-02-02', 820, 245, 1100, 88, 'drilling', 'Surface', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 3, '2024-02-03', 1450, 315, 1400, 95, 'drilling', 'Intermediate', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 4, '2024-02-04', 2180, 365, 1700, 102, 'drilling', 'Intermediate', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 5, '2024-02-05', 2850, 370, 2000, 108, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 6, '2024-02-06', 3450, 320, 2200, 112, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 7, '2024-02-07', 3950, 270, 2400, 116, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 8, '2024-02-08', 4200, 125, 2600, 120, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'CAS-D-002';

-- Datos reales LCI-V-003 (5 días - rendimiento según plan)
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 1, '2024-01-20', 490, 245, 700, 80, 'drilling', 'Surface', NOW(), NOW() FROM "Well" w WHERE w.name = 'LCI-V-003';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 2, '2024-01-21', 1080, 295, 1000, 87, 'drilling', 'Intermediate', NOW(), NOW() FROM "Well" w WHERE w.name = 'LCI-V-003';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 3, '2024-01-22', 1770, 345, 1300, 94, 'drilling', 'Intermediate', NOW(), NOW() FROM "Well" w WHERE w.name = 'LCI-V-003';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 4, '2024-01-23', 2380, 305, 1600, 100, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'LCI-V-003';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 5, '2024-01-24', 2800, 210, 1800, 105, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'LCI-V-003';

-- Datos reales QFN-H-004 (9 días - algunos retrasos por complicaciones)
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 1, '2024-03-01', 280, 140, 650, 78, 'drilling', 'Surface', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 2, '2024-03-02', 650, 185, 950, 85, 'drilling', 'Surface', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 3, '2024-03-03', 1150, 225, 1250, 92, 'drilling', 'Intermediate', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 4, '2024-03-04', 1720, 285, 1500, 98, 'drilling', 'Intermediate', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 5, '2024-03-05', 2420, 335, 1800, 105, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 6, '2024-03-06', 3100, 340, 2000, 110, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 7, '2024-03-07', 3780, 340, 2200, 115, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 8, '2024-03-08', 4350, 285, 2400, 118, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 9, '2024-03-09', 4800, 225, 2600, 122, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'QFN-H-004';

-- Datos reales AGN-E-005 (6 días - pozo exploratorio con descubrimientos)
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 1, '2024-02-15', 420, 210, 720, 81, 'drilling', 'Surface', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 2, '2024-02-16', 980, 280, 1050, 88, 'drilling', 'Surface', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 3, '2024-02-17', 1650, 335, 1350, 95, 'drilling', 'Intermediate', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 4, '2024-02-18', 2450, 410, 1650, 102, 'drilling', 'Intermediate', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 5, '2024-02-19', 3250, 420, 1950, 108, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';
INSERT INTO "DrillingData" ("wellId", day, date, depth, rop, pressure, temperature, operation, formation, "createdAt", "updatedAt") 
SELECT w.id, 6, '2024-02-20', 3800, 275, 2150, 112, 'drilling', 'Production', NOW(), NOW() FROM "Well" w WHERE w.name = 'AGN-E-005';

-- VERIFICACIÓN FINAL
SELECT 'Dataset completo creado exitosamente' as mensaje;

-- Conteos generales
SELECT COUNT(*) as usuarios FROM "User";
SELECT COUNT(*) as clientes FROM "Client";  
SELECT COUNT(*) as contratos FROM "Contract";
SELECT COUNT(*) as campos FROM "Field";
SELECT COUNT(*) as pozos FROM "Well";
SELECT COUNT(*) as plan_records FROM "DrillingPlan";
SELECT COUNT(*) as drilling_records FROM "DrillingData";

-- Resumen por cliente
SELECT 'Resumen por Cliente:' as info;
SELECT 
  cl.name as cliente,
  COUNT(DISTINCT ct.id) as contratos,
  COUNT(DISTINCT w.id) as pozos,
  COUNT(DISTINCT dp.id) as plan_records,
  COUNT(DISTINCT dd.id) as drilling_records
FROM "Client" cl
LEFT JOIN "Contract" ct ON cl.id = ct."clientId"
LEFT JOIN "Field" f ON ct.id = f."contractId"
LEFT JOIN "Well" w ON f.id = w."fieldId"
LEFT JOIN "DrillingPlan" dp ON w.id = dp."wellId"
LEFT JOIN "DrillingData" dd ON w.id = dd."wellId"
GROUP BY cl.name
ORDER BY cl.name;

-- Verificar datos Plan vs Real por pozo
SELECT 'Datos Plan vs Real por Pozo:' as info;
SELECT 
  w.name as pozo,
  COUNT(DISTINCT dp.day) as dias_planificados,
  COUNT(DISTINCT dd.day) as dias_con_datos,
  MIN(dp."depthTo") as profundidad_objetivo,
  MAX(dd.depth) as profundidad_alcanzada
FROM "Well" w
LEFT JOIN "DrillingPlan" dp ON w.id = dp."wellId"
LEFT JOIN "DrillingData" dd ON w.id = dd."wellId"
GROUP BY w.name
ORDER BY w.name;

SELECT 'Credenciales de acceso:' as login_info;
SELECT 'admin@wellwizards.com / admin123 (Admin)' as credencial_1;
SELECT 'supervisor@wellwizards.com / admin123 (User)' as credencial_2;
SELECT 'operator@wellwizards.com / admin123 (User)' as credencial_3;