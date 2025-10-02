# Despliegue en Heroku - Well Wizards SaaS

## Guía de Despliegue

### 1. Crear App en Heroku

```bash
# Instalar Heroku CLI si no está instalado
# Luego ejecutar:
heroku create tu-app-name
```

### 2. Configurar Variables de Entorno

En el dashboard de Heroku o usando CLI:

```bash
# Base de datos (Heroku Postgres la configurará automáticamente)
heroku addons:create heroku-postgresql:mini

# NextAuth configuration
heroku config:set NEXTAUTH_URL=https://tu-app-name.herokuapp.com
heroku config:set NEXTAUTH_SECRET=tu-clave-secreta-muy-segura-de-al-menos-32-caracteres

# Verificar configuración
heroku config
```

### 3. Configurar Base de Datos

El proyecto está configurado para usar PostgreSQL en producción:

```bash
# Después del primer deploy, ejecutar:
heroku run npx prisma db push
heroku run npm run db:seed
```

### 4. Deploy

```bash
git push heroku main
```

### 5. Verificar Deploy

```bash
heroku logs --tail
heroku open
```

## Variables de Entorno Requeridas

- `DATABASE_URL`: Configurada automáticamente por Heroku Postgres
- `NEXTAUTH_URL`: URL de tu aplicación en Heroku
- `NEXTAUTH_SECRET`: Clave secreta para NextAuth.js

## Comandos Útiles

```bash
# Ver logs
heroku logs --tail

# Ejecutar comandos en Heroku
heroku run npm run db:seed

# Restart app
heroku restart

# Ver información de la app
heroku info
```

## Estructura para Heroku

El proyecto incluye:
- ✅ `Procfile` - Define cómo ejecutar la app
- ✅ `package.json` - Scripts optimizados para Heroku
- ✅ `next.config.js` - Configuración de Next.js
- ✅ Prisma configurado para PostgreSQL
- ✅ Variables de entorno documentadas

## Funcionalidades Incluidas

- ✅ Sistema de autenticación completo
- ✅ Dashboard con Plan vs Real analysis
- ✅ Base de datos con 50 pozos y planes de perforación
- ✅ APIs REST para todas las funcionalidades
- ✅ Gestión de contratos y clientes
- ✅ Sistema de reportes avanzado
- ✅ Responsive design

## Notas Importantes

1. **Primera vez**: Después del deploy inicial, ejecutar `heroku run npm run db:seed` para poblar la base de datos
2. **Credenciales**: El usuario admin será creado automáticamente: `admin@wellwizards.com / admin123`
3. **Base de datos**: Heroku Postgres free tier tiene límite de 10,000 rows
4. **Build time**: El primer build puede tomar 3-5 minutos debido a Prisma

## Solución de Problemas

### Error de build:
```bash
heroku logs --tail
# Buscar errores en la compilación
```

### Error de base de datos:
```bash
heroku run npx prisma db push --force-reset
heroku run npm run db:seed
```

### Error de variables de entorno:
```bash
heroku config
# Verificar que todas las variables estén configuradas
```