const app = require('./app');
require('dotenv').config();

const Database = require('./config/database');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, ()=> {
    console.log(`Server running in ${process.env.MODE} on port ${process.env.PORT}` );
})


process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server and exit process
    server.close(() => process.exit(1));
  });
  