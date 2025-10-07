'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the CodeEditor component to ensure it's client-side only
const CodeEditor = dynamic(() => import('../../components/CodeEditor'), {
  ssr: false,
});

// A simple SVG icon for the button
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const PYTHON_BOILERPLATE = `# Welcome to the Python Editor!
def main():
    # Your code goes here
    name = input("Enter your name: ")
    print(f"Hello, {name}!")

if __name__ == "__main__":
    main()
`;

const CPP_BOILERPLATE = `#include <iostream>
#include <string>

int main() {
    // Your code goes here
    std::string name;
    std::cout << "Enter your name: ";
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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as 'python' | 'cpp';
    setLanguage(newLanguage);
    setCode(newLanguage === 'python' ? PYTHON_BOILERPLATE : CPP_BOILERPLATE);
  }

  const handleRunCode = () => {
    setOutput("Running code... (This is a placeholder)");
    console.log("Running code for language:", language);
    console.log("Code:", code);
    console.log("Input:", input);
    // In a real app, you would send this data to a backend execution service
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Code Editor</h1>
        <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-gray-700 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
          <button
            onClick={handleRunCode}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-1.5 rounded-md transition-colors"
          >
            Run Code
          </button>
        </div>
      </header>

      <main className="flex p-4 gap-4 flex-grow overflow-hidden">
        <div className="flex flex-col gap-4 flex-grow">
          {/* Code Editor Pane */}
          <div className="bg-[#282c34] rounded-lg flex-grow overflow-hidden">
            <CodeEditor language={language} value={code} onChange={setCode} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-48">
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
              <h3 className="font-semibold mb-2">Input</h3>
              <textarea
                className="w-full flex-grow bg-gray-900 rounded-md p-2 outline-none resize-none font-mono"
                placeholder="Enter program input here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
              <h3 className="font-semibold mb-2">Output</h3>
              <pre className="w-full flex-grow bg-gray-900 rounded-md p-2 overflow-auto font-mono text-gray-400">
                {output}
              </pre>
            </div>
          </div>
        </div>

        <aside className={`bg-gray-800 rounded-lg flex flex-col transition-all duration-300 ease-in-out ${isAiPanelOpen ? 'w-1/3' : 'w-16'}`}>
          <div className="flex items-center justify-between p-2 border-b border-gray-700">
            {isAiPanelOpen && <h2 className="text-lg font-bold ml-2">AI Assistant</h2>}
            <button onClick={() => setIsAiPanelOpen(!isAiPanelOpen)} className="p-2 rounded-md hover:bg-gray-700" title={isAiPanelOpen ? 'Collapse Panel' : 'Expand Panel'}>
              <ChevronIcon open={isAiPanelOpen} />
            </button>
          </div>
          {isAiPanelOpen && (
            <div className="flex-grow flex items-center justify-center p-4">
              <p className="text-gray-500 text-center">AI chat functionality is a work in progress.</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
