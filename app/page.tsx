'use client';

import { useState, FormEvent, useEffect } from 'react';
import { ProjectBlueprint } from '@/components/ProjectBlueprint';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

export default function Home() {
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const fullTitle = 'ProjectForge ⚡';

  // Typewriter effect
  useEffect(() => {
    if (!isLoading && typedText.length < fullTitle.length) {
      const timer = setTimeout(() => {
        setTypedText(fullTitle.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [typedText, isLoading]);

  // Progress simulation for better UX
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.random() * 15;
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setOutput('');
    setFadeIn(false);
    setIsLoading(true);
    setProgress(10);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests, skills }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate');
      }

      // ✅ Handle streaming response - shows results as they arrive
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          setOutput(buffer);
          // Progress updates as data arrives
          setProgress((prev) => Math.min(prev + 5, 95));
        }
      }

      setProgress(100);
      setTimeout(() => setFadeIn(true), 300);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get progress message based on progress value
  const getProgressMessage = () => {
    if (progress < 20) return '🔍 Understanding your interests...';
    if (progress < 40) return '🧠 Analyzing real-world problems...';
    if (progress < 60) return '⚡ Designing core features...';
    if (progress < 80) return '🛠️ Selecting tech stack...';
    if (progress < 95) return '📝 Finalizing your blueprint...';
    return '✨ Almost there...';
  };

  return (
    <main className="bg-white-theme min-h-screen text-slate-800 p-6 flex flex-col items-center relative overflow-hidden">
      <section className="w-full max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 card-white p-8 rounded-2xl">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {typedText || 'ProjectForge ⚡'}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Turn your skills into a final-year masterpiece.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 card-white p-8 rounded-2xl">
          <fieldset className="space-y-4">
            <legend className="sr-only">Project Preferences</legend>

            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-slate-700">
                What problems excite you? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="interests"
                aria-required="true"
                rows={2}
                className="input-white w-full mt-1 p-3 bg-white/80 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition"
                placeholder="e.g., Mental health, E-commerce logistics, Campus navigation..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-slate-400 mt-1">
                💡 Tip: Be specific about the problem you want to solve.
              </p>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-slate-700">
                Your Tech Stack <span className="text-red-500">*</span>
              </label>
              <input
                id="skills"
                type="text"
                aria-required="true"
                className="input-white w-full mt-1 p-3 bg-white/80 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition"
                placeholder="e.g., React, Node.js, Python, Flutter..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-slate-400 mt-1">
                💡 Tip: List the technologies you're comfortable with.
              </p>
            </div>
          </fieldset>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-600">
              ⚠️ {error}
            </div>
          )}

          {isLoading && (
            <div className="space-y-3">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
                <p className="text-sm text-slate-600 font-medium animate-pulse">
                  {getProgressMessage()}
                </p>
              </div>
              <p className="text-xs text-slate-400 text-center">
                ⏱️ This usually takes 5-10 seconds
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !interests || !skills}
            className="btn-gradient w-full py-4 px-6 text-white disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed rounded-xl font-semibold transition-all text-lg focus:ring-4 focus:ring-indigo-300 outline-none flex items-center justify-center gap-3 shadow-lg"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Forging your project</span>
                <span className="animate-pulse">...</span>
              </>
            ) : (
              '⚡ Generate Project'
            )}
          </button>
        </form>

        {/* Results */}
        <div className="mt-8">
          {isLoading && <LoadingSkeleton />}
          
          {output && !isLoading && (
            <div 
              className={`transition-all duration-700 ease-out ${
                fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <ProjectBlueprint rawOutput={output} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}