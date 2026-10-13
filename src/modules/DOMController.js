import { format, parseISO, isValid } from 'date-fns';
import ProjectManager from './ProjectManager';

const sidebarEl = document.getElementById('sidebar');
const todoListEl = document.getElementById('todo-list');
const activeProjectTitleEl = document.getElementById('active-project-title');
const modalEl = document.getElementById('modal');
const modalTitleEl = document.getElementById('modal-title');
const formEl = document.getElementById('todo-form');

let editingTodoId = null; // null = we are creating a new todo, not editing

const formatDueDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = parseISO(dateString);
  return isValid(date) ? format(date, 'MMM d, yyyy') : 'No due date';
};

const renderSidebar = () => {
  sidebarEl.innerHTML = '';
  const projects = ProjectManager.getProjects();
  const activeProject = ProjectManager.getActiveProject();

  projects.forEach((project) => {
    const item = document.createElement('div');
    item.classList.add('project-item');
    if (project.id === activeProject.id) item.classList.add('active');

    // Click listener lives on the whole row, not just the text, so the
    // entire item is a clickable target (not just the letters of the name).
    item.addEventListener('click', () => {
      ProjectManager.setActiveProject(project.id);
      render();
    });

    const nameSpan = document.createElement('span');
    nameSpan.textContent = project.name;
    item.appendChild(nameSpan);

    // Don't allow deleting the very last remaining project.
    if (projects.length > 1) {
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.classList.add('delete-project-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // don't also trigger the row's click (switching project)
        if (confirm(`Delete project "${project.name}"?`)) {
          ProjectManager.deleteProject(project.id);
          render();
        }
      });
      item.appendChild(deleteBtn);
    }

    sidebarEl.appendChild(item);
  });
};

const renderTodos = () => {
  todoListEl.innerHTML = '';
  const activeProject = ProjectManager.getActiveProject();
  activeProjectTitleEl.textContent = activeProject.name;

  if (activeProject.todos.length === 0) {
    todoListEl.innerHTML = '<p class="empty-message">No todos yet. Add one!</p>';
    return;
  }

  activeProject.todos.forEach((todo) => {
    const item = document.createElement('div');
    item.classList.add('todo-item', `priority-${todo.priority}`);
    if (todo.completed) item.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      ProjectManager.toggleTodoComplete(activeProject.id, todo.id);
      render();
    });

    const info = document.createElement('div');
    info.classList.add('todo-info');
    info.innerHTML = `
      <span class="todo-title">${todo.title}</span>
      <span class="todo-date">${formatDueDate(todo.dueDate)}</span>
    `;
    info.addEventListener('click', () => openModal(todo));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-todo-btn');
    deleteBtn.addEventListener('click', () => {
      ProjectManager.deleteTodo(activeProject.id, todo.id);
      render();
    });

    item.append(checkbox, info, deleteBtn);
    todoListEl.appendChild(item);
  });
};

const openModal = (todo = null) => {
  editingTodoId = todo ? todo.id : null;
  formEl.reset();
  modalTitleEl.textContent = todo ? 'Edit Todo' : 'New Todo';

  if (todo) {
    formEl.title.value = todo.title;
    formEl.description.value = todo.description;
    formEl.dueDate.value = todo.dueDate;
    formEl.priority.value = todo.priority;
    formEl.notes.value = todo.notes;
  }

  modalEl.classList.remove('hidden');
};

const closeModal = () => {
  modalEl.classList.add('hidden');
  editingTodoId = null;
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const activeProject = ProjectManager.getActiveProject();

  const todoData = {
    title: formEl.title.value.trim(),
    description: formEl.description.value.trim(),
    dueDate: formEl.dueDate.value,
    priority: formEl.priority.value,
    notes: formEl.notes.value.trim(),
  };

  if (!todoData.title) return;

  if (editingTodoId) {
    ProjectManager.editTodo(activeProject.id, editingTodoId, todoData);
  } else {
    ProjectManager.addTodo(activeProject.id, todoData);
  }

  closeModal();
  render();
};

const render = () => {
  renderSidebar();
  renderTodos();
};

const bindEvents = () => {
  document.getElementById('add-todo-btn').addEventListener('click', () => openModal());

  document.getElementById('add-project-btn').addEventListener('click', () => {
    const name = prompt('Project name:');
    if (name && name.trim()) {
      ProjectManager.addProject(name.trim());
      render();
    }
  });

  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal(); // click outside the box closes it
  });

  formEl.addEventListener('submit', handleFormSubmit);
};

const init = () => {
  ProjectManager.load();
  bindEvents();
  render();
};

export default { init };