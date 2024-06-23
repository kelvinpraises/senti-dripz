import type { NextApiRequest, NextApiResponse } from "next";

import { fetchQueryResponse } from "starklens-ai";

import twilio from "twilio";
import { m_attachments } from "@/utils/db/mock";
import { NextRequest, NextResponse } from "next/server";

const apiKeySid = process.env.TWILIO_API_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

//TODO: Twilio client can only respond to domestic text messages

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    const smsBody = req.Body;
    const fromNumber = req.From;

    console.log(`Received Query from ${fromNumber}: ${smsBody}`);

    if (smsBody) {
      //Twilo has received your sms
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
      return NextResponse.json(result, { status: 200 });
    }
  } catch (e) {
    console.log(e);
  }
}
