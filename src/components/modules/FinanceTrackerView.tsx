import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Plus,
  Download,
  Trash2,
  Filter,
  Search,
  PieChart,
  Calendar,
  Check,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';
import { FinanceTransaction } from '../../types/os';

export const FinanceTrackerView: React.FC = () => {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Transaction Form States
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Operational');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = () => {
    setTransactions(StorageEngine.getTransactions());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sp-life-os-change', loadData);
    return () => window.removeEventListener('sp-life-os-change', loadData);
  }, []);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    StorageEngine.addTransaction({
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category: category.trim() || 'General',
      transaction_date: date || new Date().toISOString().split('T')[0],
      notes: notes.trim(),
    });

    setTitle('');
    setAmount('');
    setNotes('');
    setModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    StorageEngine.deleteTransaction(id);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['ID', 'Title', 'Type', 'Category', 'Amount (INR)', 'Date', 'Notes'];
    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.transaction_date}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `financial_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const netBalance = totalIncome - totalExpense;

  // Category breakdown for expenses
  const categoryExpenses: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + Number(t.amount);
    });

  // Filtered transactions
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Personal Capital & Finance
          </h1>
          <p className="text-xs text-muted mt-1">
            Manual double-entry bookkeeping engine calibrated in Indian Rupee (₹).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-surface-border text-xs font-semibold hover:border-accent/50 text-white transition"
          >
            <Download className="w-4 h-4 text-accent" /> Export Ledger CSV
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary/90 transition"
          >
            <Plus className="w-4 h-4" /> Record Event
          </button>
        </div>
      </div>

      {/* Triple Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold text-muted uppercase">Total Inflow (Revenue)</span>
          <div className="mt-2 text-2xl font-black text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-5 h-5" /> ₹{totalIncome.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-muted mt-1">Client retainers & consulting fees</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold text-muted uppercase">Total Outflow (Burn)</span>
          <div className="mt-2 text-2xl font-black text-rose-400 flex items-center gap-1 font-mono">
            <TrendingDown className="w-5 h-5" /> ₹{totalExpense.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-muted mt-1">Infrastructure, bandwidth & hardware</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold text-muted uppercase">Net Ledger Balance</span>
          <div
            className={`mt-2 text-2xl font-black flex items-center gap-1 font-mono ${
              netBalance >= 0 ? 'text-primary' : 'text-rose-400'
            }`}
          >
            <IndianRupee className="w-5 h-5" /> ₹{netBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-accent mt-1">Verified cash reserve balance</div>
        </div>
      </div>

      {/* Outflow Category Breakdown Bar */}
      {totalExpense > 0 && (
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white uppercase tracking-wider font-mono text-[11px]">
              Expense Categorization Breakdown
            </span>
            <span className="text-muted font-mono text-[10px]">
              Total: ₹{totalExpense.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-surface-card overflow-hidden flex">
            {Object.entries(categoryExpenses).map(([cat, val], idx) => {
              const pct = (val / totalExpense) * 100;
              const colors = ['bg-[#287BFF]', 'bg-[#7957FF]', 'bg-[#10B981]', 'bg-[#F59E0B]', 'bg-[#EC4899]'];
              return (
                <div
                  key={cat}
                  style={{ width: `${pct}%` }}
                  className={`${colors[idx % colors.length]} transition-all`}
                  title={`${cat}: ₹${val.toLocaleString('en-IN')} (${pct.toFixed(1)}%)`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 text-[10px] font-mono text-muted pt-1">
            {Object.entries(categoryExpenses).map(([cat, val], idx) => {
              const colors = ['text-primary', 'text-secondary', 'text-emerald-400', 'text-amber-400', 'text-pink-400'];
              return (
                <div key={cat} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${colors[idx % colors.length]} bg-current`} />
                  <span>{cat}:</span>
                  <span className="font-bold text-white">₹{val.toLocaleString('en-IN')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search transactions by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs w-full text-white focus:outline-none placeholder-muted"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono text-muted">Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-surface-card border border-surface-border text-xs rounded-lg px-2.5 py-1 text-white focus:outline-none"
          >
            <option value="all">All Flows</option>
            <option value="income">Income Only (+)</option>
            <option value="expense">Expense Only (-)</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-surface-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface/90 border-b border-surface-border text-muted font-mono uppercase text-[10px]">
            <tr>
              <th className="p-4">Narrative & Purpose</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Amount (₹)</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-muted">
                  No financial events match your active filters.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-surface-card/60 transition">
                  <td className="p-4 font-semibold text-white">
                    {t.title}
                    {t.notes && (
                      <span className="block text-[10px] text-muted font-normal mt-0.5">
                        {t.notes}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-muted font-mono">{t.category}</td>
                  <td className="p-4 text-muted font-mono">{t.transaction_date}</td>
                  <td className="p-4">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase ${
                        t.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td
                    className={`p-4 text-right font-mono font-bold text-sm ${
                      t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteTransaction(t.id)}
                      className="p-1.5 text-muted hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Record Financial Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-surface-border shadow-2xl bg-[#0A0F1D]">
            <h3 className="text-base font-bold text-white mb-4">Record Financial Transaction</h3>
            <form onSubmit={handleAddTransaction} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Transaction Narrative *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Data Center Cluster Billing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Amount in ₹ *
                  </label>
                  <input
                    type="number"
                    required
                    step="any"
                    placeholder="e.g. 24500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Flow Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="expense">Expense (Outflow)</option>
                    <option value="income">Income (Inflow)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Infrastructure, Legal, Retainer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Accounting Notes / Invoice Ref
                </label>
                <textarea
                  rows={2}
                  placeholder="GST invoice number, receipt links, payment method"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

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
                  Commit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
