import { NextRequest, NextResponse } from "next/server";
import { analyzeText } from "@/lib/huggingface";

export async function POST(req: NextRequest) {
  try {
   const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Text must be at least 20 characters long." },
        { status: 400 }
      );
    }

    const cleanText = text.trim();

    const words = cleanText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    const aiData = await analyzeText(cleanText);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      analysis: {
        stats: {
          wordCount,
          characterCount: cleanText.length,
          sentenceCount,
          readingTimeMinutes: Math.ceil(wordCount / 200), 
        },
        
        cognitiveInsight: {
          sentiment: aiData.sentiment.label,
          confidence: aiData.sentiment.score,
          tone: "Analytical",
          dominantEmotion: aiData.dominantEmotion,
        },
       emotions: aiData.emotion.map((emo: any) => ({
        label: emo.label,
        score: emo.score
       }))
      },
    });

  } catch (error) {
    console.error("API_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to parse request" },
      { status: 500 }
    );
  }
}