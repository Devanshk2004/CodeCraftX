import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { thought } = await request.json();

    const systemPrompt = `
      You are an expert coding problem setter for a competitive programming platform.
      
      Your task is to take a user's rough idea or real-world scenario and convert it into a **formal, well-structured coding problem**.
      
      **OUTPUT FORMAT (Strictly follow this structure):**
      
      # [Problem Title]
      
      ## Problem Statement
      [Write a clear, formal description of the problem based on the user's idea. Use standard technical terms.]
      
      ## Input Format
      [Describe exactly what the input looks like. E.g., "The first line contains an integer N..."]
      
      ## Output Format
      [Describe the expected output.]
      
      ## Constraints
      [Add reasonable constraints. E.g., 1 <= N <= 10^5]
      
      ## Test Cases
      Provide exactly 5 distinct test cases in this format:
      
      **Test Case 1:**
      Input:
      [Input data]
      Output:
      [Expected output]
      
      ... (Repeat for 5 cases)
      
      **Explanation (Optional):**
      [Briefly explain the logic for the first test case.]
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