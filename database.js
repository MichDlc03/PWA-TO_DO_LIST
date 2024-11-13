// database.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cuaderno')
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar con MongoDB:', err);
  });

module.exports = mongoose.connection;
