import React, { useState, useCallback } from 'react';
import { SWOTAnalysis } from './types';
import { generateSWOT } from './services/geminiService';
import SWOTCard from './components/SWOTCard';
import LoadingSpinner from './components/LoadingSpinner';

const icons = {
  strengths: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-3.5 7m7-10H5a2 2 0 00-2 2v8a2 2 0 002 2h2.5" /></svg>,
  weaknesses: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.017c.163 0 .326.02.485.06L20 4m-10 10v5a2 2 0 002 2h.085a2 2 0 001.736-.97l3.5-7m-10 10H19a2 2 0 002-2v-8a2 2 0 00-2-2h-2.5" /></svg>,
  opportunities: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.293-7.293l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M17.657 6.343l-.707.707" /></svg>,
  threats: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
};

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [swotAnalysis, setSwotAnalysis] = useState<SWOTAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSWOT = useCallback(async () => {
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSwotAnalysis(null);

    try {
      const result = await generateSWOT(topic);
      setSwotAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, isLoading]);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGenerateSWOT();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center my-10 md:my-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 font-serif">
            SWOT Analysis Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get an instant AI-powered SWOT analysis for any company or idea.
          </p>
        </header>

        <main>
          <div className="flex w-full max-w-2xl mx-auto mb-12 border bg-white border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all duration-300">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., 'Tesla', 'a new local coffee shop', 'OpenAI'"
              disabled={isLoading}
              className="w-full pl-5 py-4 text-lg bg-transparent border-none rounded-l-lg outline-none placeholder-gray-400 text-gray-800 disabled:opacity-50"
            />
            <button
              onClick={handleGenerateSWOT}
              disabled={isLoading || !topic.trim()}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-md m-1.5 flex-shrink-0 flex items-center justify-center transition-colors duration-300"
              style={{ minWidth: '130px' }}
            >
              {isLoading ? <LoadingSpinner /> : 'Generate'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center my-4 max-w-2xl mx-auto">
              <strong>Error:</strong> {error}
            </div>
          )}

          {swotAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <SWOTCard title="Strengths" points={swotAnalysis.strengths} icon={icons.strengths} color="green" />
              <SWOTCard title="Weaknesses" points={swotAnalysis.weaknesses} icon={icons.weaknesses} color="red" />
              <SWOTCard title="Opportunities" points={swotAnalysis.opportunities} icon={icons.opportunities} color="blue" />
              <SWOTCard title="Threats" points={swotAnalysis.threats} icon={icons.threats} color="yellow" />
            </div>
          )}
        </main>
      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;