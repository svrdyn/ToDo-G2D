import { Todo } from '../types';

interface TodoState {
  todos: Todo[];
  timestamp: number;
}

class TodoHistory {
  private states: TodoState[] = [];
  private currentIndex: number = -1;
  private maxStates: number = 50; // Maximum number of states to keep in history

  constructor() {
    this.states = [];
    this.currentIndex = -1;
  }

  push(todos: Todo[]) {
    // Remove any future states if we're not at the end
    this.states = this.states.slice(0, this.currentIndex + 1);
    
    // Add new state
    this.states.push({
      todos: JSON.parse(JSON.stringify(todos)), // Deep clone
      timestamp: Date.now()
    });
    
    // Remove oldest states if we exceed maxStates
    if (this.states.length > this.maxStates) {
      this.states.shift();
    } else {
      this.currentIndex++;
    }
  }

  undo(): Todo[] | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return JSON.parse(JSON.stringify(this.states[this.currentIndex].todos));
    }
    return null;
  }

  redo(): Todo[] | null {
    if (this.currentIndex < this.states.length - 1) {
      this.currentIndex++;
      return JSON.parse(JSON.stringify(this.states[this.currentIndex].todos));
    }
    return null;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.states.length - 1;
  }

  clear() {
    this.states = [];
    this.currentIndex = -1;
  }
}

export const todoHistory = new TodoHistory();