"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert("Hata: " + error.message);
    } else {
      alert("Şifreniz başarıyla güncellendi!");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleUpdate} className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Yeni Şifre Belirle</h2>
        <input
          type="password"
          placeholder="Yeni şifreniz"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
    </div>
  );
}