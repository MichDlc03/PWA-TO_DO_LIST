require('dotenv').config();
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.log('Error al conectar con MongoDB:', err));
