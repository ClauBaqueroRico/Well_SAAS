-- Script para limpiar datos existentes antes de insertar nuevos
-- Ejecutar SOLO si tienes datos duplicados o problemas de foreign keys

-- Limpiar en orden inverso para evitar problemas de foreign keys
DELETE FROM "DrillingData" WHERE "wellId" = 'well-001';
DELETE FROM "DrillingPlan" WHERE "wellId" = 'well-001';  
DELETE FROM "Well" WHERE id = 'well-001';
DELETE FROM "Field" WHERE id = 'field-001';
DELETE FROM "Contract" WHERE id = 'contract-001';
DELETE FROM "Client" WHERE id = 'client-001';
DELETE FROM "User" WHERE email = 'admin@wellwizards.com';

SELECT 'Base de datos limpiada' as mensaje;