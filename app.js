const express = require('express');
const cors = require('cors');
require('./database');  // Importa la conexión a la base de datos
const Task = require('./models/task');  // Importa el modelo Task

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Ruta para obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Error al obtener tareas');
  }
});

// Ruta para crear una nueva tarea
app.post('/tasks', async (req, res) => {
  const { tarea, estado } = req.body;

  const nuevaTarea = new Task({
    tarea,
    estado,
  });

  try {
    await nuevaTarea.save();
    res.status(201).json({ message: 'Tarea agregada exitosamente', tarea: nuevaTarea });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar tarea' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
