"use client";

export default function WeekSelector({
  selectedWeek,
  onChange,
  weeks,
}: {
  selectedWeek: string;
  onChange: (w: string) => void;
  weeks: string[];
}) {
  return (
    <select
      value={selectedWeek}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontFamily: "Roboto, sans-serif",
        fontSize: "14px",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.12)",
      }}
    >
      {weeks.map((w) => (
        <option key={w} value={w}>
          {w}
        </option>
      ))}
    </select>
  );
}