'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('../../components/CodeEditor'), {
  ssr: false,
});

const PYTHON_BOILERPLATE = `# Write your solution here
def solve():
    # Read input
    # Process
    # Print output
    pass

if __name__ == "__main__":
    solve()
`;

const CPP_BOILERPLATE = `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}
`;

export default function GeneratePage() {

  const [thought, setThought] = useState('');
  const [generatedProblem, setGeneratedProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);


  const [isSolverOpen, setIsSolverOpen] = useState(false);
  const [solverLang, setSolverLang] = useState<'python' | 'cpp'>('python');
  const [solverCode, setSolverCode] = useState(PYTHON_BOILERPLATE);
  const [solverInput, setSolverInput] = useState('');
  const [solverOutput, setSolverOutput] = useState('Run code to see output...');
  const [isRunning, setIsRunning] = useState(false);


  const handleGenerate = async () => {
    if (!thought.trim()) return;
    
    setIsLoading(true);
    setGeneratedProblem(''); 

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thought }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedProblem(data.text);
        setShowResult(true); 
      } else {
        alert("Error: " + (data.error || "Failed to generate"));
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetGenerator = () => {
    setShowResult(false);
    setThought('');
    setGeneratedProblem('');
    setIsSolverOpen(false); 
  };

  const handleSolverRun = async () => {
    setIsRunning(true);
    setSolverOutput('Running...');
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: solverLang, code: solverCode, input: solverInput }),
      });
      const result = await response.json();
      if (response.ok) {
        setSolverOutput(result.output);
      } else {
        setSolverOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setSolverOutput('Failed to execute code.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as 'python' | 'cpp';
    setSolverLang(lang);
    setSolverCode(lang === 'python' ? PYTHON_BOILERPLATE : CPP_BOILERPLATE);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8 flex flex-col items-center overflow-x-hidden relative">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <Link href="/selection">
          <h1 className="text-2xl font-bold hover:text-sky-400 transition-colors cursor-pointer">
            CodeCraftX <span className="text-purple-400 font-normal">| Generator</span>
          </h1>
        </Link>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className={`w-full transition-all duration-500 ${isSolverOpen ? 'pr-[600px] hidden lg:block' : ''}`}>
        
        {!showResult ? (
          // VIEW 1: INPUT FORM
          <div className="w-full max-w-3xl mx-auto bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Turn Thoughts into Code
            </h2>
            <p className="text-gray-400 mb-8">
              Describe a scenario, and CodeCraftX AI will create a practice problem for you.
            </p>
            <div className="space-y-6">
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-all placeholder-gray-600"
                placeholder="E.g., A system to manage library books where users can borrow and return..."
              />
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg shadow-lg disabled:opacity-50 transition-all transform hover:scale-[1.01]"
                onClick={handleGenerate}
                disabled={isLoading || !thought.trim()}
              >
                {isLoading ? 'Generating...' : 'Generate Problem 🚀'}
              </button>
            </div>
          </div>
        ) : (
          // VIEW 2: RESULT DISPLAY
          <div className="w-full max-w-5xl mx-auto bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl relative">
            
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-sky-400">Generated Problem</h2>
              
              <div className="flex gap-3">
                 {/* SOLVE BUTTON */}
                <button 
                  onClick={() => setIsSolverOpen(!isSolverOpen)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors border ${
                    isSolverOpen 
                      ? 'bg-sky-600 text-white border-sky-500' 
                      : 'bg-gray-700 text-sky-400 border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  {isSolverOpen ? 'Close Solver ❌' : 'Solve This 💻'}
                </button>

                <button 
                  onClick={resetGenerator}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors"
                >
                  New Problem
                </button>
              </div>
            </div>
            
            {/* Problem Text */}
            <div className="prose prose-invert max-w-none bg-gray-900/50 p-8 rounded-lg border border-gray-700 min-h-[500px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed text-base">
                {generatedProblem}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* --- SLIDING SOLVER PANEL --- */}
      <div 
        className={`fixed top-0 right-0 h-full w-full lg:w-[600px] bg-gray-800 border-l border-gray-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isSolverOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Solver Header */}
        <div className="p-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-lg text-white">Quick Solver</h3>
          <div className="flex items-center gap-3">
            <select 
              value={solverLang} 
              onChange={handleLangChange}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-sky-500"
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
            <button 
              onClick={handleSolverRun}
              disabled={isRunning}
              className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded text-sm font-bold disabled:opacity-50"
            >
              {isRunning ? '...' : 'Run ▶'}
            </button>
            <button onClick={() => setIsSolverOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
        </div>

        {/* Solver Editor */}
        <div className="flex-grow flex flex-col">
          <div className="h-[60%] border-b border-gray-700">
             {/* Only render editor if panel is open to save resources */}
             {isSolverOpen && (
               <CodeEditor 
                 language={solverLang} 
                 value={solverCode} 
                 onChange={setSolverCode} 
               />
             )}
          </div>
          
          {/* Solver I/O */}
          <div className="h-[40%] bg-gray-900 p-4 flex flex-col gap-4 overflow-y-auto">
             <div>
               <label className="text-xs font-bold text-gray-400 uppercase">Input</label>
               <textarea 
                 value={solverInput}
                 onChange={(e) => setSolverInput(e.target.value)}
                 className="w-full h-20 bg-gray-800 rounded p-2 text-sm font-mono mt-1 border border-gray-700 focus:border-sky-500 outline-none"
                 placeholder="Paste test case input here..."
               />
             </div>
             <div className="flex-grow flex flex-col">
               <label className="text-xs font-bold text-gray-400 uppercase">Output</label>
               <pre className="w-full flex-grow bg-gray-800 rounded p-2 text-sm font-mono mt-1 border border-gray-700 overflow-auto text-gray-300">
                 {solverOutput}
               </pre>
             </div>
          </div>
        </div>
      </div>

      {/* Overlay to close panel when clicking outside on mobile */}
      {isSolverOpen && (
        <div 
          onClick={() => setIsSolverOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

    </div>
  );
}