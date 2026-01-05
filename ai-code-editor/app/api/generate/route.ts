import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { thought } = await request.json();

    const systemPrompt = `
      You are a fun and helpful coding coach.
      
      Your task is to take a user's rough idea and turn it into a **LeetCode-style coding problem**, but keep it concise and easy to read.(don't say the word Leetcode -style though)
      
      **OUTPUT FORMAT RULES:**
      1.  **Headings:** Use emojis in all headings (e.g., 🧩 Problem, 📥 Input, 📤 Output).
      2.  **Tone:** Clear, professional, but not overly academic.
      3.  **Structure:**
          * **Title:** A catchy name for the problem.
          * 🧩 Problem Description: The story/logic.
          * 💡 Example: One clear example of how it works.
          * 🧪 Test Cases: Exactly **3** test cases. Separated by "---".
      
      **TEST CASE FORMAT (Strictly 3 cases):**
      
      ---------------------
      **Test Case 1**
      ---------------------
      Input:
      [data]
      Output:
      [result]
      ---------------------
      **Test Case 2**
      ---------------------
      Input:
      [data]
      Output:
      [result]
      ---------------------
      **Test Case 3**
      ---------------------
      Input:
      [data]
      Output:
      [result]
      ---------------------
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        ${systemPrompt}
        
        User's Idea: "${thought}"
      `, 
    });

    const text = response.text; 

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error('Error in Generator API:', error);
    return NextResponse.json(
      { error: 'Failed to generate problem.', details: error.message },
      { status: 500 }
    );
  }
}