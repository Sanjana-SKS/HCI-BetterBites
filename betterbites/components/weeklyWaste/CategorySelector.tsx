"use client";

export default function CategorySelector({
  selected,
  onChange,
  categories,
}: {
  selected: string;
  onChange: (c: string) => void;
  categories: string[];
}) {
  return (
    <select
      value={selected}
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
      {categories.map((c) => (
        <option value={c} key={c}>
          {c}
        </option>
      ))}
    </select>
  );
}