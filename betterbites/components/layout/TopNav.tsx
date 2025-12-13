"use client";

export default function TopNav() {
  return (
    <header className="fixed top-0 left-[117px] w-[calc(100%-117px)] h-[107px] bg-[#6750A4] flex items-center justify-between px-8 shadow z-40">

      {/* Title */}
      <h1 className="text-3xl font-medium text-white drop-shadow">
        Better Bites Donation System
      </h1>

      {/* Logo */}
      <div
        className="w-[75px] h-[75px] flex-shrink-0"
        style={{
          background: "url('/icons/betterbites.png') center/cover no-repeat",
        }}
      ></div>
    </header>
  );
}
