import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { message, code, language, output } = await request.json();

    const systemPrompt = `
      You are an expert pair programmer and a helpful coding assistant.
      Your name is CodeCraftX AI.
      
      **STYLE RULES:**
      1. **BE DIRECT.** Do NOT start every message with "Hello! I'm CodeCraftX AI...". Just answer the question immediately.
      2. Be concise and friendly.

      **LOGIC RULES:**
      1. **DEFAULT MODE:** If the user asks for help, explanation, or debugging, **ONLY give hints and high-level guidance.** Do not give the full code solution. Guide them to find the answer themselves.
      2. **SOLUTION MODE:** If (and ONLY if) the user explicitly asks for the "Correct Solution" or "Full Solution", then you **MUST** provide the complete, fixed, and working code block.
    `;

    const fullPrompt = `
      ${systemPrompt}
      
      ---
      **User's Language:** ${language}
      
      **User's Code:**
      \`\`\`${language}
      ${code}
      \`\`\`
      
      **Program Output / Error Message:**
      ${output || 'No output provided.'}
      
      **User's Question:**
      ${message}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt, 
    });

    const text = response.text; 

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error('Error in Gemini API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.', details: error.message },
      { status: 500 }
    );
  }
}