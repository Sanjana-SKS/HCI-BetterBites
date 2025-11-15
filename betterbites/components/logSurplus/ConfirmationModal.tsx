"use client";

export default function ConfirmationModal({
  data,
  onClose,
}: {
  data: { quantity: string; expiration: string; category: string };
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          padding: "40px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success icon */}
        <div
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#C9FDCB",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <span
            style={{
              fontSize: "32px",
              color: "#22c55e",
            }}
          >
            ✓
          </span>
        </div>

        {/* Confirmation message */}
        <h2
          style={{
            color: "#000",
            fontFamily: "Roboto, sans-serif",
            fontSize: "20px",
            fontWeight: 600,
            margin: "0 0 16px 0",
          }}
        >
          Surplus Item Logged Successfully!
        </h2>

        <p
          style={{
            color: "#757575",
            fontFamily: "Roboto, sans-serif",
            fontSize: "14px",
            lineHeight: "20px",
            marginBottom: "24px",
          }}
        >
          Your surplus item has been recorded and is ready for donation.
        </p>

        {/* Item summary */}
        <div
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: "4px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              margin: "8px 0",
              color: "#000",
              fontFamily: "Roboto, sans-serif",
              fontSize: "13px",
            }}
          >
            <strong>Quantity:</strong> {data.quantity} items
          </p>
          <p
            style={{
              margin: "8px 0",
              color: "#000",
              fontFamily: "Roboto, sans-serif",
              fontSize: "13px",
            }}
          >
            <strong>Expiration:</strong> {data.expiration}
          </p>
          {data.category && (
            <p
              style={{
                margin: "8px 0",
                color: "#000",
                fontFamily: "Roboto, sans-serif",
                fontSize: "13px",
              }}
            >
              <strong>Category:</strong> {data.category}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#6C4AB6",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            fontFamily: "Roboto, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#5a3a94")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#6C4AB6")
          }
        >
          Done
        </button>
      </div>
    </div>
  );
}
