-- Script SQL para crear usuario administrador en PostgreSQL
-- Ejecutar en la consola de Heroku: psql $DATABASE_URL < scripts/create-admin.sql

-- Insertar usuario administrador
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@wellwizards.com',
  'Administrador',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  "updatedAt" = NOW();

-- Verificar que el usuario se creó correctamente
SELECT id, email, name, role, "createdAt" FROM "User" WHERE email = 'admin@wellwizards.com';