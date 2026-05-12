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

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type as "image/png" | "image/jpeg" | "application/pdf";

    const isImage = mimeType.startsWith("image/");
    const isPDF = mimeType === "application/pdf";

    if (!isImage && !isPDF) {
      return NextResponse.json(
        { error: "Only image or PDF files are supported." },
        { status: 400 }
      );
    }

    const userPrompt = buildUserPrompt(audience, context, format);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userPrompt,
          },
          isImage
            ? {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                },
              }
            : {
                type: "text",
                text: `[PDF uploaded — extract and analyse all visible data, metrics, and text from this document.]\nBase64 PDF: data:application/pdf;base64,${base64}`,
              },
        ],
      },
    ];

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