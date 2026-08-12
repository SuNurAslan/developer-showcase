'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import SearchModal from './SearchModal'

export default function NavbarMenu() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single()
        if (data) setAvatarUrl(data.avatar_url)
      }
    }
    getProfile()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <nav className="flex flex-col gap-3">
        {/* Arama Butonu */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          title="Geliştirici Ara"
          className="bg-white p-3 rounded-full shadow-lg border border-[#E8E2D5] hover:bg-[#FDFBF7] transition-all flex items-center justify-center w-12 h-12 text-xl"
        >
          🔍
        </button>

        <Link href="/dashboard" title="Akış" className="bg-white p-3 rounded-full shadow-lg border border-[#E8E2D5] hover:bg-[#FDFBF7] transition-all flex items-center justify-center w-12 h-12 text-xl">
          🏠
        </Link>

        <Link href="/dashboard/add-project" title="Yeni Proje Ekle" className="bg-white p-3 rounded-full shadow-lg border border-[#E8E2D5] hover:bg-[#FDFBF7] transition-all flex items-center justify-center w-12 h-12 text-xl">
          ➕
        </Link>

        {/* Profil Resimli Link */}
        <Link href="/profile" title="Profilini Düzenle" className="bg-white p-2 rounded-full shadow-lg border border-[#E8E2D5] hover:bg-[#FDFBF7] transition-all flex items-center justify-center w-12 h-12 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">👤</span>
          )}
        </Link>

        {/* Çıkış Butonu */}
        <button 
          onClick={handleLogout}
          title="Çıkış Yap"
          className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-all flex items-center justify-center w-12 h-12 text-xl"
        >
          ⏻
        </button>
      </nav>

      {/* Arama Modalı */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  )
}