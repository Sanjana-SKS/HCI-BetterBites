"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const logs = [
  { date: "10/21", qty: 12, status: "Completed", expired: "No", donated: "Yes", notes: "-" },
  { date: "10/20", qty: 15, status: "Flagged", expired: "Yes", donated: "No", notes: "Midday batch waste" },
  { date: "10/19", qty: 10, status: "Completed", expired: "No", donated: "Yes", notes: "-" },
];


const purplePill = "bg-[#E8D5FF] text-black font-semibold";

export default function ItemLogPage() {
  
  const itemName = "Cinnamon Rolls";

  //filter state
  const [selectedDate, setSelectedDate] = useState<string | "all">("all");

  //sort state
  const [sortBy, setSortBy] = useState<"date" | "qty" | "status">("date");

  //dates for the filter dropdown
  const allDates = Array.from(new Set(logs.map((l) => l.date)));

  //apply date filter 
  const filteredLogs =
    selectedDate === "all"
      ? logs
      : logs.filter((l) => l.date === selectedDate);

  //apply sorting
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === "date") return b.date.localeCompare(a.date);
    if (sortBy === "qty") return b.qty - a.qty;
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  //show info based on selected date
  const selectedEntry =
    selectedDate === "all" ? null : logs.find((l) => l.date === selectedDate);

  return (
    <div className="min-h-screen bg-food-pattern flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 pb-16 pt-10">

        {/* back button */}
        <div className="mb-6">
          <Link href="/items" className="text-black font-medium hover:underline">
            ← Back
          </Link>
        </div>

        {/* title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Item Log</h1>
          <p className="text-xl font-medium">Item: {itemName}</p>
        </div>

        {/* filter + pills */}
        <div className="flex flex-col items-center gap-4 mb-10">

          {/* date dropdown */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-400 bg-white text-black"
          >
            <option value="all">All Dates</option>
            {allDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>

          {/* show quantity */}
          {selectedEntry && (
            <div className="flex gap-4">
              <div className={`px-6 py-2 rounded-full ${purplePill}`}>
                Quantity: {selectedEntry.qty}
              </div>
              <div className={`px-6 py-2 rounded-full ${purplePill}`}>
                Status: {selectedEntry.status}
              </div>
            </div>
          )}
        </div>

        {/* table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-10">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <Th>Date</Th>
                <Th>Qty</Th>
                <Th>Status</Th>
                <Th>Expired</Th>
                <Th>Donated</Th>
                <Th>Notes</Th>
              </tr>
            </thead>

            <tbody>
              {sortedLogs.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                  <Td>{row.date}</Td>
                  <Td>{row.qty}</Td>
                  <Td>{row.status}</Td>
                  <Td>{row.expired}</Td>
                  <Td>{row.donated}</Td>
                  <Td>{row.notes}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* sort buttons */}
        <div className="flex flex-wrap items-center gap-4 justify-center mt-6">

          <div className="flex items-center gap-2 bg-[#FEF7FF] border border-[#E0E0E0]
            rounded-full px-4 py-2 shadow-sm">
            <span className="text-sm font-medium text-[#49454F]">Sort By</span>
          </div>

          <Button
  onClick={() => setSortBy("date")}
  className="rounded-full bg-[#E9D8FD] text-[#4A148C] 
             hover:bg-[#D6BCFA] hover:text-[#4A148C]
             px-8 py-2 text-sm font-semibold transition"
>
  Date
</Button>


         <Button
  onClick={() => setSortBy("qty")}
  className="rounded-full bg-[#E9D8FD] text-[#4A148C] 
             hover:bg-[#D6BCFA] hover:text-[#4A148C]
             px-8 py-2 text-sm font-semibold transition"
>
  Quantity
</Button>


          <Button
  onClick={() => setSortBy("status")}
  className="rounded-full bg-[#E9D8FD] text-[#4A148C] 
             hover:bg-[#D6BCFA] hover:text-[#4A148C]
             px-8 py-2 text-sm font-semibold transition"
>
  Status
</Button>


        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-3 px-6 text-gray-900 text-lg font-semibold">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="py-4 px-6 text-gray-800 text-base align-middle">
      {children}
    </td>
  );
}
