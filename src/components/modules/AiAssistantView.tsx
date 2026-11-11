import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Zap,
  Layers,
  ArrowRight,
  Database,
  IndianRupee,
  Cpu,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';
import { AiChatMessage } from '../../types/os';

export const AiAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content:
        'Greetings, Architect. I am the SP LIFE OS Core Coprocessor, powered by server-side Gemini 3.8 Flash.\n\nI have real-time visibility into your tenant datasets, deliverables backlog, business CRM, and personal capital ledger in INR (₹). How may I assist your operations today?',
      timestamp: 'Active Now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    {
      title: 'Analyze Inventory & Reorder Risks',
      prompt:
        'Review our current hardware inventory. Identify which items are low in stock or out of stock, and draft a recommended purchase requisition with estimated INR (₹) costs.',
      icon: Layers,
    },
    {
      title: 'Audit Financial Burn Rate & Cashflow',
      prompt:
        'Analyze our recent income inflows vs operational expenses. Calculate our monthly net margin in INR (₹) and recommend 3 cost optimization strategies.',
      icon: IndianRupee,
    },
    {
      title: 'Synthesize Critical Deliverables',
      prompt:
        'Look at our active tasks. Prioritize the urgent deliverables for this week and generate a concise tactical roadmap with risk mitigation steps.',
      icon: Zap,
    },
    {
      title: 'Draft Enterprise Retainer Proposal',
      prompt:
        'Draft a formal, high-impact enterprise SLA and cloud infrastructure retainer agreement proposal for our VIP client Nexus Matrix Technologies.',
      icon: Bot,
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMessage: AiChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setLoading(true);

    // Prepare workspace context to assist coprocessor reasoning
    const tasks = StorageEngine.getTasks();
    const inventory = StorageEngine.getInventory();
    const transactions = StorageEngine.getTransactions();
    const customers = StorageEngine.getCustomers();

    const workspaceContext = {
      tasks_summary: tasks.map((t) => ({ title: t.title, priority: t.priority, status: t.status })),
      inventory_summary: inventory.map((i) => ({ name: i.product_name, qty: i.quantity, status: i.stock_status, price: i.unit_price })),
      finance_summary: {
        recent_transactions: transactions.slice(0, 5).map((t) => ({ title: t.title, amount: t.amount, type: t.type })),
      },
      crm_accounts: customers.map((c) => ({ company: c.company, category: c.category })),
    };

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          context: workspaceContext,
        }),
      });

      const data = await response.json();
      const reply = data.content || data.error || 'No response received from downstream provider.';

      const assistantMessage: AiChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          role: 'assistant',
          content: `Coprocessor Connection Error: ${err?.message || 'Failed to communicate with AI server route.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Conversation history cleared. Workspace memory reset. Ready for your next query.',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] animate-in fade-in duration-200">
      {/* Workspace Header */}
      <div className="flex justify-between items-center pb-4 border-b border-surface-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-secondary to-accent text-white shadow-glow-purple">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">AI Coprocessor Workspace</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary/20 border border-secondary/40 text-secondary">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-muted">
              Secure server proxy inference • Context-aware reasoning across your tenant state
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-border text-xs text-muted hover:text-white hover:bg-surface-card transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
        {/* Quick prompt cards when chat is fresh */}
        {messages.length <= 2 && (
          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3 font-mono">
              Quick Prompt Accelerators
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickPrompts.map((qp, idx) => {
                const Icon = qp.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(qp.prompt)}
                    className="p-3.5 rounded-2xl bg-surface/60 border border-surface-border text-left hover:border-primary/50 hover:bg-surface-card transition group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-surface border border-surface-border text-primary group-hover:bg-primary/20 transition shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-accent transition">
                        {qp.title}
                      </div>
                      <div className="text-[11px] text-muted line-clamp-2 mt-0.5 leading-relaxed">
                        {qp.prompt}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isUser
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-surface border border-secondary/40 text-secondary'
                }`}
              >
                {isUser ? 'SP' : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`relative max-w-2xl rounded-2xl p-4 text-xs leading-relaxed group ${
                  isUser
                    ? 'bg-primary text-white shadow-glow'
                    : 'glass-panel text-slate-100 border border-surface-border'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div
                  className={`flex items-center justify-between gap-4 mt-2 pt-2 border-t text-[10px] font-mono ${
                    isUser
                      ? 'border-white/20 text-white/70'
                      : 'border-surface-border text-muted'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="hover:text-white flex items-center gap-1 transition"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface border border-secondary/40 text-secondary">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-panel p-4 rounded-2xl text-xs text-muted flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
              <span>Analyzing tenant state & computing response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="pt-3 border-t border-surface-border shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder="Ask AI Coprocessor to analyze data, structure tasks, or draft strategies..."
            className="w-full bg-surface-card border border-surface-border rounded-2xl pl-4 pr-12 py-3.5 text-xs text-white placeholder-muted focus:outline-none focus:border-primary transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="absolute right-2.5 p-2 rounded-xl bg-primary text-white disabled:opacity-40 hover:bg-primary/90 shadow-glow transition"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex justify-between items-center px-2 pt-2 text-[10px] text-muted font-mono">
          <span>Trained with SP LIFE OS system directives</span>
          <span>Zero browser key exposure</span>
        </div>
      </div>
    </div>
  );
};
