-- PASO 2: Completar inserción con IDs específicos
-- Reemplaza USER_ID y CLIENT_ID con los valores obtenidos del paso anterior

-- EJEMPLO: Si USER_ID = 1 y CLIENT_ID = 1, reemplaza en todo el script

-- CREAR CONTRATO
INSERT INTO "Contract" (name, "startDate", "endDate", value, "clientId", "userId", "createdAt", "updatedAt")
VALUES ('Contrato Demo', '2024-01-01', '2024-12-31', 500000, CLIENT_ID, USER_ID, NOW(), NOW());

-- CREAR CAMPO (reemplaza CONTRACT_ID con el ID del contrato creado)
INSERT INTO "Field" (name, location, "contractId", "createdAt", "updatedAt")
VALUES ('Campo Demo', 'Colombia', CONTRACT_ID, NOW(), NOW());

-- CREAR POZO (reemplaza FIELD_ID con el ID del campo creado)
INSERT INTO "Well" (name, location, "userId", "fieldId", "createdAt", "updatedAt")
VALUES ('Pozo Demo-1', 'Colombia', USER_ID, FIELD_ID, NOW(), NOW());

-- CREAR PLAN DE PERFORACIÓN (reemplaza WELL_ID con el ID del pozo creado)
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt")
VALUES 
(WELL_ID, 1, 0, 500, 250, 2.0, NOW(), NOW()),
(WELL_ID, 2, 500, 1200, 350, 2.0, NOW(), NOW()),
(WELL_ID, 3, 1200, 2000, 400, 2.0, NOW(), NOW()),
(WELL_ID, 4, 2000, 3000, 350, 2.9, NOW(), NOW()),
(WELL_ID, 5, 3000, 4000, 300, 3.3, NOW(), NOW());

-- CREAR DATOS REALES (reemplaza WELL_ID con el ID del pozo creado)
INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt")
VALUES 
(WELL_ID, 1, '2024-01-01', 480, NOW(), NOW()),
(WELL_ID, 2, '2024-01-02', 1150, NOW(), NOW()),
(WELL_ID, 3, '2024-01-03', 1980, NOW(), NOW()),
(WELL_ID, 4, '2024-01-04', 2950, NOW(), NOW()),
(WELL_ID, 5, '2024-01-05', 3950, NOW(), NOW());

-- VERIFICACIÓN FINAL
SELECT 'Base de datos poblada exitosamente' as mensaje;
SELECT COUNT(*) as usuarios FROM "User";
SELECT COUNT(*) as clientes FROM "Client";
SELECT COUNT(*) as contratos FROM "Contract";
SELECT COUNT(*) as campos FROM "Field";
SELECT COUNT(*) as pozos FROM "Well";
SELECT COUNT(*) as plan_records FROM "DrillingPlan";
SELECT COUNT(*) as drilling_records FROM "DrillingData";

-- Verificar datos Plan vs Real
SELECT 
  w.name as pozo,
  dp.day,
  dp."depthTo" as plan,
  dd.depth as real,
  (dd.depth - dp."depthTo") as diferencia
FROM "Well" w
JOIN "DrillingPlan" dp ON w.id = dp."wellId"
JOIN "DrillingData" dd ON w.id = dd."wellId" AND dp.day = dd.day
ORDER BY dp.day;