import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import { z } from "zod";
import OpenAI from 'openai';
import { env } from "~/env";

const summarizeRequestSchema = z.object({
  filename: z.string(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = summarizeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { filename } = parsed.data;
  const textFilePath = join(process.cwd(), "public", "uploads", `${filename}.txt`);

  try {
    const text = await fs.readFile(textFilePath, "utf-8");
    
    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables.');
    }
    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that summarizes text. Summarize the following text in a few sentences."
            },
            {
                role: "user",
                content: text
            }
        ],
    });

    const summary = response.choices[0]?.message?.content ?? "Sorry, I could not generate a summary.";

    return NextResponse.json({ summary });
  } catch (error: any) { // Type error as 'any' for now to allow access to message property
    console.error("Error in summarization API:", error);
    return NextResponse.json({ error: `Error in summarization: ${error.message}` }, { status: 500 });
  }
}