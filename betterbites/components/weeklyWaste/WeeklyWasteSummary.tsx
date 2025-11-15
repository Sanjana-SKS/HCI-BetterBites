"use client";

import Link from "next/link";

export default function WeeklyWasteSummary() {
  //harcode data
  const totalItems = 63;
  const bestTime = "Afternoon";
  const topCategory = "Pastries";
  const pickups = 12;
  const wasteDelta = "3.2% more than last week";

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        backgroundImage: "url('/backgrounds/food-background.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "top left",
        backgroundColor: "#D9D9D9",
      }}
    >
      {/* ───────────────────────── Page title ───────────────────────── */}
      <h1
        style={{
          color: "#000",
          textAlign: "center",
          textShadow: "0 4px 4px rgba(0,0,0,0.25)",
          WebkitTextStrokeWidth: "1px",
          WebkitTextStrokeColor: "#000",
          fontFamily: "Roboto, sans-serif",
          fontSize: "32px",
          fontWeight: 500,
          lineHeight: "40px",
          marginTop: "32px",
          marginBottom: "32px",
        }}
      >
        Weekly Waste Summary
      </h1>

      {/* ───────────────────────── Main content wrapper ───────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "24px",
          maxWidth: "1200px",
          width: "100%",
          paddingLeft: "80px",
          paddingRight: "80px",
        }}
      >
        {/* ───────── Row 1: Total Items Donated | Best Time ───────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "flex-start",
          }}
        >
          <SummaryCard title="Total Items Donated" value={totalItems} />
          <SummaryCard title="Best Time" value={bestTime} />
        </div>

        {/* ───────── Row 2: Top Category | Pickups Scheduled ───────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "flex-start",
          }}
        >
          <SummaryCard title="Top Category" value={topCategory} />
          <SummaryCard title="Pickups Scheduled" value={pickups} />
        </div>

        {/* ───────── Row 3: Waste Reduction full width ───────── */}
        <div
          style={{
            borderRadius: "8px",
            backgroundColor: "#C9FDCB",
            boxShadow:
              "0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)",
            padding: "24px",
            width: "100%",
            maxWidth: "920px",
          }}
        >
          <h2
            style={{
              color: "#000",
              fontFamily: "Roboto, sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "12px",
              lineHeight: "20px",
            }}
          >
            Waste Reduction
          </h2>
          <p
            style={{
              color: "#000",
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            {wasteDelta}
          </p>
        </div>

        {/* ─────────────── Button: Detailed Analytics ─────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            maxWidth: "920px",
            width: "100%",
            paddingLeft: "4px",
          }}
        >
          <Link
            href="/analytics/detailed"
            className="px-6 py-3 rounded-full text-white text-sm font-medium shadow-md transition-all"
            style={{
              backgroundColor: "#6C63FF",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
            }}
          >
            View Detailed Analytics →
          </Link>
        </div>

        {/* ─────────────── Download Icon (aligned right) ─────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            maxWidth: "920px",
            width: "100%",
            paddingRight: "16px",
            paddingBottom: "40px",
          }}
        >
          <img
            src="/icons/Download.png"
            alt="Download Icon"
            style={{
              width: "40px",
              height: "40px",
              opacity: 0.9,
              cursor: "pointer",
              transition: "opacity 0.3s ease",
              filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.25))",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "0.9")}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────
   Reusable single stat card
   ───────────────────────── */
function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "440px",
        minWidth: "240px",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        boxShadow:
          "0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)",
        padding: "24px",
        rowGap: "12px",
      }}
    >
      <h3
        style={{
          color: "#000",
          fontFamily: "Roboto, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: "20px",
          margin: 0,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#757575",
          fontFamily: "Roboto, sans-serif",
          fontSize: "14px",
          lineHeight: "20px",
          margin: 0,
          whiteSpace: "pre-line",
        }}
      >
        {value}
      </p>
    </div>
  );
}
