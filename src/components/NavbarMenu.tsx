'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import SearchModal from './SearchModal'
import {
  getNavbarAvatar,
  getMyProfile,
} from '@/features/profile/services/profileService'
import { signOutUser } from '@/features/auth/services/authService'

export default function NavbarMenu() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    async function fetchProfileData() {
      try {
        // Navbar profil fotoğrafını getir
        const url = await getNavbarAvatar()
        setAvatarUrl(url)

        // Giriş yapan kullanıcının profil bilgilerini getir
        const { profile } = await getMyProfile()

        if (profile?.username) {
          setUsername(profile.username)
        }
      } catch (error) {
        console.error(
          'Navbar profil bilgileri yüklenirken hata:',
          error
        )
      }
    }

    fetchProfileData()
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
      <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">

        {/* Arama */}
        <button
          onClick={() => setIsSearchOpen(true)}
          title="Geliştirici Ara"
          className="
            group
            w-12 h-12
            rounded-full
            bg-white
            border border-[#E8E2D5]
            shadow-md
            flex items-center justify-center
            text-[#5C5247]
            transition-all duration-200
            hover:-translate-x-1
            hover:shadow-lg
            hover:bg-[#F8F6F1]
          "
        >
          <span className="text-lg group-hover:scale-110 transition-transform">
            🔍
          </span>
        </button>

        {/* Ana Sayfa */}
        <Link
          href="/dashboard"
          title="Ana Sayfa"
          className="
            group
            w-12 h-12
            rounded-full
            bg-white
            border border-[#E8E2D5]
            shadow-md
            flex items-center justify-center
            text-[#5C5247]
            transition-all duration-200
            hover:-translate-x-1
            hover:shadow-lg
            hover:bg-[#F8F6F1]
          "
        >
          <span className="text-lg group-hover:scale-110 transition-transform">
            🏠
          </span>
        </Link>

        {/* Profil */}
        <Link
          href={
            username
              ? `/dashboard/profile/${username}`
              : '/dashboard/profile'
          }
          title="Profilim"
          className="
            group
            w-12 h-12
            rounded-full
            bg-white
            border border-[#E8E2D5]
            shadow-md
            flex items-center justify-center
            overflow-hidden
            transition-all duration-200
            hover:-translate-x-1
            hover:shadow-lg
            hover:bg-[#F8F6F1]
          "
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profil"
              className="
                w-full
                h-full
                object-cover
                group-hover:scale-105
                transition-transform
              "
            />
          ) : (
            <span className="text-lg">
              👤
            </span>
          )}
        </Link>

        {/* Çıkış */}
        <button
          onClick={handleLogout}
          title="Çıkış Yap"
          className="
            group
            w-12 h-12
            rounded-full
            bg-[#EF4444]
            border border-[#DC2626]
            shadow-md
            flex items-center justify-center
            text-white
            transition-all duration-200
            hover:-translate-x-1
            hover:shadow-lg
            hover:bg-[#DC2626]
          "
        >
          <span className="text-lg group-hover:scale-110 transition-transform">
            ⏻
          </span>
        </button>

      </nav>

      {/* Arama Modalı */}
      {isSearchOpen && (
        <SearchModal
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </>
  )
}