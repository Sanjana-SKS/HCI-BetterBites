"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import WeekSelector from "./WeekSelector";
import CategorySelector from "./CategorySelector";
import CategoryPieChart from "./charts/CategoryPieChart";
import WeeklyBarChart from "./charts/WeeklyBarChart";
import { exportCSV, exportMultiPagePDF } from "./utils/exportUtils";

type WeekKey = string;

const weeklyData: Record<
  WeekKey,
  {
    totalItems: number;
    bestTime: string;
    topCategory: string;
    pickups: number;
    wasteDelta: string;
    pie: { labels: string[]; values: number[] };
    bar: { labels: string[]; values: number[]; categories?: Record<string, number[]> };
  }
> = {
  "Jan 1–7": {
    totalItems: 63,
    bestTime: "Afternoon",
    topCategory: "Pastries",
    pickups: 12,
    wasteDelta: "3.2% more than last week",
    pie: {
      labels: ["Pastries", "Dairy", "Bread", "Produce", "Other"],
      values: [40, 20, 15, 15, 10],
    },
    bar: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [10, 12, 8, 15, 9, 5, 4],
      categories: {
        Pastries: [6, 7, 4, 8, 5, 3, 2],
        Dairy: [2, 3, 2, 3, 2, 1, 1],
        Bread: [1, 1, 1, 2, 1, 0, 0],
        Produce: [1, 1, 1, 2, 1, 1, 1],
      },
    },
  },
  "Jan 8–14": {
    totalItems: 48,
    bestTime: "Morning",
    topCategory: "Dairy",
    pickups: 9,
    wasteDelta: "1.1% less than last week",
    pie: {
      labels: ["Pastries", "Dairy", "Bread", "Produce", "Other"],
      values: [20, 30, 18, 20, 12],
    },
    bar: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [5, 8, 6, 10, 7, 6, 6],
      categories: {
        Pastries: [2, 3, 2, 4, 3, 2, 2],
        Dairy: [1, 3, 2, 3, 3, 2, 2],
        Bread: [1, 1, 1, 2, 1, 1, 1],
        Produce: [1, 1, 1, 1, 0, 1, 1],
      },
    },
  },
  "Dec 17–23": {
    totalItems: 72,
    bestTime: "Evening",
    topCategory: "Bread",
    pickups: 14,
    wasteDelta: "5.4% more than last week",
    pie: {
      labels: ["Pastries", "Dairy", "Bread", "Produce", "Other"],
      values: [25, 25, 25, 15, 10],
    },
    bar: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [12, 10, 11, 14, 9, 9, 7],
      categories: {
        Pastries: [4, 3, 3, 4, 2, 2, 2],
        Dairy: [3, 3, 3, 4, 3, 3, 2],
        Bread: [4, 3, 4, 4, 3, 3, 2],
        Produce: [1, 1, 1, 2, 1, 1, 1],
      },
    },
  },
};

const allCategories = ["All Categories", "Pastries", "Dairy", "Bread", "Produce", "Other"];

export default function WeeklyWasteSummary() {
  const router = useRouter();
  const defaultWeek = Object.keys(weeklyData)[0];
  const [selectedWeek, setSelectedWeek] = useState<WeekKey>(defaultWeek);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const dashboardRef = useRef<HTMLDivElement | null>(null);

  const week = weeklyData[selectedWeek];

  // chart data is filtered by category when a specific category is chosen
  const pieData =
    selectedCategory === "All Categories"
      ? week.pie
      : {
          labels: [selectedCategory],
          values: [
            // find index of category in week.pie.labels and return its value (or 0)
            week.pie.values[week.pie.labels.indexOf(selectedCategory)] ?? 0,
          ],
        };

  const barData =
    selectedCategory === "All Categories"
      ? { labels: week.bar.labels, values: week.bar.values }
      : {
          labels: week.bar.labels,
          values: week.bar.categories?.[selectedCategory] ?? week.bar.values,
        };

  const handleDownloadCSV = () => {
    const filename = `betterbites_${selectedWeek.replace(/\s+/g, "_")}.csv`;
    exportCSV({ weekKey: selectedWeek, pie: pieData, bar: barData }, filename);
  };

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    await exportMultiPagePDF(dashboardRef.current, `betterbites_${selectedWeek.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
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
          marginBottom: "24px",
        }}
      >
        Weekly Waste Summary
      </h1>

      {/* Week + Category selectors */}
      <div style={{ marginBottom: "16px", display: "flex", gap: 16, alignItems: "center" }}>
        <WeekSelector selectedWeek={selectedWeek} onChange={(w) => setSelectedWeek(w)} weeks={Object.keys(weeklyData)} />
        <CategorySelector selected={selectedCategory} onChange={(c) => setSelectedCategory(c)} categories={allCategories} />
      </div>
      
      {/* ───────────────────────── Main content wrapper ───────────────────────── */}
      <div
        ref={dashboardRef}
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
          <SummaryCard title="Total Items Donated" value={week.totalItems} />
          <SummaryCard title="Best Time" value={week.bestTime} />
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
          <SummaryCard title="Top Category" value={week.topCategory} />
          <SummaryCard title="Pickups Scheduled" value={week.pickups} />
        </div>

        {/* ───────── Row 3: Waste Reduction full width ───────── */}
        <div
          style={{
            borderRadius: "8px",
            backgroundColor: "#C9FDCB",
            boxShadow: "0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)",
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
            {week.wasteDelta}
          </p>
        </div>

        {/* ───────── Charts Row (Pie + Bar) ───────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "flex-start",
            maxWidth: "920px",
          }}
        >
          <CategoryPieChart labels={pieData.labels} values={pieData.values} />
          <WeeklyBarChart labels={barData.labels} values={barData.values} />
        </div>

        {/* ─────────────── Button: Detailed Analytics ─────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            maxWidth: "920px",
            width: "100%",
            paddingLeft: "4px",
            gap: 12,
            alignItems: "center",
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

          {/* Download dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={(e) => {
                // simple toggle via attribute
                const el = document.getElementById("download-menu");
                if (!el) return;
                el.style.display = el.style.display === "block" ? "none" : "block";
              }}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                marginLeft: 8,
              }}
            >
              <img
                src="/icons/Download.png"
                alt="Download"
                style={{
                  width: 40,
                  height: 40,
                  opacity: 0.9,
                  transition: "opacity 0.2s ease",
                  filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.25))",
                }}
              />
            </button>

            <div
              id="download-menu"
              style={{
                display: "none",
                position: "absolute",
                right: 0,
                marginTop: 8,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                padding: 8,
                zIndex: 40,
                minWidth: 160,
              }}
            >
              <button
                onClick={handleDownloadPDF}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Download PDF (multi-page)
              </button>

              <button
                onClick={handleDownloadCSV}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* bottom padding */}
        <div style={{ height: 40 }} />
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
        boxShadow: "0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)",
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
