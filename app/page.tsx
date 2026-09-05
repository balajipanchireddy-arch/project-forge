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

  // Progress simulation
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

      const data = await response.json();
      setOutput(JSON.stringify(data, null, 2));
      setProgress(100);
      setTimeout(() => setFadeIn(true), 100);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-cyberpunk min-h-screen text-white p-6 flex flex-col items-center relative overflow-hidden">
      <section className="w-full max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-cyan-500/20 shadow-[0_0_50px_rgba(0,255,255,0.05)]">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            {typedText || 'ProjectForge ⚡'}
          </h1>
          <p className="text-cyan-300/60 mt-2 text-lg">Turn your skills into a final-year masterpiece.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-cyan-500/20 shadow-[0_0_50px_rgba(0,255,255,0.05)]">
          <fieldset className="space-y-4">
            <legend className="sr-only">Project Preferences</legend>

            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-cyan-300">
                What problems excite you? <span className="text-red-400">*</span>
              </label>
              <textarea
                id="interests"
                aria-required="true"
                rows={2}
                className="w-full mt-1 p-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/30 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition"
                placeholder="e.g., Mental health, E-commerce logistics, Campus navigation..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-cyan-400/50 mt-1">
                💡 Tip: Be specific about the problem you want to solve.
              </p>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-cyan-300">
                Your Tech Stack <span className="text-red-400">*</span>
              </label>
              <input
                id="skills"
                type="text"
                aria-required="true"
                className="w-full mt-1 p-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-cyan-300/30 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition"
                placeholder="e.g., React, Node.js, Python, Flutter..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-cyan-400/50 mt-1">
                💡 Tip: List the technologies you're comfortable with.
              </p>
            </div>
          </fieldset>

          {error && (
            <div role="alert" className="bg-red-500/20 border border-red-500 p-3 rounded-lg text-red-300">
              ⚠️ {error}
            </div>
          )}

          {isLoading && (
            <div className="space-y-2">
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-cyan-400/60 text-center animate-pulse">
                🔮 {progress < 30 ? 'Analyzing your interests...' : progress < 60 ? 'Researching real-world problems...' : progress < 90 ? 'Designing your project blueprint...' : 'Finalizing your project plan...'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !interests || !skills}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all text-lg focus:ring-4 focus:ring-cyan-300 outline-none flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:shadow-[0_0_50px_rgba(0,255,255,0.4)]"
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