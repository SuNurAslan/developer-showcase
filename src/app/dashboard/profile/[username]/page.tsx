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
        // Giriş yapan kullanıcıyı bul
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setCurrentUserId(user.id)
        }

        // Profil ve projeleri getir
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

  // Bu profil giriş yapan kullanıcıya mı ait?
  const isOwnProfile = currentUserId === profile.id

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-10 px-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">

        {/* ================= PROFİL KARTI ================= */}
        <div className="relative bg-[#F4F1EA] rounded-2xl shadow-md border border-[#E8E2D5] overflow-hidden">

          {/* Profil Kartı İçeriği */}
          <div className="px-5 py-8 sm:px-10 sm:py-10 text-center">

            {/* Profil Düzenle */}
            {isOwnProfile && (
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="
                  absolute
                  top-4
                  right-4
                  sm:top-5
                  sm:right-5
                  bg-[#5C5247]
                  hover:bg-[#3E3A36]
                  text-white
                  px-3
                  py-1.5
                  rounded-lg
                  text-xs
                  font-semibold
                  shadow-sm
                  transition
                  duration-200
                "
              >
                Profil Düzenle
              </button>
            )}

            {/* Profil Fotoğrafı */}
            <div className="flex justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profil Fotoğrafı"
                  className="
                    w-28
                    h-28
                    sm:w-32
                    sm:h-32
                    rounded-full
                    object-cover
                    border-2
                    border-white
                    shadow-md
                  "
                />
              ) : (
                <div
                  className="
                    w-28
                    h-28
                    sm:w-32
                    sm:h-32
                    rounded-full
                    bg-[#8C7A6B]
                    flex
                    items-center
                    justify-center
                    text-3xl
                    sm:text-4xl
                    font-bold
                    text-white
                    border-2
                    border-white
                    shadow-md
                  "
                >
                  {profile.full_name?.charAt(0).toUpperCase() ||
                    profile.username?.charAt(0).toUpperCase() ||
                    'U'}
                </div>
              )}
            </div>

            {/* Ad Soyad */}
            <h1
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-[#3E3A36]
                mt-5
              "
            >
              {profile.full_name || profile.username}
            </h1>

            {/* Kullanıcı Adı */}
            <p className="text-[#78716C] mt-1.5 text-sm sm:text-base">
              @{profile.username}
            </p>

            {/* Biyografi */}
            {profile.bio && (
              <p
                className="
                  text-sm
                  text-[#57534E]
                  max-w-lg
                  mx-auto
                  italic
                  mt-4
                  leading-relaxed
                "
              >
                {profile.bio}
              </p>
            )}

            {/* CV */}
            {profile.cv_url && (
              <div className="mt-6 flex justify-center">
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    bg-white
                    hover:bg-[#F8F6F1]
                    text-[#3E3A36]
                    px-5
                    py-2.5
                    rounded-xl
                    font-semibold
                    text-sm
                    transition
                    duration-200
                    shadow-sm
                    border
                    border-[#D6CFC7]
                  "
                >
                  <span>📄</span>
                  CV'yi Görüntüle
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ================= PROJELER ================= */}
        <div className="space-y-5">

          {/* Başlık + Proje Ekle */}
          <div className="flex items-center justify-between gap-4">

            <h2
              className="
                text-2xl
                font-bold
                text-[#3E3A36]
              "
            >
              {isOwnProfile ? 'Projelerim' : 'Projeleri'}
            </h2>

            {/* Sadece kendi profilinde */}
            {isOwnProfile && projects.length > 0 && (
              <button
                onClick={() =>
                  router.push('/dashboard/projects/add-project')
                }
                className="
                  bg-[#5C5247]
                  hover:bg-[#3E3A36]
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-semibold
                  transition
                  shadow-md
                  whitespace-nowrap
                "
              >
                + Proje Ekle
              </button>
            )}
          </div>

          {/* ================= PROJE YOK ================= */}
          {projects.length === 0 ? (

            <div
              className="
                bg-[#F4F1EA]
                border
                border-[#E8E2D5]
                rounded-2xl
                p-8
                sm:p-10
                text-center
                shadow-sm
              "
            >

              <div className="text-5xl mb-4">
                📁
              </div>

              <h3
                className="
                  text-xl
                  font-bold
                  text-[#3E3A36]
                  mb-2
                "
              >
                Henüz bir projeniz yok.
              </h3>

              <p
                className="
                  text-sm
                  text-[#78716C]
                  mb-6
                  max-w-sm
                  mx-auto
                "
              >
                Yeni projenizi ekleyerek başlayabilirsiniz.
              </p>

              {/* Sadece kendi profilinde proje ekleme */}
              {isOwnProfile && (
                <button
                  onClick={() =>
                    router.push('/dashboard/projects/add-project')
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    bg-[#5C5247]
                    hover:bg-[#3E3A36]
                    text-white
                    px-5
                    py-2.5
                    rounded-xl
                    font-semibold
                    text-sm
                    transition
                    shadow-md
                  "
                >
                  <span className="text-lg">+</span>
                  Proje Ekle
                </button>
              )}
            </div>

          ) : (

            /* ================= PROJELER VAR ================= */
            <div className="space-y-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  currentUserId={currentUserId}
                />
              ))}
            </div>

          )}
        </div>
      </div>
    </div>
  )
}