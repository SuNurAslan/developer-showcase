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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          type="text"
          placeholder="Geliştirici ara..."
          className="w-full p-3 bg-[#F4F1EA] rounded-xl border border-[#E8E2D5]"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="mt-4 space-y-2">
          {results.map((user) => (
            <Link key={user.username} href={`/dashboard/profile/${user.username}`} onClick={onClose} className="flex items-center gap-3 p-2 hover:bg-[#FDFBF7] rounded-lg">
              <img src={user.avatar_url || ''} className="w-8 h-8 rounded-full bg-gray-200" />
              <span className="font-semibold text-[#3E3A36]">{user.full_name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}