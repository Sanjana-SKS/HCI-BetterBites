import WeeklyWasteSummary from "@/components/weeklyWaste/WeeklyWasteSummary";
import Link from "next/link";

export const metadata = {
  title: "Better Bites Donation System",
  description: "Weekly waste and donation insights",
};

export default function WeeklyWastePage() {
  return (
    <div className="space-y-6">
      {/* Top actions */}
      <div className="flex justify-end">
        <Link
          href="/weekly-waste/compare"
          className="rounded-md bg-[#6C63FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#574bff]"
        >
          Compare Weeks
        </Link>
      </div>

      <WeeklyWasteSummary />
    </div>
  );
}
