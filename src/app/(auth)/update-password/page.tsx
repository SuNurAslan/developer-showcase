'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkSession, updatePassword } from '@/features/auth/services/authService'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter()

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await checkSession()
        if (!session) {
          setErrorMessage('Şifre değiştirme oturumu bulunamadı veya bağlantının süresi dolmuş. Lütfen tekrar şifre sıfırlama isteği gönderin.')
        }
      } catch (err) {
        setErrorMessage('Oturum doğrulanırken bir hata oluştu.')
      } finally {
        setCheckingSession(false)
      }
    }

    verifySession()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır.')
      return
    }

    setLoading(true)

    try {
      await updatePassword(password)
      alert('Şifreniz başarıyla güncellendi! Şimdi yeni şifrenizle giriş yapabilirsiniz.')
      router.push('/login')
    } catch (error: any) {
      alert('Hata: ' + error.message)
      if (error.message.includes('Oturum süresi dolmuş')) {
        router.push('/forgot-password')
      }
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <p className="text-[#57534E]">Oturum doğrulanıyor...</p>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
        <div className="max-w-md w-full bg-[#F4F1EA] p-8 rounded-2xl shadow-lg border border-[#E8E2D5] text-center">
          <h1 className="text-2xl font-bold text-[#3E3A36] mb-4">Şifre Sıfırlama</h1>
          <p className="text-sm text-[#78716C] mb-6">{errorMessage}</p>
          <button
            onClick={() => router.push('/forgot-password')}
            className="w-full py-3 px-4 bg-[#5C5247] hover:bg-[#4A4137] text-white font-medium rounded-xl shadow-md transition"
          >
            Tekrar Şifre Sıfırla
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
      <div className="max-w-md w-full bg-[#F4F1EA] p-8 rounded-2xl shadow-lg border border-[#E8E2D5]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#3E3A36]">Yeni Şifre Belirle</h1>
          <p className="text-sm text-[#78716C] mt-2">Hesabınız için yeni bir şifre belirleyin.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#57534E] mb-1">Yeni Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Yeni şifreniz"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D6CFC7] text-[#3E3A36] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#5C5247] hover:bg-[#4A4137] text-white font-medium rounded-xl shadow-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>
        </form>
      </div>
    </div>
  )
}