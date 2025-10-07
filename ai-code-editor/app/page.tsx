import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-3">
          Welcome to Your Coding Platform
        </h1>
        <p className="text-lg text-gray-400">
          Choose your path below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* AI Code Editor Card */}
        <Link href="/editor">
          <div className="group rounded-xl border border-white/10 bg-gray-800/50 p-8 h-full flex flex-col justify-between hover:bg-gray-800/80 transition-all duration-300 cursor-pointer">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">
                AI Code Editor
              </h2>
              <p className="text-gray-400">
                A powerful, AI-assisted editor to write, test, and debug your code in C++, Python, and more.
              </p>
            </div>
            <div className="mt-6 text-sky-400 font-semibold flex items-center">
              Launch Editor
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </Link>

        {/* DSA Topics Card */}
        <div className="group rounded-xl border border-white/10 bg-gray-800/50 p-8 h-full flex flex-col justify-between hover:bg-gray-800/80 transition-all duration-300 cursor-not-allowed opacity-60">
           <div>
              <h2 className="text-3xl font-bold text-white mb-3">
                DSA Topics
              </h2>
              <p className="text-gray-400">
                Explore fundamental Data Structures and Algorithms concepts. (Coming Soon!)
              </p>
            </div>
            <div className="mt-6 text-gray-500 font-semibold">
              Coming Soon
            </div>
        </div>
      </div>
    </main>
  );
}
