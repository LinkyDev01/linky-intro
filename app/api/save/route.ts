import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    const scriptUrl = "https://script.google.com/macros/s/AKfycbzjMQTgieASfHip99ZX5LJ3c-iFcoyoTaAO-mUqBf5IC2wrXEpyPFVA3UJlLgEeQ5E/exec";

    if (!scriptUrl) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, ip }),
    });

    if (!res.ok) {
      throw new Error(`Google Script responded with ${res.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Google Sheets save error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save" },
      { status: 500 }
    );
  }
}
