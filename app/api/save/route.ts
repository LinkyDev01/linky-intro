import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, resultType, selectedGathering, answers, talk, depth, spark, focus } = body;

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
      // Silently skip if env vars not configured
      return NextResponse.json({ success: true, skipped: true });
    }

    const auth = new google.auth.JWT(clientEmail, undefined, privateKey, [
      "https://www.googleapis.com/auth/spreadsheets",
    ]);

    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = new Date().toISOString();

    const answerList = Array.isArray(answers) ? answers : [];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          timestamp,
          sessionId,
          resultType,
          selectedGathering || "",
          answerList[0] || "",
          answerList[1] || "",
          answerList[2] || "",
          talk,
          depth,
          spark,
          focus,
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Google Sheets save error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save" },
      { status: 500 }
    );
  }
}
