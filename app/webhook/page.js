"use client";
import { useEffect, useState } from "react";

export default function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const evt = new EventSource("/api/webhook");
    evt.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [data, ...prev]);
    };
    return () => evt.close();
  }, []);

  return (
    <div>
      <h2>Incoming Messages</h2>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.contactName}:</strong> {msg.messageBody}
          </li>
        ))}
      </ul>
    </div>
  );
}
