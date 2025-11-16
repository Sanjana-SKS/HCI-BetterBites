"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  completedItems: number;
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
        completedItems: 0,
        avgQuantity: 0,
      };
    }

    const cat = perCategory[item.category];
    cat.totalItems += 1;
    if (item.status === "Completed") cat.completedItems += 1;
  }

  // compute category avg qty
  for (const [catName, stats] of Object.entries(perCategory)) {
    const catItems = weekItems.filter((i) => i.category === catName);
    const sum = catItems.reduce((s, i) => s + i.quantity, 0);
    stats.avgQuantity = sum / (catItems.length || 1);
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

/**
 * Build quantity-per-day series for a given week.
 * Returns an array of 7 numbers (Mon–Sun) and the max quantity in that week.
 */
function buildWeeklyQuantitySeries(items: WasteItem[], weekStartStr: string) {
  const { start, end } = getWeekRange(weekStartStr);
  const filtered = items.filter((i) => isInRange(i.date, start, end));

  // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  const qtyPerDay = Array.from({ length: 7 }, () => 0);

  filtered.forEach((it) => {
    const dayIndex = parseISODate(it.date).getDay(); // 0=Sun … 6=Sat
    const mappedIndex = (dayIndex + 6) % 7; // shift so Mon=0
    qtyPerDay[mappedIndex] += it.quantity;
  });

  const maxQty = Math.max(...qtyPerDay, 0);

  return { qtyPerDay, maxQty };
}

export default function CompareWeeksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<WasteItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialWeekA = searchParams.get("weekA") ?? "";
  const initialWeekB = searchParams.get("weekB") ?? "";

  const [weekA, setWeekA] = useState(initialWeekA);
  const [weekB, setWeekB] = useState(initialWeekB);

  // keep local state in sync with URL if user changes query manually
  useEffect(() => {
    setWeekA(initialWeekA);
    setWeekB(initialWeekB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWeekA, initialWeekB]);

  // load data.json
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

  // available week keys (unique dates from dataset)
  const weekOptions = useMemo(() => {
    if (!items) return [] as string[];
    const set = new Set<string>();
    for (const it of items) {
      set.add(it.date); // treat each date as "week of <date>"
    }
    return Array.from(set).sort();
  }, [items]);

  const weekAStats = useMemo(
    () => (items && weekA ? computeWeekStats(items, weekA) : null),
    [items, weekA]
  );
  const weekBStats = useMemo(
    () => (items && weekB ? computeWeekStats(items, weekB) : null),
    [items, weekB]
  );

  const hasBoth = !!weekA && !!weekB && !!weekAStats && !!weekBStats;

  const updateUrl = (nextWeekA: string, nextWeekB: string) => {
    const params = new URLSearchParams();
    if (nextWeekA) params.set("weekA", nextWeekA);
    if (nextWeekB) params.set("weekB", nextWeekB);
    const qs = params.toString();
    router.push(qs ? `/weekly-waste/compare?${qs}` : "/weekly-waste/compare");
  };

  const handleWeekAChange = (value: string) => {
    setWeekA(value);
    updateUrl(value, weekB);
  };

  const handleWeekBChange = (value: string) => {
    setWeekB(value);
    updateUrl(weekA, value);
  };

  const handleApply = () => {
    if (!hasBoth) return;
    // button is mostly UX; data updates as you change dropdowns
  };

  const handleReset = () => {
    setWeekA("");
    setWeekB("");
    router.push("/weekly-waste/compare");
  };

  const handleClose = () => {
    router.push("/weekly-waste");
  };

  const handleGoToExport = () => {
    if (!weekA || !weekB) return;
    router.push(
      `/weekly-waste/export?weekA=${encodeURIComponent(
        weekA
      )}&weekB=${encodeURIComponent(weekB)}`
    );
  };

  if (loading) {
    return <p className="text-sm text-gray-600">Loading comparison…</p>;
  }

  if (error || !items) {
    return <p className="text-sm text-red-600">{error ?? "Unknown error"}</p>;
  }

  return (
    <div className="space-y-8">
      {/* Top bar: back + Week A / Week B dropdowns */}
      <div className="flex items-center justify-between">
        {/* Left: Back + Week A selector */}
        <div className="flex items-center gap-6">
          <Link
            href="/weekly-waste"
            className="text-black font-medium hover:underline flex items-center gap-1"
          >
            ← <span>Back</span>
          </Link>

          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center rounded-full bg-white/90 px-4 py-1 text-xs font-semibold text-[#2C2C2C] shadow">
              Select Week to Compare
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">Week A</span>
              <select
                value={weekA}
                onChange={(e) => handleWeekAChange(e.target.value)}
                className="rounded-md border border-gray-300 bg-[#E5CCFF] px-3 py-1.5 text-xs font-medium text-[#2C2C2C] shadow-sm"
              >
                <option value="">Select week</option>
                {weekOptions.map((w) => (
                  <option key={w} value={w}>
                    {formatWeekLabel(w)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right: Week B selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700">Week B</span>
          <select
            value={weekB}
            onChange={(e) => handleWeekBChange(e.target.value)}
            className="rounded-md border border-gray-300 bg-[#E5CCFF] px-3 py-1.5 text-xs font-medium text-[#2C2C2C] shadow-sm"
          >
            <option value="">Select week</option>
            {weekOptions.map((w) => (
              <option key={w} value={w}>
                {formatWeekLabel(w)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center">Compare Weeks</h1>

      {/* Small summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/95 shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">
              {weekA ? formatWeekLabel(weekA) : "Select Week A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weekAStats ? (
              <div className="space-y-1 text-sm text-gray-800">
                <p>
                  <span className="font-semibold">Avg Qty:</span>{" "}
                  {weekAStats.avgQuantity.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Completion %:</span>{" "}
                  {(weekAStats.completionRate * 100).toFixed(1)}%
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Choose Week A to see stats.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/95 shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">
              {weekB ? formatWeekLabel(weekB) : "Select Week B"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weekBStats ? (
              <div className="space-y-1 text-sm text-gray-800">
                <p>
                  <span className="font-semibold">Avg Qty:</span>{" "}
                  {weekBStats.avgQuantity.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Completion %:</span>{" "}
                  {(weekBStats.completionRate * 100).toFixed(1)}%
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Choose Week B to see stats.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly bar charts with axes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[{ label: "A", week: weekA }, { label: "B", week: weekB }].map(
          ({ label, week }) => {
            let qtySeries = Array(7).fill(0);
            let maxQtyRaw = 0;

            if (items && week) {
              const built = buildWeeklyQuantitySeries(items, week);
              qtySeries = built.qtyPerDay;
              maxQtyRaw = built.maxQty;
            }

            const chartHeight = 140; // px

            // Choose a nice rounded max for the axis (multiples of 50)
            let maxTick = Math.ceil(maxQtyRaw / 50) * 50;
            if (maxTick === 0) maxTick = 50;
            const midTick = maxTick / 2;

            const minBarHeight = 6;
            const usableHeight = chartHeight - minBarHeight;

            return (
              <Card
                key={label}
                className="bg-white/95 shadow-md border border-gray-200"
              >
                <CardHeader className="pb-1">
                  <CardTitle className="text-base">
                    {week ? formatWeekLabel(week) : `Week ${label}`}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-2">
                  <div className="flex gap-4">
                    {/* Y-axis: Quantity label + ticks */}
                    <div
                      className="flex"
                      style={{ height: chartHeight }}
                    >
                      {/* Vertical label */}
                      <div className="flex items-center">
                        <span
                          className="font-semibold text-[11px] text-gray-700"
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                          }}
                        >
                          Quantity
                        </span>
                      </div>
                      {/* Tick numbers */}
                      <div className="ml-2 flex flex-col justify-between text-[10px] text-gray-500">
                        <span>{maxTick}</span>
                        <span>{midTick}</span>
                        <span>0</span>
                      </div>
                    </div>

                    {/* Bars + X-axis labels */}
                    <div
                      className="flex-1 flex items-end justify-between"
                      style={{ height: chartHeight }}
                    >
                      {qtySeries.map((qty, i) => {
                        const dayLabel = [
                          "Mon",
                          "Tue",
                          "Wed",
                          "Thu",
                          "Fri",
                          "Sat",
                          "Sun",
                        ][i];

                        // Ensure every day has at least a visible bar
                        const scaledHeight =
                          maxTick === 0 ? 0 : (qty / maxTick) * usableHeight;
                        const barHeight = minBarHeight + scaledHeight;

                        const isZero = qty === 0;

                        return (
                          <div
                            key={i}
                            className="flex flex-col items-center justify-end gap-1 h-full"
                          >
                            {/* Quantity number ABOVE bar */}
                            <span className="text-[10px] text-gray-600">
                              {qty}
                            </span>
                            {/* Bar */}
                            <div
                              className="w-[10px] rounded-t-md"
                              style={{
                                height: `${barHeight}px`,
                                backgroundColor: isZero
                                  ? "#e5e7eb"
                                  : "#4b5563",
                              }}
                            />
                            {/* Day label BELOW bar */}
                            <span className="font-semibold text-[11px] text-gray-700">
                              {dayLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>

      {/* Per-category table */}
      {hasBoth && weekAStats && weekBStats && (
        <Card className="bg-white/95 shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Per-Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-2 px-3">Category</th>
                    <th className="text-center py-2 px-3">Week A Items</th>
                    <th className="text-center py-2 px-3">Week A Avg Qty</th>
                    <th className="text-center py-2 px-3">Week B Items</th>
                    <th className="text-center py-2 px-3">Week B Avg Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(
                    new Set([
                      ...Object.keys(weekAStats.perCategory),
                      ...Object.keys(weekBStats.perCategory),
                    ])
                  )
                    .sort()
                    .map((cat) => {
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
                            {a ? a.avgQuantity.toFixed(2) : "-"}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {b ? b.totalItems : 0}
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
          </CardContent>
        </Card>
      )}

      {/* Bottom buttons */}
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8">
        <Button
          onClick={handleApply}
          disabled={!hasBoth}
          className="rounded-2xl bg-[#9346FF] px-10 py-6 text-lg font-normal text-white shadow-md hover:bg-[#7b33e6] disabled:opacity-50"
        >
          Apply Comparison
        </Button>

        <Button
          variant="outline"
          onClick={handleReset}
          className="rounded-2xl border-[#9346FF] px-10 py-6 text-lg font-normal text-[#9346FF] bg-white hover:bg-[#f2e8ff]"
        >
          Reset
        </Button>

        <Button
          variant="outline"
          onClick={handleClose}
          className="rounded-2xl border-[#9346FF] px-10 py-6 text-lg font-normal text-[#9346FF] bg-white hover:bg-[#f2e8ff]"
        >
          Close
        </Button>

        <Button
          onClick={handleGoToExport}
          disabled={!hasBoth}
          className="rounded-2xl bg-[#6C63FF] px-10 py-6 text-lg font-normal text-white shadow-md hover:bg-[#574bff] disabled:opacity-50"
        >
          Export This Comparison
        </Button>
      </div>
    </div>
  );
}
