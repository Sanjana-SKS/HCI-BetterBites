"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportCSV, exportMultiPagePDF } from "@/components/weeklyWaste/utils/exportUtils";

// ───────────────────────── Types & helpers ─────────────────────────

type WasteItem = {
  id: string;
  name: string;
  category: string;
  status: "Completed" | "Pending" | "Flagged";
  quantity: number;
  calories: number;
  expires: string;
  date: string; // YYYY-MM-DD
};

type CategoryStats = {
  totalItems: number;
  avgQuantity: number;
};

type WeekStats = {
  weekStart: string;
  totalItems: number;
  completedItems: number;
  completionRate: number; // 0–1
  avgQuantity: number;
  perCategory: Record<string, CategoryStats>;
};

function parseISODate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

function getWeekRange(weekStartStr: string) {
  const start = parseISODate(weekStartStr);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

function isInRange(dateStr: string, start: Date, end: Date) {
  const d = parseISODate(dateStr);
  return d >= start && d <= end;
}

function computeWeekStats(items: WasteItem[], weekStartStr: string): WeekStats | null {
  if (!weekStartStr) return null;

  const { start, end } = getWeekRange(weekStartStr);
  const weekItems = items.filter((i) => isInRange(i.date, start, end));

  if (weekItems.length === 0) {
    return {
      weekStart: weekStartStr,
      totalItems: 0,
      completedItems: 0,
      completionRate: 0,
      avgQuantity: 0,
      perCategory: {},
    };
  }

  let totalItems = weekItems.length;
  let completedItems = 0;
  let totalQty = 0;

  const perCategory: Record<string, CategoryStats> = {};

  for (const item of weekItems) {
    totalQty += item.quantity;
    if (item.status === "Completed") completedItems += 1;

    if (!perCategory[item.category]) {
      perCategory[item.category] = {
        totalItems: 0,
        avgQuantity: 0,
      };
    }

    const cat = perCategory[item.category];
    cat.totalItems += 1;
  }

  // compute category avg qty
  for (const [catName, stats] of Object.entries(perCategory)) {
    const catItems = weekItems.filter((i) => i.category === catName);
    const sum = catItems.reduce((s, i) => s + i.quantity, 0);
    stats.avgQuantity = catItems.length ? sum / catItems.length : 0;
  }

  const completionRate = totalItems === 0 ? 0 : completedItems / totalItems;
  const avgQuantity = totalItems === 0 ? 0 : totalQty / totalItems;

  return {
    weekStart: weekStartStr,
    totalItems,
    completedItems,
    completionRate,
    avgQuantity,
    perCategory,
  };
}

function formatWeekLabel(weekStartStr: string) {
  if (!weekStartStr) return "";
  const d = parseISODate(weekStartStr);
  return `Week of ${d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

// ───────────────────────── Page component ─────────────────────────

export default function ExportReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<WasteItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekA = searchParams.get("weekA") ?? "";
  const weekB = searchParams.get("weekB") ?? "";

  // "Include" checkboxes
  const [includeItems, setIncludeItems] = useState(true);
  const [includeCategories, setIncludeCategories] = useState(true);
  const [includeWasteTrends, setIncludeWasteTrends] = useState(true);
  const [includeDonationTrends, setIncludeDonationTrends] = useState(true);
  const [includeExpirationRisks, setIncludeExpirationRisks] = useState(true);

  const reportRef = useRef<HTMLDivElement | null>(null);

  // Load data.json
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data.json");
        if (!res.ok) throw new Error("Failed to load data");
        const json = (await res.json()) as WasteItem[];
        setItems(json);
      } catch (e) {
        console.error(e);
        setError("Could not load data.json");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const weekAStats = useMemo(
    () => (items && weekA ? computeWeekStats(items, weekA) : null),
    [items, weekA]
  );
  const weekBStats = useMemo(
    () => (items && weekB ? computeWeekStats(items, weekB) : null),
    [items, weekB]
  );

  const hasBothWeeks = !!weekA && !!weekB && !!weekAStats && !!weekBStats;

  // union of categories across both weeks
  const categories = useMemo(() => {
    if (!weekAStats || !weekBStats) return [] as string[];
    return Array.from(
      new Set([
        ...Object.keys(weekAStats.perCategory),
        ...Object.keys(weekBStats.perCategory),
      ])
    ).sort();
  }, [weekAStats, weekBStats]);

  // ───────────────────────── Export actions ─────────────────────────

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const labelA = weekA ? formatWeekLabel(weekA) : "Week A";
    const labelB = weekB ? formatWeekLabel(weekB) : "Week B";
    const filename = `betterbites_export_${labelA.replace(/\s+/g, "_")}_vs_${labelB.replace(
      /\s+/g,
      "_"
    )}.pdf`;
    await exportMultiPagePDF(reportRef.current, filename);
  };

  const handleDownloadCSV = () => {
    if (!weekAStats || !weekBStats) return;

    const labelA = formatWeekLabel(weekAStats.weekStart);
    const labelB = formatWeekLabel(weekBStats.weekStart);

    // Build a small dataset that fits exportUtils.exportCSV’s shape.
    const data = {
      weekKey: `${labelA} vs ${labelB}`,
      pie: {
        labels: [
          "Items",
          "Categories",
          "Waste Trends",
          "Donation Trends",
          "Expiration Risks",
        ],
        values: [
          includeItems ? 1 : 0,
          includeCategories ? 1 : 0,
          includeWasteTrends ? 1 : 0,
          includeDonationTrends ? 1 : 0,
          includeExpirationRisks ? 1 : 0,
        ],
      },
      bar: {
        labels: ["Week A Items", "Week B Items"],
        values: [weekAStats.totalItems, weekBStats.totalItems],
      },
    };

    const filename = `betterbites_export_${labelA.replace(/\s+/g, "_")}_vs_${labelB.replace(
      /\s+/g,
      "_"
    )}.csv`;

    exportCSV(data, filename);
  };

  // ───────────────────────── Render ─────────────────────────

  if (loading) {
    return <p className="text-sm text-gray-600">Loading export report…</p>;
  }

  if (error || !items) {
    return <p className="text-sm text-red-600">{error ?? "Unknown error"}</p>;
  }

  if (!weekA || !weekB) {
    return (
      <div className="space-y-4">
        <Link href="/weekly-waste" className="text-sm hover:underline">
          ← Back to Weekly Waste
        </Link>
        <p className="text-sm text-gray-700">
          Export Report needs <span className="font-semibold">weekA</span> and{" "}
          <span className="font-semibold">weekB</span> in the URL.
          Use the Compare Weeks screen to choose weeks, then tap{" "}
          <span className="font-semibold">Export This Comparison</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/weekly-waste/compare"
          className="text-sm hover:underline flex items-center gap-1"
        >
          ← <span>Back to Compare</span>
        </Link>

        <span className="text-xs text-gray-600">
          {formatWeekLabel(weekA)} vs {formatWeekLabel(weekB)}
        </span>
      </div>

      {/* Page title */}
      <h1 className="text-3xl font-bold text-center">Export Report</h1>

      {/* Main export card (wrapped in ref for PDF) */}
      <Card
        ref={reportRef}
        className="bg-white/95 shadow-lg border border-gray-200 max-w-4xl mx-auto"
      >
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-semibold">
            Include &amp; Format
          </CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Customize what’s included before exporting this comparison for{" "}
            <span className="font-semibold">{formatWeekLabel(weekA)}</span> and{" "}
            <span className="font-semibold">{formatWeekLabel(weekB)}</span>.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Include section */}
          <section>
            <h2 className="text-sm font-semibold mb-3">Include:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={includeItems}
                  onChange={(e) => setIncludeItems(e.target.checked)}
                />
                <span>Items</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={includeCategories}
                  onChange={(e) => setIncludeCategories(e.target.checked)}
                />
                <span>Categories</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={includeWasteTrends}
                  onChange={(e) => setIncludeWasteTrends(e.target.checked)}
                />
                <span>Waste Trends</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={includeDonationTrends}
                  onChange={(e) => setIncludeDonationTrends(e.target.checked)}
                />
                <span>Donation Trends</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={includeExpirationRisks}
                  onChange={(e) =>
                    setIncludeExpirationRisks(e.target.checked)
                  }
                />
                <span>Expiration Risks</span>
              </label>
            </div>
          </section>

          {/* Simple metrics summary */}
          {weekAStats && weekBStats && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                <h3 className="font-semibold mb-2">{formatWeekLabel(weekA)}</h3>
                <p>
                  <span className="font-semibold">Total items:</span>{" "}
                  {weekAStats.totalItems}
                </p>
                <p>
                  <span className="font-semibold">Completion %:</span>{" "}
                  {(weekAStats.completionRate * 100).toFixed(1)}%
                </p>
                <p>
                  <span className="font-semibold">Avg quantity:</span>{" "}
                  {weekAStats.avgQuantity.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                <h3 className="font-semibold mb-2">{formatWeekLabel(weekB)}</h3>
                <p>
                  <span className="font-semibold">Total items:</span>{" "}
                  {weekBStats.totalItems}
                </p>
                <p>
                  <span className="font-semibold">Completion %:</span>{" "}
                  {(weekBStats.completionRate * 100).toFixed(1)}%
                </p>
                <p>
                  <span className="font-semibold">Avg quantity:</span>{" "}
                  {weekBStats.avgQuantity.toFixed(2)}
                </p>
              </div>
            </section>
          )}

          {/* Category list */}
          {categories.length > 0 && weekAStats && weekBStats && (
            <section className="mt-2">
              <h2 className="text-sm font-semibold mb-2">Category Overview</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-2 px-3">Category</th>
                      <th className="text-center py-2 px-3">
                        Week A Items
                      </th>
                      <th className="text-center py-2 px-3">
                        Week B Items
                      </th>
                      <th className="text-center py-2 px-3">
                        Week A Avg Qty
                      </th>
                      <th className="text-center py-2 px-3">
                        Week B Avg Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => {
                      const a = weekAStats.perCategory[cat];
                      const b = weekBStats.perCategory[cat];
                      return (
                        <tr
                          key={cat}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="py-2 px-3 font-medium text-gray-800">
                            {cat}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {a ? a.totalItems : 0}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {b ? b.totalItems : 0}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {a ? a.avgQuantity.toFixed(2) : "-"}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {b ? b.avgQuantity.toFixed(2) : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </CardContent>
      </Card>

      {/* Export buttons (outside ref so they don't clutter the PDF) */}
      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-6">
        <Button
          onClick={handleDownloadPDF}
          disabled={!hasBothWeeks}
          className="rounded-2xl bg-[#6C63FF] px-8 py-4 text-sm font-medium text-white shadow-md hover:bg-[#574bff] disabled:opacity-50"
        >
          Download PDF
        </Button>
        <Button
          onClick={handleDownloadCSV}
          disabled={!hasBothWeeks}
          variant="outline"
          className="rounded-2xl border-[#6C63FF] px-8 py-4 text-sm font-medium text-[#6C63FF] bg-white hover:bg-[#f0edff] disabled:opacity-50"
        >
          Download CSV
        </Button>
      </div>
    </div>
  );
}
