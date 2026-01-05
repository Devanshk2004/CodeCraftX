'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GeneratePage() {
  const [thought, setThought] = useState('');
  const [generatedProblem, setGeneratedProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

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
        setShowResult(true); // Switch to result view on success
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
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <Link href="/selection">
          <h1 className="text-2xl font-bold hover:text-sky-400 transition-colors cursor-pointer">
            CodeCraftX <span className="text-purple-400 font-normal">| Generator</span>
          </h1>
        </Link>
      </div>

      {/* CONDITIONAL RENDERING BASED ON STATE */}
      {!showResult ? (
        // --- VIEW 1: INPUT FORM ---
        <div className="w-full max-w-3xl bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl animate-fade-in">
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Turn Thoughts into Code
          </h2>
          <p className="text-gray-400 mb-8">
            Describe a scenario, a logic puzzle, or just a rough idea. CodeCraftX AI will restructure it into a professional coding problem.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe your problem idea:
              </label>
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all placeholder-gray-600"
                placeholder="E.g., I want a problem about a spaceship that needs to calculate fuel for a trip to Mars, but gravity changes every hour..."
              />
            </div>
            
            <button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleGenerate}
              disabled={isLoading || !thought.trim()}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin text-xl">✨</span> Generating Magic...
                </>
              ) : (
                'Generate Problem 🚀'
              )}
            </button>
          </div>
        </div>
      ) : (
        // --- VIEW 2: RESULT DISPLAY ---
        <div className="w-full max-w-5xl bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-sky-400">Generated Problem</h2>
            <button 
              onClick={resetGenerator}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors"
            >
              ← Generate Another
            </button>
          </div>
          
          <div className="prose prose-invert max-w-none bg-gray-900/50 p-8 rounded-lg border border-gray-700 min-h-[500px] overflow-y-auto">
            {/* The pre tag preserves the formatting from the AI */}
            <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed text-base">
              {generatedProblem}
            </pre>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
               onClick={() => {
                 navigator.clipboard.writeText(generatedProblem);
                 alert("Problem copied to clipboard!");
               }}
               className="text-purple-400 hover:text-purple-300 font-semibold text-sm flex items-center gap-2"
            >
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}