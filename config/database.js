const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => {
        console.log(`MongoDB Connected : ${conn.connection.host}`);
      })
      .catch((err) => {
        console.log('Database connection error : ' + err);
      });
  }
}

module.exports = new Database();
