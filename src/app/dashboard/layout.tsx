import NavbarMenu from "@/components/NavbarMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex justify-center bg-[#FDFBF7] px-4 py-8">
      
      {/* Sayfa İçeriği */}
      <main className="w-full max-w-lg">
        {children}
      </main>

      {/* Sağ Sabit Menü */}
      <aside className="fixed right-2 sm:right-6 top-0 bottom-0 flex items-center z-50">
        <NavbarMenu />
      </aside>

    </div>
  );
}