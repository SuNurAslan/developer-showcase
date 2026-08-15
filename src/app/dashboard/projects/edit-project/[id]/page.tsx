'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getProjectById, updateProject, uploadEditProjectImage } from '@/features/projects/services/projectServices'

export default function EditProjectPage() {
  const router = useRouter()
  const { id } = useParams()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_url: '',
    demo_url: '',
    image_url: ''
  })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function fetchProject() {
      if (!id) return
      try {
        const data = await getProjectById(String(id))
        if (data) setFormData(data)
      } catch (error) {
        console.error('Proje yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

  // Yeni görsel yükleme fonksiyonu
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const publicUrl = await uploadEditProjectImage(file)
      setFormData({...formData, image_url: publicUrl})
    } catch (error: any) {
      alert('Görsel yüklenirken hata oluştu: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      await updateProject(String(id), formData)
      router.push('/dashboard')
    } catch (error: any) {
      alert('Hata oluştu: ' + error.message)
    }
  }

  if (loading) return <div className="text-center mt-20 text-[#78716C]">Yükleniyor...</div>

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-lg bg-[#F4F1EA] p-8 rounded-3xl border border-[#E8E2D5] shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-[#3E3A36] pb-3 border-b border-[#E8E2D5]">
          Projeyi Düzenle
        </h1>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">Proje Adı</label>
            <input 
              className="w-full p-3 rounded-xl border border-[#E8E2D5] bg-white text-[#3E3A36] text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">Proje Açıklaması</label>
            <textarea 
              className="w-full p-3 rounded-xl border border-[#E8E2D5] bg-white text-[#3E3A36] text-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">GitHub Linki</label>
            <input 
              className="w-full p-3 rounded-xl border border-[#E8E2D5] bg-white text-[#3E3A36] text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
              value={formData.github_url || ''} 
              onChange={(e) => setFormData({...formData, github_url: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">Canlı Demo Linki</label>
            <input 
              className="w-full p-3 rounded-xl border border-[#E8E2D5] bg-white text-[#3E3A36] text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
              value={formData.demo_url || ''} 
              onChange={(e) => setFormData({...formData, demo_url: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">
              Proje Görseli (Dosya Seç)
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-[#57534E] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#E8E2D5] file:text-[#57534E] hover:file:bg-[#D6CFC1]" 
            />
            {uploading && <p className="text-xs text-[#8C7A6B] mt-1">Görsel yükleniyor...</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#5C5247] text-white py-3.5 rounded-xl font-medium hover:bg-[#3E3A36] transition shadow-md mt-4"
          >
            Değişiklikleri Kaydet
          </button>
        </form>
      </div>
    </div>
  )
}