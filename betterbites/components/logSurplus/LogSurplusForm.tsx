"use client";

import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function LogSurplusForm() {

  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiration, setExpiration] = useState("");
  const [category, setCategory] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    item: string;
    quantity: string;
    expiration: string;
    category: string;
  } | null>(null);

  const categories = [
    "Pastries",
    "Vegetables",
    "Proteins",
    "Dairy",
    "Grains",
    "Fruits",
    "Other",
  ];

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const minDate = `${year}-${month}-${day}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!item || !quantity || !expiration) {
      alert("Please fill in item, quantity, and expiration date");
      return;
    }

    // stor submitted data and show confirmation
    setSubmittedData({ item, quantity, expiration, category });
    setShowConfirmation(true);

    //resets form after use
    setItem("");
    setQuantity("");
    setExpiration("");
    setCategory("");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          paddingTop: "40px",
          paddingBottom: "40px",
          backgroundImage: "url('/backgrounds/food-background.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "350px",
          backgroundPosition: "top left",
          backgroundColor: "#D9D9D9",
        }}
      >
        {/* Page title */}
        <h1
          style={{
            color: "#000",
            textAlign: "center",
            textShadow: "0 4px 4px rgba(0,0,0,0.25)",
            fontFamily: "Roboto, sans-serif",
            fontSize: "32px",
            fontWeight: 500,
            lineHeight: "40px",
            marginBottom: "48px",
            marginTop: "0",
          }}
        >
          Log Donation Items
        </h1>

        {/* Form container */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <form onSubmit={handleSubmit}>

              {/* Item input */}
              <div style={{ marginBottom: "24px" }}>
                  <label
                      style={{
                          display: "block",
                          color: "#000",
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          marginBottom: "8px",
                      }}
                  >
                      Item *
                  </label>
                  <input
                      type="text"
                      placeholder="Enter item"
                      value={item}
                      onChange={(e) => setItem(e.target.value)}
                      style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "4px",
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "14px",
                          boxSizing: "border-box",
                      }}
                  />
              </div>

            {/* Quantity input */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "#000",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                placeholder="Enter quantity (e.g., 5 items)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "4px",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Expiration date input */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  color: "#000",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Expiration Date *
              </label>
              <input
                type="date"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                min = {minDate}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "4px",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Category dropdown */}
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  color: "#000",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Category (Optional)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "4px",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
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
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirmation && submittedData && (
        <ConfirmationModal
          data={submittedData}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
}
