-- Script SQL completo para configurar la base de datos con datos de ejemplo
-- Ejecutar en Heroku: psql $DATABASE_URL -f scripts/seed-database.sql

-- 1. Crear usuario administrador
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@wellwizards.com',
  'Administrador',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  NOW(),
  NOW()
);

-- 2. Crear cliente de ejemplo
INSERT INTO "Client" (id, name, email, phone, address, "contactPerson", industry, "createdAt", "updatedAt")
VALUES (
  'client-001',
  'Empresa Demo',
  'demo@empresa.com',
  '+1 555-0123',
  '123 Main Street, Houston, TX',
  'Juan Pérez',
  'Petróleo y Gas',
  NOW(),
  NOW()
);

-- 3. Crear contrato de ejemplo
INSERT INTO "Contract" (id, name, description, "startDate", "endDate", value, currency, status, "contractType", "targetDepth", "expectedDays", "dailyRate", "clientId", "userId", "createdAt", "updatedAt")
VALUES (
  'contract-001',
  'Contrato Demo',
  'Contrato de demostración para Well Wizards SaaS',
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
);

-- 4. Crear campo de ejemplo
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
);

-- 5. Crear pozo de ejemplo
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
);

-- Verificar que los datos se crearon correctamente
SELECT 'Usuarios creados:' as info;
SELECT email, name, role FROM "User";

SELECT 'Clientes creados:' as info;
SELECT name, email FROM "Client";

SELECT 'Contratos creados:' as info;
SELECT name, status, value FROM "Contract";

SELECT 'Pozos creados:' as info;
SELECT name, status, depth FROM "Well";