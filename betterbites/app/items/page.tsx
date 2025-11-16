"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { isoAddDays } from "../../components/weeklyWaste/utils/dateUtils";


const timelineData = [
  { week: "Week 1", qty: 10, waste: 5 },
  { week: "Week 2", qty: 12, waste: 6 },
  { week: "Week 3", qty: 14, waste: 7 },
  { week: "Week 4", qty: 12, waste: 6 },
];

export default function ItemDetailPage() {
  const router = useRouter();

  const itemName = "Cinnamon Rolls";

  // For now we’ll use a representative ISO date for this item.
  // In a real app this would come from data for the selected item.
  const itemDate = "2025-10-27"; // YYYY-MM-DD
  const previousWeek = isoAddDays(itemDate, -7);

  const handleCompareWeeks = () => {
    router.push(
      `/weekly-waste/compare?weekA=${encodeURIComponent(
        itemDate
      )}&weekB=${encodeURIComponent(previousWeek)}`
    );
  };

  const handleExportReport = () => {
    router.push(
      `/weekly-waste/export?weekA=${encodeURIComponent(
        itemDate
      )}&weekB=${encodeURIComponent(previousWeek)}`
    );
  };

  return (
    <div className="min-h-screen w-full bg-food-pattern">
      <div className="max-w-6xl mx-auto pb-16">
        {/* top bar */}
        <div className="flex items-center justify-between pt-6 mb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/analytics/detailed"
              className="text-black font-medium hover:underline flex items-center gap-1"
            >
              ← <span>Back</span>
            </Link>

            <span className="inline-flex items-center rounded-full bg-[#E5CCFF] px-4 py-1 text-xs font-semibold text-[#2C2C2C]">
              Item: {itemName}
            </span>
          </div>

          <span className="inline-flex items-center rounded-full bg-[#E5CCFF] px-4 py-1 text-xs font-semibold text-[#2C2C2C]">
            Category: Pastries
          </span>
        </div>

        {/* title */}
        <h1 className="text-4xl font-bold text-center mb-10">Item Detail</h1>

        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Average Quantity (4 weeks)" value="12" />
          <StatCard title="Waste Rate" value="50%" />
          <StatCard title="Donation Rate" value="50%" />
          <StatCard title="Expiration Risk" value="High" />
        </div>

        {/* chart */}
        <Card className="bg-white/95 shadow-md border border-gray-200 mb-8">
          <CardHeader>
            <CardTitle>Quantity &amp; Waste Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineData}>
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="qty"
                    fill="#6C63FF"
                    barSize={18}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="waste"
                    fill="#B39DDB"
                    barSize={18}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* notes */}
        <section className="mb-10">
          <p className="mb-2 text-base font-medium text-gray-900">Notes</p>
          <div className="rounded-lg border border-gray-200 bg-white/95 px-6 py-4 text-sm text-gray-800">
            <ul className="list-disc space-y-1 pl-5">
              <li>Frequently expires on Tuesday due to low morning demand.</li>
              <li>Consider smaller batch size on weekdays.</li>
            </ul>
          </div>
        </section>

        {/* bottom buttons */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8">
          <PrimaryButton onClick={handleCompareWeeks}>
            Compare Weeks
          </PrimaryButton>

          <Link href="/item-logs">
            <PrimaryButton>View Logs</PrimaryButton>
          </Link>

          <PrimaryButton onClick={handleExportReport}>
            Export Report
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="bg-white/95 shadow-md border border-gray-200">
      <CardContent className="flex h-44 flex-col justify-between p-6">
        <p className="text-lg font-semibold text-gray-900 mb-2">{title}</p>
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className="rounded-2xl bg-[#9346FF] px-12 py-6 text-lg font-normal text-white shadow-md hover:bg-[#7b33e6]"
    >
      {children}
    </Button>
  );
}
