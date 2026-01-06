'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { contentMap } from '../../content'; 

export default function TopicPage() {
  const params = useParams();
  
  const topicId = params.topicId as string;
  const subtopicId = params.subtopicId as string;

  const topicData = contentMap[topicId]?.[subtopicId];
  const displayTitle = topicData?.title || `Part ${subtopicId}`;
  const displayTopic = topicId.charAt(0).toUpperCase() + topicId.slice(1);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <Link href="/dsa">
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
            <span>←</span>
            <span className="font-semibold">Back to Roadmap</span>
          </div>
        </Link>
        <h1 className="text-xl font-bold text-emerald-400">
          {displayTopic} <span className="text-gray-600">/</span> {displayTitle}
        </h1>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-2">
              Introduction
            </h2>
            <div className="prose prose-invert text-gray-300 text-lg leading-relaxed">
              {topicData?.intro || (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <span className="text-4xl mb-2">🚧</span>
                  <p>Content for <strong>{displayTitle}</strong> is coming soon!</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-2">
              Code Examples
            </h2>
            <div className="space-y-6">
              {topicData?.codes ? (
                topicData.codes.map((item, index) => (
                  <div key={index} className="bg-gray-950 rounded-lg overflow-hidden border border-gray-800">
                    <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
                      <span className="text-red-400 font-bold font-mono text-sm">{item.name}</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                      </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-emerald-400 font-mono text-sm whitespace-pre">{item.code}</pre>
                    </div>
                    <div className="bg-gray-900/50 px-4 py-3 border-t border-gray-800/50">
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1 block">Output:</span>
                      <pre className="text-purple-300 font-mono text-sm whitespace-pre">{item.output}</pre>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-950 rounded-lg p-8 text-center border border-gray-800">
                  <p className="text-gray-500">Code examples coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          
          {/* Practice Card - Moved Up */}
          <div className="bg-gradient-to-br from-emerald-900/40 to-gray-800 rounded-xl p-6 border border-emerald-500/30 shadow-xl sticky top-8">
            <h3 className="text-xl font-bold text-emerald-400 mb-2">Ready to Practice?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Test your knowledge on <strong>{displayTitle}</strong> with curated problems.
            </p>
            {/* UPDATED LINK */}
            <Link href={`/dsa/${topicId}/${subtopicId}/practice`}>
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/20">
                Solve Problems 🚀
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}