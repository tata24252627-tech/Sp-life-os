import React from 'react';
import {
  LayoutDashboard,
  Database,
  CalendarCheck2,
  Building2,
  Bot,
  IndianRupee,
  Wrench,
  Boxes,
  Settings,
  ChevronRight,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { CustomModule } from '../../types/os';

interface SidebarProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  customModules: CustomModule[];
  onExit: () => void;
  onOpenTour: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isOpen,
  onToggle,
  customModules,
  onExit,
  onOpenTour,
}) => {
  const coreNavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'master-data', name: 'Master Data', icon: Database },
    { id: 'daily-work', name: 'My Daily Work', icon: CalendarCheck2 },
    { id: 'business-hub', name: 'Business Hub', icon: Building2 },
    { id: 'ai-assistant', name: 'AI Assistant', icon: Bot },
    { id: 'finance-tracker', name: 'Finance Tracker', icon: IndianRupee },
    { id: 'tools-center', name: 'Tools Center (16)', icon: Wrench },
    { id: 'module-builder', name: 'Module Builder', icon: Boxes },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-surface-border bg-surface/60 backdrop-blur-xl transition-all duration-300 z-30 shrink-0 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-surface-border">
        <button
          onClick={() => onSelectModule('dashboard')}
          className="flex items-center gap-3 overflow-hidden text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-black text-sm shadow-glow">
            SP
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-extrabold text-xs tracking-widest uppercase bg-gradient-to-r from-white via-slate-200 to-muted bg-clip-text text-transparent">
                SP LIFE OS
              </span>
              <span className="text-[9px] font-mono text-accent uppercase tracking-wider">
                Ultimate 2026
              </span>
            </div>
          )}
        </button>
        <button
          onClick={onToggle}
          className="text-muted hover:text-white p-1 rounded-lg hover:bg-surface transition"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[10px] font-bold text-muted/60 uppercase px-3 mb-2 tracking-wider">
          {isOpen ? 'Core Operating System' : 'OS'}
        </div>

        {coreNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                isActive
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-muted hover:bg-surface-card hover:text-white'
              }`}
              title={item.name}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {isOpen && <span className="truncate">{item.name}</span>}
            </button>
          );
        })}

        {/* Dynamic Custom Modules */}
        {customModules.length > 0 && (
          <>
            <div className="text-[10px] font-bold text-muted/60 uppercase px-3 pt-4 mb-2 tracking-wider">
              {isOpen ? 'Dynamic Modules' : 'Custom'}
            </div>
            {customModules.map((mod) => {
              const isActive = currentModule === `module_${mod.id}`;
              return (
                <button
                  key={mod.id}
                  onClick={() => onSelectModule(`module_${mod.id}`)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                    isActive
                      ? 'bg-secondary text-white shadow-glow-purple'
                      : 'text-muted hover:bg-surface-card hover:text-white'
                  }`}
                  title={mod.name}
                >
                  <Boxes className="w-4 h-4 shrink-0 text-accent" />
                  {isOpen && <span className="truncate">{mod.name}</span>}
                </button>
              );
            })}
          </>
        )}
      </nav>

      {/* Bottom controls */}
      <div className="p-3 border-t border-surface-border space-y-1">
        <button
          onClick={onOpenTour}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-medium text-accent hover:bg-surface-card transition"
          title="Onboarding & Guide"
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          {isOpen && <span>Feature Tour & Guide</span>}
        </button>

        <button
          onClick={onExit}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          title="Exit Session"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {isOpen && <span>Exit Platform</span>}
        </button>
      </div>
    </aside>
  );
};
