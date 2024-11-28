import React from 'react';
import { Undo2, Redo2, Trash2, RotateCcw } from 'lucide-react';

interface TaskActionsProps {
  onUndo: () => void;
  onRedo: () => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasCompletedTasks: boolean;
  hasTasks: boolean;
}

export function TaskActions({
  onUndo,
  onRedo,
  onClearCompleted,
  onClearAll,
  canUndo,
  canRedo,
  hasCompletedTasks,
  hasTasks,
}: TaskActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          canUndo
            ? 'bg-navy-600 text-white hover:bg-navy-700'
            : 'bg-navy-300 text-navy-500 cursor-not-allowed'
        }`}
        title="Undo last action"
      >
        <Undo2 className="w-4 h-4" />
        Undo
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          canRedo
            ? 'bg-navy-600 text-white hover:bg-navy-700'
            : 'bg-navy-300 text-navy-500 cursor-not-allowed'
        }`}
        title="Redo last undone action"
      >
        <Redo2 className="w-4 h-4" />
        Redo
      </button>

      <div className="flex-grow"></div>

      <button
        onClick={onClearCompleted}
        disabled={!hasCompletedTasks}
        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          hasCompletedTasks
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-red-300 text-red-500 cursor-not-allowed'
        }`}
        title="Clear completed tasks"
      >
        <RotateCcw className="w-4 h-4" />
        Clear Completed
      </button>

      <button
        onClick={() => {
          if (window.confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
            onClearAll();
          }
        }}
        disabled={!hasTasks}
        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          hasTasks
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-red-300 text-red-500 cursor-not-allowed'
        }`}
        title="Delete all tasks"
      >
        <Trash2 className="w-4 h-4" />
        Delete All
      </button>
    </div>
  );
}