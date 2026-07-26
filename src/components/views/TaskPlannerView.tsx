import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  AlertCircle,
  Search,
  X,
  CheckCircle2,
  Flag,
} from 'lucide-react';
import { Task, TaskPriority } from '../../types';
import { api } from '../../lib/api';

export function TaskPlannerView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<'today' | 'upcoming' | 'completed'>('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);
      const list = await api.getTasks();
      setTasks(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError('Failed to fetch tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCreateModal = () => {
    setEditingTaskId(null);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setDueDate(task.dueDate || new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    try {
      setSaving(true);
      setError(null);
      if (editingTaskId) {
        const updated = await api.updateTask(editingTaskId, {
          title: title.trim(),
          description: description.trim(),
          priority,
          dueDate,
        });
        setTasks((prev) => (Array.isArray(prev) ? prev : []).map((t) => (t.id === editingTaskId ? updated : t)));
      } else {
        const created = await api.createTask({
          title: title.trim(),
          description: description.trim(),
          priority,
          dueDate,
        });
        setTasks((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError('Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      setError(null);
      const updated = await api.updateTask(task.id, { completed: !task.completed });
      setTasks((prev) => (Array.isArray(prev) ? prev : []).map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setError('Failed to update task completion');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setError(null);
      await api.deleteTask(id);
      setTasks((prev) => (Array.isArray(prev) ? prev : []).filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const todayCount = tasks.filter((t) => (t.dueDate <= todayStr || !t.dueDate) && !t.completed).length;
  const upcomingCount = tasks.filter((t) => t.dueDate > todayStr && !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'today') {
      return (t.dueDate <= todayStr || !t.dueDate) && !t.completed;
    } else if (activeFilter === 'upcoming') {
      return t.dueDate > todayStr && !t.completed;
    } else if (activeFilter === 'completed') {
      return t.completed;
    }
    return true;
  });

  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Smart Task Planner</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Organize priorities, set due dates, and accomplish your daily targets
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Progress Bar & Filter Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Overall Task Completion</span>
            <span>
              {completedCount} of {totalCount} completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-1 p-1 bg-[#fdfcfb] dark:bg-[#121814] border border-[#e8f0e8] dark:border-[#2a3b2f] rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setActiveFilter('today')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeFilter === 'today'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Today's Tasks ({todayCount})
            </button>
            <button
              onClick={() => setActiveFilter('upcoming')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeFilter === 'upcoming'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Upcoming Tasks ({upcomingCount})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Completed Tasks ({completedCount})
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Task Cards List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No tasks in this view</p>
            <p className="text-xs text-slate-400">
              {activeFilter === 'completed'
                ? 'Complete some tasks to see them logged here!'
                : 'Click "+ Add New Task" to create a task.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#1a201c] border border-[#e8f0e8] dark:border-[#2a3b2f] shadow-xs hover:border-emerald-500/40 transition flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  className="w-5 h-5 mt-0.5 rounded text-emerald-600 focus:ring-emerald-600 cursor-pointer shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <h3
                    className={`text-sm font-bold ${
                      task.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{task.dueDate}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] px-2.5 py-1 rounded-lg font-extrabold ${
                    task.priority === 'High'
                      ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                      : task.priority === 'Medium'
                      ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {task.priority} Priority
                </span>

                <button
                  onClick={() => handleOpenEditModal(task)}
                  className="p-2 rounded-xl hover:bg-[#fdfcfb] dark:hover:bg-[#121814] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                  title="Edit Task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#1a201c] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e8f0e8] dark:border-[#2a3b2f] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8f0e8] dark:border-[#2a3b2f]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingTaskId ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete Chemistry Assignment 3"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details or guidelines..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e8f0e8] dark:border-[#2a3b2f] bg-[#fdfcfb] dark:bg-[#121814] text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-[#fdfcfb] dark:hover:bg-[#121814] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
                >
                  {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{saving ? 'Saving...' : editingTaskId ? 'Save Changes' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
