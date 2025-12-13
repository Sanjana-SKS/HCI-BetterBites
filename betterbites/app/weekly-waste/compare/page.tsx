"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type WasteItem = {
  id: string;
  name: string;
  category: string;
  status: string;
  quantity: number;
  date: string;
};

export default function CompareWeeksPage() {
  const [items, setItems] = useState<WasteItem[]>([]);
  const [weekA, setWeekA] = useState("");
  const [weekB, setWeekB] = useState("");

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const allWeeks = Array.from(new Set(items.map((i) => i.date))).sort();

  function getStats(week: string) {
    const list = items.filter((i) => i.date === week);
    const total = list.length;
    const completed = list.filter(i => i.status === "Completed").length;
    const avgQty =
      total === 0
        ? 0
        : list.reduce((sum, i) => sum + i.quantity, 0) / total;

    return { total, completed, avgQty };
  }

  const a = weekA ? getStats(weekA) : null;
  const b = weekB ? getStats(weekB) : null;

  return (

    <div className="space-y-6">

      <div className="mb-6">
        <Link
            href="/weekly-waste"
        >
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
      </div>




      <h1 className="text-2xl font-bold">Compare Weeks</h1>

      {/* Week selectors */}
      <div className="flex gap-4">
        <select
          value={weekA}
          onChange={(e) => setWeekA(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Week A</option>
          {allWeeks.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>

        <select
          value={weekB}
          onChange={(e) => setWeekB(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Week B</option>
          {allWeeks.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      {/* Comparison table */}
      {a && b && (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Metric</th>
              <th className="border p-2">Week A</th>
              <th className="border p-2">Week B</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Total Items</td>
              <td className="border p-2 text-center">{a.total}</td>
              <td className="border p-2 text-center">{b.total}</td>
            </tr>
            <tr>
              <td className="border p-2">Completed Items</td>
              <td className="border p-2 text-center">{a.completed}</td>
              <td className="border p-2 text-center">{b.completed}</td>
            </tr>
            <tr>
              <td className="border p-2">Completion %</td>
              <td className="border p-2 text-center">
                {a.total === 0 ? "0%" : Math.round((a.completed / a.total) * 100) + "%"}
              </td>
              <td className="border p-2 text-center">
                {b.total === 0 ? "0%" : Math.round((b.completed / b.total) * 100) + "%"}
              </td>
            </tr>
            <tr>
              <td className="border p-2">Avg Quantity</td>
              <td className="border p-2 text-center">{a.avgQty.toFixed(1)}</td>
              <td className="border p-2 text-center">{b.avgQty.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
