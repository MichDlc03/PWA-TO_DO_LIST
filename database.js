const mongoose = require('mongoose');

const dbURI = process.env.NODE_ENV === 'production'
  ? 'mongodb+srv://jimenemishell3:pwa.pwa@pwacluster-shard-00-00.a2vla.mongodb.net:27017,pwacluster-shard-00-01.a2vla.mongodb.net:27017,pwacluster-shard-00-02.a2vla.mongodb.net:27017/cuaderno?retryWrites=true&w=majority'
  : 'mongodb://localhost:27017/cuaderno';  

mongoose.connect(dbURI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
  })
  .catch(err => {
    console.error('Error al conectar con MongoDB Atlas:', err.message);
  });

module.exports = mongoose.connection;
