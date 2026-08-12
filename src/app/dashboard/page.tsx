'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProtectedRoute from '@/components/ProtectedRoute'
import ProjectCard from '@/components/ProjectCard'

export default function DashboardPage() {
  const supabase = createClient()

  const [projects, setProjects] = useState<any[]>([])
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeed() {
      try {
        setLoading(true)

        // 1. Oturum açan kullanıcının ID'sini al
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setCurrentUserId(user.id)
        }

        // 2. Projeleri ve profilleri çek
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
        setFilteredProjects(data ?? [])
      } catch (error) {
        console.error('Akış yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [supabase])

  // Arama filtresi
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = projects.filter(
        (p) => 
          p.title?.toLowerCase().includes(query) ||
          p.profiles?.full_name?.toLowerCase().includes(query) ||
          p.profiles?.username?.toLowerCase().includes(query)
      )
      setFilteredProjects(filtered)
    }
  }, [searchQuery, projects])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-6">

          <h1 className="text-2xl font-bold text-[#3E3A36] text-center">
            Geliştirici Akışı & Keşfet
          </h1>

          {/* Arama Kutusu */}
          <div className="relative">
            <input
              type="text"
              placeholder="Proje adına veya geliştirici adına göre ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3.5 pl-4 rounded-2xl bg-[#F4F1EA] border border-[#E8E2D5] text-[#3E3A36] placeholder-[#8C7A6B] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] transition shadow-sm"
            />
          </div>

          {loading ? (
            <p className="text-center text-[#78716C] animate-pulse">
              Akış yükleniyor...
            </p>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center bg-[#F4F1EA] p-8 rounded-2xl border border-[#E8E2D5]">
              <p className="text-[#78716C]">
                Aradığınız kriterlere uygun proje bulunamadı.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
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