const express = require('express');
const cors = require('cors');
require('./database');  
const Task = require('./models/task');  


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/tasks', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  try {
      const query = search
          ? { tarea: { $regex: search, $options: 'i' } }  
          : {};  
      const tasks = await Task.find(query)
                              .skip(skip)
                              .limit(limit)
                              .sort({ fecha_de_creacion: -1 });
      const total = await Task.countDocuments(query);  
      res.json({ tasks, total });
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

app.get('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'ID de tarea no válido' });
  }

  try {
      const task = await Task.findById(taskId);
      if (!task) {
          return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      res.json(task);
  } catch (error) {
      console.error('Error al obtener la tarea:', error);
      res.status(500).json({ message: 'Error al obtener la tarea' });
  }
});
app.get('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'ID de tarea no válido' });
  }

  try {
      const task = await Task.findById(taskId);
      if (!task) {
          return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      res.json(task);
  } catch (error) {
      console.error('Error al obtener la tarea:', error);
      res.status(500).json({ message: 'Error al obtener la tarea' });
  }
});

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

app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;  
  const { estado } = req.body;  

  try {
      const task = await Task.findByIdAndUpdate(id, { estado }, { new: true }); 

      if (!task) {
          return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      res.json({ message: 'Tarea actualizada correctamente', task });
  } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
});
const mongoose = require('mongoose');

app.get('/tasks/:taskId', (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ error: 'ID de tarea no válido' });
    }

});

app.patch('/task/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const newTarea = req.body.tarea;  

  try {
      const task = await Task.findByIdAndUpdate(taskId, 
          { 
              tarea: newTarea    
          }, 
          { new: true }  
      );

      if (!task) {
          return res.status(404).send('Tarea no encontrada');
      }
      res.status(200).send(task);  
  } catch (error) {
      console.error('Error al actualizar la tarea:', error);  
      res.status(500).send('Error en la actualización');
  }
});

app.delete('/tasks/delete/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: 'ID de tarea no válido' });
  }
  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json({ message: 'Tarea eliminada exitosamente', task });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
