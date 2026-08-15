'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Project } from '@/features/projects/types'
import {
  fetchProjectInteractions,
  addProjectInteraction,
  deleteProjectInteraction,
  deleteProjectById,
  subscribeToInteractions
} from '@/features/projects/services/projectServices'

interface ProjectCardProps {
  project: Project
  currentUserId?: string | null
  onDelete?: (id: string) => void
}

export default function ProjectCard({
  project,
  currentUserId,
  onDelete
}: ProjectCardProps) {

  const router = useRouter()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [interactions, setInteractions] = useState<any[]>([])

  // Yorumları getir
  const loadInteractions = async () => {
    try {
      const data = await fetchProjectInteractions(project.id)
      setInteractions(data)
    } catch (error) {
      console.error('Hata:', error)
    }
  }

  // Sayfa açıldığında yorumları getir + realtime dinle
  useEffect(() => {

    loadInteractions()

    const channel = subscribeToInteractions(
      project.id,
      () => {
        loadInteractions()
      }
    )

    return () => {
      channel.unsubscribe()
    }

  }, [project.id])

  // Yorum / puan ekleme
  const handleInteract = async () => {

    if (!currentUserId) {
      alert('Yorum yapmak için giriş yapmalısınız.')
      return
    }

    // Boş yorum ve puan kontrolü istersen burada yapılabilir
    if (!comment.trim() && rating === 0) {
      alert('Lütfen yorum veya puan ekleyin.')
      return
    }

    try {

      await addProjectInteraction({
        project_id: project.id,
        user_id: currentUserId,
        comment,
        rating
      })

      // Formu temizle
      setComment('')
      setRating(0)

      // Yorum listesini anında güncelle
      await loadInteractions()

    } catch (error: any) {

      console.error(
        'Etkileşim hatası:',
        error.message
      )

      alert(
        'Bir hata oluştu: ' +
        error.message
      )
    }
  }

  // Yorum silme
  const deleteComment = async (id: string) => {

    const confirmDelete = window.confirm(
      'Bu yorumu silmek istediğinize emin misiniz?'
    )

    if (!confirmDelete) return

    try {

      // Önce veritabanından sil
      await deleteProjectInteraction(id)

      // Sonra ekrandaki state'ten de hemen sil
      setInteractions((prev) =>
        prev.filter((item) => item.id !== id)
      )

    } catch (error: any) {

      console.error(
        'Silme hatası:',
        error.message
      )

      alert(
        'Yorum silinemedi. Yetkiniz olduğundan emin olun.'
      )
    }
  }

  // Proje silme
  const handleDelete = async (id: string) => {

    try {

      await deleteProjectById(id)

      if (onDelete) {
        onDelete(id)
      }

    } catch (error: any) {

      console.error(
        'Silme hatası:',
        error.message
      )
    }
  }

  const displayName =
    project.profiles?.full_name ||
    project.profiles?.username ||
    'Kullanıcı'

  const profileUsername =
    project.profiles?.username

  return (

    <div className="bg-[#F4F1EA] border border-[#E8E2D5] rounded-2xl shadow-md overflow-hidden p-5 space-y-4">

      {/* Kullanıcı Bilgisi */}
      <div className="flex items-center gap-3 pb-3 border-b border-[#E8E2D5]">

        {profileUsername ? (

          <Link
            href={`/dashboard/profile/${profileUsername}`}
            className="flex items-center gap-3 group"
          >

            {project.profiles?.avatar_url ? (

              <img
                src={project.profiles.avatar_url}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border border-[#E8E2D5] group-hover:opacity-90 transition"
              />

            ) : (

              <div className="w-9 h-9 rounded-full bg-[#8C7A6B] flex items-center justify-center text-xs font-bold text-white group-hover:bg-[#5C5247] transition">
                {displayName.charAt(0).toUpperCase()}
              </div>

            )}

            <div>

              <span className="text-xs font-semibold text-[#3E3A36] block group-hover:underline">
                {displayName}
              </span>

              <span className="text-[10px] text-[#78716C]">
                Proje Sahibi
              </span>

            </div>

          </Link>

        ) : (

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-[#8C7A6B] flex items-center justify-center text-xs font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div>

              <span className="text-xs font-semibold text-[#3E3A36] block">
                {displayName}
              </span>

              <span className="text-[10px] text-[#78716C]">
                Proje Sahibi
              </span>

            </div>

          </div>

        )}

      </div>


      {/* Proje Görseli */}
      {project.image_url && (

        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-48 object-cover rounded-xl border border-[#E8E2D5]"
        />

      )}


      {/* Proje Bilgileri */}
      <div className="space-y-2">

        <h2 className="font-bold text-lg text-[#3E3A36]">
          {project.title}
        </h2>

        <p className="text-sm text-[#57534E]">
          {project.description}
        </p>

      </div>


      {/* GitHub / Demo */}
      <div className="flex gap-3 text-sm">

        {project.github_url && (

          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5C5247] underline hover:text-[#3E3A36]"
          >
            GitHub Repo
          </a>

        )}

        {project.demo_url && (

          <a
            href={project.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5C5247] underline hover:text-[#3E3A36]"
          >
            Canlı Demo
          </a>

        )}

      </div>


      {/* Yorumlar Alanı */}
      <div className="pt-3 border-t border-[#E8E2D5] space-y-3">

        <h3 className="text-xs font-bold text-[#3E3A36]">
          Yorumlar ({interactions.length})
        </h3>


        {/* Yorum Listesi */}
        <div className="space-y-2 max-h-40 overflow-y-auto">

          {interactions.map((item) => (

            <div
              key={item.id}
              className="bg-white/60 p-2.5 rounded-xl border border-[#E8E2D5] text-xs space-y-1 group"
            >

              <div className="flex justify-between items-center">

                <span className="font-semibold text-[#3E3A36]">
                  {item.profiles?.full_name ||
                    item.profiles?.username ||
                    'Kullanıcı'}
                </span>

                <div className="flex items-center gap-2">

                  {item.rating > 0 && (

                    <span className="text-yellow-500 font-bold">
                      {'★'.repeat(item.rating)}
                    </span>

                  )}

                  {currentUserId === item.user_id && (

                    <button
                      onClick={() =>
                        deleteComment(item.id)
                      }
                      className="text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition px-1"
                      title="Yorumu sil"
                    >
                      ×
                    </button>

                  )}

                </div>

              </div>


              {item.comment && (

                <p className="text-[#57534E]">
                  {item.comment}
                </p>

              )}

            </div>

          ))}

        </div>


        {/* Yorum Formu */}
        <div className="space-y-2 pt-2">

          {/* Puan */}
          <div className="flex items-center gap-1">

            <span className="text-xs font-medium text-[#57534E] mr-2">
              Puan:
            </span>

            {[1, 2, 3, 4, 5].map((star) => (

              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-lg ${
                  star <= rating
                    ? 'text-yellow-500'
                    : 'text-gray-300'
                }`}
                type="button"
              >
                ★
              </button>

            ))}

          </div>


          {/* Yorum */}
          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Yorum yaz..."
            className="w-full p-2 rounded-lg border border-[#E8E2D5] text-sm bg-white"
            rows={2}
          />


          {/* Gönder */}
          <button
            onClick={handleInteract}
            className="bg-[#8C7A6B] text-white px-4 py-1.5 rounded-lg text-xs hover:bg-[#5C5247]"
          >
            Gönder
          </button>

        </div>

      </div>


      {/* Proje İşlemleri */}
      {currentUserId === project.user_id && (

        <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D5]">

          <button
            onClick={() =>
              router.push(
                `/dashboard/projects/edit-project/${project.id}`
              )
            }
            className="px-3 py-1.5 bg-[#8C7A6B] text-white rounded-lg text-xs hover:bg-[#5C5247]"
          >
            Düzenle
          </button>


          <button
            onClick={() =>
              handleDelete(project.id)
            }
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600"
          >
            Sil
          </button>

        </div>

      )}

    </div>
  )
}