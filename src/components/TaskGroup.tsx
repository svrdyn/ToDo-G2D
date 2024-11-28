import React from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';

interface TaskGroupProps {
  title: string;
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  accentColor: string;
  getCategoryColor: (categoryId: string) => string;
}

export function TaskGroup({
  title,
  todos,
  onToggle,
  onEdit,
  onDelete,
  accentColor,
  getCategoryColor,
}: TaskGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className={`text-lg font-semibold ${accentColor}`}>{title}</h3>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          categoryColor={getCategoryColor(todo.category)}
        />
      ))}
    </div>
  );
}