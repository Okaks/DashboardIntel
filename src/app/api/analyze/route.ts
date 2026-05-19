import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, buildUserPrompt } from "../../../lib/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const audience = formData.get("audience") as string;
    const context = formData.get("context") as string;
    const format = formData.get("format") as string;
    const file = formData.get("file") as File;

    if (!audience || !format || !file) {
      return NextResponse.json(
        { error: "Audience, format, and a file upload are required." },
        { status: 400 }
      );
    }

    const mimeType = file.type;
    const isImage = mimeType.startsWith("image/");
    const isPDF = mimeType === "application/pdf";

    if (!isImage && !isPDF) {
      return NextResponse.json(
        { error: "Only image or PDF files are supported." },
        { status: 400 }
      );
    }

    const userPrompt = buildUserPrompt(audience, context, format);
    let messages: OpenAI.Chat.ChatCompletionMessageParam[];

    if (isImage) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");

      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        },
      ];
    } else {
      // PDF — extract text using basic buffer reading
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Extract readable text from PDF buffer
      const rawText = buffer.toString("latin1");
      const textMatches = rawText.match(/BT[\s\S]*?ET/g) || [];
      let extractedText = textMatches
        .join(" ")
        .replace(/[^\x20-\x7E\n]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // Fallback: extract any readable ASCII strings
      if (extractedText.length < 100) {
        extractedText = rawText
          .replace(/[^\x20-\x7E\n]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 8000);
      } else {
        extractedText = extractedText.slice(0, 8000);
      }

      messages = [
        {
          role: "user",
          content: `${userPrompt}\n\nDASHBOARD CONTENT (extracted from PDF):\n${extractedText}`,
        },
      ];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1500,
    });

    const analysis = response.choices[0].message.content;
    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}