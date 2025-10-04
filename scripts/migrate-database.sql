-- Script de migración y corrección de estructura
-- Ejecutar si hay problemas de estructura en la base de datos

-- 1. CREAR ÍNDICES FALTANTES PARA MEJORAR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_well_userId ON "Well"("userId");
CREATE INDEX IF NOT EXISTS idx_well_fieldId ON "Well"("fieldId");
CREATE INDEX IF NOT EXISTS idx_drillingplan_wellId ON "DrillingPlan"("wellId");
CREATE INDEX IF NOT EXISTS idx_drillingdata_wellId ON "DrillingData"("wellId");
CREATE INDEX IF NOT EXISTS idx_drillingdata_date ON "DrillingData"(date);
CREATE INDEX IF NOT EXISTS idx_contract_clientId ON "Contract"("clientId");
CREATE INDEX IF NOT EXISTS idx_field_contractId ON "Field"("contractId");

-- 2. AGREGAR CONSTRAINTS FALTANTES SI NO EXISTEN
-- (PostgreSQL ignora si ya existen)

-- Verificar constraint de email único en User
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'User_email_key' 
        AND table_name = 'User'
    ) THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE (email);
    END IF;
END $$;

-- 3. VERIFICAR Y CORREGIR TIPOS DE DATOS
-- Asegurar que los campos de fecha sean del tipo correcto
-- (Solo si necesario - Prisma maneja esto automáticamente)

-- 4. LIMPIAR DATOS INCONSISTENTES
-- Eliminar registros huérfanos si existen
DELETE FROM "DrillingData" 
WHERE "wellId" NOT IN (SELECT id FROM "Well");

DELETE FROM "DrillingPlan" 
WHERE "wellId" NOT IN (SELECT id FROM "Well");

DELETE FROM "Well" 
WHERE "userId" NOT IN (SELECT id FROM "User");

DELETE FROM "Well" 
WHERE "fieldId" IS NOT NULL 
AND "fieldId" NOT IN (SELECT id FROM "Field");

-- 5. ACTUALIZAR ESTADÍSTICAS
ANALYZE "User";
ANALYZE "Client";
ANALYZE "Contract";
ANALYZE "Field";
ANALYZE "Well";
ANALYZE "DrillingPlan";
ANALYZE "DrillingData";

SELECT 'Database structure verified and corrected' as status;