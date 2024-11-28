import React, { useEffect, useState } from 'react';
import { ListTodo, Settings } from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { Todo, Category, TaskFilter } from './types';
import { TodoItem } from './components/TodoItem';
import { AddTodo } from './components/AddTodo';
import { TaskGroup } from './components/TaskGroup';
import { CategoryManager } from './components/CategoryManager';
import { TaskActions } from './components/TaskActions';
import { todoHistory } from './store/todoHistory';
import { getContrastingTextColor } from './utils/colorUtils';

const defaultCategories: Category[] = [
  { id: '1', name: 'High Priority', color: '#EF4444' },
  { id: '2', name: 'Medium Priority', color: '#F59E0B' },
  { id: '3', name: 'Low Priority', color: '#10B981' },
];

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    const initialTodos = saved ? JSON.parse(saved) : [];
    if (initialTodos.length > 0) {
      todoHistory.push(initialTodos);
    }
    return initialTodos;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('active');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    todoHistory.push(newTodos);
  };

  const addTodo = ({
    title,
    description,
    category,
    dueDate,
  }: {
    title: string;
    description?: string;
    category: string;
    dueDate?: string;
  }) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      category,
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    const newTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    );
    updateTodos(newTodos);
  };

  const editTodo = (updatedTodo: Todo) => {
    const newTodos = todos.map((todo) =>
      todo.id === updatedTodo.id
        ? { ...updatedTodo, updatedAt: new Date().toISOString() }
        : todo
    );
    updateTodos(newTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    updateTodos(newTodos);
  };

  const handleUndo = () => {
    const previousTodos = todoHistory.undo();
    if (previousTodos) {
      setTodos(previousTodos);
    }
  };

  const handleRedo = () => {
    const nextTodos = todoHistory.redo();
    if (nextTodos) {
      setTodos(nextTodos);
    }
  };

  const clearCompletedTasks = () => {
    const newTodos = todos.filter((todo) => !todo.completed);
    updateTodos(newTodos);
  };

  const clearAllTasks = () => {
    updateTodos([]);
  };

  const filteredTodos = todos.filter((todo) => {
    const categoryMatch = selectedCategory === 'all' ? true : todo.category === selectedCategory;
    const completionMatch = taskFilter === 'all' ? true : taskFilter === 'completed' ? todo.completed : !todo.completed;
    return categoryMatch && completionMatch;
  });

  const hasCompletedTasks = todos.some((todo) => todo.completed);
  const hasTasks = todos.length > 0;

  const groupTodosByDate = (todos: Todo[]) => {
    const groups: { [key: string]: Todo[] } = {
      overdue: [],
      today: [],
      tomorrow: [],
      upcoming: [],
      noDate: [],
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    todos.forEach((todo) => {
      if (!todo.dueDate) {
        groups.noDate.push(todo);
        return;
      }

      const dueDate = parseISO(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (isToday(dueDate)) {
        groups.today.push(todo);
      } else if (isTomorrow(dueDate)) {
        groups.tomorrow.push(todo);
      } else if (dueDate < now) {
        groups.overdue.push(todo);
      } else {
        groups.upcoming.push(todo);
      }
    });

    return groups;
  };

  const groupedTodos = groupTodosByDate(filteredTodos);

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || '#4F658F';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-800 to-navy-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <ListTodo className="w-10 h-10 text-gold-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">Elegant Tasks</h1>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings ? 'bg-gold-500 text-navy-900' : 'text-white hover:bg-white/10'
            }`}
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {showSettings ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl mb-6">
            <CategoryManager
              categories={categories}
              onCategoriesChange={setCategories}
            />
          </div>
        ) : (
          <>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
              <AddTodo categories={categories} onAdd={addTodo} />

              <TaskActions
                onUndo={handleUndo}
                onRedo={handleRedo}
                onClearCompleted={clearCompletedTasks}
                onClearAll={clearAllTasks}
                canUndo={todoHistory.canUndo()}
                canRedo={todoHistory.canRedo()}
                hasCompletedTasks={hasCompletedTasks}
                hasTasks={hasTasks}
              />

              <div className="mt-8 mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-gold-500 text-navy-900'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => {
                  const textColor = getContrastingTextColor(category.color);
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        selectedCategory === category.id
                          ? 'bg-opacity-100'
                          : 'bg-opacity-10 hover:bg-opacity-20'
                      }`}
                      style={{
                        backgroundColor: category.color,
                        color: textColor,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </button>
                  );
                })}
              </div>

              <div className="mb-6 flex gap-2 border-b border-white/10 pb-4">
                <button
                  onClick={() => setTaskFilter('active')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    taskFilter === 'active'
                      ? 'bg-emerald-500 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setTaskFilter('completed')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    taskFilter === 'completed'
                      ? 'bg-purple-500 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    taskFilter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  All Tasks
                </button>
              </div>

              <div className="space-y-6">
                {groupedTodos.overdue.length > 0 && (
                  <TaskGroup
                    title="Overdue"
                    todos={groupedTodos.overdue}
                    onToggle={toggleTodo}
                    onEdit={editTodo}
                    onDelete={deleteTodo}
                    accentColor="text-red-500"
                    getCategoryColor={getCategoryColor}
                  />
                )}
                
                {groupedTodos.today.length > 0 && (
                  <TaskGroup
                    title="Today"
                    todos={groupedTodos.today}
                    onToggle={toggleTodo}
                    onEdit={editTodo}
                    onDelete={deleteTodo}
                    accentColor="text-gold-500"
                    getCategoryColor={getCategoryColor}
                  />
                )}

                {groupedTodos.tomorrow.length > 0 && (
                  <TaskGroup
                    title="Tomorrow"
                    todos={groupedTodos.tomorrow}
                    onToggle={toggleTodo}
                    onEdit={editTodo}
                    onDelete={deleteTodo}
                    accentColor="text-navy-300"
                    getCategoryColor={getCategoryColor}
                  />
                )}

                {groupedTodos.upcoming.length > 0 && (
                  <TaskGroup
                    title="Upcoming"
                    todos={groupedTodos.upcoming}
                    onToggle={toggleTodo}
                    onEdit={editTodo}
                    onDelete={deleteTodo}
                    accentColor="text-navy-400"
                    getCategoryColor={getCategoryColor}
                  />
                )}

                {groupedTodos.noDate.length > 0 && (
                  <TaskGroup
                    title="No Due Date"
                    todos={groupedTodos.noDate}
                    onToggle={toggleTodo}
                    onEdit={editTodo}
                    onDelete={deleteTodo}
                    accentColor="text-gray-400"
                    getCategoryColor={getCategoryColor}
                  />
                )}

                {Object.values(groupedTodos).every((group) => group.length === 0) && (
                  <div className="text-center py-8 text-white/60">
                    No tasks found. Add one above to get started!
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;