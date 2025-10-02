'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

interface Props {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  )
}