import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Check, Clock, Edit2, Trash2, Calendar, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  categoryColor: string;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete, categoryColor }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description || '');
  const [editedDueDate, setEditedDueDate] = useState(todo.dueDate || '');
  const [showPostpone, setShowPostpone] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedTitle.trim()) return;
    onEdit({ 
      ...todo, 
      title: editedTitle.trim(),
      description: editedDescription.trim() || undefined,
      dueDate: editedDueDate || undefined
    });
    setIsEditing(false);
  };

  const handlePostpone = (days: number) => {
    const currentDate = todo.dueDate ? new Date(todo.dueDate) : new Date();
    const newDate = addDays(currentDate, days);
    onEdit({
      ...todo,
      dueDate: newDate.toISOString().split('T')[0],
      note: `Postponed by ${days} days`
    });
    setShowPostpone(false);
  };

  return (
    <div className="group bg-navy-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all space-y-3">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(todo.id)}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
          style={{
            borderColor: categoryColor,
            backgroundColor: todo.completed ? categoryColor : 'transparent',
          }}
        >
          {todo.completed && <Check className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-grow">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 text-navy-900"
                style={{ borderColor: categoryColor, ringColor: categoryColor }}
                autoFocus
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add description..."
                className="w-full px-3 py-2 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 min-h-[100px] resize-y text-navy-900"
                style={{ borderColor: categoryColor, ringColor: categoryColor }}
              />
              <input
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 text-navy-900"
                style={{ borderColor: categoryColor, ringColor: categoryColor }}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-navy-200 text-navy-800 rounded-lg hover:bg-navy-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span
                  className={`text-lg font-medium ${
                    todo.completed ? 'line-through text-navy-400' : 'text-navy-900'
                  }`}
                >
                  {todo.title}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 hover:bg-navy-100 rounded-lg transition-colors"
                    style={{ color: categoryColor }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {(todo.description || todo.dueDate || todo.note) && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1 text-sm text-navy-600 hover:text-navy-800 mt-2 font-medium"
                >
                  {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {!isEditing && showDetails && (
        <div className="pl-10 space-y-3">
          {todo.description && (
            <p className="text-navy-700 whitespace-pre-wrap bg-navy-100/50 p-3 rounded-lg">
              {todo.description}
            </p>
          )}
          
          {todo.dueDate && (
            <div className="flex items-center gap-4">
              <span className="flex items-center text-sm text-navy-600 bg-navy-100/50 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 mr-1.5" />
                {format(new Date(todo.dueDate), 'MMM d, yyyy')}
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowPostpone(!showPostpone)}
                  className="flex items-center text-sm text-navy-600 hover:text-navy-800 bg-navy-100/50 px-3 py-1.5 rounded-lg"
                >
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Postpone
                </button>
                {showPostpone && (
                  <div className="absolute left-0 mt-1 bg-white rounded-lg shadow-lg border border-navy-200 py-1 z-10">
                    {[1, 3, 7].map((days) => (
                      <button
                        key={days}
                        onClick={() => handlePostpone(days)}
                        className="flex items-center w-full px-4 py-2 text-sm text-navy-700 hover:bg-navy-50"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        {days} day{days > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {todo.note && (
            <p className="text-sm text-navy-600 italic bg-navy-100/50 px-3 py-1.5 rounded-lg">
              {todo.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}