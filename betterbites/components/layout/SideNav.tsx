"use client";

import Image from "next/image";
import Link from "next/link";

export default function SideNav() {
  return (
    <aside
      style={{
        display: "flex",
        width: "117px",
        height: "984px",
        flexDirection: "column",
        justifyContent: "flex-start", 
        alignItems: "center",
        flexShrink: "0",
        backgroundColor: "#FAF5F5",
        borderRight: "1px solid #E5E7EB",
      }}
      className="fixed top-0 left-0 z-30 flex flex-col items-center w-[117px] h-screen bg-[#FAF5F5] border-r"
    >
      <div
        className="flex flex-col items-center"
        style={{
          paddingTop: "220px", 
          gap: "40px",
        }}
      >
        {/* Dashboard link */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            padding: "var(--sds-size-space-200, 8px)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--sds-size-space-200, 8px)",
          }}
        >
          <Image src="/icons/home-new.png" alt="Dashboard" width={24} height={24} />
          <span
            style={{
              color: "var(--sds-color-text-default-secondary, #757575)",
              textAlign: "center",
              fontFamily:
                "var(--sds-typography-body-font-family, Roboto, sans-serif)",
              fontSize: "var(--sds-typography-body-size-small, 14px)",
              fontStyle: "normal",
              fontWeight:
                "var(--sds-typography-body-font-weight-strong, 600)",
              lineHeight: "100%",
            }}
          >
            Dashboard
          </span>
        </Link>

        {/* Log Surplus Item link */}
        <Link
          href="/log-surplus-item"
          style={{
            display: "inline-flex",
            padding: "var(--sds-size-space-200, 8px)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--sds-size-space-200, 8px)",
          }}
        >
          <Image src="/icons/add-new_2.png" alt="Log Surplus Item" width={24} height={24} />
          <span
            style={{
              color: "var(--sds-color-text-default-secondary, #757575)",
              textAlign: "center",
              fontFamily:
                "var(--sds-typography-body-font-family, Roboto, sans-serif)",
              fontSize: "var(--sds-typography-body-size-small, 14px)",
              fontStyle: "normal",
              fontWeight:
                "var(--sds-typography-body-font-weight-strong, 600)",
              lineHeight: "100%",
            }}
          >
            Log Item
          </span>
        </Link>

        {/* History link */}
        <Link
          href="/weekly-waste"
          style={{
            display: "inline-flex",
            padding: "var(--sds-size-space-200, 8px)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--sds-size-space-200, 8px)",
          }}
        >
          <Image src="/icons/history-new.png" alt="History" width={24} height={24} />
          <span
            style={{
              color: "var(--sds-color-text-default-secondary, #757575)",
              textAlign: "center",
              fontFamily:
                "var(--sds-typography-body-font-family, Roboto, sans-serif)",
              fontSize: "var(--sds-typography-body-size-small, 14px)",
              fontStyle: "normal",
              fontWeight:
                "var(--sds-typography-body-font-weight-strong, 600)",
              lineHeight: "100%",
            }}
          >
            History
          </span>
        </Link>

          {/* Schedule PickUp Link */}
        <Link
          href="/pickup"
          style={{
            display: "inline-flex",
            padding: "var(--sds-size-space-200, 8px)",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--sds-size-space-200, 8px)",
          }}
        >
          <Image src="/icons/pickup-new.png" alt="Schedule Pickup" width={24} height={24} />
          <span
            style={{
              color: "var(--sds-color-text-default-secondary, #757575)",
              textAlign: "center",
              fontFamily:
                "var(--sds-typography-body-font-family, Roboto, sans-serif)",
              fontSize: "var(--sds-typography-body-size-small, 14px)",
              fontStyle: "normal",
              fontWeight:
                "var(--sds-typography-body-font-weight-strong, 600)",
              lineHeight: "100%",
            }}
          >
            Pickup
          </span>
        </Link> 
       
      </div>
    </aside>
  );
}
