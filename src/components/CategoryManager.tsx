import React, { useState } from 'react';
import { Plus, X, GripVertical, Edit2 } from 'lucide-react';
import { Category } from '../types';
import { getContrastingTextColor } from '../utils/colorUtils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

function SortableCategory({ 
  category, 
  onDelete,
  onEdit 
}: { 
  category: Category; 
  onDelete: (id: string) => void;
  onEdit: (id: string, color: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editColor, setEditColor] = useState(category.color);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleColorChange = () => {
    onEdit(category.id, editColor);
    setIsEditing(false);
  };

  const textColor = getContrastingTextColor(category.color);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-white/5 rounded-lg p-3 mb-2"
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-navy-300" />
      </button>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={editColor}
            onChange={(e) => setEditColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <button
            onClick={handleColorChange}
            className="text-xs px-2 py-1 bg-gold-500 text-navy-900 rounded"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs px-2 py-1 bg-white/10 text-white rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-navy-300 hover:text-navy-200"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </>
      )}
      <span className="flex-grow text-white">{category.name}</span>
      <button
        onClick={() => onDelete(category.id)}
        className="text-red-400 hover:text-red-300 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export function CategoryManager({ categories, onCategoriesChange }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4F658F');
  const [isAdding, setIsAdding] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);

      onCategoriesChange(arrayMove(categories, oldIndex, newIndex));
    }
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      color: newCategoryColor,
    };

    onCategoriesChange([...categories, newCategory]);
    setNewCategoryName('');
    setNewCategoryColor('#4F658F');
    setIsAdding(false);
  };

  const deleteCategory = (id: string) => {
    onCategoriesChange(categories.filter((cat) => cat.id !== id));
  };

  const editCategoryColor = (id: string, color: string) => {
    onCategoriesChange(
      categories.map((cat) =>
        cat.id === id ? { ...cat, color } : cat
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Categories</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={addCategory} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="flex-grow px-3 py-2 bg-white/5 rounded-lg border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-gold-500"
          />
          <input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            className="w-12 h-10 rounded-lg cursor-pointer"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
        </form>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories.map((cat) => cat.id)}
          strategy={verticalListSortingStrategy}
        >
          {categories.map((category) => (
            <SortableCategory
              key={category.id}
              category={category}
              onDelete={deleteCategory}
              onEdit={editCategoryColor}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}