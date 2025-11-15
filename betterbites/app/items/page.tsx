"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

const data = [
  { week: "Week 1", quantity: 12, waste: 4 },
  { week: "Week 2", quantity: 10, waste: 3 },
  { week: "Week 3", quantity: 14, waste: 5 },
  { week: "Week 4", quantity: 11, waste: 4 },
];

export default function ItemDetailPage() {
  return (
    <div className="min-h-screen w-full bg-food-pattern p-10 flex flex-col gap-8">

      {/* Top: Back + Title + Category */}
      <div className="flex justify-between items-center w-full">
        <Link href="/analytics/detailed" className="text-lg underline">
          ← Back
        </Link>

        <h1 className="text-5xl font-bold text-center flex-1 -ml-10">Item Detail</h1>

        <span className="px-4 py-1 bg-purple-200 rounded-full text-sm font-semibold">
          Category: Pastries
        </span>
      </div>

      {/* Subheading */}
      <div className="flex justify-center -mt-4">
        <span className="px-4 py-1 bg-purple-100 rounded-full text-sm font-semibold">
          Item: Cinnamon Rolls
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6 w-full">
        {/* Averge Qty */}
        <Card className="h-48 flex flex-col justify-between shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Average Quantity (4 weeks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12</p>
          </CardContent>
        </Card>

        {/* Waste Rate */}
        <Card className="h-48 flex flex-col justify-between shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Waste Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">50%</p>
          </CardContent>
        </Card>

        {/* Donation Rate */}
        <Card className="h-48 flex flex-col justify-between shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Donation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">50%</p>
          </CardContent>
        </Card>

        {/* Expiration Risk */}
        <Card className="h-48 flex flex-col justify-between shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Expiration Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">High</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="w-full h-[420px] bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Quantity & Waste Timeline
          </CardTitle>
        </CardHeader>

        <CardContent className="w-full h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" name="Quantity" />
              <Bar dataKey="waste" name="Waste" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Buttons */}
      <div className="flex justify-center gap-6 mt-4">
        <Button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-lg">
          Edit Item
        </Button>

        <Link href="/logs/cinammon-rolls">
          <Button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-lg">
            View Logs
          </Button>
        </Link>

        <Button className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white text-lg">
          Delete Item
        </Button>
      </div>

    </div>
  );
}
