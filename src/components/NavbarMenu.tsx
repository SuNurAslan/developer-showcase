'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import SearchModal from './SearchModal'
import {
  getMyProfile
} from '@/features/profile/services/profileService'
import { signOutUser } from '@/features/auth/services/authService'

export default function NavbarMenu() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { user, profile } = await getMyProfile()

        if (user && profile) {
          setAvatarUrl(profile.avatar_url || null)
          setUsername(profile.username || null)
        }
      } catch (error) {
        console.error('Navbar profil bilgileri yüklenirken hata:', error)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await signOutUser()
      router.push('/login')
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error)
    }
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

        {/* Ana Sayfa */}
        <Link
          href="/dashboard"
          title="Akış"
          className="bg-white p-3 rounded-full shadow-lg border border-[#E8E2D5] hover:bg-[#FDFBF7] transition-all flex items-center justify-center w-12 h-12 text-xl"
        >
          🏠
        </Link>

        {/* Yeni Proje */}
        <Link
          href="/dashboard/projects/add-project"
          title="Yeni Proje Ekle"
          className="bg-white p-3 rounded-full shadow-lg border border-[#E8E2D5] hover:bg-[#FDFBF7] transition-all flex items-center justify-center w-12 h-12 text-xl"
        >
          ➕
        </Link>

        {/* PROFİL */}
        {username ? (
          <Link
            href={`/dashboard/profile/${username}`}
            title="Profilim"
            className="bg-white p-2 rounded-full shadow-lg border border-[#E8E2D5] hover:bg-[#FDFBF7] transition-all flex items-center justify-center w-12 h-12 overflow-hidden"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </Link>
        ) : (
          <div
            className="bg-white p-2 rounded-full shadow-lg border border-[#E8E2D5] flex items-center justify-center w-12 h-12 overflow-hidden"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </div>
        )}

        {/* Çıkış */}
        <button
          onClick={handleLogout}
          title="Çıkış Yap"
          className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-all flex items-center justify-center w-12 h-12 text-xl"
        >
          ⏻
        </button>

      </nav>

      {/* Arama Modalı */}
      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  )
}