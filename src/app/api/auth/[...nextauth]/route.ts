import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('🔐 NextAuth - Intentando autenticar:', credentials?.email)
          console.log('🔐 NextAuth - Password recibido:', credentials?.password ? '****' : 'VACÍO')
          
          if (!credentials?.email || !credentials?.password) {
            console.log('❌ NextAuth - Credenciales faltantes')
            return null
          }

          console.log('🔍 NextAuth - Buscando usuario en BD...')
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          console.log('👤 NextAuth - Usuario encontrado:', !!user)
          if (user) {
            console.log('👤 NextAuth - User ID:', user.id)
            console.log('👤 NextAuth - User Role:', user.role)
            console.log('👤 NextAuth - Hash length:', user.password.length)
          }

          if (!user) {
            console.log('❌ NextAuth - Usuario no encontrado en BD')
            return null
          }

          console.log('🔑 NextAuth - Comparando passwords...')
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('🔑 NextAuth - Contraseña válida:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('❌ NextAuth - Contraseña incorrecta')
            return null
          }

          console.log('✅ NextAuth - Autenticación exitosa para:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role,
          }
        } catch (error) {
          console.error('💥 NextAuth - Error en authorize:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'role' in user) {
        token.role = user.role as string
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }