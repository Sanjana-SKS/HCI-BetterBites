"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#81C784", "#B39DDB"],
      },
    ],
  };

  return (
    <div
      style={{
        width: "360px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "24px",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.12)",
      }}
    >
      <h3
        style={{
          fontFamily: "Roboto, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "16px",
        }}
      >
        Category Breakdown
      </h3>

      <Pie data={data} />
    </div>
  );
}