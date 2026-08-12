'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function searchUsers() {
      if (!search.trim()) { setResults([]); return }
      
      const { data } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .or(`full_name.ilike.%${search}%,username.ilike.%${search}%`)
        .limit(5)
      
      setResults(data || [])
    }
    searchUsers()
  }, [search, supabase])

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative my-auto" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          type="text"
          placeholder="Geliştirici veya proje adı ara..."
          className="w-full p-3 bg-[#F4F1EA] rounded-xl border border-[#E8E2D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#8C7A6B]"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {results.length > 0 && results.map((user) => (
            <Link key={user.username} href={`/dashboard/profile/${user.username}`} onClick={onClose} className="flex items-center gap-3 p-2 hover:bg-[#FDFBF7] rounded-lg transition-all">
              <img src={user.avatar_url || ''} className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
              <span className="font-semibold text-[#3E3A36] text-sm">{user.full_name}</span>
            </Link>
          ))}
          {search.trim() && results.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-2">Geliştirici bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  )
}