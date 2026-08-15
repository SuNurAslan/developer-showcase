import { createClient } from '@/lib/supabase/client'

// 1. Proje Görselini Storage'a Yükleme Servisi
export async function uploadProjectImage(imageFile: File, userId: string) {
  const supabase = createClient()
  const fileExt = imageFile.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
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

  return publicURLData.publicUrl
}

// 2. Yeni Projeyi Veritabanına Kaydetme Servisi
export async function createProject(projectData: {
  user_id: string
  title: string
  description: string
  github_url: string
  demo_url: string
  image_url: string
}) {
  const supabase = createClient()
  const { error: insertError } = await supabase.from('projects').insert([projectData])

  if (insertError) {
    throw new Error('Proje kaydedilemedi: ' + insertError.message)
  }

  return true
}
// 3. Tek bir projeyi ID'ye göre çekme (Düzenleme sayfası için)
export async function getProjectById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// 4. Projeyi Güncelleme Servisi
export async function updateProject(id: string, formData: any) {
  const supabase = createClient()
  const { error } = await supabase
    .from('projects')
    .update(formData)
    .eq('id', id)

  if (error) throw error
  return true
}

// 5. Düzenleme ekranına özel görsel yükleme (Bucket ismine göre)
export async function uploadEditProjectImage(file: File) {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `projects/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('edit project')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('edit project').getPublicUrl(filePath)
  return data.publicUrl
}

// 6. Dashboard Akışı İçin Tüm Projeleri ve Profilleri Çekme
export async function getDashboardFeed() {
  const supabase = createClient()
  
  // Oturum açan kullanıcıyı al
  const { data: { user } } = await supabase.auth.getUser()

  // Projeleri ve bağlı oldukları profilleri çek
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

  return {
    user,
    projects: data ?? []
  }
} 

// 7. Projeye ait yorumları ve puanları kullanıcı profilleriyle birlikte getir
export async function fetchProjectInteractions(projectId: string) {
  const supabase = createClient()

  const { data: interactionData, error: intError } = await supabase
    .from('project_interactions')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (intError || !interactionData) return []

  const userIds = interactionData.map(item => item.user_id)
  if (userIds.length === 0) return []

  const { data: profileData, error: profError } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .in('id', userIds)

  if (profError) return interactionData

  return interactionData.map(item => {
    const userProfile = profileData.find(p => p.id === item.user_id)
    return { ...item, profiles: userProfile || null }
  })
}

// 8. Yoruma veya puana ekleme yap
export async function addProjectInteraction(interaction: {
  project_id: string
  user_id: string
  comment: string
  rating: number
}) {
  const supabase = createClient()
  const { error } = await supabase
    .from('project_interactions')
    .insert(interaction)

  if (error) throw error
  return true
}

// 9. Yorumu sil
export async function deleteProjectInteraction(interactionId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('project_interactions')
    .delete()
    .eq('id', interactionId)

  if (error) throw error
  return true
}

// 10. Projeyi sil
export async function deleteProjectById(projectId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) throw error
  return true
}

// Realtime dinleyicisi
export function subscribeToInteractions(
  projectId: string,
  callback: () => void
) {
  const supabase = createClient()

  const channel = supabase
    .channel(`project-interactions-${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'project_interactions',
        filter: `project_id=eq.${projectId}`,
      },
      () => {
        callback()
      }
    )
    .subscribe()

  return channel
}
// Proje değişikliklerini realtime dinle
export function subscribeToProjects(callback: () => void) {
  const supabase = createClient()

  const channel = supabase
    .channel('projects-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects',
      },
      () => {
        callback()
      }
    )
    .subscribe()

  return channel
}