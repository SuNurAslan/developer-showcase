import { createClient } from '@/lib/supabase/client'

// 1. Kullanıcının kendi profil bilgilerini çeker
export async function getMyProfile() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, profile: null }

  let { data, error } = await supabase
    .from('profiles')
    .select('username, full_name, bio, avatar_url, cv_url')
    .eq('id', user.id)
    .maybeSingle()

  if (error) throw error

  return { user, profile: data }
}

// 2. Profil bilgilerini günceller (upsert)
export async function updateMyProfile(updates: {
  id: string
  username: string
  full_name: string
  bio: string
  avatar_url: string
  cv_url: string
}) {
  const supabase = createClient()
  let { error } = await supabase.from('profiles').upsert(updates)
  if (error) throw error
  return true
}

// 3. Avatar (Resim) Yükleme Servisi
export async function uploadAvatarFile(file: File) {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  let { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
  return data.publicUrl
}

// 4. CV (PDF) Yükleme Servisi
export async function uploadCvFile(file: File) {
  const fileExt = file.name.split('.').pop()
  if (fileExt?.toLowerCase() !== 'pdf') {
    throw new Error('Sadece PDF formatında dosya yükleyebilirsiniz.')
  }

  const supabase = createClient()
  const fileName = `cv-${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  let { error: uploadError } = await supabase.storage
    .from('cv')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('cv').getPublicUrl(filePath)
  return data.publicUrl
}

// 5. Başkasının profilini ve projelerini çeken fonksiyon (Önceki adımda eklemiştik)
export async function getUserByUsername(username: string) {
  const supabase = createClient()

  const { data: userData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle()

  if (profileError) throw profileError
  if (!userData) return { profile: null, projects: [] }

  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('*, profiles(*)')
    .eq('user_id', userData.id)
    .order('created_at', { ascending: false })

  if (projectError) throw projectError

  return {
    profile: userData,
    projects: projectData || [],
  }
}
// Sadece Navbar için kullanıcının avatar URL'sini çeken servis
export async function getNavbarAvatar() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single()

  return data?.avatar_url || null
}
// Geliştirici arama servisi (SearchModal için)
export async function searchProfiles(searchTerm: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
    .limit(5)

  if (error) throw error
  return data || []
}