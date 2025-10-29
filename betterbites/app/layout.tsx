import type { Metadata } from "next";
import "./globals.css";
import SideNav from "@/components/layout/SideNav";
import TopNav from "@/components/layout/TopNav";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-gray-900 antialiased">
        {/* Full page container */}
        <div className="flex">
          {/* Sidebar (always visible, left side) */}
          <div className="relative z-30">
            <SideNav />
          </div>

          {/* Main content area */}
          <div className="flex-1 relative">
            {/* Top Nav overlays slightly on sidebar */}
            <div className="relative z-40">
              <TopNav />
            </div>

            {/* Page content */}
            <main className="pt-[107px] pl-6 pr-6 bg-[#D9D9D9]/20 min-h-screen">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
