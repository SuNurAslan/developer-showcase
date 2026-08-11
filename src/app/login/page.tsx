'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Kayıt başarılı! Lütfen e-postanızı kontrol edin veya giriş yapın.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
      <div className="max-w-md w-full bg-[#F4F1EA] p-8 rounded-2xl shadow-lg border border-[#E8E2D5]">
        
        {/* Başlık Alanı */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#3E3A36]">
            {isSignUp ? 'Aramıza Katılın' : 'Tekrar Hoş Geldiniz'}
          </h1>
          <p className="text-sm text-[#78716C] mt-2">
            {isSignUp ? 'Geliştirici profilini oluşturmak için kaydol.' : 'Projelerini sergilemek için giriş yap.'}
          </p>
        </div>

        {/* Form Alanı */}
        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#57534E] mb-1">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ornek@domain.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D6CFC7] text-[#3E3A36] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#57534E] mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D6CFC7] text-[#3E3A36] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#5C5247] hover:bg-[#4A4137] text-white font-medium rounded-xl shadow-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Yükleniyor...' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </form>

        {/* Mod Değiştirme Butonu */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-[#6C635B] hover:text-[#3E3A36] font-medium transition"
          >
            {isSignUp ? 'Zaten hesabın var mı? Giriş yap' : 'Hesabın yok mu? Kayıt ol'}
          </button>
        </div>

      </div>
    </div>
  )
}