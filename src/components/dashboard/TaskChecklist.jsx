import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';

export default function TaskChecklist({ initialTasks = [] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskText, setNewTaskText] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskText.trim(),
      tag: 'Action Item',
      tagColor: 'bg-indigo-100 text-indigo-700',
      dueDate: 'Today',
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
    setShowAddInput(false);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-slate-700">Tasks this Week</h4>
        <button
          onClick={() => setShowAddInput(!showAddInput)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
        >
          <Plus className="w-3 h-3" />
          <span>Add</span>
        </button>
      </div>

      {showAddInput && (
        <form onSubmit={handleAddTask} className="mb-3 flex items-center space-x-1.5">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="New task..."
            className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
          >
            Save
          </button>
        </form>
      )}

      <div className="flex flex-col space-y-2.5 overflow-y-auto max-h-[160px] pr-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-start justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-start space-x-2.5 flex-1 min-w-0">
              <div
                className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                  task.completed
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-300 group-hover:border-slate-400 bg-white'
                }`}
              >
                {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="flex flex-col min-w-0 pr-2">
                <span
                  className={`text-xs font-medium leading-tight truncate ${
                    task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${task.tagColor}`}>
                    {task.tag}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-medium shrink-0 mt-0.5">{task.dueDate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
