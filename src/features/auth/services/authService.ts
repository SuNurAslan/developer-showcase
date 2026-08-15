// src/features/auth/services/authService.ts
import { createClient } from '@/lib/supabase/client'

// Şifre sıfırlama isteği
export async function resetPassword(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  })
  if (error) throw error
  return true
}

// Giriş Yapma
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return true
}

// Kayıt Olma
export async function signUp(email: string, password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return true
}

// Oturum Kontrolü
export async function checkSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) return null
  return session
}

// Aktif Kullanıcıyı Alma (Anasayfa için)
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Şifreyi Güncelleme
export async function updatePassword(password: string) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Oturum süresi dolmuş. Lütfen tekrar şifre sıfırlama isteği gönderin.')

  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error

  await supabase.auth.signOut()
  return true
}

// Çıkış Yapma
export async function signOutUser() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return true
}
// ProtectedRoute için oturum kontrol servisi
export async function verifyUserSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) return null
  return session
}