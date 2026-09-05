'use client';

import { useState, FormEvent, useEffect } from 'react';
import { ProjectDisplay } from '@/components/ProjectDisplay';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import Confetti from 'react-confetti';

export default function Home() {
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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

  // Progress simulation during loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90; // Stops at 90% until done
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
    setShowConfetti(false);
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
      setTimeout(() => setShowConfetti(true), 500);
      setTimeout(() => setShowConfetti(false), 5000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center relative overflow-hidden">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

      <section className="w-full max-w-4xl relative z-10">
        {/* Glassmorphism Header */}
        <div className="text-center mb-8 backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {typedText || 'ProjectForge ⚡'}
          </h1>
          <p className="text-slate-300 mt-2 text-lg">Turn your skills into a final-year masterpiece.</p>
        </div>

        {/* Glassmorphism Form */}
        <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
          <fieldset className="space-y-4">
            <legend className="sr-only">Project Preferences</legend>

            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-slate-200">
                What problems excite you? <span className="text-red-400">*</span>
              </label>
              <textarea
                id="interests"
                aria-required="true"
                rows={2}
                className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition backdrop-blur-sm"
                placeholder="e.g., Mental health, E-commerce logistics, Campus navigation..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-slate-200">
                Your Tech Stack <span className="text-red-400">*</span>
              </label>
              <input
                id="skills"
                type="text"
                aria-required="true"
                className="w-full mt-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition backdrop-blur-sm"
                placeholder="e.g., React, Node.js, Python, Flutter..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </fieldset>

          {error && (
            <div role="alert" className="bg-red-500/20 border border-red-500 p-3 rounded-lg text-red-300 backdrop-blur-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Progress Bar */}
          {isLoading && (
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !interests || !skills}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all text-lg focus:ring-4 focus:ring-purple-300 outline-none flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/25"
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

        {/* Result Area */}
        <div className="mt-8">
          {isLoading && <LoadingSkeleton />}
          
          {output && !isLoading && (
            <div 
              className={`transition-all duration-700 ease-out ${
                fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl`}
            >
              <ProjectDisplay rawOutput={output} isLoading={false} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}