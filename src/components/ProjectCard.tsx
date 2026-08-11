'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    github_url?: string
    demo_url?: string
    image_url?: string
    user_id: string
    profiles?: {
      username?: string
      full_name?: string
      avatar_url?: string
    }
  }
  currentUserId?: string | null
  onDelete?: (id: string) => void
}

export default function ProjectCard({ project, currentUserId, onDelete }: ProjectCardProps) {
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (!error) {
      if (onDelete) onDelete(id)
    } else {
      console.error('Silme hatası:', error.message)
    }
  }

  const displayName = project.profiles?.full_name || project.profiles?.username || 'Kullanıcı'

  return (
    <div className="bg-[#F4F1EA] border border-[#E8E2D5] rounded-2xl shadow-md overflow-hidden p-5 space-y-4">
      
      {/* Kullanıcı Bilgisi ve Profil Fotoğrafı */}
      <div className="flex items-center gap-3 pb-3 border-b border-[#E8E2D5]">
        {project.profiles?.avatar_url ? (
          <img 
            src={project.profiles.avatar_url} 
            alt={displayName} 
            className="w-9 h-9 rounded-full object-cover border border-[#E8E2D5]" 
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#8C7A6B] flex items-center justify-center text-xs font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <span className="text-xs font-semibold text-[#3E3A36] block">
            {displayName}
          </span>
          <span className="text-[10px] text-[#78716C]">Proje Sahibi</span>
        </div>
      </div>

      {project.image_url && (
        <img 
          src={project.image_url} 
          alt={project.title} 
          className="w-full h-48 object-cover rounded-xl border border-[#E8E2D5]" 
        />
      )}
      
      <div className="space-y-2">
        <h2 className="font-bold text-lg text-[#3E3A36]">{project.title}</h2>
        <p className="text-sm text-[#57534E]">{project.description}</p>
      </div>

      <div className="flex gap-3 text-sm">
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-[#5C5247] underline hover:text-[#3E3A36]">
            GitHub Repo
          </a>
        )}
        {project.demo_url && (
          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-[#5C5247] underline hover:text-[#3E3A36]">
            Canlı Demo
          </a>
        )}
      </div>

      {currentUserId === project.user_id && (
        <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D5]">
          <button 
            onClick={() => router.push(`/dashboard/edit-project/${project.id}`)}
            className="px-3 py-1.5 bg-[#8C7A6B] text-white rounded-lg text-xs hover:bg-[#5C5247] transition"
          >
            Düzenle
          </button>
          <button 
            onClick={() => handleDelete(project.id)}
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition"
          >
            Projeyi Sil
          </button>
        </div>
      )}
    </div>
  )
}