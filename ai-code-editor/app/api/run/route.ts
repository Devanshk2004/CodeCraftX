import { NextResponse } from 'next/server';

// Mapping our language names to Judge0's language IDs
const languageMap = {
  python: 71,
  cpp: 54,
};

export async function POST(request: Request) {
  try {
    const { language, code, input } = await request.json();

    if (!language || !code) {
      return NextResponse.json(
        { error: 'Language and code are required.' },
        { status: 400 }
      );
    }

    const languageId = languageMap[language as keyof typeof languageMap];
    if (!languageId) {
      return NextResponse.json({ error: 'Invalid language.' }, { status: 400 });
    }

    const response = await fetch(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: code,
          stdin: input,
        }),
      }
    );

    if (!response.ok) {
        const errorData = await response.text();
        console.error("Judge0 API Error:", errorData);
        throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Determine the output
    let output = '';
    if (data.status.id === 3) { // Status ID 3 means "Accepted" (ran successfully)
      output = data.stdout || '';
    } else if (data.status.id === 6) { // Compilation Error
      output = data.compile_output || 'Compilation Error';
    } else { // Other errors (Runtime Error, Time Limit Exceeded, etc.)
      output = data.stderr || data.status.description;
    }

    return NextResponse.json({ output });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}