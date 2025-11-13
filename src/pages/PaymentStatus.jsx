import React from "react";

export default function PaymentStatus() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1>Payment Status</h1>
      <p>Your payment details or transaction result will appear here.</p>
    </div>
  );
}
