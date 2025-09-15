
// 'use client'
// import React, { useState } from "react";
// import "./test.css";

// export default function WhatsAppSender() {
//   const [number, setNumber] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!number) return;
//     const formattedNumber = number.replace(/\D/g, ""); // keep only digits
//     window.open(`https://wa.me/${formattedNumber}`, "_blank");
//   };

//   return (
//     <div className="container">
//       <form onSubmit={handleSubmit} className="form-box">
//         <h2 className="title">Send WhatsApp Message</h2>
//         <input
//           type="tel"
//           placeholder="Enter phone number"
//           value={number}
//           onChange={(e) => setNumber(e.target.value)}
//           className="input"
//         />
//         <button type="submit" className="btn">
//           Open WhatsApp
//         </button>
//       </form>
//     </div>
//   );
// }



// Orders.js


// 'use client'
// import React, { useEffect, useState } from "react";
// import "./test.css";

// const Orders = () => {
//   const [lastOrder, setLastOrder] = useState(null);

//   const API_KEY = "AIzaSyC4CESKt3iErfEnVJa0A5L7tW7uc_vNPJs";
//   const SPREADSHEET_ID = "1XhZT7rrASGgpqYsbIRH5yKUQ_hOmdDR0ed8a6_pEVmI";
//   const RANGE = "Sheet1!A:D"; // fullName, phone, address, city

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
//       const res = await fetch(url);
//       const data = await res.json();
//       if (data.values && data.values.length > 1) {
//         const lastRow = data.values[data.values.length - 1];
//         setLastOrder({
//           fullName: lastRow[0],
//           phone: lastRow[1],
//           address: lastRow[2],
//           city: lastRow[3],
//         });
//       }
//     };

//     fetchOrders();
//     const interval = setInterval(fetchOrders, 5000); // check every 5s
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="orders-container">
//       <h2>📦 آخر طلب جديد</h2>
//       {lastOrder ? (
//         <div className="order-card">
//           <p><strong>👤 الاسم الكامل:</strong> {lastOrder.fullName}</p>
//           <p><strong>📞 الهاتف:</strong> {lastOrder.phone}</p>
//           <p><strong>🏠 العنوان:</strong> {lastOrder.address}</p>
//           <p><strong>🌍 المدينة:</strong> {lastOrder.city}</p>
//         </div>
//       ) : (
//         <p>⏳ لا توجد طلبات بعد</p>
//       )}
//     </div>
//   );
// };

// export default Orders;












"use client";
import React, { useState } from "react";

const WhatsAppForm = () => {
  const [number, setNumber] = useState("+212699675430"); // default recipient
  const [message, setMessage] = useState("Hello from Next.js & WhatsApp API 👋");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ Sending...");

    try {
      const res = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Message sent! Response: " + JSON.stringify(data));
      } else {
        setStatus("❌ Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setStatus("⚠️ Error: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", fontFamily: "sans-serif" }}>
      <h2>Send WhatsApp Message</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipient number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <textarea
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#25D366",
            color: "white",
            padding: "10px",
            width: "100%",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send WhatsApp
        </button>
      </form>
      {status && (
        <p
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            color: status.startsWith("✅")
              ? "green"
              : status.startsWith("❌") || status.startsWith("⚠️")
              ? "red"
              : "black",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default WhatsAppForm;
