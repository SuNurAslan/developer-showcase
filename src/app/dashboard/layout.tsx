import NavbarMenu from "@/components/NavbarMenu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex flex-col bg-[#FDFBF7]">
      {/* Sağ Üst Sabit Hamburger Menü */}
      <header className="absolute top-4 right-4 z-50">
        <NavbarMenu />
      </header>

      {/* Sayfa İçeriği */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}