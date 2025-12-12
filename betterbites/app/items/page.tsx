"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SummaryCard from "@/components/ui/summarycard";
import TimelineChart from "@/components/weeklyWaste/charts/QuantityWasteTimelineChart";


export default function ItemDetailPage() {
  const router = useRouter();


  const handleCompareWeeks = () => {
    router.push(
      `/weekly-waste/compare`
    );
  };

  const handleExportReport = () => {
    router.push(
      `/weekly-waste/export`
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
              Item: Cinnamon Rolls
            </span>
          </div>

          <span className="inline-flex items-center rounded-full bg-[#E5CCFF] px-4 py-1 text-xs font-semibold text-[#2C2C2C]">
            Category: Pastries
          </span>
        </div>

        {/* title */}
        <h1 style={{
          fontSize: "36px",
          fontWeight: 700,
          textAlign: "center",

        }}>
          
          Item Detail</h1>

        {/* summary card section*/}
        <div 
        style={{ 
          display: "flex", 
          gap: "24px",
          padding: "20px",
          paddingBottom: "30px"
        }}>

           <SummaryCard
        title="Average Quantity (4 weeks)" value={12} />
         <SummaryCard
        title="Waste Rate %" value={50} />
         <SummaryCard
        title="Donation Rate %" value={50} />
        <SummaryCard
        title="Expiration Risk" value={"High"} />
        </div>

        {/* adding Quantity & Wasteline Timeline */}

        <div style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "30px",

        }}>

        <TimelineChart
        labels={["Week 1", "Week 2", "Week 3", "Week 4"]}
        quantityValues={[10, 12, 12, 14]}
        wasteValues={[5,6,6,7]} />
        </div>
       
       {/* adding note section */}
       <div style={{
        display: "flex",
        justifyContent: "center",
        padding: "30px",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        paddingBottom: "60px"
       }}>
       <SummaryCard
       title="Notes" value={" - More likely expire on Tuesday because of low morning demand"} />
       </div>

        {/* bottom buttons */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8">
          <PrimaryButton onClick={handleCompareWeeks}>
            Compare Weeks
          </PrimaryButton>

          <Link href="/item-logs/cinammon-rolls">
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
