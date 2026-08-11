"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NavbarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Kullanıcının profil fotoğrafını menüde göstermek için çekiyoruz
  useEffect(() => {
    async function fetchUserAvatar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    }
    fetchUserAvatar();
  }, [supabase]);

  // Menü açıkken dışarı tıklandığında kapanmasını sağlar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Üç Çizgili Hamburger Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-[#2C2A29] hover:bg-[#F0ECE1] transition-colors focus:outline-none border border-[#E6E2D6] bg-[#FDFBF7]"
        aria-label="Menü"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Açılır Menü (Dropdown) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-[#FDFBF7] border border-[#E6E2D6] rounded-2xl shadow-lg py-2 z-50">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-sm text-[#2C2A29] hover:bg-[#F0ECE1] transition-colors font-medium"
          >
            Akış (Ana Sayfa)
          </Link>
          <Link
            href="/dashboard/add-project"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-sm text-[#2C2A29] hover:bg-[#F0ECE1] transition-colors font-medium"
          >
            Proje Ekle
          </Link>
          
          {/* Profili Düzenle (Başında Profil Resmi ile) */}
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-2.5 text-sm text-[#2C2A29] hover:bg-[#F0ECE1] transition-colors font-medium"
          >
            <div className="w-6 h-6 rounded-full bg-[#E8E2D5] overflow-hidden mr-2.5 flex items-center justify-center border border-[#D6CFC7] flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-[#8C7A6B]">👤</span>
              )}
            </div>
            Profili Düzenle
          </Link>

          <div className="border-t border-[#E6E2D6] my-1"></div>

          {/* Çıkış Yap (Başında İkon ile) */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
}