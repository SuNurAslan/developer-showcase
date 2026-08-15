'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyUserSession } from '@/features/auth/services/authService'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      try {
        const session = await verifyUserSession()
        
        if (!session) {
          router.push('/login')
        } else {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Yetkilendirme kontrolünde hata:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-[#FDFBF7] text-[#78716C] animate-pulse">Yükleniyor...</div>
  }

  return isAuthenticated ? <>{children}</> : null
}