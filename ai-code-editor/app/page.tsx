import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <div className="text-center mb-12">
        <h1 className="text-7xl font-extrabold tracking-tight mb-3
        bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
        bg-[length:200%_auto]
        bg-clip-text text-transparent
        animate-gradient
        ">
          CodeCraft X
        </h1>
        <p className="text-lg text-gray-400">
          Choose your path below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* AI Code Editor Card */}
        <Link href="/selection">
          <div className="group rounded-xl border border-white/10 bg-gray-800/50 p-8 h-full flex flex-col justify-between hover:bg-gray-800/80 hover:border-sky-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-sky-500/20">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
                AI Code Editor
              </h2>
              <p className="text-gray-400">
                Access powerful tools to write code or generate unique programming problems from your ideas.
              </p>
            </div>
            <div className="mt-6 text-sky-400 font-semibold flex items-center">
              Enter Platform
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </Link>

        {/* DSA Topics Card - NOW ACTIVE */}
        <Link href="/dsa">
          <div className="group rounded-xl border border-white/10 bg-gray-800/50 p-8 h-full flex flex-col justify-between hover:bg-gray-800/80 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-emerald-500/20">
             <div>
              <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                DSA Topics
              </h2>
              <p className="text-gray-400">
                Master Data Structures and Algorithms with structured roadmaps and practice questions.
              </p>
            </div>
            <div className="mt-6 text-emerald-400 font-semibold flex items-center">
              Start Learning
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}