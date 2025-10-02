-- Script SQL para crear datos de DrillingPlan con ejemplos realistas
-- Ejecutar en Heroku: psql $DATABASE_URL -f scripts/seed-drilling-plan.sql

-- Primero, obtener IDs de pozos existentes y crear datos de plan
-- Insertar datos de drilling plan para el pozo existente
INSERT INTO "DrillingPlan" (id, "wellId", day, "depthFrom", "depthTo", "plannedROP", operation, formation, "daysElapsed", "createdAt", "updatedAt")
VALUES 
  ('plan-001-1', 'well-001', 1, 0, 500, 250, 'drilling', 'Surface', 1, NOW(), NOW()),
  ('plan-001-2', 'well-001', 2, 500, 1200, 350, 'drilling', 'Surface', 2, NOW(), NOW()),
  ('plan-001-3', 'well-001', 3, 1200, 2000, 400, 'drilling', 'Intermediate', 3, NOW(), NOW()),
  ('plan-001-4', 'well-001', 4, 2000, 2800, 400, 'drilling', 'Intermediate', 4, NOW(), NOW()),
  ('plan-001-5', 'well-001', 5, 2800, 3600, 350, 'drilling', 'Production', 5, NOW(), NOW()),
  ('plan-001-6', 'well-001', 6, 3600, 4400, 300, 'drilling', 'Production', 6, NOW(), NOW()),
  ('plan-001-7', 'well-001', 7, 4400, 5200, 280, 'drilling', 'Eagle Ford', 7, NOW(), NOW()),
  ('plan-001-8', 'well-001', 8, 5200, 6000, 250, 'drilling', 'Eagle Ford', 8, NOW(), NOW()),
  ('plan-001-9', 'well-001', 9, 6000, 6800, 200, 'drilling', 'Eagle Ford', 9, NOW(), NOW()),
  ('plan-001-10', 'well-001', 10, 6800, 7500, 180, 'drilling', 'Eagle Ford', 10, NOW(), NOW()),
  ('plan-001-11', 'well-001', 11, 7500, 8200, 160, 'drilling', 'Eagle Ford', 11, NOW(), NOW()),
  ('plan-001-12', 'well-001', 12, 8200, 8500, 120, 'completion', 'Eagle Ford', 12, NOW(), NOW());

-- Insertar datos de progreso real (DrillingData)
INSERT INTO "DrillingData" (id, "wellId", date, depth, rop, "mudDensity", pressure, temperature, "rotarySpeed", "weightOnBit", "standpipePressure", operation, formation, "createdAt", "updatedAt")
VALUES 
  ('data-001-1', 'well-001', '2024-01-01', 480, 240, 8.5, 500, 85, 120, 25, 1200, 'drilling', 'Surface', NOW(), NOW()),
  ('data-001-2', 'well-001', '2024-01-02', 1150, 335, 9.0, 800, 90, 125, 28, 1400, 'drilling', 'Surface', NOW(), NOW()),
  ('data-001-3', 'well-001', '2024-01-03', 1980, 395, 9.2, 1200, 95, 130, 30, 1600, 'drilling', 'Intermediate', NOW(), NOW()),
  ('data-001-4', 'well-001', '2024-01-04', 2750, 385, 9.5, 1500, 100, 128, 32, 1800, 'drilling', 'Intermediate', NOW(), NOW()),
  ('data-001-5', 'well-001', '2024-01-05', 3550, 340, 10.0, 1800, 105, 125, 35, 2000, 'drilling', 'Production', NOW(), NOW()),
  ('data-001-6', 'well-001', '2024-01-06', 4320, 295, 10.2, 2100, 110, 120, 38, 2200, 'drilling', 'Production', NOW(), NOW()),
  ('data-001-7', 'well-001', '2024-01-07', 5100, 275, 10.5, 2400, 115, 118, 40, 2400, 'drilling', 'Eagle Ford', NOW(), NOW()),
  ('data-001-8', 'well-001', '2024-01-08', 5850, 245, 10.8, 2700, 120, 115, 42, 2600, 'drilling', 'Eagle Ford', NOW(), NOW()),
  ('data-001-9', 'well-001', '2024-01-09', 6550, 195, 11.0, 3000, 125, 112, 45, 2800, 'drilling', 'Eagle Ford', NOW(), NOW()),
  ('data-001-10', 'well-001', '2024-01-10', 7200, 175, 11.2, 3300, 130, 110, 48, 3000, 'drilling', 'Eagle Ford', NOW(), NOW()),
  ('data-001-11', 'well-001', '2024-01-11', 7900, 155, 11.5, 3600, 135, 108, 50, 3200, 'drilling', 'Eagle Ford', NOW(), NOW()),
  ('data-001-12', 'well-001', '2024-01-12', 8500, 110, 12.0, 3900, 140, 105, 52, 3400, 'completion', 'Eagle Ford', NOW(), NOW());

-- Verificar que los datos se insertaron correctamente
SELECT 'Drilling Plan creado:' as info;
SELECT COUNT(*) as total_plan_records FROM "DrillingPlan";

SELECT 'Drilling Data creado:' as info;
SELECT COUNT(*) as total_data_records FROM "DrillingData";

SELECT 'Resumen por día:' as info;
SELECT 
  dp.day,
  dp."depthTo" as planned_depth,
  dd.depth as actual_depth,
  dp."plannedROP" as planned_rop,
  dd.rop as actual_rop
FROM "DrillingPlan" dp
LEFT JOIN "DrillingData" dd ON dp."wellId" = dd."wellId" AND dp.day = EXTRACT(day FROM dd.date)
WHERE dp."wellId" = 'well-001'
ORDER BY dp.day;