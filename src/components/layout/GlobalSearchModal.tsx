import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  Database,
  CalendarCheck2,
  Building2,
  IndianRupee,
  Bot,
  Wrench,
  Boxes,
  Settings,
  ArrowRight,
  X,
  FileSpreadsheet,
  CheckSquare,
  FileText,
  Package,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (moduleId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search items index
  const tasks = StorageEngine.getTasks();
  const inventory = StorageEngine.getInventory();
  const notes = StorageEngine.getNotes();
  const customers = StorageEngine.getCustomers();
  const customModules = StorageEngine.getCustomModules();

  const coreNav = [
    { title: 'Core Telemetry Dashboard', category: 'Navigation', icon: LayoutDashboard, moduleId: 'dashboard' },
    { title: 'Master Data Spreadsheet Engine', category: 'Navigation', icon: Database, moduleId: 'master-data' },
    { title: 'My Daily Work (Tasks, Notes, Calendar)', category: 'Navigation', icon: CalendarCheck2, moduleId: 'daily-work' },
    { title: 'Business Hub CRM & Inventory', category: 'Navigation', icon: Building2, moduleId: 'business-hub' },
    { title: 'AI Assistant Coprocessor Workspace', category: 'Navigation', icon: Bot, moduleId: 'ai-assistant' },
    { title: 'Personal Capital & Finance Tracker (₹)', category: 'Navigation', icon: IndianRupee, moduleId: 'finance-tracker' },
    { title: 'Tools Center (16 Interactive Utilities)', category: 'Navigation', icon: Wrench, moduleId: 'tools-center' },
    { title: 'Dynamic Module Builder (No-Code Tables)', category: 'Navigation', icon: Boxes, moduleId: 'module-builder' },
    { title: 'System Settings, Themes & Schema', category: 'Navigation', icon: Settings, moduleId: 'settings' },
  ];

  const toolsIndex = [
    { title: 'Cryptographic Key & Password Generator', category: 'Tool', icon: Wrench, moduleId: 'tools-center' },
    { title: 'Storage Capacity & Byte Converter (MB/GB)', category: 'Tool', icon: Wrench, moduleId: 'tools-center' },
    { title: 'JSON Validator & Pretty-Printer', category: 'Tool', icon: Wrench, moduleId: 'tools-center' },
    { title: 'Scientific & Financial Calculator', category: 'Tool', icon: Wrench, moduleId: 'tools-center' },
    { title: 'QR Code Generator & SVG Vector Engine', category: 'Tool', icon: Wrench, moduleId: 'tools-center' },
    { title: 'Pomodoro Focus Timer & Work Intervals', category: 'Tool', icon: Wrench, moduleId: 'tools-center' },
    { title: 'Loan / EMI Calculator (Principal & Interest)', category: 'Tool', icon: Wrench, moduleId: 'tools-center' },
    { title: 'Base64 Encoder / Decoder (UTF-8)', category: 'Tool', icon: Wrench, moduleId: 'tools-center' },
  ];

  const items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    category: string;
    icon: any;
    action: () => void;
  }> = [];

  // Core items
  coreNav.forEach((item, idx) => {
    items.push({
      id: `core-${idx}`,
      title: item.title,
      subtitle: 'Core OS Workspace',
      category: item.category,
      icon: item.icon,
      action: () => {
        onSelectModule(item.moduleId);
        onClose();
      },
    });
  });

  // Tools
  toolsIndex.forEach((t, idx) => {
    items.push({
      id: `tool-${idx}`,
      title: t.title,
      subtitle: 'Autonomous Utility',
      category: 'Utility Tool',
      icon: t.icon,
      action: () => {
        onSelectModule('tools-center');
        onClose();
      },
    });
  });

  // Custom Modules
  customModules.forEach((m) => {
    items.push({
      id: `mod-${m.id}`,
      title: m.name,
      subtitle: m.description,
      category: 'Dynamic Module',
      icon: Boxes,
      action: () => {
        onSelectModule(`module_${m.id}`);
        onClose();
      },
    });
  });

  // Tasks
  tasks.forEach((t) => {
    items.push({
      id: `task-${t.id}`,
      title: t.title,
      subtitle: `Priority: ${t.priority.toUpperCase()} | Status: ${t.status}`,
      category: 'Task Deliverable',
      icon: CheckSquare,
      action: () => {
        onSelectModule('daily-work');
        onClose();
      },
    });
  });

  // Inventory
  inventory.forEach((i) => {
    items.push({
      id: `inv-${i.id}`,
      title: i.product_name,
      subtitle: `SKU: ${i.sku} | Qty: ${i.quantity} | ₹${i.unit_price.toLocaleString('en-IN')}`,
      category: 'Inventory Item',
      icon: Package,
      action: () => {
        onSelectModule('business-hub');
        onClose();
      },
    });
  });

  // Notes
  notes.forEach((n) => {
    items.push({
      id: `note-${n.id}`,
      title: n.title,
      subtitle: `Category: ${n.category}`,
      category: 'Rich Note',
      icon: FileText,
      action: () => {
        onSelectModule('daily-work');
        onClose();
      },
    });
  });

  const filtered = query.trim()
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.category.toLowerCase().includes(query.toLowerCase()) ||
          (i.subtitle && i.subtitle.toLowerCase().includes(query.toLowerCase()))
      )
    : items.slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl glass-panel border border-surface-border shadow-2xl overflow-hidden bg-[#0A0F1D] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-surface-border">
          <Search className="w-4 h-4 text-primary shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, module name, task, SKU, or utility..."
            className="w-full bg-transparent text-sm text-white placeholder-muted focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted">
              No results found for &ldquo;<span className="text-white">{query}</span>&rdquo;. Try searching for tasks, inventory, or utilities.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="flex items-center justify-between w-full p-2.5 rounded-xl text-left hover:bg-surface-card hover:border-primary/40 border border-transparent transition group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface border border-surface-border text-primary group-hover:bg-primary/20 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-white group-hover:text-accent transition truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-muted truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface border border-surface-border text-muted">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-primary transition group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-surface-border bg-surface/30 text-[11px] text-muted font-mono">
          <div className="flex items-center gap-3">
            <span>Navigation: Click or Enter</span>
            <span>Esc to close</span>
          </div>
          <span>SP LIFE OS Index</span>
        </div>
      </div>
    </div>
  );
};
