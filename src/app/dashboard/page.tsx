
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardPage() {
  const supabase = createClient()

  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
 async function fetchFeed() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('DATA:', data)
      console.log('ERROR:', error)

      if (error) throw error

      setProjects(data ?? [])
    } catch (error) {
      console.error('Akış yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchFeed()
  }, [])

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
              <div
                key={project.id}
                className="bg-[#F4F1EA] border border-[#E8E2D5] rounded-2xl shadow-md overflow-hidden"
              >

                {project.image_url && (
                  <div className="w-full h-64 bg-[#E8E2D5]">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <h2 className="font-bold text-lg text-[#3E3A36]">
                    {project.title}
                  </h2>

                  <p className="text-sm text-[#57534E]">
                    {project.description}
                  </p>

                  <div className="flex gap-4 pt-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#8C7A6B] hover:underline"
                      >
                        GitHub İncele →
                      </a>
                    )}

                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#8C7A6B] hover:underline"
                      >
                        Canlı Demo →
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}

        </div>
      </div>
    </ProtectedRoute>
  )
}