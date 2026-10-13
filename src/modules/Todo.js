// Factory function for creating todo objects.
// Keeping todos as plain data objects (no class methods) means there's
// nothing lost when they're saved to/loaded from localStorage as JSON.
const createTodo = ({
  id = Date.now().toString(36) + Math.random().toString(36).slice(2),
  title,
  description = '',
  dueDate = '',
  priority = 'low',
  notes = '',
  completed = false,
}) => ({
  id,
  title,
  description,
  dueDate,
  priority,
  notes,
  completed,
});

export default createTodo;
