export type ThemeMode = 'premium-dark' | 'midnight-blue' | 'purple-night' | 'clean-light';
export type LocaleMode = 'en' | 'hi' | 'mr';

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  timezone: string;
  theme_preference: ThemeMode;
  locale: LocaleMode;
  role: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  category: string;
  status: TaskStatus;
  due_date: string;
  created_at: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  color_tag: string;
  updated_at: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: 'Standard' | 'Enterprise' | 'VIP';
  notes: string;
  value_inr: number;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface InventoryItem {
  id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  stock_status: StockStatus;
  supplier: string;
  category: string;
}

export interface FinanceTransaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  transaction_date: string;
  notes?: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  description: string;
  columns: string[];
  records: Record<string, any>[];
  created_at: string;
}

export type FieldType = 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'textarea';

export interface CustomFieldDefinition {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

export interface CustomModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route_slug: string;
  sidebar_position: number;
  is_active: boolean;
  fields: CustomFieldDefinition[];
  created_at: string;
}

export interface CustomModuleRecord {
  id: string;
  module_id: string;
  record_data: Record<string, any>;
  created_at: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AiConversation {
  id: string;
  title: string;
  created_at: string;
  messages: AiChatMessage[];
}

export interface OsNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
}
