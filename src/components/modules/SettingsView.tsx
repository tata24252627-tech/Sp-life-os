import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Palette,
  Database,
  Download,
  Upload,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  Code,
  FileText,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';
import { UserProfile, ThemeMode, LocaleMode } from '../../types/os';

const SUPABASE_SCHEMA_SQL = `-- ============================================================================
-- SP LIFE OS: COMPLETE RELATIONAL & DYNAMIC DATA SCHEMA
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER PROFILES & SYSTEM PREFERENCES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    theme_preference TEXT DEFAULT 'premium-dark' CHECK (theme_preference IN ('premium-dark', 'midnight-blue', 'purple-night', 'clean-light')),
    locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'hi', 'mr')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DYNAMIC MODULE BUILDER (METADATA ENGINE)
CREATE TABLE public.custom_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Layers',
    color TEXT DEFAULT '#287BFF',
    route_slug TEXT NOT NULL,
    sidebar_position INT DEFAULT 99,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, route_slug)
);

CREATE TABLE public.custom_module_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.custom_modules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_label TEXT NOT NULL,
    field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'dropdown', 'checkbox', 'textarea')),
    is_required BOOLEAN DEFAULT FALSE,
    options JSONB DEFAULT '[]'::jsonb,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.custom_module_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.custom_modules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    record_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MASTER DATA MANAGEMENT (DATASETS & SPREADSHEETS)
CREATE TABLE public.datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    schema_definition JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.dataset_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    row_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DAILY WORK (TASKS & RICH NOTES)
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category TEXT DEFAULT 'general',
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT DEFAULT 'General',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BUSINESS HUB (CRM, INVENTORY & TRANSACTIONS)
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    category TEXT DEFAULT 'Standard',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    sku TEXT,
    quantity INT DEFAULT 0,
    unit_price NUMERIC(12, 2) DEFAULT 0.00,
    stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    supplier TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FINANCE TRACKER (INR-BASED EXPENSES & INCOMES)
CREATE TABLE public.finance_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI WORKSPACE CONVERSATIONS
CREATE TABLE public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New AI Workspace',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_module_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_module_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own modules" ON public.custom_modules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notes" ON public.notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own finances" ON public.finance_transactions FOR ALL USING (auth.uid() = user_id);
`;

export const SettingsView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(StorageEngine.getProfile());
  const [copyStatus, setCopyStatus] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    setProfile(StorageEngine.getProfile());
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    StorageEngine.updateProfile(profile);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2500);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setProfile((prev) => ({ ...prev, theme_preference: newTheme }));
    StorageEngine.updateProfile({ theme_preference: newTheme });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleExportBackup = () => {
    const data = StorageEngine.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sp_life_os_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageEngine.importAllData(content);
      if (success) {
        setImportStatus('Backup successfully restored! Refreshing state...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus('Failed to restore backup: Invalid JSON structure.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to restore all initial OS seed datasets?')) {
      StorageEngine.resetToDefaults();
      window.location.reload();
    }
  };

  const themes: Array<{ id: ThemeMode; name: string; bg: string; accent: string }> = [
    { id: 'premium-dark', name: 'Premium Dark', bg: '#080B12', accent: '#287BFF' },
    { id: 'midnight-blue', name: 'Midnight Blue', bg: '#050b18', accent: '#1a73e8' },
    { id: 'purple-night', name: 'Purple Night', bg: '#0c0817', accent: '#9333ea' },
    { id: 'clean-light', name: 'Clean Daylight', bg: '#f8fafc', accent: '#2563eb' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">System Settings & Topology</h1>
        <p className="text-xs text-muted mt-1">
          Configure personal tenant profile, visual presentation themes, state backups & PostgreSQL migrations.
        </p>
      </div>

      {saveStatus && (
        <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" /> User profile and preferences successfully committed!
        </div>
      )}

      {importStatus && (
        <div className="p-3.5 rounded-2xl border border-primary/30 bg-primary/10 text-accent text-xs font-semibold">
          {importStatus}
        </div>
      )}

      {/* 1. PROFILE SETTINGS */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-surface-border">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
          <User className="w-4 h-4" /> 1. Tenant Identity & Preferences
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                Username / Handle
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                Timezone
              </label>
              <input
                type="text"
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                Locale
              </label>
              <select
                value={profile.locale}
                onChange={(e) => setProfile({ ...profile, locale: e.target.value as LocaleMode })}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="en">English (Global)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="mr">Marathi (मराठी)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                System Role
              </label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary/90 transition"
            >
              Commit Preferences
            </button>
          </div>
        </form>
      </div>

      {/* 2. THEME CUSTOMIZATION */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-surface-border">
        <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider font-mono">
          <Palette className="w-4 h-4" /> 2. Visual Theme & Atmosphere
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {themes.map((th) => {
            const isSelected = profile.theme_preference === th.id;
            return (
              <button
                key={th.id}
                onClick={() => handleThemeChange(th.id)}
                className={`p-4 rounded-2xl border text-left transition relative overflow-hidden ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/40 bg-surface'
                    : 'border-surface-border bg-surface/50 hover:bg-surface-card'
                }`}
              >
                <div
                  className="h-10 w-full rounded-xl mb-3 flex items-center justify-center border border-white/10"
                  style={{ backgroundColor: th.bg }}
                >
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: th.accent }} />
                </div>
                <div className="text-xs font-bold text-white">{th.name}</div>
                {isSelected && (
                  <span className="absolute top-2 right-2 text-[9px] font-mono text-primary font-bold">
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. POSTGRESQL & SUPABASE MIGRATION SCHEMA */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-surface-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider font-mono">
            <Database className="w-4 h-4" /> 3. PostgreSQL Database Schema & RLS
          </div>
          <button
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-surface-border text-xs text-muted hover:text-white transition"
          >
            {copyStatus ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Migration SQL
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Full SQL Blueprint
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          Production migration script containing all 13 tables, dynamic module schema engines, and strict tenant Row Level Security (RLS) policies.
        </p>

        <div className="relative rounded-2xl bg-black/60 border border-surface-border p-4 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-300">
          <pre>{SUPABASE_SCHEMA_SQL}</pre>
        </div>
      </div>

      {/* 4. SYSTEM BACKUP & RESET */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-surface-border">
        <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> 4. Data Portability & Recovery
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleExportBackup}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-surface border border-surface-border hover:border-primary/50 text-xs font-semibold text-white transition"
          >
            <Download className="w-4 h-4 text-primary" /> Export Full System JSON
          </button>

          <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-surface border border-surface-border hover:border-accent/50 text-xs font-semibold text-white transition cursor-pointer">
            <Upload className="w-4 h-4 text-accent" /> Restore Snapshot
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetDefaults}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset Demo Datasets
          </button>
        </div>
      </div>
    </div>
  );
};
