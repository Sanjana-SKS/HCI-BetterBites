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

  // Mapping item names → dynamic routes
  const itemRoutes: Record<string, string> = {
    "Croissant Batch": "/analytics/detailed/croissant-batch",
    "Cinnamon Rolls": "/items",  
    Muffins: "/analytics/detailed/muffins",
  };

  //applying same styling from the charts on weeklywaste
  const chartStyling = {
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "24px",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.12)"
  }

  return (
    //implementing feedback of consistent formatting on dashboard pages, applied same styling from waste summary
    <div 
style={{
          display: "flex",
          flexDirection: "column",
          rowGap: "24px",
          maxWidth: "1200px",
          width: "100%",
          paddingLeft: "80px",
          paddingRight: "80px",
}}>

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
      {/* adding the same styling as weekly waste's title */}
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
      }} >
        Detailed Analytics
      </h1>
      <p className="text-lg text-center text-gray-700 mb-12">
        Category: <span className="font-medium">Pastries</span>
      </p>

      {/* stats */}
      {/* changed number of columns to match weekly waste*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <StatCard title="Total Wasted" value="120" />
        <StatCard title="Total Donated" value="280" />
        <StatCard title="Average Quantity" value="25" />
        <StatCard title="Expiring Soon" value="10" />
      </div>

      {/* trend chart */}
      {/* applying chartStyling for consistent styling with weekly waste */}
      <Card style={{...chartStyling, marginBottom: "24px"}}>
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
      {/* applying chartStyling for consistent styling with weekly waste */}
      <Card style={{...chartStyling, marginBottom: "24px"}}>
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
                    <Link href={itemRoutes[r.item] ?? "#"}>
                      <Button size="sm" className="bg-[#6C63FF] text-white">
                        View
                      </Button>
                    </Link>
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


//adding the same styling from the card components found in weekly waste
function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        width: "440px",
        minWidth: "240px",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)",
        padding: "24px",
        alignItems: "flex-start",
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

function Th({ children }: { children: React.ReactNode }) {
  return <th className="py-3 text-left text-gray-800 font-semibold">{children}</th>;
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-3 text-gray-800 ${className ?? ""}`}>{children}</td>;
}

