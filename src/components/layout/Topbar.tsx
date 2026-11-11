import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Command,
  HelpCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, OsNotification } from '../../types/os';
import { StorageEngine } from '../../lib/storage';

interface TopbarProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  onOpenSearch: () => void;
  onOpenTour: () => void;
  onToggleMobileMenu: () => void;
  profile: UserProfile;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentModule,
  onSelectModule,
  onOpenSearch,
  onOpenTour,
  onToggleMobileMenu,
  profile,
}) => {
  const [notifications, setNotifications] = useState<OsNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setNotifications(StorageEngine.getNotifications());
    const handleUpdate = () => {
      setNotifications(StorageEngine.getNotifications());
    };
    window.addEventListener('sp-life-os-change', handleUpdate);
    return () => window.removeEventListener('sp-life-os-change', handleUpdate);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggleNotifications = () => {
    if (!showNotifications && unreadCount > 0) {
      StorageEngine.markNotificationsRead();
    }
    setShowNotifications(!showNotifications);
  };

  const handleClearNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    StorageEngine.clearNotifications();
  };

  const getBreadcrumbTitle = () => {
    switch (currentModule) {
      case 'dashboard':
        return 'Telemetry & Operations Hub';
      case 'master-data':
        return 'Master Data Management (CSV & Datasets)';
      case 'daily-work':
        return 'My Daily Work (Tasks, Notes & Timeline)';
      case 'business-hub':
        return 'Business Hub & Inventory Engine';
      case 'ai-assistant':
        return 'AI Assistant Workspace (Gemini Coprocessor)';
      case 'finance-tracker':
        return 'Personal Capital & INR (₹) Bookkeeping';
      case 'tools-center':
        return 'Autonomous Utilities Center (16 Tools)';
      case 'module-builder':
        return 'Dynamic Schema & Module Builder';
      case 'settings':
        return 'System Preferences & Tenant Schema';
      default:
        return 'Dynamic Custom Runtime';
    }
  };

  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-8 border-b border-surface-border bg-surface/40 backdrop-blur-md shrink-0 relative z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden text-muted hover:text-white p-2 rounded-lg hover:bg-surface-card transition"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger bar */}
        <button
          onClick={onOpenSearch}
          className="relative flex items-center justify-between w-48 sm:w-80 md:w-96 rounded-xl bg-surface-card border border-surface-border pl-9 pr-3 py-2 text-xs text-muted hover:border-primary/50 hover:text-white transition group"
        >
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted group-hover:text-primary transition" />
          <span className="truncate">Global Search across modules...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border border-surface-border text-muted">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>

        <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-surface-border text-xs">
          <span className="text-muted/60">Module:</span>
          <span className="font-semibold text-white tracking-wide">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Right control elements */}
      <div className="flex items-center gap-3">
        {/* Onboarding Tour Button */}
        <button
          onClick={onOpenTour}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-xs font-semibold text-accent hover:bg-primary/20 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Tour & Guide</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={handleToggleNotifications}
            className="relative p-2 text-muted hover:text-white rounded-xl hover:bg-surface-card transition"
            title="System notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel border border-surface-border shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    System Telemetry Log
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary text-white">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearNotifications}
                    className="text-[10px] text-muted hover:text-rose-400 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted">
                    No active telemetry alerts. System operating within optimal thresholds.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs transition ${
                        n.type === 'alert'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                          : n.type === 'success'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                          : 'border-surface-border bg-surface/50 text-white'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-[11px] text-white">{n.title}</span>
                        <span className="text-[9px] font-mono opacity-60 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] opacity-80 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <button
          onClick={() => onSelectModule('settings')}
          className="flex items-center gap-2.5 pl-3 border-l border-surface-border hover:opacity-90 transition group text-left"
          title="Account & System Settings"
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-extrabold text-white shadow-glow">
            SP
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-bold text-white group-hover:text-primary transition leading-none">
              {profile.full_name || 'Sahil P.'}
            </span>
            <span className="text-[10px] text-muted leading-tight mt-0.5 font-mono">
              @{profile.username || 'sahil_sp'}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
