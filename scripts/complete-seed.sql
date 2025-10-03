-- Script SQL simplificado para poblar datos básicos
-- Ejecutar: psql $DATABASE_URL -f complete-seed.sql

-- 1. Usuario admin (si no existe)
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt") 
VALUES (
  'admin-001', 
  'admin@wellwizards.com', 
  'Administrador', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  'admin', 
  NOW(), 
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Cliente
INSERT INTO "Client" (id, name, email, phone, address, "contactPerson", industry, "createdAt", "updatedAt") 
VALUES (
  'client-001', 
  'Empresa Demo', 
  'demo@empresa.com', 
  '+1 555-0123', 
  '123 Main St, Houston, TX', 
  'Juan Pérez', 
  'Petróleo y Gas', 
  NOW(), 
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 3. Contrato
INSERT INTO "Contract" (id, name, description, "startDate", "endDate", value, currency, status, "contractType", "targetDepth", "expectedDays", "dailyRate", "clientId", "userId", "createdAt", "updatedAt") 
VALUES (
  'contract-001', 
  'Contrato Demo', 
  'Contrato de demostración', 
  '2024-01-01', 
  '2024-12-31', 
  500000, 
  'USD', 
  'active', 
  'drilling', 
  10000, 
  45, 
  15000, 
  'client-001', 
  'admin-001', 
  NOW(), 
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 4. Campo
INSERT INTO "Field" (id, name, location, description, latitude, longitude, "contractId", "createdAt", "updatedAt") 
VALUES (
  'field-001', 
  'Campo Demo', 
  'Texas, USA', 
  'Campo de demostración', 
  29.7604, 
  -95.3698, 
  'contract-001', 
  NOW(), 
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 5. Pozo
INSERT INTO "Well" (id, name, location, status, depth, "wellType", formation, operation, latitude, longitude, "userId", "fieldId", production, pressure, temperature, "createdAt", "updatedAt") 
VALUES (
  'well-001', 
  'Pozo Demo-1', 
  'Texas, USA', 
  'drilling', 
  8500, 
  'horizontal', 
  'Eagle Ford', 
  'drilling', 
  29.7604, 
  -95.3698, 
  'admin-001', 
  'field-001', 
  0, 
  0, 
  0, 
  NOW(), 
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 6. Plan de perforación (5 días)
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", formation, operation, "createdAt", "updatedAt") VALUES
('well-001', 1, 0, 500, 250, 2.0, 'Surface', 'drilling', NOW(), NOW()),
('well-001', 2, 500, 1200, 350, 2.0, 'Surface', 'drilling', NOW(), NOW()),
('well-001', 3, 1200, 2000, 400, 2.0, 'Intermediate', 'drilling', NOW(), NOW()),
('well-001', 4, 2000, 3000, 350, 2.9, 'Intermediate', 'drilling', NOW(), NOW()),
('well-001', 5, 3000, 4000, 300, 3.3, 'Production', 'drilling', NOW(), NOW());

-- 7. Datos reales de perforación (5 días)
INSERT INTO "DrillingData" ("wellId", date, depth, rop, "mudDensity", pressure, temperature, operation, formation, "createdAt", "updatedAt") VALUES
('well-001', '2024-01-01', 480, 240, 8.5, 500, 85, 'drilling', 'Surface', NOW(), NOW()),
('well-001', '2024-01-02', 1150, 335, 9.0, 800, 90, 'drilling', 'Surface', NOW(), NOW()),
('well-001', '2024-01-03', 1980, 390, 9.2, 1200, 95, 'drilling', 'Intermediate', NOW(), NOW()),
('well-001', '2024-01-04', 2950, 340, 9.5, 1500, 100, 'drilling', 'Intermediate', NOW(), NOW()),
('well-001', '2024-01-05', 3950, 295, 10.0, 1800, 105, 'drilling', 'Production', NOW(), NOW());

-- Verificación
SELECT 'Datos creados exitosamente:' as mensaje;
SELECT COUNT(*) as usuarios FROM "User";
SELECT COUNT(*) as pozos FROM "Well";
SELECT COUNT(*) as plan_records FROM "DrillingPlan";
SELECT COUNT(*) as drilling_records FROM "DrillingData";