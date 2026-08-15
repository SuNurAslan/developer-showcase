'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { signOutUser } from '@/features/auth/services/authService'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOutUser()
      router.push('/login')
      router.refresh()
    } catch (error: any) {
      console.error('Çıkış yapılırken bir hata oluştu:', error.message)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-950/30 transition-colors rounded-md border border-red-500/20"
    >
      <LogOut className="w-4 h-4" />
      <span>Çıkış Yap</span>
    </button>
  )
}