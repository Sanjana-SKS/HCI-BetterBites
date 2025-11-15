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
      <body className="font-sans text-gray-900 antialiased">

        {/* page container*/}
        <div className="flex">

          {/* side nav */}
          <SideNav />

          <div className="flex-1 ml-[117px] min-h-screen bg-food-pattern bg-cover bg-center">

            {/* top nav */}
            <TopNav />

            {/* page content */}
            <main className="max-w-6xl mx-auto pt-[140px] pb-20 px-6">
              {children}
            </main>

          </div>
        </div>
      </body>
    </html>
  );
}
