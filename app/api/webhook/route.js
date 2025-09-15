// /app/api/webhook/route.js
import { NextResponse } from "next/server";
import axios from "axios";

// ---- SSE clients storage ----
let clients = [];

function sendToClients(data) {
  clients.forEach((controller) => {
    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// ---- WhatsApp token and phone number ID ----
const token = "EAALAswZBD9zMBPYZBGZASV0LrtJZBGocZANFPnSZBZCAT6Azll5JvgxLYXaZCZCb1S01P8yDXFbRfKqY3h4lnL4syIzAVlUyBh0zdIUNa0Y0EdcL4WxQdV82hmVfLAP5Xg1YOZA87HKPqZByc4ccnwZAZAjLO5Ckoe5Xwvp88NGZCyrNTudoliL4PeMTpKIt2aA0MxfEAnaQZDZD";
const phoneNumberId = "780758658453109";

// ---- GET: Verification / SSE ----
export async function GET(req) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const tokenParam = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  // Webhook verification (WhatsApp)
  if (mode === "subscribe" && tokenParam === "123456") {
    return NextResponse.json(challenge);
  }

  // SSE endpoint for real-time updates
  const stream = new ReadableStream({
    start(controller) {
      clients.push(controller);
      req.signal.addEventListener("abort", () => {
        clients = clients.filter((c) => c !== controller);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// ---- POST: Receive WhatsApp messages ----
export async function POST(req) {
  try {
    const body = await req.json();
    const entry = body.entry[0].changes[0].value;

    const waId = entry.contacts[0].wa_id;
    const contactName = entry.contacts[0].profile.name;
    const messageBody = entry.messages[0].text.body;
    const messageType = entry.messages[0].type;

    console.log("Received message:", messageBody);

    // Send to SSE clients (frontend)
    sendToClients({ waId, contactName, messageBody });

    // Prepare automatic reply
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: waId,
      type: "text",
      text: {
        preview_url: false,
        body: `Hello ${contactName}, your message was received!`,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      payload,
      { headers }
    );

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
