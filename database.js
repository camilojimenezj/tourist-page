const mongoose = require('mongoose')

mongoose
  .connect('mongodb://127.0.0.1:27017/tourist_login', {})
  .then((db) => console.log('Database is connected'))
  .catch((err) => console.error(err))
