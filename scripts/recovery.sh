#!/bin/bash
# Script de recuperación completa para Heroku
# Ejecutar en la consola de Heroku

echo "🔄 Iniciando recuperación completa de base de datos..."

echo "1️⃣ Generando cliente Prisma..."
npx prisma generate

echo "2️⃣ Recreando tablas..."
npx prisma db push --force-reset

echo "3️⃣ Verificando tablas creadas..."
psql $DATABASE_URL -c "\dt"

echo "4️⃣ Creando usuario administrador..."
psql $DATABASE_URL -c "INSERT INTO \"User\" (id, email, name, password, role, \"createdAt\", \"updatedAt\") VALUES ('admin-001', 'admin@wellwizards.com', 'Administrador', '\$2a\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW()) ON CONFLICT (email) DO NOTHING;"

echo "5️⃣ Creando cliente de ejemplo..."
psql $DATABASE_URL -c "INSERT INTO \"Client\" (id, name, email, phone, address, \"contactPerson\", industry, \"createdAt\", \"updatedAt\") VALUES ('client-001', 'Empresa Demo', 'demo@empresa.com', '+1 555-0123', '123 Main Street, Houston, TX', 'Juan Pérez', 'Petróleo y Gas', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;"

echo "6️⃣ Creando contrato de ejemplo..."
psql $DATABASE_URL -c "INSERT INTO \"Contract\" (id, name, description, \"startDate\", \"endDate\", value, currency, status, \"contractType\", \"targetDepth\", \"expectedDays\", \"dailyRate\", \"clientId\", \"userId\", \"createdAt\", \"updatedAt\") VALUES ('contract-001', 'Contrato Demo', 'Contrato de demostración', '2024-01-01', '2024-12-31', 500000, 'USD', 'active', 'drilling', 10000, 45, 15000, 'client-001', 'admin-001', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;"

echo "7️⃣ Verificando datos creados..."
psql $DATABASE_URL -c "SELECT email, name, role FROM \"User\";"
psql $DATABASE_URL -c "SELECT name, status FROM \"Contract\";"

echo "✅ ¡Recuperación completa finalizada!"
echo "🔐 Credenciales: admin@wellwizards.com / admin123"