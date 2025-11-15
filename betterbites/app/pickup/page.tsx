"use client";

import { useState } from "react";

const charities = {
  "North Texas Food Bank": {
    accepts: ["Short-dated items","Produce + perishables","Overruns / mislabeled items (properly labeled)",],
    rejects: ["Damaged packaging","Expired baby food","Ice cream","Unlabeled items",],
  },

  "Crossroads Community Services": {
    accepts: ["Shelf-stable cans", "Dried goods (pasta, rice, beans)", "Peanut butter"],
    rejects: ["Refrigerated items","Expired food","Leftovers or homemade food","Glass containers",],
  },

  "Feeding America": {
    accepts: ["Shelf-stable canned foods", "Rice / pasta", "Peanut butter", "Some household items"],
    rejects: ["Perishables", "Expired food", "Leftovers", "Damaged packaging", "Glass containers"],
  },
};

export default function PickupPage() {
  const [charity, setCharity] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  return (
    <div
      style={{
        backgroundColor: "#faf7f2",
        minHeight: "100vh",
        paddingTop: "60px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "25px",
          color: "#000"
        }}
      >
        Schedule Donation Pickup
      </h1>
      
      <div
        style={{
          width: "420px",
          margin: "0 auto",
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
          color: "#000"
        }}
      >
    
        <label style={{ fontWeight: 600 }}>Choose a Charity</label>
        <select
          value={charity}
          onChange={(e) => setCharity(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: 20,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        >
          <option value="">-- Select one --</option>
          {Object.keys(charities).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {charity && (
          <div
            style={{
              backgroundColor: "#fff6da",
              padding: "14px",
              marginBottom: 12,
              borderRadius: 6,
              border: "1px solid #f3d074",
              fontSize: 14,
              lineHeight: 1.5,
              textAlign: "left",
              color: "#000"
            }}
          > 
            <strong style={{ display: "block", marginBottom: 6 }}>Accepts:</strong>
            <ul style={{ marginLeft: 20 }}>
              {charities[charity].accepts.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <strong style={{ display: "block", margin: "10px 0 6px" }}>
              Does NOT accept:
            </strong>
            <ul style={{ marginLeft: 20 }}>
              {charities[charity].rejects.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

    <label style={{ fontWeight: 600 }}>Pickup Date</label>
        <input
        type="date"
        value={pickupDate}
        onChange={(e) => setPickupDate(e.target.value)}
        required
        style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: 6,
            border: "1px solid #ccc",
        }}
        />

    <label style={{ fontWeight: 600 }}>Time Slot</label>
        <select
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
        required
        style={{
            width: "100%",
            padding: "10px",
            marginBottom: 20,
            border: "1px solid #ccc",
            borderRadius: 6,
        }}
>
    <option value="">-- Select time slot --</option>
    <option value="9-11AM">9:00-11:00 AM</option>
    <option value="11AM-1PM">11:00-1:00 PM</option>
    <option value="1-3PM">1:00-3:00 PM</option>
    <option value="3-5PM">3:00-5:00 PM</option>
    <option value="5-7PM">5:00-7:00 PM</option>
</select>
      </div>
    </div>
  );
}
