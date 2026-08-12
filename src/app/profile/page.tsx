'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [cvUrl, setCvUrl] = useState('')
  
  const [uploading, setUploading] = useState(false)
  const [cvUploading, setCvUploading] = useState(false)

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        let { data, error } = await supabase
          .from('profiles')
          .select('username, full_name, bio, avatar_url, cv_url')
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          console.error(error)
        }

        if (data) {
          setUsername(data.username || '')
          setFullName(data.full_name || '')
          setBio(data.bio || '')
          setAvatarUrl(data.avatar_url || '')
          setCvUrl(data.cv_url || '')
        }
      } catch (error) {
        console.error('Profil yüklenirken hata oluştu:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [supabase])

  // Profil Güncelleme Fonksiyonu
  async function updateProfile(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const updates = {
        id: user.id,
        username,
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
        cv_url: cvUrl,
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      
      alert('Profil başarıyla güncellendi!')
      router.push('/dashboard')
    } catch (error: any) {
      alert('Güncelleme sırasında hata oluştu: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Avatar (Fotoğraf) Yükleme Fonksiyonu
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Lütfen yüklenecek bir resim seçin.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      alert('Fotoğraf yüklendi! Kaydetmeyi unutmayın.')
    } catch (error: any) {
      alert('Fotoğraf yüklenemedi: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  // CV (PDF) Yükleme Fonksiyonu
  async function uploadCv(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setCvUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Lütfen yüklenecek bir PDF dosyası seçin.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()

      if (fileExt?.toLowerCase() !== 'pdf') {
        throw new Error('Sadece PDF formatında dosya yükleyebilirsiniz.')
      }

      const fileName = `cv-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('cv')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('cv').getPublicUrl(filePath)
      setCvUrl(data.publicUrl)
      alert('CV başarıyla yüklendi! Kaydetmeyi unutmayın.')
    } catch (error: any) {
      alert('CV yüklenemedi: ' + error.message)
    } finally {
      setCvUploading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-[#F4F1EA] p-8 shadow-xl rounded-2xl border border-[#E8E2D5]">
          <h1 className="text-3xl font-extrabold mb-8 text-[#3E3A36] border-b border-[#E8E2D5] pb-4">Geliştirici Profili</h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-[#78716C] animate-pulse">Profil yükleniyor...</p>
            </div>
          ) : (
            <form onSubmit={updateProfile} className="space-y-6">
              
              {/* Avatar Görüntüleme ve Yükleme */}
              <div className="flex items-center space-x-6 bg-white/60 p-4 rounded-xl border border-[#E8E2D5]">
                <div className="w-24 h-24 bg-[#E8E2D5] rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-md flex-shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#8C7A6B] text-xs font-medium">Resim Yok</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#57534E] mb-1">Profil Fotoğrafı</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="text-sm text-[#78716C] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#E8E2D5] file:text-[#3E3A36] hover:file:bg-[#D6CFC7] cursor-pointer"
                  />
                </div>
              </div>

              {/* CV (PDF) Yükleme Alanı */}
              <div className="bg-white/60 p-4 rounded-xl border border-[#E8E2D5] space-y-2">
                <label className="block text-sm font-semibold text-[#57534E] mb-1">Özgeçmiş (CV - PDF)</label>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={uploadCv}
                    disabled={cvUploading}
                    className="text-sm text-[#78716C] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#E8E2D5] file:text-[#3E3A36] hover:file:bg-[#D6CFC7] cursor-pointer"
                  />
                  {cvUrl && (
                    <a 
                      href={cvUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-600 hover:underline font-semibold whitespace-nowrap bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 text-center"
                    >
                      📄 Yüklü CV'yi Görüntüle
                    </a>
                  )}
                </div>
              </div>

              {/* Kişisel Bilgiler Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#57534E] mb-1">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Kullanıcı adınız"
                    className="w-full rounded-xl bg-white border border-[#D6CFC7] p-2.5 shadow-sm text-[#3E3A36] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#57534E] mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Adınız ve Soyadınız"
                    className="w-full rounded-xl bg-white border border-[#D6CFC7] p-2.5 shadow-sm text-[#3E3A36] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Biyografi */}
              <div>
                <label className="block text-sm font-semibold text-[#57534E] mb-1">Hakkımda / Biyografi</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Kendinizden, teknolojilerden ve hedeflerinizden bahsedin..."
                  className="w-full rounded-xl bg-white border border-[#D6CFC7] p-2.5 shadow-sm text-[#3E3A36] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition"
                />
              </div>

              {/* Kaydet Butonu */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5C5247] hover:bg-[#4A4137] text-white font-semibold p-3 rounded-xl transition shadow-md disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}