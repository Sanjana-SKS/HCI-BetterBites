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

export default function TimelineChart({
  labels,
  quantityValues,
  wasteValues,
}: {
  labels: string[];
  quantityValues: number[];
  wasteValues: number[];
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "Quantity Donated",
        data: quantityValues,
        backgroundColor: "#6C63FF",
      },
       {
        label: "Waste Amount",
        data: wasteValues,
        backgroundColor: "#FF6B6B",
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
        Quantity & Waste Timeline
      </h3>

      <Bar data={data} />
    </div>
  );
}