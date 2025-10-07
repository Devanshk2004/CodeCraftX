'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('../../components/CodeEditor'), {
  ssr: false, 
});

const ChevronIcon = ({ open }: { open: boolean }) => (/* SVG icon code remains the same */<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);

const PYTHON_BOILERPLATE = `# Welcome to the Python Editor!
def main():
    # Your code goes here
    name = input()
    print(f"Hello, {name}!")

if __name__ == "__main__":
    main()
`;

const CPP_BOILERPLATE = `#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cin >> name;
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}
`;

export default function EditorPage() {
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [language, setLanguage] = useState<'python' | 'cpp'>('python');
  const [code, setCode] = useState<string>(PYTHON_BOILERPLATE);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>("Your program's output will appear here.");
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as 'python' | 'cpp';
    setLanguage(newLanguage);
    setCode(newLanguage === 'python' ? PYTHON_BOILERPLATE : CPP_BOILERPLATE);
  }

  // UPDATED FUNCTION
  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput("Running code...");

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code, input }),
      });

      const result = await response.json();

      if (response.ok) {
        setOutput(result.output);
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput("An error occurred while trying to run the code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Code Editor</h1>
        <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={handleLanguageChange}
              disabled={isLoading} // Disable while running
              className="bg-gray-700 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
          <button
            onClick={handleRunCode}
            disabled={isLoading} // Disable while running
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-1.5 rounded-md transition-colors disabled:bg-sky-800 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </header>

      {/* The rest of the JSX for the main layout remains exactly the same... */}
      <main className="flex p-4 gap-4 flex-grow overflow-hidden">
        <div className="flex flex-col gap-4 flex-grow">
          <div className="bg-[#282c34] rounded-lg flex-grow overflow-hidden">
            <CodeEditor language={language} value={code} onChange={setCode} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-48">
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
              <h3 className="font-semibold mb-2">Input</h3>
              <textarea className="w-full flex-grow bg-gray-900 rounded-md p-2 outline-none resize-none font-mono" placeholder="Enter program input here..." value={input} onChange={(e) => setInput(e.target.value)} />
            </div>
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
              <h3 className="font-semibold mb-2">Output</h3>
              <pre className="w-full flex-grow bg-gray-900 rounded-md p-2 overflow-auto font-mono text-gray-400">{output}</pre>
            </div>
          </div>
        </div>
        <aside className={`bg-gray-800 rounded-lg flex flex-col transition-all duration-300 ease-in-out ${isAiPanelOpen ? 'w-1/3' : 'w-16'}`}>
    {/* Header with collapse button */}
  <div className="flex items-center justify-between p-2 border-b border-gray-700">
    {isAiPanelOpen && <h2 className="text-lg font-bold ml-2">AI Assistant</h2>}
    <button onClick={() => setIsAiPanelOpen(!isAiPanelOpen)} className="p-2 rounded-md hover:bg-gray-700" title={isAiPanelOpen ? 'Collapse Panel' : 'Expand Panel'}>
      <ChevronIcon open={isAiPanelOpen} />
    </button>
  </div>
  
  {/* New UI - Only shown when panel is open */}
  {isAiPanelOpen && (
    <>
      {/* 1. Chat messages area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <p className="text-sm text-gray-500 text-center">AI responses will appear here.</p>
      </div>

      {/* 2. Action buttons */}
      <div className="p-2 grid grid-cols-2 gap-2 border-t border-gray-700">
        <button className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-3 rounded-md transition-colors">
          Explain Code
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-3 rounded-md transition-colors">
          Fix the Error
        </button>
      </div>

      {/* 3. Text input area */}
      <div className="p-2 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI..."
            className="w-full bg-gray-900 rounded-md p-2 outline-none focus:ring-2 focus:ring-sky-500 font-sans"
          />
          <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold p-2 rounded-md transition-colors">
            {/* Simple Send Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )}
</aside>
      </main>
    </div>
  );
}
