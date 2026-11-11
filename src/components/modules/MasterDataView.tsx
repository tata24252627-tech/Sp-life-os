import React, { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Plus,
  Search,
  Table as TableIcon,
  Database,
  FileSpreadsheet,
  Check,
  AlertCircle,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';
import { DatasetItem } from '../../types/os';

export const MasterDataView: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newRowModal, setNewRowModal] = useState(false);
  const [newDatasetModal, setNewDatasetModal] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState('');
  const [newDatasetDesc, setNewDatasetDesc] = useState('');
  const [newRowValues, setNewRowValues] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const loadDatasets = () => {
    const list = StorageEngine.getDatasets();
    setDatasets(list);
    if (list.length > 0 && !selectedDatasetId) {
      setSelectedDatasetId(list[0].id);
    }
  };

  useEffect(() => {
    loadDatasets();
    window.addEventListener('sp-life-os-change', loadDatasets);
    return () => window.removeEventListener('sp-life-os-change', loadDatasets);
  }, []);

  const activeDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0];

  const triggerNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // CSV Import Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
        if (lines.length < 2) {
          triggerNotice('CSV must contain header row and at least one data row.');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const records = lines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const rowObj: Record<string, any> = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx] ?? '';
          });
          return rowObj;
        });

        const newDs: DatasetItem = {
          id: `ds_${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          description: `Imported from ${file.name} on ${new Date().toLocaleDateString()}`,
          columns: headers,
          records,
          created_at: new Date().toISOString(),
        };

        StorageEngine.saveDataset(newDs);
        setSelectedDatasetId(newDs.id);
        triggerNotice(`Successfully ingested ${records.length} records into new dataset.`);
      } catch (err: any) {
        triggerNotice(`Failed to parse CSV file: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // CSV Export Generator
  const handleExportCSV = () => {
    if (!activeDataset || activeDataset.records.length === 0) {
      triggerNotice('No data rows to export.');
      return;
    }

    const headers = activeDataset.columns;
    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...activeDataset.records.map((row) =>
        headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeDataset.name.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotice('CSV dataset downloaded successfully.');
  };

  // Add Row
  const handleOpenAddRow = () => {
    if (!activeDataset) return;
    const initial: Record<string, string> = {};
    activeDataset.columns.forEach((col) => {
      initial[col] = '';
    });
    setNewRowValues(initial);
    setNewRowModal(true);
  };

  const handleCommitRow = () => {
    if (!activeDataset) return;
    const updatedRecords = [...activeDataset.records, newRowValues];
    const updatedDs = { ...activeDataset, records: updatedRecords };
    StorageEngine.saveDataset(updatedDs);
    setNewRowModal(false);
    triggerNotice('New record appended to dataset.');
  };

  // Delete Row
  const handleDeleteRow = (index: number) => {
    if (!activeDataset) return;
    const updated = activeDataset.records.filter((_, idx) => idx !== index);
    const updatedDs = { ...activeDataset, records: updated };
    StorageEngine.saveDataset(updatedDs);
    triggerNotice('Record removed from dataset.');
  };

  // Create New Empty Dataset
  const handleCreateDataset = () => {
    if (!newDatasetName.trim()) return;
    const newDs: DatasetItem = {
      id: `ds_${Date.now()}`,
      name: newDatasetName,
      description: newDatasetDesc || 'Custom defined tabular dataset',
      columns: ['ID', 'Title', 'Category', 'Status', 'Notes'],
      records: [
        { ID: 'REC-001', Title: 'Initial Entry', Category: 'General', Status: 'Active', Notes: 'Initialized' },
      ],
      created_at: new Date().toISOString(),
    };
    StorageEngine.saveDataset(newDs);
    setSelectedDatasetId(newDs.id);
    setNewDatasetModal(false);
    setNewDatasetName('');
    setNewDatasetDesc('');
    triggerNotice('New dataset schema registered.');
  };

  // Filter rows
  const filteredRecords = activeDataset
    ? activeDataset.records.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Notice Banner */}
      {notification && (
        <div className="p-3.5 rounded-xl border border-primary/40 bg-primary/10 text-accent text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" /> {notification}
          </span>
          <button onClick={() => setNotification(null)} className="text-muted hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Master Data Management
          </h1>
          <p className="text-xs text-muted mt-1">
            High-throughput tabular data storage engine, real-time search & CSV interchange.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* File Upload Button */}
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-surface-border text-xs font-semibold hover:border-primary/50 text-white cursor-pointer transition">
            <Upload className="w-4 h-4 text-primary" /> Import CSV
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-surface-border text-xs font-semibold hover:border-accent/50 text-white transition"
          >
            <Download className="w-4 h-4 text-accent" /> Export CSV
          </button>

          {/* Add Row Button */}
          <button
            onClick={handleOpenAddRow}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary/90 transition"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>

          {/* Add New Dataset */}
          <button
            onClick={() => setNewDatasetModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-card border border-secondary/40 text-xs font-semibold text-secondary hover:bg-secondary/10 transition"
          >
            <Database className="w-3.5 h-3.5" /> New Dataset
          </button>
        </div>
      </div>

      {/* Dataset Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {datasets.map((ds) => (
          <button
            key={ds.id}
            onClick={() => setSelectedDatasetId(ds.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
              selectedDatasetId === ds.id
                ? 'bg-primary text-white shadow-glow'
                : 'bg-surface/60 text-muted hover:bg-surface-card hover:text-white border border-surface-border'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{ds.name}</span>
            <span className="text-[10px] font-mono opacity-70">
              ({ds.records.length})
            </span>
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          placeholder="Filter grid across any dimension (ID, Asset, Status, Value, IP)..."
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

      {/* Spreadsheet Tabular View */}
      <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
        {!activeDataset || activeDataset.records.length === 0 ? (
          <div className="p-16 text-center text-muted text-xs">
            <TableIcon className="w-10 h-10 mx-auto mb-3 opacity-40 text-primary" />
            <p className="font-semibold text-white">No records present in this dataset</p>
            <p className="mt-1">Upload a CSV file or append records manually using the buttons above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface/90 border-b border-surface-border text-muted uppercase font-mono tracking-wider text-[11px]">
                <tr>
                  {activeDataset.columns.map((col) => (
                    <th key={col} className="px-5 py-3.5 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredRecords.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-surface-card/70 transition group"
                  >
                    {activeDataset.columns.map((col) => (
                      <td
                        key={col}
                        className="px-5 py-3.5 font-medium whitespace-nowrap text-slate-200"
                      >
                        {col.toLowerCase().includes('status') ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              String(row[col]).toLowerCase().includes('op') ||
                              String(row[col]).toLowerCase().includes('act')
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {row[col]}
                          </span>
                        ) : col.toLowerCase().includes('cost') || col.toLowerCase().includes('value') ? (
                          <span className="font-mono text-emerald-400 font-semibold">
                            {row[col]}
                          </span>
                        ) : (
                          row[col]
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteRow(idx)}
                        className="text-muted hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition"
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

      {/* Add Row Modal */}
      {newRowModal && activeDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-surface-border shadow-2xl bg-[#0A0F1D]">
            <h3 className="text-base font-bold text-white mb-2">Add Dataset Record</h3>
            <p className="text-xs text-muted mb-4">
              Appending new entity to <span className="text-accent">{activeDataset.name}</span>.
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {activeDataset.columns.map((col) => (
                <div key={col}>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    {col}
                  </label>
                  <input
                    type="text"
                    value={newRowValues[col] || ''}
                    onChange={(e) =>
                      setNewRowValues({ ...newRowValues, [col]: e.target.value })
                    }
                    placeholder={`Enter ${col}...`}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-surface-border">
              <button
                onClick={() => setNewRowModal(false)}
                className="px-4 py-2 text-xs rounded-xl bg-surface hover:bg-surface-card text-muted hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCommitRow}
                className="px-5 py-2 text-xs rounded-xl bg-primary text-white font-bold shadow-glow hover:bg-primary/90 transition"
              >
                Commit Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Dataset Modal */}
      {newDatasetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-surface-border shadow-2xl bg-[#0A0F1D]">
            <h3 className="text-base font-bold text-white mb-2">Create New Dataset</h3>
            <p className="text-xs text-muted mb-4">
              Initialize a new table schema within Master Data storage.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Dataset Name
                </label>
                <input
                  type="text"
                  value={newDatasetName}
                  onChange={(e) => setNewDatasetName(e.target.value)}
                  placeholder="e.g. Client Accounts, Hardware Telemetry"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newDatasetDesc}
                  onChange={(e) => setNewDatasetDesc(e.target.value)}
                  placeholder="Summary of this table scope"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-surface-border">
              <button
                onClick={() => setNewDatasetModal(false)}
                className="px-4 py-2 text-xs rounded-xl bg-surface hover:bg-surface-card text-muted hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDataset}
                className="px-5 py-2 text-xs rounded-xl bg-secondary text-white font-bold shadow-glow-purple hover:bg-secondary/90 transition"
              >
                Initialize Dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
