import Link from 'next/link';

export default function SelectionPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
          Choose Your Mode
        </h1>
        <p className="text-lg text-gray-400">
          How do you want to code today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Option 1: Practice Code (Goes to existing editor) */}
        <Link href="/editor">
          <div className="group rounded-xl border border-white/10 bg-gray-800/50 p-8 h-full flex flex-col justify-between hover:bg-gray-800/80 hover:border-sky-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-sky-500/20">
            <div>
              <div className="mb-4 text-4xl">💻</div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
                Practice your Code
              </h2>
              <p className="text-gray-400">
                Open the code editor and ask the AI assistant to help you write, debug, and explain your code.
              </p>
            </div>
            <div className="mt-6 text-sky-400 font-semibold flex items-center">
              Open Editor <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </Link>

        {/* Option 2: Create Question (Goes to new generator page) */}
        <Link href="/generate">
          <div className="group rounded-xl border border-white/10 bg-gray-800/50 p-8 h-full flex flex-col justify-between hover:bg-gray-800/80 hover:border-purple-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-500/20">
            <div>
              <div className="mb-4 text-4xl">🧠</div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                Create your Question
              </h2>
              <p className="text-gray-400">
                Have a rough idea? Describe your thoughts, and our AI will generate a structured coding problem with test cases for you.
              </p>
            </div>
            <div className="mt-6 text-purple-400 font-semibold flex items-center">
              Generate Problem <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Back Button */}
      <Link href="/" className="mt-12 text-gray-500 hover:text-white transition-colors flex items-center">
        ← Back to Home
      </Link>
    </main>
  );
}