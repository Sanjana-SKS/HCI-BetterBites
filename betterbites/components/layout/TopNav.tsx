"use client";

export default function TopNav() {
  return (
    <header className="absolute top-0 left-0 w-full h-[107px] bg-[#6750A4] flex items-center justify-between px-8 shadow-md z-40">
      {/* Left-aligned title */}
      <div className="flex items-center justify-center w-[638px] h-[96px] flex-shrink-0">
        <h1
          className="text-center font-[Roboto] text-[32px] leading-[40px] font-medium"
          style={{
            color: "#000000",
            WebkitTextStrokeWidth: "1px",
            WebkitTextStrokeColor: "#000000",
            textShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
            letterSpacing: "0",
            fontStyle: "normal",
          }}
        >
          Better Bites Donation System
        </h1>
      </div>

      {/* Right-aligned logo*/}
      <div
        className="w-[75px] h-[75px] flex-shrink-0 mr-[14px] mt-[14px]"
        style={{
          background: "url('/icons/betterbites.png') lightgray 50% / cover no-repeat",
          aspectRatio: "1 / 1",
        }}
      ></div>
    </header>
  );
}
