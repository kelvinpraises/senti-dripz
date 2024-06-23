import { NextRequest, NextResponse } from "next/server";
import { fetchQueryResponse } from "starklens-ai";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { prompt, data } = req;

    const result = await fetchQueryResponse(
      prompt,
      process.env.OPENAI_API_KEY as string,
      data
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("Error processing events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
