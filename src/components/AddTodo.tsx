import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Category } from '../types';

interface AddTodoProps {
  categories: Category[];
  onAdd: (todo: {
    title: string;
    description?: string;
    category: string;
    dueDate?: string;
  }) => void;
}

export function AddTodo({ categories, onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setShowDetails(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white placeholder-white/50"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-white/70 hover:text-white flex items-center gap-1 font-medium"
        >
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showDetails ? 'Hide Details' : 'Add Details'}
        </button>
      </div>

      {showDetails && (
        <div className="space-y-4 p-4 bg-white/10 rounded-lg border border-white/10">
          <div className="space-y-2">
            <label className="block text-sm text-white/70 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 min-h-[100px] resize-y text-white placeholder-white/50"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-white/70 mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-navy-800 text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm text-white/70 mb-1 font-medium">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-white [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}