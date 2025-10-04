-- Script de verificación de estructura de base de datos
-- Ejecutar para revisar que todas las tablas y constraints estén correctos

-- 1. VERIFICAR TABLAS EXISTENTES
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. VERIFICAR CONSTRAINTS DE FOREIGN KEYS
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- 3. VERIFICAR CONSTRAINTS UNIQUE
SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- 4. VERIFICAR COLUMNAS DE CADA TABLA
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name IN ('User', 'Client', 'Contract', 'Field', 'Well', 'DrillingPlan', 'DrillingData')
ORDER BY table_name, ordinal_position;

-- 5. VERIFICAR INDICES
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN ('User', 'Client', 'Contract', 'Field', 'Well', 'DrillingPlan', 'DrillingData')
ORDER BY tablename, indexname;

-- 6. CONTAR REGISTROS ACTUALES
SELECT 'User' as tabla, COUNT(*) as registros FROM "User"
UNION ALL
SELECT 'Client' as tabla, COUNT(*) as registros FROM "Client"
UNION ALL
SELECT 'Contract' as tabla, COUNT(*) as registros FROM "Contract"
UNION ALL
SELECT 'Field' as tabla, COUNT(*) as registros FROM "Field"
UNION ALL
SELECT 'Well' as tabla, COUNT(*) as registros FROM "Well"
UNION ALL
SELECT 'DrillingPlan' as tabla, COUNT(*) as registros FROM "DrillingPlan"
UNION ALL
SELECT 'DrillingData' as tabla, COUNT(*) as registros FROM "DrillingData"
ORDER BY tabla;

-- 7. VERIFICAR INTEGRIDAD REFERENCIAL
-- Verificar que todos los wellId en DrillingPlan existen en Well
SELECT 'DrillingPlan orphaned wellId' as issue, COUNT(*) as count
FROM "DrillingPlan" dp
LEFT JOIN "Well" w ON dp."wellId" = w.id
WHERE w.id IS NULL

UNION ALL

-- Verificar que todos los wellId en DrillingData existen en Well
SELECT 'DrillingData orphaned wellId' as issue, COUNT(*) as count
FROM "DrillingData" dd
LEFT JOIN "Well" w ON dd."wellId" = w.id
WHERE w.id IS NULL

UNION ALL

-- Verificar que todos los userId en Well existen en User
SELECT 'Well orphaned userId' as issue, COUNT(*) as count
FROM "Well" w
LEFT JOIN "User" u ON w."userId" = u.id
WHERE u.id IS NULL

UNION ALL

-- Verificar que todos los fieldId en Well existen en Field
SELECT 'Well orphaned fieldId' as issue, COUNT(*) as count
FROM "Well" w
LEFT JOIN "Field" f ON w."fieldId" = f.id
WHERE w."fieldId" IS NOT NULL AND f.id IS NULL;

-- 8. VERIFICAR DATOS PARA PLAN VS REAL
SELECT 
    'Plan vs Real Data Check' as info,
    (SELECT COUNT(*) FROM "DrillingPlan") as plan_records,
    (SELECT COUNT(*) FROM "DrillingData") as data_records,
    (SELECT COUNT(DISTINCT "wellId") FROM "DrillingPlan") as wells_with_plan,
    (SELECT COUNT(DISTINCT "wellId") FROM "DrillingData") as wells_with_data;

-- 9. MOSTRAR DATOS PARA VERIFICACIÓN VISUAL
SELECT 'Current Wells:' as info;
SELECT id, name, "userId", "fieldId" FROM "Well" LIMIT 5;

SELECT 'Sample DrillingPlan:' as info;
SELECT "wellId", day, "depthFrom", "depthTo", "plannedROP" FROM "DrillingPlan" ORDER BY "wellId", day LIMIT 10;

SELECT 'Sample DrillingData:' as info;
SELECT "wellId", day, date, depth FROM "DrillingData" ORDER BY "wellId", day LIMIT 10;