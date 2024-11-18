const mongoose = require('mongoose');

const dbURI = process.env.NODE_ENV === 'production'
  ? 'mongodb+srv://<jimenemishell3>:<123456M>@cluster0.mongodb.net/cuaderno?retryWrites=true&w=majority'  // Atlas URL
  : 'mongodb://localhost:27017/cuaderno';  

mongoose.connect(dbURI)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar con MongoDB:', err);
  });

module.exports = mongoose.connection;
