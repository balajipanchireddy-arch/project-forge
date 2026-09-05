'use client';

import { useEffect, useState } from 'react';
import { ProjectIdea, ProjectIdeaSchema } from '@/lib/validators';

// Helper to generate explanations
const generateExplanations = (project: ProjectIdea) => {
  const featureExplanations: { [key: string]: string } = {
    'anonymized': 'This protects student privacy, encouraging honest feedback.',
    'dashboard': 'Visualizes data so counselors can spot trends quickly.',
    'alert': 'Ensures urgent cases get immediate attention, saving lives.',
    'analytics': 'Turns raw data into actionable insights for administrators.',
    'messaging': 'Provides a safe, private way for students to reach counselors.',
    'tracking': 'Helps students understand their own mental health patterns.',
    'encrypted': 'Keeps sensitive data secure from unauthorized access.',
    'real-time': 'Provides immediate feedback when needed most.',
  };

  const techExplanations: { [key: string]: string } = {
    'react': 'Builds fast, interactive user interfaces for students and counselors.',
    'node': 'Handles many users simultaneously with high performance.',
    'express': 'Quickly builds secure, scalable APIs.',
    'postgresql': 'Reliable, secure database perfect for sensitive student data.',
    'mongodb': 'Flexible document storage for rapidly changing data.',
    'docker': 'Makes deployment consistent across all environments.',
    'firebase': 'Provides real-time data sync and easy authentication.',
    'typescript': 'Adds type safety, reducing bugs in production.',
    'jwt': 'Ensures secure, stateless authentication.',
    'websocket': 'Enables real-time, two-way communication for chat features.',
  };

  const stepExplanations: { [key: string]: string } = {
    'architecture': 'Plan your system before writing code – saves time later.',
    'database': 'Design your data models first – everything depends on this.',
    'api': 'Build the backend that powers all your features.',
    'ui': 'Create the interface students and counselors will actually use.',
    'integration': 'Connect everything together and test it works.',
    'deployment': 'Make your project live and accessible to users.',
    'authentication': 'Ensure only authorized users can access sensitive data.',
    'testing': 'Catch bugs before they reach real users.',
    'security': 'Protect student data with encryption and secure practices.',
    'analytics': 'Add insights to show the value of your project.',
  };

  const featureExpl = project.features.map(f => {
    const lower = f.toLowerCase();
    let explanation = 'This feature solves a real user need in the project.';
    
    for (const [key, value] of Object.entries(featureExplanations)) {
      if (lower.includes(key)) {
        explanation = value;
        break;
      }
    }
    return { name: f, explanation };
  });

  const techExpl = project.tech_stack.map(t => {
    const lower = t.toLowerCase();
    let explanation = 'A solid choice for this type of project.';
    
    for (const [key, value] of Object.entries(techExplanations)) {
      if (lower.includes(key)) {
        explanation = value;
        break;
      }
    }
    return { name: t, explanation };
  });

  const stepExpl = project.development_steps.map(s => {
    const lower = s.toLowerCase();
    let explanation = 'Take time to understand this before moving on.';
    
    for (const [key, value] of Object.entries(stepExplanations)) {
      if (lower.includes(key)) {
        explanation = value;
        break;
      }
    }
    return { step: s, explanation };
  });

  const problemExplanation = project.problem_statement.length > 50 
    ? 'This is a real-world issue that affects real people. By solving it, your project will have meaningful impact.'
    : 'Try to narrow down your problem to a specific user pain point.';

  return { featureExpl, techExpl, stepExpl, problemExplanation };
};

export function ProjectBlueprint({ rawOutput }: { rawOutput: string }) {
  const [project, setProject] = useState<ProjectIdea | null>(null);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const json = JSON.parse(rawOutput);
      const result = ProjectIdeaSchema.safeParse(json);
      if (result.success) {
        setProject(result.data);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  }, [rawOutput]);

  if (error) {
    return <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">Failed to parse project data.</div>;
  }

  if (!project) {
    return <div className="text-slate-400 text-center p-8">Loading project...</div>;
  }

  const { featureExpl, techExpl, stepExpl, problemExplanation } = generateExplanations(project);

  const handleSave = () => {
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    savedProjects.push({ ...project, savedAt: new Date().toISOString() });
    localStorage.setItem('projects', JSON.stringify(savedProjects));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: `Check out this project idea: ${project.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${project.title}\n\n${project.problem_statement}\n\nFeatures: ${project.features.join(', ')}\n\nTech Stack: ${project.tech_stack.join(', ')}`);
      alert('Project details copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const text = `Project: ${project.title}\n\nProblem Statement:\n${project.problem_statement}\n\nCore Features:\n${project.features.map(f => `• ${f}`).join('\n')}\n\nTech Stack:\n${project.tech_stack.map(t => `• ${t}`).join('\n')}\n\nDevelopment Steps:\n${project.development_steps.map((s, i) => `${i+1}. ${s}`).join('\n')}\n\nImprovements:\n${project.improvements.map(im => `• ${im}`).join('\n')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-8 card-white p-8 rounded-2xl">
      
      {/* Section 1: Project Overview */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {project.title}
            </h2>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-200">
                ⏱️ 16 Weeks
              </span>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200">
                📊 Medium Difficulty
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200">
                👥 2-3 Person Team
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Problem Statement */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
        <h3 className="font-semibold text-amber-700 text-lg mb-2">🎯 Understanding the Problem</h3>
        <p className="text-slate-700 text-lg">{project.problem_statement}</p>
        <div className="mt-3 p-3 bg-amber-100/50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <span className="font-bold">💡 Why this matters:</span> {problemExplanation}
          </p>
        </div>
      </div>

      {/* Section 3: Core Features */}
      <div>
        <h3 className="font-semibold text-emerald-600 text-lg mb-3">⚡ Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureExpl.map((f, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:bg-slate-100 transition">
              <div className="font-medium text-slate-800">{f.name}</div>
              <div className="text-sm text-slate-500 mt-1">{f.explanation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Tech Stack */}
      <div>
        <h3 className="font-semibold text-purple-600 text-lg mb-3">🛠️ Tech Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techExpl.map((t, i) => (
            <div key={i} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="font-medium text-slate-800">{t.name}</div>
              <div className="text-sm text-purple-700 mt-1">{t.explanation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Development Steps */}
      <div>
        <h3 className="font-semibold text-cyan-600 text-lg mb-3">📅 Development Roadmap</h3>
        <div className="space-y-3">
          {stepExpl.map((s, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start gap-3">
                <span className="text-cyan-600 font-bold min-w-[30px]">#{i+1}</span>
                <div>
                  <div className="font-medium text-slate-800">{s.step}</div>
                  <div className="text-sm text-slate-500 mt-1">{s.explanation}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Improvements */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-600 text-lg mb-3">🚀 Improvement Ideas</h3>
        <ul className="space-y-2">
          {project.improvements.map((im, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700">
              <span className="text-blue-500">▸</span>
              <span>{im}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 p-3 bg-blue-100/50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <span className="font-bold">How to learn more:</span> Start with the easiest improvement and build from there. Each improvement adds value to your project and impresses evaluators.
          </p>
        </div>
      </div>

      {/* Section 7: Next Steps */}
      <div className="border-t border-slate-200 pt-6 mt-4">
        <h3 className="font-semibold text-slate-800 text-lg mb-4">✅ What Should You Do Now?</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition text-emerald-700 flex items-center gap-2"
          >
            💾 {saved ? '✅ Saved!' : 'Save Project'}
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition text-blue-700 flex items-center gap-2"
          >
            📤 Share with Team
          </button>
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition text-purple-700 flex items-center gap-2"
          >
            📥 Download as Text
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition text-slate-700 flex items-center gap-2"
          >
            🔄 Generate Another
          </button>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          💡 <span className="text-slate-500">Your project is saved in your browser's local storage for the next 24 hours.</span>
        </div>
      </div>

    </section>
  );
}