import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Plus,
  Trash2,
  Search,
  Download,
  Table as TableIcon,
  Check,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';
import { CustomModule, CustomModuleRecord } from '../../types/os';

interface DynamicModuleViewProps {
  moduleId: string;
  onModuleDeleted: () => void;
}

export const DynamicModuleView: React.FC<DynamicModuleViewProps> = ({
  moduleId,
  onModuleDeleted,
}) => {
  const [module, setModule] = useState<CustomModule | null>(null);
  const [records, setRecords] = useState<CustomModuleRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationError, setValidationError] = useState('');

  const loadModuleData = () => {
    const modules = StorageEngine.getCustomModules();
    const found = modules.find((m) => `module_${m.id}` === moduleId || m.id === moduleId);
    if (found) {
      setModule(found);
      setRecords(StorageEngine.getCustomModuleRecords(found.id));
    }
  };

  useEffect(() => {
    loadModuleData();
    window.addEventListener('sp-life-os-change', loadModuleData);
    return () => window.removeEventListener('sp-life-os-change', loadModuleData);
  }, [moduleId]);

  if (!module) {
    return (
      <div className="p-12 text-center text-xs text-muted">
        Module not found or has been decommissioned.
      </div>
    );
  }

  const handleOpenAdd = () => {
    const initial: Record<string, any> = {};
    module.fields.forEach((f) => {
      initial[f.name] = f.type === 'checkbox' ? false : '';
    });
    setFormData(initial);
    setValidationError('');
    setModalOpen(true);
  };

  const handleCommitRecord = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    for (const f of module.fields) {
      if (f.required && (formData[f.name] === undefined || formData[f.name] === '')) {
        setValidationError(`"${f.label}" is required.`);
        return;
      }
    }

    StorageEngine.addCustomModuleRecord(module.id, formData);
    setModalOpen(false);
  };

  const handleDeleteRecord = (recordId: string) => {
    StorageEngine.deleteCustomModuleRecord(recordId);
  };

  const handleDeleteModule = () => {
    if (confirm(`Are you sure you want to permanently delete custom module "${module.name}"?`)) {
      StorageEngine.deleteCustomModule(module.id);
      onModuleDeleted();
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = module.fields.map((f) => f.label);
    const keys = module.fields.map((f) => f.name);

    const rows = records.map((r) =>
      keys.map((k) => `"${String(r.record_data[k] ?? '').replace(/"/g, '""')}"`).join(',')
    );

    const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${module.route_slug}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter((r) =>
    Object.values(r.record_data).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">{module.name}</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/40">
              Dynamic Runtime
            </span>
          </div>
          <p className="text-xs text-muted mt-1">{module.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-surface-border text-xs font-semibold hover:border-accent/50 text-white transition"
          >
            <Download className="w-4 h-4 text-accent" /> Export CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary/90 transition"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>
          <button
            onClick={handleDeleteModule}
            className="p-2 text-muted hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition"
            title="Delete this dynamic module"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder={`Filter records across all ${module.fields.length} schema dimensions...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-xs w-full text-white focus:outline-none placeholder-muted"
        />
        {searchTerm && (
          <span className="text-[10px] text-muted font-mono shrink-0">
            {filteredRecords.length} matched
          </span>
        )}
      </div>

      {/* Dynamic Data Grid */}
      <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
        {records.length === 0 ? (
          <div className="p-16 text-center text-xs text-muted">
            <TableIcon className="w-10 h-10 mx-auto mb-3 opacity-40 text-secondary" />
            <p className="font-semibold text-white">No records stored in this custom module</p>
            <p className="mt-1">Click &quot;Add Record&quot; to commit your first row to the schema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface/80 border-b border-surface-border text-muted font-mono uppercase text-[10px]">
                <tr>
                  {module.fields.map((f) => (
                    <th key={f.id} className="px-5 py-3.5 whitespace-nowrap">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-surface-card/60 transition">
                    {module.fields.map((f) => {
                      const val = rec.record_data[f.name];
                      return (
                        <td key={f.id} className="px-5 py-3.5 whitespace-nowrap">
                          {f.type === 'checkbox' ? (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                                val
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-surface text-muted border border-surface-border'
                              }`}
                            >
                              {val ? 'TRUE' : 'FALSE'}
                            </span>
                          ) : (
                            <span className="font-medium text-slate-200">
                              {String(val ?? '')}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="p-1.5 text-muted hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dynamic Add Record Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-surface-border shadow-2xl bg-[#0A0F1D]">
            <h3 className="text-base font-bold text-white mb-2">Append Custom Record</h3>
            <p className="text-xs text-muted mb-4">
              Schema: <span className="text-accent">{module.name}</span>
            </p>

            {validationError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleCommitRecord} className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {module.fields.map((f) => (
                <div key={f.id}>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    {f.label} {f.required && <span className="text-rose-400">*</span>}
                  </label>

                  {f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formData[f.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                      className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  ) : f.type === 'dropdown' ? (
                    <select
                      value={formData[f.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                      className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="">Select option...</option>
                      {(f.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id={`check_${f.id}`}
                        checked={Boolean(formData[f.name])}
                        onChange={(e) => setFormData({ ...formData, [f.name]: e.target.checked })}
                        className="rounded border-surface-border"
                      />
                      <label htmlFor={`check_${f.id}`} className="text-xs text-muted cursor-pointer">
                        Mark as Active / True
                      </label>
                    </div>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                      value={formData[f.name] ?? ''}
                      onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                      placeholder={`Enter ${f.label}...`}
                      className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  )}
                </div>
              ))}

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-surface hover:bg-surface-card text-muted hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs rounded-xl bg-primary text-white font-bold shadow-glow hover:bg-primary/90 transition"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
