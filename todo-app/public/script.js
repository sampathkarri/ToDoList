document.getElementById('todo-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Capture values BEFORE reset
  const task = document.getElementById('task-input').value.trim();
  const due_date = document.getElementById('due-date').value || null;
  const priority = document.getElementById('priority').value;

  console.log({ task, due_date, priority }); // Debug log

  if (task) {
    await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, due_date, priority })
    });

    document.getElementById('todo-form').reset();
    loadTodos();
  }
});

async function loadTodos() {
  const res = await fetch('/todos');
  const todos = await res.json();
  const list = document.getElementById('todo-list');
  list.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'p-3 bg-gray-50 border rounded flex justify-between items-center';
    li.innerHTML = `
      <div>
        <p class="font-medium ${todo.completed ? 'line-through text-gray-400' : ''}">${todo.task}</p>
        <small class="text-gray-500">
          Due: ${todo.due_date ? new Date(todo.due_date).toLocaleDateString() : 'N/A'} |
          Priority: ${todo.priority || 'N/A'}
        </small>
      </div>
      <div class="flex gap-2">
        <button onclick="toggleComplete(${todo.id})" class="text-blue-500 hover:text-blue-700">${todo.completed ? '✅' : '✔️'}</button>
        <button onclick="deleteTodo(${todo.id})" class="text-red-500 hover:text-red-700">🗑️</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function deleteTodo(id) {
  await fetch('/todos/' + id, { method: 'DELETE' });
  loadTodos();
}

async function toggleComplete(id) {
  await fetch('/todos/' + id + '/complete', { method: 'PATCH' });
  loadTodos();
}

// Load todos on page load
loadTodos();
