'use client';

import { useState } from 'react';
import Link from 'next/link';

// Data structure for our topics
const topics = [
  {
    id: 'basics',
    title: 'Basics of Programming',
    icon: '⚡',
    subtopics: ['Loops', 'Operators', 'Conditional Statements', 'Functions', 'Time Complexity']
  },
  {
    id: 'arrays',
    title: 'Arrays & Vectors',
    icon: '📦',
    subtopics: ['Demo Topic 1', 'Demo Topic 2']
  },
  {
    id: 'strings',
    title: 'Strings',
    icon: '📝',
    subtopics: ['Demo Topic 1', 'Demo Topic 2']
  },
  {
    id: 'recursion',
    title: 'Recursion',
    icon: '🔄',
    subtopics: ['Demo Topic 1', 'Demo Topic 2']
  },
  {
    id: 'hashing',
    title: 'Hashing',
    icon: '🔑',
    subtopics: ['Demo Topic 1', 'Demo Topic 2']
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    icon: '📊',
    subtopics: ['Demo Topic 1', 'Demo Topic 2']
  },
  {
    id: 'trees',
    title: 'Trees',
    icon: '🌳',
    subtopics: ['Demo Topic 1', 'Demo Topic 2']
  },
  {
    id: 'graphs',
    title: 'Graphs',
    icon: '🕸️',
    subtopics: ['Demo Topic 1', 'Demo Topic 2']
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    icon: '🧠',
    subtopics: ['Demo Topic 1', 'Demo Topic 2']
  }
];

export default function DSAPage() {
  // State to track which section is currently open (null means all closed)
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <Link href="/">
          <h1 className="text-2xl font-bold hover:text-emerald-400 transition-colors cursor-pointer">
            CodeCraftX <span className="text-gray-500 font-normal">| DSA Roadmap</span>
          </h1>
        </Link>
      </div>

      <div className="text-center mb-12">
         <h2 className="text-4xl font-bold mb-4">Master Data Structures</h2>
         <p className="text-gray-400">Select a topic below to explore concepts and practice problems.</p>
      </div>

      {/* Accordion List */}
      <div className="w-full max-w-3xl space-y-4">
        {topics.map((topic) => (
          <div 
            key={topic.id} 
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-emerald-500/50"
          >
            {/* Clickable Header */}
            <button
              onClick={() => toggleSection(topic.id)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{topic.icon}</span>
                <span className="text-xl font-bold text-gray-100">{topic.title}</span>
              </div>
              
              {/* Arrow Icon */}
              <svg 
                className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${
                  openSection === topic.id ? 'rotate-180 text-emerald-400' : ''
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sliding Content */}
            <div 
              className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
                openSection === topic.id ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-6 pt-0 bg-gray-800/50 border-t border-gray-700/50">
                <div className="grid gap-3">
                  {topic.subtopics.map((sub, index) => (
                    <div 
                      key={index}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-transparent cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400"></div>
                        <span className="text-gray-300 group-hover:text-emerald-100">{sub}</span>
                      </div>
                      <span className="text-xs text-gray-500 group-hover:text-emerald-400">Start Practice →</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}