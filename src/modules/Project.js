// Factory function for creating project objects.
// A project is just a name and a list of todos.
const createProject = (
  name,
  id = Date.now().toString(36) + Math.random().toString(36).slice(2)
) => ({
  id,
  name,
  todos: [],
});

export default createProject;
