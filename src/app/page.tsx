'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, signOutUser } from '@/features/auth/services/authService'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await signOutUser()
      setUser(null)
      router.refresh()
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-[#78716C] animate-pulse">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E3A36] flex flex-col justify-between">
      {/* Üst Navigasyon Alanı */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-[#E8E2D5] bg-[#F4F1EA]/60 backdrop-blur-md">
        <h2 className="text-xl font-bold tracking-tight text-[#3E3A36]">Developer Showcase</h2>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#D6CFC7] text-[#3E3A36] hover:bg-[#E8E2D5] transition shadow-sm font-medium text-sm"
              >
                Profilim
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5C5247] text-white hover:bg-[#4A4137] transition shadow-sm font-medium text-sm"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-[#5C5247] text-white hover:bg-[#4A4137] transition shadow-sm font-medium text-sm"
            >
              Giriş Yap / Kayıt Ol
            </Link>
          )}
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="max-w-2xl bg-[#F4F1EA] p-10 rounded-3xl shadow-xl border border-[#E8E2D5]">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#3E3A36] mb-4">
            Developer Showcase'e Hoş Geldin!
          </h1>
          <p className="text-lg text-[#78716C] mb-8">
            {user ? 'Giriş işlemin başarıyla gerçekleşti. Projelerini sergilemeye başlayabilirsin.' : 'Yeteneklerini keşfettir, projelerini sergile ve diğer geliştiricilerle bağlantı kur.'}
          </p>

          {!user && (
            <Link
              href="/login"
              className="inline-block px-8 py-3.5 rounded-xl bg-[#5C5247] text-white font-medium hover:bg-[#4A4137] transition shadow-md"
            >
              Hemen Başla
            </Link>
          )}
        </div>
      </main>

      {/* Alt Bilgi */}
      <footer className="py-6 text-center text-xs text-[#A8A29E] border-t border-[#E8E2D5]">
        © 2026 Developer Showcase. Tüm hakları saklıdır.
      </footer>
    </div>
  )
}