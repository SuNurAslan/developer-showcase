'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ProjectCard from '@/components/ProjectCard'

export default function UserProfilePage() {
  const params = useParams()
  const username = params?.username ? String(params.username) : null
  
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      if (!username) return
      setLoading(true)

      try {
        // Oturum açan kullanıcının ID'sini al
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setCurrentUserId(user.id)
        }

        // 1. Kullanıcıyı bul
        const { data: userData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .maybeSingle()

        if (profileError) throw profileError

        if (userData) {
          setProfile(userData)

          // 2. O kullanıcının projelerini çek
          const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('*, profiles(*)')
            .eq('user_id', userData.id)
            .order('created_at', { ascending: false })
            
          if (projectError) throw projectError
          setProjects(projectData || [])
        }
      } catch (error) {
        console.error('Profil yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username, supabase])

  if (loading) return <div className="text-center py-10 text-[#78716C]">Profil yükleniyor...</div>
  if (!profile) return <div className="text-center py-10 text-[#78716C]">Kullanıcı bulunamadı.</div>

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Profil Başlığı */}
        <div className="text-center space-y-3">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} className="w-24 h-24 rounded-full mx-auto object-cover border border-[#E8E2D5]" alt="Avatar" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#8C7A6B] mx-auto flex items-center justify-center text-2xl font-bold text-white">
              {profile.full_name?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <h1 className="text-3xl font-bold text-[#3E3A36]">{profile.full_name}</h1>
          <p className="text-[#78716C]">@{profile.username}</p>

          {/* Biyografi */}
          {profile.bio && (
            <p className="text-sm text-[#57534E] max-w-md mx-auto italic">{profile.bio}</p>
          )}

          {/* CV Görüntüleme Butonu */}
          {profile.cv_url && (
            <div className="pt-2">
              <a 
                href={profile.cv_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5C5247] hover:bg-[#3E3A36] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-md"
              >
                📄 Özgeçmişimi (CV) İncele
              </a>
            </div>
          )}
        </div>

        {/* Projeler Bölümü */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#3E3A36]">Projeleri</h2>
          {projects.length > 0 ? (
            projects.map((p) => (
                <ProjectCard 
                    key={p.id} 
                    project={p} 
                    currentUserId={currentUserId}
                />
            ))
          ) : (
            <div className="text-center bg-[#F4F1EA] p-8 rounded-2xl border border-[#E8E2D5]">
                <p className="text-[#78716C]">Bu kullanıcının henüz projesi yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}