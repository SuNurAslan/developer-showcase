'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AddProjectPage() {
  const supabase = createClient()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        router.push('/login')
        return
      }

      let imageUrl = ''

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('Project-Image')
          .upload(filePath, imageFile)

        if (uploadError) {
          throw new Error('Görsel yüklenemedi: ' + uploadError.message)
        }

        const { data: publicURLData } = supabase.storage
          .from('Project-Image')
          .getPublicUrl(filePath)

        imageUrl = publicURLData.publicUrl
      }

      const { error: insertError } = await supabase.from('projects').insert([
        {
          user_id: user.id,
          title,
          description,
          github_url: githubUrl,
          demo_url: demoUrl,
          image_url: imageUrl,
        },
      ])

      if (insertError) {
        throw new Error('Proje kaydedilemedi: ' + insertError.message)
      }

      router.refresh()
      router.push('/dashboard')
      
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Bir hata oluştu.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#F4F1EA] p-8 shadow-xl rounded-2xl border border-[#E8E2D5]">
        <h1 className="text-2xl font-extrabold mb-6 text-[#3E3A36] border-b border-[#E8E2D5] pb-3">Yeni Proje Ekle</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#57534E] mb-1">Proje Adı</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Akıllı Toprak Sulama Sistemi"
              className="w-full rounded-xl bg-white border border-[#D6CFC7] p-2.5 text-[#3E3A36] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#57534E] mb-1">Proje Açıklaması</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Projeniz ne yapıyor?"
              className="w-full rounded-xl bg-white border border-[#D6CFC7] p-2.5 text-[#3E3A36] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#57534E] mb-1">GitHub Linki</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full rounded-xl bg-white border border-[#D6CFC7] p-2.5 text-[#3E3A36] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#57534E] mb-1">Canlı Demo Linki</label>
            <input
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl bg-white border border-[#D6CFC7] p-2.5 text-[#3E3A36] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#57534E] mb-1">Proje Görseli (Dosya Seç)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-[#57534E] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#E8E2D5] file:text-[#3E3A36] hover:file:bg-[#D6CFC7]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5C5247] hover:bg-[#4A4137] text-white font-semibold p-3 rounded-xl transition shadow-md disabled:opacity-50 mt-4"
          >
            {loading ? 'Yükleniyor...' : 'Projeyi Paylaş'}
          </button>
        </form>
      </div>
    </div>
  )
}