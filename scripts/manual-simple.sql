-- Script MANUAL ULTRA SIMPLE - Sin ninguna característica avanzada
-- Ejecutar línea por línea si es necesario

-- 1. LIMPIAR TODO
DELETE FROM "DrillingData";
DELETE FROM "DrillingPlan";
DELETE FROM "Well";
DELETE FROM "Field";
DELETE FROM "Contract";
DELETE FROM "Client";
DELETE FROM "User" WHERE email = 'admin@wellwizards.com';

-- 2. CREAR USUARIO (ID probablemente será 1)
INSERT INTO "User" (email, name, password, role, "createdAt", "updatedAt") 
VALUES ('admin@wellwizards.com', 'Administrador', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW());

-- 3. CREAR CLIENTE (ID probablemente será 1)
INSERT INTO "Client" (name, "createdAt", "updatedAt") 
VALUES ('Ecopetrol Demo', NOW(), NOW());

-- 4. CREAR CONTRATO (usando IDs 1,1 - ajustar si es diferente)
INSERT INTO "Contract" (name, "startDate", "endDate", value, "clientId", "userId", "createdAt", "updatedAt")
VALUES ('Contrato Demo', '2024-01-01', '2024-12-31', 500000, 1, 1, NOW(), NOW());

-- 5. CREAR CAMPO (ID contrato probablemente será 1)
INSERT INTO "Field" (name, location, "contractId", "createdAt", "updatedAt")
VALUES ('Campo Demo', 'Colombia', 1, NOW(), NOW());

-- 6. CREAR POZO (IDs usuario=1, campo=1)
INSERT INTO "Well" (name, location, "userId", "fieldId", "createdAt", "updatedAt")
VALUES ('Pozo Demo-1', 'Colombia', 1, 1, NOW(), NOW());

-- 7. CREAR PLAN DE PERFORACIÓN (ID pozo probablemente será 1)
INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt")
VALUES (1, 1, 0, 500, 250, 2.0, NOW(), NOW());

INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt")
VALUES (1, 2, 500, 1200, 350, 2.0, NOW(), NOW());

INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt")
VALUES (1, 3, 1200, 2000, 400, 2.0, NOW(), NOW());

INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt")
VALUES (1, 4, 2000, 3000, 350, 2.9, NOW(), NOW());

INSERT INTO "DrillingPlan" ("wellId", day, "depthFrom", "depthTo", "plannedROP", "plannedHours", "createdAt", "updatedAt")
VALUES (1, 5, 3000, 4000, 300, 3.3, NOW(), NOW());

-- 8. CREAR DATOS REALES (ID pozo = 1)
INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt")
VALUES (1, 1, '2024-01-01', 480, NOW(), NOW());

INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt")
VALUES (1, 2, '2024-01-02', 1150, NOW(), NOW());

INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt")
VALUES (1, 3, '2024-01-03', 1980, NOW(), NOW());

INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt")
VALUES (1, 4, '2024-01-04', 2950, NOW(), NOW());

INSERT INTO "DrillingData" ("wellId", day, date, depth, "createdAt", "updatedAt")
VALUES (1, 5, '2024-01-05', 3950, NOW(), NOW());

-- VERIFICAR RESULTADOS
SELECT COUNT(*) as usuarios FROM "User";
SELECT COUNT(*) as clientes FROM "Client";
SELECT COUNT(*) as contratos FROM "Contract";
SELECT COUNT(*) as campos FROM "Field";
SELECT COUNT(*) as pozos FROM "Well";
SELECT COUNT(*) as plan_records FROM "DrillingPlan";
SELECT COUNT(*) as drilling_records FROM "DrillingData";