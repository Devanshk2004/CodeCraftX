'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const CodeEditor = dynamic(() => import('../../components/CodeEditor'), {
  ssr: false,
});

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

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

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export default function EditorPage() {
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [language, setLanguage] = useState<'python' | 'cpp'>('python');
  const [code, setCode] = useState<string>(PYTHON_BOILERPLATE);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>("Your program's output will appear here.");
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  const [chatInput, setChatInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      content: "Hey! I am CodeCraftX AI. How can I help you with your code today? \nI will only give you hints for now if you want full solution click the 'Correct solution' button." 
    },
  ]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as 'python' | 'cpp';
    setLanguage(newLanguage);
    setCode(newLanguage === 'python' ? PYTHON_BOILERPLATE : CPP_BOILERPLATE);
  };

  const handleRunCode = async () => {
    setIsCodeRunning(true);
    setOutput('Running code...');
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, input }),
      });
      const result = await response.json();
      if (response.ok) {
        setOutput(result.output);
      } else {
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      setOutput('An error occurred while trying to run the code.');
    } finally {
      setIsCodeRunning(false);
    }
  };

  const handleAiChatSubmit = async (messageOverride?: string) => {
    const messageToSend = messageOverride || chatInput;
    if (!messageToSend.trim() || isAiLoading) return;

    setIsAiLoading(true);
    const userMessage: ChatMessage = { role: 'user', content: messageToSend };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput(''); 

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          code,
          language,
          output,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const aiMessage: ChatMessage = { role: 'model', content: result.text };
        setChatMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(result.error || 'Failed to get response from AI');
      }
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        role: 'model',
        content: `Sorry, I ran into an error: ${error.message}`,
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        {/* Updated Title with Link */}
        <Link href="/">
          <h1 className="text-xl font-bold cursor-pointer hover:text-sky-400 transition-colors">
            CodeCraftX
          </h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            disabled={isCodeRunning || isAiLoading}
            className="bg-gray-700 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
          <button
            onClick={handleRunCode}
            disabled={isCodeRunning || isAiLoading}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-1.5 rounded-md transition-colors disabled:bg-sky-800 disabled:cursor-not-allowed"
          >
            {isCodeRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </header>

      <main className="flex p-4 gap-4 flex-grow overflow-hidden">
        <div className="flex flex-col gap-4 flex-grow">
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
            <>
              <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-xs xl:max-w-md rounded-lg px-3 py-2 ${
                        msg.role === 'user'
                          ? 'bg-sky-600 text-white'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-200 rounded-lg px-3 py-2">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-2 grid grid-cols-3 gap-2 border-t border-gray-700">
                <button
                  onClick={() => handleAiChatSubmit('Explain Code')}
                  disabled={isAiLoading}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-2 px-1 rounded-md transition-colors disabled:opacity-50"
                >
                  Explain Code
                </button>
                <button
                  onClick={() => handleAiChatSubmit('Fix the Error')}
                  disabled={isAiLoading}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-2 px-1 rounded-md transition-colors disabled:opacity-50"
                >
                  Fix Error
                </button>
                <button
                  onClick={() => handleAiChatSubmit('Please provide the Full Correct Solution for this code.')}
                  disabled={isAiLoading}
                  className="bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold py-2 px-1 rounded-md transition-colors disabled:opacity-50"
                >
                  Correct Solution
                </button>
              </div>

              <form
                className="p-2 border-t border-gray-700"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (chatInput.trim()) handleAiChatSubmit(chatInput);
                }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={isAiLoading ? 'Waiting for response...' : 'Ask AI...'}
                    disabled={isAiLoading}
                    className="w-full bg-gray-900 rounded-md p-2 outline-none focus:ring-2 focus:ring-sky-500 font-sans disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading || !chatInput.trim()}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold p-2 rounded-md transition-colors disabled:bg-sky-800"
                  >
                    <SendIcon />
                  </button>
                </div>
              </form>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}