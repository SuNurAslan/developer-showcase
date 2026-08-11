'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Çıkış yapılırken bir hata oluştu:', error.message)
      return
    }

    router.push('/login')
    router.refresh()
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