
export const metadata = {
  title: "Better Bites Donation System", 
  description: "Community donation dashboard",
};

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#6C4AB6] text-white text-center">
      <h1 className="text-4xl font-extrabold mb-4 drop-shadow-md">
        Better Bites Donation System
      </h1>
      <p className="text-lg opacity-90">Welcome to your Dashboard</p>
    </main>
  );
}
