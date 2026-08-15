'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ProjectCard from '@/features/projects/components/ProjectCard'
import { getUserByUsername } from '@/features/profile/services/profileService'

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()

  const username = params?.username
    ? String(params.username)
    : null

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
        // Giriş yapan kullanıcıyı al
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setCurrentUserId(user.id)
        }

        // Profil ve projeleri servisten getir
        const {
          profile: userData,
          projects: projectData,
        } = await getUserByUsername(username)

        setProfile(userData)
        setProjects(projectData)
      } catch (error) {
        console.error('Profil yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-[#78716C] animate-pulse">
          Profil yükleniyor...
        </p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-[#78716C]">
          Kullanıcı bulunamadı.
        </p>
      </div>
    )
  }

  // Görüntülenen profil giriş yapan kullanıcıya mı ait?
  const isOwnProfile = currentUserId === profile.id

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">

        {/* Üst Alan */}
        <div className="relative bg-[#F4F1EA] border border-[#E8E2D5] rounded-2xl p-8 shadow-md">

          {/* Profili Düzenle */}
          {isOwnProfile && (
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="absolute top-6 right-6 px-4 py-2 bg-[#5C5247] hover:bg-[#3E3A36] text-white text-sm font-semibold rounded-xl transition shadow-sm"
            >
              Profili Düzenle
            </button>
          )}

          {/* Profil Bilgileri */}
          <div className="text-center space-y-3">

            {/* Profil Fotoğrafı */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profil Fotoğrafı"
                className="w-28 h-28 rounded-full mx-auto object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#8C7A6B] mx-auto flex items-center justify-center text-3xl font-bold text-white">
                {profile.full_name?.charAt(0).toUpperCase() ||
                  profile.username?.charAt(0).toUpperCase() ||
                  'U'}
              </div>
            )}

            {/* Ad Soyad */}
            <h1 className="text-3xl font-bold text-[#3E3A36]">
              {profile.full_name || 'İsimsiz Kullanıcı'}
            </h1>

            {/* Kullanıcı Adı */}
            <p className="text-[#78716C]">
              @{profile.username}
            </p>

            {/* Biyografi */}
            {profile.bio && (
              <p className="text-sm text-[#57534E] max-w-lg mx-auto italic">
                {profile.bio}
              </p>
            )}

            {/* CV */}
            {profile.cv_url && (
              <div className="pt-3">
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#E8E2D5] text-[#5C5247] border border-[#D6CFC7] px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
                >
                  📄 CV'yi Görüntüle
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Projeler */}
        <div className="space-y-5">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#3E3A36]">
              {isOwnProfile ? 'Projelerim' : 'Projeleri'}
            </h2>

            {isOwnProfile && (
              <span className="text-sm text-[#78716C]">
                {projects.length} proje
              </span>
            )}
          </div>

          {projects.length > 0 ? (
            <div className="space-y-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-[#F4F1EA] p-8 rounded-2xl border border-[#E8E2D5]">
              <p className="text-[#78716C]">
                {isOwnProfile
                  ? 'Henüz bir projeniz yok.'
                  : 'Bu kullanıcının henüz projesi yok.'}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}