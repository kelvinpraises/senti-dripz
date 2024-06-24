import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";
import { fetchQueryResponse } from "starklens-ai";
import twilio from "twilio";
import { m_attachments } from "@/utils/db/mock";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const retryLimit = 3; // limit for retries

async function sendSmsResponse(to: string, body: string, attempt = 1) {
  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER as string,
      to,
    });
    console.log(`Message sent to ${to}`);
  } catch (error) {
    console.log(
      `Failed to send message to ${to} on attempt ${attempt}: ${error}`
    );
    if (attempt < retryLimit) {
      await sendSmsResponse(to, body, attempt + 1);
    } else {
      console.log(
        `Failed to send message to ${to} after ${retryLimit} attempts`
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const reqText = await request.text();
    const req = querystring.parse(reqText);

    const smsBody = req.Body as string;
    const fromNumber = req.From as string;

    console.log(`Received Query from ${fromNumber}: ${smsBody}`);

    if (smsBody) {
      // Twilio has received your SMS
      const result = await fetchQueryResponse(
        smsBody,
        process.env.OPENAI_API_KEY as string,
        m_attachments
      );

      console.log(
        `Response for: ${fromNumber}`,
        result.text,
        result.attachments
      );

      const responseBody = `Result: ${result.text}\nAttachments: ${
        result.attachments.lenght > 0 &&
        result.attachments.map((a: any) => a.name).join(", ")
      }`;

      console.log(responseBody);

      // Send response back to the user
      await sendSmsResponse(fromNumber, responseBody);

      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "No SMS body received" },
        { status: 400 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error", e },
      { status: 500 }
    );
  }
}
