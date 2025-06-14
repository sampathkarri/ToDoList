const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err.message);
    res.status(500).send('Server Error');
  }
});

// Add new todo
app.post('/todos', async (req, res) => {
  try {
    const { task, due_date, priority } = req.body;

    console.log('📝 Received:', { task, due_date, priority }); // Debug log

    await pool.query(
      'INSERT INTO todos (task, due_date, priority) VALUES ($1, $2, $3)',
      [task, due_date || null, priority || 'Low']
    );

    res.sendStatus(201);
  } catch (err) {
    console.error('Error adding todo:', err.message);
    res.status(500).send('Server Error');
  }
});

// Toggle completion
app.patch('/todos/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE todos SET completed = NOT completed WHERE id = $1', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error toggling complete:', err.message);
    res.status(500).send('Server Error');
  }
});

// Delete todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error deleting todo:', err.message);
    res.status(500).send('Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
