'use client';

import { useEffect, useState } from 'react';
import { ProjectIdea, ProjectIdeaSchema } from '@/lib/validators';

export function ProjectDisplay({ rawOutput, isLoading }: { rawOutput: string; isLoading: boolean }) {
  const [parsed, setParsed] = useState<ProjectIdea | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (rawOutput.includes('{') && rawOutput.includes('}')) {
        const json = JSON.parse(rawOutput);
        const result = ProjectIdeaSchema.safeParse(json);
        if (result.success) {
          setParsed(result.data);
          setError(false);
        } else {
          if (rawOutput.length > 20) setError(true);
        }
      }
    } catch {
      // Ignore, it's still streaming
    }
  }, [rawOutput]);

  if (error && !isLoading) {
    return <div role="alert" className="text-red-400 bg-red-900/20 p-4 rounded-lg">Failed to parse AI output. Please retry.</div>;
  }

  if (!parsed) {
    return isLoading ? (
      <div className="animate-pulse text-slate-400 text-center p-8">⏳ Waiting for AI...</div>
    ) : null;
  }

  return (
    <section className="space-y-6" aria-live="polite">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {parsed.title}
      </h2>

      <div className="bg-yellow-500/10 border-l-4 border-yellow-400 p-4 rounded-r-lg backdrop-blur-sm">
        <h3 className="font-semibold text-yellow-400">🎯 Problem Statement</h3>
        <p className="text-slate-300">{parsed.problem_statement}</p>
      </div>

      <div>
        <h3 className="font-semibold text-green-400 mb-2">⚡ Core Features</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {parsed.features.map((f, i) => (
            <li key={i} className="bg-white/5 p-2 rounded border border-white/10 backdrop-blur-sm hover:bg-white/10 transition">
              • {f}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-purple-400 mb-2">🛠️ Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {parsed.tech_stack.map((t, i) => (
            <span key={i} className="bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-purple-500/30">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-cyan-400 mb-2">📅 Dev Steps (6 Weeks)</h3>
        <ol className="list-decimal list-inside space-y-1 text-slate-300">
          {parsed.development_steps.map((s, i) => (
            <li key={i} className="bg-white/5 p-2 rounded border border-white/10 backdrop-blur-sm">
              {s}
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg backdrop-blur-sm">
        <h3 className="font-semibold text-blue-300">🚀 Improvement Suggestions</h3>
        <ul className="list-disc list-inside text-slate-300">
          {parsed.improvements.map((im, i) => (
            <li key={i} className="hover:text-white transition">{im}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}