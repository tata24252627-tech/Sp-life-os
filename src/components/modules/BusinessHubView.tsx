import React, { useState, useEffect } from 'react';
import {
  Building2,
  Package,
  Plus,
  Trash2,
  Search,
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  Phone,
  Mail,
  Briefcase,
  Users,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';
import { CustomerItem, InventoryItem, StockStatus } from '../../types/os';

export const BusinessHubView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'crm'>('inventory');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // New Item Modal
  const [itemModal, setItemModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('in_stock');
  const [supplier, setSupplier] = useState('');
  const [category, setCategory] = useState('Hardware');

  // New Customer Modal
  const [customerModal, setCustomerModal] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCompany, setCustCompany] = useState('');
  const [custCategory, setCustCategory] = useState<'Standard' | 'Enterprise' | 'VIP'>('Standard');
  const [custNotes, setCustNotes] = useState('');
  const [custValue, setCustValue] = useState('');

  const loadData = () => {
    setInventory(StorageEngine.getInventory());
    setCustomers(StorageEngine.getCustomers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sp-life-os-change', loadData);
    return () => window.removeEventListener('sp-life-os-change', loadData);
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;
    const qty = parseInt(quantity || '0', 10);
    const price = parseFloat(unitPrice || '0');

    let status = stockStatus;
    if (qty === 0) status = 'out_of_stock';
    else if (qty <= 5) status = 'low_stock';

    StorageEngine.addInventory({
      product_name: productName.trim(),
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      quantity: qty,
      unit_price: price,
      stock_status: status,
      supplier: supplier.trim() || 'Global Supplier',
      category: category.trim() || 'Hardware',
    });

    setProductName('');
    setSku('');
    setQuantity('');
    setUnitPrice('');
    setSupplier('');
    setItemModal(false);
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;
    StorageEngine.addCustomer({
      name: custName.trim(),
      email: custEmail.trim(),
      phone: custPhone.trim(),
      company: custCompany.trim(),
      category: custCategory,
      notes: custNotes.trim(),
      value_inr: parseFloat(custValue || '0'),
    });

    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustCompany('');
    setCustNotes('');
    setCustValue('');
    setCustomerModal(false);
  };

  const handleDeleteItem = (id: string) => {
    StorageEngine.deleteInventory(id);
  };

  const handleDeleteCustomer = (id: string) => {
    StorageEngine.deleteCustomer(id);
  };

  // Filters
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = stockFilter === 'all' || item.stock_status === stockFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = inventory.filter((i) => i.stock_status !== 'in_stock');
  const totalInventoryValue = inventory.reduce(
    (acc, curr) => acc + curr.quantity * curr.unit_price,
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Business Hub & Supply Operations
          </h1>
          <p className="text-xs text-muted mt-1">
            Enterprise client CRM portfolio, hardware SKU tracking & inventory value metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'inventory' ? (
            <button
              onClick={() => setItemModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary/90 transition"
            >
              <Plus className="w-4 h-4" /> Add SKU
            </button>
          ) : (
            <button
              onClick={() => setCustomerModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold shadow-glow-purple hover:bg-secondary/90 transition"
            >
              <Plus className="w-4 h-4" /> Add Client Account
            </button>
          )}
        </div>
      </div>

      {/* Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold text-muted uppercase">Total Inventory Value</span>
          <div className="mt-2 text-2xl font-black text-white font-mono flex items-center gap-1">
            <IndianRupee className="w-5 h-5 text-emerald-400" /> ₹{totalInventoryValue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-muted mt-1">{inventory.length} distinct item lines</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold text-muted uppercase">Stock Health Warnings</span>
          <div className="mt-2 text-2xl font-black text-amber-400 font-mono flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {lowStockItems.length} SKUs Low
          </div>
          <div className="text-[10px] text-muted mt-1">
            {lowStockItems.length === 0 ? 'Optimal capacity maintained' : 'Reorders recommended'}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold text-muted uppercase">Active CRM Accounts</span>
          <div className="mt-2 text-2xl font-black text-accent font-mono flex items-center gap-1">
            <Briefcase className="w-5 h-5" /> {customers.length} Accounts
          </div>
          <div className="text-[10px] text-muted mt-1">
            {customers.filter((c) => c.category === 'VIP').length} designated VIP contracts
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'inventory'
                ? 'bg-primary text-white shadow-glow'
                : 'text-muted hover:text-white hover:bg-surface-card'
            }`}
          >
            <Package className="w-4 h-4" /> Hardware & Inventory ({inventory.length})
          </button>
          <button
            onClick={() => setActiveSubTab('crm')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'crm'
                ? 'bg-secondary text-white shadow-glow-purple'
                : 'text-muted hover:text-white hover:bg-surface-card'
            }`}
          >
            <Users className="w-4 h-4" /> Client Portfolio ({customers.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-card border border-surface-border text-xs rounded-xl pl-8 pr-3 py-1.5 text-white focus:outline-none w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      {activeSubTab === 'inventory' && (
        <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface/80 border-b border-surface-border text-muted font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Product Name</th>
                  <th className="px-5 py-3.5">SKU Code</th>
                  <th className="px-5 py-3.5">Quantity</th>
                  <th className="px-5 py-3.5">Unit Price (₹)</th>
                  <th className="px-5 py-3.5">Stock Status</th>
                  <th className="px-5 py-3.5">Supplier</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-card/60 transition">
                    <td className="px-5 py-3.5 font-bold text-white">
                      {item.product_name}
                      <span className="block text-[10px] text-muted font-normal font-mono">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-accent">{item.sku}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      {item.quantity} units
                    </td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-emerald-400">
                      ₹{item.unit_price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          item.stock_status === 'in_stock'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : item.stock_status === 'low_stock'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {item.stock_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{item.supplier}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 text-muted hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                        title="Delete SKU"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRM CLIENTS GRID */}
      {activeSubTab === 'crm' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="glass-panel p-5 rounded-2xl flex flex-col justify-between glass-panel-hover"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border ${
                      cust.category === 'VIP'
                        ? 'bg-secondary/20 text-secondary border-secondary/40'
                        : cust.category === 'Enterprise'
                        ? 'bg-primary/20 text-accent border-primary/40'
                        : 'bg-surface text-muted border-surface-border'
                    }`}
                  >
                    {cust.category}
                  </span>
                  <button
                    onClick={() => handleDeleteCustomer(cust.id)}
                    className="p-1 text-muted hover:text-rose-400 transition"
                    title="Remove client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white">{cust.name}</h3>
                <div className="text-xs text-accent font-semibold flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" /> {cust.company}
                </div>

                <div className="space-y-1.5 mt-4 text-xs text-muted">
                  {cust.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-muted shrink-0" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                  )}
                  {cust.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-muted shrink-0" />
                      <span>{cust.phone}</span>
                    </div>
                  )}
                </div>

                {cust.notes && (
                  <p className="mt-3 text-[11px] text-muted bg-surface/50 p-2 rounded-lg border border-surface-border">
                    {cust.notes}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border flex justify-between items-center text-xs">
                <span className="text-muted font-mono text-[10px]">Retainer Value</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{cust.value_inr ? cust.value_inr.toLocaleString('en-IN') : '0'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {itemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-surface-border shadow-2xl bg-[#0A0F1D]">
            <h3 className="text-base font-bold text-white mb-4">Add Inventory SKU</h3>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Product / Asset Name *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Cisco Gigabit Ethernet Switch"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. SW-10G-01"
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Unit Price (₹)
                  </label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Stock Status
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as any)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Supplier / Vendor
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="e.g. Dell Direct India"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setItemModal(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-surface hover:bg-surface-card text-muted hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs rounded-xl bg-primary text-white font-bold shadow-glow hover:bg-primary/90 transition"
                >
                  Save SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {customerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-surface-border shadow-2xl bg-[#0A0F1D]">
            <h3 className="text-base font-bold text-white mb-4">Add Client Account</h3>
            <form onSubmit={handleAddCustomer} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Company / Entity Name
                </label>
                <input
                  type="text"
                  value={custCompany}
                  onChange={(e) => setCustCompany(e.target.value)}
                  placeholder="e.g. Bharat Data Systems"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Contract Category
                  </label>
                  <select
                    value={custCategory}
                    onChange={(e) => setCustCategory(e.target.value as any)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Retainer Value (₹)
                  </label>
                  <input
                    type="number"
                    value={custValue}
                    onChange={(e) => setCustValue(e.target.value)}
                    placeholder="e.g. 250000"
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Contract Notes
                </label>
                <textarea
                  rows={2}
                  value={custNotes}
                  onChange={(e) => setCustNotes(e.target.value)}
                  placeholder="Key deliverables, SLAs, payment terms"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setCustomerModal(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-surface hover:bg-surface-card text-muted hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs rounded-xl bg-secondary text-white font-bold shadow-glow-purple hover:bg-secondary/90 transition"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
