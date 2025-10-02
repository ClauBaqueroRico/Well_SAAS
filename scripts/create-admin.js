const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    // Verificar si ya existe un usuario admin
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@wellwizards.com' }
    })

    if (existingAdmin) {
      console.log('❗ El usuario administrador ya existe')
      return
    }

    // Crear contraseña hasheada
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Crear usuario administrador
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@wellwizards.com',
        password: hashedPassword,
        role: 'admin'
      }
    })

    console.log('✅ Usuario administrador creado exitosamente:')
    console.log('📧 Email: admin@wellwizards.com')
    console.log('🔑 Contraseña: admin123')
    console.log('⚠️  Cambia esta contraseña después del primer login')

  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()