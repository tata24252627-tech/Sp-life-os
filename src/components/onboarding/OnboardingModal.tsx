import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  CalendarCheck2,
  Building2,
  IndianRupee,
  Bot,
  Boxes,
  Wrench,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Laptop,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: (targetModule?: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to SP LIFE OS',
      subtitle: 'Ultimate Edition Architecture',
      badge: 'Version 2026.1',
      badgeIcon: Sparkles,
      iconColor: 'from-[#287BFF] to-[#7957FF]',
      description:
        'The unified personal operating environment. Master spreadsheets, manage enterprise relationships, run AI reasoning, track personal capital in INR (₹), and construct custom applications on demand.',
      cta: 'Begin Tour',
      features: [
        { label: 'Isolated Tenant Privacy', desc: 'Zero data leakage; strict storage compartmentalization' },
        { label: 'High-Throughput Engines', desc: 'CSV datasets, double-entry ledger & 16 utilities' },
        { label: 'Dynamic Module Runtime', desc: 'Build and deploy custom database tables with zero code' },
      ],
      previewType: 'gateway',
    },
    {
      id: 'master-data',
      title: 'Master Data Management',
      subtitle: 'High-Throughput Tabular Data Engine',
      badge: 'Spreadsheet Powerhouse',
      badgeIcon: Database,
      iconColor: 'from-[#287BFF] to-[#65B7FF]',
      description:
        'Parse, filter, search, and export massive tabular datasets. Upload CSV files directly or append custom schema records with real-time client-side search across all dimensions.',
      cta: 'Explore Master Data',
      targetModule: 'master-data',
      features: [
        { label: 'Instant CSV Ingestion', desc: 'Drag-and-drop or select CSV files for instant table generation' },
        { label: 'Full-Grid Filtering', desc: 'Search across all column dimensions in real-time with zero lag' },
        { label: '1-Click CSV Export', desc: 'Download curated datasets formatted for enterprise reporting' },
      ],
      previewType: 'table',
    },
    {
      id: 'daily-work',
      title: 'My Daily Work',
      subtitle: 'Tasks, Rich Notes & Timeline',
      badge: 'Productivity Matrix',
      badgeIcon: CalendarCheck2,
      iconColor: 'from-[#10B981] to-[#287BFF]',
      description:
        'Stay ahead of high-stakes deliverables. Manage tasks across priority matrices (Urgent, High, Medium, Low), pin strategic memos with color codes, and visualize timelines.',
      cta: 'Discover Daily Work',
      targetModule: 'daily-work',
      features: [
        { label: 'Prioritized Pipelines', desc: 'Track urgent vs routine work with quick completion toggles' },
        { label: 'Pinned Strategic Notes', desc: 'Color-coded rich notes with architectural directives and memos' },
        { label: 'Visual Calendar Timeline', desc: 'Scheduled deadlines mapped across the current calendar month' },
      ],
      previewType: 'tasks',
    },
    {
      id: 'business-hub',
      title: 'Business Hub & Inventory',
      subtitle: 'CRM & Supply Chain Cockpit',
      badge: 'Commercial Command',
      badgeIcon: Building2,
      iconColor: 'from-[#F59E0B] to-[#EF4444]',
      description:
        'Keep enterprise contracts and physical assets organized. Manage client CRM records with VIP tagging, track SKU stock quantities, and receive proactive depletion warnings.',
      cta: 'View Business Hub',
      targetModule: 'business-hub',
      features: [
        { label: 'Enterprise CRM Directory', desc: 'Client retainers, contact records, and lifetime value tracking' },
        { label: 'Inventory SKU Telemetry', desc: 'Monitor stock states: In Stock, Low Stock, or Out of Stock' },
        { label: 'Automatic Depletion Alerts', desc: 'Proactive warnings when hardware units fall below threshold' },
      ],
      previewType: 'business',
    },
    {
      id: 'finance-tracker',
      title: 'Finance Tracker (₹ INR)',
      subtitle: 'Manual Double-Entry Bookkeeping',
      badge: 'Capital Management',
      badgeIcon: IndianRupee,
      iconColor: 'from-[#10B981] to-[#047857]',
      description:
        'Manual capital accounting calibrated specifically for Indian Rupees (₹). Log client inflows, operational server outflows, and monitor your exact net ledger balance in real-time.',
      cta: 'Open Finance Tracker',
      targetModule: 'finance-tracker',
      features: [
        { label: 'Dual-Flow Ledger', desc: 'Track incomes vs expenses with transaction narratives and dates' },
        { label: 'Live Net Balance', desc: 'Instant calculations of net capital reserves and monthly burn rates' },
        { label: 'Audit CSV Export', desc: 'Extract accounting logs formatted for GST reconciliation' },
      ],
      previewType: 'finance',
    },
    {
      id: 'ai-assistant',
      title: 'AI Coprocessor Workspace',
      subtitle: 'Server-Side Gemini 3.8 Intelligence',
      badge: 'Cognitive Reasoning',
      badgeIcon: Bot,
      iconColor: 'from-[#7957FF] to-[#C084FC]',
      description:
        'Tap into deep reasoning, spreadsheet synthesis, and automated business planning. The coprocessor runs server-side with fortified security and pre-tuned prompt templates.',
      cta: 'Access AI Workspace',
      targetModule: 'ai-assistant',
      features: [
        { label: 'Context-Aware Analysis', desc: 'Infers insights from your active tasks, inventory, and ledger' },
        { label: 'Prompt Accelerators', desc: '1-click templates for inventory analysis, client proposals & code' },
        { label: 'Fortified Security', desc: 'Zero browser key exposure; calls proxy through secure backend' },
      ],
      previewType: 'ai',
    },
    {
      id: 'builder-tools',
      title: 'Dynamic Modules & 16 Tools',
      subtitle: 'Extensibility & Standalone Utilities',
      badge: 'Infinite Topologies',
      badgeIcon: Boxes,
      iconColor: 'from-[#287BFF] to-[#EC4899]',
      description:
        'Build bespoke database tables with custom fields (text, numbers, dropdowns, dates, flags) and access 16 standalone offline utilities including crypto generators, JSON formatters, and calculators.',
      cta: 'Launch SP LIFE OS',
      targetModule: 'module-builder',
      features: [
        { label: 'Dynamic Schema Builder', desc: 'Deploy custom modules that instantly appear in your sidebar' },
        { label: '16 Built-in Utilities', desc: 'Password generator, storage converter, JSON validator, Pomodoro, etc.' },
        { label: 'Full System Portability', desc: 'Backup and restore the entire OS state via single JSON snapshots' },
      ],
      previewType: 'tools',
    },
  ];

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      StorageEngine.setOnboardingCompleted(true);
      onClose(step.targetModule);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    StorageEngine.setOnboardingCompleted(true);
    onClose();
  };

  const handleJumpToModule = (mod?: string) => {
    StorageEngine.setOnboardingCompleted(true);
    onClose(mod);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl glass-panel border border-white/10 shadow-2xl overflow-hidden bg-[#0A0F1D]/95 my-auto">
        {/* Glow ambient background */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-xs shadow-glow">
              SP
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-white">SP LIFE OS</span>
              <span className="ml-2 text-[10px] text-muted font-mono">Interactive Setup Guide</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted font-mono">
              <span className="text-primary font-bold">{currentStep + 1}</span>
              <span>/</span>
              <span>{steps.length}</span>
            </div>
            <button
              onClick={handleSkip}
              className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-surface transition text-xs"
              title="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="h-1 w-full bg-surface-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Stepper Dots */}
        <div className="flex justify-center items-center gap-2 pt-4 px-6">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-8 bg-primary shadow-glow'
                  : idx < currentStep
                  ? 'w-3 bg-secondary/70'
                  : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Modal Main Body */}
        <div className="relative p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Context & Narrative */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
              <step.badgeIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                {step.badge}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {step.title}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-primary mt-1">
                {step.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {step.description}
            </p>

            {/* Feature Highlights Grid */}
            <div className="space-y-2.5 pt-2">
              {step.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-surface/50 border border-surface-border/60 hover:border-primary/40 transition"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-accent">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{feat.label}</div>
                    <div className="text-[11px] text-muted leading-tight">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Interactive Cue / Mockup */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl p-5 border border-surface-border bg-surface-card/90 backdrop-blur-xl shadow-glass overflow-hidden">
              {step.previewType === 'gateway' && (
                <div className="space-y-4 text-center py-4">
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/50 bg-surface/90 shadow-glow">
                    <span className="text-3xl font-black bg-gradient-to-tr from-primary to-secondary bg-clip-text text-transparent">
                      SP
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white tracking-wide">SP LIFE OS</div>
                    <div className="text-[11px] text-muted">Unified Cockpit Architecture</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-left pt-2">
                    <div className="p-2.5 rounded-xl bg-surface/80 border border-surface-border">
                      <div className="text-[10px] text-muted uppercase font-mono">Engine</div>
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                        <Zap className="w-3 h-3" /> Zero Latency
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface/80 border border-surface-border">
                      <div className="text-[10px] text-muted uppercase font-mono">Security</div>
                      <div className="text-xs font-bold text-accent flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3 h-3" /> Fortified
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step.previewType === 'table' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2">
                    <span className="text-[10px] font-mono text-muted uppercase flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3 h-3 text-primary" /> Live Table Grid
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                      CSV Ready
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="flex justify-between p-2 rounded-lg bg-surface/60 border border-surface-border">
                      <span className="font-semibold text-white">REC-001 Enterprise Node</span>
                      <span className="text-emerald-400 font-bold">₹45,000</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-surface/60 border border-surface-border">
                      <span className="font-semibold text-white">REC-002 Fiber Gateway</span>
                      <span className="text-primary font-bold">₹18,500</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-surface/60 border border-surface-border">
                      <span className="font-semibold text-white">REC-003 Storage Array</span>
                      <span className="text-secondary font-bold">₹32,000</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted text-center pt-1 font-mono">
                    Multi-column sorting • Instant search • Export
                  </div>
                </div>
              )}

              {step.previewType === 'tasks' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2">
                    <span className="text-[10px] font-mono text-muted uppercase">Deliverables Pipeline</span>
                    <span className="text-[10px] text-primary font-bold">Priority Matrix</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-surface/60 border border-rose-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="text-xs font-semibold">Deploy Cloud Cluster</span>
                      </div>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">
                        Urgent
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface/60 border border-primary/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-xs font-semibold">Quarterly Tax Audit</span>
                      </div>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-primary/10 text-accent">
                        High
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface/60 border border-emerald-500/30 flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs line-through text-muted">Review SLA Benchmarks</span>
                      </div>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        Done
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {step.previewType === 'business' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2">
                    <span className="text-[10px] font-mono text-muted uppercase">Inventory & CRM</span>
                    <span className="text-[10px] text-amber-400 font-bold">Live Status</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface/60 border border-surface-border space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">Enterprise Server X9</span>
                      <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded bg-emerald-500/10">
                        14 in stock
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">Fiber Gateway 10G</span>
                      <span className="text-[10px] text-amber-400 font-mono px-1.5 py-0.5 rounded bg-amber-500/10">
                        3 low stock
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Aarav Mehta (Nexus Matrix)</span>
                    <span className="text-[10px] text-accent font-mono">VIP Client</span>
                  </div>
                </div>
              )}

              {step.previewType === 'finance' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2">
                    <span className="text-[10px] font-mono text-muted uppercase">Double-Entry Balance</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">INR (₹)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[9px] text-muted uppercase font-mono">Inflow</span>
                      <div className="text-xs font-black text-emerald-400 mt-0.5">₹2,05,000</div>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <span className="text-[9px] text-muted uppercase font-mono">Outflow</span>
                      <div className="text-xs font-black text-rose-400 mt-0.5">₹57,100</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface/80 border border-primary/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Net Capital Balance</span>
                    <span className="text-sm font-black text-primary font-mono">₹1,47,900</span>
                  </div>
                </div>
              )}

              {step.previewType === 'ai' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2">
                    <span className="text-[10px] font-mono text-muted uppercase flex items-center gap-1.5">
                      <Bot className="w-3 h-3 text-secondary" /> Gemini 3.8 Flash
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Server Proxy</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface/60 border border-surface-border text-xs text-muted leading-relaxed">
                    <span className="text-white font-semibold block mb-1">Coprocessor Reasoning:</span>
                    "Detected 1 low-stock item (Fiber Switch). Recommend issuing purchase order prior to Nov 15 cloud deployment milestone."
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono px-2 py-1 rounded bg-secondary/10 border border-secondary/30 text-secondary">
                      Spreadsheet Analysis
                    </span>
                    <span className="text-[9px] font-mono px-2 py-1 rounded bg-primary/10 border border-primary/30 text-accent">
                      Cashflow Strategy
                    </span>
                  </div>
                </div>
              )}

              {step.previewType === 'tools' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-surface-border pb-2">
                    <span className="text-[10px] font-mono text-muted uppercase">16 Utilities & Schema</span>
                    <span className="text-[10px] text-accent font-bold">Dynamic</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="p-2 rounded-lg bg-surface/60 border border-surface-border text-center">
                      Key Generator
                    </div>
                    <div className="p-2 rounded-lg bg-surface/60 border border-surface-border text-center">
                      Byte Converter
                    </div>
                    <div className="p-2 rounded-lg bg-surface/60 border border-surface-border text-center">
                      JSON Formatter
                    </div>
                    <div className="p-2 rounded-lg bg-surface/60 border border-surface-border text-center">
                      QR Code Gen
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/30 text-center text-xs font-bold text-white">
                    + Dynamic Module Builder Runtime
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-8 py-5 border-t border-surface-border bg-surface/40">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-xs font-semibold text-muted hover:text-white hover:bg-surface-card transition w-full sm:w-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>
            )}
            <button
              onClick={handleSkip}
              className="text-xs text-muted hover:text-white px-3 py-2 transition"
            >
              Skip to Workspace
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {step.targetModule && !isLast && (
              <button
                onClick={() => handleJumpToModule(step.targetModule)}
                className="px-4 py-2.5 rounded-xl bg-surface border border-primary/40 text-xs font-semibold text-accent hover:bg-primary/10 transition w-full sm:w-auto"
              >
                Open This Module
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-glow hover:opacity-95 transition w-full sm:w-auto"
            >
              {isLast ? (
                <>
                  <Laptop className="w-4 h-4" /> Enter SP LIFE OS
                </>
              ) : (
                <>
                  {step.cta} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
