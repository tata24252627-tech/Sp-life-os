import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Lock,
  Sparkles,
  Shield,
  Cpu,
  Layers,
  Database,
  IndianRupee,
  Bot,
  Play,
} from 'lucide-react';

interface WelcomeGatewayProps {
  onEnterApp: () => void;
  onOpenTour: () => void;
}

export const WelcomeGateway: React.FC<WelcomeGatewayProps> = ({
  onEnterApp,
  onOpenTour,
}) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 250);
          return 100;
        }
        return prev + 25;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080B12] text-white">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-48 w-48 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-primary/40 bg-surface/80 backdrop-blur-xl shadow-glow">
            <span className="text-4xl font-extrabold tracking-wider bg-gradient-to-tr from-primary to-secondary bg-clip-text text-transparent">
              SP
            </span>
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-bold tracking-widest text-white">
          SP LIFE OS
        </h1>
        <p className="mt-2 text-xs tracking-widest text-muted uppercase font-mono">
          Your Digital World Starts Here.
        </p>

        <div className="mt-8 w-64 h-1.5 rounded-full bg-surface-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="mt-3 text-xs text-muted font-mono">{progress}%</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B12] text-white flex flex-col justify-between selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 sm:px-10 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-surface shadow-glow">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SP
            </span>
          </div>
          <div>
            <span className="font-extrabold tracking-wider text-sm sm:text-base text-white">
              SP LIFE OS
            </span>
            <span className="block text-[9px] font-mono text-accent uppercase">
              Ultimate Edition
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTour}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-accent hover:text-white transition rounded-xl border border-primary/20 bg-primary/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Feature Tour
          </button>
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-glow hover:bg-primary/90 transition"
          >
            Launch System <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto py-12 sm:py-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-surface-card mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold tracking-wide uppercase text-accent">
            Ultimate Edition Architecture 2026
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
          ONE PLATFORM. <br />
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            UNLIMITED POSSIBILITIES.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
          The next-generation unified personal operating environment. Master spreadsheets,
          manage enterprises, run AI reasoning, track personal capital in INR (₹), and craft bespoke modules on demand.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <button
            onClick={onEnterApp}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold shadow-glow hover:opacity-95 transition text-sm sm:text-base"
          >
            Enter SP LIFE OS <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenTour}
            className="flex items-center gap-2 px-8 py-4 bg-surface border border-surface-border rounded-xl font-bold hover:border-primary/50 text-white transition text-sm sm:text-base"
          >
            <Play className="w-4 h-4 text-primary" /> Take Interactive Tour
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left w-full">
          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <Cpu className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-base mb-2 text-white">Dynamic Module Engine</h3>
            <p className="text-xs text-muted leading-relaxed">
              Architect and deploy customized applications with zero code rebuilds or server downtime.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <Sparkles className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-bold text-base mb-2 text-white">Private AI Coprocessor</h3>
            <p className="text-xs text-muted leading-relaxed">
              Direct reasoning, spreadsheet extraction, and workflow automation backed by Gemini 3.8.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <Shield className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-bold text-base mb-2 text-white">Fortified Security</h3>
            <p className="text-xs text-muted leading-relaxed">
              Strict tenant compartmentalization keeping individual user data strictly isolated.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted border-t border-surface-border flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 max-w-7xl mx-auto w-full">
        <span>© 2026 SP LIFE OS. Production-Grade Architecture.</span>
        <span className="font-mono text-[10px] text-muted/80 mt-2 sm:mt-0">
          Powered by React 19 + Express + Gemini 3.8 Flash
        </span>
      </footer>
    </div>
  );
};
