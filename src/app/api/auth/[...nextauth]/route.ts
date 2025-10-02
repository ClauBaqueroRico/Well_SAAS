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
          console.log('Intentando autenticar:', credentials?.email)
          
          if (!credentials?.email || !credentials?.password) {
            console.log('Credenciales faltantes')
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          console.log('Usuario encontrado:', !!user)

          if (!user) {
            console.log('Usuario no encontrado')
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('Contraseña válida:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('Contraseña incorrecta')
            return null
          }

          console.log('Autenticación exitosa para:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0], // Usar email como fallback si name es null
            role: user.role,
          }
        } catch (error) {
          console.error('Error en authorize:', error)
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