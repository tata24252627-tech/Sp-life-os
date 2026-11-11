import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Pin,
  Plus,
  Trash2,
  Calendar,
  ListTodo,
  FileText,
  Search,
  Filter,
  Check,
  CalendarDays,
  Tag,
} from 'lucide-react';
import { StorageEngine } from '../../lib/storage';
import { TaskItem, NoteItem, TaskPriority, TaskStatus } from '../../types/os';

export const DailyWorkView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes' | 'calendar'>('tasks');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [taskSearch, setTaskSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New Task Modal
  const [taskModal, setTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskCategory, setTaskCategory] = useState('General');
  const [taskDueDate, setTaskDueDate] = useState('');

  // New Note Modal
  const [noteModal, setNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('General');
  const [noteColor, setNoteColor] = useState('#287BFF');

  const loadData = () => {
    setTasks(StorageEngine.getTasks());
    setNotes(StorageEngine.getNotes());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sp-life-os-change', loadData);
    return () => window.removeEventListener('sp-life-os-change', loadData);
  }, []);

  const handleToggleTask = (id: string) => {
    StorageEngine.toggleTask(id);
  };

  const handleDeleteTask = (id: string) => {
    StorageEngine.deleteTask(id);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    StorageEngine.addTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      priority: taskPriority,
      category: taskCategory.trim() || 'General',
      status: 'not_started',
      due_date: taskDueDate || new Date().toISOString().split('T')[0],
    });
    setTaskTitle('');
    setTaskDesc('');
    setTaskDueDate('');
    setTaskModal(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    StorageEngine.addNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory.trim() || 'General',
      is_pinned: false,
      color_tag: noteColor,
    });
    setNoteTitle('');
    setNoteContent('');
    setNoteModal(false);
  };

  const handleTogglePinNote = (id: string) => {
    StorageEngine.togglePinNote(id);
  };

  const handleDeleteNote = (id: string) => {
    StorageEngine.deleteNote(id);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(taskSearch.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const priorityBadgeStyle: Record<string, string> = {
    urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    medium: 'bg-primary/10 text-accent border-primary/30',
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };

  const statusBadgeStyle: Record<string, string> = {
    not_started: 'bg-surface border-surface-border text-muted',
    in_progress: 'bg-primary/10 border-primary/30 text-accent',
    completed: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    on_hold: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">My Daily Work</h1>
          <p className="text-xs text-muted mt-1">
            Task deliverables, strategic pinned notes & synchronized calendar matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'tasks' ? (
            <button
              onClick={() => setTaskModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary/90 transition"
            >
              <Plus className="w-4 h-4" /> New Deliverable
            </button>
          ) : activeTab === 'notes' ? (
            <button
              onClick={() => setNoteModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold shadow-glow-purple hover:bg-secondary/90 transition"
            >
              <Plus className="w-4 h-4" /> New Memo
            </button>
          ) : null}
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'tasks'
              ? 'bg-primary text-white shadow-glow'
              : 'text-muted hover:text-white hover:bg-surface-card'
          }`}
        >
          <ListTodo className="w-4 h-4" /> Deliverables ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'notes'
              ? 'bg-secondary text-white shadow-glow-purple'
              : 'text-muted hover:text-white hover:bg-surface-card'
          }`}
        >
          <FileText className="w-4 h-4" /> Rich Notes ({notes.length})
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'calendar'
              ? 'bg-surface border border-primary/40 text-accent'
              : 'text-muted hover:text-white hover:bg-surface-card'
          }`}
        >
          <Calendar className="w-4 h-4" /> Timeline Matrix
        </button>
      </div>

      {/* TASKS VIEW */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search deliverables by name, description, category..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="bg-transparent border-none text-xs w-full text-white focus:outline-none placeholder-muted"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-muted">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-surface-card border border-surface-border text-xs rounded-lg px-2.5 py-1 text-white focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-muted">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-card border border-surface-border text-xs rounded-lg px-2.5 py-1 text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="glass-panel p-12 text-center text-xs text-muted rounded-2xl">
                No deliverables match your active search filters.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel-hover"
                  >
                    <div className="flex items-start gap-3 overflow-hidden">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`mt-0.5 h-5 w-5 rounded-lg border flex items-center justify-center shrink-0 transition ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-surface-border hover:border-primary'
                        }`}
                        title={isCompleted ? 'Mark in progress' : 'Mark completed'}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <div>
                        <h3
                          className={`text-xs font-bold ${
                            isCompleted ? 'line-through text-muted' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-[11px] text-muted mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surface-border text-muted flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> {task.category}
                          </span>
                          {task.due_date && (
                            <span className="text-[10px] font-mono text-muted flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> Due {task.due_date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span
                        className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${
                          priorityBadgeStyle[task.priority] || priorityBadgeStyle.medium
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${
                          statusBadgeStyle[task.status] || statusBadgeStyle.not_started
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-muted hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                        title="Delete deliverable"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* NOTES VIEW */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="glass-panel p-5 rounded-2xl flex flex-col justify-between glass-panel-hover relative overflow-hidden"
            >
              {/* Note color bar accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: note.color_tag || '#287BFF' }}
              />

              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface border border-surface-border text-accent">
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePinNote(note.id)}
                      className={`p-1 rounded-lg transition ${
                        note.is_pinned
                          ? 'text-primary bg-primary/10'
                          : 'text-muted hover:text-white'
                      }`}
                      title={note.is_pinned ? 'Unpin note' : 'Pin note'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-muted hover:text-rose-400 rounded-lg transition"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-xs text-white mb-2">{note.title}</h3>
                <p className="text-[11px] text-muted whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border text-[9px] text-muted font-mono flex justify-between items-center">
                <span>Updated: {note.updated_at}</span>
                {note.is_pinned && (
                  <span className="text-primary font-bold">PINNED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TIMELINE / CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Scheduled Deliverables Timeline
              </h2>
            </div>
            <span className="text-[10px] text-muted font-mono">
              Month of November 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-surface/60 border border-surface-border space-y-2 hover:border-primary/40 transition"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-accent flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.due_date}
                  </span>
                  <span
                    className={`uppercase px-1.5 py-0.5 rounded ${
                      priorityBadgeStyle[task.priority] || priorityBadgeStyle.medium
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate">{task.title}</div>
                <div className="text-[10px] text-muted">{task.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {taskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-surface-border shadow-2xl bg-[#0A0F1D]">
            <h3 className="text-base font-bold text-white mb-4">Add Task Deliverable</h3>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Deliverable Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Wireguard mesh node testing"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Operational details and completion criteria"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    placeholder="e.g. Infrastructure, Finance"
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Target Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setTaskModal(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-surface hover:bg-surface-card text-muted hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs rounded-xl bg-primary text-white font-bold shadow-glow hover:bg-primary/90 transition"
                >
                  Commit Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {noteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-surface-border shadow-2xl bg-[#0A0F1D]">
            <h3 className="text-base font-bold text-white mb-4">Create Strategic Note</h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Cluster Scaling Directives"
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                  Content
                </label>
                <textarea
                  rows={5}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Document architectural principles, meeting takeaways, or code snippets..."
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    placeholder="e.g. Architecture, Security"
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-muted block mb-1">
                    Accent Color
                  </label>
                  <select
                    value={noteColor}
                    onChange={(e) => setNoteColor(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="#287BFF">Blue (Core)</option>
                    <option value="#7957FF">Purple (Strategic)</option>
                    <option value="#10B981">Emerald (Verified)</option>
                    <option value="#F59E0B">Amber (Review)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setNoteModal(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-surface hover:bg-surface-card text-muted hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs rounded-xl bg-secondary text-white font-bold shadow-glow-purple hover:bg-secondary/90 transition"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
