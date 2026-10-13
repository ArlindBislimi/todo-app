import createProject from './Project';
import createTodo from './Todo';

const STORAGE_KEY = 'todoAppData';

// Module pattern: everything below is application logic only.
// It knows nothing about the DOM.
const ProjectManager = (() => {
  let projects = [];
  let activeProjectId = null;

  const save = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ projects, activeProjectId })
    );
  };

  const load = () => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        const data = JSON.parse(raw);
        projects = data.projects || [];
        activeProjectId = data.activeProjectId || null;
      } catch (e) {
        // Corrupted or unreadable data - start fresh instead of crashing.
        projects = [];
        activeProjectId = null;
      }
    }

    // First run (or nothing usable was in storage): create a default project.
    if (projects.length === 0) {
      const defaultProject = createProject('Default');
      projects.push(defaultProject);
      activeProjectId = defaultProject.id;
      save();
    }

    // Guard against a stale/missing activeProjectId.
    if (!projects.some((p) => p.id === activeProjectId)) {
      activeProjectId = projects[0].id;
    }
  };

  const getProjects = () => projects;

  const getActiveProject = () =>
    projects.find((p) => p.id === activeProjectId);

  const setActiveProject = (id) => {
    activeProjectId = id;
    save();
  };

  const addProject = (name) => {
    const project = createProject(name);
    projects.push(project);
    save();
    return project;
  };

  const deleteProject = (id) => {
    if (projects.length === 1) return; // always keep at least one project

    projects = projects.filter((p) => p.id !== id);

    if (activeProjectId === id) {
      activeProjectId = projects[0].id;
    }

    save();
  };

  const addTodo = (projectId, todoData) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    project.todos.push(createTodo(todoData));
    save();
  };

  const editTodo = (projectId, todoId, updates) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const todo = project.todos.find((t) => t.id === todoId);
    if (!todo) return;

    Object.assign(todo, updates);
    save();
  };

  const deleteTodo = (projectId, todoId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    project.todos = project.todos.filter((t) => t.id !== todoId);
    save();
  };

  const toggleTodoComplete = (projectId, todoId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const todo = project.todos.find((t) => t.id === todoId);
    if (!todo) return;

    todo.completed = !todo.completed;
    save();
  };

  return {
    load,
    getProjects,
    getActiveProject,
    setActiveProject,
    addProject,
    deleteProject,
    addTodo,
    editTodo,
    deleteTodo,
    toggleTodoComplete,
  };
})();

export default ProjectManager;
