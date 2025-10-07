# Well Wizards SaaS Platform

Un sistema SaaS completo para la gestión y análisis de datos de pozos petrolíferos, construido con tecnologías modernas.

## Características

- **Autenticación Segura**: Sistema de login con NextAuth.js
- **Dashboard Interactivo**: Visualización en tiempo real de datos de pozos
- **Gestión de Contratos**: Sistema completo de contratos con clientes
- **Administración de Clientes**: Información detallada de empresas cliente
- **Gestión de Campos**: Organización por campos petroleros
- **Gestión de Pozos**: CRUD completo para administrar pozos con datos técnicos avanzados
- **Análisis de Datos**: Gráficos y reportes de producción
- **Time Performance Avanzado**: Comparativas multi-pozo con filtrado por contrato, formación y operación
- **Plan vs Real Analysis**: Análisis detallado de progreso planificado vs real para cada pozo
- **Drilling Plan Management**: Sistema completo de planificación de perforación día por día
- **Performance Metrics**: Métricas de eficiencia, varianzas y análisis de ROP
- **Sistema de Reportes Avanzado**: Generación de PDFs y Excel con filtros múltiples
- **Análisis Técnico**: Formation, hole section, operation y parámetros de perforación
- **Panel de Administración**: Gestión de usuarios y configuración
- **Responsive Design**: Interfaz optimizada para todos los dispositivos

### Funcionalidades Nuevas

- **Campos Técnicos Avanzados**: Formation, hole section, operation, mud type, bit type, etc.
- **Plan vs Real Analysis**: Sistema completo de comparación entre progreso planificado y real
- **Drilling Plan Database**: Base de datos con planes detallados día por día para cada pozo
- **Multi-Well Comparisons**: Visualización simultánea de todos los pozos
- **Performance Analytics**: Métricas de eficiencia, varianzas, ROP analysis y estadísticas avanzadas
- **Filtros Avanzados**: Por formación, operación, contrato, fechas
- **Exportación Múltiple**: PDFs profesionales y Excel con múltiples hojas
- **Análisis Geológico**: Lithology, porosity, permeability
- **Parámetros de Perforación**: RPM, WOB, torque, standpipe pressure
- **Datos Económicos**: Budget AFE, actual cost, daily rate
- **Time Performance Rediseñado**: Análisis individual de pozos con Plan vs Real
- **API de Plan vs Real**: Endpoints para obtener datos combinados de planificación y progreso real

## Stack Tecnológico

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: SQLite con Prisma ORM (PostgreSQL compatible)
- **Autenticación**: NextAuth.js
- **Visualización**: Chart.js para gráficos avanzados
- **Reportes**: jsPDF para PDFs, XLSX para Excel
- **UI Components**: Componentes personalizados con Tailwind
- **Análisis**: Multi-well comparison y performance analytics

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Dashboard principal
│   ├── wells/            # Gestión de pozos
│   ├── api/              # API routes
│   └── layout.tsx        # Layout principal
├── components/           # Componentes reutilizables
│   ├── auth/            # Autenticación
│   ├── dashboard/       # Dashboard components
│   ├── layout/          # Layout components
│   └── providers/       # Context providers
├── lib/                 # Utilidades y configuración
└── prisma/             # Schema de base de datos
```

## Instalación y Configuración

### 1. Instalar Dependencias

Primero, asegúrate de tener Node.js instalado, luego ejecuta:

```bash
npm install
```

### 2. Configurar Base de Datos

Para usar la base de datos SQLite (recomendado para desarrollo):

```bash
# Generar cliente de Prisma y crear base de datos
npm run db:setup
```

Este comando:
1. Genera el cliente de Prisma
2. Crea la base de datos SQLite
3. Ejecuta el seed con datos de ejemplo

**Datos incluidos:**
- 3 clientes con información completa
- 3 contratos con diferentes estados y valores
- 15 campos distribuidos por contrato (6 campos originales + 9 nuevos)
- 50 pozos con información técnica detallada y datos realistas
- 5 usuarios (admin + 4 empleados con diferentes roles)
- 1,500+ registros de datos de perforación diarios
- **Planes de Perforación Completos**: 50 pozos con planes día por día (20-55 días cada uno)
- **Datos Plan vs Real**: Progreso planificado y real para análisis comparativo
- **Métricas de Performance**: ROP, eficiencia, varianzas y estadísticas avanzadas
- Métricas de presión, temperatura y especificaciones técnicas

**Configuración alternativa con PostgreSQL:**
1. Instala PostgreSQL
2. Crea una base de datos llamada `wellwizards`
3. Actualiza `.env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/wellwizards"
```

4. Ejecuta los comandos de Prisma:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 3. Configurar Prisma (solo si usas PostgreSQL)

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Ejecutar el Proyecto

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

### 5. Crear Usuario Administrador (Opcional)

Si no ejecutaste `npm run db:setup`, puedes crear solo el usuario admin:

```bash
npm run create-admin
```

**Credenciales incluidas en los datos de ejemplo:**
- **Admin**: admin@wellwizards.com / admin123
- **Ingeniero**: carlos@wellwizards.com / password123  
- **Operador**: ana@wellwizards.com / password123
- **Supervisor**: miguel@wellwizards.com / password123
- **Analista**: sofia@wellwizards.com / password123

## Funcionalidades Principales

### Dashboard Principal
- Resumen de pozos activos
- Métricas de producción en tiempo real
- Gráficos de tendencias
- Alertas y notificaciones

### Gestión de Pozos
- Lista completa de pozos
- Detalles técnicos (presión, temperatura, producción)
- Historial de mantenimiento
- Estados y ubicaciones

### Paneles de Menú
- **Dashboard**: Vista general del sistema con métricas clave y Time Performance avanzado
- **Contratos**: Gestión completa de contratos con clientes
- **Pozos**: Administración de pozos por campo con datos técnicos completos
- **Producción**: Análisis de producción y rendimiento
- **Análisis**: Reportes y métricas avanzadas
- **Reportes**: Sistema avanzado de generación de PDFs y Excel con filtros múltiples
- **Administración**: Configuración del sistema y usuarios

### Time Performance Avanzado
- **Filtrado Multi-Nivel**: Por contrato, pozo, formación, operación
- **Comparativas Simultáneas**: Todos los pozos en un solo gráfico
- **Análisis de Eficiencia**: ROP vs objetivo, efficiency metrics
- **Depth vs Day**: Visualización de progreso planificado vs real
- **Insights Automáticos**: Mejor rendimiento, oportunidades de mejora

### Sistema de Reportes Profesional
- **PDFs Ejecutivos**: Con estadísticas, gráficos y análisis
- **Excel Multi-Hoja**: Wells Summary, Performance Analytics, Formation Analysis, Contract Performance
- **Filtros Avanzados**: Fechas, pozos, contratos, formaciones, operaciones
- **Preview en Tiempo Real**: Vista previa de datos antes de generar

## Autenticación

El sistema utiliza NextAuth.js con:
- Autenticación por credenciales
- Sesiones JWT
- Protección de rutas
- Roles de usuario

### Usuarios de Prueba

**Administrador**
- Email: `admin@wellwizards.com`
- Contraseña: `admin123`

### Registro de Nuevos Usuarios

Los usuarios pueden registrarse accediendo a `/auth/register` o hacer clic en "Regístrate aquí" desde la página principal.

## Diseño

- Interfaz moderna con Tailwind CSS
- Componentes responsive
- Tema consistente con colores Well Wizards
- Iconos y elementos visuales intuitivos

## Integración con Well Wizards

El sistema está diseñado para integrarse con datos de Well Wizards:
- API REST para importar datos
- Sincronización automática
- Transformación de datos
- Validación y limpieza

## 🔧 Desarrollo

### Scripts Disponibles

```bash
npm run dev       # Desarrollo
npm run build     # Construcción para producción
npm run start     # Ejecutar en producción
npm run lint      # Linter
npm run db:push   # Sincronizar schema con DB
npm run db:migrate # Ejecutar migraciones
```

### Convenciones

- Componentes funcionales con hooks
- TypeScript estricto
- Nombres descriptivos en español
- Documentación en código

## Próximos Pasos

- [ ] Implementar sistema de notificaciones
- [ ] Agregar más tipos de gráficos
- [ ] API para aplicaciones móviles
- [ ] Sistema de backup automático
- [ ] Integración con servicios externos
- [ ] Análisis predictivo con IA

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.