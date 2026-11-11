import {
  UserProfile,
  TaskItem,
  NoteItem,
  CustomerItem,
  InventoryItem,
  FinanceTransaction,
  DatasetItem,
  CustomModule,
  CustomModuleRecord,
  AiConversation,
  OsNotification,
} from '../types/os';

const STORAGE_KEYS = {
  PROFILE: 'sp_os_profile',
  TASKS: 'sp_os_tasks',
  NOTES: 'sp_os_notes',
  CUSTOMERS: 'sp_os_customers',
  INVENTORY: 'sp_os_inventory',
  TRANSACTIONS: 'sp_os_transactions',
  DATASETS: 'sp_os_datasets',
  CUSTOM_MODULES: 'sp_os_custom_modules',
  CUSTOM_RECORDS: 'sp_os_custom_records',
  AI_CONVERSATIONS: 'sp_os_ai_conversations',
  NOTIFICATIONS: 'sp_os_notifications',
  ONBOARDING_SEEN: 'sp_os_onboarding_completed',
  INITIALIZED: 'sp_os_initialized_v2',
};

// Initial Seed Data
const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_sp_01',
  full_name: 'Sahil Pimparkar',
  username: 'sahil_sp',
  avatar_url: '',
  timezone: 'Asia/Kolkata',
  theme_preference: 'premium-dark',
  locale: 'en',
  role: 'System Architect',
};

const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 'tsk-001',
    title: 'Deploy Enterprise Hybrid Cloud Cluster',
    description: 'Verify node balancing, wireguard gateway encryption, and latency telemetry.',
    priority: 'urgent',
    category: 'Infrastructure',
    status: 'in_progress',
    due_date: '2026-11-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tsk-002',
    title: 'Quarterly Financial Bookkeeping & Tax Audit',
    description: 'Reconcile GST receipts, operational outflows, and software capital balance.',
    priority: 'high',
    category: 'Finance',
    status: 'not_started',
    due_date: '2026-11-20',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tsk-003',
    title: 'Review Client Retainers & VIP Deliverables',
    description: 'Sync with enterprise leads on SLA benchmarks and server scaling agreements.',
    priority: 'medium',
    category: 'Business',
    status: 'completed',
    due_date: '2026-11-10',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tsk-004',
    title: 'Design New Custom Fleet Module Schema',
    description: 'Map vehicle tracking fields, maintenance dates, and driver assignment tables.',
    priority: 'low',
    category: 'Development',
    status: 'in_progress',
    due_date: '2026-11-25',
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'not-001',
    title: 'Core System Architectural Principles',
    content: `1. Fortified isolation through strict tenant compartmentalization.\n2. In-memory and client-side processing first for zero latency.\n3. Transparent double-entry capital tracking in INR (₹).\n4. Scalable schema topographies with zero application downtime.`,
    category: 'Architecture',
    is_pinned: true,
    color_tag: '#287BFF',
    updated_at: '2026-11-10 14:30',
  },
  {
    id: 'not-002',
    title: 'AI Prompt Engineering Directives',
    content: `When analyzing tabular datasets, always extract row counts, check for null anomalies, calculate sum/average on numeric columns, and propose 3 operational action items.`,
    category: 'AI Assistant',
    is_pinned: true,
    color_tag: '#7957FF',
    updated_at: '2026-11-09 18:15',
  },
  {
    id: 'not-003',
    title: 'Meeting Notes: Enterprise Infrastructure SLA',
    content: `Client requested 99.99% uptime guarantee with automated multi-zone failover. Add alerts for memory saturation > 85%.`,
    category: 'Client',
    is_pinned: false,
    color_tag: '#10B981',
    updated_at: '2026-11-08 11:00',
  },
];

const DEFAULT_CUSTOMERS: CustomerItem[] = [
  {
    id: 'cst-001',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@nexusmatrix.in',
    phone: '+91 98201 44521',
    company: 'Nexus Matrix Technologies',
    category: 'VIP',
    notes: 'Primary enterprise contract for dedicated compute clusters.',
    value_inr: 450000,
  },
  {
    id: 'cst-002',
    name: 'Priya Sharma',
    email: 'priya@quantumfintech.io',
    phone: '+91 97112 88390',
    company: 'Quantum FinTech Labs',
    category: 'Enterprise',
    notes: 'Annual software retainer and cloud security auditing.',
    value_inr: 280000,
  },
  {
    id: 'cst-003',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@deshmukhlogistics.com',
    phone: '+91 94220 19302',
    company: 'Deshmukh Logistics Ltd',
    category: 'Standard',
    notes: 'Fleet tracking and inventory synchronization integration.',
    value_inr: 120000,
  },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-001',
    product_name: 'Enterprise Server Node X9',
    sku: 'SRV-X9-PRO',
    quantity: 14,
    unit_price: 45000,
    stock_status: 'in_stock',
    supplier: 'Apex Silicon Global',
    category: 'Infrastructure',
  },
  {
    id: 'inv-002',
    product_name: 'Fiber Gateway Switch 10G',
    sku: 'NET-SW-10G',
    quantity: 3,
    unit_price: 18500,
    stock_status: 'low_stock',
    supplier: 'Cisco Distro India',
    category: 'Networking',
  },
  {
    id: 'inv-003',
    product_name: 'Hardware Security Key Token',
    sku: 'SEC-U2F-HW',
    quantity: 45,
    unit_price: 2400,
    stock_status: 'in_stock',
    supplier: 'Yubico Partner Network',
    category: 'Security',
  },
  {
    id: 'inv-004',
    product_name: 'Redundant Power Supply 1200W',
    sku: 'PWR-1200-HOT',
    quantity: 0,
    unit_price: 8900,
    stock_status: 'out_of_stock',
    supplier: 'Delta Electronics',
    category: 'Hardware',
  },
];

const DEFAULT_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: 'tx-001',
    title: 'Enterprise Software Retainer Payment',
    amount: 145000,
    type: 'income',
    category: 'Client Revenue',
    transaction_date: '2026-11-09',
    notes: 'Received via NEFT from Nexus Matrix',
  },
  {
    id: 'tx-002',
    title: 'Cloud Cluster & Data Center Bandwidth',
    amount: 32400,
    type: 'expense',
    category: 'Infrastructure',
    transaction_date: '2026-11-08',
    notes: 'Monthly billing for primary rack',
  },
  {
    id: 'tx-003',
    title: 'High-Speed Fiber Leased Line',
    amount: 6500,
    type: 'expense',
    category: 'Utilities',
    transaction_date: '2026-11-06',
    notes: '1 Gbps dedicated uplink',
  },
  {
    id: 'tx-004',
    title: 'DevOps Automation Consulting Fee',
    amount: 60000,
    type: 'income',
    category: 'Consulting',
    transaction_date: '2026-11-05',
    notes: 'Architecture advisory milestone',
  },
  {
    id: 'tx-005',
    title: 'Hardware Spares & NVMe Drive Array',
    amount: 18200,
    type: 'expense',
    category: 'Hardware',
    transaction_date: '2026-11-02',
    notes: '4x 2TB Gen4 Enterprise NVMe',
  },
];

const DEFAULT_DATASETS: DatasetItem[] = [
  {
    id: 'ds-001',
    name: 'Infrastructure Asset Telemetry',
    description: 'Data center servers, switch topology, and current operational states.',
    columns: ['ID', 'Asset Name', 'Rack Unit', 'IP Address', 'Status', 'Monthly Cost'],
    records: [
      {
        'ID': 'REC-001',
        'Asset Name': 'Enterprise Server Node Alpha',
        'Rack Unit': 'U12-U14',
        'IP Address': '10.0.12.1',
        'Status': 'Operational',
        'Monthly Cost': '₹45,000',
      },
      {
        'ID': 'REC-002',
        'Asset Name': 'Fiber Gateway Switch Primary',
        'Rack Unit': 'U01',
        'IP Address': '10.0.0.1',
        'Status': 'Operational',
        'Monthly Cost': '₹18,500',
      },
      {
        'ID': 'REC-003',
        'Asset Name': 'Secondary Storage Array SAS',
        'Rack Unit': 'U20-U24',
        'IP Address': '10.0.20.1',
        'Status': 'Pending Sync',
        'Monthly Cost': '₹32,000',
      },
      {
        'ID': 'REC-004',
        'Asset Name': 'Border Firewall Appliance',
        'Rack Unit': 'U02',
        'IP Address': '192.168.1.1',
        'Status': 'Operational',
        'Monthly Cost': '₹12,400',
      },
    ],
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_CUSTOM_MODULES: CustomModule[] = [
  {
    id: 'mod_fleet_01',
    name: 'Fleet & Vehicle Registry',
    description: 'Track corporate vehicles, maintenance schedules, and designated drivers.',
    icon: 'Truck',
    color: '#287BFF',
    route_slug: 'fleet-registry',
    sidebar_position: 1,
    is_active: true,
    fields: [
      { id: 'f1', name: 'vehicle_plate', label: 'License Plate No.', type: 'text', required: true },
      { id: 'f2', name: 'model', label: 'Vehicle Model', type: 'text', required: true },
      { id: 'f3', name: 'driver_name', label: 'Assigned Driver', type: 'text', required: false },
      { id: 'f4', name: 'odometer_km', label: 'Odometer (KM)', type: 'number', required: false },
      { id: 'f5', name: 'service_due', label: 'Next Service Date', type: 'date', required: false },
      { id: 'f6', name: 'is_active', label: 'In Active Service', type: 'checkbox', required: false },
    ],
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_CUSTOM_RECORDS: CustomModuleRecord[] = [
  {
    id: 'rec_fl_01',
    module_id: 'mod_fleet_01',
    record_data: {
      vehicle_plate: 'MH-12-AB-9090',
      model: 'Tata Nexon EV Max',
      driver_name: 'Suresh Patil',
      odometer_km: '34,250',
      service_due: '2026-12-10',
      is_active: true,
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'rec_fl_02',
    module_id: 'mod_fleet_01',
    record_data: {
      vehicle_plate: 'MH-14-GH-4411',
      model: 'Mahindra Scorpio-N',
      driver_name: 'Anil Kadam',
      odometer_km: '52,100',
      service_due: '2026-11-28',
      is_active: true,
    },
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_NOTIFICATIONS: OsNotification[] = [
  {
    id: 'notif-1',
    title: 'SP LIFE OS Initialized',
    message: 'Ultimate Edition operational with fortified isolation and dynamic module runtime.',
    type: 'success',
    timestamp: 'Just now',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert',
    message: 'Fiber Gateway Switch 10G has dropped below reorder threshold (3 units remaining).',
    type: 'alert',
    timestamp: '1 hour ago',
    read: false,
  },
];

// Helper to dispatch OS-wide synchronization events
function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sp-life-os-change'));
  }
}

export const StorageEngine = {
  initialize() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(DEFAULT_NOTES));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS));
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(DEFAULT_INVENTORY));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
      localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(DEFAULT_DATASETS));
      localStorage.setItem(STORAGE_KEYS.CUSTOM_MODULES, JSON.stringify(DEFAULT_CUSTOM_MODULES));
      localStorage.setItem(STORAGE_KEYS.CUSTOM_RECORDS, JSON.stringify(DEFAULT_CUSTOM_RECORDS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  },

  // Onboarding
  isOnboardingCompleted(): boolean {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN) === 'true';
  },

  setOnboardingCompleted(val: boolean) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, val ? 'true' : 'false');
    notifyChange();
  },

  // Profile
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  updateProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    // Apply theme attribute to root
    if (typeof document !== 'undefined' && updated.theme_preference) {
      document.documentElement.setAttribute('data-theme', updated.theme_preference);
    }
    notifyChange();
    return updated;
  },

  // Tasks
  getTasks(): TaskItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },

  addTask(task: Omit<TaskItem, 'id' | 'created_at'>): TaskItem {
    const tasks = this.getTasks();
    const newTask: TaskItem = {
      ...task,
      id: `tsk-${Date.now().toString().slice(-5)}`,
      created_at: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    notifyChange();
    return newTask;
  },

  updateTask(id: string, updates: Partial<TaskItem>): TaskItem | null {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    notifyChange();
    return tasks[idx];
  },

  toggleTask(id: string): TaskItem | null {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const current = tasks[idx];
    const newStatus = current.status === 'completed' ? 'in_progress' : 'completed';
    tasks[idx] = { ...current, status: newStatus };
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    notifyChange();
    return tasks[idx];
  },

  deleteTask(id: string) {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    notifyChange();
  },

  // Notes
  getNotes(): NoteItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  },

  addNote(note: Omit<NoteItem, 'id' | 'updated_at'>): NoteItem {
    const notes = this.getNotes();
    const newNote: NoteItem = {
      ...note,
      id: `not-${Date.now().toString().slice(-5)}`,
      updated_at: new Date().toLocaleString(),
    };
    notes.unshift(newNote);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    notifyChange();
    return newNote;
  },

  updateNote(id: string, updates: Partial<NoteItem>): NoteItem | null {
    const notes = this.getNotes();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    notes[idx] = { ...notes[idx], ...updates, updated_at: new Date().toLocaleString() };
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    notifyChange();
    return notes[idx];
  },

  deleteNote(id: string) {
    const notes = this.getNotes().filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    notifyChange();
  },

  togglePinNote(id: string) {
    const notes = this.getNotes();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx !== -1) {
      notes[idx].is_pinned = !notes[idx].is_pinned;
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      notifyChange();
    }
  },

  // Customers
  getCustomers(): CustomerItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : DEFAULT_CUSTOMERS;
    } catch {
      return DEFAULT_CUSTOMERS;
    }
  },

  addCustomer(customer: Omit<CustomerItem, 'id'>): CustomerItem {
    const customers = this.getCustomers();
    const newCust: CustomerItem = {
      ...customer,
      id: `cst-${Date.now().toString().slice(-5)}`,
    };
    customers.unshift(newCust);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    notifyChange();
    return newCust;
  },

  deleteCustomer(id: string) {
    const customers = this.getCustomers().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    notifyChange();
  },

  // Inventory
  getInventory(): InventoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return data ? JSON.parse(data) : DEFAULT_INVENTORY;
    } catch {
      return DEFAULT_INVENTORY;
    }
  },

  addInventory(item: Omit<InventoryItem, 'id'>): InventoryItem {
    const inventory = this.getInventory();
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now().toString().slice(-5)}`,
    };
    inventory.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    notifyChange();
    return newItem;
  },

  updateInventory(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const inventory = this.getInventory();
    const idx = inventory.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    inventory[idx] = { ...inventory[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    notifyChange();
    return inventory[idx];
  },

  deleteInventory(id: string) {
    const inventory = this.getInventory().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    notifyChange();
  },

  // Finance Transactions
  getTransactions(): FinanceTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : DEFAULT_TRANSACTIONS;
    } catch {
      return DEFAULT_TRANSACTIONS;
    }
  },

  addTransaction(tx: Omit<FinanceTransaction, 'id'>): FinanceTransaction {
    const transactions = this.getTransactions();
    const newTx: FinanceTransaction = {
      ...tx,
      id: `tx-${Date.now().toString().slice(-5)}`,
    };
    transactions.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    notifyChange();
    return newTx;
  },

  deleteTransaction(id: string) {
    const transactions = this.getTransactions().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    notifyChange();
  },

  // Datasets
  getDatasets(): DatasetItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DATASETS);
      return data ? JSON.parse(data) : DEFAULT_DATASETS;
    } catch {
      return DEFAULT_DATASETS;
    }
  },

  saveDataset(dataset: DatasetItem) {
    const datasets = this.getDatasets();
    const idx = datasets.findIndex((d) => d.id === dataset.id);
    if (idx >= 0) {
      datasets[idx] = dataset;
    } else {
      datasets.unshift(dataset);
    }
    localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
    notifyChange();
  },

  deleteDataset(id: string) {
    const datasets = this.getDatasets().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
    notifyChange();
  },

  // Custom Modules
  getCustomModules(): CustomModule[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_MODULES);
      return data ? JSON.parse(data) : DEFAULT_CUSTOM_MODULES;
    } catch {
      return DEFAULT_CUSTOM_MODULES;
    }
  },

  addCustomModule(moduleData: Omit<CustomModule, 'id' | 'created_at'>): CustomModule {
    const modules = this.getCustomModules();
    const newMod: CustomModule = {
      ...moduleData,
      id: `mod_${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
    };
    modules.push(newMod);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_MODULES, JSON.stringify(modules));
    notifyChange();
    return newMod;
  },

  deleteCustomModule(id: string) {
    const modules = this.getCustomModules().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_MODULES, JSON.stringify(modules));
    // Also remove records
    const records = this.getAllCustomRecords().filter((r) => r.module_id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_RECORDS, JSON.stringify(records));
    notifyChange();
  },

  // Custom Records
  getAllCustomRecords(): CustomModuleRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_RECORDS);
      return data ? JSON.parse(data) : DEFAULT_CUSTOM_RECORDS;
    } catch {
      return DEFAULT_CUSTOM_RECORDS;
    }
  },

  getCustomModuleRecords(moduleId: string): CustomModuleRecord[] {
    return this.getAllCustomRecords().filter((r) => r.module_id === moduleId);
  },

  addCustomModuleRecord(moduleId: string, recordData: Record<string, any>): CustomModuleRecord {
    const records = this.getAllCustomRecords();
    const newRec: CustomModuleRecord = {
      id: `rec_${Date.now().toString().slice(-6)}`,
      module_id: moduleId,
      record_data: recordData,
      created_at: new Date().toISOString(),
    };
    records.unshift(newRec);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_RECORDS, JSON.stringify(records));
    notifyChange();
    return newRec;
  },

  deleteCustomModuleRecord(recordId: string) {
    const records = this.getAllCustomRecords().filter((r) => r.id !== recordId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_RECORDS, JSON.stringify(records));
    notifyChange();
  },

  // Notifications
  getNotifications(): OsNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  },

  markNotificationsRead() {
    const notifs = this.getNotifications().map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    notifyChange();
  },

  clearNotifications() {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    notifyChange();
  },

  // Export & Backup
  exportAllData(): string {
    const dump = {
      profile: this.getProfile(),
      tasks: this.getTasks(),
      notes: this.getNotes(),
      customers: this.getCustomers(),
      inventory: this.getInventory(),
      transactions: this.getTransactions(),
      datasets: this.getDatasets(),
      custom_modules: this.getCustomModules(),
      custom_records: this.getAllCustomRecords(),
      exported_at: new Date().toISOString(),
      system_version: 'SP LIFE OS 2026 Ultimate',
    };
    return JSON.stringify(dump, null, 2);
  },

  importAllData(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      if (data.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks));
      if (data.notes) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
      if (data.customers) localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(data.customers));
      if (data.inventory) localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(data.inventory));
      if (data.transactions) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
      if (data.datasets) localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(data.datasets));
      if (data.custom_modules) localStorage.setItem(STORAGE_KEYS.CUSTOM_MODULES, JSON.stringify(data.custom_modules));
      if (data.custom_records) localStorage.setItem(STORAGE_KEYS.CUSTOM_RECORDS, JSON.stringify(data.custom_records));
      notifyChange();
      return true;
    } catch {
      return false;
    }
  },

  resetToDefaults() {
    localStorage.clear();
    this.initialize();
    notifyChange();
  },
};
