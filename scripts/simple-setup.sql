-- Script SQL ULTRA SIMPLE - Paso a paso
-- Sin subconsultas ni CTEs

-- 1. LIMPIAR TODO
DELETE FROM "DrillingData";
DELETE FROM "DrillingPlan";
DELETE FROM "Well";
DELETE FROM "Field";
DELETE FROM "Contract";
DELETE FROM "Client";
DELETE FROM "User" WHERE email = 'admin@wellwizards.com';

-- 2. CREAR DATOS SECUENCIALMENTE

-- Usuario
INSERT INTO "User" (email, name, password, role, "createdAt", "updatedAt") 
VALUES ('admin@wellwizards.com', 'Administrador', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW());

-- Cliente  
INSERT INTO "Client" (name, "createdAt", "updatedAt") 
VALUES ('Ecopetrol Demo', NOW(), NOW());

-- Verificar que se crearon
SELECT 'Datos base creados' as status;

-- Ahora necesitamos obtener los IDs para crear las relaciones
-- Esto lo haremos con un script separado de INSERTs que use los IDs directamente

SELECT 'Para continuar, necesitamos obtener los IDs generados' as next_step;
SELECT 'Ejecutar las siguientes consultas para obtener los IDs:' as instruction;
SELECT id as user_id FROM "User" WHERE email = 'admin@wellwizards.com';
SELECT id as client_id FROM "Client" WHERE name = 'Ecopetrol Demo';