"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function DetailedAnalyticsPage() {
  const data = [
    { week: "Week 1", qty: 20 },
    { week: "Week 2", qty: 12 },
    { week: "Week 3", qty: 31 },
    { week: "Week 4", qty: 25 },
  ];

  const rows = [
    { item: "Croissant Batch", qty: 20, waste: "30%", donate: "30%", exp: "10/30" },
    { item: "Cinnamon Rolls", qty: 12, waste: "50%", donate: "50%", exp: "10/28" },
    { item: "Muffins", qty: 31, waste: "10%", donate: "90%", exp: "11/01" },
  ];

  return (
    <div>

      {/* back button */}
      <div className="mb-6">
        <Link
          href="/weekly-waste"
          className="text-[#000000] font-medium hover:underline flex items-center gap-2"
        >
          ← Back
        </Link>
      </div>

      {/* title */}
      <h1 className="text-4xl font-bold text-center mb-2">
        Detailed Analytics
      </h1>
      <p className="text-lg text-center text-gray-700 mb-12">
        Category: <span className="font-medium">Pastries</span>
      </p>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Wasted" value="120" />
        <StatCard title="Total Donated" value="280" />
        <StatCard title="Average Quantity" value="25" />
        <StatCard title="Expiring Soon" value="10" />
      </div>

      {/* trend chart */}
      <Card className="bg-white shadow-md border border-gray-200 mb-12">
        <CardHeader>
          <CardTitle>4 Week Trend — Pastries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="week" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="qty" fill="#6C63FF" barSize={24} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* table */}
      <Card className="bg-white shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle>Pastries Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <Th>Item</Th>
                <Th>Qty</Th>
                <Th>Wasted %</Th>
                <Th>Donated %</Th>
                <Th>Expires</Th>
                <Th>View</Th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <Td className="font-medium">{r.item}</Td>
                  <Td>{r.qty}</Td>
                  <Td>{r.waste}</Td>
                  <Td>{r.donate}</Td>
                  <Td>{r.exp}</Td>
                  <Td>
                    <Button size="sm" className="bg-[#6C63FF] text-white">
                      View
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="bg-white shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="py-3 text-left text-gray-800 font-semibold">{children}</th>;
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-3 text-gray-800 ${className ?? ""}`}>{children}</td>;
}
