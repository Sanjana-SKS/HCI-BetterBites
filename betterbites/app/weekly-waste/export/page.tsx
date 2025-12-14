"use client";

import { Suspense } from "react";
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
  date: string;
};

type CategoryStats = {
  totalItems: number;
  avgQuantity: number;
};

type WeekStats = {
  weekStart: string;
  totalItems: number;
  completedItems: number;
  completionRate: number;
  avgQuantity: number;
  perCategory: Record<string, CategoryStats>;
};

function parseISODate(dateStr: string) {
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

  let completedItems = 0;
  let totalQty = 0;
  const perCategory: Record<string, CategoryStats> = {};

  for (const item of weekItems) {
    totalQty += item.quantity;
    if (item.status === "Completed") completedItems++;

    if (!perCategory[item.category]) {
      perCategory[item.category] = { totalItems: 0, avgQuantity: 0 };
    }
    perCategory[item.category].totalItems++;
  }

  for (const [catName, stats] of Object.entries(perCategory)) {
    const catItems = weekItems.filter((i) => i.category === catName);
    const sum = catItems.reduce((s, i) => s + i.quantity, 0);
    stats.avgQuantity = catItems.length ? sum / catItems.length : 0;
  }

  return {
    weekStart: weekStartStr,
    totalItems: weekItems.length,
    completedItems,
    completionRate: weekItems.length ? completedItems / weekItems.length : 0,
    avgQuantity: weekItems.length ? totalQty / weekItems.length : 0,
    perCategory,
  };
}

function formatWeekLabel(dateStr: string) {
  if (!dateStr) return "";
  const d = parseISODate(dateStr);
  return `Week of ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

// ───────────────────────── Separated content for Suspense ─────────────────────────

function ExportReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<WasteItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekA = searchParams.get("weekA") ?? "";
  const weekB = searchParams.get("weekB") ?? "";

  const [includeItems, setIncludeItems] = useState(true);
  const [includeCategories, setIncludeCategories] = useState(true);
  const [includeWasteTrends, setIncludeWasteTrends] = useState(true);
  const [includeDonationTrends, setIncludeDonationTrends] = useState(true);
  const [includeExpirationRisks, setIncludeExpirationRisks] = useState(true);

  const reportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data.json");
        if (!res.ok) throw new Error("Failed to load data");
        setItems(await res.json());
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
    () => items && weekA ? computeWeekStats(items, weekA) : null,
    [items, weekA]
  );
  const weekBStats = useMemo(
    () => items && weekB ? computeWeekStats(items, weekB) : null,
    [items, weekB]
  );

  const categories = useMemo(() => {
    if (!weekAStats || !weekBStats) return [];
    return Array.from(new Set([
      ...Object.keys(weekAStats.perCategory),
      ...Object.keys(weekBStats.perCategory),
    ])).sort();
  }, [weekAStats, weekBStats]);

  const hasBothWeeks = !!weekAStats && !!weekBStats;

  if (loading) return <p>Loading export…</p>;
  if (error || !items) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Link href="/items" className="text-sm hover:underline">
          <button
              style =
                  {{
                    width : "100px",
                    padding: "12px",
                    backgroundColor: "#6C4AB6",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",

                  }}>
            ← Back
          </button>
        </Link>
        <span className="text-xs text-gray-600">
          {formatWeekLabel(weekA)} vs {formatWeekLabel(weekB)}
        </span>
      </div>

      <h1 className="text-3xl font-bold text-center">Export Report</h1>

      <Card ref={reportRef} className="max-w-4xl mx-auto shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Include &amp; Format</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Include section */}
          <section>
            <h2 className="text-sm font-semibold mb-3">Include:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <label><input type="checkbox" checked={includeItems} onChange={e => setIncludeItems(e.target.checked)} /> Items</label>
              <label><input type="checkbox" checked={includeCategories} onChange={e => setIncludeCategories(e.target.checked)} /> Categories</label>
              <label><input type="checkbox" checked={includeWasteTrends} onChange={e => setIncludeWasteTrends(e.target.checked)} /> Waste Trends</label>
              <label><input type="checkbox" checked={includeDonationTrends} onChange={e => setIncludeDonationTrends(e.target.checked)} /> Donation Trends</label>
              <label><input type="checkbox" checked={includeExpirationRisks} onChange={e => setIncludeExpirationRisks(e.target.checked)} /> Expiration Risks</label>
            </div>
          </section>

          {hasBothWeeks && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-gray-50 border p-4">
                <h3 className="font-semibold mb-2">{formatWeekLabel(weekA)}</h3>
                <p>Total items: {weekAStats!.totalItems}</p>
                <p>Completion %: {(weekAStats!.completionRate * 100).toFixed(1)}%</p>
                <p>Avg quantity: {weekAStats!.avgQuantity.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 border p-4">
                <h3 className="font-semibold mb-2">{formatWeekLabel(weekB)}</h3>
                <p>Total items: {weekBStats!.totalItems}</p>
                <p>Completion %: {(weekBStats!.completionRate * 100).toFixed(1)}%</p>
                <p>Avg quantity: {weekBStats!.avgQuantity.toFixed(2)}</p>
              </div>
            </section>
          )}

          {hasBothWeeks && categories.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold mb-2">Category Overview</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Week A Items</th>
                      <th className="py-2 px-3">Week B Items</th>
                      <th className="py-2 px-3">Week A Avg Qty</th>
                      <th className="py-2 px-3">Week B Avg Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat} className="border-b">
                        <td className="py-2 px-3 font-medium">{cat}</td>
                        <td className="py-2 px-3 text-center">{weekAStats!.perCategory[cat]?.totalItems ?? 0}</td>
                        <td className="py-2 px-3 text-center">{weekBStats!.perCategory[cat]?.totalItems ?? 0}</td>
                        <td className="py-2 px-3 text-center">{weekAStats!.perCategory[cat]?.avgQuantity.toFixed(2) ?? "-"}</td>
                        <td className="py-2 px-3 text-center">{weekBStats!.perCategory[cat]?.avgQuantity.toFixed(2) ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button onClick={() => reportRef.current && exportMultiPagePDF(reportRef.current, "BetterBites.pdf")} disabled={!hasBothWeeks}>
          Download PDF
        </Button>
        <Button variant="outline" onClick={() => hasBothWeeks && exportCSV(
          { weekKey: "Export", pie: { labels: [], values: [] }, bar: { labels: [], values: [] } },
          "BetterBites.csv"
        )} disabled={!hasBothWeeks}>
          Download CSV
        </Button>
      </div>
    </div>
  );
}

// ───────────────────────── Exported Root ─────────────────────────

export default function ExportReportPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading Report…</div>}>
      <ExportReportContent />
    </Suspense>
  );
}