"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function WeeklyBarChart({
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
        label: "Items Donated",
        data: values,
        backgroundColor: "#6C63FF",
      },
    ],
  };

  return (
    <div
      style={{
        width: "480px",
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
        Donations by Day
      </h3>

      <Bar data={data} />
    </div>
  );
}