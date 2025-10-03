-- Script SQL para crear usuario administrador en PostgreSQL
-- Ejecutar en la consola de Heroku: psql $DATABASE_URL < scripts/create-admin.sql

-- Insertar usuario administrador
MERGE INTO "User" u
USING (SELECT
    'admin-001' AS id,
    'admin@wellwizards.com' AS email,
    'Administrador' AS name,
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' AS password,
    'admin' AS role
  FROM dual) src
ON (u.email = src.email)
WHEN MATCHED THEN
  UPDATE SET
    u.name = src.name,
    u.password = src.password,
    u.role = src.role,
    u."updatedAt" = SYSDATE
WHEN NOT MATCHED THEN
  INSERT (id, email, name, password, role, "createdAt", "updatedAt")
  VALUES (src.id, src.email, src.name, src.password, src.role, SYSDATE, SYSDATE);

-- Verificar que el usuario se creó correctamente
SELECT id, email, name, role, "createdAt" FROM "User" WHERE email = 'admin@wellwizards.com';