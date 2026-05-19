import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "../../../lib/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    let analysis = "";

    if (isImage) {
      // GPT-4o for images
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
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
        ],
        max_tokens: 1500,
      });
      analysis = response.choices[0].message.content || "";

    } else {
      // Claude for PDFs - reads natively with full visual understanding
      const response = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64,
                },
              },
              {
                type: "text",
                text: userPrompt,
              },
            ],
          },
        ],
      });
      analysis = response.content
        .filter((block) => block.type === "text")
        .map((block) => (block as { type: "text"; text: string }).text)
        .join("\n");
    }

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}