const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  tarea: { type: String, required: true },
  estado: { type: String, enum: ['pendiente', 'en progreso', 'completada'], required: true },
  fecha_de_creacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', tareaSchema, 'tasks');
