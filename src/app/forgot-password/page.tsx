'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setMessage('Hata: ' + error.message)
    } else {
      setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
      <div className="max-w-md w-full bg-[#F4F1EA] p-8 rounded-2xl shadow-lg border border-[#E8E2D5]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#3E3A36]">Şifremi Unuttum</h1>
          <p className="text-sm text-[#78716C] mt-2">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#5C5247] hover:bg-[#4A4137] text-white font-medium rounded-xl shadow-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-[#57534E] font-medium">{message}</p>
        )}

        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-[#6C635B] hover:text-[#3E3A36] font-medium transition">
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  )
}