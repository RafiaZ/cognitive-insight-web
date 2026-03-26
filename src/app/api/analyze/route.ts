import { NextRequest, NextResponse } from "next/server";
import { analyzeText } from "@/lib/huggingface";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    // 1. Validate text length
    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Text must be at least 20 characters long." },
        { status: 400 }
      );
    }

    const cleanText = text.trim();

    // 2. More Accurate Metrics
    // regex /\s+/ handles multiple spaces, tabs, and newlines
    const words = cleanText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    
    // regex matches terminal punctuation (. ! ?)
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    const aiData = await analyzeText(cleanText);

    // 3. Return Mock Analysis
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      analysis: {
        stats: {
          wordCount,
          characterCount: cleanText.length,
          sentenceCount,
          readingTimeMinutes: Math.ceil(wordCount / 200), // Avg 200 wpm
        },
        // Mock Cognitive/Emotional Data
        cognitiveInsight: {
          sentiment: aiData.sentiment.label,
          confidence: aiData.sentiment.score,
          tone: "Analytical",
          dominantEmotion: aiData.dominantEmotion,
        },
        emotions: [
          { label: "Joy", score: 0.72 },
          { label: "Surprise", score: 0.15 },
          { label: "Fear", score: 0.03 },
          { label: "Anger", score: 0.10 },
        ],
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