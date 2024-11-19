const mongoose = require('mongoose');

const dbURI = process.env.NODE_ENV === 'production'
  ? 'mongodb+srv://jimenemishell3:pwa.pwa@pwacluster.a2vla.mongodb.net/?retryWrites=true&w=majority&appName=PWACluster'
  : 'mongodb://localhost:27017/cuaderno';  

mongoose.connect(dbURI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
  })
  .catch(err => {
    console.error('Error al conectar con MongoDB Atlas:', err.message);
  });

module.exports = mongoose.connection;
