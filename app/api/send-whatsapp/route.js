import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { number } = await req.json();

    // Step 1: Check number
    if (!number) {
      console.log("❌ No phone number provided.");
      return NextResponse.json(
        { error: "❌ Number is required" },
        { status: 400 }
      );
    }
    console.log(`ℹ️ Sending WhatsApp message to: ${number}`);

    // Step 2: Setup WhatsApp Cloud API values
    const phone_number_id = "780758658453109"; // Use your phone number ID from dashboard
    const token = "EAALAswZBD9zMBPYZBGZASV0LrtJZBGocZANFPnSZBZCAT6Azll5JvgxLYXaZCZCb1S01P8yDXFbRfKqY3h4lnL4syIzAVlUyBh0zdIUNa0Y0EdcL4WxQdV82hmVfLAP5Xg1YOZA87HKPqZByc4ccnwZAZAjLO5Ckoe5Xwvp88NGZCyrNTudoliL4PeMTpKIt2aA0MxfEAnaQZDZD"; // Use your real token
    const url = `https://graph.facebook.com/v22.0/${phone_number_id}/messages`;

    // Step 3: Prepare request payload
    const payload = {
      messaging_product: "whatsapp",
      to: number,
      type: "template",
      template: {
        name: "saadlolo", // Use your approved template name
        language: { code: "en_US" }
      }
    };

    console.log(`ℹ️ Sending payload:`, payload);

    // Step 4: Send the message
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    // Step 5: Handle API response
    const data = await response.json();
    console.log("ℹ️ WhatsApp API response:", data);

    if (!response.ok) {
      console.log("❌ WhatsApp API error:", data.error?.message || data);
      return NextResponse.json(
        { error: data.error?.message || "WhatsApp API failed", details: data },
        { status: response.status }
      );
    }

    // Step 6: Check if the message status is accepted
    const messageStatus = data?.messages?.[0]?.message_status;
    if (messageStatus === "accepted") {
      // For real delivery status, you need to use webhooks!
      console.log("✅ Message accepted for delivery, but not guaranteed delivered yet.");
      return NextResponse.json({
        info: "✅ Message accepted by WhatsApp API. Delivery not confirmed yet.",
        apiResponse: data,
        nextStep: "For real delivery confirmation, you must set up a webhook endpoint to listen for 'delivered' status."
      });
    } else {
      console.log("⚠️ Message was not accepted for delivery.", data);
      return NextResponse.json({
        error: "❌ Message was not accepted for delivery.",
        details: data
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}