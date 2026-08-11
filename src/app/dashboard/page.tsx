'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProtectedRoute from '@/components/ProtectedRoute'
import ProjectCard from '@/components/ProjectCard'

export default function DashboardPage() {
  const supabase = createClient()

  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeed() {
      try {
        setLoading(true)

        // 1. Önce giriş yapan kullanıcının ID'sini alalım (silme yetkisi için)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setCurrentUserId(user.id)
        }

        // 2. Projeleri ve bunları paylaşan kullanıcıların profillerini (profiles) birlikte çekelim
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            profiles (
              username,
              full_name,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        setProjects(data ?? [])
      } catch (error) {
        console.error('Akış yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [supabase])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-6">

          <h1 className="text-2xl font-bold text-[#3E3A36] text-center">
            Geliştirici Akışı
          </h1>

          {loading ? (
            <p className="text-center text-[#78716C] animate-pulse">
              Akış yükleniyor...
            </p>
          ) : projects.length === 0 ? (
            <div className="text-center bg-[#F4F1EA] p-8 rounded-2xl border border-[#E8E2D5]">
              <p className="text-[#78716C]">
                Henüz hiç proje paylaşılmamış. İlk projeyi sen ekle!
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                currentUserId={currentUserId} 
              />
            ))
          )}

        </div>
      </div>
    </ProtectedRoute>
  )
}