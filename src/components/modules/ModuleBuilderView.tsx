import React, { useState } from 'react';
import {
  Plus,
  Layers,
  Check,
  Trash2,
  Boxes,
  Sparkles,
  ArrowRight,
  Sliders,
  Type,
  Calendar,
  ToggleLeft,
  ListFilter,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';
import { CustomFieldDefinition, FieldType } from '../../types/os';

interface ModuleBuilderViewProps {
  onModuleCreated: (newModuleId: string) => void;
}

export const ModuleBuilderView: React.FC<ModuleBuilderViewProps> = ({
  onModuleCreated,
}) => {
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#287BFF');
  const [fields, setFields] = useState<CustomFieldDefinition[]>([
    { id: 'f-name', name: 'title', label: 'Item Name', type: 'text', required: true },
    { id: 'f-cat', name: 'category', label: 'Category', type: 'dropdown', required: false, options: ['Tier 1', 'Tier 2', 'Tier 3'] },
  ]);

  const [currentLabel, setCurrentLabel] = useState('');
  const [currentType, setCurrentType] = useState<FieldType>('text');
  const [currentRequired, setCurrentRequired] = useState(false);
  const [currentOptions, setCurrentOptions] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const addField = () => {
    if (!currentLabel.trim()) return;
    const name = currentLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const optionsArray =
      currentType === 'dropdown'
        ? currentOptions.split(',').map((o) => o.trim()).filter(Boolean)
        : undefined;

    const newField: CustomFieldDefinition = {
      id: `f_${Date.now()}`,
      name,
      label: currentLabel.trim(),
      type: currentType,
      required: currentRequired,
      options: optionsArray,
    };

    setFields([...fields, newField]);
    setCurrentLabel('');
    setCurrentOptions('');
    setCurrentRequired(false);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleSaveModule = () => {
    if (!moduleName.trim() || fields.length === 0) return;
    setSaving(true);

    const slug = moduleName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newModule = StorageEngine.addCustomModule({
      name: moduleName.trim(),
      description: description.trim() || 'User-architected dynamic application module',
      icon: 'Boxes',
      color,
      route_slug: slug,
      sidebar_position: 10,
      is_active: true,
      fields,
    });

    setSuccess(true);
    setTimeout(() => {
      onModuleCreated(`module_${newModule.id}`);
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Dynamic Module Builder
        </h1>
        <p className="text-xs text-muted mt-1">
          Declare custom schema topologies, field constraints & deploy zero-code tables into active navigation.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" /> Custom Module successfully constructed and injected into system navigation!
        </div>
      )}

      {/* Step 1: Module Identity */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-surface-border">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
          <Boxes className="w-4 h-4" /> 1. Module Properties
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-[10px] font-mono uppercase text-muted block mb-1">
              Module Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Asset Track, Cloud Credentials, Fleet Registry"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-muted block mb-1">
              Accent Color
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="#287BFF">Core Blue (#287BFF)</option>
              <option value="#7957FF">Electric Purple (#7957FF)</option>
              <option value="#10B981">Emerald Green (#10B981)</option>
              <option value="#EC4899">Neon Pink (#EC4899)</option>
              <option value="#F59E0B">Amber Gold (#F59E0B)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-muted block mb-1">
            Module Description
          </label>
          <input
            type="text"
            placeholder="Operational purpose and categorization"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Step 2: Custom Field Topologies */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-surface-border">
        <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider font-mono">
          <Sliders className="w-4 h-4" /> 2. Declare Field Schema
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-[10px] font-mono uppercase text-muted block mb-1">
              Field Label *
            </label>
            <input
              type="text"
              placeholder="e.g. Serial Number, Cost"
              value={currentLabel}
              onChange={(e) => setCurrentLabel(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-muted block mb-1">
              Data Type
            </label>
            <select
              value={currentType}
              onChange={(e) => setCurrentType(e.target.value as FieldType)}
              className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="text">String / Text</option>
              <option value="number">Numeric</option>
              <option value="date">Date</option>
              <option value="dropdown">Dropdown Options</option>
              <option value="checkbox">Boolean Flag</option>
              <option value="textarea">Multi-line Text</option>
            </select>
          </div>

          {currentType === 'dropdown' ? (
            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                Options (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Option A, Option B, Option C"
                value={currentOptions}
                onChange={(e) => setCurrentOptions(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="reqCheck"
                checked={currentRequired}
                onChange={(e) => setCurrentRequired(e.target.checked)}
                className="rounded border-surface-border"
              />
              <label htmlFor="reqCheck" className="text-xs text-muted cursor-pointer">
                Mandatory Field
              </label>
            </div>
          )}

          <button
            type="button"
            onClick={addField}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-surface hover:bg-surface-card border border-surface-border rounded-xl text-xs font-semibold text-white transition h-9"
          >
            <Plus className="w-3.5 h-3.5 text-secondary" /> Add Field
          </button>
        </div>

        {/* Configured Fields List */}
        <div className="mt-4 border-t border-surface-border pt-4 space-y-2">
          <div className="text-[10px] uppercase font-mono text-muted">
            Configured Fields ({fields.length})
          </div>
          <div className="space-y-2">
            {fields.map((f, idx) => (
              <div
                key={f.id}
                className="flex justify-between items-center p-3 rounded-xl bg-surface/50 border border-surface-border"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted">#{idx + 1}</span>
                  <span className="font-bold text-xs text-white">{f.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-card border border-surface-border text-accent uppercase">
                    {f.type}
                  </span>
                  {f.required && (
                    <span className="text-[10px] font-mono text-rose-400">Required</span>
                  )}
                  {f.options && (
                    <span className="text-[10px] font-mono text-muted">
                      ({f.options.join(', ')})
                    </span>
                  )}
                </div>

                <button
                  onClick={() => removeField(f.id)}
                  className="text-muted hover:text-rose-400 p-1 rounded-lg transition"
                  title="Remove field"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commit & Deploy Button */}
      <div className="flex justify-end gap-4">
        <button
          disabled={saving || fields.length === 0 || !moduleName.trim()}
          onClick={handleSaveModule}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-glow hover:opacity-95 transition disabled:opacity-40"
        >
          <Layers className="w-4 h-4" />
          {saving ? 'Constructing Runtime Schema...' : 'Deploy Custom Module to OS'}
        </button>
      </div>
    </div>
  );
};
