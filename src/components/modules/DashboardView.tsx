import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Layers,
  IndianRupee,
  Bot,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';
import { TaskItem } from '../../types/os';

interface DashboardViewProps {
  onNavigate: (moduleId: string) => void;
  onOpenTour: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenTour,
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  const loadData = () => {
    const t = StorageEngine.getTasks();
    const inv = StorageEngine.getInventory();
    const tx = StorageEngine.getTransactions();

    setTasks(t);
    setInventoryCount(inv.length);
    setLowStockCount(inv.filter((i) => i.stock_status !== 'in_stock').length);

    const expenses = tx
      .filter((item) => item.type === 'expense')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
    const income = tx
      .filter((item) => item.type === 'income')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    setTotalExpenses(expenses);
    setTotalIncome(income);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sp-life-os-change', loadData);
    return () => window.removeEventListener('sp-life-os-change', loadData);
  }, []);

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const activeTasks = tasks.length - completedTasks;
  const recentTasks = tasks.slice(0, 5);

  const handleToggleTask = (id: string) => {
    StorageEngine.toggleTask(id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              System Telemetry & Hub
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted mt-1">
            Real-time telemetry and state synchronized from your isolated personal tenant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTour}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-primary/30 text-xs font-semibold text-accent hover:bg-primary/10 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Feature Guide
          </button>
          <button
            onClick={() => onNavigate('daily-work')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary/90 transition"
          >
            <Plus className="w-4 h-4" /> New Deliverable
          </button>
        </div>
      </div>

      {/* Metric Scoreboards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl glass-panel-hover">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs uppercase font-bold tracking-wider">Active Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{activeTasks}</span>
            <span className="text-xs text-muted font-mono">/ {tasks.length} Total</span>
          </div>
          <div className="mt-2 text-[10px] text-accent flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {completedTasks} completed in cycle
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl glass-panel-hover">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs uppercase font-bold tracking-wider">Inventory SKUs</span>
            <Layers className="w-4 h-4 text-secondary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{inventoryCount}</span>
            <span className="text-xs text-muted font-mono">SKUs tracked</span>
          </div>
          <div className="mt-2 text-[10px] flex items-center gap-1 text-muted">
            {lowStockCount > 0 ? (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3 h-3" /> {lowStockCount} item needs reorder
              </span>
            ) : (
              <span className="text-emerald-400">All SKUs healthy</span>
            )}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl glass-panel-hover">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs uppercase font-bold tracking-wider">Monthly Outflow</span>
            <IndianRupee className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-400 font-mono">
              ₹{totalExpenses.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <span>Inflow: ₹{totalIncome.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl glass-panel-hover">
          <div className="flex justify-between items-center text-muted">
            <span className="text-xs uppercase font-bold tracking-wider">AI Coprocessor</span>
            <Bot className="w-4 h-4 text-accent" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">ACTIVE</span>
          </div>
          <div className="mt-2 text-[10px] text-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-secondary" /> Gemini 3.8 Flash Proxy
          </div>
        </div>
      </div>

      {/* Workspace Pipeline & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliverables Pipeline */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider text-white">
                Immediate Deliverables
              </h2>
              <span className="text-xs text-muted">Directly manageable tasks in your pipeline</span>
            </div>
            <button
              onClick={() => onNavigate('daily-work')}
              className="text-xs text-primary hover:text-accent font-semibold transition"
            >
              View Daily Work →
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted">
              No tasks currently registered. Add your first deliverable.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentTasks.map((t) => {
                const isDone = t.status === 'completed';
                const priorityColors: Record<string, string> = {
                  urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                  high: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                  medium: 'bg-primary/10 text-accent border-primary/30',
                  low: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
                };
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface/50 border border-surface-border hover:border-primary/40 transition group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <button
                        onClick={() => handleToggleTask(t.id)}
                        className={`h-5 w-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-surface-border hover:border-primary'
                        }`}
                        title={isDone ? 'Mark in progress' : 'Mark completed'}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div className="overflow-hidden">
                        <span
                          className={`text-xs font-semibold block truncate ${
                            isDone ? 'line-through text-muted' : 'text-white'
                          }`}
                        >
                          {t.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-muted mt-0.5">
                          <span>{t.category}</span>
                          {t.due_date && (
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-2.5 h-2.5" /> {t.due_date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border shrink-0 ${
                        priorityColors[t.priority] || priorityColors.medium
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Command Actions */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div>
            <h2 className="font-bold text-sm uppercase tracking-wider mb-1 text-white">
              Quick Command Actions
            </h2>
            <p className="text-xs text-muted mb-4">
              Deploy direct entity operations across modules.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('master-data')}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-surface-card border border-surface-border text-xs font-semibold hover:border-primary/50 text-white transition text-left group"
              >
                <span>Import CSV / Excel Sheet</span>
                <ArrowUpRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>

              <button
                onClick={() => onNavigate('module-builder')}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-surface-card border border-surface-border text-xs font-semibold hover:border-secondary/50 text-white transition text-left group"
              >
                <span>Build Dynamic Custom Module</span>
                <ArrowUpRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>

              <button
                onClick={() => onNavigate('ai-assistant')}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-surface-card border border-surface-border text-xs font-semibold hover:border-accent/50 text-white transition text-left group"
              >
                <span>Open AI Reasoning Workspace</span>
                <ArrowUpRight className="w-4 h-4 text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>

              <button
                onClick={() => onNavigate('tools-center')}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-surface-card border border-surface-border text-xs font-semibold hover:border-emerald-500/50 text-white transition text-left group"
              >
                <span>Access 16 Offline Utilities</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </button>
            </div>
          </div>

          {/* Identity & Fortified Guarantee */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-1.5 text-primary">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Identity Guarantee
              </span>
            </div>
            <p className="text-[11px] text-muted mt-1 leading-relaxed">
              Every data point rendered is bound to your secure browser storage context. Zero mock latency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
