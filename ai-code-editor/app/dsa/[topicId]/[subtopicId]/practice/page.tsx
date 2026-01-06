'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { contentMap } from '../../../content'; 

const CodeEditor = dynamic(() => import('../../../../../components/CodeEditor'), {
  ssr: false,
});

const PYTHON_BOILERPLATE = `# Write your code here
print("Hello World")
`;

const CPP_BOILERPLATE = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}
`;

export default function PracticePage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const subtopicId = params.subtopicId as string;

  const topicData = contentMap[topicId]?.[subtopicId];
  const displayTitle = topicData?.title || 'Unknown Topic';
  const problems = topicData?.practiceProblems || [];

  const [language, setLanguage] = useState<'python' | 'cpp'>('python');
  const [code, setCode] = useState<string>(PYTHON_BOILERPLATE);
  const [output, setOutput] = useState<string>('Run code to see output...');
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as 'python' | 'cpp';
    setLanguage(lang);
    setCode(lang === 'python' ? PYTHON_BOILERPLATE : CPP_BOILERPLATE);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sending empty input as requested
        body: JSON.stringify({ language, code, input: '' }),
      });
      const result = await response.json();
      if (response.ok) {
        setOutput(result.output);
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput('Failed to execute code.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <Link href={`/dsa/${topicId}/${subtopicId}`}>
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <span>←</span>
            <span className="font-semibold">Back to {displayTitle}</span>
          </div>
        </Link>
        <h1 className="text-xl font-bold text-emerald-400">
          Practice Lab <span className="text-gray-600">/</span> {displayTitle}
        </h1>
      </div>

      <div className="w-full max-w-6xl space-y-8">
        
        {/* Section 1: Problem List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.length > 0 ? (
            problems.map((prob, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-emerald-400 text-lg">{prob.title}</h3>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">Q{idx + 1}</span>
                </div>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {prob.description}
                </p>
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                  <p className="text-xs text-gray-500 italic">
                    💡 <strong>Hint:</strong> {prob.hint}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-10 bg-gray-800 rounded-xl border border-gray-700">
              No practice problems available for this topic yet.
            </div>
          )}
        </div>

        {/* Section 2: Coding Environment */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col h-[600px]">
          
          {/* Toolbar */}
          <div className="bg-gray-900 p-3 border-b border-gray-700 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <span className="text-2xl ml-2">💻</span>
                <span className="font-bold text-gray-200">Scratchpad</span>
             </div>
             <div className="flex gap-4">
                <select 
                  value={language} 
                  onChange={handleLanguageChange}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 text-white"
                >
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
                <button 
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-1.5 rounded-md text-sm font-bold disabled:opacity-50 transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                  {isRunning ? 'Running...' : 'Run Code ▶'}
                </button>
             </div>
          </div>

          {/* Editor & Output Split */}
          <div className="flex-grow flex flex-col md:flex-row h-full">
            {/* Left: Code Editor */}
            <div className="w-full md:w-3/5 h-full border-b md:border-b-0 md:border-r border-gray-700 relative">
               <CodeEditor 
                 language={language} 
                 value={code} 
                 onChange={setCode} 
               />
            </div>
            
            {/* Right: Output (No Input box) */}
            <div className="w-full md:w-2/5 h-full bg-gray-900 flex flex-col">
               <div className="bg-gray-850 p-2 border-b border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-wider">
                 Output Terminal
               </div>
               <pre className="flex-grow p-4 font-mono text-sm text-gray-300 overflow-auto whitespace-pre-wrap">
                 {output}
               </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}