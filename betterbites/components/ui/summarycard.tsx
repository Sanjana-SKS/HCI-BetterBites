"use client";

export default function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "440px",
        minWidth: "240px",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)",
        padding: "24px",
        rowGap: "12px",
      }}
    >
      <h3
        style={{
          color: "#000",
          fontFamily: "Roboto, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          lineHeight: "20px",
          margin: 0,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#757575",
          fontFamily: "Roboto, sans-serif",
          fontSize: "14px",
          lineHeight: "20px",
          margin: 0,
          whiteSpace: "pre-line",
        }}
      >
        {value}
      </p>
    </div>
  );
}
