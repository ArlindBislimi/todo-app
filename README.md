# Todo List (The Odin Project)

## Setup

```
npm install
npm start        # dev server, opens in browser
npm run build     # production build into /dist
```

## Structure

```
src/
  index.js               entry point — imports CSS, boots DOMController
  index.html              webpack template, contains the static skeleton
  styles.css
  modules/
    Todo.js               factory function -> plain todo object
    Project.js             factory function -> plain project object
    ProjectManager.js      ALL application logic + localStorage. No DOM code.
    DOMController.js       ALL DOM rendering + event listeners. No data logic
                            — it only ever calls into ProjectManager.
```

## Why plain objects instead of classes?

Todos and Projects are created with simple factory functions and stored as
plain data (no methods attached to them). That sidesteps the classic
"localStorage strips out functions" problem entirely — there's nothing to
lose when `JSON.stringify`/`JSON.parse` runs, so nothing needs to be
reconstructed after loading. All the actual behavior (adding, editing,
deleting, toggling complete) lives in `ProjectManager.js` as functions that
take an object and mutate it.

## Features

- Multiple projects, each with its own todo list (a "Default" project is
  created automatically on first run).
- Add / edit / delete todos, with title, description, due date, priority,
  and notes.
- Priority shown as a color-coded left border (green/orange/red).
- Click a todo to expand it in a modal and edit any field.
- Mark todos complete via checkbox.
- Everything persists to `localStorage` automatically after every change,
  and is safely reloaded (or defaulted) on page refresh.
- Dates are formatted with `date-fns`.
